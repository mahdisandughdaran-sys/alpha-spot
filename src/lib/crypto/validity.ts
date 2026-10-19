import { msg } from "@/lib/i18n/lex";
import type { Horizon } from "./lens.ts";
import type { AnalysisResult, HorizonCall, SpotVerdict } from "./types.ts";

export const HORIZON_ORDER: Horizon[] = ["day", "week", "month"];

export const VALID_MS: Record<Horizon, number> = {
  day: 86_400_000,
  week: 7 * 86_400_000,
  month: 30 * 86_400_000,
};

const LOCK_KEY = "alpha-spot-call-lock-v1";

export function validUntilFrom(issuedAt: string, horizon: Horizon): string {
  const t = Date.parse(issuedAt);
  const base = Number.isFinite(t) ? t : Date.now();
  return new Date(base + VALID_MS[horizon]).toISOString();
}

export function callFromVerdict(verdict: SpotVerdict, horizon: Horizon, issuedAt: string): HorizonCall {
  const positioned = verdict.kind !== "cash" && verdict.symbol != null;
  return {
    horizon,
    kind: verdict.kind,
    symbol: positioned ? verdict.symbol : null,
    name: positioned ? verdict.name : null,
    priceUsd: positioned ? verdict.priceUsd : null,
    invalidationUsd: verdict.kind === "buy" ? verdict.invalidationUsd : null,
    reason: verdict.reason,
    issuedAt,
    validUntil: validUntilFrom(issuedAt, horizon),
    held: false,
    dissent: null,
  };
}

export function verdictFromCall(call: HorizonCall): SpotVerdict {
  return {
    kind: call.kind,
    symbol: call.symbol,
    name: call.name,
    priceUsd: call.priceUsd,
    reachUsd: null,
    invalidationUsd: call.invalidationUsd,
    reason: call.reason,
    horizon: call.horizon,
    validUntil: call.validUntil,
  };
}

export function cashCall(horizon: Horizon, issuedAt: string, reason: string): HorizonCall {
  return {
    horizon,
    kind: "cash",
    symbol: null,
    name: null,
    priceUsd: null,
    invalidationUsd: null,
    reason,
    issuedAt,
    validUntil: validUntilFrom(issuedAt, horizon),
    held: false,
    dissent: null,
  };
}

/** A published satellite campaign does not flip because the score moved. The structural book does. */
export function reconcileCall(
  stored: HorizonCall | null,
  fresh: HorizonCall,
  nowMs: number,
  livePrice: number | null,
): HorizonCall {
  if (!stored || stored.horizon !== fresh.horizon) return fresh;
  const until = Date.parse(stored.validUntil);
  const open = Number.isFinite(until) && nowMs < until;
  if (fresh.kind === "cash") return { ...fresh, held: false, dissent: null };
  if (
    open &&
    stored.kind === "buy" &&
    stored.symbol &&
    stored.symbol !== "BTC" &&
    stored.invalidationUsd != null &&
    livePrice != null &&
    livePrice > 0 &&
    livePrice < stored.invalidationUsd
  ) {
    return {
      ...fresh,
      kind: "stay",
      symbol: "BTC",
      name: "Bitcoin",
      priceUsd: fresh.symbol === "BTC" ? fresh.priceUsd : stored.priceUsd,
      invalidationUsd: stored.invalidationUsd,
      reason: msg(
        "کمپین آلت باطل شد چون قیمت از حد ابطال پایین‌تر رفت. هسته بیت‌کوین می‌ماند. این «هیچ‌چیز نخر» نیست.",
        "The alt campaign died because price crossed under invalidation. The Bitcoin core stays. This is not “buy nothing”.",
      ),
      held: false,
      dissent: null,
    };
  }
  if (open && stored.kind === "buy" && stored.symbol && stored.symbol !== "BTC") {
    if (fresh.kind === "buy" && fresh.symbol === stored.symbol) {
      return {
        ...stored,
        priceUsd: fresh.priceUsd ?? stored.priceUsd,
        held: true,
        dissent: null,
      };
    }
    return {
      ...stored,
      held: true,
      dissent: msg(
        "امتیاز یا نام پیشنهادی جابه‌جا شد، ولی کمپین باز تا ابطال، شکست ساختار هفتگی، یا کلید قطع عوض نمی‌شود.",
        "The score or the suggested name moved, but the open campaign does not change until invalidation, a weekly structure break, or the kill switch.",
      ),
    };
  }
  return { ...fresh, held: false, dissent: null };
}

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readLocks(): Record<string, HorizonCall[]> {
  if (!canStore()) return {};
  try {
    const raw = localStorage.getItem(LOCK_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, HorizonCall[]>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeLocks(store: Record<string, HorizonCall[]>) {
  if (!canStore()) return;
  try {
    localStorage.setItem(LOCK_KEY, JSON.stringify(store));
  } catch {
    /* quota */
  }
}

export function lockCalls(
  venue: string,
  fresh: HorizonCall[],
  prices: Record<string, number>,
  nowMs = Date.now(),
): HorizonCall[] {
  const store = readLocks();
  const prev = store[venue] ?? [];
  const next = fresh.map((call) => {
    const stored = prev.find((item) => item.horizon === call.horizon) ?? null;
    const live = stored?.symbol ? (prices[stored.symbol] ?? null) : null;
    return reconcileCall(stored, call, nowMs, live);
  });
  store[venue] = next;
  writeLocks(store);
  return next;
}

/** Keep week and month calls from flipping every time the desk is run again. */
export function sealAnalysis(data: AnalysisResult, venue: string, nowMs = Date.now()): AnalysisResult {
  if (!data.calls?.length) return data;
  const prices: Record<string, number> = {};
  for (const row of data.top) prices[row.symbol] = row.priceUsd;
  if (data.btcPriceUsd > 0) prices.BTC = data.btcPriceUsd;
  const calls = lockCalls(venue, data.calls, prices, nowMs);
  const focus = calls.find((call) => call.horizon === data.horizon) ?? calls[0];
  if (!focus) return { ...data, calls };
  return { ...data, calls, verdict: verdictFromCall(focus) };
}
