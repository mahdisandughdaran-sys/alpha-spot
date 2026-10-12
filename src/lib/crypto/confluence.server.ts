import {
  buildLiquidationMap,
  judgeConfluence,
  readFlow,
  type ConfluenceReport,
  type FlowCandle,
  type HeatCandle,
} from "./confluence.ts";

const SPOT = "https://data-api.binance.vision/api/v3/klines";
const FAPI = "https://fapi.binance.com";
const OKX = "https://www.okx.com";
const TTL = 45_000;

const memory = new Map<string, { at: number; row: ConfluenceReport }>();

type RawKline = [
  number,
  string,
  string,
  string,
  string,
  string,
  number,
  string,
  number,
  string,
  string,
  string,
];

async function fetchJson<T>(url: string, ms = 7000): Promise<T | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/1.5" },
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

function spotCandles(rows: RawKline[]): FlowCandle[] {
  const out: FlowCandle[] = [];
  for (const row of rows) {
    const volume = Number(row[5]);
    const takerBuy = Number(row[9]);
    const close = Number(row[4]);
    if (!(volume > 0) || !(close > 0)) continue;
    out.push({
      t: Number(row[0]),
      open: Number(row[1]),
      high: Number(row[2]),
      low: Number(row[3]),
      close,
      volume,
      takerBuy: Number.isFinite(takerBuy) ? Math.min(volume, Math.max(0, takerBuy)) : volume * 0.5,
    });
  }
  return out;
}

function heatFromFlow(rows: FlowCandle[]): HeatCandle[] {
  return rows.map((row) => ({
    high: row.high,
    low: row.low,
    close: row.close,
    volume: row.volume,
  }));
}

async function okxSwapCandles(base: string): Promise<HeatCandle[] | null> {
  const json = await fetchJson<{ data?: string[][] }>(
    `${OKX}/api/v5/market/candles?instId=${base}-USDT-SWAP&bar=1H&limit=100`,
    6000,
  );
  const rows = json?.data;
  if (!rows?.length) return null;
  const out: HeatCandle[] = [];
  for (const row of [...rows].reverse()) {
    const high = Number(row[2]);
    const low = Number(row[3]);
    const close = Number(row[4]);
    const volume = Number(row[6] ?? row[5]);
    if (high > 0 && low > 0 && close > 0 && volume > 0) out.push({ high, low, close, volume });
  }
  return out.length >= 8 ? out : null;
}

async function loadHeat(base: string, spot: FlowCandle[]): Promise<{ candles: HeatCandle[]; source: "futures" | "spot" }> {
  const futures = await fetchJson<RawKline[]>(
    `${FAPI}/fapi/v1/klines?symbol=${base}USDT&interval=1h&limit=120`,
    5000,
  );
  if (Array.isArray(futures) && futures.length >= 8 && Array.isArray(futures[0])) {
    return { candles: heatFromFlow(spotCandles(futures)), source: "futures" };
  }
  const okx = await okxSwapCandles(base);
  if (okx) return { candles: okx, source: "futures" };
  return { candles: heatFromFlow(spot), source: "spot" };
}

async function loadSkew(base: string, price: number): Promise<{
  funding8h: number | null;
  openInterestUsd: number | null;
  longShortRatio: number | null;
  futuresBuyRatio4h: number | null;
}> {
  const [premium, oi, ratio, taker, okxFund, okxLsr, okxOi, okxTaker] = await Promise.all([
    fetchJson<{ lastFundingRate?: string; markPrice?: string }>(
      `${FAPI}/fapi/v1/premiumIndex?symbol=${base}USDT`,
      4000,
    ),
    fetchJson<{ openInterest?: string }>(`${FAPI}/fapi/v1/openInterest?symbol=${base}USDT`, 4000),
    fetchJson<{ longShortRatio?: string }[]>(
      `${FAPI}/futures/data/globalLongShortAccountRatio?symbol=${base}USDT&period=1h&limit=1`,
      4000,
    ),
    fetchJson<{ buySellRatio?: string }[]>(
      `${FAPI}/futures/data/takerlongshortRatio?symbol=${base}USDT&period=1h&limit=8`,
      4000,
    ),
    fetchJson<{ data?: { fundingRate?: string }[] }>(
      `${OKX}/api/v5/public/funding-rate?instId=${base}-USDT-SWAP`,
      4000,
    ),
    fetchJson<{ data?: string[][] }>(
      `${OKX}/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=${base}&period=1H`,
      4000,
    ),
    fetchJson<{ data?: string[][] }>(
      `${OKX}/api/v5/rubik/stat/contracts/open-interest-history?instId=${base}-USDT-SWAP&period=1H`,
      4000,
    ),
    fetchJson<{ data?: string[][] }>(
      `${OKX}/api/v5/rubik/stat/taker-volume?ccy=${base}&instType=CONTRACTS&period=1H`,
      4000,
    ),
  ]);

  const mark = num(premium?.markPrice) ?? price;
  const contracts = num(oi?.openInterest);
  const ratios = Array.isArray(taker) ? taker.slice(-4) : [];
  const takerNums = ratios
    .map((row) => num(row.buySellRatio))
    .filter((value): value is number => value != null && value > 0);
  const binanceFrac = takerNums.length
    ? takerNums.reduce((a, b) => a + b / (1 + b), 0) / takerNums.length
    : null;

  return {
    funding8h: num(premium?.lastFundingRate) ?? num(okxFund?.data?.[0]?.fundingRate),
    openInterestUsd: contracts != null ? contracts * mark : num(okxOi?.data?.[0]?.[3]),
    longShortRatio: (Array.isArray(ratio) ? num(ratio[0]?.longShortRatio) : null) ?? num(okxLsr?.data?.[0]?.[1]),
    futuresBuyRatio4h: binanceFrac ?? okxTakerFrac(okxTaker?.data),
  };
}

function okxTakerFrac(rows: string[][] | undefined): number | null {
  if (!rows?.length) return null;
  let buy = 0;
  let sell = 0;
  for (const row of rows.slice(0, 4)) {
    const sold = Number(row[1]);
    const bought = Number(row[2]);
    if (Number.isFinite(sold) && Number.isFinite(bought)) {
      sell += sold;
      buy += bought;
    }
  }
  const total = buy + sell;
  return total > 0 ? buy / total : null;
}

export async function loadConfluence(symbol: string): Promise<ConfluenceReport> {
  const base = symbol.toUpperCase();
  const hit = memory.get(base);
  if (hit && Date.now() - hit.at < TTL) return hit.row;

  const spotRaw = await fetchJson<RawKline[]>(`${SPOT}?symbol=${base}USDT&interval=1h&limit=48`);
  if (!Array.isArray(spotRaw) || !Array.isArray(spotRaw[0])) {
    throw new Error(`جفت ${base}/USDT روی بازار اسپات پیدا نشد.`);
  }
  const spot = spotCandles(spotRaw);
  const flow = readFlow(spot);
  if (!flow) throw new Error("کندل جریان حجم ناقص بود.");
  const price = spot[spot.length - 1]!.close;

  const [heat, skew] = await Promise.all([loadHeat(base, spot), loadSkew(base, price)]);
  const map = buildLiquidationMap(heat.candles, price, {
    longShortRatio: skew.longShortRatio,
    funding8h: skew.funding8h,
  });
  const judgement = judgeConfluence({
    price,
    flow,
    clusters: map.clusters,
    funding8h: skew.funding8h,
    longShortRatio: skew.longShortRatio,
    futuresBuyRatio4h: skew.futuresBuyRatio4h,
  });

  const row: ConfluenceReport = {
    symbol: base,
    pair: `${base}/USDT`,
    price,
    generatedAt: new Date().toISOString(),
    candleSource: heat.source,
    flow,
    map,
    funding8h: skew.funding8h,
    openInterestUsd: skew.openInterestUsd,
    longShortRatio: skew.longShortRatio,
    futuresBuyRatio4h: skew.futuresBuyRatio4h,
    judgement,
  };
  memory.set(base, { at: Date.now(), row });
  return row;
}
