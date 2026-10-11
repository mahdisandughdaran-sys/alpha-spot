import { clamp, ema, mean, rsi, stdev } from "./math.ts";

/**
 * Fixed priors. They are not fitted on the backtest sample.
 * Each factor has one job. Relative strength only caps structure.
 * RSI and MACD only confirm. ATR only sizes the zone and the risk.
 * A lower price is never itself a point.
 */
export const OPPORTUNITY_WEIGHTS = {
  structure: 0.26,
  rewardRisk: 0.18,
  trend: 0.14,
  liquidity: 0.14,
  volume: 0.08,
  volatility: 0.08,
  proximity: 0.06,
  data: 0.06,
} as const;

export type OpportunityWeightKey = keyof typeof OPPORTUNITY_WEIGHTS;

export function opportunityWeightSum(): number {
  return Object.values(OPPORTUNITY_WEIGHTS).reduce((a, b) => a + b, 0);
}

export type OpportunityStatus =
  | "actionable"
  | "confirmed"
  | "in-zone"
  | "approaching"
  | "watching"
  | "invalidated"
  | "passed"
  | "unconfirmed";

export type OpportunityRisk = "low" | "medium" | "high";
export type OpportunityConfidence = "high" | "medium" | "low" | "unrated";
export type MarketRegime = "btc" | "alt" | "neutral";
export type SpotBuyMode = "open" | "reduced" | "suspended";

export type SpotBar = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
  q: number;
};

export type OpportunityInput = {
  symbol: string;
  name: string;
  rank: number;
  priceUsd: number;
  volume24h: number;
  turnover: number;
  bars: SpotBar[];
  btcCloses: number[];
};

export type ScorePart = {
  key: OpportunityWeightKey;
  label: string;
  score: number;
  weight: number;
  note: string;
};

export type PriceZone = {
  low: number;
  high: number;
  touches: number;
  invalidation: number;
  atr: number;
  reason: string;
};

export type ScenarioState = "waiting" | "active" | "met" | "failed" | "not-applicable";

export type OpportunityScenario = {
  key: "reach" | "confirm" | "invalidate" | "miss";
  title: string;
  state: ScenarioState;
  detail: string;
};

export type Opportunity = {
  symbol: string;
  name: string;
  rank: number;
  priceUsd: number;
  volume24h: number;
  updatedAt: string;
  status: OpportunityStatus;
  statusLabel: string;
  zone: PriceZone | null;
  distancePct: number | null;
  summary: string;
  confirmRules: string[];
  invalidateRules: string[];
  risk: OpportunityRisk;
  confidence: OpportunityConfidence;
  confidenceNote: string;
  score: number;
  parts: ScorePart[];
  helps: string[];
  hurts: string[];
  rewardRisk: number | null;
  targetUsd: number | null;
  blockedByKill: boolean;
  scenarios: OpportunityScenario[];
  path: { t: number; c: number }[];
};

export type OpportunityBoard = {
  generatedAt: string;
  scanned: number;
  withData: number;
  items: Opportunity[];
  actionable: Opportunity[];
  watch: Opportunity[];
  near: Opportunity[];
  inZone: Opportunity[];
  confirmed: Opportunity[];
  invalidated: Opportunity[];
  passed: Opportunity[];
  unconfirmed: Opportunity[];
  note: string;
};

const PART_LABEL: Record<OpportunityWeightKey, string> = {
  structure: "ساختار حمایت",
  rewardRisk: "نسبت سود به زیان",
  trend: "روند میانگین",
  liquidity: "نقدشوندگی",
  volume: "حجم",
  volatility: "نوسان",
  proximity: "فاصله تا محدوده",
  data: "کیفیت داده",
};

const STATUS_LABEL: Record<OpportunityStatus, string> = {
  actionable: "قابل بررسی",
  confirmed: "تأیید تکنیکال",
  "in-zone": "داخل محدوده، بدون تأیید",
  approaching: "نزدیک محدوده",
  watching: "در انتظار",
  invalidated: "نامعتبر",
  passed: "عبور بدون ورود",
  unconfirmed: "فرصت تأییدنشده",
};

export function emptyOpportunityBoard(generatedAt: string, note: string): OpportunityBoard {
  return {
    generatedAt,
    scanned: 0,
    withData: 0,
    items: [],
    actionable: [],
    watch: [],
    near: [],
    inZone: [],
    confirmed: [],
    invalidated: [],
    passed: [],
    unconfirmed: [],
    note,
  };
}

export function confirmationMet(input: {
  overlapped: boolean;
  held: boolean;
  rsiTurn: boolean;
  macdTurn: boolean;
  climaticSell: boolean;
}): boolean {
  return input.overlapped && input.held && (input.rsiTurn || input.macdTurn) && !input.climaticSell;
}

type Pivot = { index: number; price: number };

function atr(bars: SpotBar[], period = 14): number | null {
  if (bars.length < period + 1) return null;
  const trs: number[] = [];
  for (let i = 1; i < bars.length; i++) {
    const prev = bars[i - 1]!.c;
    const bar = bars[i]!;
    trs.push(Math.max(bar.h - bar.l, Math.abs(bar.h - prev), Math.abs(bar.l - prev)));
  }
  let value = mean(trs.slice(0, period));
  for (let i = period; i < trs.length; i++) {
    value = (value * (period - 1) + trs[i]!) / period;
  }
  return value > 0 ? value : null;
}

function pivotLows(bars: SpotBar[], left = 2, right = 2): Pivot[] {
  const out: Pivot[] = [];
  for (let i = left; i < bars.length - right; i++) {
    const price = bars[i]!.l;
    let ok = true;
    for (let j = i - left; j <= i + right; j++) {
      if (j !== i && bars[j]!.l <= price) {
        ok = false;
        break;
      }
    }
    if (ok) out.push({ index: i, price });
  }
  return out;
}

function pivotHighs(bars: SpotBar[], left = 2, right = 2): Pivot[] {
  const out: Pivot[] = [];
  for (let i = left; i < bars.length - right; i++) {
    const price = bars[i]!.h;
    let ok = true;
    for (let j = i - left; j <= i + right; j++) {
      if (j !== i && bars[j]!.h >= price) {
        ok = false;
        break;
      }
    }
    if (ok) out.push({ index: i, price });
  }
  return out;
}

function emaAt(values: number[], period: number): number | null {
  return ema(values, period);
}

function macdHist(closes: number[]): number | null {
  if (closes.length < 35) return null;
  const fast = emaSeries(closes, 12);
  const slow = emaSeries(closes, 26);
  if (!fast || !slow) return null;
  const macd: number[] = [];
  for (let i = 0; i < closes.length; i++) {
    const f = fast[i];
    const s = slow[i];
    if (f == null || s == null) macd.push(NaN);
    else macd.push(f - s);
  }
  const ready = macd.map((v, i) => (Number.isFinite(v) && i >= 25 ? v : null));
  const seq = ready.filter((v): v is number => v != null);
  if (seq.length < 9) return null;
  const signal = emaAt(seq, 9);
  const last = seq[seq.length - 1];
  if (signal == null || last == null) return null;
  return last - signal;
}

function emaSeries(values: number[], period: number): (number | null)[] | null {
  if (values.length < period) return null;
  const k = 2 / (period + 1);
  const out: (number | null)[] = Array.from({ length: values.length }, () => null);
  let prev = 0;
  for (let i = 0; i < period; i++) prev += values[i] ?? 0;
  prev /= period;
  out[period - 1] = prev;
  for (let i = period; i < values.length; i++) {
    prev = ((values[i] ?? 0) - prev) * k + prev;
    out[i] = prev;
  }
  return out;
}

function volumeZ(bars: SpotBar[]): number | null {
  const useQuote = bars.slice(-21).reduce((s, b) => s + b.q, 0) > 0;
  const seq = bars.slice(-21).map((b) => (useQuote ? b.q : b.v));
  if (seq.length < 8) return null;
  const last = seq[seq.length - 1] ?? 0;
  const base = seq.slice(0, -1);
  const sd = stdev(base);
  if (sd === 0) return 0;
  return (last - mean(base)) / sd;
}

function relativeStrength(closes: number[], btc: number[]): number | null {
  const n = Math.min(closes.length, btc.length, 31);
  if (n < 20) return null;
  const c0 = closes[closes.length - n];
  const c1 = closes[closes.length - 1];
  const b0 = btc[btc.length - n];
  const b1 = btc[btc.length - 1];
  if (!c0 || !c1 || !b0 || !b1) return null;
  return c1 / c0 - b1 / b0;
}

type ZonePick = {
  low: number;
  high: number;
  touches: number;
  lastIndex: number;
};

function supportZones(bars: SpotBar[], atrValue: number): ZonePick[] {
  const pivots = pivotLows(bars).filter((p) => p.index >= bars.length - 90);
  if (pivots.length === 0) return [];
  const band = Math.max(atrValue * 0.75, (bars[bars.length - 1]?.c ?? 1) * 0.012);
  const sorted = [...pivots].sort((a, b) => a.price - b.price);
  const groups: Pivot[][] = [];
  for (const pivot of sorted) {
    const current = groups[groups.length - 1];
    const anchor = current?.[0];
    if (!current || !anchor || pivot.price - anchor.price > band) groups.push([pivot]);
    else current.push(pivot);
  }
  return groups.map((group) => {
    const prices = group.map((g) => g.price);
    return {
      low: Math.min(...prices),
      high: Math.max(...prices),
      touches: group.length,
      lastIndex: Math.max(...group.map((g) => g.index)),
    };
  });
}

function chooseZone(
  bars: SpotBar[],
  atrValue: number,
  ema50: number | null,
): ZonePick | null {
  const price = bars[bars.length - 1]?.c ?? 0;
  if (price <= 0) return null;
  const zones = supportZones(bars, atrValue).filter((zone) => {
    const mid = (zone.low + zone.high) / 2;
    const notTooFar = (price - zone.high) / price <= 0.3;
    const stillRelevant = price >= zone.low * 0.9;
    return mid > 0 && notTooFar && stillRelevant;
  });
  const below = zones.filter((zone) => zone.high <= price * 0.998);
  const inside = zones.filter((zone) => price >= zone.low && price <= zone.high);
  const broken = zones.filter((zone) => price < zone.low && price >= zone.low * 0.9);
  const pool = below.length > 0 ? below : inside.length > 0 ? inside : broken;
  const ranked = pool.sort((a, b) => Math.abs(price - a.high) - Math.abs(price - b.high));
  for (const zone of ranked) {
    const mid = (zone.low + zone.high) / 2;
    const nearEma = ema50 != null && Math.abs(mid - ema50) <= atrValue;
    if (zone.touches >= 2 || (zone.touches === 1 && nearEma)) return zone;
  }
  return null;
}

function overlappedRecent(bars: SpotBar[], zone: ZonePick, lookback: number): boolean {
  return bars.slice(-lookback).some((bar) => bar.l <= zone.high && bar.h >= zone.low);
}

function rsiTurn(closes: number[]): boolean {
  const now = rsi(closes, 14);
  if (now == null || now <= 35) return false;
  let wasWeak = false;
  let earlier: number | null = null;
  for (let k = 0; k < 5; k++) {
    const value = rsi(closes.slice(0, closes.length - k), 14);
    if (k === 3) earlier = value;
    if (value != null && value < 38) wasWeak = true;
  }
  return wasWeak && earlier != null && now > earlier;
}

function macdTurn(closes: number[]): boolean {
  const now = macdHist(closes);
  const prev = macdHist(closes.slice(0, -1));
  if (now == null || prev == null) return false;
  return now > 0 && prev <= 0;
}

function rewardMultiple(
  bars: SpotBar[],
  zone: ZonePick,
  invalidation: number,
): { rr: number | null; target: number | null } {
  const mid = (zone.low + zone.high) / 2;
  const risk = mid - invalidation;
  if (risk <= 0) return { rr: null, target: null };
  const highs = pivotHighs(bars).filter((p) => p.price > zone.high * 1.01);
  const lastHigh = highs.length ? highs[highs.length - 1]!.price : null;
  const windowHigh = Math.max(...bars.slice(-40).map((b) => b.h));
  const target = lastHigh != null && lastHigh > mid ? Math.min(lastHigh, windowHigh) : windowHigh;
  if (target <= mid) return { rr: null, target: null };
  return { rr: (target - mid) / risk, target };
}

function part(
  key: OpportunityWeightKey,
  score: number,
  note: string,
): ScorePart {
  return {
    key,
    label: PART_LABEL[key],
    score: clamp(score),
    weight: OPPORTUNITY_WEIGHTS[key],
    note,
  };
}

export function evaluateAsset(
  input: OpportunityInput,
  ctx: { generatedAt: string; regime: MarketRegime; spotBuys: SpotBuyMode },
): Opportunity {
  const bars = input.bars.filter((b) => b.c > 0 && b.h > 0 && b.l > 0);
  const closes = bars.map((b) => b.c);
  const last = bars[bars.length - 1];
  const price = input.priceUsd > 0 ? input.priceUsd : (last?.c ?? 0);
  const base = {
    symbol: input.symbol,
    name: input.name,
    rank: input.rank,
    priceUsd: price,
    volume24h: input.volume24h,
    updatedAt: ctx.generatedAt,
    confirmRules: [
      "قیمت باید واقعاً داخل محدوده معامله شده باشد، نه فقط به آن نزدیک شده باشد.",
      "بسته شدن روزانه نباید زیر کف محدوده باشد.",
      "یا RSI از زیر ۳۸ برگشته و بالاتر از سه کندل قبل است، یا هیستوگرام MACD از منفی به مثبت چرخیده است.",
      "کندل نزولی با حجم غیرعادی (z بالای ۱٫۲) تأیید را باطل می‌کند.",
    ],
    invalidateRules: [
      "بسته شدن روزانه زیر کف محدوده منهای نصف ATR.",
      "یا دو بسته شدن پیاپی زیر کف محدوده.",
    ],
    path: bars.slice(-90).map((b, i) => ({ t: i, c: b.c })),
  };

  const unfinished = (
    summary: string,
    hurts: string[],
  ): Opportunity => ({
    ...base,
    status: "unconfirmed",
    statusLabel: STATUS_LABEL.unconfirmed,
    zone: null,
    distancePct: null,
    summary,
    risk: "high",
    confidence: "unrated",
    confidenceNote:
      "فرصت تأییدنشده است. سطح اطمینان وقتی اعلام می‌شود که هم داده کافی باشد و هم قوانین تأیید و ابطال قابل محاسبه باشند.",
    score: 0,
    parts: [],
    helps: [],
    hurts,
    rewardRisk: null,
    targetUsd: null,
    blockedByKill: ctx.spotBuys === "suspended",
    scenarios: [
      {
        key: "reach",
        title: "رسیدن به محدوده",
        state: "not-applicable",
        detail: "محدوده آزمون‌شده‌ای تعریف نشد.",
      },
      {
        key: "confirm",
        title: "تأیید تکنیکال",
        state: "not-applicable",
        detail: "بدون محدوده، تأیید ورود معنی ندارد.",
      },
      {
        key: "invalidate",
        title: "باطل شدن",
        state: "not-applicable",
        detail: "سطح ابطال عددی ندارد.",
      },
      {
        key: "miss",
        title: "عبور بدون ورود",
        state: "not-applicable",
        detail: "سناریوی تعقیب ساخته نشد.",
      },
    ],
  });

  if (!last || bars.length < 80) {
    return unfinished(
      `${input.symbol} کندل روزانه کافی برای ساخت حمایت، ATR و MACD ندارد. ارزان‌تر شدن آن فرصت محسوب نمی‌شود.`,
      ["داده روزانه ناکافی است."],
    );
  }

  const atrValue = atr(bars);
  if (atrValue == null) {
    return unfinished(`${input.symbol} نوسان قابل محاسبه ندارد.`, ["ATR ساخته نشد."]);
  }

  const ema50 = emaAt(closes, 50);
  const ema50Prev = emaAt(closes.slice(0, -5), 50);
  const zonePick = chooseZone(bars, atrValue, ema50);
  const high60 = Math.max(...bars.slice(-60).map((b) => b.h));
  const extended = price >= high60 * 0.96 || (rsi(closes, 14) ?? 0) >= 70;

  if (!zonePick) {
    return unfinished(
      extended
        ? `${input.symbol} نزدیک سقف اخیر است، اما حمایت آزمون‌شده‌ای زیر قیمت پیدا نشد. فقط به‌خاطر گران بودن به فهرست انتظار نمی‌رود.`
        : `${input.symbol} افت یا نوسان داشته، ولی دو برخورد یا تلاقی با EMA۵۰ در زیر قیمت دیده نشد. افت قیمت به‌تنهایی محدوده ورود نمی‌سازد.`,
      [extended ? "سقف اخیر بدون حمایت مشخص." : "حمایت تکرارشده پیدا نشد."],
    );
  }

  const pad = Math.min(atrValue * 0.15, price * 0.01);
  const zoneLow = Math.max(0, zonePick.low - pad);
  const zoneHigh = zonePick.high + pad;
  const invalidation = zoneLow - atrValue * 0.5;
  const zone: PriceZone = {
    low: zoneLow,
    high: zoneHigh,
    touches: zonePick.touches,
    invalidation,
    atr: atrValue,
    reason:
      zonePick.touches >= 2
        ? `${zonePick.touches} کف تأییدشده در ${formatPx(zoneLow)} تا ${formatPx(zoneHigh)}، با عرض کنترل‌شده توسط ATR.`
        : `یک کف تأییدشده نزدیک EMA۵۰ در ${formatPx(zoneLow)} تا ${formatPx(zoneHigh)}.`,
  };

  const prev = bars[bars.length - 2];
  const broken =
    last.c < invalidation || (prev != null && last.c < zoneLow && prev.c < zoneLow);
  const overlapped = overlappedRecent(bars, { ...zonePick, low: zoneLow, high: zoneHigh }, 3);
  const held = last.c >= zoneLow;
  const z = volumeZ(bars);
  const climaticSell = last.c < last.o && (z ?? 0) > 1.2;
  const turnRsi = rsiTurn(closes);
  const turnMacd = macdTurn(closes);
  const confirmed = confirmationMet({
    overlapped,
    held,
    rsiTurn: turnRsi,
    macdTurn: turnMacd,
    climaticSell,
  });
  const inZone = last.l <= zoneHigh && last.h >= zoneLow && last.c <= zoneHigh * 1.01;
  const distancePct = price > 0 ? (price - zoneHigh) / price : null;
  const pressingHigh = last.c >= high60 * 0.98;
  const missed =
    !overlappedRecent(bars, { ...zonePick, low: zoneLow, high: zoneHigh }, 12) &&
    last.c > zoneHigh * 1.08 &&
    pressingHigh &&
    bars.length - 1 - zonePick.lastIndex >= 12;

  let status: OpportunityStatus;
  if (broken) status = "invalidated";
  else if (confirmed) status = "confirmed";
  else if (inZone || (last.c <= zoneHigh && last.c >= zoneLow)) status = "in-zone";
  else if (missed) status = "passed";
  else if (distancePct != null && distancePct > 0 && distancePct <= 0.03) status = "approaching";
  else if (distancePct != null && distancePct > 0 && distancePct <= 0.22) status = "watching";
  else status = "unconfirmed";

  const rs = input.symbol === "BTC" ? 0 : relativeStrength(closes, input.btcCloses);
  let structure = zone.touches >= 3 ? 74 : zone.touches >= 2 ? 62 : 48;
  const lows = pivotLows(bars).slice(-2);
  if (lows.length === 2 && lows[1]!.price > lows[0]!.price) structure += 14;
  if (lows.length === 2 && lows[1]!.price < lows[0]!.price * 0.99) structure -= 22;
  if (ema50 != null && Math.abs((zoneLow + zoneHigh) / 2 - ema50) <= atrValue) structure += 8;
  if (rs != null && rs < -0.12) structure = Math.min(structure, 42);
  if (rs != null && rs > 0.05) structure = Math.min(100, structure + 6);

  const { rr, target } = rewardMultiple(bars, { ...zonePick, low: zoneLow, high: zoneHigh }, invalidation);
  const rrScore = rr == null ? 20 : clamp((rr / 3) * 100);

  let trend = 40;
  let trendNote = "میانگین ۵۰روزه نامشخص است.";
  if (ema50 != null && ema50Prev != null) {
    const rising = ema50 > ema50Prev;
    if (last.c >= ema50 && rising) {
      trend = 84;
      trendNote = "قیمت بالای EMA۵۰ است و خود میانگین صعودی است.";
    } else if (last.c >= ema50) {
      trend = 64;
      trendNote = "قیمت بالای EMA۵۰ است ولی شیب میانگین صاف یا منفی است.";
    } else if (rising) {
      trend = 46;
      trendNote = "قیمت زیر EMA۵۰ است؛ روند میانگین هنوز کاملاً نشکسته.";
    } else {
      trend = 22;
      trendNote = "قیمت و EMA۵۰ هر دو ضعیف‌اند. این اصلاح سالم نیست.";
    }
  }

  const volScore = volumeScore(input.volume24h);
  const turnScore = input.turnover >= 0.02 ? 85 : input.turnover >= 0.008 ? 60 : 35;
  const liquidity = volScore * 0.7 + turnScore * 0.3;
  const liquidityNote =
    input.volume24h >= 8_000_000
      ? "حجم تتری برای بررسی اسپات کافی است. اسپرد خام در این اسکن نیست."
      : input.volume24h >= 2_000_000
        ? "حجم قابل قبول است ولی برای اندازه بزرگ باید تب عمق جدا دیده شود."
        : "حجم پایین است. حتی اگر ساختار خوب باشد، اجرای سفارش خودش ریسک است.";

  let volume = 58;
  let volumeNote = "حجم نسبت به بیست روز اخیر عادی است.";
  if (z == null) {
    volume = 45;
    volumeNote = "سری حجم برای سنجش ناهنجاری کوتاه بود.";
  } else if (z > 2 && last.c < last.o) {
    volume = 24;
    volumeNote = "حجم غیرعادی روی کندل نزولی است؛ این تأیید خرید نیست.";
  } else if (z > 1.4 && last.c >= last.o && (status === "in-zone" || status === "confirmed")) {
    volume = 78;
    volumeNote = "حجم بالاتر از معمول همراه با بسته شدن مثبت داخل محدوده است.";
  } else if (z > 2) {
    volume = 48;
    volumeNote = "حجم بالا بیرون از تأیید محدوده، به‌تنهایی دلیل ورود نیست.";
  }

  const atrPct = atrValue / price;
  let volatility = 70;
  let volNote = `ATR حدود ${(atrPct * 100).toFixed(1)}٪ قیمت است.`;
  if (atrPct >= 0.02 && atrPct <= 0.06) {
    volatility = 86;
    volNote = `${volNote} برای محدوده روزانه قابل‌تعریف است.`;
  } else if (atrPct > 0.12) {
    volatility = 28;
    volNote = `${volNote} نوسان آن‌قدر زیاد است که محدوده به‌راحتی شکسته می‌شود.`;
  } else if (atrPct > 0.08) {
    volatility = 48;
  }

  let proximity = 20;
  let proxNote = "فاصله تا محدوده زیاد است و فقط به‌خاطر نزدیک بودن امتیاز نمی‌گیرد.";
  if (structure >= 48 && distancePct != null) {
    if (distancePct <= 0) {
      proximity = 68;
      proxNote = "قیمت داخل یا روی محدوده است. نزدیکی کیفیت ساخت محدوده را عوض نمی‌کند.";
    } else if (distancePct <= 0.03) {
      proximity = 80;
      proxNote = "کمتر از ۳٪ تا سقف محدوده مانده است.";
    } else if (distancePct <= 0.08) {
      proximity = 60;
      proxNote = "فاصله هنوز عملی است.";
    } else if (distancePct <= 0.15) {
      proximity = 42;
      proxNote = "باید منتظر ماند؛ عجله برای خرید قبل از محدوده توجیه ندارد.";
    }
  } else if (structure < 48) {
    proximity = 12;
    proxNote = "ساختار ضعیف است؛ نزدیک بودن به یک کف شکننده امتیاز نمی‌سازد.";
  }

  const data = bars.length >= 180 ? 92 : bars.length >= 120 ? 74 : 55;
  const parts = [
    part(
      "structure",
      structure,
      rs != null && rs < -0.12
        ? "کف‌ها شمرده شدند، اما سی‌روز اخیر در برابر بیت‌کوین ضعیف است و سقف ساختار محدود شد."
        : zone.reason,
    ),
    part(
      "rewardRisk",
      rrScore,
      rr == null
        ? "هدف قابل اندازه‌گیری بالای محدوده پیدا نشد."
        : `فاصله تا ابطال در برابر فاصله تا عرضه قبلی حدود ${rr.toFixed(2)} برابر است.`,
    ),
    part("trend", trend, trendNote),
    part("liquidity", liquidity, liquidityNote),
    part("volume", volume, volumeNote),
    part("volatility", volatility, volNote),
    part("proximity", proximity, proxNote),
    part("data", data, `${bars.length} کندل روزانه در محاسبه آمده و از آینده استفاده نشده است.`),
  ];

  let score = parts.reduce((sum, row) => sum + row.score * row.weight, 0);
  const hurts: string[] = [];
  const helps: string[] = [];
  for (const row of parts) {
    if (row.score >= 70) helps.push(`${row.label}: ${row.note}`);
    if (row.score < 45) hurts.push(`${row.label}: ${row.note}`);
  }
  if (ctx.regime === "btc" && input.symbol !== "BTC") {
    score -= 4;
    hurts.push("فصل نسبی بیت‌کوین است؛ آلت بدون ساختار قوی بالا نمی‌ماند.");
  }
  if (input.volume24h < 2_000_000) score = Math.min(score, 42);
  if (status === "invalidated" || status === "passed" || status === "unconfirmed") {
    score = Math.min(score, status === "unconfirmed" ? 35 : 48);
  }
  score = clamp(score);

  const tradable =
    status === "confirmed" &&
    (rr ?? 0) >= 1.2 &&
    structure >= 50 &&
    input.volume24h >= 2_000_000 &&
    ctx.spotBuys !== "suspended";
  if (tradable) status = "actionable";

  const blockedByKill = ctx.spotBuys === "suspended" && (status === "confirmed" || status === "actionable");
  if (blockedByKill) status = "confirmed";

  let confidence: OpportunityConfidence = "low";
  let confidenceNote =
    "قوانین نوشته شده‌اند اما ساختار یا نقدشوندگی ضعیف است. این نرخ برد تاریخی نیست.";
  if (status === "unconfirmed") {
    confidence = "unrated";
    confidenceNote = "فرصت تأییدنشده. عدد اطمینان ساخته نمی‌شود.";
  } else if (bars.length >= 160 && structure >= 60 && input.volume24h >= 8_000_000) {
    confidence = "high";
    confidenceNote =
      "داده و قوانین کامل‌اند. این سطح کیفیت تحلیل است، نه نتیجه بک‌تست. تا وقتی نمونه ارزیابی کافی نباشد، بازده آینده از آن نتیجه گرفته نمی‌شود.";
  } else if (bars.length >= 100 && structure >= 45) {
    confidence = "medium";
    confidenceNote =
      "سناریو قابل‌آزمون است، ولی یا تاریخچه کوتاه‌تر است یا ساختار فقط متوسط است. بک‌تست جدا باید خوانده شود.";
  }

  let risk: OpportunityRisk = "medium";
  if (atrPct > 0.08 || (rr ?? 0) < 1 || input.volume24h < 2_000_000 || status === "invalidated") {
    risk = "high";
  } else if (atrPct <= 0.05 && (rr ?? 0) >= 2 && structure >= 60 && input.volume24h >= 8_000_000) {
    risk = "low";
  }

  const distanceText =
    distancePct == null
      ? ""
      : distancePct <= 0
        ? "قیمت فعلی داخل محدوده است."
        : `قیمت فعلی حدود ${(distancePct * 100).toFixed(1)}٪ بالای سقف محدوده است.`;

  const summary = [
    `${input.name} (${input.symbol}) به‌خاطر ${zone.reason}`,
    distanceText,
    "رسیدن قیمت به این باند خرید نیست.",
    confirmed
      ? "قوانین تأیید در آخرین کندل برقرار شده‌اند و هنوز هم تضمین سود نیستند."
      : "برای تأیید، برگشت RSI از زیر ۳۸ یا چرخش هیستوگرام MACD همراه با ماندن قیمت در محدوده لازم است.",
    `باطل شدن: بسته شدن زیر ${formatPx(invalidation)}.`,
    status === "passed" ? "قیمت بدون لمس محدوده بالا رفته و سیستم آن را تعقیب نمی‌کند." : "",
    blockedByKill ? "کلید قطع بیت‌کوین خرید اسپات را معلق کرده؛ این فقط پایش است." : "",
  ]
    .filter(Boolean)
    .join(" ");

  const scenarios: OpportunityScenario[] = [
    {
      key: "reach",
      title: "رسیدن به محدوده",
      state: broken ? "failed" : overlapped || inZone || status === "confirmed" || status === "actionable" ? "met" : "waiting",
      detail: zone.reason,
    },
    {
      key: "confirm",
      title: "تأیید تکنیکال",
      state: status === "confirmed" || status === "actionable" ? "met" : inZone || overlapped ? "active" : "waiting",
      detail: turnRsi
        ? "RSI از ناحیه ضعیف برگشته است."
        : turnMacd
          ? "هیستوگرام MACD مثبت شده است."
          : "هنوز نه RSI و نه MACD شرایط تأیید را کامل نکرده‌اند.",
    },
    {
      key: "invalidate",
      title: "باطل شدن سناریو",
      state: status === "invalidated" ? "failed" : "waiting",
      detail: `بسته شدن زیر ${formatPx(invalidation)} یا دو کلوز زیر ${formatPx(zoneLow)}.`,
    },
    {
      key: "miss",
      title: "ادامه بدون ورود به محدوده",
      state: status === "passed" ? "met" : "waiting",
      detail:
        status === "passed"
          ? "قیمت بدون ساختن شرط ورود از محدوده فاصله گرفته. خرید تعقیبی صادر نمی‌شود."
          : "اگر قیمت بدون لمس محدوده بیش از ۸٪ از سقف آن دور شود، سناریو به تعقیب تبدیل نمی‌شود.",
    },
  ];

  return {
    ...base,
    status,
    statusLabel: STATUS_LABEL[status],
    zone,
    distancePct,
    summary,
    risk,
    confidence,
    confidenceNote,
    score,
    parts,
    helps: helps.slice(0, 4),
    hurts: hurts.slice(0, 4),
    rewardRisk: rr,
    targetUsd: target,
    blockedByKill,
    scenarios,
  };
}

function volumeScore(volume24h: number): number {
  if (volume24h >= 20_000_000) return 90;
  if (volume24h >= 8_000_000) return 74;
  if (volume24h >= 2_000_000) return 55;
  return 22;
}

function formatPx(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(4);
}

export function scanOpportunities(
  inputs: OpportunityInput[],
  ctx: { generatedAt: string; regime: MarketRegime; spotBuys: SpotBuyMode },
): OpportunityBoard {
  const items = inputs
    .map((row) => evaluateAsset(row, ctx))
    .sort((a, b) => b.score - a.score || a.rank - b.rank);
  const pick = (status: OpportunityStatus) => items.filter((row) => row.status === status);
  const withData = items.filter((row) => row.zone != null || row.path.length >= 80).length;
  return {
    generatedAt: ctx.generatedAt,
    scanned: items.length,
    withData,
    items,
    actionable: pick("actionable"),
    watch: pick("watching"),
    near: pick("approaching"),
    inZone: pick("in-zone"),
    confirmed: pick("confirmed"),
    invalidated: pick("invalidated"),
    passed: pick("passed"),
    unconfirmed: pick("unconfirmed"),
    note:
      "رتبه از ساختار، نسبت محدوده تا ابطال، روند EMA، نقدشوندگی، حجم، نوسان، فاصله و کیفیت داده ساخته می‌شود. درصد افت از سقف عامل جداگانه‌ای نیست.",
  };
}
