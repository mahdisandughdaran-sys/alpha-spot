const BINANCE = "https://data-api.binance.vision/api/v3";

type Quote = { symbol: string; price: number };

let cache: { at: number; rows: Quote[] } | null = null;

export async function quoteSpot(symbols: string[]): Promise<Quote[]> {
  const now = Date.now();
  if (!cache || now - cache.at > 20_000) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 8000);
    try {
      const res = await fetch(`${BINANCE}/ticker/price`, {
        signal: ctrl.signal,
        headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.4" },
      });
      if (!res.ok) return [];
      const json = (await res.json()) as { symbol?: string; price?: string }[];
      if (!Array.isArray(json)) return [];
      const rows: Quote[] = [];
      for (const row of json) {
        if (!row.symbol?.endsWith("USDT")) continue;
        const symbol = row.symbol.slice(0, -4);
        const price = Number(row.price);
        if (!/^[A-Z0-9]{2,15}$/.test(symbol) || !(price > 0)) continue;
        rows.push({ symbol, price });
      }
      cache = { at: now, rows };
    } catch {
      return [];
    } finally {
      clearTimeout(timer);
    }
  }
  const want = new Set(symbols);
  return (cache?.rows ?? []).filter((row) => want.has(row.symbol));
}
