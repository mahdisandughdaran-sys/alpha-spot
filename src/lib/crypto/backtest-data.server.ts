import { readCache, writeCache } from "./cache.server.ts";
import { BACKTEST_UNIVERSE, simulateSpotBacktest, type BtBar, type BacktestReport } from "./backtest.ts";

const BINANCE = "https://data-api.binance.vision/api/v3";
const FRESH_SEC = 12 * 60 * 60;
const STALE_SEC = 14 * 24 * 60 * 60;

type RawKline = [number, string, string, string, string, string, number, string];

function barsFrom(raw: unknown): BtBar[] {
  if (!Array.isArray(raw)) return [];
  const out: BtBar[] = [];
  for (const row of raw) {
    if (!Array.isArray(row)) continue;
    const t = Number(row[0]);
    const c = Number(row[4]);
    const q = Number(row[7]);
    if (!Number.isFinite(t) || !Number.isFinite(c) || c <= 0) continue;
    out.push({ t, c, q: Number.isFinite(q) ? q : 0 });
  }
  out.sort((a, b) => a.t - b.t);
  return out;
}

async function fetchWindow(symbol: string, endTime?: number): Promise<unknown[] | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12000);
  try {
    const end = endTime ? `&endTime=${endTime}` : "";
    const res = await fetch(
      `${BINANCE}/klines?symbol=${symbol}USDT&interval=1d&limit=1000${end}`,
      {
        signal: ctrl.signal,
        headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.3" },
      },
    );
    if (!res.ok) return null;
    const json = (await res.json()) as unknown;
    return Array.isArray(json) ? json : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function loadSymbol(symbol: string): Promise<BtBar[] | null> {
  const key = `k3y:${symbol}USDT`;
  const cached = await readCache(key, FRESH_SEC);
  if (cached) {
    const parsed = barsFrom(JSON.parse(cached) as unknown);
    if (parsed.length > 400) return parsed;
  }
  const recent = await fetchWindow(symbol);
  if (!recent || recent.length < 30) {
    const stale = await readCache(key, STALE_SEC);
    if (!stale) return null;
    const parsed = barsFrom(JSON.parse(stale) as unknown);
    return parsed.length > 200 ? parsed : null;
  }
  const first = recent[0] as RawKline | undefined;
  const older = first ? await fetchWindow(symbol, Number(first[0]) - 1) : null;
  const merged = [...(older ?? []), ...recent];
  const dedup = new Map<number, unknown>();
  for (const row of merged) {
    if (Array.isArray(row)) dedup.set(Number(row[0]), row);
  }
  const raw = [...dedup.values()].sort(
    (a, b) => Number((a as RawKline)[0]) - Number((b as RawKline)[0]),
  );
  const trimmed = raw.slice(-1200);
  await writeCache(key, JSON.stringify(trimmed));
  const bars = barsFrom(trimmed);
  return bars.length > 200 ? bars : null;
}

export async function runHistoricalBacktest(): Promise<BacktestReport> {
  const series: { symbol: string; name: string; rank: number; bars: BtBar[] }[] = [];
  const queue = [...BACKTEST_UNIVERSE];
  let cursor = 0;
  async function worker() {
    while (cursor < queue.length) {
      const item = queue[cursor++];
      if (!item) continue;
      const bars = await loadSymbol(item.symbol);
      if (bars) series.push({ ...item, bars });
    }
  }
  await Promise.all(Array.from({ length: 4 }, () => worker()));
  if (!series.some((s) => s.symbol === "BTC")) {
    return simulateSpotBacktest([]);
  }
  return simulateSpotBacktest(series);
}
