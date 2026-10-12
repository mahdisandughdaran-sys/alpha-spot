/** Volume-flow, estimated liquidation map, and the spot size formula.
 *  Position ($) = (capital × risk%) / stop%.
 *  Pure functions only — the server fetch lives in confluence.server.ts.
 */

export type FlowLabel =
  | "institutional"
  | "absorption"
  | "fake_pump"
  | "distribution"
  | "balanced";

export type Decision = "BUY" | "WAIT" | "AVOID";
export type EntryStyle = "market" | "limit_sweep" | "none";

export type FlowCandle = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  takerBuy: number;
};

export type FlowPoint = {
  t: number;
  delta: number;
  buyRatio: number;
  close: number;
};

export type FlowRead = {
  label: FlowLabel;
  buyRatio4h: number;
  buyRatio24h: number;
  delta4h: number;
  delta24h: number;
  cvdNorm: number;
  ret4h: number;
  ret24h: number;
  volumeAccel: number;
  buy24h: number;
  sell24h: number;
  points: FlowPoint[];
};

export type HeatCandle = {
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type LiqBin = {
  price: number;
  longHeat: number;
  shortHeat: number;
};

export type LiqCluster = {
  side: "long" | "short";
  price: number;
  low: number;
  high: number;
  heat: number;
  /** (cluster − spot) / spot. Negative means the pool sits under price. */
  distance: number;
};

export type LiqMap = {
  bins: LiqBin[];
  clusters: LiqCluster[];
};

export type MarketSkew = {
  longShortRatio: number | null;
  funding8h: number | null;
};

export type Judgement = {
  decision: Decision;
  entryStyle: EntryStyle;
  entryPrice: number | null;
  stopPrice: number | null;
  /** Fraction, 0.02 = 2%. */
  stopPct: number;
  insideWall: boolean;
  sweepZone: boolean;
  magnet: boolean;
  score: number;
  reasons: string[];
  alert: string;
};

export type ConfluenceReport = {
  symbol: string;
  pair: string;
  price: number;
  generatedAt: string;
  candleSource: "futures" | "spot";
  flow: FlowRead;
  map: LiqMap;
  funding8h: number | null;
  openInterestUsd: number | null;
  longShortRatio: number | null;
  futuresBuyRatio4h: number | null;
  judgement: Judgement;
};

const LEVERAGES: { lev: number; w: number }[] = [
  { lev: 5, w: 0.5 },
  { lev: 10, w: 1 },
  { lev: 25, w: 1.2 },
  { lev: 50, w: 0.9 },
  { lev: 100, w: 0.4 },
];
const MMR = 0.005;
const RANGE = 0.12;
const BINS = 42;

export function liquidationOfLong(entry: number, lev: number): number {
  return entry * (1 - 1 / lev + MMR);
}

export function liquidationOfShort(entry: number, lev: number): number {
  return entry * (1 + 1 / lev - MMR);
}

/** (capital × risk) / stop. Percents are fractions: 0.02 and 0.025. */
export function sizePosition(
  capitalUsd: number,
  riskPct: number,
  stopPct: number,
): { positionUsd: number; maxLossUsd: number } {
  const capital = Number.isFinite(capitalUsd) ? Math.max(0, capitalUsd) : 0;
  const risk = Number.isFinite(riskPct) ? Math.max(0, riskPct) : 0;
  const stop = Number.isFinite(stopPct) ? stopPct : 0;
  const maxLossUsd = capital * risk;
  if (!(stop > 0) || !(capital > 0) || !(risk > 0)) {
    return { positionUsd: 0, maxLossUsd };
  }
  return { positionUsd: maxLossUsd / stop, maxLossUsd };
}

function sum(xs: number[]): number {
  let s = 0;
  for (const x of xs) s += x;
  return s;
}

function mean(xs: number[]): number {
  if (xs.length === 0) return 0;
  return sum(xs) / xs.length;
}

function ratioOf(buy: number, volume: number): number {
  if (!(volume > 0)) return 0.5;
  return buy / volume;
}

export function classifyFlow(input: {
  buyRatio4h: number;
  buyRatio24h: number;
  cvdNorm: number;
  ret4h: number;
  volumeAccel: number;
}): FlowLabel {
  const hollow =
    input.ret4h > 0.025 &&
    (input.buyRatio4h < 0.48 || input.volumeAccel < 0.72 || input.cvdNorm < -0.04);
  const blowoff = input.ret4h > 0.045 && input.buyRatio4h < 0.52 && input.volumeAccel < 1;
  if (hollow || blowoff) return "fake_pump";
  if (input.buyRatio4h < 0.46 && input.buyRatio24h < 0.49 && input.cvdNorm < 0) {
    return "distribution";
  }
  if (
    input.buyRatio4h >= 0.545 &&
    input.buyRatio24h >= 0.515 &&
    input.cvdNorm > 0.02 &&
    !(input.ret4h > 0.06 && input.volumeAccel < 0.85)
  ) {
    return "institutional";
  }
  if (input.ret4h <= 0.005 && input.buyRatio4h >= 0.54 && input.cvdNorm > 0) {
    return "absorption";
  }
  return "balanced";
}

export function readFlow(bars: FlowCandle[]): FlowRead | null {
  if (bars.length < 8) return null;
  const usable = bars.filter(
    (bar) => bar.volume > 0 && bar.close > 0 && bar.takerBuy >= 0 && bar.takerBuy <= bar.volume * 1.001,
  );
  if (usable.length < 8) return null;

  const last = usable[usable.length - 1]!;
  const closeAt = (back: number) => usable[Math.max(0, usable.length - 1 - back)]!.close;
  const window = (n: number) => usable.slice(-n);
  const buyOf = (rows: FlowCandle[]) => sum(rows.map((row) => row.takerBuy));
  const volOf = (rows: FlowCandle[]) => sum(rows.map((row) => row.volume));

  const w4 = window(4);
  const w24 = window(Math.min(24, usable.length));
  const prev4 = usable.slice(-8, -4);
  const buy4 = buyOf(w4);
  const vol4 = volOf(w4);
  const buy24 = buyOf(w24);
  const vol24 = volOf(w24);
  const sell24 = Math.max(0, vol24 - buy24);
  const volPrev = volOf(prev4);

  const deltas = usable.map((bar) => bar.takerBuy - (bar.volume - bar.takerBuy));
  let cvd = 0;
  const cvdSeries = deltas.map((delta) => (cvd += delta));
  const back = Math.min(6, cvdSeries.length - 1);
  const cvdChange = cvdSeries[cvdSeries.length - 1]! - cvdSeries[cvdSeries.length - 1 - back]!;
  const avgVol = mean(usable.slice(-back).map((bar) => bar.volume)) || 1;
  const cvdNorm = cvdChange / (avgVol * back);

  const ret4h = closeAt(Math.min(4, usable.length - 1)) > 0 ? last.close / closeAt(4) - 1 : 0;
  const ret24h =
    closeAt(Math.min(24, usable.length - 1)) > 0 ? last.close / closeAt(Math.min(24, usable.length - 1)) - 1 : 0;
  const volumeAccel = volPrev > 0 ? vol4 / volPrev : 1;
  const buyRatio4h = ratioOf(buy4, vol4);
  const buyRatio24h = ratioOf(buy24, vol24);

  const points = usable.slice(-24).map((bar) => ({
    t: bar.t,
    delta: bar.takerBuy - (bar.volume - bar.takerBuy),
    buyRatio: ratioOf(bar.takerBuy, bar.volume),
    close: bar.close,
  }));

  return {
    label: classifyFlow({ buyRatio4h, buyRatio24h, cvdNorm, ret4h, volumeAccel }),
    buyRatio4h,
    buyRatio24h,
    delta4h: buy4 - (vol4 - buy4),
    delta24h: buy24 - sell24,
    cvdNorm,
    ret4h,
    ret24h,
    volumeAccel,
    buy24h: buy24,
    sell24h: sell24,
    points,
  };
}

export function buildLiquidationMap(bars: HeatCandle[], price: number, skew: MarketSkew): LiqMap {
  const empty: LiqMap = { bins: [], clusters: [] };
  if (!(price > 0) || bars.length < 8) return empty;

  const afterLow = new Array<number>(bars.length);
  const afterHigh = new Array<number>(bars.length);
  let minLow = Infinity;
  let maxHigh = 0;
  for (let i = bars.length - 1; i >= 0; i--) {
    afterLow[i] = minLow;
    afterHigh[i] = maxHigh;
    minLow = Math.min(minLow, bars[i]!.low);
    maxHigh = Math.max(maxHigh, bars[i]!.high);
  }

  let longMul = 1;
  let shortMul = 1;
  if (skew.longShortRatio != null && skew.longShortRatio > 0) {
    longMul *= Math.min(1.45, Math.max(0.75, skew.longShortRatio));
    shortMul *= Math.min(1.45, Math.max(0.75, 1 / skew.longShortRatio));
  }
  if (skew.funding8h != null) {
    if (skew.funding8h > 0.0003) longMul *= 1.12;
    if (skew.funding8h < -0.0001) shortMul *= 1.12;
  }

  const floor = price * (1 - RANGE);
  const ceil = price * (1 + RANGE);
  const span = ceil - floor;
  const longHeat = new Array<number>(BINS).fill(0);
  const shortHeat = new Array<number>(BINS).fill(0);

  const binOf = (px: number) => {
    const t = (px - floor) / span;
    return Math.max(0, Math.min(BINS - 1, Math.floor(t * BINS)));
  };

  for (let i = 0; i < bars.length - 2; i++) {
    const bar = bars[i]!;
    if (!(bar.volume > 0) || !(bar.close > 0) || !(bar.high > 0) || !(bar.low > 0)) continue;
    const entry = (bar.high + bar.low + bar.close) / 3;
    const age = bars.length - 1 - i;
    const decay = Math.exp(-age / 36);
    const weight = bar.volume * decay;
    for (const { lev, w } of LEVERAGES) {
      const longPx = liquidationOfLong(entry, lev);
      const shortPx = liquidationOfShort(entry, lev);
      if (longPx < price * 0.9975 && longPx > floor && afterLow[i]! > longPx) {
        longHeat[binOf(longPx)]! += weight * w * longMul;
      }
      if (shortPx > price * 1.0025 && shortPx < ceil && afterHigh[i]! < shortPx) {
        shortHeat[binOf(shortPx)]! += weight * w * shortMul;
      }
    }
  }

  const peak = Math.max(...longHeat, ...shortHeat, 1e-9);
  const bins: LiqBin[] = [];
  for (let i = 0; i < BINS; i++) {
    const longN = longHeat[i]! / peak;
    const shortN = shortHeat[i]! / peak;
    if (longN < 0.04 && shortN < 0.04) continue;
    const low = floor + (span * i) / BINS;
    const high = floor + (span * (i + 1)) / BINS;
    bins.push({ price: (low + high) / 2, longHeat: longN, shortHeat: shortN });
  }

  return { bins, clusters: [...clustersOf("long", longHeat, floor, span, price), ...clustersOf("short", shortHeat, floor, span, price)] };
}

function clustersOf(
  side: "long" | "short",
  heat: number[],
  floor: number,
  span: number,
  price: number,
): LiqCluster[] {
  const max = Math.max(...heat, 0);
  if (!(max > 0)) return [];
  const cut = max * 0.45;
  const groups: { sum: number; low: number; high: number; wpx: number }[] = [];
  let cur: { sum: number; low: number; high: number; wpx: number } | null = null;
  for (let i = 0; i < heat.length; i++) {
    const h = heat[i]!;
    const low = floor + (span * i) / BINS;
    const high = floor + (span * (i + 1)) / BINS;
    const mid = (low + high) / 2;
    const onSide = side === "long" ? mid < price : mid > price;
    if (h >= cut && onSide) {
      if (!cur) cur = { sum: 0, low, high, wpx: 0 };
      cur.sum += h;
      cur.high = high;
      cur.wpx += h * mid;
    } else if (cur) {
      groups.push(cur);
      cur = null;
    }
  }
  if (cur) groups.push(cur);
  const top = Math.max(...groups.map((group) => group.sum), 1);
  return groups
    .sort((a, b) => b.sum - a.sum)
    .slice(0, 3)
    .map((group) => {
      const px = group.wpx / group.sum;
      return {
        side,
        price: px,
        low: group.low,
        high: group.high,
        heat: group.sum / top,
        distance: (px - price) / price,
      };
    });
}

function pct(n: number, digits = 1): string {
  return `${(n * 100).toFixed(digits)}٪`;
}

function usd(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  return n.toPrecision(3);
}

export function flowSentence(flow: FlowRead): string {
  if (flow.label === "institutional") {
    return `نسبت خرید تیکر ۴ساعته ${pct(flow.buyRatio4h)} و ۲۴ساعته ${pct(flow.buyRatio24h)} است و دلتای تجمعی بالا می‌رود. این فشار خرید واقعی است، نه یک کندل خالی.`;
  }
  if (flow.label === "fake_pump") {
    return `قیمت ۴ساعته ${pct(flow.ret4h)} جابه‌جا شده ولی خریدار تیکر ${pct(flow.buyRatio4h)} مانده و شتاب حجم ${flow.volumeAccel.toFixed(2)} است. الگو پامپ توخالی است.`;
  }
  if (flow.label === "absorption") {
    return `قیمت ۴ساعته ${pct(flow.ret4h)} است ولی خریدار تیکر ${pct(flow.buyRatio4h)} جذب می‌کند. پول وارد می‌شود بدون جهش نمایشی.`;
  }
  if (flow.label === "distribution") {
    return `فروشنده تیکر غالب است (خرید ۴ساعته ${pct(flow.buyRatio4h)}) و دلتای تجمعی پایین می‌آید.`;
  }
  return `جریان نزدیک تعادل است: خرید ۴ساعته ${pct(flow.buyRatio4h)} و ۲۴ساعته ${pct(flow.buyRatio24h)}. به‌تنهایی مجوز ورود نمی‌دهد.`;
}

function clampStop(entry: number, stop: number): { stop: number; stopPct: number } {
  let pctStop = entry > 0 ? (entry - stop) / entry : 0.025;
  if (!(pctStop > 0)) pctStop = 0.025;
  pctStop = Math.min(0.08, Math.max(0.015, pctStop));
  return { stop: entry * (1 - pctStop), stopPct: pctStop };
}

export function judgeConfluence(input: {
  price: number;
  flow: FlowRead;
  clusters: LiqCluster[];
  funding8h: number | null;
  longShortRatio: number | null;
  futuresBuyRatio4h: number | null;
}): Judgement {
  const price = input.price;
  const longs = input.clusters.filter((cluster) => cluster.side === "long");
  const shorts = input.clusters.filter((cluster) => cluster.side === "short");
  const longWall = longs[0] ?? null;
  const shortWall = shorts[0] ?? null;

  const insideWall = longs.some(
    (cluster) =>
      cluster.heat >= 0.35 &&
      price <= cluster.high * 1.002 &&
      (price >= cluster.low * 0.998 || cluster.distance > -0.005),
  );
  const sweepWall =
    longs.find(
      (cluster) => cluster.heat >= 0.48 && cluster.distance <= -0.007 && cluster.distance >= -0.034,
    ) ?? null;
  const sweepZone = Boolean(sweepWall && !insideWall);
  const magnet = Boolean(
    shortWall && shortWall.heat >= 0.45 && shortWall.distance >= 0.008 && shortWall.distance <= 0.05,
  );

  let label = input.flow.label;
  const futuresSelling = input.futuresBuyRatio4h != null && input.futuresBuyRatio4h < 0.48;
  const diverged = futuresSelling && (label === "institutional" || label === "absorption");
  if (diverged) label = "balanced";

  let score = 50;
  if (label === "institutional") score += 24;
  else if (label === "absorption") score += 16;
  else if (label === "distribution") score -= 16;
  else if (label === "fake_pump") score -= 32;
  if (insideWall) score -= 30;
  else if (sweepZone) score += 18;
  else if (longWall && longWall.distance > -0.007) score -= 14;
  if (magnet) score += 8;
  if (input.flow.ret24h > 0.1) score -= 8;
  const crowded =
    input.longShortRatio != null &&
    input.longShortRatio > 2.1 &&
    input.funding8h != null &&
    input.funding8h > 0.0004;
  if (crowded) score -= 10;

  const hardAvoid = insideWall || input.flow.label === "fake_pump";
  const bid = label === "institutional" || label === "absorption";
  let decision: Decision;
  if (hardAvoid || score < 46) decision = "AVOID";
  else if (score >= 68 && bid) decision = "BUY";
  else decision = "WAIT";

  let entryStyle: EntryStyle = "none";
  let entryPrice: number | null = null;
  if (decision !== "AVOID" && sweepZone && sweepWall) {
    entryStyle = "limit_sweep";
    entryPrice = sweepWall.low * 0.998;
  } else if (decision === "BUY") {
    entryStyle = "market";
    entryPrice = price;
  } else if (decision === "WAIT" && longWall && longWall.distance < -0.004 && longWall.distance >= -0.05) {
    entryStyle = "limit_sweep";
    entryPrice = longWall.low * 0.998;
  }

  const anchor = entryPrice ?? price;
  const rawStop = longWall ? longWall.low * 0.993 : anchor * 0.975;
  const stopped = clampStop(anchor, rawStop);

  const reasons: string[] = [flowSentence(input.flow)];
  if (diverged) {
    reasons.push(
      `اسپات خریدار است ولی نسبت خرید تیکر فیوچرز ۴ساعته ${pct(input.futuresBuyRatio4h ?? 0)} است. همگرایی کامل نیست.`,
    );
  }
  if (insideWall && longWall) {
    reasons.push(
      `قیمت داخل دیوار لیکوییدیشن لانگ حول $${usd(longWall.price)} است. خرید بازار یعنی ایستادن جلوی آبشار.`,
    );
  } else if (sweepZone && sweepWall) {
    reasons.push(
      `خوشه لانگ سویپ‌نشده در $${usd(sweepWall.price)} نشسته، ${pct(Math.abs(sweepWall.distance))} زیر قیمت. ورود تمیز، لیمیت زیر خوشه است نه بازار.`,
    );
  } else if (longWall) {
    reasons.push(
      `نزدیک‌ترین استخر لانگ $${usd(longWall.price)} است (${pct(longWall.distance)}). دیوار چسبیده به قیمت نیست.`,
    );
  } else {
    reasons.push("زیر قیمت، خوشه لیکوییدیشن متراکم و هنوز سویپ‌نشده دیده نشد.");
  }
  if (magnet && shortWall) {
    reasons.push(
      `بالای قیمت استخر شورت در $${usd(shortWall.price)} است (${pct(shortWall.distance)}). اگر خریدار بماند، سوخت حرکت همان‌جاست.`,
    );
  }
  if (crowded) {
    reasons.push("فاندینگ مثبت و نسبت لانگ/شورت شلوغ است. اهرم سمت خرید ازدحام دارد.");
  } else if (input.longShortRatio != null && input.longShortRatio > 1.8) {
    reasons.push(`نسبت حساب‌های لانگ به شورت ${input.longShortRatio.toFixed(2)} است. سمت خرید فیوچرز شلوغ‌تر است.`);
  }
  if (input.flow.ret24h > 0.1) {
    reasons.push(`بازده ۲۴ساعته ${pct(input.flow.ret24h)} است. بخشی از حرکت خرج شده.`);
  }

  let alert: string;
  if (insideWall && longWall) {
    alert = `هشدار دیوار: لیکوییدیشن لانگ حول $${usd(longWall.price)} — فاصله ${pct(longWall.distance)}. خرید نکنید.`;
  } else if (sweepZone && sweepWall) {
    alert = `منطقه سویپ: خوشه لانگ $${usd(sweepWall.price)}، ${pct(Math.abs(sweepWall.distance))} پایین‌تر. لیمیت، نه بازار.`;
  } else if (magnet && shortWall) {
    alert = `آهنربای شورت در $${usd(shortWall.price)} بالای قیمت است.`;
  } else if (longWall) {
    alert = `دیوار لانگ در $${usd(longWall.price)} (${pct(Math.abs(longWall.distance))} دورتر) هنوز به قیمت نچسبیده.`;
  } else {
    alert = "خوشه لیکوییدیشن متراکم در باند ۱۲٪ دیده نشد.";
  }

  return {
    decision,
    entryStyle,
    entryPrice,
    stopPrice: stopped.stop,
    stopPct: stopped.stopPct,
    insideWall,
    sweepZone,
    magnet,
    score,
    reasons: reasons.slice(0, 5),
    alert,
  };
}
