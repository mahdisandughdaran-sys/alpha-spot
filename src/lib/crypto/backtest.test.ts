import assert from "node:assert/strict";
import test from "node:test";
import { simulateSpotBacktest, type BtSeries } from "./backtest.ts";

function series(symbol: string, name: string, rank: number, drift: number, quote: number): BtSeries {
  const bars = [];
  let price = symbol === "BTC" ? 40_000 : 100;
  const start = Date.UTC(2023, 0, 1);
  for (let i = 0; i < 420; i++) {
    price *= 1 + drift + Math.sin(i / 9) * 0.004;
    bars.push({
      t: start + i * 86_400_000,
      c: price,
      q: quote,
    });
  }
  return { symbol, name, rank, bars };
}

test("walk-forward backtest returns a finite path against bitcoin", () => {
  const report = simulateSpotBacktest([
    series("BTC", "Bitcoin", 1, 0.001, 2_000_000_000),
    series("ETH", "Ethereum", 2, 0.0012, 800_000_000),
    series("SOL", "Solana", 5, 0.0004, 400_000_000),
  ]);
  assert.ok(report.weeks > 10);
  assert.equal(Number.isFinite(report.totalReturn), true);
  assert.equal(Number.isFinite(report.btcReturn), true);
  assert.ok(report.winRate >= 0 && report.winRate <= 1);
  assert.ok(report.curve.length > 5);
  assert.ok(report.maxDrawdown <= 0);
});
