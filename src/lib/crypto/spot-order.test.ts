import assert from "node:assert/strict";
import { test } from "node:test";
import { buildMachineTicket, type MachineFocus } from "./machine.ts";
import { evaluateWatch, type HeldSpot } from "./held-spot.ts";
import { buildSpotOrder, planIranPath, TARGET_FRACTION } from "./spot-order.ts";

function focus(partial: Partial<MachineFocus> = {}): MachineFocus {
  return {
    hint: "buy",
    holdsCore: true,
    symbol: "SOL",
    name: "Solana",
    rank: 6,
    score: 78,
    price: 146,
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

const when = new Date("2026-10-22T14:00:00Z");

test("unconfirmed cash is a wait, not a buy", () => {
  const ticket = buildMachineTicket(focus(), 2_000, 1, when);
  const order = buildSpotOrder({
    ticket,
    slippageBps: 5,
    bookGate: "pass",
    capitalConfirmed: false,
    tomanPerUsdt: 70_000,
    venue: "nobitex",
  });
  assert.equal(order.stance, "wait");
  assert.match(order.whyFa, /نقد واقعی/);
});

test("a confirmed in-zone name is one limit, not a market", () => {
  const ticket = buildMachineTicket(focus(), 2_000, 1, when);
  const order = buildSpotOrder({
    ticket,
    slippageBps: 40,
    bookGate: "thin",
    capitalConfirmed: true,
    tomanPerUsdt: 70_000,
    venue: "nobitex",
  });
  assert.equal(order.stance, "buy");
  assert.equal(order.fill?.marketOk, false);
  assert.ok(order.limitPrice && order.limitPrice <= order.fill!.ticker);
  assert.ok(order.exit);
  assert.ok(Math.abs(order.exit!.takeQty / order.qty - TARGET_FRACTION) < 1e-9);
});

test("tight book and a live session allow a market, but the card still leads with the limit", () => {
  const ticket = buildMachineTicket(focus(), 2_000, 1, when);
  const order = buildSpotOrder({
    ticket,
    slippageBps: 5,
    bookGate: "pass",
    capitalConfirmed: true,
    tomanPerUsdt: 70_000,
    venue: "nobitex",
  });
  assert.equal(order.stance, "buy");
  assert.equal(order.fill?.marketOk, true);
  assert.match(order.whyFa, /لیمیت/);
});

test("a direct toman pair leaves more coins than two legs", () => {
  const two = planIranPath("nobitex", "PEPE", 100, 0.00001, 70_000);
  const one = planIranPath("nobitex", "SOL", 100, 150, 70_000);
  assert.ok(two);
  assert.equal(two!.one, null);
  assert.equal(two!.two.legs, 2);
  assert.ok(one?.one);
  assert.ok(one!.one!.coinQty > 0);
  const viaUsdt = planIranPath("nobitex", "SOL", 100, 150, 70_000)!;
  assert.ok(viaUsdt.one!.coinQty > viaUsdt.two.coinQty);
});

test("a tiny toman budget is under the venue minimum", () => {
  const path = planIranPath("wallex", "SOL", 0.5, 150, 70_000);
  assert.equal(path?.two.belowMin, true);
  const ticket = buildMachineTicket(focus(), 0.5, 1, when);
  const order = buildSpotOrder({
    ticket,
    slippageBps: 5,
    bookGate: "pass",
    capitalConfirmed: true,
    tomanPerUsdt: 70_000,
    venue: "wallex",
  });
  if (order.notionalUsd > 0) assert.equal(order.stance, "wait");
});

test("kill switch is do not buy", () => {
  const ticket = buildMachineTicket(
    focus({ hint: "cash", symbol: "USDT", sleeve: "cash", sizeMultiplier: 0, price: 1, zone: null }),
    2_000,
    1,
    when,
  );
  const order = buildSpotOrder({
    ticket,
    slippageBps: null,
    bookGate: null,
    capitalConfirmed: true,
    tomanPerUsdt: 70_000,
    venue: "nobitex",
  });
  assert.equal(order.stance, "dont");
});

test("a held coin sells a third at the target, then the rest at invalidation", () => {
  const row: HeldSpot = {
    symbol: "SOL",
    name: "Solana",
    binanceBase: "SOL",
    entryUsd: 146,
    qty: 3,
    sizeUsd: 438,
    invalidationUsd: 132,
    targetUsd: 176,
    targetFraction: TARGET_FRACTION,
    targetSold: false,
    closed: false,
    exitNote: null,
    venue: "nobitex",
    openedAt: "2026-11-02T00:00:00.000Z",
    tomanPerUsdt: 70_000,
  };
  const up = evaluateWatch([row], { SOL: 180 }, false);
  assert.equal(up.hits[0]?.kind, "target");
  assert.equal(up.hits[0]?.sellFraction, TARGET_FRACTION);
  assert.equal(up.next[0]?.targetSold, true);
  assert.ok(Math.abs((up.next[0]?.qty ?? 0) - 2) < 1e-9);

  const down = evaluateWatch(up.next, { SOL: 130 }, false);
  assert.equal(down.hits[0]?.kind, "stop");
  assert.equal(down.next[0]?.closed, true);

  const killed = evaluateWatch([row], { SOL: 150 }, true);
  assert.equal(killed.hits[0]?.kind, "kill");
  assert.equal(killed.next[0]?.closed, true);
});
