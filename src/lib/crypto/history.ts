import type { AnalysisResult, KillSwitchStatus, Regime } from "./types.ts";

const KEY = "alpha-spot-history-v2";
const WATCH_KEY = "alpha-spot-watch-v1";
const MAX = 12;

export type RunSummary = {
  at: string;
  pick: string;
  name: string;
  score: number;
  regime: Regime;
  dominance: number;
  rs7d: number;
  runnerUp: string | null;
  killStatus?: KillSwitchStatus;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadHistory(): RunSummary[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as RunSummary[];
    if (!Array.isArray(parsed)) return [];
    return parsed.slice(0, MAX);
  } catch {
    return [];
  }
}

export function saveRun(result: AnalysisResult): RunSummary[] {
  const row: RunSummary = {
    at: result.generatedAt,
    pick: result.pick.symbol,
    name: result.pick.name,
    score: result.pick.score,
    regime: result.regime,
    dominance: result.btcDominance,
    rs7d: result.pick.rs7d,
    runnerUp: result.runnerUp?.symbol ?? null,
    killStatus: result.killSwitch.status,
  };
  const prev = loadHistory().filter((r) => r.at !== row.at);
  const next = [row, ...prev].slice(0, MAX);
  if (canStore()) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}

export function loadWatch(): string[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(WATCH_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as string[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function toggleWatch(symbol: string): string[] {
  const current = loadWatch();
  const next = current.includes(symbol)
    ? current.filter((s) => s !== symbol)
    : [...current, symbol];
  if (canStore()) {
    try {
      localStorage.setItem(WATCH_KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}
