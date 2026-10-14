import { parseVenueBases } from "./listings.ts";
import type { VenueId } from "./venues.ts";

const URLS: Record<VenueId, string[]> = {
  nobitex: ["https://apiv2.nobitex.ir/market/stats"],
  wallex: ["https://api.wallex.ir/v1/markets"],
  ompfinex: ["https://api.ompfinex.com/v1/market", "https://api.ompfinex.com/v2/markets"],
  binance: ["https://data-api.binance.vision/api/v3/ticker/price"],
  bybit: ["https://api.bybit.com/v5/market/instruments-info?category=spot&limit=1000"],
};

export type VenueListing = { ok: true; bases: string[] } | { ok: false };

const memory = new Map<VenueId, { at: number; bases: string[] }>();
const FRESH_MS = 10 * 60 * 1000;

async function fetchJson(url: string): Promise<unknown | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.1" },
    });
    if (!res.ok) return null;
    return (await res.json()) as unknown;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function loadVenueListing(venue: VenueId): Promise<VenueListing> {
  const hit = memory.get(venue);
  if (hit && Date.now() - hit.at < FRESH_MS) return { ok: true, bases: hit.bases };
  for (const url of URLS[venue]) {
    const payload = await fetchJson(url);
    const bases = payload ? parseVenueBases(venue, payload) : null;
    if (bases && bases.length > 0) {
      memory.set(venue, { at: Date.now(), bases });
      return { ok: true, bases };
    }
  }
  return { ok: false };
}
