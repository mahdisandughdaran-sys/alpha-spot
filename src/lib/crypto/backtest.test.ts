import assert from "node:assert/strict";
import test from "node:test";
import { simulateSpotBacktest, stepSatelliteCampaigns, type BtSeries, type HeldSatellite } from "./backtest.ts";
import type { BtcKillSwitch } from "./types.ts";

const core = {
  status: "NORMAL",
  aboveEma200: true,
  weeklySupportBroken: false,
  severeWeekly: false,
  weeklyStructure: "bull",
} as BtcKillSwitch;

const link: HeldSatellite = {
  symbol: "LINK",
  weight: 0.12,
  invalidationUsd: 8,
  entryUsd: 10,
};

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
  assert.ok(report.months.length >= 4);
  assert.equal(Number.isFinite(report.avgMonthly), true);
  assert.equal(Number.isFinite(report.compoundMonthly), true);
  assert.ok(report.bestMonth >= report.avgMonthly);
  assert.ok(report.avgMonthly >= report.worstMonth);
  assert.ok(report.positiveMonths >= 0 && report.positiveMonths <= report.monthCount);
  assert.ok(report.monthsAhead >= 0 && report.monthsAhead <= report.monthCount);
  const compounded = report.months.reduce((product, row) => product * (1 + row.model), 1);
  assert.ok(Math.abs(compounded - (1 + report.totalReturn)) < 1e-8);
  assert.match(report.note, /گرم‌شدن ۲۲۰ روز/);
  assert.match(report.note, /اجازهٔ خرید آلت/);
  assert.equal(report.assumptions.some((line) => line.includes("خاموش شدن دروازهٔ دامیننس خروج نیست")), true);
});

test("a satellite stays open after the weekly gate shuts", () => {
  const held = stepSatelliteCampaigns({
    held: [link],
    kill: core,
    rows: [{ symbol: "LINK", priceUsd: 11, pairSupportBroken: false }],
    entries: [],
  });
  assert.equal(held.length, 1);
  assert.equal(held[0]?.symbol, "LINK");
  assert.equal(held[0]?.weight, 0.12);
  assert.equal(held[0]?.invalidationUsd, 8);
});

test("invalidation, structure, and the kill switch close the campaign", () => {
  const invalidated = stepSatelliteCampaigns({
    held: [link],
    kill: core,
    rows: [{ symbol: "LINK", priceUsd: 8, pairSupportBroken: false }],
    entries: [{ symbol: "SOL", weight: 0.1, invalidationUsd: 4, entryUsd: 5 }],
  });
  assert.equal(invalidated.length, 0);

  const broken = stepSatelliteCampaigns({
    held: [link],
    kill: core,
    rows: [{ symbol: "LINK", priceUsd: 12, pairSupportBroken: true }],
    entries: [{ symbol: "SOL", weight: 0.1, invalidationUsd: 4, entryUsd: 5 }],
  });
  assert.equal(broken.length, 0);

  const killed = stepSatelliteCampaigns({
    held: [link],
    kill: { ...core, status: "SUSPENDED", aboveEma200: false, severeWeekly: true },
    rows: [{ symbol: "LINK", priceUsd: 12, pairSupportBroken: false }],
    entries: [link],
  });
  assert.equal(killed.length, 0);
});

test("an open campaign does not resize and a new name needs a free week", () => {
  const resized = stepSatelliteCampaigns({
    held: [link],
    kill: core,
    rows: [{ symbol: "LINK", priceUsd: 11, pairSupportBroken: false }],
    entries: [{ symbol: "LINK", weight: 0.3, invalidationUsd: 9, entryUsd: 11 }],
  });
  assert.equal(resized.length, 1);
  assert.equal(resized[0]?.weight, 0.12);
  assert.equal(resized[0]?.invalidationUsd, 8);

  const added = stepSatelliteCampaigns({
    held: [link],
    kill: core,
    rows: [{ symbol: "LINK", priceUsd: 11, pairSupportBroken: false }],
    entries: [{ symbol: "SOL", weight: 0.1, invalidationUsd: 4, entryUsd: 5 }],
  });
  assert.deepEqual(
    added.map((row) => row.symbol),
    ["LINK", "SOL"],
  );

  const defend = stepSatelliteCampaigns({
    held: [link],
    kill: { ...core, status: "HIGH_RISK", aboveEma200: false },
    rows: [{ symbol: "LINK", priceUsd: 11, pairSupportBroken: false }],
    entries: [{ symbol: "SOL", weight: 0.1, invalidationUsd: 4, entryUsd: 5 }],
  });
  assert.deepEqual(
    defend.map((row) => row.symbol),
    ["LINK"],
  );
});
