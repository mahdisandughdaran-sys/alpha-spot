import assert from "node:assert/strict";
import test from "node:test";
import { sessionCalendar } from "./session-calendar.ts";

test("a normal Thursday does not block a spot buy", () => {
  const day = sessionCalendar(new Date("2026-10-15T12:00:00Z"));
  assert.equal(day.blockSpot, false);
  assert.equal(day.tehranYmd, "2026-10-15");
  assert.equal(day.nextClosed?.ymd, "2026-10-16");
});

test("Iranian Friday blocks the spot recommendation", () => {
  const day = sessionCalendar(new Date("2026-10-16T12:00:00Z"));
  assert.equal(day.blockSpot, true);
  assert.ok(day.reasons.includes("iran-friday"));
});

test("Nowruz blocks even though it is a Saturday", () => {
  const day = sessionCalendar(new Date("2026-03-21T12:00:00Z"));
  assert.equal(day.blockSpot, true);
  assert.ok(day.reasons.includes("iran-holiday"));
});

test("Thanksgiving blocks because the NYSE is closed", () => {
  const day = sessionCalendar(new Date("2026-11-26T16:00:00Z"));
  assert.equal(day.blockSpot, true);
  assert.ok(day.reasons.includes("us-holiday"));
});
