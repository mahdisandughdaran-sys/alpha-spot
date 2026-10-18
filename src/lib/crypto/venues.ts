import { candidateBases } from "./exclusions.ts";
import { msg } from "@/lib/i18n/lex";

export const VENUES = ["binance", "bybit"] as const;
export type VenueId = (typeof VENUES)[number];
export type QuoteCcy = "USDT" | "IRT";
export type VenueAction = "probe" | "preview" | "place";
export type VenueSide = "BUY" | "SELL";

export const VENUE_LABEL: Record<VenueId, string> = {
  binance: msg("بایننس", "Binance"),
  bybit: msg("بای‌بیت", "Bybit"),
};

export type VenueCall = {
  action: VenueAction;
  venue: VenueId;
  key: string;
  secret: string;
  symbol: string;
  side: VenueSide;
  notionalUsd: number;
  priceUsd: number;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  confirm: string;
};

export type PlannedOrder = {
  venue: VenueId;
  summary: string;
  method: "POST";
  path: string;
  body: Record<string, unknown> | null;
  query: string | null;
  baseQty: number;
};

export type VenueBalance = { asset: string; amount: string };

export type VenueResult = {
  ok: boolean;
  action: VenueAction;
  detail: string;
  balances: VenueBalance[];
  orderId: string | null;
  planned: string;
};

const MAX_NOTIONAL = 50_000;

export function isVenue(value: string): value is VenueId {
  return (VENUES as readonly string[]).includes(value);
}

export function money(n: number, digits: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  const fixed = n.toFixed(digits);
  return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function clientId(now = Date.now()): string {
  return `as${now.toString(36)}`.replace(/[^a-z0-9]/g, "").slice(0, 20);
}

export function venueBase(venue: VenueId, symbol: string): string {
  const upper = symbol.toUpperCase();
  if (venue === "binance" || venue === "bybit") return candidateBases(upper)[0] ?? upper;
  return upper;
}

export function assertSized(input: {
  symbol: string;
  notionalUsd: number;
  priceUsd: number;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  venue: VenueId;
}): { symbol: string; qty: number; notional: number } {
  const symbol = input.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z0-9]{2,15}$/.test(symbol)) throw new Error(msg("نماد نامعتبر است.", "The ticker is invalid."));
  if (!(input.priceUsd > 0)) throw new Error(msg("قیمت دلار این نماد در تحلیل نیست.", "This ticker has no USD price in the analysis."));
  const notional = Number(input.notionalUsd);
  if (!(notional >= 5) || notional > MAX_NOTIONAL) {
    throw new Error(msg("حجم هر سفارش باید بین ۵ و ۵۰٬۰۰۰ دلار باشد.", "Each order must be between 5 and 50,000 dollars."));
  }
  if (
    input.quote === "IRT"
  ) {
    throw new Error(msg("این میز فقط بازار تتر را مستقیم ثبت می‌کند.", "This desk posts the USDT market only."));
  }
  const qty = Math.floor((notional / input.priceUsd) * 1e6) / 1e6;
  if (!(qty > 0)) throw new Error(msg("حجم پایه صفر شد.", "Base size rounded to zero."));
  return { symbol, qty, notional };
}

export function planVenueOrder(
  input: VenueCall,
  now = Date.now(),
): PlannedOrder {
  const sized = assertSized(input);
  const base = venueBase(input.venue, sized.symbol);
  const id = clientId(now);
  const side = input.side === "SELL" ? "SELL" : "BUY";
  const qty = money(sized.qty, 6);

  if (input.venue === "binance") {
    const params = new URLSearchParams({
      symbol: `${base}USDT`,
      side,
      type: "MARKET",
      newClientOrderId: id,
    });
    if (side === "BUY") params.set("quoteOrderQty", money(sized.notional, 2));
    else params.set("quantity", qty);
    return {
      venue: input.venue,
      summary: msg(
        side === "BUY"
          ? `بایننس خرید مارکت ${money(sized.notional, 2)} تتر ${base}`
          : `بایننس فروش مارکت ${qty} ${base}`,
        side === "BUY"
          ? `Binance buy market ${money(sized.notional, 2)} USDT of ${base}`
          : `Binance sell market ${qty} ${base}`,
      ),
      method: "POST",
      path: "/api/v3/order",
      body: null,
      query: params.toString(),
      baseQty: sized.qty,
    };
  }

  const body = {
    category: "spot",
    symbol: `${base}USDT`,
    side: side === "BUY" ? "Buy" : "Sell",
    orderType: "Market",
    qty: side === "BUY" ? money(sized.notional, 2) : qty,
    marketUnit: side === "BUY" ? "quoteCoin" : "baseCoin",
    orderLinkId: id,
  };
  return {
    venue: input.venue,
    summary: msg(
      side === "BUY"
        ? `بای‌بیت خرید مارکت ${body.qty} تتر ${base}`
        : `بای‌بیت فروش مارکت ${qty} ${base}`,
      side === "BUY"
        ? `Bybit buy market ${body.qty} USDT of ${base}`
        : `Bybit sell market ${qty} ${base}`,
    ),
    method: "POST",
    path: "/v5/order/create",
    body,
    query: null,
    baseQty: sized.qty,
  };
}

export function bybitSignPayload(timestamp: string, apiKey: string, recvWindow: string, body: string): string {
  return `${timestamp}${apiKey}${recvWindow}${body}`;
}

export function redact(text: string, secrets: string[]): string {
  let out = text.replace(/\s+/g, " ").slice(0, 320);
  for (const secret of secrets) {
    const clean = secret.trim();
    if (clean.length >= 6) out = out.split(clean).join("•••");
  }
  return out;
}

export function normalizeVenueCall(input: VenueCall): VenueCall {
  if (!input || typeof input !== "object") throw new Error(msg("درخواست خالی است.", "The request is empty."));
  if (!isVenue(String(input.venue))) throw new Error(msg("صرافی نامعتبر است.", "The venue is invalid."));
  if (input.action !== "probe" && input.action !== "preview" && input.action !== "place") {
    throw new Error(msg("عملیات نامعتبر است.", "The action is invalid."));
  }
  return {
    action: input.action,
    venue: input.venue,
    key: String(input.key ?? "").slice(0, 400),
    secret: String(input.secret ?? "").slice(0, 400),
    symbol: String(input.symbol ?? "").slice(0, 20),
    side: input.side === "SELL" ? "SELL" : "BUY",
    notionalUsd: Number(input.notionalUsd) || 0,
    priceUsd: Number(input.priceUsd) || 0,
    quote: input.quote === "IRT" ? "IRT" : "USDT",
    tomanPerUsdt: Number(input.tomanPerUsdt) || 0,
    confirm: String(input.confirm ?? "").slice(0, 20),
  };
}

export function describePlan(plan: PlannedOrder): string {
  const wire = plan.body ? JSON.stringify(plan.body) : plan.query ?? "";
  return `${plan.summary}\n${plan.method} ${plan.path}\n${wire}`;
}
