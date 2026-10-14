import type { WeightCuts } from "./lens.ts";
import type { FactorKey, Regime } from "./types.ts";

/** Same turnover cost the backtest already uses. Applied to the suggestion and to Bitcoin. */
export const REPORT_FEE = 0.0015;
const DAY = 86_400_000;

export type ReportKind = "buy" | "wait" | "stay";

export type StoredSuggestion = {
  id: string;
  at: string;
  symbol: string;
  name: string;
  priceUsd: number;
  btcPriceUsd: number;
  kind: ReportKind;
  regime: Regime;
  factors: { key: FactorKey; score: number }[];
  applied7: boolean;
  applied30: boolean;
};

export type RegimeBucket = {
  regime: Regime;
  n7: number;
  excess7: number | null;
  n30: number;
  excess30: number | null;
};

const FACTOR_KEYS: FactorKey[] = ["rs", "tokenomics", "entry", "trend", "liquidity", "risk", "narrative"];

export function netReturn(thenPx: number, nowPx: number): number | null {
  if (!(thenPx > 0) || !(nowPx > 0)) return null;
  return (nowPx / thenPx) * (1 - REPORT_FEE) - 1;
}

export function excessVsBtc(
  row: StoredSuggestion,
  priceNow: number | null,
  btcNow: number,
): number | null {
  const holdingBtc = row.kind === "stay" || row.symbol === "BTC";
  const thenPx = holdingBtc ? row.btcPriceUsd : row.priceUsd;
  const nowPx = holdingBtc ? btcNow : priceNow;
  if (nowPx == null) return null;
  const asset = netReturn(thenPx, nowPx);
  const btc = netReturn(row.btcPriceUsd, btcNow);
  if (asset == null || btc == null) return null;
  return asset - btc;
}

function mean(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

export function regimeBuckets(
  rows: StoredSuggestion[],
  priceOf: (symbol: string) => number | null,
  btcNow: number,
  now = Date.now(),
): RegimeBucket[] {
  const regimes: Regime[] = ["btc", "alt", "neutral"];
  return regimes.map((regime) => {
    const group = rows.filter((row) => row.regime === regime);
    const excess = (days: number) => {
      const values: number[] = [];
      for (const row of group) {
        if (now - Date.parse(row.at) < days * DAY) continue;
        const value = excessVsBtc(row, priceOf(row.symbol), btcNow);
        if (value != null) values.push(value);
      }
      return { n: values.length, excess: mean(values) };
    };
    const d7 = excess(7);
    const d30 = excess(30);
    return { regime, n7: d7.n, excess7: d7.excess, n30: d30.n, excess30: d30.excess };
  });
}

function cloneCuts(cuts: WeightCuts): WeightCuts {
  return { ...cuts };
}

/**
 * Once a 7-day or 30-day window has matured, compare it with Bitcoin after fees.
 * If that window lagged, shrink the weakest factor on the losing names. One step per window.
 */
export function settleReport(
  rows: StoredSuggestion[],
  priceOf: (symbol: string) => number | null,
  btcNow: number,
  cuts: WeightCuts,
  now = Date.now(),
): { rows: StoredSuggestion[]; cuts: WeightCuts; lagged: boolean; weak: FactorKey | null } {
  const nextRows = rows.map((row) => ({ ...row, factors: row.factors.map((factor) => ({ ...factor })) }));
  const nextCuts = cloneCuts(cuts);
  let lagged = false;
  let weak: FactorKey | null = null;

  const applyWindow = (days: 7 | 30, flag: "applied7" | "applied30") => {
    const fresh = nextRows.filter((row) => !row[flag] && now - Date.parse(row.at) >= days * DAY);
    const judged = fresh
      .map((row) => ({ row, excess: excessVsBtc(row, priceOf(row.symbol), btcNow) }))
      .filter((item): item is { row: StoredSuggestion; excess: number } => item.excess != null);
    if (!judged.length) return;
    for (const item of judged) item.row[flag] = true;
    const avg = mean(judged.map((item) => item.excess)) ?? 0;
    if (avg >= 0) return;
    lagged = true;
    const losers = judged.filter((item) => item.excess < 0 && item.row.kind !== "stay" && item.row.symbol !== "BTC");
    if (!losers.length) return;
    let worst = Infinity;
    let found: FactorKey | null = null;
    for (const key of FACTOR_KEYS) {
      const scores = losers.flatMap((item) => item.row.factors.filter((factor) => factor.key === key).map((factor) => factor.score));
      if (!scores.length) continue;
      const score = mean(scores) ?? 100;
      if (score < worst) {
        worst = score;
        found = key;
      }
    }
    if (!found) return;
    weak = found;
    const prev = nextCuts[found] ?? 1;
    nextCuts[found] = Math.max(0.7, prev * 0.9);
  };

  applyWindow(7, "applied7");
  applyWindow(30, "applied30");
  return { rows: nextRows, cuts: nextCuts, lagged, weak };
}

const SUGGEST_KEY = "alpha-spot-suggestions-v1";
const CUT_KEY = "alpha-spot-weight-cuts-v1";

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadSuggestions(): StoredSuggestion[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(SUGGEST_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as StoredSuggestion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSuggestions(rows: StoredSuggestion[]) {
  if (!canStore()) return;
  try {
    localStorage.setItem(SUGGEST_KEY, JSON.stringify(rows.slice(0, 80)));
  } catch {
    /* quota */
  }
}

export function loadCuts(): WeightCuts {
  if (!canStore()) return {};
  try {
    const raw = localStorage.getItem(CUT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as WeightCuts;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function saveCuts(cuts: WeightCuts) {
  if (!canStore()) return;
  try {
    localStorage.setItem(CUT_KEY, JSON.stringify(cuts));
  } catch {
    /* quota */
  }
}

export function rememberSuggestion(rows: StoredSuggestion[], row: StoredSuggestion): StoredSuggestion[] {
  if (rows.some((item) => item.id === row.id)) return rows;
  return [row, ...rows].slice(0, 80);
}
