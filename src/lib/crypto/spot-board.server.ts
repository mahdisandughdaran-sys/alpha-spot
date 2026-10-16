import { buildSpotPlan, type SpotPlan } from "./spot-plan.ts";
import { loadSpotCandles } from "./spot-plan.server.ts";
import {
  pickTopSpot,
  rememberSpotNames,
  TOP_SPOT,
  type PickedSpot,
  type RankSeed,
} from "./spot-assets.ts";

const PAPRIKA = "https://api.coinpaprika.com/v1/tickers?quotes=USD&limit=150";
const GECKO =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false";
const PRICES = "https://data-api.binance.vision/api/v3/ticker/price";
const BOARD_TTL_MS = 2 * 60 * 1000;

export type SpotBoardRow = {
  rank: number;
  marketRank: number | null;
  assetId: string;
  plan: SpotPlan;
};

export type SpotBoard = {
  fetchedAt: string;
  source: "live" | "fallback";
  feed: string;
  rows: SpotBoardRow[];
};

let boardCache: { at: number; value: SpotBoard } | null = null;

export async function loadTopSpotBoard(force = false): Promise<SpotBoard> {
  if (!force && boardCache && Date.now() - boardCache.at < BOARD_TTL_MS) {
    rememberSpotNames(
      boardCache.value.rows.map((row) => ({
        id: row.assetId,
        nameFa: row.plan.nameFa,
        nameEn: row.plan.nameEn,
      })),
    );
    return boardCache.value;
  }

  const [ranked, bases] = await Promise.all([fetchRanked(), fetchUsdtBases()]);
  const source = ranked.rows.length > 0 ? "live" : "fallback";
  const candidates = pickTopSpot(ranked.rows, bases, TOP_SPOT + 8);
  rememberSpotNames(candidates);
  const plans = await firstPlans(candidates, TOP_SPOT, 4);
  const rows: SpotBoardRow[] = [];
  for (let i = 0; i < candidates.length && rows.length < TOP_SPOT; i++) {
    const plan = plans[i];
    const asset = candidates[i];
    if (!plan || !asset) continue;
    rows.push({
      rank: rows.length + 1,
      marketRank: asset.marketRank,
      assetId: asset.id,
      plan,
    });
  }
  if (rows.length < 8) throw new Error("تحلیل بیست ارز اول کامل نشد. کمی بعد دوباره بزن.");

  const value: SpotBoard = {
    fetchedAt: new Date().toISOString(),
    source,
    feed: ranked.feed,
    rows,
  };
  rememberSpotNames(
    rows.map((row) => ({
      id: row.assetId,
      nameFa: row.plan.nameFa,
      nameEn: row.plan.nameEn,
    })),
  );
  boardCache = { at: Date.now(), value };
  return value;
}

async function firstPlans(assets: PickedSpot[], want: number, workers: number): Promise<(SpotPlan | null)[]> {
  const results: (SpotPlan | null)[] = new Array(assets.length).fill(null);
  let next = 0;
  let ok = 0;

  async function run(): Promise<void> {
    while (ok < want && next < assets.length) {
      const index = next;
      next += 1;
      const asset = assets[index];
      if (!asset) continue;
      try {
        const candles = await loadSpotCandles(asset.pair);
        if (candles.length < 20) continue;
        results[index] = buildSpotPlan(candles, asset);
        ok += 1;
      } catch {
        /* A missing pair should not blank the rest of the desk. */
      }
    }
  }

  const count = Math.min(workers, assets.length);
  await Promise.all(Array.from({ length: count }, () => run()));
  return results;
}

async function fetchRanked(): Promise<{ rows: RankSeed[]; feed: string }> {
  try {
    const raw = await fetchJson(PAPRIKA);
    const rows = readPaprika(raw);
    if (rows.length >= TOP_SPOT) return { rows, feed: "CoinPaprika" };
  } catch {
    /* try the next public list */
  }
  try {
    const raw = await fetchJson(GECKO);
    const rows = readGecko(raw);
    if (rows.length >= TOP_SPOT) return { rows, feed: "CoinGecko" };
  } catch {
    /* the fallback catalog still fills the desk */
  }
  return { rows: [], feed: "fallback" };
}

async function fetchUsdtBases(): Promise<Set<string> | null> {
  try {
    const raw = await fetchJson(PRICES);
    if (!Array.isArray(raw)) return null;
    const bases = new Set<string>();
    for (const item of raw) {
      if (!item || typeof item !== "object") continue;
      const symbol = String((item as { symbol?: unknown }).symbol ?? "");
      if (!symbol.endsWith("USDT")) continue;
      bases.add(symbol.slice(0, -4));
    }
    return bases.size > 0 ? bases : null;
  } catch {
    return null;
  }
}

async function fetchJson(url: string): Promise<unknown> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8_000);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.5" },
    });
    if (!res.ok) throw new Error(String(res.status));
    return await res.json();
  } finally {
    clearTimeout(timer);
  }
}

function readPaprika(raw: unknown): RankSeed[] {
  if (!Array.isArray(raw)) return [];
  const rows: RankSeed[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as { symbol?: unknown; name?: unknown; rank?: unknown };
    const symbol = String(row.symbol ?? "").toUpperCase();
    const rank = Number(row.rank);
    if (!symbol || !Number.isFinite(rank) || rank <= 0) continue;
    rows.push({ symbol, name: String(row.name ?? symbol), rank });
  }
  return rows;
}

function readGecko(raw: unknown): RankSeed[] {
  if (!Array.isArray(raw)) return [];
  const rows: RankSeed[] = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as { symbol?: unknown; name?: unknown; market_cap_rank?: unknown };
    const symbol = String(row.symbol ?? "").toUpperCase();
    const rank = Number(row.market_cap_rank);
    if (!symbol || !Number.isFinite(rank) || rank <= 0) continue;
    rows.push({ symbol, name: String(row.name ?? symbol), rank });
  }
  return rows;
}
