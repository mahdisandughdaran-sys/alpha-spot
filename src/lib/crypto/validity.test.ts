import assert from "node:assert/strict";
import test from "node:test";
import type { HorizonCall } from "./types.ts";
import { reconcileCall, validUntilFrom } from "./validity.ts";

function call(partial: Partial<HorizonCall> & Pick<HorizonCall, "horizon" | "kind">): HorizonCall {
  return {
    symbol: partial.kind === "buy" ? "LINK" : null,
    name: partial.kind === "buy" ? "Chainlink" : null,
    priceUsd: partial.kind === "buy" ? 10 : null,
    invalidationUsd: partial.kind === "buy" ? 8 : null,
    reason: partial.kind === "buy" ? "buy" : "هیچ ارزی نخر",
    issuedAt: "2026-10-01T00:00:00.000Z",
    validUntil: validUntilFrom("2026-10-01T00:00:00.000Z", partial.horizon),
    held: false,
    dissent: null,
    ...partial,
  };
}

test("a week call does not flip to another coin before it expires", () => {
  const stored = call({ horizon: "week", kind: "buy", symbol: "LINK" });
  const fresh = call({ horizon: "week", kind: "buy", symbol: "SOL", name: "Solana" });
  const now = Date.parse("2026-10-03T00:00:00.000Z");
  const next = reconcileCall(stored, fresh, now, 12);
  assert.equal(next.symbol, "LINK");
  assert.equal(next.held, true);
  assert.ok(next.dissent);
});

test("a day call is replaced after 24 hours", () => {
  const stored = call({ horizon: "day", kind: "cash", symbol: null });
  const fresh = call({ horizon: "day", kind: "buy", symbol: "ETH", name: "Ethereum" });
  const now = Date.parse(stored.validUntil) + 1000;
  const next = reconcileCall(stored, fresh, now, null);
  assert.equal(next.symbol, "ETH");
  assert.equal(next.held, false);
});

test("a buy dies early when price crosses invalidation, and the core stays", () => {
  const stored = call({ horizon: "month", kind: "buy", invalidationUsd: 9 });
  const fresh = call({ horizon: "month", kind: "buy", symbol: "LINK" });
  const now = Date.parse("2026-10-10T00:00:00.000Z");
  const next = reconcileCall(stored, fresh, now, 8.5);
  assert.equal(next.kind, "stay");
  assert.equal(next.symbol, "BTC");
  assert.match(next.reason, /هسته بیت‌کوین/);
});

test("a stored cash call does not outlive a book that has left cash", () => {
  const stored = call({ horizon: "month", kind: "cash", symbol: null, invalidationUsd: null });
  const fresh = call({ horizon: "month", kind: "buy" });
  const now = Date.parse("2026-10-20T00:00:00.000Z");
  const next = reconcileCall(stored, fresh, now, 10);
  assert.equal(next.kind, "buy");
  assert.equal(next.held, false);
});
