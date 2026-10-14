import { clamp, percentileRank, tanhScore } from "./math.ts";
import { FACTOR_WEIGHTS } from "./scoring.ts";
import type { CoinRow, FactorKey } from "./types.ts";

export type Horizon = "week" | "month";
export type WeightCuts = Partial<Record<FactorKey, number>>;

const FACTOR_KEYS = Object.keys(FACTOR_WEIGHTS) as FactorKey[];

function capRs(x: number): number {
  return Math.max(-0.35, Math.min(0.35, x));
}

/** Base weights stay. A cut only shrinks a factor that lagged Bitcoin, then the set is renormalized. */
export function normalizedWeights(cuts?: WeightCuts): Record<FactorKey, number> {
  const raw = FACTOR_KEYS.map((key) => {
    const cut = cuts?.[key];
    const multiplier = cut == null || !Number.isFinite(cut) ? 1 : Math.min(1, Math.max(0.7, cut));
    return [key, FACTOR_WEIGHTS[key] * multiplier] as const;
  });
  const sum = raw.reduce((total, [, weight]) => total + weight, 0) || 1;
  return Object.fromEntries(raw.map(([key, weight]) => [key, weight / sum])) as Record<FactorKey, number>;
}

function blendOf(row: CoinRow, horizon: Horizon): number {
  if (row.symbol === "BTC") return 0;
  const week = capRs(row.rs7d);
  const mid = capRs(row.rs14d ?? row.rs7d);
  const month = capRs(row.rs30d ?? row.rs7d);
  if (horizon === "week") return 0.72 * week + 0.18 * mid + 0.1 * month;
  return 0.15 * week + 0.15 * mid + 0.7 * month;
}

/**
 * Horizon changes which evidence the existing factors listen to.
 * Week: 7-day relative strength and entry. Month: 30-day strength, EMA200, weekly structure.
 * It does not add a factor and does not replace the published base weights.
 */
export function applyLens(rows: CoinRow[], horizon: Horizon, cuts?: WeightCuts): CoinRow[] {
  const weights = normalizedWeights(cuts);
  const blends = rows.map((row) => blendOf(row, horizon));
  return rows.map((row, index) => {
    const factors = row.factors.map((factor) => ({ ...factor }));
    const rs = factors.find((factor) => factor.key === "rs");
    if (rs && row.symbol !== "BTC") {
      const blend = blends[index] ?? 0;
      const p = percentileRank(blend, blends);
      const abs = tanhScore(blend, 0.12, 50);
      let score = 0.55 * p + 0.45 * abs;
      if (row.rs7d > 0.18) score -= 10;
      rs.score = clamp(score);
    }
    if (horizon === "week") {
      const entry = factors.find((factor) => factor.key === "entry");
      if (entry) entry.score = clamp(50 + (entry.score - 50) * 1.35);
    }
    if (horizon === "month") {
      const trend = factors.find((factor) => factor.key === "trend");
      if (trend) {
        let bump = 0;
        if (row.aboveEma200 === true) bump += 8;
        else if (row.aboveEma200 === false) bump -= 8;
        if (row.weeklyStructure === "bull") bump += 8;
        else if (row.weeklyStructure === "bear") bump -= 8;
        trend.score = clamp(trend.score + bump);
      }
    }
    const oldWeighted = row.factors.reduce((sum, factor) => sum + factor.score * FACTOR_WEIGHTS[factor.key], 0);
    const newWeighted = factors.reduce((sum, factor) => sum + factor.score * weights[factor.key], 0);
    for (const factor of factors) factor.weight = weights[factor.key] ?? factor.weight;
    return {
      ...row,
      factors,
      score: clamp(row.score + (newWeighted - oldWeighted)),
    };
  });
}
