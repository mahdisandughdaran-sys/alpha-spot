import { assessUnlocks, emptyUnlock } from "./unlocks.ts";
import { readCache, writeCache } from "./cache.server.ts";
import type { UnlockAssessment } from "./types.ts";

const LISTING =
  "https://api.coinmarketcap.com/data-api/v3/token-unlock/listing";
const HISTORY =
  "https://api.coinmarketcap.com/data-api/v3/token-unlock/historical";

const CACHE_MS = 10 * 60 * 1000;
const UNLOCK_KEY = "unlocks:bundle:v1";
const UNLOCK_FRESH = 6 * 60 * 60;
const UNLOCK_STALE = 3 * 24 * 60 * 60;

type IndexRow = {
  cryptoId: number;
  symbol: string;
  maxSupply: number | null;
  totalSupply: number | null;
  cmcRank: number | null;
};

type CacheBox = {
  at: number;
  bySymbol: Map<string, UnlockAssessment>;
};

let cache: CacheBox | null = null;

async function fetchJson(url: string, ms = 8000): Promise<unknown | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "Mozilla/5.0 AlphaSpot/1.2",
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (
      json &&
      typeof json === "object" &&
      "status" in json &&
      json.status &&
      typeof json.status === "object" &&
      "error_code" in json.status &&
      String((json.status as { error_code?: unknown }).error_code ?? "0") !== "0"
    ) {
      return null;
    }
    return json;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function num(v: unknown): number | null {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  return Number.isFinite(n) ? n : null;
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let i = 0;
  async function worker() {
    while (i < items.length) {
      const idx = i++;
      out[idx] = await fn(items[idx] as T);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, () => worker()),
  );
  return out;
}

async function loadIndex(): Promise<Map<string, IndexRow>> {
  const map = new Map<string, IndexRow>();
  let start = 1;
  let total = 1200;
  for (let page = 0; page < 16; page++) {
    const url = `${LISTING}?start=${start}&limit=100&sort=next_unlock_date&direction=asc&enableSmallUnlocks=true`;
    const json = await fetchJson(url, 10000);
    const data =
      json && typeof json === "object" && "data" in json
        ? (json as { data?: { tokenUnlockList?: unknown[]; totalCount?: number } }).data
        : null;
    const list = data?.tokenUnlockList;
    if (!Array.isArray(list) || list.length === 0) break;
    if (typeof data?.totalCount === "number") total = data.totalCount;
    for (const raw of list) {
      if (!raw || typeof raw !== "object") continue;
      const row = raw as Record<string, unknown>;
      const symbol = typeof row.symbol === "string" ? row.symbol.toUpperCase() : "";
      const cryptoId = num(row.cryptoId);
      if (!symbol || cryptoId == null) continue;
      const cmcRank = num(row.cmcRank);
      const next: IndexRow = {
        cryptoId,
        symbol,
        maxSupply: num(row.maxSupply),
        totalSupply: num(row.totalSupply),
        cmcRank,
      };
      const prev = map.get(symbol);
      if (!prev || (cmcRank != null && (prev.cmcRank == null || cmcRank < prev.cmcRank))) {
        map.set(symbol, next);
      }
    }
    start += 100;
    if (start > total) break;
  }
  return map;
}

function readEvents(json: unknown): { time: string; amount: number; allocationName: string }[] {
  const data =
    json && typeof json === "object" && "data" in json
      ? (json as { data?: { tokenHistory?: unknown[] } }).data
      : null;
  const hist = data?.tokenHistory;
  if (!Array.isArray(hist)) return [];
  const events: { time: string; amount: number; allocationName: string }[] = [];
  for (const raw of hist) {
    if (!raw || typeof raw !== "object") continue;
    const row = raw as Record<string, unknown>;
    const time = typeof row.time === "string" ? row.time : "";
    const amount = num(row.amount);
    if (!time || amount == null || amount <= 0) continue;
    events.push({
      time,
      amount,
      allocationName: typeof row.allocationName === "string" ? row.allocationName : "",
    });
  }
  return events;
}

export async function loadUnlockAssessments(
  symbols: string[],
): Promise<{ source: "coinmarketcap" | "unavailable"; bySymbol: Map<string, UnlockAssessment> }> {
  const wanted = [...new Set(symbols.map((s) => s.toUpperCase()).filter((s) => s && s !== "BTC"))];
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    const covered = wanted.every((s) => cache!.bySymbol.has(s));
    if (covered) {
      return { source: "coinmarketcap", bySymbol: cache.bySymbol };
    }
  }

  const fresh = await readStoredUnlocks(UNLOCK_FRESH);
  if (fresh && wanted.every((s) => fresh.has(s))) {
    cache = { at: now, bySymbol: fresh };
    return { source: "coinmarketcap", bySymbol: fresh };
  }

  const index = await loadIndex();
  if (index.size === 0) {
    const stale = await readStoredUnlocks(UNLOCK_STALE);
    if (stale && [...stale.keys()].length > 0) {
      cache = { at: now, bySymbol: stale };
      return { source: "coinmarketcap", bySymbol: stale };
    }
    return { source: "unavailable", bySymbol: new Map() };
  }

  const targets = wanted
    .map((symbol) => index.get(symbol))
    .filter((row): row is IndexRow => Boolean(row));

  const assessed = await mapPool(targets, 8, async (row) => {
    const json = await fetchJson(`${HISTORY}?cryptoId=${row.cryptoId}`, 8000);
    if (!json) {
      return [row.symbol, emptyUnlock("تقویم این نماد الان پاسخ نداد.")] as const;
    }
    const events = readEvents(json);
    return [
      row.symbol,
      assessUnlocks({
        maxSupply: row.maxSupply,
        totalSupply: row.totalSupply,
        events,
      }),
    ] as const;
  });

  const bySymbol = new Map<string, UnlockAssessment>();
  for (const symbol of wanted) {
    if (!index.has(symbol)) {
      bySymbol.set(symbol, emptyUnlock());
    }
  }
  for (const [symbol, assessment] of assessed) {
    bySymbol.set(symbol, assessment);
  }

  cache = { at: now, bySymbol };
  await writeCache(
    UNLOCK_KEY,
    JSON.stringify([...bySymbol.entries()]),
  );
  return { source: "coinmarketcap", bySymbol };
}

async function readStoredUnlocks(maxAgeSec: number): Promise<Map<string, UnlockAssessment> | null> {
  const raw = await readCache(UNLOCK_KEY, maxAgeSec);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as [string, UnlockAssessment][];
    if (!Array.isArray(parsed)) return null;
    return new Map(parsed);
  } catch {
    return null;
  }
}
