import assert from "node:assert/strict";
import test from "node:test";
import {
  altSeasonIndex,
  bookHeat,
  cvdPath,
  exchangeNetflow,
  flowBiasOf,
  mvrvZone,
  nuplFromMvrv,
  nuplZone,
  onchainScore,
  rsiSeries,
  scoreCoin,
  soprProxy,
  volumePoc,
  type Candle,
  type MarketContext,
} from "./intel-math.ts";

function candle(c: number, extra?: Partial<Candle>): Candle {
  return { t: 0, o: c, h: c * 1.01, l: c * 0.99, c, v: 10, tb: 5, ...extra };
}

test("NUPL is the MVRV identity", () => {
  const nupl = nuplFromMvrv(1.56);
  assert.ok(nupl != null);
  assert.ok(Math.abs(nupl - (1 - 1 / 1.56)) < 1e-12);
  assert.equal(mvrvZone(1.56), "optimism");
  assert.equal(nuplZone(nupl), "optimism");
  assert.equal(mvrvZone(0.7), "capitulation");
  assert.equal(mvrvZone(3.5), "euphoria");
});

test("exchange outflow is the spot-friendly bias", () => {
  assert.ok(exchangeNetflow(100, 140) < 0);
  assert.equal(flowBiasOf(100, 140), "outflow");
  assert.equal(flowBiasOf(140, 100), "inflow");
  const friendly = onchainScore(1.2, nuplFromMvrv(1.2), 100, 160);
  const hostile = onchainScore(3.6, nuplFromMvrv(3.6), 160, 100);
  assert.ok(friendly > hostile);
  assert.ok(friendly > 70);
  assert.ok(hostile < 25);
});

test("RSI saturates on a one-way rise and CVD follows taker buy", () => {
  const closes = Array.from({ length: 30 }, (_, i) => 100 + i);
  const rsi = rsiSeries(closes, 14);
  assert.equal(rsi[14] != null, true);
  assert.ok((rsi[29] ?? 0) > 90);
  const path = cvdPath(
    [
      candle(1, { v: 10, tb: 8 }),
      candle(1, { v: 10, tb: 2 }),
    ],
    2,
  );
  assert.equal(path[0], 6);
  assert.equal(path[1], 0);
});

test("volume POC sits on the price that traded the most", () => {
  const quiet = Array.from({ length: 20 }, (_, i) => candle(100, { t: i, v: 1, h: 101, l: 99 }));
  const heavy = Array.from({ length: 20 }, (_, i) => candle(80, { t: 20 + i, v: 50, h: 81, l: 79 }));
  const poc = volumePoc([...quiet, ...heavy], 20, 40);
  assert.ok(poc != null);
  assert.ok(Math.abs((poc ?? 0) - 80) < 8);
});

test("SOPR proxy is price over the 7-day VWAP", () => {
  const flat = Array.from({ length: 7 }, () => candle(100, { v: 2 }));
  assert.equal(soprProxy(flat), 1);
  const lifted = [...flat.slice(0, 6), candle(110, { v: 2 })];
  const proxy = soprProxy(lifted);
  assert.ok(proxy != null && proxy > 1);
});

test("book heat piles size on the right side of mid", () => {
  const heat = bookHeat(
    [
      [100, 2],
      [99, 1],
    ],
    [
      [101, 4],
      [102, 1],
    ],
    10,
    0.05,
  );
  assert.ok(heat);
  const bid = heat?.bins.reduce((s, b) => s + b.bidUsd, 0) ?? 0;
  const ask = heat?.bins.reduce((s, b) => s + b.askUsd, 0) ?? 0;
  assert.ok(Math.abs(bid - 299) < 1);
  assert.ok(Math.abs(ask - 506) < 1);
});

test("a washed-out bid with buy delta outranks a vertical chase", () => {
  const market: MarketContext = {
    onchainScore: 74,
    mvrv: 1.4,
    nupl: nuplFromMvrv(1.4),
    flowBias: "outflow",
    altSeason: 40,
    fearGreed: 46,
  };
  const base = Array.from({ length: 50 }, (_, i) => candle(100, { t: i * 86_400_000, v: 20, tb: 9 }));
  const dip = candle(88, { t: 50 * 86_400_000, v: 30, tb: 20, h: 90, l: 86 });
  const calm = [...base, ...Array.from({ length: 20 }, (_, i) => candle(89 + i * 0.05, { t: (51 + i) * 86_400_000, v: 20, tb: 12, h: 91, l: 87 }))];
  const rip = Array.from({ length: 70 }, (_, i) =>
    candle(50 + i, { t: i * 86_400_000, v: 20, tb: 8, h: 51 + i, l: 49 + i }),
  );
  const good = scoreCoin({
    symbol: "SOL",
    candles: calm.length ? [...base.slice(0, 40), dip, ...calm.slice(-20)] : calm,
    mcFdv: 0.82,
    tvlUsd: 2_000_000_000,
    githubCommits14d: 22,
    whaleNetUsd: 2_000_000,
    whaleGrossUsd: 3_000_000,
    btcRet30: 0.02,
    market,
  });
  const chase = scoreCoin({
    symbol: "SOL",
    candles: rip,
    mcFdv: 0.2,
    tvlUsd: null,
    githubCommits14d: 0,
    whaleNetUsd: -2_000_000,
    whaleGrossUsd: 3_000_000,
    btcRet30: 0.02,
    market,
  });
  assert.ok(good && chase);
  assert.ok(good.score > chase.score);
  assert.equal(good.action === "avoid", false);
  assert.equal(chase.cvdBias === "buy", false);
});

test("alt season counts names that beat bitcoin", () => {
  const index = altSeasonIndex(
    [
      { symbol: "BTC", ret30: 0.1 },
      { symbol: "ETH", ret30: 0.2 },
      { symbol: "SOL", ret30: -0.1 },
      { symbol: "XRP", ret30: 0.4 },
    ],
    0.1,
  );
  assert.equal(index, 67);
});
