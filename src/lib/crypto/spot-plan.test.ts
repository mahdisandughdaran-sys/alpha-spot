import assert from "node:assert/strict";
import test from "node:test";
import { getSpotAsset, pickTopSpot, SPOT_ASSETS, TOP_SPOT } from "./spot-assets.ts";
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

test("the bitcoin desk keeps fifty enabled spot assets and bitcoin first", () => {
  assert.equal(SPOT_ASSETS.length, TOP_SPOT);
  assert.equal(SPOT_ASSETS[0]?.id, "btc");
  assert.equal(getSpotAsset("btc")?.enabled, true);
  assert.equal(getSpotAsset("BTC")?.pair, "BTCUSDT");
  assert.equal(getSpotAsset("eth")?.enabled, true);
  assert.equal(
    SPOT_ASSETS.every((asset) => asset.enabled && asset.pair.endsWith("USDT")),
    true,
  );
  assert.equal(getSpotAsset("nope"), null);
});

test("top fifty skips stables and names that are not on binance", () => {
  const ranked = [
    { symbol: "BTC", name: "Bitcoin", rank: 1 },
    { symbol: "USDT", name: "Tether", rank: 2 },
    { symbol: "ETH", name: "Ethereum", rank: 3 },
    { symbol: "USDC", name: "USDC", rank: 4 },
    { symbol: "SOL", name: "Solana", rank: 5 },
    { symbol: "FIGR_HELOC", name: "Figure Heloc", rank: 6 },
    { symbol: "WBTC", name: "Wrapped Bitcoin", rank: 7 },
  ];
  const picked = pickTopSpot(ranked, new Set(["BTC", "ETH", "SOL", "BNB"]), 3);
  assert.deepEqual(
    picked.map((asset) => asset.symbol),
    ["BTC", "ETH", "SOL"],
  );
  assert.equal(picked[0]?.nameFa, "بیت‌کوین");
  assert.equal(picked[0]?.marketRank, 1);
  assert.equal(picked[2]?.marketRank, 5);
});

test("a short live list is filled from the fallback fifty", () => {
  const picked = pickTopSpot([{ symbol: "BTC", name: "Bitcoin", rank: 1 }], new Set(["BTC", "ETH", "SOL"]), 3);
  assert.deepEqual(
    picked.map((asset) => asset.symbol),
    ["BTC", "ETH", "SOL"],
  );
  assert.equal(picked[1]?.marketRank, null);
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
  assert.equal(plan.windows.length, 3);
  assert.deepEqual(
    plan.windows.map((window) => window.horizon),
    ["day", "week", "month"],
  );
  assert.ok(plan.windows[0] && plan.windows[0].validForMs < plan.windows[1]!.validForMs);
  assert.ok(plan.windows[1] && plan.windows[1].validForMs < plan.windows[2]!.validForMs);
});

test("a deep daily breakdown is not a full-size spot buy", () => {
  const plan = buildSpotPlan(fromCloses(path(50000, [{ n: 190, daily: 1.0022 }, { n: 28, daily: 0.972 }])), btc);
  assert.equal(plan.regime, "bear");
  assert.notEqual(plan.size, "full");
  assert.ok(plan.takeProfit > plan.price);
  assert.ok(plan.invalidation < plan.buyFrom);
  assert.ok(plan.entry > 0);
  assert.ok(plan.windows.every((window) => window.action === "cash"));
  assert.match(plan.orderFa, /هیچ ارزی نخر/);
});
