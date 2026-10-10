import assert from "node:assert/strict";
import test from "node:test";
import { applyBookGate, assessBook } from "./microstructure.ts";
import type { CoinRow } from "./types.ts";

test("thin book blocks a buy when ten thousand dollars walks the ask", () => {
  const book = assessBook({
    symbol: "TINY",
    asks: [
      { price: 1, qty: 100 },
      { price: 1.2, qty: 100 },
    ],
    funding8h: 0,
  });
  assert.equal(book.gate, "thin");
  assert.ok((book.slippageBps ?? 0) > 35 || (book.filledPct ?? 1) < 0.9);
});

test("deep book passes and crowded funding reduces size", () => {
  const book = assessBook({
    symbol: "SOL",
    asks: [
      { price: 100, qty: 500 },
      { price: 100.01, qty: 500 },
    ],
    funding8h: 0.0004,
  });
  assert.equal(book.gate, "crowded");
  assert.ok((book.slippageBps ?? 99) < 35);
  const row = { score: 80, buySignal: "open", sizeMultiplier: 1 } as CoinRow;
  const next = applyBookGate(row, book);
  assert.equal(next.buySignal, "reduced");
  assert.ok(next.score < 80);
  assert.equal(next.sizeMultiplier, 0.5);
});

test("small-cap open interest heat halves size without touching a calm large cap", () => {
  const hot = assessBook({
    symbol: "TINY",
    asks: [
      { price: 2, qty: 100_000 },
      { price: 2.001, qty: 100_000 },
    ],
    funding8h: 0,
    openInterestUsd: 40_000_000,
    oiChange24h: 0.42,
    longShortRatio: 1.9,
    smallCap: true,
  });
  assert.equal(hot.gate, "levered");
  const row = { score: 70, buySignal: "open", sizeMultiplier: 1 } as CoinRow;
  const next = applyBookGate(row, hot);
  assert.equal(next.buySignal, "reduced");
  assert.equal(next.sizeMultiplier, 0.5);
  assert.equal(next.score, 62);

  const large = assessBook({
    symbol: "SOL",
    asks: [
      { price: 100, qty: 500 },
      { price: 100.01, qty: 500 },
    ],
    funding8h: 0,
    oiChange24h: 0.42,
    longShortRatio: 1.9,
    smallCap: false,
  });
  assert.equal(large.gate, "pass");
});
