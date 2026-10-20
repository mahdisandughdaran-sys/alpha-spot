import { candidateBases, isNonSpotCandidate } from "./exclusions.ts";
import { lookupMeta, mcFdvRatio } from "./catalog.ts";
import { vsBtc } from "./math.ts";
import {
  detectRegime,
  enrichFromKlines,
  headlineForBook,
  pickWinner,
  scoreUniverse,
} from "./scoring.ts";
import { buildChecklist, dominanceBiasOf } from "./checklist.ts";
import { buildPortfolio } from "./portfolio.ts";
import { dominanceLookback } from "./book.ts";
import { loadDominanceSeries } from "./dominance.server.ts";
import { confidenceOf, explainPick } from "./explain.ts";
import { evaluateKillSwitch } from "./kill-switch.ts";
import { loadUnlockAssessments } from "./unlocks.server.ts";
import { readCache, readCachePrefix, writeCache, cacheHealth } from "./cache.server.ts";
import { applyBookGate } from "./microstructure.ts";
import { loadTopBooks } from "./microstructure.server.ts";
import { emptyOpportunityBoard, scanOpportunities, type SpotBar } from "./opportunity.ts";
import { fromBinanceTickers, fromCoinGecko } from "./universe-fallback.ts";
import { applyLens, type Horizon, type WeightCuts } from "./lens.ts";
import { loadVenueListing } from "./listings.server.ts";
import { buildVerdict } from "./verdict.ts";
import { callFromVerdict, verdictFromCall, HORIZON_ORDER } from "./validity.ts";
import { sessionCalendar } from "./session-calendar.ts";
import type { VenueId } from "./venues.ts";
import { msg } from "@/lib/i18n/lex";
import type { AnalysisResult, BookCheck, CoinDraft, CoinRow, DataCache, HorizonCall, PairPoint, UnlockAssessment } from "./types.ts";

const PAPRIKA = "https://api.coinpaprika.com/v1";
const BINANCE = "https://data-api.binance.vision/api/v3";
const CACHE_MS = 2 * 60 * 1000;
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
const memory = new Map<string, CacheBox>();

export type DeskRun = {
  venue: VenueId;
  horizon: Horizon;
  cuts?: WeightCuts;
};

function cacheKey(run: DeskRun): string {
  const cuts = run.cuts ?? {};
  const packed = (Object.keys(cuts) as (keyof WeightCuts)[])
    .sort()
    .map((key) => `${key}:${Number(cuts[key]).toFixed(4)}`)
    .join(",");
  return `analysis:spot:v7:${run.venue}:${run.horizon}:${packed}`;
}

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

type ParsedKlines = {
  times: number[];
  opens: number[];
  highs: number[];
  lows: number[];
  closes: number[];
  volumes: number[];
  quotes: number[];
};

function parseKlines(raw: unknown): ParsedKlines | null {
  if (!Array.isArray(raw) || raw.length < 8) return null;
  const times: number[] = [];
  const opens: number[] = [];
  const highs: number[] = [];
  const lows: number[] = [];
  const closes: number[] = [];
  const volumes: number[] = [];
  const quotes: number[] = [];
  for (const row of raw) {
    if (!Array.isArray(row)) continue;
    const t = Number(row[0]);
    const o = Number(row[1]);
    const h = Number(row[2]);
    const l = Number(row[3]);
    const c = Number(row[4]);
    const v = Number(row[5]);
    const q = Number(row[7]);
    if (!Number.isFinite(t) || !Number.isFinite(c) || c <= 0) continue;
    times.push(t);
    opens.push(Number.isFinite(o) && o > 0 ? o : c);
    highs.push(Number.isFinite(h) && h > 0 ? h : c);
    lows.push(Number.isFinite(l) && l > 0 ? l : c);
    closes.push(c);
    volumes.push(Number.isFinite(v) ? v : 0);
    quotes.push(Number.isFinite(q) ? q : 0);
  }
  if (closes.length < 8) return null;
  return { times, opens, highs, lows, closes, volumes, quotes };
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

function barsOf(parsed: ParsedKlines): SpotBar[] {
  const out: SpotBar[] = [];
  for (let i = 0; i < parsed.closes.length; i++) {
    const c = parsed.closes[i] ?? 0;
    if (c <= 0) continue;
    out.push({
      t: parsed.times[i] ?? i,
      o: parsed.opens[i] || c,
      h: parsed.highs[i] || c,
      l: parsed.lows[i] || c,
      c,
      v: parsed.volumes[i] ?? 0,
      q: parsed.quotes[i] ?? 0,
    });
  }
  return out;
}

async function readStoredAnalysis(key: string, maxAgeSec: number): Promise<AnalysisResult | null> {
  const raw = await readCache(key, maxAgeSec);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as AnalysisResult;
    if (!parsed?.pick?.symbol || !parsed.killSwitch || !parsed.opportunities?.items) return null;
    const kind = parsed.verdict?.kind;
    if (kind !== "buy" && kind !== "wait" && kind !== "stay" && kind !== "cash") return null;
    if (!Array.isArray(parsed.calls) || parsed.calls.length !== 3) return null;
    parsed.cacheRows = parsed.cacheRows ?? 0;
    parsed.cacheKlines = parsed.cacheKlines ?? 0;
    return parsed;
  } catch {
    return null;
  }
}

export async function runAnalysis(run: DeskRun): Promise<AnalysisResult> {
  const key = cacheKey(run);
  const now = Date.now();
  const hit = memory.get(key);
  if (hit && now - hit.at < CACHE_MS) {
    return { ...hit.value, dataCache: "memory" };
  }
  const storedFresh = await readStoredAnalysis(key, ANALYSIS_FRESH);
  if (storedFresh) {
    storedFresh.dataCache = "stored";
    memory.set(key, { at: now, value: storedFresh });
    return storedFresh;
  }
  try {
    const result = await computeAnalysis(run);
    memory.set(key, { at: Date.now(), value: result });
    await writeCache(key, JSON.stringify(result));
    return result;
  } catch (err) {
    const stale = await readStoredAnalysis(key, ANALYSIS_STALE);
    if (stale) {
      stale.dataCache = "stored";
      stale.caution = [
        "داده زنده ناقص بود؛ آخرین تحلیل ذخیره‌شده نشان داده می‌شود.",
        ...stale.caution,
      ].slice(0, 6);
      memory.set(key, { at: Date.now(), value: stale });
      return stale;
    }
    throw err instanceof Error ? err : new Error("تحلیل انجام نشد.");
  }
}

async function loadUniverse(): Promise<{
  tickers: PaprikaTicker[];
  dominance: number | null;
  source: string;
}> {
  try {
    const [tickers, global] = await Promise.all([
      fetchJson<PaprikaTicker[]>(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`),
      fetchJson<PaprikaGlobal>(`${PAPRIKA}/global`),
    ]);
    if (!Array.isArray(tickers) || tickers.length === 0) throw new Error("empty");
    return {
      tickers,
      dominance: global.bitcoin_dominance_percentage,
      source: "CoinPaprika",
    };
  } catch {
    /* CoinPaprika was down; try the next public list. */
  }
  try {
    const [markets, global] = await Promise.all([
      fetchJson<unknown>(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d",
      ),
      fetchJson<unknown>("https://api.coingecko.com/api/v3/global"),
    ]);
    const parsed = fromCoinGecko(markets, global);
    if (parsed) {
      return {
        tickers: parsed.tickers as PaprikaTicker[],
        dominance: parsed.dominance,
        source: "CoinGecko",
      };
    }
  } catch {
    /* CoinGecko missed too. */
  }
  const raw = await fetchJson<unknown>(`${BINANCE}/ticker/24hr`);
  const parsed = fromBinanceTickers(raw);
  if (!parsed) throw new Error("فهرست بازار از CoinPaprika، CoinGecko و بایننس ساخته نشد.");
  return {
    tickers: parsed.tickers as PaprikaTicker[],
    dominance: null,
    source: "Binance ticker",
  };
}

async function computeAnalysis(run: DeskRun): Promise<AnalysisResult> {
  const listingPromise = loadVenueListing(run.venue);
  const loaded = await loadUniverse();
  const tickers = loaded.tickers;
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
  const { regime, medianRs7, note: regimeNote } = detectRegime(drafts, loaded.dominance);
  const dom =
    loaded.dominance == null
      ? {
          bias: "neutral" as const,
          note: msg(
            "دامیننس بیت‌کوین در این منبع نبود و عددی برایش ساخته نشد.",
            "Bitcoin dominance was missing from this source, so no figure was invented.",
          ),
        }
      : dominanceBiasOf(loaded.dominance, btcPct7d, medianRs7);
  let scored = scoreUniverse(drafts, regime, { unlocks, kill: killSwitch }).sort(
    (a, b) => b.score - a.score,
  );
  let books: BookCheck[] = [];
  try {
    const targets: { symbol: string; smallCap: boolean }[] = [];
    const seen = new Set<string>();
    const push = (symbol: string, smallCap: boolean) => {
      if (!symbol || symbol === "BTC" || seen.has(symbol) || targets.length >= 12) return;
      seen.add(symbol);
      targets.push({ symbol, smallCap });
    };
    for (const row of scored) {
      if (targets.length >= 6) break;
      push(row.symbol, false);
    }
    for (const row of scored) {
      const small = row.rank >= 40 || row.marketCap < 2_000_000_000;
      if (!small || row.volume24h < 4_000_000) continue;
      push(row.symbol, true);
    }
    books = await loadTopBooks(targets);
  } catch {
    books = [];
  }
  const bookBy = new Map(books.map((book) => [book.symbol, book]));
  const gated = scored
    .map((row) => applyBookGate(row, bookBy.get(row.symbol)))
    .sort((a, b) => b.score - a.score);
  const byHorizon = new Map<Horizon, CoinRow[]>(
    HORIZON_ORDER.map((horizon) => [horizon, applyLens(gated, horizon, run.cuts).sort((a, b) => b.score - a.score)]),
  );
  scored = byHorizon.get(run.horizon) ?? applyLens(gated, run.horizon, run.cuts);
  const decision = pickWinner(scored, regime, killSwitch);
  let pick = decision.pick;
  let runnerUp = decision.runnerUp;
  const btcRow = scored.find((row) => row.symbol === "BTC");
  if (!btcRow) throw new Error("داده بیت‌کوین در دسترس نیست");
  if (pick && bookBy.get(pick.symbol)?.gate === "thin" && pick.symbol !== "BTC") {
    runnerUp = pick;
    pick = btcRow;
  }
  let shown = pick ?? btcRow;
  const rejected = books.filter((book) => book.gate === "thin").map((book) => book.symbol);
  let pickBook = bookBy.get(shown.symbol);
  let conf = confidenceOf(shown, runnerUp, shown.hasKlines, klinesOk, drafts.length);
  const explained = explainPick(
    shown,
    runnerUp,
    regime,
    regimeNote,
    btcPct7d,
    { klinesOk, klinesTried: drafts.length, dominanceNote: dom.note },
  );
  const reasons = explained.reasons;
  const caution = explained.caution;
  if (!btcParsed) {
    caution.unshift(
      loaded.source === "CoinPaprika"
        ? "کندل بایننس در این لحظه در دسترس نبود؛ امتیاز با دادهٔ زندهٔ فهرست (بازده کوتاه‌مدت و MC/FDV) ساخته شد."
        : `کندل بایننس نبود. فهرست از ${loaded.source} آمد و عددی که در آن منبع نبود ساخته نشد.`,
    );
  } else if (!binanceOpen.value) {
    caution.unshift("بخشی از کندل‌ها از کش ذخیره‌شده آمد چون بایننس محدود بود.");
  }
  if (loaded.source !== "CoinPaprika") {
    caution.unshift(`CoinPaprika در دسترس نبود؛ فهرست از ${loaded.source} ساخته شد.`);
  }
  if (loaded.source === "Binance ticker") {
    caution.unshift("تیکر عمومی بایننس بازده ۷ و ۳۰ روزه و دامیننس ندارد؛ آن عددها ساخته نشدند.");
  }
  if (rejected.length) {
    caution.unshift(
      `دفتر سفارش نازک بود و سیگنال خرید این‌ها معلق شد: ${rejected.join("، ")}.`,
    );
  }
  if (pickBook?.gate === "crowded" || pickBook?.gate === "levered") {
    caution.unshift(pickBook.note);
  }
  if (killSwitch.active) {
    caution.unshift(killSwitch.note);
  }
  if (unlockSource === "unavailable") {
    caution.push(
      "تقویم آزادسازی الان در دسترس نبود؛ جریمه کلیف اعمال نشد. تحلیل قیمتی همچنان معتبر است.",
    );
  }
  let checklist = buildChecklist(shown, {
    regime,
    btcDominance: loaded.dominance,
    dominanceBias: dom.bias,
    kill: killSwitch,
    book: pickBook,
  });
  const sawBook = books.some((book) => book.slippageBps != null);
  const sawFunding = books.some((book) => book.funding8h != null);
  const sawOi = books.some((book) => book.openInterestUsd != null);
  const health = await cacheHealth();
  const generatedAt = new Date().toISOString();
  const calendar = sessionCalendar(new Date());
  const sessionBuys = calendar.blockSpot ? "suspended" : killSwitch.spotBuys;
  let opportunities = emptyOpportunityBoard(
    generatedAt,
    "اسکنر فرصت اجرا نشد؛ رتبه‌بندی فعلی میز دست نخورده است.",
  );
  try {
    const btcBars = btcParsed ? barsOf(btcParsed) : [];
    const inputs = drafts.map((draft) => {
      const parsed = draft.symbol === "BTC" ? btcParsed : klineById.get(draft.id)?.usd ?? null;
      return {
        symbol: draft.symbol,
        name: draft.name,
        rank: draft.rank,
        priceUsd: draft.priceUsd,
        volume24h: draft.volume24h,
        turnover: draft.turnover,
        bars: parsed ? barsOf(parsed) : [],
        btcCloses: btcBars.map((bar) => bar.c),
      };
    });
    opportunities = scanOpportunities(inputs, {
      generatedAt,
      regime,
      spotBuys: sessionBuys,
    });
  } catch {
    opportunities = emptyOpportunityBoard(
      generatedAt,
      "اسکنر فرصت به خطا خورد و نتیجه آن کنار گذاشته شد. انتخاب اصلی میز همچنان معتبر است.",
    );
  }

  const listing = await listingPromise;
  const listed = listing.ok ? new Set(listing.bases) : null;
  const dominanceSeries = await loadDominanceSeries();
  const looked = dominanceLookback(dominanceSeries, Date.parse(generatedAt));
  // Structural gates open the satellite. The holdout flag is a report, not a veto.
  const bookExtra = {
    dominance: looked.now,
    dominancePrev: looked.prev,
    opportunities: opportunities.items,
    listed,
    satelliteEarned: true,
    pauseSatellites: calendar.blockSpot,
  };
  const portfolio = buildPortfolio(scored, regime, killSwitch, bookExtra);
  let calls: HorizonCall[] = HORIZON_ORDER.map((horizon) => {
    const ranked = byHorizon.get(horizon) ?? scored;
    return callFromVerdict(
      buildVerdict({
        ranked,
        regime,
        kill: killSwitch,
        opportunities: opportunities.items,
        listed,
        horizon,
        dominance: looked.now,
        dominancePrev: looked.prev,
        satelliteEarned: true,
        pauseSatellites: calendar.blockSpot,
      }),
      horizon,
      generatedAt,
    );
  });
  if (calendar.blockSpot) {
    caution.unshift(
      msg(
        `${calendar.reasonFa} خرید تازه باز نمی‌شود و هسته نقد نمی‌شود.`,
        `${calendar.reasonEn} A new buy does not open, and the core is not liquidated.`,
      ),
    );
  }
  const verdict = verdictFromCall(calls.find((call) => call.horizon === run.horizon) ?? calls[0]!);
  const priorExplain = explained.caution.slice();
  const aligned = headlineForBook(scored, verdict);
  if (aligned.pick) {
    pick = aligned.pick;
    runnerUp = aligned.runnerUp;
    shown = aligned.pick;
    pickBook = bookBy.get(shown.symbol);
    conf = confidenceOf(shown, runnerUp, shown.hasKlines, klinesOk, drafts.length);
    const again = explainPick(shown, runnerUp, regime, regimeNote, btcPct7d, {
      klinesOk,
      klinesTried: drafts.length,
      dominanceNote: dom.note,
    });
    const operational = caution.filter((line) => !priorExplain.includes(line));
    reasons.splice(0, reasons.length, ...again.reasons);
    caution.splice(0, caution.length, ...operational, ...again.caution);
    checklist = buildChecklist(shown, {
      regime,
      btcDominance: loaded.dominance,
      dominanceBias: dom.bias,
      kill: killSwitch,
      book: pickBook,
    });
  }
  if (shown.highDilution) {
    caution.unshift(
      `${shown.symbol} برچسب High Dilution Risk دارد و ${shown.unlockPenalty} امتیاز از نمره کل کم شده است.`,
    );
  }
  if (decision.refused) {
    reasons.splice(0, reasons.length, verdict.reason);
  } else if (!reasons.includes(verdict.reason)) {
    reasons.unshift(verdict.reason);
  }
  if (!listing.ok && !verdict.reason.includes("فهرست تأیید نشد")) {
    caution.unshift(
      msg(
        "فهرست تأیید نشد؛ خرید آلت صادر نمی‌شود.",
        "The exchange list was not confirmed, so no alt buy is issued.",
      ),
    );
  }

  const result: AnalysisResult = {
    generatedAt,
    sources: [
      loaded.source,
      ...(btcParsed ? ["Binance"] : []),
      ...(sawBook ? ["Order book"] : []),
      ...(sawFunding ? ["Funding"] : []),
      ...(sawOi ? ["Open interest"] : []),
      ...(unlockSource === "coinmarketcap" ? ["CMC Unlocks"] : []),
    ],
    btcDominance: loaded.dominance,
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
    spotBuys: sessionBuys,
    unlockSource,
    unlockMatched,
    pick: shown,
    runnerUp,
    viaSeasonRule: decision.viaSeasonRule,
    refused: decision.refused,
    verdict,
    calls,
    listingOk: listing.ok,
    horizon: run.horizon,
    venue: run.venue,
    top: scored,
    reasons,
    caution: caution.slice(0, 6),
    confidence: conf.confidence,
    confidenceNote: conf.note,
    checklist,
    portfolio,
    books,
    opportunities,
    dataCache: "live" satisfies DataCache,
    cacheRows: health.rows,
    cacheKlines: health.klines,
  };

  return result;
}
