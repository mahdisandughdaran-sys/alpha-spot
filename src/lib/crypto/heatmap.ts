export type HeatWeight = { id: string; weight: number };

export type HeatRect = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
};

/** Binary slice-and-dice. Areas match the weights; the longer side is split. */
export function layoutHeatmap(items: HeatWeight[], width: number, height: number): HeatRect[] {
  if (!(width > 0) || !(height > 0)) return [];
  const clean = items
    .map((item) => ({ id: item.id, weight: Number.isFinite(item.weight) && item.weight > 0 ? item.weight : 0 }))
    .filter((item) => item.id);
  if (clean.length === 0) return [];
  const total = clean.reduce((sum, item) => sum + item.weight, 0);
  const area = width * height;
  const weighted =
    total > 0
      ? clean.map((item) => ({ id: item.id, area: (item.weight / total) * area }))
      : clean.map((item) => ({ id: item.id, area: area / clean.length }));
  return slice(weighted, 0, 0, width, height);
}

function slice(items: { id: string; area: number }[], x: number, y: number, w: number, h: number): HeatRect[] {
  if (items.length === 0 || !(w > 0) || !(h > 0)) return [];
  if (items.length === 1) return [{ id: items[0]!.id, x, y, w, h }];
  const total = items.reduce((sum, item) => sum + item.area, 0);
  let acc = 0;
  let split = 1;
  while (split < items.length - 1 && acc + items[split - 1]!.area < total / 2) {
    acc += items[split - 1]!.area;
    split += 1;
  }
  const left = items.slice(0, split);
  const right = items.slice(split);
  const leftSum = left.reduce((sum, item) => sum + item.area, 0);
  const frac = total > 0 ? leftSum / total : 0.5;
  if (w >= h) {
    const lw = w * frac;
    return [...slice(left, x, y, lw, h), ...slice(right, x + lw, y, Math.max(w - lw, 0), h)];
  }
  const lh = h * frac;
  return [...slice(left, x, y, w, lh), ...slice(right, x, y + lh, w, Math.max(h - lh, 0))];
}
