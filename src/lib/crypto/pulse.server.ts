import { readCache, writeCache } from "./cache.server.ts";
import { evaluateKillSwitch } from "./kill-switch.ts";
import type { KillSwitchStatus } from "./types.ts";

const BINANCE = "https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=220";
const KEY = "k:220:BTCUSDT";
const FRESH = 6 * 60 * 60;
const STALE = 14 * 24 * 60 * 60;

export type PulseResult = {
  at: string;
  status: KillSwitchStatus;
  priceUsd: number;
  headline: string;
  note: string;
  fromCache: boolean;
};

function closesOf(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  const out: number[] = [];
  for (const row of raw) {
    if (!Array.isArray(row)) continue;
    const c = Number(row[4]);
    if (Number.isFinite(c)) out.push(c);
  }
  return out;
}

async function loadRaw(): Promise<{ raw: unknown; fromCache: boolean } | null> {
  const fresh = await readCache(KEY, FRESH);
  if (fresh) {
    try {
      return { raw: JSON.parse(fresh) as unknown, fromCache: true };
    } catch {
      /* refetch */
    }
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  try {
    const res = await fetch(BINANCE, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.3" },
    });
    if (res.ok) {
      const raw = (await res.json()) as unknown;
      await writeCache(KEY, JSON.stringify(raw));
      return { raw, fromCache: false };
    }
  } catch {
    /* stale */
  } finally {
    clearTimeout(timer);
  }
  const stale = await readCache(KEY, STALE);
  if (!stale) return null;
  try {
    return { raw: JSON.parse(stale) as unknown, fromCache: true };
  } catch {
    return null;
  }
}

export async function pulseBtc(): Promise<PulseResult> {
  const loaded = await loadRaw();
  const closes = loaded ? closesOf(loaded.raw) : [];
  const priceUsd = closes[closes.length - 1] ?? 0;
  const kill = evaluateKillSwitch({ priceUsd, closes });
  return {
    at: new Date().toISOString(),
    status: kill.status,
    priceUsd,
    headline: kill.headline,
    note: kill.note,
    fromCache: loaded?.fromCache ?? false,
  };
}
