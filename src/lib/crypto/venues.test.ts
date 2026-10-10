import assert from "node:assert/strict";
import { generateKeyPairSync, verify } from "node:crypto";
import test from "node:test";
import { planVenueOrder, redact, type VenueCall } from "./venues.ts";
import { pullBalances, signEd25519 } from "./venues.server.ts";

function call(partial: Partial<VenueCall>): VenueCall {
  return {
    action: "preview",
    venue: "nobitex",
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

test("nobitex market buy keeps amount in base and price in tether", () => {
  const plan = planVenueOrder(call({}), 1_700_000_000_000);
  assert.equal(plan.path, "/market/orders/add");
  assert.equal(plan.body?.srcCurrency, "eth");
  assert.equal(plan.body?.dstCurrency, "usdt");
  assert.equal(plan.body?.execution, "market");
  assert.equal(plan.body?.amount, "0.04");
  assert.equal(plan.body?.price, "2530");
});

test("nobitex rial price is toman times ten", () => {
  const plan = planVenueOrder(call({ quote: "IRT", tomanPerUsdt: 50_000 }));
  const price = Number(plan.body?.price);
  assert.equal(plan.body?.dstCurrency, "rls");
  assert.ok(price > 2500 * 50_000 * 10 * 0.98);
  assert.ok(price < 2500 * 50_000 * 10 * 1.03);
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

test("ed25519 nobitex signature verifies", () => {
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
