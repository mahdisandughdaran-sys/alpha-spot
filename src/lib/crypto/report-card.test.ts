import assert from "node:assert/strict";
import test from "node:test";
import { rememberSuggestion, settleReport, type StoredSuggestion } from "./report-card.ts";

function suggestion(partial: Partial<StoredSuggestion> = {}): StoredSuggestion {
  return {
    id: "one",
    at: new Date(Date.now() - 8 * 86_400_000).toISOString(),
    symbol: "LINK",
    name: "Chainlink",
    priceUsd: 100,
    btcPriceUsd: 100,
    kind: "buy",
    regime: "alt",
    factors: [
      { key: "rs", score: 20 },
      { key: "trend", score: 80 },
    ],
    applied7: false,
    applied30: false,
    ...partial,
  };
}

test("a window that lags bitcoin cuts the weakest factor once", () => {
  const settled = settleReport([suggestion()], () => 90, 100, {});
  assert.equal(settled.lagged, true);
  assert.equal(settled.weak, "rs");
  assert.ok(settled.cuts.rs != null && settled.cuts.rs < 1);
  assert.equal(settled.rows[0]?.applied7, true);
  const again = settleReport(settled.rows, () => 90, 100, settled.cuts);
  assert.equal(again.lagged, false);
  assert.equal(again.cuts.rs, settled.cuts.rs);
});

test("rememberSuggestion keeps the shown sentence and does not duplicate its id", () => {
  const row = suggestion({ id: "shown", at: new Date().toISOString(), applied7: false });
  const once = rememberSuggestion([], row);
  const twice = rememberSuggestion(once, row);
  assert.equal(twice.length, 1);
  assert.equal(twice[0]?.kind, "buy");
});
