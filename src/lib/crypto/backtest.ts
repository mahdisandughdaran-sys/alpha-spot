import { lookupMeta } from "./catalog.ts";
import {
  bookMode,
  decideBook,
  dominanceIsFalling,
  dominanceLookback,
  SATELLITE_CAP,
  SATELLITE_MAX,
  type DominancePoint,
} from "./book.ts";
import { evaluateKillSwitch } from "./kill-switch.ts";
import { maxDrawdown } from "./math.ts";
import { evaluateAsset, type Opportunity, type SpotBar } from "./opportunity.ts";
import { campaignExit } from "./rebalance.ts";
import { enrichFromKlines, scoreUniverse } from "./scoring.ts";
import type { BtcKillSwitch, CoinDraft } from "./types.ts";
import { msg } from "@/lib/i18n/lex";

export type BtBar = {
  t: number;
  c: number;
  q: number;
  o?: number;
  h?: number;
  l?: number;
};

export type BtSeries = {
  symbol: string;
  name: string;
  rank: number;
  bars: BtBar[];
};

export type BacktestPoint = {
  t: number;
  equity: number;
  btc: number;
  /** The one-line rule: above the 200-day average, Bitcoin; below it with broken structure, tether. */
  rule: number;
};

export type BacktestHolding = {
  symbol: string;
  periods: number;
  returnPct: number;
};

/** One calendar month of the weekly model path. Return is from the prior month-end equity. */
export type BacktestMonth = {
  key: string;
  model: number;
  btc: number;
  weeks: number;
  partial: boolean;
};

export type BacktestReport = {
  from: string;
  to: string;
  days: number;
  weeks: number;
  trades: number;
  winRate: number;
  winners: number;
  totalReturn: number;
  btcReturn: number;
  maxDrawdown: number;
  btcMaxDrawdown: number;
  curve: BacktestPoint[];
  holdings: BacktestHolding[];
  months: BacktestMonth[];
  /** Months used for the averages: complete months when there are at least three. */
  monthCount: number;
  monthSample: "full" | "all";
  avgMonthly: number;
  medianMonthly: number;
  compoundMonthly: number;
  bestMonth: number;
  worstMonth: number;
  positiveMonths: number;
  monthsAhead: number;
  /** One-line rule over the same weeks, after the same costs. */
  baselineReturn: number;
  baselineMaxDrawdown: number;
  /** Window the previous 1,200-bar sample never saw: up to 1 July 2023, including 2022. */
  holdoutWeeks: number;
  holdoutReturn: number;
  holdoutBaselineReturn: number;
  holdoutMaxDrawdown: number;
  holdoutBaselineMaxDrawdown: number;
  /** True only if the satellite sleeve beat the one-line rule on the holdout, in return and in drawdown. */
  satelliteEarned: boolean;
  dominanceWeeks: number;
  assumptions: string[];
  note: string;
};

const WARMUP = 220;
const STEP = 7;
const COST_BPS = 15;
/** The old 1,200-bar sample never saw this window. It includes 2022. */
export const HOLDOUT_UNTIL_MS = Date.UTC(2023, 6, 1);

/** A satellite kept from the week it opened. Weight and invalidation stay locked. */
export type HeldSatellite = {
  symbol: string;
  weight: number;
  invalidationUsd: number;
  entryUsd: number;
};

/**
 * Same exit as the live desk. The position stays until invalidation, a weekly
 * pair-structure break, or the kill switch. An empty entry list — the gate
 * closed this week — does not close it. An exit this week does not rotate
 * into a new name the same week.
 */
export function stepSatelliteCampaigns(input: {
  held: HeldSatellite[];
  kill: BtcKillSwitch;
  rows: { symbol: string; priceUsd: number; pairSupportBroken: boolean }[];
  entries: HeldSatellite[];
}): HeldSatellite[] {
  if (bookMode(input.kill) === "cash") return [];
  const bySymbol = new Map(input.rows.map((row) => [row.symbol, row]));
  const kept: HeldSatellite[] = [];
  let exited = 0;
  for (const pos of input.held) {
    const row = bySymbol.get(pos.symbol);
    const reason = campaignExit({
      kill: input.kill,
      priceUsd: row?.priceUsd ?? null,
      invalidationUsd: pos.invalidationUsd,
      pairSupportBroken: Boolean(row?.pairSupportBroken),
    });
    if (reason) {
      exited += 1;
      continue;
    }
    kept.push(pos);
  }
  if (exited > 0 || bookMode(input.kill) !== "core") return kept;
  let used = kept.reduce((sum, pos) => sum + pos.weight, 0);
  const have = new Set(kept.map((pos) => pos.symbol));
  const next = [...kept];
  for (const entry of input.entries) {
    if (have.has(entry.symbol)) continue;
    if (next.length >= SATELLITE_MAX) break;
    if (!(entry.weight > 0) || !(entry.invalidationUsd > 0)) continue;
    const room = Math.max(0, SATELLITE_CAP - used);
    const sized = Math.min(entry.weight, room);
    if (!(sized > 0.01)) continue;
    used += sized;
    have.add(entry.symbol);
    next.push({ ...entry, weight: sized });
  }
  return next;
}

export function satelliteBeatBaseline(input: {
  holdoutWeeks: number;
  holdoutReturn: number;
  holdoutBaselineReturn: number;
  holdoutMaxDrawdown: number;
  holdoutBaselineMaxDrawdown: number;
}): boolean {
  if (input.holdoutWeeks < 12) return false;
  const values = [
    input.holdoutReturn,
    input.holdoutBaselineReturn,
    input.holdoutMaxDrawdown,
    input.holdoutBaselineMaxDrawdown,
  ];
  if (!values.every((value) => Number.isFinite(value))) return false;
  return (
    input.holdoutReturn > input.holdoutBaselineReturn &&
    input.holdoutMaxDrawdown > input.holdoutBaselineMaxDrawdown
  );
}

function dayKey(ms: number): number {
  return Math.floor(ms / 86_400_000);
}

function draftAt(input: {
  symbol: string;
  name: string;
  rank: number;
  usd: number[];
  vols: number[];
  pair: number[];
  quote: number;
}): CoinDraft {
  const meta = lookupMeta(input.symbol);
  const lastUsd = input.usd[input.usd.length - 1] ?? 0;
  const lastPair = input.pair[input.pair.length - 1] ?? 0;
  const volume24h = Math.max(input.quote, 0);
  const turnover = 0.025;
  const enriched = enrichFromKlines({
    id: input.symbol.toLowerCase(),
    symbol: input.symbol,
    name: input.name,
    rank: input.rank,
    priceUsd: lastUsd,
    priceBtc: input.symbol === "BTC" ? 1 : lastPair,
    marketCap: volume24h > 0 ? volume24h / turnover : 0,
    volume24h,
    volumeChange24h: 0,
    beta: null,
    athDrawdownPct: null,
    pct1h: 0,
    pct6h: 0,
    pct12h: 0,
    pct24h: 0,
    pct7d: 0,
    pct30d: null,
    rs24h: 0,
    rs7d: 0,
    rs14d: null,
    rs30d: null,
    rsi14: null,
    volatility30d: null,
    maxDrawdown30d: null,
    distFrom30dHighPct: null,
    aboveSma: null,
    aboveEma200: null,
    weeklyStructure: null,
    obvRising: null,
    hasBtcPair: true,
    hasKlines: input.pair.length >= 8,
    klineDays: input.usd.length,
    pairSeries: [],
    turnover,
    circulatingSupply: null,
    maxSupply: null,
    mcFdv: input.symbol === "BTC" || input.symbol === "ETH" ? 1 : null,
    narrativeTags: meta.tags,
    narrativeTagsFa: meta.tagsFa,
    accrual: meta.accrual,
    accrualNote: meta.note,
    pairWeekly: null,
    pairSupportBroken: false,
    pairCloses: input.pair,
    usdCloses: input.usd,
    usdVolumes: input.vols,
  });
  if (input.symbol === "BTC") {
    return { ...enriched, rs24h: 0, rs7d: 0, rs14d: 0, rs30d: 0 };
  }
  return enriched;
}

type Aligned = { closes: number[]; vols: number[] };

function alignUntil(
  map: Map<number, BtBar>,
  calendar: number[],
  endIdx: number,
): Aligned | null {
  const closes: number[] = [];
  const vols: number[] = [];
  let last: number | null = null;
  let lastQ = 0;
  let missing = 0;
  for (let i = 0; i <= endIdx; i++) {
    const bar = map.get(calendar[i] ?? -1);
    if (bar && bar.c > 0) {
      last = bar.c;
      lastQ = bar.q > 0 ? bar.q : lastQ;
      missing = 0;
      closes.push(last);
      vols.push(lastQ);
    } else if (last != null) {
      missing += 1;
      if (missing > 5) return null;
      closes.push(last);
      vols.push(lastQ);
    }
  }
  if (closes.length < 40) return null;
  return { closes, vols };
}

function priceAt(map: Map<number, BtBar>, day: number): number | null {
  const bar = map.get(day);
  return bar && bar.c > 0 ? bar.c : null;
}

export function simulateSpotBacktest(
  series: BtSeries[],
  dominanceSeries: DominancePoint[] = [],
): BacktestReport {
  const btc = series.find((s) => s.symbol === "BTC");
  if (!btc || btc.bars.length < WARMUP + STEP) {
    return emptyReport(
      msg(
        "کندل تاریخی بیت‌کوین برای بک‌تست کافی نبود.",
        "Historical Bitcoin candles were not enough for the backtest.",
      ),
    );
  }

  const maps = new Map<string, Map<number, BtBar>>();
  for (const s of series) {
    const map = new Map<number, BtBar>();
    for (const bar of s.bars) {
      if (bar.c > 0) map.set(dayKey(bar.t), bar);
    }
    maps.set(s.symbol, map);
  }
  const btcMap = maps.get("BTC");
  if (!btcMap) return emptyReport(msg("سری بیت‌کوین ساخته نشد.", "The Bitcoin series could not be built."));

  const calendar = [...btcMap.keys()].sort((a, b) => a - b);
  if (calendar.length < WARMUP + STEP) {
    return emptyReport(
      msg(
        "تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن مدل است.",
        "The daily calendar is shorter than the model warmup window.",
      ),
    );
  }

  const dominance = dominanceSeries
    .filter((point) => Number.isFinite(point.t) && Number.isFinite(point.v))
    .sort((a, b) => a.t - b.t);
  const listed = new Set(series.map((row) => row.symbol));

  let equity = 1;
  let ruleEquity = 1;
  let btcEquity = 1;
  let holdoutSat = 1;
  let holdoutRule = 1;
  let trades = 0;
  let winners = 0;
  let periods = 0;
  let dominanceWeeks = 0;
  let holdoutWeeks = 0;
  const curve: BacktestPoint[] = [];
  const holdoutSatCurve: number[] = [];
  const holdoutRuleCurve: number[] = [];
  const holdDays = new Map<string, { periods: number; ret: number }>();
  let openSats: HeldSatellite[] = [];
  let heldSatW: Map<string, number> = new Map([["BTC", 1]]);
  let heldRule: Map<string, number> = new Map([["BTC", 1]]);
  const meta = new Map(series.map((s) => [s.symbol, s]));

  const startIdx = WARMUP;

  for (let i = startIdx; i < calendar.length - 1; i += STEP) {
    const j = Math.min(i + STEP, calendar.length - 1);
    if (j <= i) break;
    const day = calendar[i]!;
    const nextDay = calendar[j]!;
    const btcNow = alignUntil(btcMap, calendar, i);
    if (!btcNow) continue;
    const drafts: CoinDraft[] = [];
    const btcSeries = meta.get("BTC");
    if (!btcSeries) continue;
    drafts.push(
      draftAt({
        symbol: "BTC",
        name: btcSeries.name,
        rank: btcSeries.rank,
        usd: btcNow.closes,
        vols: btcNow.vols,
        pair: btcNow.closes,
        quote: btcNow.vols[btcNow.vols.length - 1] ?? 0,
      }),
    );

    for (const s of series) {
      if (s.symbol === "BTC") continue;
      const map = maps.get(s.symbol);
      if (!map) continue;
      const aligned = alignUntil(map, calendar, i);
      if (!aligned) continue;
      const n = Math.min(aligned.closes.length, btcNow.closes.length);
      const usd = aligned.closes.slice(-n);
      const vols = aligned.vols.slice(-n);
      const btcSlice = btcNow.closes.slice(-n);
      const pair = usd.map((c, idx) => {
        const b = btcSlice[idx] ?? 0;
        return b > 0 ? c / b : 0;
      });
      if (pair.some((p) => p <= 0)) continue;
      drafts.push(
        draftAt({
          symbol: s.symbol,
          name: s.name,
          rank: s.rank,
          usd,
          vols,
          pair,
          quote: vols[vols.length - 1] ?? 0,
        }),
      );
    }

    const kill = evaluateKillSwitch({
      priceUsd: btcNow.closes[btcNow.closes.length - 1] ?? 0,
      closes: btcNow.closes,
    });
    const scored = scoreUniverse(drafts, "neutral", { kill }).sort((a, b) => b.score - a.score);
    if (!scored.some((row) => row.symbol === "BTC")) continue;

    const atMs = day * 86_400_000;
    const dom = dominanceLookback(dominance, atMs);
    const falling = dominanceIsFalling(dom.now, dom.prev);
    if (falling) dominanceWeeks += 1;

    const opportunities: Opportunity[] = [];
    if (bookMode(kill) === "core" && falling) {
      const generatedAt = new Date(atMs).toISOString();
      const btcCloses = btcNow.closes.slice(-260);
      const names = scored
        .filter(
          (row) =>
            row.symbol !== "BTC" &&
            row.aboveSma === true &&
            !row.pairSupportBroken &&
            row.pairWeekly !== "bear" &&
            row.volume24h >= 8_000_000 &&
            row.hasBtcPair,
        )
        .slice(0, 4);
      for (const row of names) {
        const map = maps.get(row.symbol);
        if (!map) continue;
        const bars = barsUntil(map, calendar, i);
        if (bars.length < 80) continue;
        opportunities.push(
          evaluateAsset(
            {
              symbol: row.symbol,
              name: row.name,
              rank: row.rank,
              priceUsd: row.priceUsd,
              volume24h: row.volume24h,
              turnover: row.turnover,
              bars,
              btcCloses,
            },
            { generatedAt, regime: "neutral", spotBuys: "open" },
          ),
        );
      }
    }

    const measured = decideBook({
      ranked: scored,
      kill,
      dominance: dom.now,
      dominancePrev: dom.prev,
      opportunities,
      listed,
      satelliteEarned: true,
    });
    const entries: HeldSatellite[] = [];
    for (const campaign of measured.campaigns) {
      if (campaign.sleeve !== "satellite" || campaign.status !== "open") continue;
      if (!(campaign.weight > 0) || campaign.invalidationUsd == null) continue;
      entries.push({
        symbol: campaign.symbol,
        weight: campaign.weight,
        invalidationUsd: campaign.invalidationUsd,
        entryUsd: campaign.entryUsd ?? 0,
      });
    }
    const nextSats = stepSatelliteCampaigns({
      held: openSats,
      kill,
      rows: scored.map((row) => ({
        symbol: row.symbol,
        priceUsd: row.priceUsd,
        pairSupportBroken: row.pairSupportBroken,
      })),
      entries,
    });
    const satW = campaignWeights(nextSats, kill);
    const ruleW = cashOnKill(kill.status);
    const satRet = portReturn(satW, day, nextDay, maps);
    const ruleRet = portReturn(ruleW, day, nextDay, maps);
    const b0 = priceAt(btcMap, day);
    const b1 = priceAt(btcMap, nextDay);
    if (satRet == null || ruleRet == null || !b0 || !b1) continue;

    const satTurn = turnoverOf(heldSatW, satW);
    const ruleTurn = turnoverOf(heldRule, ruleW);
    const satPeriod = (1 + satRet) * (1 - (satTurn * COST_BPS) / 10_000) - 1;
    const rulePeriod = (1 + ruleRet) * (1 - (ruleTurn * COST_BPS) / 10_000) - 1;
    if (satTurn > 1e-8) trades += 1;
    openSats = nextSats;
    heldSatW = satW;
    heldRule = ruleW;

    equity *= 1 + satPeriod;
    ruleEquity *= 1 + rulePeriod;
    btcEquity *= 1 + (b1 / b0 - 1);
    periods += 1;
    if (satPeriod > 0) winners += 1;

    for (const [symbol, weight] of satW) {
      if (!(weight > 0) || symbol === "USDT") continue;
      const map = maps.get(symbol);
      const p0 = map ? priceAt(map, day) : null;
      const p1 = map ? priceAt(map, nextDay) : null;
      if (!p0 || !p1) continue;
      const symbolRet = p1 / p0 - 1;
      const bucket = holdDays.get(symbol) ?? { periods: 0, ret: 0 };
      bucket.periods += 1;
      bucket.ret = (1 + bucket.ret) * (1 + symbolRet) - 1;
      holdDays.set(symbol, bucket);
    }

    const weekMs = nextDay * 86_400_000;
    curve.push({ t: weekMs, equity, btc: btcEquity, rule: ruleEquity });
    if (atMs < HOLDOUT_UNTIL_MS) {
      holdoutSat *= 1 + satPeriod;
      holdoutRule *= 1 + rulePeriod;
      holdoutSatCurve.push(holdoutSat);
      holdoutRuleCurve.push(holdoutRule);
      holdoutWeeks += 1;
    }
  }

  if (periods === 0 || curve.length === 0) {
    return emptyReport(
      msg(
        "در این بازه هیچ نقطه بازچینش معتبری ساخته نشد.",
        "No valid rebalance point was produced in this window.",
      ),
    );
  }

  const fromMs = (calendar[startIdx] ?? calendar[0]!) * 86_400_000;
  const toMs = (calendar[calendar.length - 1] ?? calendar[0]!) * 86_400_000;
  const eqCurve = curve.map((p) => p.equity);
  const btcCurve = curve.map((p) => p.btc);
  const ruleCurve = curve.map((p) => p.rule);
  const holdings = [...holdDays.entries()]
    .map(([symbol, v]) => ({ symbol, periods: v.periods, returnPct: v.ret }))
    .sort((a, b) => b.periods - a.periods);

  const totalReturn = equity - 1;
  const btcReturn = btcEquity - 1;
  const baselineReturn = ruleEquity - 1;
  const holdoutReturn = holdoutSat - 1;
  const holdoutBaselineReturn = holdoutRule - 1;
  const holdoutMaxDrawdown = maxDrawdown([1, ...holdoutSatCurve]);
  const holdoutBaselineMaxDrawdown = maxDrawdown([1, ...holdoutRuleCurve]);
  const earned = satelliteBeatBaseline({
    holdoutWeeks,
    holdoutReturn,
    holdoutBaselineReturn,
    holdoutMaxDrawdown,
    holdoutBaselineMaxDrawdown,
  });
  const winRate = winners / periods;
  const months = monthlyPath(curve);
  const monthStats = summarizeMonths(months);
  const avgPct = (monthStats.avg * 100).toFixed(1);
  const modelPct = (totalReturn * 100).toFixed(1);
  const basePct = (baselineReturn * 100).toFixed(1);
  const btcPct = (btcReturn * 100).toFixed(1);
  const holdPct = (holdoutReturn * 100).toFixed(1);
  const holdBasePct = (holdoutBaselineReturn * 100).toFixed(1);
  const faMonth = monthStats.sample === "full" ? "میانگین ماه‌های کامل دفتر" : "میانگین ماه‌های دفتر";
  const enMonth =
    monthStats.sample === "full"
      ? "Mean return of the book’s complete months"
      : "Mean monthly return of the book";
  const holdFa = holdoutWeeks
    ? `${holdPct}٪ در برابر ${holdBasePct}٪`
    : "آن بازه داخل این نمونه نیست";
  const holdEn = holdoutWeeks
    ? `${holdPct}% versus ${holdBasePct}%`
    : "that window is not inside this sample";
  const tradedFrom = new Date(fromMs).toISOString().slice(0, 10);
  const warmupFa = `گرم‌شدن ${WARMUP} روز است و اولین هفتهٔ معامله ${tradedFrom} است. سقوط مه و ژوئن ۲۰۲۲ داخل این معامله نیست؛ این «کل خرس» نیست.`;
  const warmupEn = `Warmup is ${WARMUP} days and the first traded week is ${tradedFrom}. The May and June 2022 crash is not inside this traded path; this is not “the whole bear.”`;
  const permissionFa = "این عدد اجازهٔ خرید آلت روی میز نیست.";
  const permissionEn = "This number is not permission to buy an alt on the desk.";
  const note = earned
    ? msg(
        `مسیر کمپین روی بازهٔ دست‌نخورده تا ۱ ژوئیه ۲۰۲۳ خط پایه را برد: ${holdFa}، و افت هم کم‌عمق‌تر بود. مسیر دفتر ${modelPct}٪ است، خط پایه ${basePct}٪، و ${faMonth} ${avgPct}٪. ${warmupFa} ${permissionFa}`,
        `The campaign path beat the baseline on the untouched window through 1 July 2023: ${holdEn}, with a shallower drop. The book path is ${modelPct}%, the baseline is ${basePct}%, and ${enMonth.toLowerCase()} was ${avgPct}%. ${warmupEn} ${permissionEn}`,
      )
    : msg(
        `قمر خاموش می‌ماند. روی بازهٔ دست‌نخورده تا ۱ ژوئیه ۲۰۲۳ خط «میانگین ۲۰۰ / تتر» را نبرد (${holdFa}). دفتر زنده همان خط است: بیت‌کوین، یا تتر وقتی کلید قطع روشن است. مسیر آزمایشی ${modelPct}٪، خط پایه ${basePct}٪، خرید و نگهداری بیت‌کوین ${btcPct}٪. ${faMonth} ${avgPct}٪ بود. ${warmupFa} ${permissionFa}`,
        `The satellite stays off. On the untouched window through 1 July 2023 it did not beat the 200-day / tether line (${holdEn}). The live book is that line: Bitcoin, or tether when the kill switch is on. The measured path was ${modelPct}%, the baseline ${basePct}%, and buy-and-hold Bitcoin ${btcPct}%. ${enMonth} was ${avgPct}%. ${warmupEn} ${permissionEn}`,
      );

  return {
    from: new Date(fromMs).toISOString(),
    to: new Date(toMs).toISOString(),
    days: calendar.length,
    weeks: periods,
    trades,
    winRate,
    winners,
    totalReturn,
    btcReturn,
    maxDrawdown: maxDrawdown(eqCurve),
    btcMaxDrawdown: maxDrawdown(btcCurve),
    curve: downsample(curve, 90),
    holdings,
    months,
    monthCount: monthStats.count,
    monthSample: monthStats.sample,
    avgMonthly: monthStats.avg,
    medianMonthly: monthStats.median,
    compoundMonthly: monthStats.compound,
    bestMonth: monthStats.best,
    worstMonth: monthStats.worst,
    positiveMonths: monthStats.positive,
    monthsAhead: monthStats.ahead,
    baselineReturn,
    baselineMaxDrawdown: maxDrawdown(ruleCurve),
    holdoutWeeks,
    holdoutReturn,
    holdoutBaselineReturn,
    holdoutMaxDrawdown,
    holdoutBaselineMaxDrawdown,
    satelliteEarned: earned,
    dominanceWeeks,
    assumptions: [
      msg(
        "هر هفته دفتر اجرا می‌شود، نه انتخابِ امتیاز. کلید قطع (زیر میانگین ۲۰۰روزه و ساختار هفتگی شکسته) صددرصد تتر است. وگرنه هسته بیت‌کوین است.",
        "Each week runs the book, not a score pick. The kill switch (under the 200-day average and weekly structure broken) is one hundred percent tether. Otherwise the core is Bitcoin.",
      ),
      msg(
        "خط پایه همان قاعدهٔ یک‌خطی است: بالای میانگین ۲۰۰روزه بیت‌کوین، و با کلید قطع تتر. قمر فقط در مسیر آزمایشی باز می‌شود تا معلوم شود آن خط را می‌برد یا نه.",
        "The baseline is the one-line rule: Bitcoin above the 200-day average, and tether on the kill switch. The satellite opens only on the measured path, to see whether it beats that line.",
      ),
      msg(
        "قمر حداکثر دو نام و روی هم ۳۲٪ است. دروازه‌اش افت دامیننس در حدود سی روز، ساختار جفت، وتوی حجم و گردش و کلیف و صرافی، و محدودهٔ فرصت است. قدرت نسبی خود بیت‌کوین صفر است.",
        "A satellite is at most two names and 32% together. Its gates are a dominance drop over about thirty days, pair structure, and the volume, float, cliff, and venue vetoes, plus the opportunity zone. Bitcoin’s own relative strength is zero.",
      ),
      msg(
        "قمر کمپین است. وزن و ابطالِ روز ورود قفل می‌ماند تا قیمت به همان ابطال برسد، ساختار هفتگی جفت بشکند، یا کلید قطع دفتر را به تتر ببرد. خاموش شدن دروازهٔ دامیننس خروج نیست و جابه‌جایی به آلتِ رتبهٔ بعد هم نیست.",
        "A satellite is a campaign. The entry-day weight and invalidation stay locked until price hits that invalidation, weekly pair structure breaks, or the kill switch sends the book to tether. The dominance gate turning off is not an exit, and the exit is not a swap into the next-ranked alt.",
      ),
      msg(
        "قمر فقط اگر روی هفته‌های تا ۱ ژوئیه ۲۰۲۳، هم بازده و هم عمق افت را بهتر از خط پایه کند، روی همین گزارش روشن حساب می‌شود. این پرچم به میز وصل نیست و اجازهٔ خرید آلت نیست.",
        "The satellite counts as earned on this report only if, on the weeks through 1 July 2023, it beats the baseline on both return and drawdown. That flag is not wired to the desk and is not permission to buy an alt.",
      ),
      msg(
        `گرم‌شدن ${WARMUP} روز است. از ۱ ژانویه ۲۰۲۲ اولین هفته حدوداً اوت ۲۰۲۲ است، مگر اینکه خودِ تقویم دیرتر شروع شود. سقوط مه و ژوئن ۲۰۲۲ داخل معامله نیست. تهٔ نوامبر ۲۰۲۲ هست، اگر بعد از اولین هفته باشد. این کلِ خرس نیست.`,
        `Warmup is ${WARMUP} days. From 1 January 2022 the first week is about August 2022, unless the calendar itself starts later. The May and June 2022 crash is not in the traded path. The November 2022 low is, if it falls after the first week. This is not the whole bear.`,
      ),
      msg(
        `هزینه به اندازهٔ جابه‌جایی واقعی است، ${COST_BPS} نقطه پایه. اسلیپیج دفتر سفارش تاریخی در داده عمومی نیست. توکنومیکس و روایت وزن ندارند.`,
        `Cost is charged on real turnover, ${COST_BPS} basis points. Historical order-book slippage is not in the public data. Tokenomics and narrative have no weight.`,
      ),
      msg(
        "جهان تست، ارزهای نقدشونده با تاریخچه بلند بایننس است نه هر صد ارز امروز — سوگیری بقا دارد. اگر سری دامیننس نرسد، دروازهٔ قمر بسته می‌ماند.",
        "The test universe is liquid names with a long Binance history, not today’s top 100 — it has survivorship bias. If the dominance series is missing, the satellite gate stays shut.",
      ),
      msg(
        "بازده ماهانه از آخر هر ماه تا آخر ماه بعد، روی همان مسیر هفتگی و بعد از هزینه است. ماهی با کمتر از سه هفته «ناقص» است و اگر سه ماه کامل باشد از میانگین کنار گذاشته می‌شود.",
        "Monthly return runs from one month-end to the next on the same weekly path, after cost. A month with fewer than three weeks is partial, and is left out of the average once three complete months exist.",
      ),
    ],
    note,
  };
}

function cashOnKill(status: string): Map<string, number> {
  if (status === "SUSPENDED") return new Map([["USDT", 1]]);
  return new Map([["BTC", 1]]);
}

function campaignWeights(held: HeldSatellite[], kill: BtcKillSwitch): Map<string, number> {
  if (bookMode(kill) === "cash") return new Map([["USDT", 1]]);
  const weights = new Map<string, number>();
  let used = 0;
  for (const pos of held) {
    if (!(pos.weight > 0)) continue;
    weights.set(pos.symbol, (weights.get(pos.symbol) ?? 0) + pos.weight);
    used += pos.weight;
  }
  const core = Math.max(0, 1 - used);
  if (core > 1e-8) weights.set("BTC", (weights.get("BTC") ?? 0) + core);
  if (weights.size === 0) return new Map([["BTC", 1]]);
  return weights;
}

function turnoverOf(prev: Map<string, number>, next: Map<string, number>): number {
  const keys = new Set([...prev.keys(), ...next.keys()]);
  let distance = 0;
  for (const key of keys) distance += Math.abs((next.get(key) ?? 0) - (prev.get(key) ?? 0));
  return distance / 2;
}

function portReturn(
  weights: Map<string, number>,
  day: number,
  nextDay: number,
  maps: Map<string, Map<number, BtBar>>,
): number | null {
  let ret = 0;
  for (const [symbol, weight] of weights) {
    if (!(weight > 0) || symbol === "USDT") continue;
    const map = maps.get(symbol);
    const p0 = map ? priceAt(map, day) : null;
    const p1 = map ? priceAt(map, nextDay) : null;
    if (!p0 || !p1) return null;
    ret += weight * (p1 / p0 - 1);
  }
  return ret;
}

function barsUntil(map: Map<number, BtBar>, calendar: number[], endIdx: number): SpotBar[] {
  const start = Math.max(0, endIdx - 259);
  const out: SpotBar[] = [];
  for (let i = start; i <= endIdx; i++) {
    const day = calendar[i];
    if (day == null) continue;
    const bar = map.get(day);
    if (!bar || !(bar.c > 0)) continue;
    const c = bar.c;
    out.push({
      t: day * 86_400_000,
      o: bar.o && bar.o > 0 ? bar.o : c,
      h: bar.h && bar.h > 0 ? bar.h : c,
      l: bar.l && bar.l > 0 ? bar.l : c,
      c,
      v: bar.q > 0 ? bar.q : 0,
      q: bar.q > 0 ? bar.q : 0,
    });
  }
  return out;
}

function monthKey(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = d.getUTCMonth() + 1;
  return `${y}-${String(m).padStart(2, "0")}`;
}

export function monthlyPath(curve: BacktestPoint[]): BacktestMonth[] {
  if (curve.length === 0) return [];
  const out: BacktestMonth[] = [];
  let startEq = 1;
  let startBtc = 1;
  let key = "";
  let lastEq = 1;
  let lastBtc = 1;
  let weeks = 0;

  const close = () => {
    if (weeks === 0) return;
    out.push({
      key,
      model: startEq > 0 ? lastEq / startEq - 1 : 0,
      btc: startBtc > 0 ? lastBtc / startBtc - 1 : 0,
      weeks,
      partial: weeks < 3,
    });
  };

  for (const point of curve) {
    const next = monthKey(point.t);
    if (weeks > 0 && next !== key) {
      close();
      startEq = lastEq;
      startBtc = lastBtc;
      weeks = 0;
    }
    if (weeks === 0) {
      key = next;
    }
    lastEq = point.equity;
    lastBtc = point.btc;
    weeks += 1;
  }
  close();
  return out;
}

function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 0) return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
  return sorted[mid] ?? 0;
}

function summarizeMonths(months: BacktestMonth[]): {
  count: number;
  sample: "full" | "all";
  avg: number;
  median: number;
  compound: number;
  best: number;
  worst: number;
  positive: number;
  ahead: number;
} {
  const full = months.filter((row) => !row.partial);
  const basis = full.length >= 3 ? full : months;
  const sample: "full" | "all" = full.length >= 3 ? "full" : "all";
  const rets = basis.map((row) => row.model);
  const count = rets.length;
  if (count === 0) {
    return { count: 0, sample, avg: 0, median: 0, compound: 0, best: 0, worst: 0, positive: 0, ahead: 0 };
  }
  const avg = rets.reduce((sum, value) => sum + value, 0) / count;
  const growth = basis.reduce((product, row) => product * (1 + row.model), 1);
  return {
    count,
    sample,
    avg,
    median: median(rets),
    compound: growth > 0 ? growth ** (1 / count) - 1 : 0,
    best: Math.max(...rets),
    worst: Math.min(...rets),
    positive: basis.filter((row) => row.model > 0).length,
    ahead: basis.filter((row) => row.model > row.btc).length,
  };
}

function downsample(points: BacktestPoint[], max: number): BacktestPoint[] {
  if (points.length <= max) return points;
  const step = Math.ceil(points.length / max);
  const out: BacktestPoint[] = [];
  for (let i = 0; i < points.length; i += step) {
    const row = points[i];
    if (row) out.push(row);
  }
  const last = points[points.length - 1];
  if (last && out[out.length - 1] !== last) out.push(last);
  return out;
}

function emptyReport(note: string): BacktestReport {
  return {
    from: "",
    to: "",
    days: 0,
    weeks: 0,
    trades: 0,
    winRate: 0,
    winners: 0,
    totalReturn: 0,
    btcReturn: 0,
    maxDrawdown: 0,
    btcMaxDrawdown: 0,
    curve: [],
    holdings: [],
    months: [],
    monthCount: 0,
    monthSample: "all",
    avgMonthly: 0,
    medianMonthly: 0,
    compoundMonthly: 0,
    bestMonth: 0,
    worstMonth: 0,
    positiveMonths: 0,
    monthsAhead: 0,
    baselineReturn: 0,
    baselineMaxDrawdown: 0,
    holdoutWeeks: 0,
    holdoutReturn: 0,
    holdoutBaselineReturn: 0,
    holdoutMaxDrawdown: 0,
    holdoutBaselineMaxDrawdown: 0,
    satelliteEarned: false,
    dominanceWeeks: 0,
    assumptions: [],
    note,
  };
}

export const BACKTEST_UNIVERSE: { symbol: string; name: string; rank: number }[] = [
  { symbol: "BTC", name: "Bitcoin", rank: 1 },
  { symbol: "ETH", name: "Ethereum", rank: 2 },
  { symbol: "BNB", name: "BNB", rank: 4 },
  { symbol: "SOL", name: "Solana", rank: 5 },
  { symbol: "XRP", name: "XRP", rank: 6 },
  { symbol: "DOGE", name: "Dogecoin", rank: 8 },
  { symbol: "TRX", name: "TRON", rank: 9 },
  { symbol: "TON", name: "Toncoin", rank: 12 },
  { symbol: "ADA", name: "Cardano", rank: 13 },
  { symbol: "AVAX", name: "Avalanche", rank: 15 },
  { symbol: "LINK", name: "Chainlink", rank: 16 },
  { symbol: "SUI", name: "Sui", rank: 18 },
  { symbol: "DOT", name: "Polkadot", rank: 20 },
  { symbol: "LTC", name: "Litecoin", rank: 22 },
  { symbol: "UNI", name: "Uniswap", rank: 25 },
  { symbol: "NEAR", name: "NEAR", rank: 28 },
  { symbol: "APT", name: "Aptos", rank: 32 },
  { symbol: "ATOM", name: "Cosmos", rank: 35 },
];
