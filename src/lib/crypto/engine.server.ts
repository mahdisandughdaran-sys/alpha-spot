import { candidateBases, isNonSpotCandidate } from "./exclusions.ts";
import { lookupMeta, mcFdvRatio } from "./catalog.ts";
import { vsBtc } from "./math.ts";
import {
  detectRegime,
  enrichFromKlines,
  pickWinner,
  scoreUniverse,
} from "./scoring.ts";
import { buildChecklist, dominanceBiasOf } from "./checklist.ts";
import { buildPortfolio } from "./portfolio.ts";
import { confidenceOf, explainPick } from "./explain.ts";
import { evaluateKillSwitch } from "./kill-switch.ts";
import { loadUnlockAssessments } from "./unlocks.server.ts";
import { readCache, readCachePrefix, writeCache } from "./cache.server.ts";
import { applyBookGate } from "./microstructure.ts";
import { loadTopBooks } from "./microstructure.server.ts";
import type { AnalysisResult, BookCheck, CoinDraft, DataCache, PairPoint, UnlockAssessment } from "./types.ts";

const PAPRIKA = "https://api.coinpaprika.com/v1";
const BINANCE = "https://data-api.binance.vision/api/v3";
const CACHE_MS = 2 * 60 * 1000;
const ANALYSIS_KEY = "analysis:spot:v3";
const ANALYSIS_FRESH = 2 * 60;
const ANALYSIS_STALE = 6 * 60 * 60;
const KLINE_FRESH = 6 * 60 * 60;
const KLINE_STALE = 14 * 24 * 60 * 60;
const TARGET_UNIVERSE = 100;
const KLINE_LIMIT = 220;

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
  percent_change_30d?: number;
  percent_from_price_ath: number | null;
};

type PaprikaTicker = {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  total_supply: number | null;
  max_supply: number | null;
  circulating_supply?: number | null;
  beta_value: number | null;
  quotes: { USD: PaprikaQuote; BTC: PaprikaQuote };
};

type PaprikaGlobal = {
  bitcoin_dominance_percentage: number;
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
        "User-Agent": "AlphaSpot/1.1",
      },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

type Maybe<T> = { ok: true; data: T } | { ok: false; status: number };

async function fetchMaybe<T>(url: string, ms = 10000): Promise<Maybe<T>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "AlphaSpot/1.1",
      },
    });
    if (!res.ok) return { ok: false, status: res.status };
    return { ok: true, data: (await res.json()) as T };
  } catch {
    return { ok: false, status: 0 };
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

type ParsedKlines = { times: number[]; closes: number[]; volumes: number[] };

function parseKlines(raw: unknown): ParsedKlines | null {
  if (!Array.isArray(raw) || raw.length < 8) return null;
  const times: number[] = [];
  const closes: number[] = [];
  const volumes: number[] = [];
  for (const row of raw) {
    if (!Array.isArray(row)) continue;
    const t = Number(row[0]);
    const c = Number(row[4]);
    const v = Number(row[5]);
    if (!Number.isFinite(t) || !Number.isFinite(c)) continue;
    times.push(t);
    closes.push(c);
    volumes.push(Number.isFinite(v) ? v : 0);
  }
  if (closes.length < 8) return null;
  return { times, closes, volumes };
}

function alignPair(coin: ParsedKlines, btc: ParsedKlines): number[] {
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

function klineKey(base: string): string {
  return `k:220:${base}USDT`;
}

function freshEnough(at: number, maxSec: number): boolean {
  return at > 0 && Date.now() - at <= maxSec * 1000;
}

function parseCachedKline(payload: string): ParsedKlines | null {
  try {
    return parseKlines(JSON.parse(payload) as unknown);
  } catch {
    return null;
  }
}

async function loadKline(
  base: string,
  store: Map<string, { payload: string; at: number }>,
  binanceOpen: { value: boolean },
): Promise<ParsedKlines | null> {
  const key = klineKey(base);
  const hit = store.get(key);
  if (hit && freshEnough(hit.at, KLINE_FRESH)) {
    const parsed = parseCachedKline(hit.payload);
    if (parsed) return parsed;
  }
  const stale = hit && freshEnough(hit.at, KLINE_STALE) ? parseCachedKline(hit.payload) : null;
  if (!binanceOpen.value) return stale;
  const res = await fetchMaybe<unknown>(
    `${BINANCE}/klines?symbol=${base}USDT&interval=1d&limit=${KLINE_LIMIT}`,
    base === "BTC" ? 12000 : 9000,
  );
  if (!res.ok) {
    if (res.status === 418 || res.status === 429 || res.status === 0) binanceOpen.value = false;
    return stale;
  }
  const parsed = parseKlines(res.data);
  if (!parsed) return stale;
  const payload = JSON.stringify(res.data);
  store.set(key, { payload, at: Date.now() });
  await writeCache(key, payload);
  return parsed;
}

async function readStoredAnalysis(maxAgeSec: number): Promise<AnalysisResult | null> {
  const raw = await readCache(ANALYSIS_KEY, maxAgeSec);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AnalysisResult;
    if (!parsed?.pick?.symbol || !parsed.killSwitch) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function runAnalysis(): Promise<AnalysisResult> {
  const now = Date.now();
  if (cache && now - cache.at < CACHE_MS) {
    return { ...cache.value, dataCache: "memory" };
  }
  const storedFresh = await readStoredAnalysis(ANALYSIS_FRESH);
  if (storedFresh) {
    storedFresh.dataCache = "stored";
    cache = { at: now, value: storedFresh };
    return storedFresh;
  }
  try {
    const result = await computeAnalysis();
    cache = { at: Date.now(), value: result };
    await writeCache(ANALYSIS_KEY, JSON.stringify(result));
    return result;
  } catch (err) {
    const stale = await readStoredAnalysis(ANALYSIS_STALE);
    if (stale) {
      stale.dataCache = "stored";
      stale.caution = [
        "داده زنده ناقص بود؛ آخرین تحلیل ذخیره‌شده نشان داده می‌شود.",
        ...stale.caution,
      ].slice(0, 6);
      cache = { at: Date.now(), value: stale };
      return stale;
    }
    throw err instanceof Error ? err : new Error("تحلیل انجام نشد.");
  }
}

async function computeAnalysis(): Promise<AnalysisResult> {
  const [tickers, global] = await Promise.all([
    fetchJson<PaprikaTicker[]>(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`),
    fetchJson<PaprikaGlobal>(`${PAPRIKA}/global`),
  ]);

  const btcTicker = tickers.find((t) => t.symbol === "BTC");
  if (!btcTicker) throw new Error("داده بیت‌کوین در دسترس نیست");
  const btcUsd = btcTicker.quotes.USD;
  const btcPct7d = (btcUsd.percent_change_7d || 0) / 100;
  const btcPct30d =
    btcUsd.percent_change_30d == null ? null : btcUsd.percent_change_30d / 100;

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

  let binanceOpen = { value: true };
  const klineStore = await readCachePrefix("k:220:");
  const btcParsed = await loadKline("BTC", klineStore, binanceOpen);
  if (!btcParsed) binanceOpen.value = false;

  const klineNeed = universe.filter((t) => t.symbol.toUpperCase() !== "BTC");
  type KlinePack = {
    id: string;
    pair: number[] | null;
    usd: ParsedKlines | null;
  };

  const klinesTried = klineNeed.length;
  const klineById = new Map<string, KlinePack>();
  if (btcParsed) {
    const fetched = await mapPool(klineNeed, 6, async (ticker) => {
      const symbol = ticker.symbol.toUpperCase();
      const bases = candidateBases(symbol);
      for (const sym of bases) {
        const parsed = await loadKline(sym, klineStore, binanceOpen);
        if (!parsed) continue;
        const pair = alignPair(parsed, btcParsed);
        return {
          id: ticker.id,
          pair: pair.length >= 8 ? pair : null,
          usd: parsed,
        } satisfies KlinePack;
      }
      return { id: ticker.id, pair: null, usd: null } satisfies KlinePack;
    });
    for (const row of fetched) klineById.set(row.id, row);
  }

  const drafts: CoinDraft[] = universe.map((t) => {
    const usd = t.quotes.USD;
    const btc = t.quotes.BTC;
    const symbol = t.symbol.toUpperCase();
    const pack = klineById.get(t.id);
    const pairCloses =
      symbol === "BTC" && btcParsed ? btcParsed.closes : (pack?.pair ?? []);
    const usdCloses =
      symbol === "BTC" && btcParsed ? btcParsed.closes : (pack?.usd?.closes ?? []);
    const usdVolumes =
      symbol === "BTC" && btcParsed
        ? btcParsed.volumes
        : (pack?.usd?.volumes ?? []);

    const rs7d =
      symbol === "BTC" ? 0 : vsBtc(usd.percent_change_7d || 0, btcUsd.percent_change_7d || 0);
    const rs24h =
      symbol === "BTC"
        ? 0
        : vsBtc(usd.percent_change_24h || 0, btcUsd.percent_change_24h || 0);
    const rs30Fallback =
      symbol === "BTC" || usd.percent_change_30d == null || btcUsd.percent_change_30d == null
        ? null
        : vsBtc(usd.percent_change_30d, btcUsd.percent_change_30d);

    const origin = pairCloses.slice(-31)[0];
    const window = pairCloses.slice(-31);
    const pairSeries: PairPoint[] =
      window.length > 0 && origin
        ? window.map((v, i) => ({ t: i, v: (v / origin) * 100 }))
        : [];

    const circulating = t.circulating_supply ?? t.total_supply ?? null;
    const maxSupply = t.max_supply && t.max_supply > 0 ? t.max_supply : null;
    const mcFdv = mcFdvRatio(circulating, maxSupply, usd.price, usd.market_cap || 0);
    const meta = lookupMeta(symbol);
    const listedOnBinance = pairCloses.length >= 8 || usdCloses.length >= 8;

    const draft: CoinDraft = {
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
      pct30d: usd.percent_change_30d ?? null,
      rs24h,
      rs7d,
      rs14d: null,
      rs30d: rs30Fallback,
      rsi14: null,
      volatility30d: null,
      maxDrawdown30d: null,
      distFrom30dHighPct: null,
      aboveSma: null,
      aboveEma200: null,
      weeklyStructure: null,
      obvRising: null,
      hasBtcPair: listedOnBinance || symbol === "BTC" || symbol === "ETH",
      hasKlines: pairCloses.length >= 8,
      klineDays: Math.max(pairCloses.length, usdCloses.length),
      pairSeries,
      turnover: usd.market_cap ? usd.volume_24h / usd.market_cap : 0,
      circulatingSupply: circulating,
      maxSupply,
      mcFdv,
      narrativeTags: meta.tags,
      narrativeTagsFa: meta.tagsFa,
      accrual: meta.accrual,
      accrualNote: meta.note,
      pairWeekly: null,
      pairSupportBroken: false,
      pairCloses,
      usdCloses,
      usdVolumes,
    };
    const enriched = enrichFromKlines(draft);
    if (symbol === "BTC") {
      return { ...enriched, rs7d: 0, rs14d: 0, rs30d: 0, rs24h: 0 };
    }
    return enriched;
  });

  const klinesOk = drafts.filter((d) => d.hasKlines).length;
  const btcDraft = drafts.find((d) => d.symbol === "BTC");
  const killSwitch = evaluateKillSwitch({
    priceUsd: btcUsd.price,
    closes: btcDraft?.usdCloses ?? [],
  });
  let unlockSource: AnalysisResult["unlockSource"] = "unavailable";
  let unlockMatched = 0;
  let unlocks = new Map<string, UnlockAssessment>();
  try {
    const loaded = await loadUnlockAssessments(drafts.map((d) => d.symbol));
    unlockSource = loaded.source;
    unlocks = loaded.bySymbol;
    unlockMatched = [...unlocks.values()].filter((u) => u.pct30d != null).length;
  } catch {
    unlockSource = "unavailable";
  }
  const { regime, medianRs7, note: regimeNote } = detectRegime(
    drafts,
    global.bitcoin_dominance_percentage,
  );
  const dom = dominanceBiasOf(
    global.bitcoin_dominance_percentage,
    btcPct7d,
    medianRs7,
  );
  let scored = scoreUniverse(drafts, regime, { unlocks, kill: killSwitch }).sort(
    (a, b) => b.score - a.score,
  );
  let books: BookCheck[] = [];
  try {
    books = await loadTopBooks(scored.slice(0, 8).map((row) => row.symbol));
  } catch {
    books = [];
  }
  const bookBy = new Map(books.map((book) => [book.symbol, book]));
  scored = scored
    .map((row) => applyBookGate(row, bookBy.get(row.symbol)))
    .sort((a, b) => b.score - a.score);
  let { pick, runnerUp } = pickWinner(scored, regime, killSwitch);
  const rejected = books.filter((book) => book.gate === "thin").map((book) => book.symbol);
  if (bookBy.get(pick.symbol)?.gate === "thin") {
    const btcRow = scored.find((row) => row.symbol === "BTC");
    if (btcRow && pick.symbol !== "BTC") {
      runnerUp = pick;
      pick = btcRow;
    }
  }
  const pickBook = bookBy.get(pick.symbol);
  const conf = confidenceOf(pick, runnerUp, pick.hasKlines, klinesOk, drafts.length);
  const { reasons, caution } = explainPick(
    pick,
    runnerUp,
    regime,
    regimeNote,
    btcPct7d,
    { klinesOk, klinesTried: drafts.length, dominanceNote: dom.note },
  );
  if (!btcParsed) {
    caution.unshift(
      "کندل بایننس در این لحظه در دسترس نبود؛ امتیاز با دادهٔ زنده پاپریکا (بازده کوتاه‌مدت و MC/FDV) ساخته شد.",
    );
  } else if (!binanceOpen.value) {
    caution.unshift("بخشی از کندل‌ها از کش ذخیره‌شده آمد چون بایننس محدود بود.");
  }
  if (rejected.length) {
    caution.unshift(
      `دفتر سفارش نازک بود و سیگنال خرید این‌ها معلق شد: ${rejected.join("، ")}.`,
    );
  }
  if (pickBook?.gate === "crowded") {
    caution.unshift(pickBook.note);
  }
  if (killSwitch.active) {
    caution.unshift(killSwitch.note);
  }
  if (pick.highDilution) {
    caution.unshift(
      `${pick.symbol} برچسب High Dilution Risk دارد و ${pick.unlockPenalty} امتیاز از نمره کل کم شده است.`,
    );
  }
  if (unlockSource === "unavailable") {
    caution.push(
      "تقویم آزادسازی الان در دسترس نبود؛ جریمه کلیف اعمال نشد. تحلیل قیمتی همچنان معتبر است.",
    );
  }
  const checklist = buildChecklist(pick, {
    regime,
    btcDominance: global.bitcoin_dominance_percentage,
    dominanceBias: dom.bias,
    kill: killSwitch,
    book: pickBook,
  });
  const portfolio = buildPortfolio(scored, regime, killSwitch);
  const sawBook = books.some((book) => book.slippageBps != null);
  const sawFunding = books.some((book) => book.funding8h != null);

  const result: AnalysisResult = {
    generatedAt: new Date().toISOString(),
    sources: [
      "CoinPaprika",
      ...(btcParsed ? ["Binance"] : []),
      ...(sawBook ? ["Order book"] : []),
      ...(sawFunding ? ["Funding"] : []),
      ...(unlockSource === "coinmarketcap" ? ["CMC Unlocks"] : []),
    ],
    btcDominance: global.bitcoin_dominance_percentage,
    btcPriceUsd: btcUsd.price,
    btcPct7d,
    btcPct30d,
    regime,
    regimeNote,
    dominanceBias: dom.bias,
    dominanceNote: dom.note,
    universeSize: scored.length,
    scannedCount: ranked.length,
    klinesOk,
    klinesTried,
    killSwitch,
    spotBuys: killSwitch.spotBuys,
    unlockSource,
    unlockMatched,
    pick,
    runnerUp,
    top: scored,
    reasons,
    caution: caution.slice(0, 6),
    confidence: conf.confidence,
    confidenceNote: conf.note,
    checklist,
    portfolio,
    books,
    dataCache: "live" satisfies DataCache,
  };

  return result;
}
