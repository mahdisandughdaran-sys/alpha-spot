import assert from "node:assert/strict";
import { test } from "node:test";
import { classifyMacroRisk, evaluateKillSwitch } from "./kill-switch.ts";
import { assessUnlocks, dilutionPenalty } from "./unlocks.ts";
import { advisePosition, buildRebalancePlan } from "./rebalance.ts";
import { buildPortfolio, sleeveTotal } from "./portfolio.ts";
import type { BtcKillSwitch, CoinRow, FactorScore } from "./types.ts";

test("macro risk is suspended only when both gates fail", () => {
  assert.equal(classifyMacroRisk(false, false), "NORMAL");
  assert.equal(classifyMacroRisk(true, false), "HIGH_RISK");
  assert.equal(classifyMacroRisk(false, true), "HIGH_RISK");
  assert.equal(classifyMacroRisk(true, true), "SUSPENDED");
});

test("crashing bitcoin trips the kill switch", () => {
  const closes = Array.from({ length: 220 }, (_, i) => 100 - i * 0.35);
  const price = closes[closes.length - 1] ?? 0;
  const kill = evaluateKillSwitch({ priceUsd: price, closes });
  assert.equal(kill.status, "SUSPENDED");
  assert.equal(kill.spotBuys, "suspended");
  assert.equal(kill.sizeMultiplier, 0);
  assert.equal(kill.aboveEma200, false);
  assert.equal(kill.severeWeekly, true);
});

test("rising bitcoin stays normal", () => {
  const closes = Array.from({ length: 220 }, (_, i) => 40 + i * 0.5);
  const price = closes[closes.length - 1] ?? 0;
  const kill = evaluateKillSwitch({ priceUsd: price, closes });
  assert.equal(kill.status, "NORMAL");
  assert.equal(kill.spotBuys, "open");
  assert.equal(kill.sizeMultiplier, 1);
});

test("dilution penalty is 15 to 20 points above 3 percent", () => {
  assert.equal(dilutionPenalty(2.9), 0);
  assert.equal(dilutionPenalty(3), 0);
  assert.equal(dilutionPenalty(3.01), 15);
  assert.equal(dilutionPenalty(5), 15);
  assert.equal(dilutionPenalty(6.2), 18);
  assert.equal(dilutionPenalty(12), 20);
});

test("assessUnlocks sums a cliff inside 30 days", () => {
  const now = new Date("2026-10-08T00:00:00.000Z");
  const result = assessUnlocks({
    maxSupply: 1_000,
    totalSupply: 1_000,
    now,
    events: [
      { time: "2026-10-20T00:00:00.000Z", amount: 40, allocationName: "team" },
      { time: "2026-10-28T00:00:00.000Z", amount: 25, allocationName: "investors" },
      { time: "2026-12-01T00:00:00.000Z", amount: 500, allocationName: "later" },
    ],
  });
  assert.ok(result.pct30d != null && Math.abs(result.pct30d - 6.5) < 1e-9);
  assert.equal(result.penalty, 18);
  assert.equal(result.highDilution, true);
  assert.equal(result.cliff, true);
  assert.equal(result.nextDate, "2026-10-20");
});

function row(partial: Partial<CoinRow> & Pick<CoinRow, "symbol" | "name" | "rank" | "score">): CoinRow {
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
    rs7d: 0.02,
    rs14d: 0,
    rs30d: 0,
    rsi14: 50,
    volatility30d: 0.03,
    maxDrawdown30d: -0.08,
    distFrom30dHighPct: -0.12,
    aboveSma: true,
    aboveEma200: true,
    weeklyStructure: "bull",
    obvRising: true,
    hasBtcPair: true,
    hasKlines: true,
    klineDays: 200,
    pairSeries: [],
    turnover: 0.05,
    circulatingSupply: 1,
    maxSupply: 1,
    mcFdv: 0.8,
    narrativeTags: [],
    narrativeTagsFa: [],
    accrual: "none",
    accrualNote: "",
    pairWeekly: "bull",
    pairSupportBroken: false,
    unlockPenalty: 0,
    highDilution: false,
    unlockPct30d: 0.4,
    unlockDate: null,
    unlockDays: null,
    unlockCliff: false,
    buySignal: "open",
    sizeMultiplier: 1,
    factors,
    ...partial,
  };
}

const normalKill: BtcKillSwitch = {
  status: "NORMAL",
  active: false,
  aboveEma200: true,
  ema200: 100,
  priceUsd: 120,
  distanceToEma: 0.2,
  weeklyStructure: "bull",
  weeklyMomentum: 0.05,
  severeWeekly: false,
  weeklySupportBroken: false,
  sizeMultiplier: 1,
  spotBuys: "open",
  headline: "ریسک کلان نرمال",
  note: "normal",
};

test("broken weekly alt/btc support rotates the position", () => {
  const coins = [
    row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 80 }),
    row({
      symbol: "SOL",
      name: "Solana",
      rank: 6,
      score: 74,
      pairSupportBroken: true,
      pairWeekly: "bear",
    }),
    row({ symbol: "LINK", name: "Chainlink", rank: 15, score: 81 }),
  ];
  const advice = advisePosition(
    { symbol: "SOL", entryUsd: 8, sizeUsd: 1000 },
    coins,
    normalKill,
  );
  assert.equal(advice.action, "REBALANCE");
  assert.equal(advice.targetSymbol, "LINK");
  assert.ok(advice.pnlPct != null && advice.pnlPct > 0);
});

test("score under 60 exits toward bitcoin when nothing else qualifies", () => {
  const coins = [
    row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 77 }),
    row({ symbol: "DOGE", name: "Dogecoin", rank: 10, score: 48 }),
  ];
  const advice = advisePosition(
    { symbol: "DOGE", entryUsd: 0.1, sizeUsd: 500 },
    coins,
    normalKill,
  );
  assert.equal(advice.action, "REBALANCE");
  assert.equal(advice.targetSymbol, "BTC");
});

test("suspended book rotates alts to bitcoin and halves nothing that is already closed", () => {
  const kill: BtcKillSwitch = {
    ...normalKill,
    status: "SUSPENDED",
    active: true,
    aboveEma200: false,
    severeWeekly: true,
    sizeMultiplier: 0,
    spotBuys: "suspended",
  };
  const coins = [
    row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 70, buySignal: "open" }),
    row({ symbol: "ETH", name: "Ethereum", rank: 2, score: 75, buySignal: "suspended", sizeMultiplier: 0 }),
    row({ symbol: "ARB", name: "Arbitrum", rank: 40, score: 72, buySignal: "suspended", sizeMultiplier: 0 }),
  ];
  const plan = buildRebalancePlan(
    [
      { symbol: "ETH", entryUsd: 2000, sizeUsd: 4000 },
      { symbol: "ARB", entryUsd: 1, sizeUsd: 1000 },
    ],
    coins,
    kill,
  );
  assert.equal(plan.rows.every((r) => r.action === "REBALANCE" && r.targetSymbol === "BTC"), true);
  assert.equal(plan.rotateUsd, 5000);
  assert.equal(plan.destinations[0]?.symbol, "BTC");
  const sleeves = buildPortfolio(coins, "alt", kill);
  assert.equal(sleeves[0]?.legs[0]?.symbol, "BTC");
  assert.ok(Math.abs(sleeveTotal(sleeves) - 1) < 0.001);
  assert.equal(sleeves[1]?.legs.length, 0);
});

test("high risk halves alt sleeves and keeps the book funded", () => {
  const kill: BtcKillSwitch = {
    ...normalKill,
    status: "HIGH_RISK",
    active: true,
    sizeMultiplier: 0.5,
    spotBuys: "reduced",
    aboveEma200: false,
  };
  const ranked = [
    row({ symbol: "BTC", name: "Bitcoin", rank: 1, score: 80 }),
    row({ symbol: "ETH", name: "Ethereum", rank: 2, score: 75 }),
    row({ symbol: "SOL", name: "Solana", rank: 6, score: 72 }),
    row({ symbol: "LINK", name: "Chainlink", rank: 12, score: 70 }),
  ];
  const sleeves = buildPortfolio(ranked, "neutral", kill);
  const base = sleeveTotal(buildPortfolio(ranked, "neutral"));
  assert.ok(Math.abs(sleeveTotal(sleeves) - base) < 0.001);
  const btc = sleeves.flatMap((s) => s.legs).find((l) => l.symbol === "BTC");
  assert.ok(btc && btc.weight > 0.35);
});
