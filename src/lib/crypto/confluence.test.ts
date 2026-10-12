import assert from "node:assert/strict";
import { test } from "node:test";
import {
  buildLiquidationMap,
  classifyFlow,
  judgeConfluence,
  liquidationOfLong,
  readFlow,
  sizePosition,
  type FlowCandle,
  type FlowRead,
  type HeatCandle,
} from "./confluence.ts";

function flowBars(spec: { n: number; close: (i: number) => number; volume: (i: number) => number; buy: number | ((i: number) => number) }): FlowCandle[] {
  const out: FlowCandle[] = [];
  for (let i = 0; i < spec.n; i++) {
    const close = spec.close(i);
    const volume = spec.volume(i);
    const frac = typeof spec.buy === "function" ? spec.buy(i) : spec.buy;
    out.push({
      t: 1_700_000_000_000 + i * 3_600_000,
      open: close,
      high: close * 1.002,
      low: close * 0.998,
      close,
      volume,
      takerBuy: volume * frac,
    });
  }
  return out;
}

function flatFlow(label: FlowRead["label"]): FlowRead {
  return {
    label,
    buyRatio4h: label === "fake_pump" ? 0.4 : 0.58,
    buyRatio24h: 0.56,
    delta4h: 1,
    delta24h: 1,
    cvdNorm: 0.1,
    ret4h: label === "fake_pump" ? 0.08 : 0.01,
    ret24h: 0.02,
    volumeAccel: 1,
    buy24h: 1,
    sell24h: 1,
    points: [],
  };
}

test("position size uses capital × risk / stop", () => {
  const sized = sizePosition(1000, 0.02, 0.05);
  assert.equal(sized.maxLossUsd, 20);
  assert.equal(sized.positionUsd, 400);
});

test("zero stop does not invent a size", () => {
  const sized = sizePosition(1000, 0.02, 0);
  assert.equal(sized.positionUsd, 0);
  assert.equal(sized.maxLossUsd, 20);
});

test("rising price on fading taker buy is a fake pump", () => {
  const bars = flowBars({
    n: 48,
    close: (i) => (i < 44 ? 100 : 100 + (i - 43) * 2),
    volume: (i) => (i < 44 ? 1000 : 300),
    buy: (i) => (i < 44 ? 0.5 : 0.4),
  });
  const flow = readFlow(bars);
  assert.ok(flow);
  assert.equal(flow.label, "fake_pump");
  assert.equal(classifyFlow(flow), "fake_pump");
});

test("steady taker bid without a blow-off is institutional", () => {
  const bars = flowBars({
    n: 30,
    close: (i) => 100 + i * 0.08,
    volume: () => 1000,
    buy: 0.6,
  });
  const flow = readFlow(bars);
  assert.ok(flow);
  assert.equal(flow.label, "institutional");
});

test("dominant seller and falling delta is distribution", () => {
  const bars = flowBars({
    n: 30,
    close: () => 100,
    volume: () => 1000,
    buy: 0.4,
  });
  const flow = readFlow(bars);
  assert.ok(flow);
  assert.equal(flow.label, "distribution");
});

test("unswept 10x long pool under price is a limit sweep, not a market buy", () => {
  const entry = 108.3;
  const liq = liquidationOfLong(entry, 10);
  assert.ok(Math.abs(liq - 98.01) < 0.2);
  const bars: HeatCandle[] = [];
  for (let i = 0; i < 36; i++) {
    const huge = i === 8;
    bars.push({
      high: huge ? 109 : 100.4,
      low: huge ? 107.6 : 99.4,
      close: huge ? entry : 100,
      volume: huge ? 50_000 : 80,
    });
  }
  const map = buildLiquidationMap(bars, 100, { longShortRatio: null, funding8h: null });
  const wall = map.clusters.find((cluster) => cluster.side === "long");
  assert.ok(wall, "expected a resting long liquidation cluster");
  assert.ok(wall.distance < -0.007 && wall.distance > -0.034);
  const judged = judgeConfluence({
    price: 100,
    flow: flatFlow("institutional"),
    clusters: map.clusters,
    funding8h: null,
    longShortRatio: null,
    futuresBuyRatio4h: null,
  });
  assert.equal(judged.decision, "BUY");
  assert.equal(judged.entryStyle, "limit_sweep");
  assert.ok(judged.entryPrice != null && judged.entryPrice < 100);
  assert.ok(judged.stopPct >= 0.015 && judged.stopPct <= 0.08);
});

test("a sweep without real bid is a wait, not a market endorsement", () => {
  const judged = judgeConfluence({
    price: 100,
    flow: flatFlow("balanced"),
    clusters: [
      {
        side: "long",
        price: 98,
        low: 97.6,
        high: 98.4,
        heat: 1,
        distance: -0.02,
      },
    ],
    funding8h: null,
    longShortRatio: null,
    futuresBuyRatio4h: null,
  });
  assert.equal(judged.decision, "WAIT");
  assert.equal(judged.entryStyle, "limit_sweep");
  assert.ok(judged.entryPrice != null && judged.entryPrice < 98);
});

test("sitting on a long liquidation wall is avoid even if spot flow looks bid", () => {
  const price = 100;
  const target = price * 0.997;
  const entry = target / (1 - 1 / 50 + 0.005);
  const bars: HeatCandle[] = [];
  for (let i = 0; i < 30; i++) {
    const hot = i > 4 && i < 20;
    bars.push({
      high: hot ? entry * 1.004 : price * 1.002,
      low: hot ? entry * 0.996 : price * 0.9992,
      close: hot ? entry : price,
      volume: hot ? 20_000 : 50,
    });
  }
  const map = buildLiquidationMap(bars, price, { longShortRatio: 1.4, funding8h: 0.0001 });
  const judged = judgeConfluence({
    price,
    flow: flatFlow("institutional"),
    clusters: map.clusters,
    funding8h: 0.0001,
    longShortRatio: 1.4,
    futuresBuyRatio4h: null,
  });
  assert.equal(judged.insideWall, true);
  assert.equal(judged.decision, "AVOID");
  assert.equal(judged.entryPrice, null);
});

test("fake pump overrides a clean sweep", () => {
  const judged = judgeConfluence({
    price: 100,
    flow: flatFlow("fake_pump"),
    clusters: [
      {
        side: "long",
        price: 98,
        low: 97.6,
        high: 98.4,
        heat: 1,
        distance: -0.02,
      },
    ],
    funding8h: null,
    longShortRatio: null,
    futuresBuyRatio4h: null,
  });
  assert.equal(judged.decision, "AVOID");
});
