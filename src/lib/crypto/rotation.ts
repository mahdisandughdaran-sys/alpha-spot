import { msg } from "@/lib/i18n/lex";
import type { SpotVerdict } from "./types.ts";

/** Thirty daily closes. Chosen as the month the desk already talks about, not fitted. */
export const ROTATION_LOOKBACK = 30;
/** An alt has to beat Bitcoin by this much over the lookback before it counts. */
export const ROTATION_MARGIN = 0.05;
/** One coin ahead is a headline. Two liquid alts have to lead. */
export const ROTATION_BREADTH = 2;
/** The new book has to agree on this many closes before capital moves. */
export const ROTATION_CONFIRM = 3;
/** Median daily quote volume, in USD. Thin names stay out. */
export const ROTATION_VOLUME = 2_000_000;
export const ROTATION_COST_BPS = 15;

const DAY = 86_400_000;
const RECENT_FROM = Date.UTC(2023, 0, 1);

export type RotationBar = { t: number; c: number; q: number };

export type RotationSeries = {
  symbol: string;
  name: string;
  bars: RotationBar[];
};

export type RotationSleeve = "alt" | "btc" | "cash";

export type RotationBook = {
  sleeve: RotationSleeve;
  symbol: string | null;
  name: string | null;
};

type AltPrint = { symbol: string; return30: number };

/**
 * Bitcoin flat or down → tether.
 * Bitcoin rising, and at least two liquid alts ahead by the margin → the leader.
 * Bitcoin rising alone → Bitcoin.
 */
export function rotationTarget(input: {
  btcReturn: number | null;
  alts: AltPrint[];
  names: Map<string, string>;
}): RotationBook {
  const btcName = input.names.get("BTC") ?? "Bitcoin";
  if (input.btcReturn == null || !(input.btcReturn > 0)) {
    return { sleeve: "cash", symbol: null, name: null };
  }
  const ahead = input.alts
    .filter((row) => row.return30 > (input.btcReturn ?? 0) + ROTATION_MARGIN)
    .sort((a, b) => b.return30 - a.return30);
  if (ahead.length >= ROTATION_BREADTH) {
    const lead = ahead[0]!;
    return { sleeve: "alt", symbol: lead.symbol, name: input.names.get(lead.symbol) ?? lead.symbol };
  }
  return { sleeve: "btc", symbol: "BTC", name: btcName };
}

export function sameBook(a: RotationBook, b: RotationBook): boolean {
  return a.sleeve === b.sleeve && a.symbol === b.symbol;
}

export function bookWeights(book: RotationBook): Map<string, number> {
  if (book.sleeve === "cash" || !book.symbol) return new Map([["USDT", 1]]);
  return new Map([[book.symbol, 1]]);
}

export function rotationReason(input: {
  book: RotationBook;
  btcReturn: number | null;
  breadth: number;
  leaderReturn: number | null;
}): string {
  const btcPct = input.btcReturn == null ? "—" : signedPct(input.btcReturn);
  if (input.book.sleeve === "cash") {
    return msg(
      `بیت‌کوین در ${ROTATION_LOOKBACK} روز رشد نکرده (${btcPct}). تا وقتی خودش بالا نرود، نه بیت‌کوین می‌خریم و نه آلت. دفتر در تتر است.`,
      `Bitcoin is not up over ${ROTATION_LOOKBACK} days (${btcPct}). Until it is rising, buy neither Bitcoin nor an alt. The book is in tether.`,
    );
  }
  if (input.book.sleeve === "btc") {
    return msg(
      `بیت‌کوین در ${ROTATION_LOOKBACK} روز مثبت است (${btcPct})، ولی ${input.breadth} آلتِ نقد حداقل ۵ واحد درصد از آن جلو نیستند. خرید، خود بیت‌کوین است.`,
      `Bitcoin is positive over ${ROTATION_LOOKBACK} days (${btcPct}), but ${input.breadth} liquid alts are not at least 5 percentage points ahead. The buy is Bitcoin itself.`,
    );
  }
  const leadPct = input.leaderReturn == null ? "—" : signedPct(input.leaderReturn);
  return msg(
    `بیت‌کوین رشد کرده (${btcPct}) و آلت‌ها بیشتر. ${input.book.symbol} با ${leadPct} در ${ROTATION_LOOKBACK} روز جلو است و ${input.breadth} آلت از بیت‌کوین جلوترند. کل دفتر روی ${input.book.symbol} است. جابه‌جایی فقط بعد از ${ROTATION_CONFIRM} بستهٔ روزانهٔ هم‌جهت.`,
    `Bitcoin is rising (${btcPct}) and alts are rising more. ${input.book.symbol} leads at ${leadPct} over ${ROTATION_LOOKBACK} days, with ${input.breadth} alts ahead of Bitcoin. The whole book is ${input.book.symbol}. Capital moves only after ${ROTATION_CONFIRM} daily closes agree.`,
  );
}

export function rotationVerdict(input: {
  book: RotationBook;
  reason: string;
  priceUsd: number | null;
}): SpotVerdict {
  if (input.book.sleeve === "cash" || !input.book.symbol) {
    return {
      kind: "cash",
      symbol: null,
      name: null,
      priceUsd: input.priceUsd,
      reachUsd: null,
      invalidationUsd: null,
      reason: input.reason,
      horizon: "month",
    };
  }
  return {
    kind: input.book.sleeve === "alt" ? "buy" : "stay",
    symbol: input.book.symbol,
    name: input.book.name,
    priceUsd: input.priceUsd,
    reachUsd: null,
    invalidationUsd: null,
    reason: input.reason,
    horizon: "month",
  };
}

type Clock = {
  calendar: number[];
  index: Map<number, number>;
  close: Map<string, Map<number, number>>;
  quote: Map<string, Map<number, number>>;
  names: Map<string, string>;
};

function buildClock(series: RotationSeries[]): Clock | null {
  const close = new Map<string, Map<number, number>>();
  const quote = new Map<string, Map<number, number>>();
  const names = new Map<string, string>();
  for (const row of series) {
    const closes = new Map<number, number>();
    const quotes = new Map<number, number>();
    for (const bar of row.bars) {
      if (!(bar.c > 0) || !Number.isFinite(bar.t)) continue;
      const day = Math.floor(bar.t / DAY);
      closes.set(day, bar.c);
      quotes.set(day, Number.isFinite(bar.q) && bar.q > 0 ? bar.q : 0);
    }
    if (closes.size === 0) continue;
    close.set(row.symbol, closes);
    quote.set(row.symbol, quotes);
    names.set(row.symbol, row.name);
  }
  const btc = close.get("BTC");
  if (!btc || btc.size < ROTATION_LOOKBACK + ROTATION_CONFIRM + 5) return null;
  const calendar = [...btc.keys()].sort((a, b) => a - b);
  return { calendar, index: new Map(calendar.map((day, i) => [day, i])), close, quote, names };
}

function closeAt(clock: Clock, symbol: string, day: number): number | null {
  const value = clock.close.get(symbol)?.get(day);
  return value != null && value > 0 ? value : null;
}

function windowReturn(clock: Clock, symbol: string, day: number): number | null {
  const i = clock.index.get(day);
  if (i == null || i < ROTATION_LOOKBACK) return null;
  const prevDay = clock.calendar[i - ROTATION_LOOKBACK];
  if (prevDay == null) return null;
  for (let k = i - ROTATION_LOOKBACK; k <= i; k++) {
    const d = clock.calendar[k];
    if (d == null || closeAt(clock, symbol, d) == null) return null;
  }
  const now = closeAt(clock, symbol, day);
  const prev = closeAt(clock, symbol, prevDay);
  if (!now || !prev) return null;
  return now / prev - 1;
}

function medianQuote(clock: Clock, symbol: string, day: number): number {
  const i = clock.index.get(day);
  if (i == null || i < ROTATION_LOOKBACK) return 0;
  const values: number[] = [];
  for (let k = i - ROTATION_LOOKBACK + 1; k <= i; k++) {
    const d = clock.calendar[k];
    if (d == null) continue;
    const q = clock.quote.get(symbol)?.get(d);
    if (q != null) values.push(q);
  }
  if (values.length < ROTATION_LOOKBACK * 0.8) return 0;
  values.sort((a, b) => a - b);
  return values[Math.floor(values.length / 2)] ?? 0;
}

function rawBook(clock: Clock, day: number): {
  book: RotationBook;
  btcReturn: number | null;
  breadth: number;
  leaderReturn: number | null;
} {
  const btcReturn = windowReturn(clock, "BTC", day);
  const alts: AltPrint[] = [];
  for (const symbol of clock.close.keys()) {
    if (symbol === "BTC") continue;
    if (medianQuote(clock, symbol, day) < ROTATION_VOLUME) continue;
    const ret = windowReturn(clock, symbol, day);
    if (ret == null) continue;
    alts.push({ symbol, return30: ret });
  }
  const ahead = alts
    .filter((row) => btcReturn != null && row.return30 > btcReturn + ROTATION_MARGIN)
    .sort((a, b) => b.return30 - a.return30);
  return {
    book: rotationTarget({ btcReturn, alts, names: clock.names }),
    btcReturn,
    breadth: ahead.length,
    leaderReturn: ahead[0]?.return30 ?? null,
  };
}

type Confirm = { held: RotationBook; pending: RotationBook | null; pendingN: number };

function freshConfirm(): Confirm {
  return { held: { sleeve: "cash", symbol: null, name: null }, pending: null, pendingN: 0 };
}

function pushConfirm(state: Confirm, raw: RotationBook): RotationBook {
  if (sameBook(raw, state.held)) {
    state.pending = null;
    state.pendingN = 0;
    return state.held;
  }
  if (state.pending && sameBook(state.pending, raw)) {
    state.pendingN += 1;
    if (state.pendingN >= ROTATION_CONFIRM) {
      state.held = raw;
      state.pending = null;
      state.pendingN = 0;
    }
    return state.held;
  }
  state.pending = raw;
  state.pendingN = 1;
  return state.held;
}

function timingBook(btcReturn: number | null, btcName: string): RotationBook {
  if (btcReturn != null && btcReturn > 0) return { sleeve: "btc", symbol: "BTC", name: btcName };
  return { sleeve: "cash", symbol: null, name: null };
}

export type RotationPoint = { t: number; equity: number; btc: number; rule: number };

export type RotationReplay = {
  from: string;
  to: string;
  days: number;
  tradedDays: number;
  trades: number;
  winners: number;
  equity: number;
  btcEquity: number;
  ruleEquity: number;
  maxDrawdown: number;
  btcMaxDrawdown: number;
  ruleMaxDrawdown: number;
  recentDays: number;
  recentReturn: number;
  recentBtcReturn: number;
  curve: RotationPoint[];
  holdings: { symbol: string; periods: number; returnPct: number }[];
  final: {
    book: RotationBook;
    reason: string;
    priceUsd: number | null;
    btcReturn: number | null;
  };
};

/** Walk the daily book. A switch waits for three agreeing closes. No lookahead. */
export function replayRotation(series: RotationSeries[]): RotationReplay | null {
  const clock = buildClock(series);
  if (!clock) return null;
  const model = freshConfirm();
  const timing = freshConfirm();
  let heldW = bookWeights(model.held);
  let heldRule = bookWeights(timing.held);
  let equity = 1;
  let btcEquity = 1;
  let ruleEquity = 1;
  let peak = 1;
  let btcPeak = 1;
  let rulePeak = 1;
  let maxDrawdown = 0;
  let btcMaxDrawdown = 0;
  let ruleMaxDrawdown = 0;
  let trades = 0;
  let winners = 0;
  let tradedDays = 0;
  let recentDays = 0;
  let recentEquity = 1;
  let recentBtc = 1;
  const curve: RotationPoint[] = [];
  const heldDays = new Map<string, { periods: number; equity: number }>();
  let lastRaw = rawBook(clock, clock.calendar[ROTATION_LOOKBACK] ?? clock.calendar[0]!);
  const btcName = clock.names.get("BTC") ?? "Bitcoin";
  let fromMs = 0;

  for (let i = 0; i < clock.calendar.length - 1; i++) {
    const day = clock.calendar[i]!;
    const next = clock.calendar[i + 1]!;
    if ((clock.index.get(day) ?? 0) < ROTATION_LOOKBACK) continue;
    if (next - day > 3) continue;
    const raw = rawBook(clock, day);
    lastRaw = raw;
    const before = model.held;
    const book = pushConfirm(model, raw.book);
    const rule = pushConfirm(timing, timingBook(raw.btcReturn, btcName));
    const weights = bookWeights(book);
    const ruleW = bookWeights(rule);
    const modelRet = legReturn(clock, weights, day, next);
    const ruleRet = legReturn(clock, ruleW, day, next);
    const b0 = closeAt(clock, "BTC", day);
    const b1 = closeAt(clock, "BTC", next);
    if (modelRet == null || ruleRet == null || !b0 || !b1) {
      model.held = before;
      continue;
    }

    const modelTurn = turnover(heldW, weights);
    const ruleTurn = turnover(heldRule, ruleW);
    const net = (1 + modelRet) * (1 - (modelTurn * ROTATION_COST_BPS) / 10_000) - 1;
    const ruleNet = (1 + ruleRet) * (1 - (ruleTurn * ROTATION_COST_BPS) / 10_000) - 1;
    const bret = b1 / b0 - 1;
    if (modelTurn > 1e-8) trades += 1;
    equity *= 1 + net;
    btcEquity *= 1 + bret;
    ruleEquity *= 1 + ruleNet;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.min(maxDrawdown, equity / peak - 1);
    btcPeak = Math.max(btcPeak, btcEquity);
    btcMaxDrawdown = Math.min(btcMaxDrawdown, btcEquity / btcPeak - 1);
    rulePeak = Math.max(rulePeak, ruleEquity);
    ruleMaxDrawdown = Math.min(ruleMaxDrawdown, ruleEquity / rulePeak - 1);
    if (net > 0) winners += 1;
    tradedDays += 1;
    if (fromMs === 0) fromMs = day * DAY;
    if (day * DAY >= RECENT_FROM) {
      recentDays += 1;
      recentEquity *= 1 + net;
      recentBtc *= 1 + bret;
    }
    for (const [symbol, weight] of weights) {
      if (!(weight > 0) || symbol === "USDT") continue;
      const bucket = heldDays.get(symbol) ?? { periods: 0, equity: 1 };
      const p0 = closeAt(clock, symbol, day);
      const p1 = closeAt(clock, symbol, next);
      if (p0 && p1) bucket.equity *= p1 / p0;
      bucket.periods += 1;
      heldDays.set(symbol, bucket);
    }
    heldW = weights;
    heldRule = ruleW;
    curve.push({ t: next * DAY, equity, btc: btcEquity, rule: ruleEquity });
  }

  if (tradedDays === 0 || curve.length === 0) return null;
  const lastDay = clock.calendar[clock.calendar.length - 1]!;
  const priceSymbol = model.held.symbol ?? "BTC";
  return {
    from: new Date(fromMs).toISOString(),
    to: new Date(lastDay * DAY).toISOString(),
    days: clock.calendar.length,
    tradedDays,
    trades,
    winners,
    equity,
    btcEquity,
    ruleEquity,
    maxDrawdown,
    btcMaxDrawdown,
    ruleMaxDrawdown,
    recentDays,
    recentReturn: recentEquity - 1,
    recentBtcReturn: recentBtc - 1,
    curve,
    holdings: [...heldDays.entries()]
      .map(([symbol, row]) => ({ symbol, periods: row.periods, returnPct: row.equity - 1 }))
      .sort((a, b) => b.periods - a.periods),
    final: {
      book: model.held,
      reason: rotationReason({
        book: model.held,
        btcReturn: lastRaw.btcReturn,
        breadth: lastRaw.breadth,
        leaderReturn: model.held.sleeve === "alt" ? lastRaw.leaderReturn : null,
      }),
      priceUsd: closeAt(clock, priceSymbol, lastDay),
      btcReturn: lastRaw.btcReturn,
    },
  };
}

function legReturn(clock: Clock, weights: Map<string, number>, day: number, next: number): number | null {
  let ret = 0;
  for (const [symbol, weight] of weights) {
    if (!(weight > 0) || symbol === "USDT") continue;
    const p0 = closeAt(clock, symbol, day);
    const p1 = closeAt(clock, symbol, next);
    if (!p0 || !p1) return null;
    ret += weight * (p1 / p0 - 1);
  }
  return ret;
}

function turnover(prev: Map<string, number>, next: Map<string, number>): number {
  let distance = 0;
  for (const key of new Set([...prev.keys(), ...next.keys()])) {
    distance += Math.abs((next.get(key) ?? 0) - (prev.get(key) ?? 0));
  }
  return distance / 2;
}

function signedPct(value: number): string {
  const v = value * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}%`;
}
