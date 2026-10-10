import { candidateBases } from "./exclusions.ts";
import { readCache, writeCache } from "./cache.server.ts";
import { assessBook, oiChange, type BookLevel } from "./microstructure.ts";
import type { BookCheck } from "./types.ts";

const DEPTH = "https://data-api.binance.vision/api/v3/depth";
const OKX = "https://www.okx.com";
const FAPI = "https://fapi.binance.com";
const FRESH_DEPTH = 90;
const FRESH_DERIV = 10 * 60;

type DepthJson = { asks?: [string, string][] };
type OkxFund = { data?: { fundingRate?: string }[] };
type OkxRows = { data?: string[][] };
type BinancePremium = { lastFundingRate?: string; markPrice?: string };
type BinanceOi = { openInterest?: string };
type BinanceHist = { sumOpenInterestValue?: string }[];
type BinanceRatio = { longShortRatio?: string }[];

export type BookTarget = { symbol: string; smallCap: boolean };

type Deriv = {
  funding8h: number | null;
  openInterestUsd: number | null;
  oiChange24h: number | null;
  longShortRatio: number | null;
};

const EMPTY_DERIV: Deriv = {
  funding8h: null,
  openInterestUsd: null,
  oiChange24h: null,
  longShortRatio: null,
};

async function fetchJson<T>(url: string, ms = 7000): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.4" },
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

function num(value: unknown): number | null {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function levelsOf(raw: [string, string][] | undefined): BookLevel[] {
  if (!raw) return [];
  const out: BookLevel[] = [];
  for (const row of raw) {
    const price = Number(row[0]);
    const qty = Number(row[1]);
    if (Number.isFinite(price) && Number.isFinite(qty)) out.push({ price, qty });
  }
  return out;
}

function mergeDeriv(primary: Deriv, extra: Deriv): Deriv {
  return {
    funding8h: primary.funding8h ?? extra.funding8h,
    openInterestUsd: primary.openInterestUsd ?? extra.openInterestUsd,
    oiChange24h: primary.oiChange24h ?? extra.oiChange24h,
    longShortRatio: primary.longShortRatio ?? extra.longShortRatio,
  };
}

function hasDeriv(row: Deriv): boolean {
  return (
    row.funding8h != null ||
    row.openInterestUsd != null ||
    row.oiChange24h != null ||
    row.longShortRatio != null
  );
}

async function okxDeriv(base: string): Promise<Deriv> {
  const inst = `${base}-USDT-SWAP`;
  const [fund, hist, lsr] = await Promise.all([
    fetchJson<OkxFund>(`${OKX}/api/v5/public/funding-rate?instId=${inst}`, 5000),
    fetchJson<OkxRows>(
      `${OKX}/api/v5/rubik/stat/contracts/open-interest-history?instId=${inst}&period=1H`,
      5000,
    ),
    fetchJson<OkxRows>(
      `${OKX}/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=${base}&period=1H`,
      5000,
    ),
  ]);
  const rows = hist?.data ?? [];
  const nowUsd = num(rows[0]?.[3]);
  const prevUsd = num(rows[23]?.[3] ?? rows[rows.length - 1]?.[3]);
  return {
    funding8h: num(fund?.data?.[0]?.fundingRate),
    openInterestUsd: nowUsd,
    oiChange24h: rows.length > 1 ? oiChange(nowUsd, prevUsd) : null,
    longShortRatio: num(lsr?.data?.[0]?.[1]),
  };
}

async function binanceDeriv(base: string): Promise<Deriv> {
  const symbol = `${base}USDT`;
  const [premium, oi, hist, ratio] = await Promise.all([
    fetchJson<BinancePremium>(`${FAPI}/fapi/v1/premiumIndex?symbol=${symbol}`, 2500),
    fetchJson<BinanceOi>(`${FAPI}/fapi/v1/openInterest?symbol=${symbol}`, 2500),
    fetchJson<BinanceHist>(
      `${FAPI}/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=24`,
      2500,
    ),
    fetchJson<BinanceRatio>(
      `${FAPI}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=1`,
      2500,
    ),
  ]);
  const mark = num(premium?.markPrice);
  const contracts = num(oi?.openInterest);
  const nowUsd = mark != null && contracts != null ? contracts * mark : null;
  const oldest = Array.isArray(hist) && hist.length ? num(hist[0]?.sumOpenInterestValue) : null;
  const newest =
    Array.isArray(hist) && hist.length ? num(hist[hist.length - 1]?.sumOpenInterestValue) : null;
  return {
    funding8h: num(premium?.lastFundingRate),
    openInterestUsd: nowUsd ?? newest,
    oiChange24h: oiChange(newest, oldest),
    longShortRatio: num(ratio?.[0]?.longShortRatio),
  };
}

async function derivativesFor(base: string): Promise<Deriv> {
  const key = `deriv:${base}USDT`;
  const fresh = await readCache(key, FRESH_DERIV);
  if (fresh) {
    try {
      const parsed = JSON.parse(fresh) as Deriv;
      if (parsed && typeof parsed === "object") return { ...EMPTY_DERIV, ...parsed };
    } catch {
      /* refetch */
    }
  }
  const [okx, binance] = await Promise.all([okxDeriv(base), binanceDeriv(base)]);
  const merged = mergeDeriv(okx, binance);
  if (hasDeriv(merged)) await writeCache(key, JSON.stringify(merged));
  return merged;
}

async function depthFor(base: string): Promise<BookLevel[] | null> {
  const key = `depth:${base}USDT:100`;
  const fresh = await readCache(key, FRESH_DEPTH);
  if (fresh) {
    try {
      return levelsOf((JSON.parse(fresh) as DepthJson).asks);
    } catch {
      /* refetch */
    }
  }
  const json = await fetchJson<DepthJson>(`${DEPTH}?symbol=${base}USDT&limit=100`);
  if (!json?.asks) return null;
  await writeCache(key, JSON.stringify({ asks: json.asks.slice(0, 100) }));
  return levelsOf(json.asks);
}

async function oneBook(target: BookTarget): Promise<BookCheck> {
  const bases = candidateBases(target.symbol.toUpperCase());
  let asks: BookLevel[] | null = null;
  let used = bases[0] ?? target.symbol;
  for (const base of bases) {
    const got = await depthFor(base);
    if (got && got.length) {
      asks = got;
      used = base;
      break;
    }
  }
  const deriv = await derivativesFor(used);
  return assessBook({
    symbol: target.symbol,
    asks: asks ?? [],
    funding8h: deriv.funding8h,
    openInterestUsd: deriv.openInterestUsd,
    oiChange24h: deriv.oiChange24h,
    longShortRatio: deriv.longShortRatio,
    smallCap: target.smallCap,
  });
}

export async function loadTopBooks(targets: BookTarget[]): Promise<BookCheck[]> {
  const seen = new Set<string>();
  const queue: BookTarget[] = [];
  for (const target of targets) {
    const symbol = target.symbol.toUpperCase();
    if (!symbol || symbol === "BTC" || seen.has(symbol)) continue;
    seen.add(symbol);
    queue.push({ symbol, smallCap: target.smallCap });
    if (queue.length >= 12) break;
  }
  const out: BookCheck[] = [];
  let i = 0;
  async function worker() {
    while (i < queue.length) {
      const idx = i++;
      const target = queue[idx];
      if (!target) continue;
      try {
        out.push(await oneBook(target));
      } catch {
        out.push(
          assessBook({
            symbol: target.symbol,
            asks: [],
            funding8h: null,
            smallCap: target.smallCap,
          }),
        );
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(3, queue.length) }, () => worker()));
  return out;
}
