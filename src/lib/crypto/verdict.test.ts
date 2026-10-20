import assert from "node:assert/strict";
import test from "node:test";
import type { CoinRow, FactorScore } from "./types.ts";
import type { BtcKillSwitch } from "./types.ts";
import type { Opportunity } from "./opportunity.ts";
import { buildVerdict } from "./verdict.ts";

function row(partial: Partial<CoinRow> & Pick<CoinRow, "symbol" | "name" | "rank">): CoinRow {
  const factors: FactorScore[] = [];
  return {
    id: partial.symbol,
    priceUsd: 10,
    priceBtc: 0.0001,
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

const kill = {
  status: "NORMAL",
  aboveEma200: true,
  weeklySupportBroken: false,
  severeWeekly: false,
  weeklyStructure: "bull",
} as BtcKillSwitch;
const btc = row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 60 });
const link = row({ symbol: "LINK", name: "Chainlink", rank: 12, score: 90 });

const zone = {
  symbol: "LINK",
  status: "in-zone",
  priceUsd: 10,
  zone: { low: 9, high: 11, invalidation: 8, touches: 2, atr: 0.4, reason: "" },
} as Opportunity;

test("a missing exchange list does not invent an alt buy", () => {
  const verdict = buildVerdict({
    ranked: [link, btc],
    regime: "neutral",
    kill,
    opportunities: [zone],
    listed: null,
    horizon: "week",
    dominance: 50,
    dominancePrev: 53,
    satelliteEarned: true,
  });
  assert.equal(verdict.kind, "stay");
  assert.equal(verdict.symbol, "BTC");
});

test("an unlisted alt is not a buy", () => {
  const verdict = buildVerdict({
    ranked: [link, btc],
    regime: "neutral",
    kill,
    opportunities: [zone],
    listed: new Set(["BTC"]),
    horizon: "month",
    dominance: 50,
    dominancePrev: 53,
    satelliteEarned: true,
  });
  assert.notEqual(verdict.kind, "buy");
  assert.equal(verdict.symbol, "BTC");
});

test("a listed alt in the zone is a buy even when the holdout flag is off", () => {
  const verdict = buildVerdict({
    ranked: [link, btc],
    regime: "neutral",
    kill,
    opportunities: [zone],
    listed: new Set(["LINK", "BTC"]),
    horizon: "week",
    dominance: 50,
    dominancePrev: 53,
    satelliteEarned: false,
  });
  assert.equal(verdict.kind, "buy");
  assert.equal(verdict.symbol, "LINK");
});

test("a listed alt in the zone stays a buy when the holdout flag is on", () => {
  const verdict = buildVerdict({
    ranked: [link, btc],
    regime: "neutral",
    kill,
    opportunities: [zone],
    listed: new Set(["LINK", "BTC"]),
    horizon: "week",
    dominance: 50,
    dominancePrev: 53,
    satelliteEarned: true,
  });
  assert.equal(verdict.kind, "buy");
  assert.equal(verdict.symbol, "LINK");
});

test("a holiday pauses a new satellite and does not cash the core", () => {
  const verdict = buildVerdict({
    ranked: [link, btc],
    regime: "neutral",
    kill,
    opportunities: [zone],
    listed: new Set(["LINK", "BTC"]),
    horizon: "week",
    dominance: 50,
    dominancePrev: 53,
    satelliteEarned: true,
    pauseSatellites: true,
  });
  assert.equal(verdict.kind, "wait");
  assert.equal(verdict.symbol, "BTC");
});

test("bitcoin season does not send the book to cash", () => {
  const close = row({ symbol: "LINK", name: "Chainlink", rank: 12, score: 72 });
  const leader = row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 70 });
  const verdict = buildVerdict({
    ranked: [close, leader],
    regime: "btc",
    kill,
    opportunities: [],
    listed: new Set(["LINK", "BTC"]),
    horizon: "month",
  });
  assert.equal(verdict.kind, "stay");
  assert.equal(verdict.symbol, "BTC");
});
