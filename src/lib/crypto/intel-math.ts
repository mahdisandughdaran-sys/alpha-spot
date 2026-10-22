/** Pure spot-intelligence math. No network. Numbers are either measured inputs or labeled proxies. */

export type Candle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  /** Base-asset volume. */
  v: number;
  /** Taker-buy base volume. CVD uses this, not a guess. */
  tb: number;
};

export type FlowBias = "outflow" | "inflow" | "flat" | "unknown";
export type Zone = "capitulation" | "value" | "optimism" | "belief" | "euphoria" | "unknown";
export type SpotAction = "accumulate" | "watch" | "avoid";
export type SideBias = "buy" | "sell" | "flat";
export type DivergenceKind = "bullish" | "bearish" | "none";

export type IntelFactor = {
  key: string;
  labelFa: string;
  labelEn: string;
  score: number;
  weight: number;
  noteFa: string;
  noteEn: string;
};

export type DivergenceHit = {
  kind: DivergenceKind;
  tf: "1D" | "1W" | "both" | null;
  noteFa: string;
  noteEn: string;
};

export type MarketContext = {
  onchainScore: number;
  mvrv: number | null;
  nupl: number | null;
  flowBias: FlowBias;
  altSeason: number;
  fearGreed: number | null;
};

export type CoinMathInput = {
  symbol: string;
  candles: Candle[];
  mcFdv: number | null;
  tvlUsd: number | null;
  githubCommits14d: number | null;
  whaleNetUsd: number;
  whaleGrossUsd: number;
  btcRet30: number | null;
  market: MarketContext;
};

export type CoinMath = {
  price: number;
  change24h: number;
  ret30: number | null;
  rs30: number | null;
  rsi14: number | null;
  cvdBias: SideBias;
  cvdPath: number[];
  taker14: number | null;
  divergence: DivergenceHit;
  poc: number | null;
  pocDistancePct: number | null;
  whaleBias: SideBias;
  score: number;
  action: SpotAction;
  factors: IntelFactor[];
  reasonsFa: string[];
  reasonsEn: string[];
};

export function clamp(n: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, n));
}

/** NUPL = 1 − 1/MVRV. Same identity as (market − realized) / market. */
export function nuplFromMvrv(mvrv: number): number | null {
  if (!Number.isFinite(mvrv) || mvrv <= 0) return null;
  return 1 - 1 / mvrv;
}

export function mvrvZone(mvrv: number | null): Zone {
  if (mvrv == null || !Number.isFinite(mvrv)) return "unknown";
  if (mvrv < 1) return "capitulation";
  if (mvrv < 1.5) return "value";
  if (mvrv < 2.4) return "optimism";
  if (mvrv < 3.2) return "belief";
  return "euphoria";
}

export function nuplZone(nupl: number | null): Zone {
  if (nupl == null || !Number.isFinite(nupl)) return "unknown";
  if (nupl < 0) return "capitulation";
  if (nupl < 0.25) return "value";
  if (nupl < 0.5) return "optimism";
  if (nupl < 0.75) return "belief";
  return "euphoria";
}

/** Positive netflow means coins moved onto exchanges (sell pressure). */
export function exchangeNetflow(flowInUsd: number, flowOutUsd: number): number {
  return flowInUsd - flowOutUsd;
}

export function flowBiasOf(flowInUsd: number | null, flowOutUsd: number | null): FlowBias {
  if (flowInUsd == null || flowOutUsd == null) return "unknown";
  const gross = flowInUsd + flowOutUsd;
  if (!(gross > 0)) return "unknown";
  const net = flowInUsd - flowOutUsd;
  const share = net / gross;
  if (share > 0.015 || net > 250_000_000) return "inflow";
  if (share < -0.015 || net < -250_000_000) return "outflow";
  return "flat";
}

/**
 * Short-term profit proxy: spot price / 7-day VWAP.
 * Above 1 means recent coins are in profit. This is not ledger SOPR.
 */
export function soprProxy(candles: Candle[]): number | null {
  const slice = candles.slice(-7);
  let pv = 0;
  let v = 0;
  for (const c of slice) {
    if (!(c.v > 0) || !(c.c > 0)) continue;
    pv += c.c * c.v;
    v += c.v;
  }
  if (!(v > 0)) return null;
  const last = candles[candles.length - 1];
  if (!last || !(last.c > 0)) return null;
  return last.c / (pv / v);
}

export function onchainScore(
  mvrv: number | null,
  nupl: number | null,
  flowInUsd: number | null,
  flowOutUsd: number | null,
): number {
  let score = 50;
  if (mvrv != null) {
    if (mvrv < 1) score = 90;
    else if (mvrv < 1.5) score = 76;
    else if (mvrv < 2) score = 64;
    else if (mvrv < 2.5) score = 48;
    else if (mvrv < 3.2) score = 32;
    else score = 14;
  }
  if (nupl != null) {
    if (nupl < 0) score += 6;
    else if (nupl > 0.75) score -= 16;
    else if (nupl > 0.5) score -= 4;
  }
  const bias = flowBiasOf(flowInUsd, flowOutUsd);
  if (bias === "outflow") score += 8;
  if (bias === "inflow") score -= 8;
  return clamp(score, 0, 100);
}

export function rsiSeries(closes: number[], period = 14): Array<number | null> {
  const out: Array<number | null> = closes.map(() => null);
  if (closes.length <= period) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i++) {
    const delta = closes[i] - closes[i - 1];
    if (delta >= 0) gain += delta;
    else loss -= delta;
  }
  let avgGain = gain / period;
  let avgLoss = loss / period;
  const at = (i: number) => {
    out[i] = avgLoss === 0 ? 100 : 100 - 100 / (1 + avgGain / avgLoss);
  };
  at(period);
  for (let i = period + 1; i < closes.length; i++) {
    const delta = closes[i] - closes[i - 1];
    const g = delta > 0 ? delta : 0;
    const l = delta < 0 ? -delta : 0;
    avgGain = (avgGain * (period - 1) + g) / period;
    avgLoss = (avgLoss * (period - 1) + l) / period;
    at(i);
  }
  return out;
}

export function lastNumber(values: Array<number | null>): number | null {
  for (let i = values.length - 1; i >= 0; i--) {
    const v = values[i];
    if (v != null && Number.isFinite(v)) return v;
  }
  return null;
}

export function returnOver(candles: Candle[], days: number): number | null {
  if (candles.length <= days) return null;
  const then = candles[candles.length - 1 - days]?.c;
  const now = candles[candles.length - 1]?.c;
  if (then == null || now == null || !(then > 0)) return null;
  return now / then - 1;
}

export function takerRatio(candles: Candle[], days = 14): number | null {
  const slice = candles.slice(-days);
  let vol = 0;
  let buy = 0;
  for (const c of slice) {
    vol += c.v;
    buy += c.tb;
  }
  if (!(vol > 0)) return null;
  return buy / vol;
}

export function cvdPath(candles: Candle[], days = 30): number[] {
  const slice = candles.slice(-days);
  let acc = 0;
  return slice.map((c) => {
    acc += 2 * c.tb - c.v;
    return acc;
  });
}

export function biasFromRatio(ratio: number | null, buy = 0.52, sell = 0.48): SideBias {
  if (ratio == null) return "flat";
  if (ratio >= buy) return "buy";
  if (ratio <= sell) return "sell";
  return "flat";
}

export function toWeekly(daily: Candle[]): Candle[] {
  const weeks = new Map<number, Candle>();
  for (const c of daily) {
    const date = new Date(c.t);
    const utc = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
    const day = new Date(utc).getUTCDay();
    const mondayOffset = (day + 6) % 7;
    const key = utc - mondayOffset * 86_400_000;
    const prev = weeks.get(key);
    if (!prev) {
      weeks.set(key, { ...c, t: key });
      continue;
    }
    prev.h = Math.max(prev.h, c.h);
    prev.l = Math.min(prev.l, c.l);
    prev.c = c.c;
    prev.v += c.v;
    prev.tb += c.tb;
  }
  return [...weeks.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, candle]) => candle);
}

function swingIndexes(values: number[], span: number, mode: "low" | "high"): number[] {
  const out: number[] = [];
  for (let i = span; i < values.length - span; i++) {
    let ok = true;
    for (let j = i - span; j <= i + span; j++) {
      if (j === i) continue;
      if (mode === "low" && values[j] < values[i]) ok = false;
      if (mode === "high" && values[j] > values[i]) ok = false;
      if (!ok) break;
    }
    if (ok) out.push(i);
  }
  return out;
}

function pairDivergence(
  candles: Candle[],
  tf: "1D" | "1W",
): { kind: DivergenceKind; noteFa: string; noteEn: string } | null {
  if ((tf === "1D" && candles.length < 40) || (tf === "1W" && candles.length < 18)) return null;
  const closes = candles.map((c) => c.c);
  const rsi = rsiSeries(closes, 14);
  const recentCut = candles.length - (tf === "1D" ? 16 : 4);
  const lows = swingIndexes(
    candles.map((c) => c.l),
    tf === "1D" ? 3 : 1,
    "low",
  ).filter((i) => rsi[i] != null);
  const highs = swingIndexes(
    candles.map((c) => c.h),
    tf === "1D" ? 3 : 1,
    "high",
  ).filter((i) => rsi[i] != null);

  const lowPair = lastSeparated(lows, 5);
  if (lowPair && lowPair[1] >= recentCut) {
    const [a, b] = lowPair;
    const priceDown = candles[b].l < candles[a].l * 0.997;
    const rsiUp = (rsi[b] ?? 0) > (rsi[a] ?? 0) + 2;
    if (priceDown && rsiUp) {
      return {
        kind: "bullish",
        noteFa: `واگرایی صعودی ${tf}: کف قیمت پایین‌تر آمد ولی RSI بالاتر ماند.`,
        noteEn: `Bullish ${tf} divergence: price made a lower low while RSI made a higher low.`,
      };
    }
  }
  const highPair = lastSeparated(highs, 5);
  if (highPair && highPair[1] >= recentCut) {
    const [a, b] = highPair;
    const priceUp = candles[b].h > candles[a].h * 1.003;
    const rsiDown = (rsi[b] ?? 100) < (rsi[a] ?? 100) - 2;
    if (priceUp && rsiDown) {
      return {
        kind: "bearish",
        noteFa: `واگرایی نزولی ${tf}: سقف قیمت بالاتر رفت ولی RSI ضعیف‌تر شد.`,
        noteEn: `Bearish ${tf} divergence: price made a higher high while RSI made a lower high.`,
      };
    }
  }
  return null;
}

function lastSeparated(indexes: number[], gap: number): [number, number] | null {
  for (let i = indexes.length - 1; i >= 1; i--) {
    const b = indexes[i];
    const a = indexes[i - 1];
    if (b != null && a != null && b - a >= gap) return [a, b];
  }
  return null;
}

export function detectDivergence(daily: Candle[]): DivergenceHit {
  const weekly = toWeekly(daily);
  const day = pairDivergence(daily, "1D");
  const week = pairDivergence(weekly, "1W");
  if (day && week && day.kind === week.kind) {
    return {
      kind: day.kind,
      tf: "both",
      noteFa: `${day.noteFa} همین جهت روی نمودار هفتگی هم هست.`,
      noteEn: `${day.noteEn} The weekly chart agrees.`,
    };
  }
  if (week && week.kind !== "none") return { ...week, tf: "1W" };
  if (day && day.kind !== "none") return { ...day, tf: "1D" };
  return {
    kind: "none",
    tf: null,
    noteFa: "واگرایی تازهٔ RSI روی روزانه یا هفتگی دیده نشد.",
    noteEn: "No fresh RSI divergence on the daily or weekly chart.",
  };
}

export function volumePoc(candles: Candle[], bins = 24, lookback = 60): number | null {
  const slice = candles.slice(-lookback).filter((c) => c.h > c.l && c.v > 0 && c.c > 0);
  if (slice.length < 10) return null;
  const lo = Math.min(...slice.map((c) => c.l));
  const hi = Math.max(...slice.map((c) => c.h));
  if (!(hi > lo)) return null;
  const width = (hi - lo) / bins;
  const vols = Array.from({ length: bins }, () => 0);
  for (const c of slice) {
    const start = clamp(Math.floor((c.l - lo) / width), 0, bins - 1);
    const end = clamp(Math.floor((Math.max(c.h - 1e-9, c.l) - lo) / width), 0, bins - 1);
    const span = end - start + 1;
    const quote = c.v * c.c;
    for (let i = start; i <= end; i++) vols[i] += quote / span;
  }
  let best = 0;
  for (let i = 1; i < bins; i++) if (vols[i] > vols[best]) best = i;
  return lo + (best + 0.5) * width;
}

export type HeatBin = { price: number; bidUsd: number; askUsd: number };

export function bookHeat(
  bids: Array<[number, number]>,
  asks: Array<[number, number]>,
  bins = 18,
  band = 0.012,
): { mid: number; bins: HeatBin[] } | null {
  const bestBid = bids[0]?.[0];
  const bestAsk = asks[0]?.[0];
  if (bestBid == null || bestAsk == null || !(bestBid > 0) || !(bestAsk > 0)) return null;
  const mid = (bestBid + bestAsk) / 2;
  const lo = mid * (1 - band);
  const hi = mid * (1 + band);
  const width = (hi - lo) / bins;
  const rows: HeatBin[] = Array.from({ length: bins }, (_, i) => ({
    price: lo + (i + 0.5) * width,
    bidUsd: 0,
    askUsd: 0,
  }));
  const place = (price: number, usd: number, side: "bidUsd" | "askUsd") => {
    if (price < lo || price >= hi || !(usd > 0)) return;
    const i = clamp(Math.floor((price - lo) / width), 0, bins - 1);
    const row = rows[i];
    if (row) row[side] += usd;
  };
  for (const [price, qty] of bids) place(price, price * qty, "bidUsd");
  for (const [price, qty] of asks) place(price, price * qty, "askUsd");
  return { mid, bins: rows };
}

function rsiEntryScore(rsi: number | null): number {
  if (rsi == null) return 48;
  if (rsi >= 35 && rsi <= 55) return 86;
  if (rsi > 55 && rsi <= 62) return 70;
  if (rsi >= 28 && rsi < 35) return 62;
  if (rsi > 62 && rsi <= 70) return 42;
  if (rsi > 70) return 18;
  return 36;
}

function pullbackScore(candles: Candle[]): number {
  const slice = candles.slice(-30);
  if (slice.length < 10) return 50;
  const high = Math.max(...slice.map((c) => c.h));
  const last = slice[slice.length - 1]?.c ?? high;
  if (!(high > 0)) return 50;
  const dist = last / high - 1;
  if (dist > -0.03) return 28;
  if (dist > -0.12) return 72;
  if (dist > -0.28) return 88;
  if (dist > -0.45) return 58;
  return 40;
}

function pocScore(distancePct: number | null): number {
  if (distancePct == null) return 50;
  if (distancePct >= -6 && distancePct <= 2) return 86;
  if (distancePct > 2 && distancePct <= 8) return 62;
  if (distancePct > 8) return 34;
  if (distancePct >= -12) return 58;
  return 46;
}

function cvdFactor(ratio: number | null): number {
  if (ratio == null) return 50;
  return clamp(((ratio - 0.35) / 0.3) * 100, 0, 100);
}

function divergenceFactor(kind: DivergenceKind, tf: DivergenceHit["tf"]): number {
  if (kind === "bullish" && tf === "both") return 96;
  if (kind === "bullish") return 84;
  if (kind === "bearish" && tf === "both") return 8;
  if (kind === "bearish") return 20;
  return 48;
}

function relativeScore(symbol: string, rs30: number | null, altSeason: number): number {
  if (symbol === "BTC") {
    if (altSeason <= 25) return 84;
    if (altSeason >= 75) return 46;
    return 68;
  }
  if (rs30 == null) return 52;
  const pct = rs30 * 100;
  let score = 70;
  if (pct >= -8 && pct <= 12) score = 78;
  else if (pct > 12 && pct <= 25) score = 58;
  else if (pct > 25) score = 30;
  else if (pct >= -20) score = 62;
  else score = 38;
  if (altSeason >= 75) score += 6;
  if (altSeason <= 25) score -= 6;
  return clamp(score, 0, 100);
}

function qualityScore(mcFdv: number | null, tvlUsd: number | null, commits: number | null, candles: Candle[]): number {
  let parts = 0;
  let n = 0;
  if (mcFdv != null) {
    n += 1;
    if (mcFdv >= 0.75) parts += 86;
    else if (mcFdv >= 0.5) parts += 64;
    else if (mcFdv >= 0.3) parts += 42;
    else parts += 24;
  }
  if (tvlUsd != null) {
    n += 1;
    if (tvlUsd >= 1_000_000_000) parts += 84;
    else if (tvlUsd >= 100_000_000) parts += 70;
    else if (tvlUsd > 0) parts += 52;
    else parts += 40;
  }
  if (commits != null) {
    n += 1;
    if (commits >= 20) parts += 84;
    else if (commits >= 8) parts += 68;
    else if (commits >= 1) parts += 50;
    else parts += 36;
  }
  const vol = candles.slice(-7).reduce((sum, c) => sum + c.v * c.c, 0) / 7;
  n += 1;
  if (vol >= 500_000_000) parts += 86;
  else if (vol >= 50_000_000) parts += 70;
  else if (vol >= 10_000_000) parts += 54;
  else parts += 30;
  return parts / n;
}

function smartScore(whaleNet: number, whaleGross: number, taker: number | null): { score: number; bias: SideBias } {
  if (!(whaleGross > 0)) {
    const bias = biasFromRatio(taker);
    return { score: cvdFactor(taker), bias };
  }
  const share = whaleNet / whaleGross;
  const bias: SideBias = share > 0.12 ? "buy" : share < -0.12 ? "sell" : "flat";
  let score = clamp(50 + share * 45, 5, 95);
  if (taker != null && bias === "buy" && taker >= 0.52) score = clamp(score + 8, 0, 100);
  if (taker != null && bias === "sell" && taker <= 0.48) score = clamp(score - 8, 0, 100);
  if (taker != null && bias === "buy" && taker < 0.48) score = clamp(score - 10, 0, 100);
  return { score, bias };
}

function pct(n: number, digits = 1): string {
  return `${n > 0 ? "+" : ""}${n.toFixed(digits)}%`;
}

export function scoreCoin(input: CoinMathInput): CoinMath | null {
  const candles = input.candles.filter((c) => c.c > 0 && c.h >= c.l);
  if (candles.length < 40) return null;
  const last = candles[candles.length - 1];
  if (!last) return null;
  const prev = candles[candles.length - 2];
  const change24h = prev && prev.c > 0 ? last.c / prev.c - 1 : 0;
  const ret30 = returnOver(candles, 30);
  const rs30 =
    input.symbol === "BTC" || ret30 == null || input.btcRet30 == null ? (input.symbol === "BTC" ? 0 : null) : ret30 - input.btcRet30;
  const rsi14 = lastNumber(rsiSeries(candles.map((c) => c.c), 14));
  const taker14 = takerRatio(candles, 14);
  const cvdBias = biasFromRatio(taker14);
  const divergence = detectDivergence(candles);
  const poc = volumePoc(candles);
  const pocDistancePct = poc != null && poc > 0 ? (last.c / poc - 1) * 100 : null;
  const smart = smartScore(input.whaleNetUsd, input.whaleGrossUsd, taker14);

  const onchain = input.market.onchainScore;
  const entry = clamp(rsiEntryScore(rsi14) * 0.4 + pullbackScore(candles) * 0.35 + pocScore(pocDistancePct) * 0.25, 0, 100);
  const cvd = cvdFactor(taker14);
  const div = divergenceFactor(divergence.kind, divergence.tf);
  const relative = relativeScore(input.symbol, rs30, input.market.altSeason);
  const quality = qualityScore(input.mcFdv, input.tvlUsd, input.githubCommits14d, candles);

  const factors: IntelFactor[] = [
    {
      key: "onchain",
      labelFa: "رژیم آن‌چین بیت‌کوین",
      labelEn: "Bitcoin on-chain regime",
      score: round1(onchain),
      weight: 0.22,
      noteFa: onchainNote(input.market).fa,
      noteEn: onchainNote(input.market).en,
    },
    {
      key: "entry",
      labelFa: "نقطه ورود اسپات",
      labelEn: "Spot entry",
      score: round1(entry),
      weight: 0.18,
      noteFa: `RSI روزانه ${rsi14 == null ? "نامعلوم" : rsi14.toFixed(0)} و فاصله تا POC ${
        pocDistancePct == null ? "نامعلوم" : pct(pocDistancePct)
      }. خرید اسپات سقف داغ را جریمه می‌کند.`,
      noteEn: `Daily RSI ${rsi14 == null ? "unknown" : rsi14.toFixed(0)} and distance to POC ${
        pocDistancePct == null ? "unknown" : pct(pocDistancePct)
      }. Chasing a hot high is penalized.`,
    },
    {
      key: "cvd",
      labelFa: "دلتای حجم تجمعی",
      labelEn: "Cumulative volume delta",
      score: round1(cvd),
      weight: 0.16,
      noteFa: `سهم خریدار مهاجم در ۱۴ روز ${taker14 == null ? "نامعلوم" : pct(taker14 * 100, 1)} از حجم است.`,
      noteEn: `Aggressive buyers were ${taker14 == null ? "unknown" : pct(taker14 * 100, 1)} of volume over 14 days.`,
    },
    {
      key: "divergence",
      labelFa: "واگرایی چندزمانه",
      labelEn: "Multi-timeframe divergence",
      score: round1(div),
      weight: 0.14,
      noteFa: divergence.noteFa,
      noteEn: divergence.noteEn,
    },
    {
      key: "smart",
      labelFa: "پول هوشمند دفتر معاملات",
      labelEn: "Tape smart money",
      score: round1(smart.score),
      weight: 0.12,
      noteFa:
        input.whaleGrossUsd > 0
          ? `پرینت‌های بزرگ اخیر خالص ${compactUsd(input.whaleNetUsd)} هستند. این کیف‌پول نام‌دار نیست.`
          : "پرینت بزرگ تازه‌ای در نمونه نبود؛ فشار از دلتای حجم خوانده شد.",
      noteEn:
        input.whaleGrossUsd > 0
          ? `Recent large prints net ${compactUsd(input.whaleNetUsd)}. These are not named wallets.`
          : "No large print in the sample; pressure is read from volume delta.",
    },
    {
      key: "relative",
      labelFa: "قدرت نسبی در برابر بیت‌کوین",
      labelEn: "Relative strength vs Bitcoin",
      score: round1(relative),
      weight: 0.1,
      noteFa:
        input.symbol === "BTC"
          ? "خود بیت‌کوین وقتی آلت‌ها ضعیف‌اند امتیاز نگهداشت می‌گیرد."
          : `بازده ۳۰روزه نسبت به بیت‌کوین ${rs30 == null ? "نامعلوم" : pct(rs30 * 100)} است.`,
      noteEn:
        input.symbol === "BTC"
          ? "Bitcoin itself scores as the hold when alts are weak."
          : `30-day return versus Bitcoin is ${rs30 == null ? "unknown" : pct(rs30 * 100)}.`,
    },
    {
      key: "quality",
      labelFa: "کیفیت بنیادی",
      labelEn: "Fundamental quality",
      score: round1(quality),
      weight: 0.08,
      noteFa: qualityNote(input).fa,
      noteEn: qualityNote(input).en,
    },
  ];

  const weighted = factors.reduce((sum, f) => sum + f.score * f.weight, 0);
  let score = weighted;
  if (input.market.fearGreed != null) {
    if (input.market.fearGreed >= 80) score -= 4;
    if (input.market.fearGreed <= 25) score += 3;
  }
  score = round1(clamp(score, 0, 100));
  let action: SpotAction = score >= 70 ? "accumulate" : score >= 52 ? "watch" : "avoid";
  if (input.market.onchainScore < 28 && action === "accumulate") action = "watch";
  if (divergence.kind === "bearish" && divergence.tf === "both" && action === "accumulate") action = "watch";

  const ranked = [...factors].sort((a, b) => Math.abs(b.score - 50) * b.weight - Math.abs(a.score - 50) * a.weight);
  return {
    price: last.c,
    change24h,
    ret30,
    rs30,
    rsi14,
    cvdBias,
    cvdPath: cvdPath(candles, 30),
    taker14,
    divergence,
    poc,
    pocDistancePct,
    whaleBias: smart.bias,
    score,
    action,
    factors,
    reasonsFa: ranked.slice(0, 3).map((f) => f.noteFa),
    reasonsEn: ranked.slice(0, 3).map((f) => f.noteEn),
  };
}

function onchainNote(market: MarketContext): { fa: string; en: string } {
  const mvrv = market.mvrv == null ? "نامعلوم" : market.mvrv.toFixed(2);
  const nupl = market.nupl == null ? "نامعلوم" : market.nupl.toFixed(2);
  const flow =
    market.flowBias === "outflow"
      ? "خروج از صرافی غالب است"
      : market.flowBias === "inflow"
        ? "ورود به صرافی غالب است"
        : market.flowBias === "flat"
          ? "جریان صرافی متعادل است"
          : "جریان صرافی نامعلوم است";
  const flowEn =
    market.flowBias === "outflow"
      ? "exchange outflow dominates"
      : market.flowBias === "inflow"
        ? "exchange inflow dominates"
        : market.flowBias === "flat"
          ? "exchange flow is balanced"
          : "exchange flow is unknown";
  return {
    fa: `MVRV ${mvrv} و NUPL ${nupl}. ${flow}.`,
    en: `MVRV ${mvrv} and NUPL ${nupl}. ${flowEn}.`,
  };
}

function qualityNote(input: CoinMathInput): { fa: string; en: string } {
  const fdv = input.mcFdv == null ? "نامعلوم" : input.mcFdv.toFixed(2);
  const tvl = input.tvlUsd == null ? "ثبت نشده" : compactUsd(input.tvlUsd);
  const gh = input.githubCommits14d == null ? "نامعلوم" : String(input.githubCommits14d);
  return {
    fa: `نسبت ارزش بازار به FDV برابر ${fdv} است. TVL زنجیره ${tvl}. کامیت ۱۴روزه گیت‌هاب ${gh}.`,
    en: `Market cap to FDV is ${fdv}. Chain TVL ${tvl}. GitHub commits in 14 days: ${gh}.`,
  };
}

export function compactUsd(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B`;
  if (abs >= 1_000_000) return `${sign}$${(abs / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `${sign}$${(abs / 1_000).toFixed(0)}k`;
  return `${sign}$${Math.round(abs)}`;
}

export function altSeasonIndex(returns: Array<{ symbol: string; ret30: number | null }>, btcRet: number | null): number {
  if (btcRet == null) return 50;
  const alts = returns.filter((row) => row.symbol !== "BTC" && row.ret30 != null);
  if (!alts.length) return 50;
  const wins = alts.filter((row) => (row.ret30 ?? 0) > btcRet).length;
  return Math.round((wins / alts.length) * 100);
}

export function altSeasonCopy(index: number): { fa: string; en: string } {
  if (index >= 75) {
    return {
      fa: "فصل آلت: بیشتر نام‌ها در ۳۰ روز از بیت‌کوین جلوترند.",
      en: "Alt season: most names beat Bitcoin over 30 days.",
    };
  }
  if (index <= 25) {
    return {
      fa: "فصل بیت‌کوین: بیشتر آلت‌ها از BTC عقب‌اند. ورود آلت باید سخت‌گیرانه باشد.",
      en: "Bitcoin season: most alts lag BTC. Alt entries should be strict.",
    };
  }
  return {
    fa: "چرخه خنثی: نه فصل آلت است و نه سلطهٔ کامل بیت‌کوین.",
    en: "Neutral cycle: neither alt season nor a full Bitcoin grip.",
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export function whaleThreshold(symbol: string): number {
  if (symbol === "BTC") return 150_000;
  if (symbol === "ETH") return 80_000;
  if (symbol === "SOL" || symbol === "BNB") return 40_000;
  return 25_000;
}
