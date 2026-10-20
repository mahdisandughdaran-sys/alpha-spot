import { readCache, writeCache } from "./cache.server.ts";
import type { DominancePoint } from "./book.ts";

const KEY = "dom:cmc:v1";
const EARNED_KEY = "book:satellite-earned:v1";
const FRESH_SEC = 12 * 60 * 60;
const STALE_SEC = 14 * 24 * 60 * 60;
/** 1 Jan 2022. The untouched window starts here. */
const START_SEC = 1_640_995_200;

let memory: { at: number; points: DominancePoint[] } | null = null;
let memoryEarned: boolean | null = null;

export async function loadDominanceSeries(): Promise<DominancePoint[]> {
  if (memory && Date.now() - memory.at < FRESH_SEC * 1000 && memory.points.length > 100) {
    return memory.points;
  }
  const cached = await readCache(KEY, FRESH_SEC);
  const cachedPoints = cached ? parsePoints(cached) : [];
  if (cachedPoints.length > 100) {
    memory = { at: Date.now(), points: cachedPoints };
    return cachedPoints;
  }
  const fresh = await fetchSeries();
  if (fresh.length > 100) {
    memory = { at: Date.now(), points: fresh };
    await writeCache(KEY, JSON.stringify(fresh));
    return fresh;
  }
  const stale = await readCache(KEY, STALE_SEC);
  const stalePoints = stale ? parsePoints(stale) : [];
  if (stalePoints.length > 100) {
    memory = { at: Date.now(), points: stalePoints };
    return stalePoints;
  }
  return memory?.points ?? [];
}

/** Experiment cache. The live book does not read this as permission to buy an alt. */
export async function readSatelliteEarned(): Promise<boolean> {
  if (memoryEarned != null) return memoryEarned;
  const raw = await readCache(EARNED_KEY, STALE_SEC);
  if (!raw) return false;
  try {
    const parsed = JSON.parse(raw) as { earned?: boolean };
    memoryEarned = parsed.earned === true;
    return memoryEarned;
  } catch {
    return false;
  }
}

export async function rememberSatelliteEarned(earned: boolean): Promise<void> {
  memoryEarned = earned === true;
  await writeCache(EARNED_KEY, JSON.stringify({ earned: memoryEarned, at: new Date().toISOString() }));
}

async function fetchSeries(): Promise<DominancePoint[]> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  try {
    const end = Math.floor(Date.now() / 1000);
    const res = await fetch(
      `https://api.coinmarketcap.com/data-api/v3/global-metrics/quotes/historical?convertId=2781&interval=1d&timeStart=${START_SEC}&timeEnd=${end}`,
      {
        signal: ctrl.signal,
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0 AlphaSpot/1.4",
        },
      },
    );
    if (!res.ok) return [];
    const json = (await res.json()) as {
      data?: { quotes?: { timestamp?: string; btcDominance?: number }[] };
    };
    const quotes = json.data?.quotes;
    if (!Array.isArray(quotes)) return [];
    const points: DominancePoint[] = [];
    for (const row of quotes) {
      const t = Date.parse(row.timestamp ?? "");
      const v = row.btcDominance;
      if (!Number.isFinite(t) || v == null || !Number.isFinite(v)) continue;
      points.push({ t, v });
    }
    points.sort((a, b) => a.t - b.t);
    return points;
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

function parsePoints(raw: string): DominancePoint[] {
  try {
    const json = JSON.parse(raw) as DominancePoint[];
    if (!Array.isArray(json)) return [];
    return json
      .filter((point) => point && Number.isFinite(point.t) && Number.isFinite(point.v))
      .sort((a, b) => a.t - b.t);
  } catch {
    return [];
  }
}
