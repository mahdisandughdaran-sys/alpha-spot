import assert from "node:assert/strict";
import test from "node:test";
import { findBestBuyPoint } from "./buy-point.ts";

test("marks a healthy pullback instead of a crash low", () => {
  const series = [100, 108, 112, 104, 101, 96, 99, 106, 70, 68, 90].map((v, t) => ({ t, v }));
  const buy = findBestBuyPoint(series);
  assert.ok(buy);
  assert.equal(buy.flat, false);
  assert.equal(buy.index, 5);
  assert.ok(buy.pullbackPct >= 8 && buy.pullbackPct <= 20);
  assert.equal(buy.recovered, true);
});

test("flat series has no distinct entry", () => {
  const series = [100, 100.1, 99.9, 100, 100.05].map((v, t) => ({ t, v }));
  const buy = findBestBuyPoint(series);
  assert.equal(buy?.flat, true);
});
