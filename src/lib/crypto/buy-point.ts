import type { PairPoint } from "./types.ts";

export type BuyPoint = {
  index: number;
  value: number;
  day: number;
  pullbackPct: number;
  sincePct: number;
  recovered: boolean;
  nearNow: boolean;
  flat: boolean;
};

/** Best spot entry on an indexed series: a healthy pullback that later held. */
export function findBestBuyPoint(series: PairPoint[]): BuyPoint | null {
  if (series.length < 5) return null;
  const values = series.map((point) => point.v);
  const hi = Math.max(...values);
  const lo = Math.min(...values);
  if (!(hi > 0) || !(lo > 0)) return null;

  const last = values[values.length - 1] ?? hi;
  if ((hi - lo) / hi < 0.008) {
    return {
      index: values.length - 1,
      value: last,
      day: values.length,
      pullbackPct: 0,
      sincePct: 0,
      recovered: false,
      nearNow: true,
      flat: true,
    };
  }

  const candidates = new Set<number>();
  for (let i = 1; i < values.length - 1; i++) {
    if (values[i] <= values[i - 1] && values[i] < values[i + 1]) candidates.add(i);
  }
  const argmin = values.indexOf(lo);
  if (argmin > 0 && argmin < values.length - 1) candidates.add(argmin);
  if (candidates.size === 0) candidates.add(Math.min(values.length - 2, Math.max(1, argmin)));

  let bestI = 1;
  let bestScore = -Infinity;
  for (const i of candidates) {
    const v = values[i] ?? 0;
    const priorHigh = Math.max(...values.slice(0, i + 1));
    const pullback = priorHigh > 0 ? (priorHigh - v) / priorHigh : 0;
    const after = values.slice(i + 1);
    const recovered = after.some((x) => x >= v * 1.025);
    let score = 8;
    if (pullback >= 0.08 && pullback <= 0.18) score = 100;
    else if (pullback > 0.18 && pullback <= 0.28) score = 74;
    else if (pullback >= 0.05 && pullback < 0.08) score = 58;
    else if (pullback > 0.28 && pullback <= 0.4) score = 36;
    else if (pullback > 0.4) score = 18;
    if (recovered) score += 22;
    if (i >= values.length - 2 && !recovered) score -= 28;
    score += (i / (values.length - 1)) * 6;
    score += Math.min(pullback, 0.2) * 10;
    if (score > bestScore) {
      bestScore = score;
      bestI = i;
    }
  }

  const value = values[bestI] ?? last;
  const priorHigh = Math.max(...values.slice(0, bestI + 1));
  const pullbackPct = priorHigh > 0 ? ((priorHigh - value) / priorHigh) * 100 : 0;
  const sincePct = value > 0 ? ((last - value) / value) * 100 : 0;
  const after = values.slice(bestI + 1);
  const recovered = after.some((x) => x >= value * 1.025);
  const nearNow = value > 0 && (Math.abs(last - value) / value <= 0.02 || (bestI >= values.length - 3 && last <= value * 1.03));

  return {
    index: bestI,
    value,
    day: bestI + 1,
    pullbackPct,
    sincePct,
    recovered,
    nearNow,
    flat: false,
  };
}
