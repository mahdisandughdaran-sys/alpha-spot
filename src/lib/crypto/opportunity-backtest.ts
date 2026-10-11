import type { BtBar, BtSeries } from "./backtest.ts";
import { maxDrawdown, rsi } from "./math.ts";
import { evaluateAsset, type SpotBar } from "./opportunity.ts";

export type RegimeBucket = "bull" | "bear" | "range";

export type BaselineRow = {
  name: string;
  trades: number;
  winRate: number | null;
  avgR: number | null;
  totalReturn: number | null;
  maxDrawdown: number | null;
};

export type OpportunityBacktestReport = {
  from: string;
  to: string;
  symbols: number;
  days: number;
  trades: number;
  winRate: number | null;
  avgR: number | null;
  profitFactor: number | null;
  totalReturn: number | null;
  maxDrawdown: number | null;
  byRegime: { regime: RegimeBucket; trades: number; winRate: number | null; avgR: number | null }[];
  baselines: BaselineRow[];
  holdout: { trades: number; winRate: number | null; avgR: number | null; note: string };
  sampleEnough: boolean;
  samples: { symbol: string; r: number; regime: RegimeBucket; entryIndex: number; exitIndex: number }[];
  assumptions: string[];
  note: string;
};

type Rich = SpotBar;

type Placed = {
  symbol: string;
  entryIndex: number;
  entryFill: number;
  stop: number;
  target: number | null;
  riskPct: number;
  units: number;
  regime: RegimeBucket;
  maxDays: number;
};

type Closed = Placed & { exitIndex: number; pnl: number; r: number };

const FEE = 0.001;
const SLIP = 0.0008;
export const OPPORTUNITY_WARMUP = 120;
const MAX_OPEN = 4;

function dayKey(ms: number): number {
  return Math.floor(ms / 86_400_000);
}

function richFrom(bar: BtBar): Rich | null {
  if (!(bar.c > 0)) return null;
  const o = bar.o && bar.o > 0 ? bar.o : bar.c;
  const h = bar.h && bar.h > 0 ? bar.h : Math.max(o, bar.c);
  const l = bar.l && bar.l > 0 ? bar.l : Math.min(o, bar.c);
  return {
    t: bar.t,
    o,
    h: Math.max(h, o, bar.c),
    l: Math.min(l, o, bar.c),
    c: bar.c,
    v: bar.q > 0 ? bar.q / bar.c : 0,
    q: bar.q > 0 ? bar.q : bar.c,
  };
}

function stats(trades: Closed[], equity: number[], start = 1): {
  winRate: number | null;
  avgR: number | null;
  profitFactor: number | null;
  totalReturn: number | null;
  maxDrawdown: number | null;
} {
  if (trades.length === 0) {
    return { winRate: null, avgR: null, profitFactor: null, totalReturn: null, maxDrawdown: null };
  }
  const wins = trades.filter((t) => t.pnl > 0);
  const gain = trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
  const loss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
  const last = equity[equity.length - 1] ?? start;
  return {
    winRate: wins.length / trades.length,
    avgR: trades.reduce((s, t) => s + t.r, 0) / trades.length,
    profitFactor: loss === 0 ? null : gain / loss,
    totalReturn: last / start - 1,
    maxDrawdown: equity.length > 1 ? maxDrawdown(equity) : null,
  };
}

function btcRegime(closes: number[]): RegimeBucket {
  if (closes.length < 60) return "range";
  const last = closes[closes.length - 1] ?? 0;
  const prev = closes[closes.length - 31] ?? last;
  const ret = prev ? last / prev - 1 : 0;
  const ma = closes.slice(-50).reduce((s, v) => s + v, 0) / Math.min(50, closes.length);
  if (last > ma && ret > 0) return "bull";
  if (last < ma && ret < 0) return "bear";
  return "range";
}

function fillBuy(px: number): number {
  return px * (1 + FEE + SLIP);
}

function fillSell(px: number): number {
  return px * (1 - FEE - SLIP);
}

type Book = {
  trades: Closed[];
  equity: number[];
};

function simulateBook(
  maps: Map<string, Map<number, Rich>>,
  calendar: number[],
  signal: (
    symbol: string,
    bars: Rich[],
    btcCloses: number[],
    index: number,
  ) => { stop: number; target: number | null; score: number; maxDays: number } | null,
): Book {
  let equity = 1;
  const curve = [1];
  const open: Placed[] = [];
  const trades: Closed[] = [];
  const symbols = [...maps.keys()];

  for (let i = OPPORTUNITY_WARMUP; i < calendar.length; i++) {
    const day = calendar[i]!;
    for (let p = open.length - 1; p >= 0; p--) {
      const pos = open[p]!;
      if (pos.entryIndex >= i) continue;
      const bar = maps.get(pos.symbol)?.get(day);
      if (!bar) continue;
      let exitPx: number | null = null;
      if (bar.l <= pos.stop) exitPx = bar.o < pos.stop ? bar.o : pos.stop;
      else if (pos.target != null && bar.h >= pos.target) exitPx = pos.target;
      else if (i - pos.entryIndex >= pos.maxDays) exitPx = bar.c;
      if (exitPx == null) continue;
      const pnl = pos.units * (fillSell(exitPx) - pos.entryFill);
      const riskUsd = Math.max(pos.entryFill * pos.units * pos.riskPct, 1e-9);
      equity += pnl;
      trades.push({ ...pos, exitIndex: i, pnl, r: pnl / riskUsd });
      open.splice(p, 1);
    }

    if (open.length < MAX_OPEN) {
      const ideas: { symbol: string; score: number; stop: number; target: number | null; maxDays: number; close: number }[] = [];
      for (const symbol of symbols) {
        if (open.some((pos) => pos.symbol === symbol)) continue;
        const map = maps.get(symbol);
        if (!map) continue;
        const bars = collect(map, calendar, i);
        const btcBars = collect(maps.get("BTC") ?? new Map(), calendar, i);
        if (bars.length < 90) continue;
        const idea = signal(symbol, bars, btcBars.map((b) => b.c), i);
        const last = bars[bars.length - 1];
        if (!idea || !last) continue;
        ideas.push({ symbol, ...idea, close: last.c });
      }
      ideas.sort((a, b) => b.score - a.score);
      for (const idea of ideas) {
        if (open.length >= MAX_OPEN) break;
        const entryFill = fillBuy(idea.close);
        const riskPct = (entryFill - idea.stop) / entryFill;
        if (riskPct < 0.004 || riskPct > 0.25) continue;
        const notional = Math.min(equity * 0.15, (equity * 0.01) / riskPct);
        if (notional <= 0 || equity <= 0) continue;
        open.push({
          symbol: idea.symbol,
          entryIndex: i,
          entryFill,
          stop: idea.stop,
          target: idea.target,
          riskPct,
          units: notional / entryFill,
          regime: btcRegime(collect(maps.get("BTC") ?? new Map(), calendar, i).map((b) => b.c)),
          maxDays: idea.maxDays,
        });
      }
    }
    curve.push(equity);
  }

  return { trades, equity: curve };
}

function collect(map: Map<number, Rich>, calendar: number[], end: number): Rich[] {
  const out: Rich[] = [];
  const start = Math.max(0, end - 159);
  for (let i = start; i <= end; i++) {
    const bar = map.get(calendar[i] ?? -1);
    if (bar) out.push(bar);
  }
  return out;
}

function bucket(trades: Closed[], regime: RegimeBucket) {
  const rows = trades.filter((t) => t.regime === regime);
  return {
    regime,
    trades: rows.length,
    winRate: rows.length ? rows.filter((t) => t.pnl > 0).length / rows.length : null,
    avgR: rows.length ? rows.reduce((s, t) => s + t.r, 0) / rows.length : null,
  };
}

export function simulateOpportunityBacktest(series: BtSeries[]): OpportunityBacktestReport {
  const maps = new Map<string, Map<number, Rich>>();
  let degraded = 0;
  for (const item of series) {
    const map = new Map<number, Rich>();
    for (const bar of item.bars) {
      if (bar.h == null || bar.l == null) degraded += 1;
      const rich = richFrom(bar);
      if (rich) map.set(dayKey(bar.t), rich);
    }
    if (map.size > 80) maps.set(item.symbol, map);
  }
  const btc = maps.get("BTC");
  const assumptions = [
    "ورود فقط بعد از بسته شدن کندلی است که تأیید را ساخته. کندل‌های بعد از آن برای خروج استفاده می‌شوند.",
    "کارمزد ۱۰ نقطه پایه و لغزش ۸ نقطه پایه در هر طرف لحاظ شده است.",
    "اگر در یک کندل هم حد ضرر و هم هدف لمس شود، خروج روی حد ضرر فرض می‌شود.",
    "ریسک هر معامله ۱٪ سرمایه و سقف اندازه ۱۵٪ است. حداکثر چهار موقعیت باز.",
    "وزن‌های اسکنر روی این نمونه بهینه نشده‌اند. بخش پایانی فقط برای دیدن پایداری است.",
    "نتیجه گذشته تضمین آینده نیست.",
  ];
  if (!btc || btc.size < OPPORTUNITY_WARMUP + 20) {
    return emptyReport("کندل تاریخی بیت‌کوین برای ارزیابی فرصت‌ها کافی نبود.", assumptions);
  }
  const calendar = [...btc.keys()].sort((a, b) => a - b);
  if (calendar.length < OPPORTUNITY_WARMUP + 20) {
    return emptyReport("تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن است.", assumptions);
  }

  const model = simulateBook(maps, calendar, (_symbol, bars, btcCloses) => {
    const last = bars[bars.length - 1];
    if (!last) return null;
    const opp = evaluateAsset(
      {
        symbol: _symbol,
        name: _symbol,
        rank: 10,
        priceUsd: last.c,
        volume24h: last.q,
        turnover: 0.03,
        bars,
        btcCloses,
      },
      { generatedAt: new Date(last.t).toISOString(), regime: "neutral", spotBuys: "open" },
    );
    if ((opp.status !== "actionable" && opp.status !== "confirmed") || !opp.zone) return null;
    return {
      stop: opp.zone.invalidation,
      target: opp.targetUsd,
      score: opp.score,
      maxDays: 12,
    };
  });

  const dip = simulateBook(maps, calendar, (_symbol, bars) => {
    if (bars.length < 12) return null;
    const last = bars[bars.length - 1]!;
    const prev = bars[bars.length - 11]!;
    if (last.c / prev.c - 1 > -0.1) return null;
    return { stop: last.c * 0.92, target: null, score: 1, maxDays: 10 };
  });

  const rsiBook = simulateBook(maps, calendar, (_symbol, bars) => {
    const last = bars[bars.length - 1];
    const value = rsi(bars.map((b) => b.c), 14);
    if (!last || value == null || value >= 30) return null;
    return { stop: last.c * 0.92, target: null, score: 40 - value, maxDays: 10 };
  });

  const modelStats = stats(model.trades, model.equity);
  const holdoutCut = Math.floor(calendar.length * 0.6);
  const holdoutTrades = model.trades.filter((t) => t.entryIndex >= holdoutCut);
  const holdoutRate = holdoutTrades.length
    ? holdoutTrades.filter((t) => t.pnl > 0).length / holdoutTrades.length
    : null;
  const holdoutR = holdoutTrades.length
    ? holdoutTrades.reduce((s, t) => s + t.r, 0) / holdoutTrades.length
    : null;
  let holdoutNote = "۴۰٪ پایانی تقویم جدا شمرده شده تا وزن‌ها روی کل نمونه قشنگ‌تر از واقعیت به‌نظر نرسند.";
  if (
    modelStats.winRate != null &&
    holdoutRate != null &&
    model.trades.length >= 15 &&
    holdoutTrades.length >= 8 &&
    Math.abs(modelStats.winRate - holdoutRate) > 0.15
  ) {
    holdoutNote = "نرخ برد کل نمونه و بازه پایانی بیش از ۱۵ واحد اختلاف دارند. به عدد کلی اعتماد نکنید.";
  }
  if (holdoutTrades.length < 8) {
    holdoutNote = "نمونه بازه پایانی کوچک است و نرخ برد جداگانه‌ای از آن ساخته نمی‌شود.";
  }

  const btcCloses = calendar.map((day) => btc.get(day)?.c ?? 0).filter((n) => n > 0);
  const btcEquity = btcCloses.map((px) => px / (btcCloses[0] || px));
  const from = new Date((calendar[0] ?? 0) * 86_400_000).toISOString().slice(0, 10);
  const to = new Date((calendar[calendar.length - 1] ?? 0) * 86_400_000).toISOString().slice(0, 10);
  const enough = model.trades.length >= 30;
  if (degraded > series.length) {
    assumptions.unshift("بخشی از کندل‌ها سقف و کف جدا نداشتند و با قیمت پایانی تقریب زده شدند.");
  }

  return {
    from,
    to,
    symbols: maps.size,
    days: calendar.length,
    trades: model.trades.length,
    winRate: modelStats.winRate,
    avgR: modelStats.avgR,
    profitFactor: modelStats.profitFactor,
    totalReturn: modelStats.totalReturn,
    maxDrawdown: modelStats.maxDrawdown,
    byRegime: [bucket(model.trades, "bull"), bucket(model.trades, "bear"), bucket(model.trades, "range")],
    baselines: [
      rowOf("افت ۱۰٪ و خروج زمانی", dip.trades, dip.equity),
      rowOf("ورود با RSI زیر ۳۰", rsiBook.trades, rsiBook.equity),
      {
        name: "نگهداری بیت‌کوین",
        trades: 1,
        winRate: null,
        avgR: null,
        totalReturn: btcEquity.length ? (btcEquity[btcEquity.length - 1] ?? 1) - 1 : null,
        maxDrawdown: btcEquity.length > 2 ? maxDrawdown(btcEquity) : null,
      },
    ],
    holdout: {
      trades: holdoutTrades.length,
      winRate: holdoutTrades.length >= 8 ? holdoutRate : null,
      avgR: holdoutTrades.length >= 8 ? holdoutR : null,
      note: holdoutNote,
    },
    sampleEnough: enough,
    samples: model.trades.slice(-12).map((trade) => ({
      symbol: trade.symbol,
      r: trade.r,
      regime: trade.regime,
      entryIndex: trade.entryIndex,
      exitIndex: trade.exitIndex,
    })),
    assumptions,
    note: enough
      ? "این ارزیابی گذشته است و تضمین آینده نیست. کارمزد و لغزش داخل عددها هستند."
      : "تعداد معامله‌های تأییدشده برای حرف زدن از نرخ برد کافی نیست. نتیجه را به‌عنوان شاهد آماری نخوانید.",
  };
}

function rowOf(name: string, trades: Closed[], equity: number[]): BaselineRow {
  const s = stats(trades, equity);
  return { name, trades: trades.length, ...s };
}

function emptyReport(note: string, assumptions: string[]): OpportunityBacktestReport {
  return {
    from: "",
    to: "",
    symbols: 0,
    days: 0,
    trades: 0,
    winRate: null,
    avgR: null,
    profitFactor: null,
    totalReturn: null,
    maxDrawdown: null,
    byRegime: [],
    baselines: [],
    holdout: { trades: 0, winRate: null, avgR: null, note: "" },
    sampleEnough: false,
    samples: [],
    assumptions,
    note,
  };
}
