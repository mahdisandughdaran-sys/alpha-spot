import assert from "node:assert/strict";
import test from "node:test";
import { getSpotAsset, SPOT_ASSETS } from "./spot-assets.ts";
import { buildSpotPlan, type SpotCandle } from "./spot-plan.ts";

function fromCloses(closes: number[]): SpotCandle[] {
  const start = Date.UTC(2024, 0, 1);
  return closes.map((c, i) => ({
    t: start + i * 86_400_000,
    o: c * 0.997,
    h: c * 1.01,
    l: c * 0.99,
    c,
    v: 1_000_000 + i,
  }));
}

function path(start: number, steps: { n: number; daily: number }[]): number[] {
  const out: number[] = [];
  let price = start;
  for (const step of steps) {
    for (let i = 0; i < step.n; i++) {
      price *= step.daily;
      out.push(price);
    }
  }
  return out;
}

const btc = {
  symbol: "BTC",
  nameFa: "بیت‌کوین",
  nameEn: "Bitcoin",
  pair: "BTCUSDT",
};

test("spot catalog keeps bitcoin live and leaves room for the next coins", () => {
  assert.equal(getSpotAsset("btc")?.enabled, true);
  assert.equal(getSpotAsset("BTC")?.pair, "BTCUSDT");
  const later = SPOT_ASSETS.filter((asset) => !asset.enabled);
  assert.ok(later.length >= 4);
  assert.equal(getSpotAsset("nope"), null);
});

test("a bull pullback has an entry under price and both sell levels", () => {
  const plan = buildSpotPlan(fromCloses(path(28000, [{ n: 210, daily: 1.0034 }, { n: 12, daily: 0.992 }])), btc);
  assert.ok(plan.entry > 0);
  assert.ok(plan.buyFrom <= plan.entry && plan.entry <= plan.buyTo);
  assert.ok(plan.invalidation < plan.buyFrom);
  assert.ok(plan.takeProfit > plan.price);
  assert.notEqual(plan.action, "exit");
  assert.ok(plan.chart.length >= 100);
  assert.match(plan.buyFa, /بهترین نقطه/);
  assert.match(plan.sellUpFa, /بفروش/);
  assert.match(plan.sellDownFa, /بفروش/);
});

test("a deep daily breakdown is not a full-size spot buy", () => {
  const plan = buildSpotPlan(fromCloses(path(50000, [{ n: 190, daily: 1.0022 }, { n: 28, daily: 0.972 }])), btc);
  assert.equal(plan.regime, "bear");
  assert.notEqual(plan.size, "full");
  assert.ok(plan.takeProfit > plan.price);
  assert.ok(plan.invalidation < plan.buyFrom);
  assert.ok(plan.entry > 0);
});
