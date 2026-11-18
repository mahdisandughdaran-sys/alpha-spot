import { msg } from "@/lib/i18n/lex";
import { readChart, type Candle, type IntervalId, type TaRead } from "./ta.ts";

const TTL = 45_000;
const memory = new Map<string, { at: number; row: TaRead }>();

type RawKline = [number, string, string, string, string, string, number];

async function fetchJson<T>(url: string): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.6" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function candlesFrom(rows: RawKline[]): Candle[] {
  const out: Candle[] = [];
  for (const row of rows) {
    const open = Number(row[1]);
    const high = Number(row[2]);
    const low = Number(row[3]);
    const close = Number(row[4]);
    const volume = Number(row[5]);
    if (!(close > 0) || !(high >= low)) continue;
    out.push({
      t: Number(row[0]),
      open,
      high,
      low,
      close,
      volume: Number.isFinite(volume) ? volume : 0,
      closeTime: Number(row[6]),
    });
  }
  return out;
}

async function fetchCandles(symbol: string, interval: IntervalId): Promise<Candle[] | null> {
  const hosts = ["https://data-api.binance.vision", "https://api.binance.com"];
  for (const host of hosts) {
    const url = `${host}/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=320`;
    const rows = await fetchJson<RawKline[]>(url);
    if (!rows || !Array.isArray(rows)) continue;
    const candles = candlesFrom(rows);
    if (candles.length >= 40) return candles;
  }
  return null;
}

export async function loadTa(symbol: string, interval: IntervalId): Promise<TaRead> {
  const key = `${symbol}:${interval}`;
  const cached = memory.get(key);
  if (cached && Date.now() - cached.at < TTL) return cached.row;
  const candles = await fetchCandles(symbol, interval);
  if (!candles) {
    throw new Error(msg("کندل این نماد از بایننس نیامد.", "Binance did not return candles for this symbol."));
  }
  const read = readChart({ symbol, interval, candles });
  if (!read) {
    throw new Error(msg("کندل برای این خواندن کافی نیست.", "There are not enough candles for this reading."));
  }
  memory.set(key, { at: Date.now(), row: read });
  return read;
}
