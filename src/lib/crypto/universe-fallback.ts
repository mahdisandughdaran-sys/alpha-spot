import { isNonSpotCandidate } from "./exclusions.ts";

type Quote = {
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_change_30d?: number;
  percent_from_price_ath: number | null;
};

export type FallbackTicker = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number | null;
  max_supply: number | null;
  circulating_supply: number | null;
  beta_value: number | null;
  quotes: { USD: Quote; BTC: Quote };
};

function num(value: unknown): number | null {
  const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
  return Number.isFinite(n) ? n : null;
}

function emptyQuote(price: number, volume: number, extra: Partial<Quote> = {}): Quote {
  return {
    price,
    volume_24h: volume,
    volume_24h_change_24h: 0,
    market_cap: 0,
    percent_change_1h: 0,
    percent_change_6h: 0,
    percent_change_12h: 0,
    percent_change_24h: 0,
    percent_change_7d: 0,
    percent_from_price_ath: null,
    ...extra,
  };
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

/** CoinGecko /coins/markets + /global. Returns null when the payload is not a usable top list. */
export function fromCoinGecko(
  markets: unknown,
  global: unknown,
): { tickers: FallbackTicker[]; dominance: number | null } | null {
  if (!Array.isArray(markets) || markets.length < 10) return null;
  const rows = markets
    .map((raw) => asRecord(raw))
    .filter((row): row is Record<string, unknown> => row != null);
  const btc = rows.find((row) => String(row.symbol ?? "").toUpperCase() === "BTC");
  const btcPrice = btc ? num(btc.current_price) : null;
  if (!btcPrice || btcPrice <= 0) return null;

  const tickers: FallbackTicker[] = [];
  for (const row of rows) {
    const symbol = String(row.symbol ?? "").toUpperCase();
    const name = String(row.name ?? symbol);
    const rank = num(row.market_cap_rank);
    const price = num(row.current_price);
    if (!symbol || rank == null || rank <= 0 || price == null || price <= 0) continue;
    if (symbol !== "BTC" && isNonSpotCandidate(symbol, name)) continue;
    const pct = (key: string): number => num(row[key]) ?? 0;
    const pct30 =
      num(row.price_change_percentage_30d_in_currency) ?? num(row.price_change_percentage_30d);
    const usd = emptyQuote(price, num(row.total_volume) ?? 0, {
      market_cap: num(row.market_cap) ?? 0,
      percent_change_1h:
        num(row.price_change_percentage_1h_in_currency) ?? num(row.price_change_percentage_1h) ?? 0,
      percent_change_24h:
        num(row.price_change_percentage_24h_in_currency) ??
        num(row.price_change_percentage_24h) ??
        pct("price_change_percentage_24h"),
      percent_change_7d:
        num(row.price_change_percentage_7d_in_currency) ?? num(row.price_change_percentage_7d) ?? 0,
      percent_change_30d: pct30 ?? undefined,
      percent_from_price_ath: num(row.ath_change_percentage),
    });
    const btcQuote = emptyQuote(price / btcPrice, 0);
    tickers.push({
      id: String(row.id ?? symbol),
      name,
      symbol,
      rank,
      total_supply: num(row.total_supply),
      max_supply: num(row.max_supply),
      circulating_supply: num(row.circulating_supply),
      beta_value: null,
      quotes: { USD: usd, BTC: btcQuote },
    });
  }
  if (!tickers.some((row) => row.symbol === "BTC")) return null;
  const g = asRecord(asRecord(global)?.data);
  const pctMap = asRecord(g?.market_cap_percentage);
  const dominance = num(pctMap?.btc);
  return { tickers, dominance };
}

const LEVERED = /(UP|DOWN|BULL|BEAR)$/;

/** Public Binance 24h tickers. No market cap and no 7d/30d — those stay empty rather than invented. */
export function fromBinanceTickers(raw: unknown): { tickers: FallbackTicker[]; dominance: null } | null {
  if (!Array.isArray(raw) || raw.length < 10) return null;
  const rows = raw
    .map((item) => asRecord(item))
    .filter((row): row is Record<string, unknown> => row != null)
    .map((row) => {
      const symbol = String(row.symbol ?? "");
      return {
        symbol,
        price: num(row.lastPrice ?? row.price),
        quoteVolume: num(row.quoteVolume) ?? 0,
        change24: num(row.priceChangePercent) ?? 0,
      };
    })
    .filter((row) => row.symbol.endsWith("USDT") && row.price != null && row.price > 0);

  const btc = rows.find((row) => row.symbol === "BTCUSDT");
  if (!btc?.price) return null;
  const ranked = rows
    .filter((row) => {
      const base = row.symbol.slice(0, -4);
      if (!base || LEVERED.test(base)) return false;
      if (base !== "BTC" && isNonSpotCandidate(base, base)) return false;
      return true;
    })
    .sort((a, b) => b.quoteVolume - a.quoteVolume)
    .slice(0, 100);

  const tickers: FallbackTicker[] = ranked.map((row, index) => {
    const base = row.symbol.slice(0, -4);
    const price = row.price ?? 0;
    const usd = emptyQuote(price, row.quoteVolume, { percent_change_24h: row.change24 });
    return {
      id: `binance:${base}`,
      name: base,
      symbol: base,
      rank: index + 1,
      total_supply: null,
      max_supply: null,
      circulating_supply: null,
      beta_value: null,
      quotes: { USD: usd, BTC: emptyQuote(price / (btc.price ?? 1), 0) },
    };
  });
  if (!tickers.some((row) => row.symbol === "BTC")) return null;
  return { tickers, dominance: null };
}
