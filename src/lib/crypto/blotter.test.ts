import assert from "node:assert/strict";
import { test } from "node:test";
import { closeFill, openPnl, positionFromFills, rMultiple, summarizeBook, upsertFill } from "./blotter.ts";

test("filled rungs become one average and a dollar risk to invalidation", () => {
  const row = positionFromFills({
    symbol: "SOL",
    name: "Solana",
    at: "2026-10-22T12:00:00.000Z",
    invalidation: 130,
    target: 180,
    rungs: [
      { price: 140, qty: 1, notionalUsd: 140 },
      { price: 150, qty: 1, notionalUsd: 150 },
    ],
  });
  assert.ok(row);
  assert.equal(row.qty, 2);
  assert.equal(row.avgEntry, 145);
  assert.equal(row.notionalUsd, 290);
  assert.ok(Math.abs(row.riskUsd - 30) < 1e-9);
  assert.equal(openPnl(row, 160), 30);
  assert.ok(Math.abs((rMultiple(openPnl(row, 160), row.riskUsd) ?? 0) - 1) < 1e-9);
});

test("an empty ladder is not a position", () => {
  assert.equal(
    positionFromFills({ symbol: "SOL", name: "Solana", at: "t", invalidation: 1, target: 2, rungs: [] }),
    null,
  );
});

test("closing books realized pnl and leaves other tickets open", () => {
  const open = positionFromFills({
    symbol: "ETH",
    name: "Ethereum",
    at: "a",
    invalidation: 3000,
    target: 4000,
    rungs: [{ price: 3200, qty: 1, notionalUsd: 3200 }],
  });
  assert.ok(open);
  const book = closeFill(upsertFill([], open), open.id, 3500, "b");
  const summary = summarizeBook(book, () => null);
  assert.equal(summary.open, 0);
  assert.equal(summary.realized, 300);
});
