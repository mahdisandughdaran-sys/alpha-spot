import assert from "node:assert/strict";
import { test } from "node:test";
import type { BtBar, BtSeries } from "./backtest.ts";
import { OPPORTUNITY_WARMUP, simulateOpportunityBacktest } from "./opportunity-backtest.ts";

function bars(closes: number[], start = 1_700_000_000_000): BtBar[] {
  return closes.map((c, i) => ({
    t: start + i * 86_400_000,
    o: c,
    h: c * 1.01,
    l: c * 0.99,
    c,
    q: 30_000_000,
  }));
}

test("backtest never books a trade before the signal bar", () => {
  const early = Array.from({ length: 40 }, (_, i) => 100 + i * 10);
  const rest = Array.from({ length: 140 }, () => 100);
  const closes = [...early, ...rest];
  const series: BtSeries[] = [
    { symbol: "BTC", name: "Bitcoin", rank: 1, bars: bars(closes.map(() => 100)) },
    { symbol: "ALT", name: "Alt", rank: 8, bars: bars(closes) },
  ];
  const report = simulateOpportunityBacktest(series);
  for (const trade of report.samples) {
    assert.ok(trade.entryIndex >= OPPORTUNITY_WARMUP);
    assert.ok(trade.exitIndex > trade.entryIndex);
  }
  assert.equal(report.sampleEnough, false);
  assert.match(report.note, /کافی نیست|تضمین/);
  assert.ok(report.assumptions.some((line) => line.includes("کارمزد")));
});

test("missing bitcoin history is reported instead of a fake result", () => {
  const report = simulateOpportunityBacktest([
    { symbol: "ETH", name: "Ethereum", rank: 2, bars: bars(Array.from({ length: 30 }, () => 10)) },
  ]);
  assert.equal(report.trades, 0);
  assert.equal(report.sampleEnough, false);
  assert.match(report.note, /بیت‌کوین|کافی/);
});
