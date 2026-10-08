import assert from "node:assert/strict";
import { test } from "node:test";
import {
  clamp,
  detectWeeklyStructure,
  ema,
  lookback,
  maxDrawdown,
  rsi,
  vsBtc,
  weeklyFromDaily,
} from "./math.ts";
import { mcFdvRatio } from "./catalog.ts";
import { isNonSpotCandidate } from "./exclusions.ts";
import { FACTOR_WEIGHTS, factorWeightSum, pickWinner } from "./scoring.ts";
import { buildPortfolio, sleeveTotal } from "./portfolio.ts";
import { dominanceBiasOf } from "./checklist.ts";
import type { CoinRow, FactorScore } from "./types.ts";

test("vsBtc is opportunity cost, not dollar change", () => {
  const rs = vsBtc(10, 15);
  assert.ok(rs < 0);
  assert.ok(Math.abs(rs - (1.1 / 1.15 - 1)) < 1e-12);
});

test("rsi of a straight up series is high", () => {
  const closes = Array.from({ length: 30 }, (_, i) => 100 + i);
  const value = rsi(closes, 14);
  assert.ok(value != null && value > 70);
});

test("maxDrawdown finds the peak-to-trough", () => {
  const dd = maxDrawdown([10, 12, 8, 9]);
  assert.ok(Math.abs(dd - (8 / 12 - 1)) < 1e-12);
});

test("ema200 needs 200 points and tracks a step higher", () => {
  const flat = Array.from({ length: 200 }, () => 10);
  const stepped = [...flat.slice(0, 180), ...Array.from({ length: 20 }, () => 20)];
  const value = ema(stepped, 200);
  assert.ok(value != null);
  assert.ok(value > 10);
  assert.ok(value < 12);
  assert.equal(ema(flat.slice(0, 50), 200), null);
});

test("weekly structure flags higher highs as bull", () => {
  const daily: number[] = [];
  for (let w = 0; w < 16; w++) {
    const base = 100 + w * 3;
    for (let d = 0; d < 7; d++) daily.push(base + (d % 3));
  }
  assert.equal(detectWeeklyStructure(daily), "bull");
});

test("weeklyFromDaily keeps one close per week from the end", () => {
  const closes = Array.from({ length: 21 }, (_, i) => i + 1);
  const w = weeklyFromDaily(closes);
  assert.equal(w.length, 3);
  assert.equal(w[2], 21);
});

test("lookback is last/prev - 1", () => {
  const value = lookback([100, 110], 1);
  assert.ok(value != null && Math.abs(value - 0.1) < 1e-12);
  assert.equal(lookback([100], 1), null);
});

test("clamp bounds", () => {
  assert.equal(clamp(-4), 0);
  assert.equal(clamp(140), 100);
  assert.equal(clamp(40), 40);
});

test("mcFdv uses market cap over fully diluted value", () => {
  const ratio = mcFdvRatio(50, 100, 2, 100);
  assert.ok(ratio != null);
  assert.equal(ratio, 100 / (2 * 100));
  assert.equal(mcFdvRatio(50, 0, 2, 100), null);
});

test("stables and wrapped names are excluded", () => {
  assert.equal(isNonSpotCandidate("USDT", "Tether"), true);
  assert.equal(isNonSpotCandidate("STETH", "Lido Staked Ether"), true);
  assert.equal(isNonSpotCandidate("ETH", "Ethereum"), false);
  assert.equal(isNonSpotCandidate("BTC", "Bitcoin"), false);
});

test("factor weights sum to 1", () => {
  assert.ok(Math.abs(factorWeightSum() - 1) < 1e-9);
  assert.equal(FACTOR_WEIGHTS.tokenomics, 0.16);
});

function row(partial: Partial<CoinRow> & Pick<CoinRow, "symbol" | "name" | "rank">): CoinRow {
  const factors: FactorScore[] = [];
  return {
    id: partial.symbol,
    priceUsd: 1,
    priceBtc: 0.00001,
    marketCap: 1e9,
    volume24h: 50_000_000,
    volumeChange24h: 0,
    beta: 1,
    athDrawdownPct: -20,
    pct1h: 0,
    pct6h: 0,
    pct12h: 0,
    pct24h: 0,
    pct7d: 0,
    pct30d: 0,
    rs24h: 0,
    rs7d: 0,
    rs14d: 0,
    rs30d: 0,
    rsi14: 50,
    volatility30d: 0.03,
    maxDrawdown30d: -0.08,
    distFrom30dHighPct: -0.12,
    aboveSma: true,
    aboveEma200: true,
    weeklyStructure: "range",
    obvRising: true,
    hasBtcPair: true,
    hasKlines: true,
    klineDays: 200,
    pairSeries: [],
    turnover: 0.05,
    circulatingSupply: 1,
    maxSupply: 1,
    mcFdv: 0.9,
    narrativeTags: [],
    narrativeTagsFa: [],
    accrual: "none",
    accrualNote: "",
    pairWeekly: null,
    pairSupportBroken: false,
    unlockPenalty: 0,
    highDilution: false,
    unlockPct30d: null,
    unlockDate: null,
    unlockDays: null,
    unlockCliff: false,
    buySignal: "open",
    sizeMultiplier: 1,
    score: 70,
    factors,
    ...partial,
  };
}

test("bitcoin season picks BTC when the alt lead is thin", () => {
  const btc = row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 70 });
  const alt = row({
    symbol: "LINK",
    name: "Chainlink",
    rank: 12,
    score: 72,
    rs7d: -0.02,
  });
  const { pick } = pickWinner([alt, btc], "btc");
  assert.equal(pick.symbol, "BTC");
});

test("low MC/FDV alts are ineligible", () => {
  const btc = row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 60 });
  const junk = row({
    symbol: "HYPE",
    name: "Hype",
    rank: 40,
    score: 90,
    mcFdv: 0.2,
    distFrom30dHighPct: -0.12,
  });
  const { pick } = pickWinner([junk, btc], "neutral");
  assert.equal(pick.symbol, "BTC");
});

test("portfolio sleeves are about 100 percent", () => {
  const ranked = [
    row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 80 }),
    row({ symbol: "ETH", name: "Ethereum", rank: 2, score: 75 }),
    row({ symbol: "SOL", name: "Solana", rank: 6, score: 72 }),
    row({ symbol: "LINK", name: "Chainlink", rank: 12, score: 70 }),
    row({ symbol: "NEAR", name: "NEAR", rank: 30, score: 68 }),
    row({ symbol: "FET", name: "Fetch", rank: 55, score: 66 }),
    row({ symbol: "RENDER", name: "Render", rank: 70, score: 64 }),
  ];
  const sleeves = buildPortfolio(ranked, "neutral");
  const total = sleeveTotal(sleeves);
  assert.ok(Math.abs(total - 1) < 0.02);
  assert.equal(sleeves[0]?.targetPct, 55);
});

test("dominance bias", () => {
  assert.equal(dominanceBiasOf(57, 0.08, -0.05).bias, "rising");
  assert.equal(dominanceBiasOf(50, 0.01, 0.04).bias, "falling");
});
