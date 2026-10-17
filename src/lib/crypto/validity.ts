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
  const buy = verdict.kind === "buy" && verdict.symbol != null;
  return {
    horizon,
    kind: buy ? "buy" : "cash",
    symbol: buy ? verdict.symbol : null,
    name: buy ? verdict.name : null,
    priceUsd: buy ? verdict.priceUsd : null,
    invalidationUsd: verdict.invalidationUsd,
    reason: verdict.reason,
    issuedAt,
    validUntil: validUntilFrom(issuedAt, horizon),
    held: false,
    dissent: null,
  };
}

export function verdictFromCall(call: HorizonCall): SpotVerdict {
  const buy = call.kind === "buy" && call.symbol != null;
  return {
    kind: buy ? "buy" : "cash",
    symbol: buy ? call.symbol : null,
    name: buy ? call.name : null,
    priceUsd: buy ? call.priceUsd : null,
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

function sameOrder(a: HorizonCall, b: HorizonCall): boolean {
  return a.kind === b.kind && a.symbol === b.symbol;
}

/** A published call does not flip until it expires, unless a buy is invalidated. */
export function reconcileCall(
  stored: HorizonCall | null,
  fresh: HorizonCall,
  nowMs: number,
  livePrice: number | null,
): HorizonCall {
  if (!stored || stored.horizon !== fresh.horizon) return fresh;
  const until = Date.parse(stored.validUntil);
  if (!Number.isFinite(until) || nowMs >= until) return fresh;
  if (
    stored.kind === "buy" &&
    stored.invalidationUsd != null &&
    livePrice != null &&
    livePrice > 0 &&
    livePrice < stored.invalidationUsd
  ) {
    return {
      ...fresh,
      kind: "cash",
      symbol: null,
      name: null,
      priceUsd: null,
      invalidationUsd: stored.invalidationUsd,
      reason: msg(
        "هیچ ارزی نخر. حکم قبلی باطل شد چون قیمت از حد ابطال پایین‌تر رفت.",
        "Do not buy any coin. The earlier call died because price crossed under invalidation.",
      ),
      held: false,
      dissent: null,
    };
  }
  if (sameOrder(stored, fresh)) {
    return {
      ...stored,
      priceUsd: fresh.kind === "buy" ? (fresh.priceUsd ?? stored.priceUsd) : stored.priceUsd,
      held: true,
      dissent: null,
    };
  }
  const dissent =
    fresh.kind === "buy" && fresh.symbol
      ? msg(
          `تحلیل لحظه‌ای الان ${fresh.symbol} را می‌گوید، ولی این حکم تا پایان اعتبار عوض نمی‌شود.`,
          `The live tape now names ${fresh.symbol}, but this call does not change before it expires.`,
        )
      : msg(
          "تحلیل لحظه‌ای الان جور دیگری می‌گوید، ولی این حکم تا پایان اعتبار عوض نمی‌شود.",
          "The live tape now disagrees, but this call does not change before it expires.",
        );
  return { ...stored, held: true, dissent };
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
