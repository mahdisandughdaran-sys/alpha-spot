import assert from "node:assert/strict";
import { generateKeyPairSync, verify } from "node:crypto";
import test from "node:test";
import { planVenueOrder, redact, type VenueCall } from "./venues.ts";
import { pullBalances, signEd25519 } from "./venues.server.ts";

function call(partial: Partial<VenueCall>): VenueCall {
  return {
    action: "preview",
    venue: "binance",
    key: "",
    secret: "",
    symbol: "ETH",
    side: "BUY",
    notionalUsd: 100,
    priceUsd: 2500,
    quote: "USDT",
    tomanPerUsdt: 60_000,
    confirm: "",
    ...partial,
  };
}

test("binance market buy spends quote usdt", () => {
  const plan = planVenueOrder(call({}), 1_700_000_000_000);
  assert.equal(plan.path, "/api/v3/order");
  assert.match(plan.query ?? "", /symbol=ETHUSDT/);
  assert.match(plan.query ?? "", /quoteOrderQty=100/);
  assert.match(plan.query ?? "", /side=BUY/);
});

test("toman market is refused", () => {
  assert.throws(() => planVenueOrder(call({ quote: "IRT", tomanPerUsdt: 50_000 })), /تتر/);
});

test("binance buy spends quote usdt and bybit does the same", () => {
  const binance = planVenueOrder(call({ venue: "binance", notionalUsd: 25 }));
  assert.match(binance.query ?? "", /quoteOrderQty=25/);
  assert.match(binance.query ?? "", /symbol=ETHUSDT/);
  const bybit = planVenueOrder(call({ venue: "bybit", side: "SELL", notionalUsd: 25 }));
  assert.equal(bybit.body?.marketUnit, "baseCoin");
  assert.equal(bybit.body?.side, "Sell");
});

test("oversized notional is refused before any network call", () => {
  assert.throws(() => planVenueOrder(call({ notionalUsd: 80_000 })), /۵۰/);
});

test("redact strips the api key from exchange errors", () => {
  const hidden = redact("invalid key abcdefghij", ["abcdefghij"]);
  assert.equal(hidden.includes("abcdefghij"), false);
});

test("ed25519 signature verifies", () => {
  const { publicKey, privateKey } = generateKeyPairSync("ed25519");
  const seed = privateKey.export({ format: "der", type: "pkcs8" }).subarray(-32);
  const message = "1700000000POST/market/orders/add{}";
  const signature = Buffer.from(signEd25519(seed.toString("base64url"), message), "base64url");
  assert.equal(verify(null, Buffer.from(message), publicKey, signature), true);
});

test("balance parser keeps positive wallets only", () => {
  const rows = pullBalances({
    wallets: [
      { currency: "btc", balance: "0.01" },
      { currency: "eth", balance: "0" },
    ],
  });
  assert.deepEqual(rows, [{ asset: "BTC", amount: "0.01" }]);
});
