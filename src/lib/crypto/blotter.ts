const KEY = "alpha-spot-blotter-v1";

export type PaperStatus = "open" | "closed";

export type PaperFill = {
  id: string;
  symbol: string;
  name: string;
  openedAt: string;
  qty: number;
  avgEntry: number;
  notionalUsd: number;
  invalidation: number;
  target: number;
  riskUsd: number;
  status: PaperStatus;
  closedAt?: string;
  closePrice?: number;
};

export function positionFromFills(input: {
  symbol: string;
  name: string;
  at: string;
  invalidation: number;
  target: number;
  rungs: { price: number; qty: number; notionalUsd: number }[];
}): PaperFill | null {
  const rungs = input.rungs.filter((rung) => rung.price > 0 && rung.qty > 0 && rung.notionalUsd > 0);
  if (!input.symbol || rungs.length === 0) return null;
  const notionalUsd = rungs.reduce((sum, rung) => sum + rung.notionalUsd, 0);
  const qty = rungs.reduce((sum, rung) => sum + rung.qty, 0);
  if (!(notionalUsd > 0) || !(qty > 0)) return null;
  const avgEntry = notionalUsd / qty;
  const riskUsd = avgEntry > input.invalidation ? (avgEntry - input.invalidation) * qty : 0;
  return {
    id: `${input.symbol}:${input.at}`,
    symbol: input.symbol,
    name: input.name || input.symbol,
    openedAt: input.at,
    qty,
    avgEntry,
    notionalUsd,
    invalidation: input.invalidation,
    target: input.target,
    riskUsd,
    status: "open",
  };
}

export function upsertFill(rows: PaperFill[], next: PaperFill): PaperFill[] {
  return [next, ...rows.filter((row) => row.id !== next.id)].slice(0, 30);
}

export function closeFill(rows: PaperFill[], id: string, price: number, at: string): PaperFill[] {
  if (!(price > 0)) return rows;
  return rows.map((row) =>
    row.id === id && row.status === "open" ? { ...row, status: "closed", closePrice: price, closedAt: at } : row,
  );
}

export function openPnl(row: PaperFill, price: number | null): number | null {
  if (row.status !== "open" || price == null || !(price > 0)) return null;
  return (price - row.avgEntry) * row.qty;
}

export function realizedPnl(row: PaperFill): number | null {
  if (row.status !== "closed" || row.closePrice == null || !(row.closePrice > 0)) return null;
  return (row.closePrice - row.avgEntry) * row.qty;
}

export function rMultiple(pnl: number | null, riskUsd: number): number | null {
  if (pnl == null || !(riskUsd > 0)) return null;
  return pnl / riskUsd;
}

export function summarizeBook(rows: PaperFill[], priceOf: (symbol: string) => number | null) {
  let open = 0;
  let missing = 0;
  let unrealized = 0;
  let realized = 0;
  for (const row of rows) {
    if (row.status === "closed") {
      const pnl = realizedPnl(row);
      if (pnl != null) realized += pnl;
      continue;
    }
    open += 1;
    const pnl = openPnl(row, priceOf(row.symbol));
    if (pnl == null) missing += 1;
    else unrealized += pnl;
  }
  return { open, missing, unrealized, realized };
}

export function loadBlotter(): PaperFill[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isFill).slice(0, 30);
  } catch {
    return [];
  }
}

export function saveBlotter(rows: PaperFill[]): PaperFill[] {
  const next = rows.slice(0, 30);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* private mode */
  }
  return next;
}

function isFill(value: unknown): value is PaperFill {
  if (!value || typeof value !== "object") return false;
  const row = value as PaperFill;
  return (
    typeof row.id === "string" &&
    typeof row.symbol === "string" &&
    typeof row.avgEntry === "number" &&
    typeof row.qty === "number" &&
    (row.status === "open" || row.status === "closed")
  );
}
