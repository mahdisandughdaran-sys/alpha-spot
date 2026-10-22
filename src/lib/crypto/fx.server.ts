export type UsdtRate = {
  toman: number | null;
  source: string | null;
  at: string;
};

let cache: { at: number; rate: UsdtRate } | null = null;

export async function loadUsdtToman(): Promise<UsdtRate> {
  const now = Date.now();
  if (cache && now - cache.at < 60_000 && cache.rate.toman) return cache.rate;
  const nobitex = await readNobitex();
  const toman = nobitex ?? (await readWallex());
  const rate: UsdtRate = {
    toman,
    source: nobitex ? "Nobitex" : toman ? "Wallex" : null,
    at: new Date().toISOString(),
  };
  cache = { at: toman ? now : now - 45_000, rate };
  return rate;
}

type Json = null | string | number | boolean | Json[] | { [key: string]: Json };

async function readNobitex(): Promise<number | null> {
  const book = await getJson("https://apiv2.nobitex.ir/v3/orderbook/USDTIRT");
  const fromBook = tomanFromRial(pick(book, "lastTradePrice"));
  if (fromBook) return fromBook;
  const stats = await getJson("https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt&dstCurrency=rls");
  const pair = pick(pick(stats, "stats"), "usdt-rls");
  return tomanFromRial(pick(pair, "latest") ?? pick(pair, "bestSell"));
}

async function readWallex(): Promise<number | null> {
  const json = await getJson("https://api.wallex.ir/v1/markets");
  const result = pick(json, "result");
  const symbols = pick(result, "symbols") ?? result;
  const row = pick(symbols, "USDTTMN") ?? pick(symbols, "USDTIRT") ?? pick(symbols, "USDTIRR");
  const stats = pick(row, "stats");
  const last = pick(stats, "lastPrice") ?? pick(row, "lastPrice") ?? pick(row, "price");
  const n = Number(last);
  if (!(n > 1000)) return null;
  return n > 200_000 ? Math.round(n / 10) : Math.round(n);
}

function pick(value: Json | null | undefined, key: string): Json | undefined {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  return value[key];
}

function tomanFromRial(raw: unknown): number | null {
  const n = Number(raw);
  if (!(n > 10_000)) return null;
  return Math.round(n / 10);
}

async function getJson(url: string): Promise<Json | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 4500);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.5" },
    });
    if (!res.ok) return null;
    return (await res.json()) as Json;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
