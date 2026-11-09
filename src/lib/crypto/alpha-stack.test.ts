import assert from "node:assert/strict";
import test from "node:test";
import { buildAlphaStack, closeTrendBias, type StackCandle } from "./alpha-stack.ts";

function candles(closes: number[], wave = 0.006): StackCandle[] {
  return closes.map((c, i) => {
    const prev = closes[i - 1] ?? c;
    const up = c >= prev;
    const high = Math.max(c, prev) * (1 + wave);
    const low = Math.min(c, prev) * (1 - wave);
    return {
      o: prev,
      h: high,
      l: low,
      c,
      v: 800_000 + (i % 7) * 40_000 + (up ? 350_000 : 40_000),
    };
  });
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

test("an established advance is not treated as a markdown", () => {
  const stack = buildAlphaStack(candles(path(100, [{ n: 180, daily: 1.004 }, { n: 8, daily: 0.994 }])));
  assert.ok(stack.readings.length >= 12);
  assert.equal(stack.veto, null);
  assert.notEqual(stack.phase, "markdown");
  assert.notEqual(stack.bias, "avoid");
  assert.ok(stack.score >= 52);
  assert.ok(stack.headlineFa.length > 20);
  assert.ok(stack.headlineEn.length > 20);
  assert.equal(stack.headlineEn.includes("پشته"), false);
});

test("a deep breakdown is rejected for a fresh spot buy", () => {
  const stack = buildAlphaStack(candles(path(200, [{ n: 80, daily: 1.001 }, { n: 40, daily: 0.975 }])));
  assert.equal(stack.bias, "avoid");
  assert.ok(stack.score <= 42);
  assert.equal(stack.sizeCap, "none");
  const supertrend = stack.readings.find((item) => item.key === "supertrend");
  assert.equal(supertrend?.vote, -1);
});

test("a vertical melt-up is marked as a chase, not an entry", () => {
  const stack = buildAlphaStack(
    candles(path(50, [{ n: 140, daily: 1.002 }, { n: 18, daily: 1.035 }]), 0.004),
  );
  assert.equal(stack.veto, "chase");
  assert.equal(stack.bias, "avoid");
  assert.notEqual(stack.sizeCap, "full");
});

test("a flat tape does not invent a full-size buy", () => {
  const closes: number[] = [];
  let price = 100;
  for (let i = 0; i < 160; i++) {
    price *= i % 2 === 0 ? 1.002 : 0.998;
    closes.push(price);
  }
  const stack = buildAlphaStack(candles(closes, 0.004));
  assert.notEqual(stack.sizeCap, "full");
  assert.ok(stack.score > 25 && stack.score < 80);
});

test("short history stays neutral", () => {
  const stack = buildAlphaStack(candles(path(10, [{ n: 12, daily: 1.01 }])));
  assert.equal(stack.bias, "wait");
  assert.equal(stack.score, 50);
  assert.equal(stack.readings.length, 0);
});

test("close-only tilt stays inside a small band", () => {
  const up = path(100, [{ n: 220, daily: 1.003 }]);
  const tilt = closeTrendBias(up, up.map(() => 1_000_000));
  assert.ok(tilt.delta <= 8 && tilt.delta >= -8);
  assert.ok(tilt.delta > 0);
  assert.match(tilt.en, /Close stack/);
});
