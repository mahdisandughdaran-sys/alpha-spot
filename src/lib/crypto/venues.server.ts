import { createHmac, createPrivateKey, sign } from "node:crypto";
import {
  bybitSignPayload,
  describePlan,
  planVenueOrder,
  redact,
  type VenueBalance,
  type VenueCall,
  type VenueResult,
} from "./venues.ts";
import { msg } from "@/lib/i18n/lex";

const HOST: Record<VenueCall["venue"], string> = {
  binance: "api.binance.com",
  bybit: "api.bybit.com",
};

let lastPrivateAt = 0;

type HttpResult = { status: number; json: unknown; text: string };

function assertHost(host: string) {
  if (!Object.values(HOST).includes(host)) throw new Error(msg("میزبان مجاز نیست.", "The host is not allowed."));
}

async function request(
  host: string,
  path: string,
  init: { method: string; headers?: Record<string, string>; body?: string },
): Promise<HttpResult> {
  assertHost(host);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(`https://${host}${path}`, {
      method: init.method,
      redirect: "error",
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AlphaSpot/1.4",
        ...(init.body ? { "Content-Type": "application/json" } : {}),
        ...init.headers,
      },
      body: init.body,
    });
    const text = (await res.text()).slice(0, 8000);
    let json: unknown = null;
    try {
      json = JSON.parse(text) as unknown;
    } catch {
      json = null;
    }
    return { status: res.status, json, text };
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    throw new Error(
      aborted
        ? msg("صرافی در زمان مقرر جواب نداد.", "The venue did not answer in time.")
        : msg("ارتباط با صرافی برقرار نشد.", "Could not connect to the venue."),
    );
  } finally {
    clearTimeout(timer);
  }
}

function throttle() {
  const wait = 1200 - (Date.now() - lastPrivateAt);
  if (wait > 0) {
    return new Promise((resolve) => setTimeout(resolve, wait));
  }
  return Promise.resolve();
}

async function privateCall(
  host: string,
  path: string,
  init: { method: string; headers?: Record<string, string>; body?: string },
): Promise<HttpResult> {
  await throttle();
  lastPrivateAt = Date.now();
  return request(host, path, init);
}

export function signEd25519(privateKeyB64Url: string, message: string): string {
  const seed = Buffer.from(privateKeyB64Url.trim(), "base64url");
  if (seed.length !== 32) throw new Error(msg("کلید خصوصی باید ۳۲ بایت باشد.", "The private key must be 32 bytes."));
  const pkcs8 = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
  const key = createPrivateKey({ key: pkcs8, format: "der", type: "pkcs8" });
  return sign(null, Buffer.from(message), key).toString("base64url");
}

function hmac(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

function secretsOf(input: VenueCall): string[] {
  return [input.key, input.secret].filter((part) => part && part.trim().length >= 6);
}

function fail(input: VenueCall, detail: string, planned = ""): VenueResult {
  return {
    ok: false,
    action: input.action,
    detail: redact(detail, secretsOf(input)),
    balances: [],
    orderId: null,
    planned,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

export function pullBalances(payload: unknown): VenueBalance[] {
  const out: VenueBalance[] = [];
  const seen = new Set<string>();
  const push = (asset: unknown, amount: unknown) => {
    if (typeof asset !== "string") return;
    const n = Number(amount);
    if (!Number.isFinite(n) || n <= 0) return;
    const name = asset.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (name.length < 2 || name.length > 12) return;
    const id = `${name}:${n}`;
    if (seen.has(id)) return;
    seen.add(id);
    out.push({ asset: name, amount: String(amount) });
  };
  const fromRow = (row: Record<string, unknown>) => {
    push(
      row.currency ?? row.asset ?? row.coin,
      row.balance ?? row.available ?? row.free ?? row.value ?? row.walletBalance ?? row.amount,
    );
  };
  const visit = (value: unknown, depth: number) => {
    if (value == null || depth > 6) return;
    if (Array.isArray(value)) {
      for (const item of value) visit(item, depth + 1);
      return;
    }
    const row = asRecord(value);
    if (!row) return;
    fromRow(row);
    for (const key of ["balances", "wallets", "coins", "coin", "list", "result", "data"]) {
      if (row[key] && typeof row[key] === "object") visit(row[key], depth + 1);
    }
    for (const [key, val] of Object.entries(row)) {
      if (!/^[A-Za-z0-9]{2,10}$/.test(key)) continue;
      const inner = asRecord(val);
      if (!inner) continue;
      const amount = inner.value ?? inner.balance ?? inner.available ?? inner.free ?? inner.walletBalance;
      if (amount != null && inner.currency == null && inner.asset == null) push(key, amount);
    }
  };
  visit(payload, 0);
  return out.slice(0, 8);
}

function digId(value: unknown, depth = 0): string | null {
  if (!value || depth > 5) return null;
  const row = asRecord(value);
  if (!row) return null;
  const direct = row.orderId ?? row.order_id ?? row.id ?? row.clientOrderId ?? row.orderLinkId;
  if (typeof direct === "string" || typeof direct === "number") return String(direct);
  for (const key of ["order", "result", "data"]) {
    const found = digId(row[key], depth + 1);
    if (found) return found;
  }
  return null;
}

function accepted(res: HttpResult): boolean {
  if (res.status < 200 || res.status >= 300) return false;
  const row = asRecord(res.json);
  if (!row) return true;
  if (row.success === false || row.status === "failed" || row.status === "error") return false;
  if (typeof row.retCode === "number" && row.retCode !== 0) return false;
  if (typeof row.code === "number" && row.code !== 0 && row.code !== 200) return false;
  if (typeof row.code === "string" && row.code !== "0" && row.code !== "200") return false;
  return true;
}

async function probeBinance(input: VenueCall): Promise<VenueResult> {
  const timestamp = Date.now();
  const query = `timestamp=${timestamp}&recvWindow=5000`;
  const signature = hmac(input.secret.trim(), query);
  const res = await privateCall(HOST.binance, `/api/v3/account?${query}&signature=${signature}`, {
    method: "GET",
    headers: { "X-MBX-APIKEY": input.key.trim() },
  });
  if (!accepted(res)) return fail(input, msg(`بایننس موجودی را نداد. ${res.text}`, `Binance did not return balances. ${res.text}`));
  return {
    ok: true,
    action: "probe",
    detail: msg("اتصال بایننس برقرار شد. کلید روی سرور ذخیره نشد.", "Binance is connected. The key was not stored on the server."),
    balances: pullBalances(res.json),
    orderId: null,
    planned: "",
  };
}

async function probeBybit(input: VenueCall): Promise<VenueResult> {
  const timestamp = String(Date.now());
  const recv = "5000";
  const query = "accountType=UNIFIED";
  const payload = bybitSignPayload(timestamp, input.key.trim(), recv, query);
  const res = await privateCall(HOST.bybit, `/v5/account/wallet-balance?${query}`, {
    method: "GET",
    headers: {
      "X-BAPI-API-KEY": input.key.trim(),
      "X-BAPI-TIMESTAMP": timestamp,
      "X-BAPI-RECV-WINDOW": recv,
      "X-BAPI-SIGN": hmac(input.secret.trim(), payload),
    },
  });
  if (!accepted(res)) return fail(input, msg(`بای‌بیت موجودی را نداد. ${res.text}`, `Bybit did not return balances. ${res.text}`));
  return {
    ok: true,
    action: "probe",
    detail: msg("اتصال بای‌بیت برقرار شد. کلید روی سرور ذخیره نشد.", "Bybit is connected. The key was not stored on the server."),
    balances: pullBalances(res.json),
    orderId: null,
    planned: "",
  };
}

async function placeSigned(input: VenueCall): Promise<VenueResult> {
  const plan = planVenueOrder(input);
  const planned = describePlan(plan);
  if (input.venue === "binance" && plan.query) {
    const timestamp = Date.now();
    const query = `${plan.query}&recvWindow=5000&timestamp=${timestamp}`;
    const signature = hmac(input.secret.trim(), query);
    const res = await privateCall(HOST.binance, `${plan.path}?${query}&signature=${signature}`, {
      method: "POST",
      headers: { "X-MBX-APIKEY": input.key.trim() },
    });
    if (!accepted(res)) return fail(input, msg(`بایننس سفارش را نپذیرفت. ${res.text}`, `Binance rejected the order. ${res.text}`), planned);
    return placed(input, "سفارش بایننس ثبت شد.", "The Binance order was placed.", digId(res.json), planned);
  }
  if (input.venue === "bybit" && plan.body) {
    const body = JSON.stringify(plan.body);
    const timestamp = String(Date.now());
    const recv = "5000";
    const payload = bybitSignPayload(timestamp, input.key.trim(), recv, body);
    const res = await privateCall(HOST.bybit, plan.path, {
      method: "POST",
      headers: {
        "X-BAPI-API-KEY": input.key.trim(),
        "X-BAPI-TIMESTAMP": timestamp,
        "X-BAPI-RECV-WINDOW": recv,
        "X-BAPI-SIGN": hmac(input.secret.trim(), payload),
      },
      body,
    });
    if (!accepted(res)) return fail(input, msg(`بای‌بیت سفارش را نپذیرفت. ${res.text}`, `Bybit rejected the order. ${res.text}`), planned);
    return placed(input, "سفارش بای‌بیت ثبت شد.", "The Bybit order was placed.", digId(res.json), planned);
  }
  return fail(input, msg("سفارش ساخته نشد.", "The order was not built."), planned);
}

function placed(input: VenueCall, detail: string, detailEn: string, orderId: string | null, planned: string): VenueResult {
  return {
    ok: true,
    action: "place",
    detail: msg(
      orderId ? `${detail} شناسه ${orderId}.` : detail,
      orderId ? `${detailEn} Id ${orderId}.` : detailEn,
    ),
    balances: [],
    orderId,
    planned,
  };
}

function requireKey(input: VenueCall) {
  if (input.key.trim().length < 8) throw new Error(msg("کلید API را وارد کنید. روی سرور ذخیره نمی‌شود.", "Enter the API key. It is not stored on the server."));
  if ((input.venue === "binance" || input.venue === "bybit") && input.secret.trim().length < 8) {
    throw new Error(msg("کلید مخفی این صرافی لازم است.", "This venue requires the secret key."));
  }
}

export async function executeVenue(input: VenueCall): Promise<VenueResult> {
  if (input.action === "preview") {
    const plan = planVenueOrder(input);
    return {
      ok: true,
      action: "preview",
      detail: msg("پیش‌نمایش است. هیچ سفارشی به صرافی نرفت.", "This is a preview. No order was sent to the venue."),
      balances: [],
      orderId: null,
      planned: describePlan(plan),
    };
  }
  try {
    requireKey(input);
  } catch (err) {
    return fail(input, err instanceof Error ? err.message : msg("کلید ناقص است.", "The key is incomplete."));
  }
  if (input.action === "place" && input.confirm.trim().toUpperCase() !== input.symbol.trim().toUpperCase()) {
    return fail(input, msg("برای ثبت واقعی باید خود نماد را در کادر تأیید بنویسید.", "For a live order, type the ticker itself in the confirmation box."));
  }
  try {
    if (input.action === "probe") {
      if (input.venue === "binance") return await probeBinance(input);
      return await probeBybit(input);
    }
    return await placeSigned(input);
  } catch (err) {
    return fail(input, err instanceof Error ? err.message : msg("اجرای صرافی انجام نشد.", "The venue call did not finish."));
  }
}
