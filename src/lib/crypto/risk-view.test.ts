import assert from "node:assert/strict";
import test from "node:test";
import {
  applyDeskFilter,
  buildRiskView,
  deskAlerts,
  riskTone,
  type FilterableCoin,
} from "./risk-view.ts";

function coin(partial: Partial<FilterableCoin> & Pick<FilterableCoin, "symbol">): FilterableCoin {
  return {
    beta: 1,
    turnover: 0.03,
    volume24h: 40_000_000,
    hasBtcPair: true,
    unlockPct30d: null,
    unlockPenalty: 0,
    unlockDays: null,
    unlockCliff: false,
    factors: [{ key: "liquidity", score: 60 }],
    score: 70,
    highDilution: false,
    buySignal: "open",
    rank: 10,
    weeklyStructure: "bull",
    aboveEma200: true,
    ...partial,
  };
}

test("risk bands sit at 35 and 65", () => {
  assert.equal(riskTone(34), "low");
  assert.equal(riskTone(35), "mid");
  assert.equal(riskTone(64), "mid");
  assert.equal(riskTone(65), "high");
});

test("unlock pressure and penalty copy use the 30-day supply share", () => {
  const view = buildRiskView(
    coin({
      symbol: "XYZ",
      unlockPct30d: 4.5,
      unlockPenalty: 15,
      unlockDays: 2,
      unlockCliff: false,
      beta: 1.6,
      factors: [{ key: "liquidity", score: 60 }],
    }),
  );
  const unlock = view.slices.find((slice) => slice.key === "unlock");
  const beta = view.slices.find((slice) => slice.key === "beta");
  const liquidity = view.slices.find((slice) => slice.key === "liquidity");
  assert.equal(liquidity?.value, 40);
  assert.equal(unlock?.value, 56);
  assert.equal(beta?.value, 80);
  assert.match(unlock?.detail ?? "", /جریمه 15 امتیاز/);
  assert.match(unlock?.detail ?? "", /4\.50٪/);
  assert.match(unlock?.detail ?? "", /48 ساعت/);
});

test("bitcoin is not punished for correlating with itself", () => {
  const view = buildRiskView(coin({ symbol: "BTC", beta: 1, factors: [{ key: "liquidity", score: 90 }] }));
  assert.equal(view.slices.find((slice) => slice.key === "beta")?.value, 15);
  assert.equal(view.slices.find((slice) => slice.key === "unlock")?.value, 0);
  assert.equal(view.tone, "low");
});

test("filters sort unlock pressure and keep only clean rebalance targets", () => {
  const rows = [
    coin({ symbol: "AAA", unlockPct30d: 1, unlockPenalty: 0 }),
    coin({ symbol: "BBB", unlockPct30d: 6, unlockPenalty: 18, highDilution: true, score: 80 }),
    coin({ symbol: "CCC", score: 40, unlockPct30d: 0.2 }),
    coin({ symbol: "DDD", score: 72, beta: 1.1 }),
  ];
  const unlocks = applyDeskFilter(rows, "unlock");
  assert.equal(unlocks[0]?.symbol, "BBB");
  const reb = applyDeskFilter(rows, "rebalance").map((row) => row.symbol);
  assert.deepEqual(reb, ["DDD", "AAA"]);
});

test("absurd unlock percents do not become a live alert", () => {
  const alerts = deskAlerts([
    coin({ symbol: "SHIB", unlockPct30d: 300, unlockPenalty: 20, unlockDays: 1 }),
    coin({ symbol: "REAL", unlockPct30d: 4.5, unlockPenalty: 15, unlockDays: 2 }),
  ]);
  assert.equal(alerts.some((item) => item.text.includes("SHIB")), false);
  assert.equal(alerts.some((item) => item.text.includes("REAL")), true);
});
