import assert from "node:assert/strict";
import { test } from "node:test";
import {
  alertsFromQuotes,
  alertsFromScan,
  snapshotOf,
} from "./opportunity-alerts.ts";
import {
  confirmationMet,
  evaluateAsset,
  opportunityWeightSum,
  scanOpportunities,
  type SpotBar,
} from "./opportunity.ts";

function bar(i: number, c: number, low = c - 0.35, high = c + 0.35, q = 25_000_000): SpotBar {
  return {
    t: 1_700_000_000_000 + i * 86_400_000,
    o: c,
    h: Math.max(high, c),
    l: Math.min(low, c),
    c,
    v: q / c,
    q,
  };
}

function flat(n: number, c: number): SpotBar[] {
  return Array.from({ length: n }, (_, i) => bar(i, c));
}

const ctx = {
  generatedAt: "2026-10-11T12:00:00.000Z",
  regime: "neutral" as const,
  spotBuys: "open" as const,
};

test("opportunity weights are fixed priors and sum to 1", () => {
  assert.ok(Math.abs(opportunityWeightSum() - 1) < 1e-12);
});

test("touching a zone is not confirmation", () => {
  assert.equal(
    confirmationMet({
      overlapped: true,
      held: true,
      rsiTurn: false,
      macdTurn: false,
      climaticSell: false,
    }),
    false,
  );
  assert.equal(
    confirmationMet({
      overlapped: true,
      held: true,
      rsiTurn: true,
      macdTurn: false,
      climaticSell: true,
    }),
    false,
  );
  assert.equal(
    confirmationMet({
      overlapped: true,
      held: true,
      rsiTurn: false,
      macdTurn: true,
      climaticSell: false,
    }),
    true,
  );
});

test("a straight decline is unconfirmed, not a buy because it is cheaper", () => {
  const bars = Array.from({ length: 100 }, (_, i) => bar(i, 200 - i, 200 - i - 0.2, 200 - i + 0.1));
  const row = evaluateAsset(
    {
      symbol: "FALL",
      name: "Falling",
      rank: 40,
      priceUsd: bars[bars.length - 1]!.c,
      volume24h: 30_000_000,
      turnover: 0.04,
      bars,
      btcCloses: bars.map(() => 100),
    },
    ctx,
  );
  assert.equal(row.status, "unconfirmed");
  assert.equal(row.zone, null);
  assert.equal(row.confidence, "unrated");
  assert.match(row.summary, /به‌تنهایی|فرصت/);
});

test("a repeated support below price is a watch, not an immediate buy", () => {
  const bars = flat(130, 100);
  const paint = (at: number, low: number) => {
    bars[at - 1] = bar(at - 1, low + 4, low + 3, low + 5);
    bars[at] = bar(at, low + 2, low, low + 3);
    bars[at + 1] = bar(at + 1, low + 5, low + 3, low + 6);
  };
  paint(60, 84);
  paint(95, 84.4);
  bars[129] = bar(129, 96, 95.4, 96.6);
  const row = evaluateAsset(
    {
      symbol: "ADA",
      name: "Cardano",
      rank: 12,
      priceUsd: 96,
      volume24h: 40_000_000,
      turnover: 0.05,
      bars,
      btcCloses: bars.map(() => 100),
    },
    ctx,
  );
  assert.ok(row.zone, "zone should exist");
  assert.ok(row.zone!.high < 96);
  assert.ok(row.zone!.invalidation < row.zone!.low);
  assert.notEqual(row.status, "actionable");
  assert.notEqual(row.status, "confirmed");
  assert.ok(row.status === "watching" || row.status === "approaching" || row.status === "passed");
  assert.ok(row.score > 0);
});

test("falling through the zone invalidates it", () => {
  const bars = flat(110, 100);
  bars[70] = bar(70, 86, 84, 88);
  bars[71] = bar(71, 90, 87, 92);
  bars[90] = bar(90, 86.2, 84.2, 88);
  bars[108] = bar(108, 80, 79, 82);
  bars[109] = bar(109, 78, 77, 80);
  const row = evaluateAsset(
    {
      symbol: "ADA",
      name: "Cardano",
      rank: 12,
      priceUsd: 78,
      volume24h: 40_000_000,
      turnover: 0.05,
      bars,
      btcCloses: bars.map(() => 100),
    },
    ctx,
  );
  if (row.zone) {
    assert.equal(row.status, "invalidated");
    assert.ok(row.scenarios.some((scene) => scene.key === "invalidate" && scene.state === "failed"));
  } else {
    assert.equal(row.status, "unconfirmed");
  }
});

test("a rally that never returns is not chased", () => {
  const bars = flat(140, 100);
  bars[70] = bar(70, 86, 84, 88);
  bars[90] = bar(90, 86.3, 84.3, 88);
  for (let i = 120; i < 140; i++) bars[i] = bar(i, 120 + (i - 120) * 0.4, 119, 122);
  const row = evaluateAsset(
    {
      symbol: "RUN",
      name: "Runner",
      rank: 15,
      priceUsd: bars[139]!.c,
      volume24h: 40_000_000,
      turnover: 0.04,
      bars,
      btcCloses: bars.map(() => 100),
    },
    ctx,
  );
  assert.notEqual(row.status, "actionable");
  assert.notEqual(row.status, "confirmed");
  if (row.status === "passed") {
    assert.ok(row.summary.includes("تعقیب"));
  }
});

test("structured support ranks above a pure decline", () => {
  const knife = Array.from({ length: 120 }, (_, i) => bar(i, 180 - i * 0.8, 180 - i * 0.8 - 0.2, 180 - i * 0.8 + 0.1));
  const bars = flat(130, 100);
  bars[62] = bar(62, 86, 84, 88);
  bars[96] = bar(96, 86.2, 84.4, 88);
  bars[129] = bar(129, 93, 92.4, 93.6);
  const board = scanOpportunities(
    [
      {
        symbol: "KNIFE",
        name: "Knife",
        rank: 30,
        priceUsd: knife[knife.length - 1]!.c,
        volume24h: 30_000_000,
        turnover: 0.04,
        bars: knife,
        btcCloses: knife.map(() => 100),
      },
      {
        symbol: "HOLD",
        name: "Hold",
        rank: 14,
        priceUsd: 93,
        volume24h: 30_000_000,
        turnover: 0.04,
        bars,
        btcCloses: bars.map(() => 100),
      },
    ],
    ctx,
  );
  const hold = board.items.find((row) => row.symbol === "HOLD");
  const fall = board.items.find((row) => row.symbol === "KNIFE");
  assert.ok(hold && fall);
  assert.ok(hold.score > fall.score);
});

test("alerts do not repeat for an unchanged scan", () => {
  const bars = flat(100, 50);
  const board = scanOpportunities(
    [
      {
        symbol: "BTC",
        name: "Bitcoin",
        rank: 1,
        priceUsd: 50,
        volume24h: 2_000_000_000,
        turnover: 0.02,
        bars,
        btcCloses: bars.map((item) => item.c),
      },
    ],
    ctx,
  );
  const at = "2026-10-11T12:00:00.000Z";
  const first = alertsFromScan([], board.items, at);
  const second = alertsFromScan(snapshotOf(board.items), board.items, at);
  assert.equal(second.length, 0);
  const ids = new Set(first.map((row) => row.id));
  assert.equal(ids.size, first.length);
});

test("a live price inside the zone is not a confirmed buy", () => {
  const alerts = alertsFromQuotes(
    [
      {
        symbol: "ADA",
        name: "Cardano",
        status: "watching",
        score: 60,
        zoneLow: 0.4,
        zoneHigh: 0.44,
        invalidation: 0.37,
        priceUsd: 0.5,
        volumeZNote: false,
      },
    ],
    [{ symbol: "ADA", price: 0.42 }],
    "2026-10-11T15:00:00.000Z",
  );
  assert.equal(alerts.length, 1);
  assert.equal(alerts[0]?.kind, "entered");
  assert.match(alerts[0]?.text ?? "", /تأیید/);
  const again = alertsFromQuotes(
    [
      {
        symbol: "ADA",
        name: "Cardano",
        status: "watching",
        score: 60,
        zoneLow: 0.4,
        zoneHigh: 0.44,
        invalidation: 0.37,
        priceUsd: 0.5,
        volumeZNote: false,
      },
    ],
    [{ symbol: "ADA", price: 0.42 }],
    "2026-10-11T18:00:00.000Z",
  );
  assert.equal(again[0]?.id, alerts[0]?.id);
});
