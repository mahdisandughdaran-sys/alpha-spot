import assert from "node:assert/strict";
import { test } from "node:test";
import {
  accumulationIndex,
  applySectorLayer,
  buildAtrPlan,
  fdvMultiple,
  flowAdjustment,
  inflationPenalty,
  scoreBtcMacroRisk,
} from "./spot-analytics.ts";

test("FDV multiple penalizes only when dilution is worse than 5x", () => {
  assert.equal(fdvMultiple(0.2), 5);
  assert.equal(inflationPenalty(0.25, "AAA"), 0);
  assert.equal(inflationPenalty(0.2, "AAA"), 0);
  assert.equal(inflationPenalty(0.125, "AAA"), 8);
  assert.equal(inflationPenalty(0.1, "AAA"), 12);
  assert.equal(inflationPenalty(0.05, "AAA"), 16);
  assert.equal(inflationPenalty(0.05, "BTC"), 0);
  assert.equal(inflationPenalty(0.05, "ETH"), 0);
});

test("accumulation rewards up-day volume and only pays after a pullback", () => {
  const closes = Array.from({ length: 20 }, (_, i) => 100 + i);
  const volumes = Array.from({ length: 20 }, () => 1_000);
  const flow = accumulationIndex(closes, volumes);
  assert.ok(flow);
  assert.equal(flow?.state, "accumulation");
  assert.equal(
    flowAdjustment({ symbol: "SOL", state: "accumulation", distFrom30dHighPct: -0.12 }),
    4,
  );
  assert.equal(
    flowAdjustment({ symbol: "SOL", state: "accumulation", distFrom30dHighPct: -0.01 }),
    0,
  );
  assert.equal(
    flowAdjustment({ symbol: "SOL", state: "distribution", distFrom30dHighPct: -0.02 }),
    -6,
  );
});

test("sector layer boosts the leader and cuts a cold sector", () => {
  const hot = {
    symbol: "AAA",
    narrativeTags: ["AI"],
    pct7d: 12,
    volume24h: 80_000_000,
    rs7d: 0.04,
    distFrom30dHighPct: -0.1,
    score: 70,
    factors: [{ key: "narrative", note: "روایت" }],
  };
  const cold = {
    symbol: "BBB",
    narrativeTags: ["gaming"],
    pct7d: -9,
    volume24h: 40_000_000,
    rs7d: 0.01,
    distFrom30dHighPct: -0.1,
    score: 70,
    factors: [{ key: "narrative", note: "روایت" }],
  };
  const mate = { ...hot, symbol: "CCC", volume24h: 50_000_000 };
  const [a, b] = applySectorLayer([hot, cold, mate]);
  assert.equal(a?.sectorKey, "AI");
  assert.equal(a?.sectorBoost, 4);
  assert.equal(a?.score, 74);
  assert.equal(b?.sectorKey, "other");
  assert.equal(b?.sectorBoost, -3);
  assert.equal(b?.score, 67);
});

test("macro risk crosses 70 only when bitcoin structure is actually damaged", () => {
  const severe = scoreBtcMacroRisk({
    aboveEma200: false,
    weeklyStructure: "bear",
    severeWeekly: true,
    weeklySupportBroken: false,
    btcPct7d: 0,
    btcPct30d: 0,
    dominanceBias: "neutral",
  });
  assert.equal(severe.level, "severe");
  assert.ok(severe.score >= 70);
  assert.equal(severe.sizeMultiplier, 0.5);

  const calm = scoreBtcMacroRisk({
    aboveEma200: true,
    weeklyStructure: "bull",
    severeWeekly: false,
    weeklySupportBroken: false,
    btcPct7d: 0.05,
    btcPct30d: 0.08,
    dominanceBias: "falling",
  });
  assert.equal(calm.level, "calm");
  assert.ok(calm.score < 45);
  assert.equal(calm.sizeMultiplier, 1);
});

test("ATR stop sits below price and the target pays more than the risk", () => {
  const plan = buildAtrPlan({ price: 100, volatility30d: 0.04, sizeMultiplier: 0.5 });
  assert.ok(plan);
  assert.ok(plan!.stop < 100);
  assert.ok(plan!.target > 100);
  assert.ok(plan!.rewardRisk > 1);
  assert.equal(plan!.sizeMultiplier, 0.5);
  assert.ok(Math.abs(plan!.stopPct - 0.04 * 1.25 * 2.2) < 1e-9);
});
