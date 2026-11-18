import assert from "node:assert/strict";
import { test } from "node:test";
import { ema, rsi } from "./math.ts";
import {
  adxLast,
  bollingerAt,
  emaSeries,
  floorPivots,
  formatPx,
  normalizeSymbol,
  readChart,
  rsiSeries,
  smaSeries,
  type Candle,
} from "./ta.ts";

function bar(i: number, open: number, close: number, pad = 0.4): Candle {
  return {
    t: i * 86_400_000,
    closeTime: (i + 1) * 86_400_000,
    open,
    close,
    high: Math.max(open, close) + pad,
    low: Math.min(open, close) - pad,
    volume: close >= open ? 1_200 : 800,
  };
}

function wave(): Candle[] {
  const segments = [8, -4, 10, -4, 12, -3, 9];
  let price = 100;
  const out: Candle[] = [];
  let i = 0;
  for (const seg of segments) {
    const dir = Math.sign(seg);
    for (let step = 0; step < Math.abs(seg); step++) {
      const open = price;
      price += dir * 2;
      const close = price;
      out.push({
        t: i * 86_400_000,
        closeTime: (i + 1) * 86_400_000,
        open,
        close,
        high: Math.max(open, close) + (dir > 0 ? 0.8 : 0.15),
        low: Math.min(open, close) - (dir < 0 ? 0.8 : 0.15),
        volume: dir > 0 ? 1_400 : 700,
      });
      i += 1;
    }
  }
  return out;
}

function climb(n: number): Candle[] {
  const out: Candle[] = [];
  let price = 50;
  for (let i = 0; i < n; i++) {
    const open = price;
    price += 1;
    out.push(bar(i, open, price, 0.2));
  }
  return out;
}

test("floor pivots use the pit formula", () => {
  const pivots = floorPivots(bar(0, 100, 100, 10));
  assert.equal(pivots.pp, 100);
  assert.equal(pivots.r1, 110);
  assert.equal(pivots.s1, 90);
  assert.equal(pivots.r2, 120);
  assert.equal(pivots.s2, 80);
});

test("normalizeSymbol strips the USDT suffix and rejects stables", () => {
  assert.equal(normalizeSymbol(" btcusdt "), "BTC");
  assert.equal(normalizeSymbol("usdc"), null);
  assert.equal(normalizeSymbol("!!!"), null);
});

test("ema and rsi series match the desk math", () => {
  const closes = Array.from({ length: 80 }, (_, i) => 100 + i * 0.7);
  assert.ok(Math.abs((emaSeries(closes, 20).at(-1) ?? 0) - (ema(closes, 20) ?? 0)) < 1e-9);
  assert.equal(rsiSeries(closes, 14).at(-1), rsi(closes, 14));
  assert.ok((rsi(closes, 14) ?? 0) > 70);
});

test("bollinger on a flat series collapses to the price", () => {
  const closes = Array.from({ length: 30 }, () => 10);
  const band = bollingerAt(closes, 29);
  assert.ok(band);
  assert.equal(band.upper, 10);
  assert.equal(band.lower, 10);
  assert.equal(band.pctB, 0.5);
});

test("sma series is the mean of the last window", () => {
  const line = smaSeries([1, 2, 3, 4, 5], 3);
  assert.equal(line[2], 2);
  assert.equal(line[4], 4);
});

test("a climbing series has positive DI and a rising Dow structure is bullish on the chart", () => {
  const trend = adxLast(climb(80), 14);
  assert.ok(trend);
  assert.ok(trend.plus > trend.minus);
  assert.ok(trend.adx > 20);

  const read = readChart({ symbol: "BTC", interval: "1d", candles: wave(), now: 10 ** 15 });
  assert.ok(read);
  assert.equal(read.structure, "up");
  assert.equal(read.bias, "bull");
  assert.ok(read.steps[1]?.bodyFa.includes(formatPx(read.marks.find((mark) => mark.id === "support")?.price ?? NaN)));
  assert.match(read.steps[0]?.bodyFa ?? "", /میانگین/);
  assert.match(read.steps[3]?.bodyFa ?? "", /RSI/);
  assert.equal(read.steps.length, 5);
});
