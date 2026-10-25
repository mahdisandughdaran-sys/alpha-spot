import assert from "node:assert/strict";
import test from "node:test";
import {
  replayRotation,
  rotationTarget,
  type RotationBar,
  type RotationSeries,
} from "./rotation.ts";

const DAY = 86_400_000;
const START = Date.UTC(2024, 0, 1);

function walk(start: number, days: number, step: (i: number) => number, quote = 8_000_000): RotationBar[] {
  const bars: RotationBar[] = [];
  let price = start;
  for (let i = 0; i < days; i++) {
    price *= 1 + step(i);
    bars.push({ t: START + i * DAY, c: price, q: quote });
  }
  return bars;
}

function series(symbol: string, bars: RotationBar[]): RotationSeries {
  return { symbol, name: symbol, bars };
}

test("flat or falling bitcoin parks in tether", () => {
  const book = rotationTarget({
    btcReturn: -0.08,
    alts: [
      { symbol: "ETH", return30: 0.2 },
      { symbol: "SOL", return30: 0.3 },
    ],
    names: new Map([["BTC", "Bitcoin"]]),
  });
  assert.equal(book.sleeve, "cash");
});

test("bitcoin rising alone is the buy", () => {
  const book = rotationTarget({
    btcReturn: 0.12,
    alts: [
      { symbol: "ETH", return30: 0.13 },
      { symbol: "SOL", return30: 0.04 },
    ],
    names: new Map([["BTC", "Bitcoin"]]),
  });
  assert.equal(book.sleeve, "btc");
  assert.equal(book.symbol, "BTC");
});

test("two alts ahead of a rising bitcoin buy the leader", () => {
  const book = rotationTarget({
    btcReturn: 0.1,
    alts: [
      { symbol: "SOL", return30: 0.4 },
      { symbol: "ETH", return30: 0.22 },
    ],
    names: new Map([
      ["SOL", "Solana"],
      ["ETH", "Ethereum"],
    ]),
  });
  assert.equal(book.sleeve, "alt");
  assert.equal(book.symbol, "SOL");
});

test("one alt ahead is not a rotation", () => {
  const book = rotationTarget({
    btcReturn: 0.1,
    alts: [
      { symbol: "SOL", return30: 0.4 },
      { symbol: "ETH", return30: 0.11 },
    ],
    names: new Map(),
  });
  assert.equal(book.sleeve, "btc");
});

test("a falling tape keeps cash and beats holding bitcoin", () => {
  const days = 80;
  const replay = replayRotation([
    series("BTC", walk(100, days, () => -0.01)),
    series("ETH", walk(100, days, () => -0.02)),
    series("SOL", walk(100, days, () => -0.015)),
  ]);
  assert.ok(replay);
  assert.equal(replay.final.book.sleeve, "cash");
  assert.ok(replay.equity > replay.btcEquity);
  assert.ok(replay.sleeveDays.cash > replay.sleeveDays.btc);
});

test("alts that outrun a rising bitcoin beat the bitcoin hold", () => {
  const days = 90;
  const replay = replayRotation([
    series("BTC", walk(100, days, () => 0.002)),
    series("ETH", walk(100, days, () => 0.012)),
    series("SOL", walk(100, days, () => 0.008)),
  ]);
  assert.ok(replay);
  assert.equal(replay.final.book.sleeve, "alt");
  assert.equal(replay.final.book.symbol, "ETH");
  assert.ok(replay.equity > replay.btcEquity);
});
