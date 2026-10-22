import assert from "node:assert/strict";
import { test } from "node:test";
import { layoutHeatmap } from "./heatmap.ts";

test("one cell fills the frame", () => {
  const [cell] = layoutHeatmap([{ id: "BTC", weight: 10 }], 400, 200);
  assert.ok(cell);
  assert.equal(cell.x, 0);
  assert.equal(cell.y, 0);
  assert.equal(cell.w, 400);
  assert.equal(cell.h, 200);
});

test("areas follow weights and do not overlap", () => {
  const cells = layoutHeatmap(
    [
      { id: "BTC", weight: 50 },
      { id: "ETH", weight: 25 },
      { id: "SOL", weight: 15 },
      { id: "XRP", weight: 10 },
    ],
    800,
    400,
  );
  assert.equal(cells.length, 4);
  const frame = 800 * 400;
  const area = cells.reduce((sum, cell) => sum + cell.w * cell.h, 0);
  assert.ok(Math.abs(area - frame) < 1);
  const btc = cells.find((cell) => cell.id === "BTC");
  const xrp = cells.find((cell) => cell.id === "XRP");
  assert.ok(btc && xrp && btc.w * btc.h > xrp.w * xrp.h * 3);
  for (let i = 0; i < cells.length; i += 1) {
    for (let j = i + 1; j < cells.length; j += 1) {
      const a = cells[i]!;
      const b = cells[j]!;
      const overlap = a.x < b.x + b.w - 0.01 && b.x < a.x + a.w - 0.01 && a.y < b.y + b.h - 0.01 && b.y < a.y + a.h - 0.01;
      assert.equal(overlap, false, `${a.id} overlaps ${b.id}`);
    }
  }
});

test("zero weights share the frame equally", () => {
  const cells = layoutHeatmap(
    [
      { id: "A", weight: 0 },
      { id: "B", weight: 0 },
    ],
    100,
    100,
  );
  assert.equal(cells.length, 2);
  assert.ok(Math.abs(cells[0]!.w * cells[0]!.h - 5000) < 1);
});

test("a dead frame returns nothing", () => {
  assert.deepEqual(layoutHeatmap([{ id: "BTC", weight: 1 }], 0, 200), []);
});
