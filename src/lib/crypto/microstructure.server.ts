import { candidateBases } from "./exclusions.ts";
import { readCache, writeCache } from "./cache.server.ts";
import { assessBook, type BookLevel } from "./microstructure.ts";
import type { BookCheck } from "./types.ts";

const DEPTH = "https://data-api.binance.vision/api/v3/depth";
const FUNDING = "https://fapi.binance.com/fapi/v1/premiumIndex";
const FRESH_DEPTH = 90;
const FRESH_FUND = 15 * 60;

type DepthJson = { asks?: [string, string][] };
type FundJson = { lastFundingRate?: string };

async function fetchJson<T>(url: string, ms = 7000): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.3" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function levelsOf(raw: [string, string][] | undefined): BookLevel[] {
  if (!raw) return [];
  const out: BookLevel[] = [];
  for (const row of raw) {
    const price = Number(row[0]);
    const qty = Number(row[1]);
    if (Number.isFinite(price) && Number.isFinite(qty)) out.push({ price, qty });
  }
  return out;
}

async function depthFor(base: string): Promise<BookLevel[] | null> {
  const key = `depth:${base}USDT:100`;
  const fresh = await readCache(key, FRESH_DEPTH);
  if (fresh) {
    try {
      return levelsOf((JSON.parse(fresh) as DepthJson).asks);
    } catch {
      /* refetch */
    }
  }
  const json = await fetchJson<DepthJson>(`${DEPTH}?symbol=${base}USDT&limit=100`);
  if (!json?.asks) return null;
  await writeCache(key, JSON.stringify({ asks: json.asks.slice(0, 100) }));
  return levelsOf(json.asks);
}

async function fundingFor(base: string): Promise<number | null> {
  const key = `fund:${base}USDT`;
  const fresh = await readCache(key, FRESH_FUND);
  if (fresh) {
    const n = Number(fresh);
    if (Number.isFinite(n)) return n;
  }
  const json = await fetchJson<FundJson>(`${FUNDING}?symbol=${base}USDT`, 6000);
  if (!json?.lastFundingRate) return null;
  const n = Number(json.lastFundingRate);
  if (!Number.isFinite(n)) return null;
  await writeCache(key, String(n));
  return n;
}

async function oneBook(symbol: string): Promise<BookCheck> {
  const bases = candidateBases(symbol.toUpperCase());
  let asks: BookLevel[] | null = null;
  let funding: number | null = null;
  let used = bases[0] ?? symbol;
  for (const base of bases) {
    const got = await depthFor(base);
    if (got && got.length) {
      asks = got;
      used = base;
      funding = await fundingFor(base);
      break;
    }
  }
  if (!asks) {
    funding = await fundingFor(used);
  }
  return assessBook({
    symbol,
    asks: asks ?? [],
    funding8h: funding,
  });
}

export async function loadTopBooks(symbols: string[]): Promise<BookCheck[]> {
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))].filter((s) => s && s !== "BTC");
  const out: BookCheck[] = [];
  const queue = unique.slice(0, 8);
  let i = 0;
  async function worker() {
    while (i < queue.length) {
      const idx = i++;
      const symbol = queue[idx];
      if (!symbol) continue;
      try {
        out.push(await oneBook(symbol));
      } catch {
        out.push(
          assessBook({
            symbol,
            asks: [],
            funding8h: null,
          }),
        );
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, queue.length) }, () => worker()));
  return out;
}
