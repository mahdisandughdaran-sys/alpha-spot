import { resolveSpotAsset } from "./spot-assets.ts";
import { buildSpotPlan, type SpotCandle, type SpotPlan } from "./spot-plan.ts";

const BINANCE = "https://data-api.binance.vision/api/v3/klines";
const TTL_MS = 2 * 60 * 1000;

export type SpotDesk = {
  assetId: string;
  fetchedAt: string;
  plan: SpotPlan;
};

const memory = new Map<string, { at: number; candles: SpotCandle[] }>();

export async function loadSpotPlan(assetId: string): Promise<SpotDesk> {
  const asset = resolveSpotAsset(assetId);
  if (!asset || !asset.enabled) throw new Error("این ارز هنوز روی میز اسپات فعال نشده.");
  const candles = await loadSpotCandles(asset.pair);
  if (candles.length < 20) throw new Error("کندل روزانه این جفت از بایننس کامل نرسید.");
  return {
    assetId: asset.id,
    fetchedAt: new Date().toISOString(),
    plan: buildSpotPlan(candles, asset),
  };
}

export async function loadSpotCandles(pair: string): Promise<SpotCandle[]> {
  const hit = memory.get(pair);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.candles;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 12_000);
  try {
    const res = await fetch(`${BINANCE}?symbol=${pair}&interval=1d&limit=240`, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.5" },
    });
    if (!res.ok) throw new Error(`بایننس پاسخ ${res.status} داد.`);
    const candles = parseKlines(await res.json());
    if (candles.length >= 20) memory.set(pair, { at: Date.now(), candles });
    return candles;
  } catch (err) {
    if (hit && hit.candles.length >= 20) return hit.candles;
    throw err instanceof Error ? err : new Error("داده بازار نرسید.");
  } finally {
    clearTimeout(timer);
  }
}

function parseKlines(raw: unknown): SpotCandle[] {
  if (!Array.isArray(raw)) return [];
  const out: SpotCandle[] = [];
  for (const row of raw) {
    if (!Array.isArray(row) || row.length < 6) continue;
    const candle = {
      t: Number(row[0]),
      o: Number(row[1]),
      h: Number(row[2]),
      l: Number(row[3]),
      c: Number(row[4]),
      v: Number(row[5]),
    };
    if (!Object.values(candle).every(Number.isFinite)) continue;
    if (!(candle.c > 0) || candle.h < candle.l) continue;
    out.push(candle);
  }
  return out;
}
