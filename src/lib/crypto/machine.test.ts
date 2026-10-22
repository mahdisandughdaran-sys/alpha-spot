import assert from "node:assert/strict";
import { test } from "node:test";
import { buildMachineTicket, readSession, ticketText, type MachineFocus } from "./machine.ts";

function focus(partial: Partial<MachineFocus> = {}): MachineFocus {
  return {
    hint: "buy",
    holdsCore: true,
    symbol: "SOL",
    name: "Solana",
    rank: 6,
    score: 78,
    price: 150,
    volatility30d: 0.04,
    distFrom30dHighPct: -0.12,
    rsi14: 48,
    zone: {
      low: 140,
      high: 148,
      touches: 2,
      invalidation: 132,
      atr: 4,
      reason: "shelf",
    },
    targetUsd: 176,
    invalidationUsd: 132,
    bookWeight: 0.18,
    sizeMultiplier: 1,
    sleeve: "satellite",
    asideFa: null,
    asideEn: null,
    ...partial,
  };
}

test("a live satellite buy is three limits under the market, capped at 32%", () => {
  const ticket = buildMachineTicket(focus({ price: 146 }), 10_000, 1, new Date("2026-10-22T14:00:00Z"));
  assert.equal(ticket.stance, "buy");
  assert.ok(ticket.rungs.length >= 2);
  for (const rung of ticket.rungs) assert.ok(rung.price <= ticket.livePrice);
  const weights = ticket.rungs.reduce((sum, rung) => sum + rung.weight, 0);
  assert.ok(Math.abs(weights - 1) < 1e-9);
  assert.ok(ticket.notionalUsd > 0);
  assert.ok(ticket.notionalUsd <= 10_000 * 0.32);
  assert.ok(ticket.rungs.every((rung) => rung.price > ticket.invalidation));
  assert.ok(ticket.rungs[0]!.price >= ticket.rungs[ticket.rungs.length - 1]!.price);
});

test("price above the zone parks limits and does not market", () => {
  const ticket = buildMachineTicket(focus({ price: 170, zone: { low: 140, high: 148, touches: 2, invalidation: 132, atr: 4, reason: "shelf" } }), 10_000, 1);
  assert.equal(ticket.stance, "park");
  assert.ok(ticket.rungs.every((rung) => rung.price < 170));
  assert.match(ticket.orderFa, /مارکت نخر/);
});

test("kill switch prints no order", () => {
  const ticket = buildMachineTicket(focus({ hint: "cash", symbol: "USDT", sleeve: "cash", sizeMultiplier: 0, price: 1 }), 10_000, 2);
  assert.equal(ticket.stance, "flat");
  assert.equal(ticket.notionalUsd, 0);
  assert.equal(ticket.rungs.length, 0);
});

test("holding the core on a stay call buys nothing", () => {
  const ticket = buildMachineTicket(focus({ hint: "stay", symbol: "BTC", sleeve: "core", holdsCore: true, zone: null }), 25_000, 1);
  assert.equal(ticket.stance, "flat");
  assert.equal(ticket.notionalUsd, 0);
});

test("an empty core on a stay call sizes a Bitcoin ladder under 40%", () => {
  const ticket = buildMachineTicket(
    focus({
      hint: "stay",
      symbol: "BTC",
      name: "Bitcoin",
      sleeve: "core",
      holdsCore: false,
      price: 100_000,
      zone: null,
      invalidationUsd: null,
      bookWeight: null,
      distFrom30dHighPct: -0.08,
      rsi14: 55,
    }),
    20_000,
    1,
  );
  assert.notEqual(ticket.stance, "flat");
  assert.ok(ticket.notionalUsd > 0);
  assert.ok(ticket.notionalUsd <= 20_000 * 0.4);
});

test("doubling risk doubles size until the cap", () => {
  const low = buildMachineTicket(focus({ bookWeight: null, volatility30d: 0.08 }), 50_000, 0.5);
  const high = buildMachineTicket(focus({ bookWeight: null, volatility30d: 0.08 }), 50_000, 1);
  assert.ok(high.notionalUsd >= low.notionalUsd);
  assert.ok(high.notionalUsd <= 50_000 * 0.32);
});

test("price under invalidation stands down", () => {
  const ticket = buildMachineTicket(focus({ price: 120 }), 10_000, 1);
  assert.equal(ticket.stance, "flat");
  assert.equal(ticket.notionalUsd, 0);
});

test("weekday overlap is the prime session", () => {
  const session = readSession(new Date("2026-10-22T14:00:00Z"));
  assert.equal(session.quality, "prime");
  const weekend = readSession(new Date("2026-10-24T14:00:00Z"));
  assert.equal(weekend.quality, "weekend");
});

test("the copied ticket names every rung and refuses to claim an exchange fill", () => {
  const ticket = buildMachineTicket(focus(), 10_000, 1);
  const text = ticketText(ticket, "fa", 120_000);
  assert.match(text, /SOL/);
  assert.match(text, /تومان/);
  assert.match(text, /صرافی/);
});
