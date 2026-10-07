import { BINANCE_SYMBOL, isNonSpotCandidate } from "./exclusions";
import { vsBtc } from "./math";
import {
  detectRegime,
  enrichFromKlines,
  pickWinner,
  scoreUniverse,
} from "./scoring";
import { confidenceOf, explainPick } from "./explain";
import type { AnalysisResult, PairPoint } from "./types";

const PAPRIKA = "https://api.coinpaprika.com/v1";
const BINANCE = "https://data-api.binance.vision/api/v3";
const CACHE_MS = 2 * 60 * 1000;
const TARGET_UNIVERSE = 100;

type PaprikaQuote = {
  price: number;
  volume_24h: number;
  volume_24h_change_24h: number;
  market_cap: number;
  percent_change_1h: number;
  percent_change_6h: number;
  percent_change_12h: number;
  percent_change_24h: number;
  percent_change_7d: number;
  percent_from_price_ath: number | null;
};

type PaprikaTicker = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  beta_value: number | null;
  quotes: { USD: PaprikaQuote; BTC: PaprikaQuote };
};

type PaprikaGlobal = {
  bitcoin_dominance_percentage: number;
};

type BinanceTicker = {
  symbol: string;
};

type CacheBox = { at: number; value: AnalysisResult };
let cache: CacheBox | null = null;

async function fetchJson<T>(url: string, ms = 14000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AlphaSpot/1.0",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
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

function binanceBase(symbol: string): string {
  return BINANCE_SYMBOL[symbol] ?? symbol;
}

function parseKlines(raw: unknown): { times: number[]; closes: number[] } | null {
  if (!Array.isArray(raw) || raw.length < 8) return null;
  const times: number[] = [];
  const closes: number[] = [];
  for (const row of raw) {
    if (!Array.isArray(row)) continue;
    const t = Number(row[0]);
    const c = Number(row[4]);
    if (!Number.isFinite(t) || !Number.isFinite(c)) continue;
    times.push(t);
    closes.push(c);
  }
  if (closes.length < 8) return null;
  return { times, closes };
}

function alignPair(
  coin: { times: number[]; closes: number[] },
  btc: { times: number[]; closes: number[] },
): number[] {
  const map = new Map<number, number>();
  btc.times.forEach((t, i) => {
    const px = btc.closes[i];
    if (px) map.set(t, px);
  });
  const pair: number[] = [];
  coin.times.forEach((t, i) => {
    const b = map.get(t);
    const c = coin.closes[i];
    if (b && b !== 0 && c != null) pair.push(c / b);
  });
  return pair;
}

export async function runAnalysis(): Promise<AnalysisResult> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) return cache.value;

  const [tickers, global, binanceTickers, btcKlines] = await Promise.all([
    fetchJson<PaprikaTicker[]>(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`),
    fetchJson<PaprikaGlobal>(`${PAPRIKA}/global`),
    fetchJson<BinanceTicker[]>(`${BINANCE}/ticker/24hr`),
    fetchJson<unknown>(`${BINANCE}/klines?symbol=BTCUSDT&interval=1d&limit=31`),
  ]);

  const usdtBases = new Set<string>();
  const btcBases = new Set<string>();
  for (const t of binanceTickers) {
    if (t.symbol.endsWith("USDT")) usdtBases.add(t.symbol.slice(0, -4));
    if (t.symbol.endsWith("BTC")) btcBases.add(t.symbol.slice(0, -3));
  }

  const btcTicker = tickers.find((t) => t.symbol === "BTC");
  if (!btcTicker) throw new Error("داده بیت‌کوین در دسترس نیست");
  const btcUsd = btcTicker.quotes.USD;
  const btcPct7d = (btcUsd.percent_change_7d || 0) / 100;

  const ranked = [...tickers]
    .filter((t) => typeof t.rank === "number" && t.rank > 0)
    .sort((a, b) => a.rank - b.rank);

  const universe: PaprikaTicker[] = [];
  for (const t of ranked) {
    if (t.rank > TARGET_UNIVERSE) break;
    if (t.symbol === "BTC") {
      universe.push(t);
      continue;
    }
    if (isNonSpotCandidate(t.symbol, t.name)) continue;
    universe.push(t);
  }

  const btcParsed = parseKlines(btcKlines);

  const klineNeed = universe
    .map((t) => binanceBase(t.symbol.toUpperCase()))
    .filter((s) => s !== "BTC" && usdtBases.has(s));

  const klineMap = new Map<string, number[]>();
  if (btcParsed) {
    const fetched = await mapPool(klineNeed, 14, async (sym) => {
      try {
        const raw = await fetchJson<unknown>(
          `${BINANCE}/klines?symbol=${sym}USDT&interval=1d&limit=31`,
          10000,
        );
        const parsed = parseKlines(raw);
        if (!parsed) return { sym, pair: null as number[] | null };
        const pair = alignPair(parsed, btcParsed);
        return { sym, pair: pair.length >= 8 ? pair : null };
      } catch {
        return { sym, pair: null as number[] | null };
      }
    });
    for (const row of fetched) {
      if (row.pair) klineMap.set(row.sym, row.pair);
    }
  }

  type Draft = Parameters<typeof enrichFromKlines>[0];
  const drafts: Draft[] = universe.map((t) => {
    const usd = t.quotes.USD;
    const btc = t.quotes.BTC;
    const symbol = t.symbol.toUpperCase();
    const base = binanceBase(symbol);
    const rs7d =
      symbol === "BTC" ? 0 : vsBtc(usd.percent_change_7d || 0, btcUsd.percent_change_7d || 0);
    const rs24h =
      symbol === "BTC"
        ? 0
        : vsBtc(usd.percent_change_24h || 0, btcUsd.percent_change_24h || 0);
    const pairCloses =
      symbol === "BTC" && btcParsed ? btcParsed.closes : (klineMap.get(base) ?? []);
    const origin = pairCloses[0];
    const pairSeries: PairPoint[] =
      pairCloses.length > 0 && origin
        ? pairCloses.map((v, i) => ({
            t: i,
            v: (v / origin) * 100,
          }))
        : [];

    const draft: Draft = {
      id: t.id,
      symbol,
      name: t.name,
      rank: t.rank,
      priceUsd: usd.price,
      priceBtc: btc.price,
      marketCap: usd.market_cap || 0,
      volume24h: usd.volume_24h || 0,
      volumeChange24h: usd.volume_24h_change_24h || 0,
      beta: t.beta_value,
      athDrawdownPct: usd.percent_from_price_ath,
      pct1h: usd.percent_change_1h || 0,
      pct6h: usd.percent_change_6h || 0,
      pct12h: usd.percent_change_12h || 0,
      pct24h: usd.percent_change_24h || 0,
      pct7d: usd.percent_change_7d || 0,
      rs24h,
      rs7d,
      rs14d: null,
      rs30d: null,
      rsi14: null,
      volatility30d: null,
      maxDrawdown30d: null,
      distFrom30dHighPct: null,
      aboveSma: null,
      hasBtcPair: symbol === "BTC" ? true : btcBases.has(base),
      hasKlines: pairCloses.length >= 8,
      pairSeries,
      turnover: usd.market_cap ? usd.volume_24h / usd.market_cap : 0,
      pairCloses,
    };
    const enriched = enrichFromKlines(draft);
    if (symbol === "BTC") {
      return { ...enriched, rs7d: 0, rs14d: 0, rs30d: 0, rs24h: 0 };
    }
    return enriched;
  });

  const { regime, note: regimeNote } = detectRegime(
    drafts,
    global.bitcoin_dominance_percentage,
  );
  const scored = scoreUniverse(drafts, regime).sort((a, b) => b.score - a.score);
  const { pick, runnerUp } = pickWinner(scored, regime);
  const conf = confidenceOf(pick, runnerUp, pick.hasKlines);
  const { reasons, caution } = explainPick(
    pick,
    runnerUp,
    regime,
    regimeNote,
    btcPct7d,
  );

  const result: AnalysisResult = {
    generatedAt: new Date().toISOString(),
    sources: ["CoinPaprika", "Binance"],
    btcDominance: global.bitcoin_dominance_percentage,
    btcPriceUsd: btcUsd.price,
    btcPct7d,
    regime,
    regimeNote,
    universeSize: scored.length,
    scannedCount: ranked.length,
    pick,
    runnerUp,
    top: scored.slice(0, 12),
    reasons,
    caution,
    confidence: conf.confidence,
    confidenceNote: conf.note,
  };

  cache = { at: now, value: result };
  return result;
}
