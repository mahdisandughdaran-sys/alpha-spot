import { lookupMeta } from "./catalog.ts";
import { evaluateKillSwitch } from "./kill-switch.ts";
import { maxDrawdown } from "./math.ts";
import { detectRegime, enrichFromKlines, pickWinner, scoreUniverse } from "./scoring.ts";
import type { CoinDraft } from "./types.ts";
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
  assumptions: string[];
  note: string;
};

const WARMUP = 220;
const STEP = 7;
const COST_BPS = 15;

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
  return enrichFromKlines({
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
    mcFdv: input.symbol === "BTC" || input.symbol === "ETH" ? 1 : 0.85,
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

export function simulateSpotBacktest(series: BtSeries[]): BacktestReport {
  const btc = series.find((s) => s.symbol === "BTC");
  if (!btc || btc.bars.length < WARMUP + STEP) {
    return emptyReport(msg("کندل تاریخی بیت‌کوین برای بک‌تست کافی نبود.", "Historical Bitcoin candles were not enough for the backtest."));
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
    return emptyReport(msg("تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن مدل است.", "The daily calendar is shorter than the model warmup window."));
  }

  let equity = 1;
  let btcEquity = 1;
  let held = "";
  let trades = 0;
  let winners = 0;
  let periods = 0;
  const curve: BacktestPoint[] = [];
  const holdDays = new Map<string, { periods: number; ret: number }>();
  const meta = new Map(series.map((s) => [s.symbol, s]));

  const startIdx = WARMUP;
  const startDay = calendar[startIdx] ?? calendar[0]!;
  const startBtc = priceAt(btcMap, startDay) ?? 1;

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
    const btcDraft = draftAt({
      symbol: "BTC",
      name: btcSeries.name,
      rank: btcSeries.rank,
      usd: btcNow.closes,
      vols: btcNow.vols,
      pair: btcNow.closes,
      quote: btcNow.vols[btcNow.vols.length - 1] ?? 0,
    });
    drafts.push(btcDraft);

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

    const { regime } = detectRegime(drafts, 50);
    const kill = evaluateKillSwitch({
      priceUsd: btcNow.closes[btcNow.closes.length - 1] ?? 0,
      closes: btcNow.closes,
    });
    const scored = scoreUniverse(drafts, regime, { kill }).sort((a, b) => b.score - a.score);
    if (scored.length === 0) continue;
    const { pick } = pickWinner(scored, regime, kill);
    const symbol = pick?.symbol ?? "BTC";
    const assetMap = maps.get(symbol) ?? btcMap;
    const p0 = priceAt(symbol === "BTC" ? btcMap : assetMap, day);
    const p1 = priceAt(symbol === "BTC" ? btcMap : assetMap, nextDay);
    const b0 = priceAt(btcMap, day);
    const b1 = priceAt(btcMap, nextDay);
    if (!p0 || !p1 || !b0 || !b1) continue;

    let assetRet = p1 / p0 - 1;
    const btcRet = b1 / b0 - 1;
    if (symbol !== "BTC" && kill.status === "HIGH_RISK") {
      assetRet = 0.5 * assetRet + 0.5 * btcRet;
    }
    if (symbol !== "BTC" && kill.status === "SUSPENDED") {
      assetRet = btcRet;
    }

    let cost = 0;
    if (symbol !== held) {
      trades += 1;
      cost = COST_BPS / 10_000;
      held = symbol;
    }
    const period = (1 + assetRet) * (1 - cost) - 1;
    equity *= 1 + period;
    if (periods === 0) btcEquity = 1;
    btcEquity *= 1 + btcRet;
    periods += 1;
    if (period > 0) winners += 1;
    const bucket = holdDays.get(symbol) ?? { periods: 0, ret: 0 };
    bucket.periods += 1;
    bucket.ret = (1 + bucket.ret) * (1 + period) - 1;
    holdDays.set(symbol, bucket);
    curve.push({
      t: nextDay * 86_400_000,
      equity,
      btc: btcEquity,
    });
  }

  if (periods === 0 || curve.length === 0) {
    return emptyReport(msg("در این بازه هیچ نقطه بازچینش معتبری ساخته نشد.", "No valid rebalance point was produced in this window."));
  }

  const fromMs = (calendar[startIdx] ?? startDay) * 86_400_000;
  const toMs = (calendar[calendar.length - 1] ?? startDay) * 86_400_000;
  const endBtc = priceAt(btcMap, calendar[calendar.length - 1] ?? startDay) ?? startBtc;
  const btcReturn = startBtc > 0 ? endBtc / startBtc - 1 : btcEquity - 1;
  const eqCurve = curve.map((p) => p.equity);
  const btcCurve = curve.map((p) => p.btc);
  const holdings = [...holdDays.entries()]
    .map(([symbol, v]) => ({ symbol, periods: v.periods, returnPct: v.ret }))
    .sort((a, b) => b.periods - a.periods);

  const totalReturn = equity - 1;
  const winRate = winners / periods;
  const months = monthlyPath(curve);
  const monthStats = summarizeMonths(months);
  const avgPct = (monthStats.avg * 100).toFixed(1);
  const modelPct = (totalReturn * 100).toFixed(1);
  const btcPct = (btcReturn * 100).toFixed(1);
  const faMonth = monthStats.sample === "full" ? "میانگین ماه‌های کامل مدل" : "میانگین ماه‌های مدل";
  const enMonth =
    monthStats.sample === "full"
      ? "Mean return of the model’s complete months"
      : "Mean monthly return of the model";
  const note = msg(
    totalReturn >= btcReturn
      ? `در این مسیر، مدل از خرید و نگهداری بیت‌کوین جلوتر بود: ${modelPct}٪ در برابر ${btcPct}٪. ${faMonth} ${avgPct}٪ بود.`
      : `در این مسیر بیت‌کوین بهتر بود: مدل ${modelPct}٪ و BTC ${btcPct}٪. ${faMonth} ${avgPct}٪ بود.`,
    totalReturn >= btcReturn
      ? `On this path the model beat buy-and-hold Bitcoin: ${modelPct}% versus ${btcPct}%. ${enMonth} was ${avgPct}%.`
      : `On this path Bitcoin was better: the model ${modelPct}% and BTC ${btcPct}%. ${enMonth} was ${avgPct}%.`,
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
    assumptions: [
      msg(
        "بازچینش هفتگی روی همان امتیاز اسپات (قدرت نسبی، روند، ورود، ریسک) فقط با داده‌ای که تا همان روز وجود داشته.",
        "Weekly rebalance uses the same spot score (relative strength, trend, entry, risk) and only data that existed through that day.",
      ),
      msg(
        "توکنومیکس و روایت ثابت‌اند؛ تاریخچه واقعی MC/FDV و آنلاک در این بک‌تست نیست.",
        "Tokenomics and narrative are held fixed; this backtest has no real MC/FDV or unlock history.",
      ),
      msg(
        "اگر کلید قطع معلق باشد نگهداری بیت‌کوین است؛ در ریسک بالا نیمی از بازده آلت و نیمی بیت‌کوین.",
        "If the kill-switch is suspended, the hold is Bitcoin; in high risk, half the return is the alt and half is Bitcoin.",
      ),
      msg(
        `هزینه جابه‌جایی ${COST_BPS} نقطه پایه. اسلیپیج دفتر سفارش تاریخی در داده عمومی نیست.`,
        `Turnover cost is ${COST_BPS} basis points. Historical order-book slippage is not in the public data.`,
      ),
      msg(
        "جهان تست، ارزهای نقد شونده با تاریخچه بلند بایننس است نه هر صد ارز امروز — سوگیری بقا دارد.",
        "The test universe is liquid names with a long Binance history, not today’s top 100 — it has survivorship bias.",
      ),
      msg(
        "بازده ماهانه از آخر هر ماه تا آخر ماه بعد، روی همان مسیر هفتگی و بعد از هزینه جابه‌جایی است. هفته به ماهی می‌رود که در آن تمام شده. این بک‌تست مدل انتخاب میز اصلی است، نه حکم‌های قفل‌شده میز بیت‌کوین. ماهی با کمتر از سه هفته «ناقص» است و اگر سه ماه کامل باشد از میانگین کنار گذاشته می‌شود.",
        "Monthly return runs from one month-end to the next on the same weekly path, after turnover cost. A week is booked in the month it ends. This backtest is the main desk’s pick model, not the Bitcoin desk’s locked calls. A month with fewer than three weeks is partial, and is left out of the average once three complete months exist.",
      ),
    ],
    note,
  };
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
