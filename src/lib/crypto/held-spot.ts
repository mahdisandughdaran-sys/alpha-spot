import { candidateBases } from "./exclusions.ts";
import type { IranVenue } from "./spot-order.ts";
import type { HoldingInput } from "./types.ts";

export const HELD_KEY = "alpha-spot-held-v1";
export const HELD_EVENT = "alpha-spot-held";
export const CASH_CONFIRMED = "alpha-spot-cash-confirmed";
export const CASH_EVENT = "alpha-spot-cash";
export const VENUE_KEY = "alpha-spot-iran-venue";
const BOOK_KEY = "alpha-spot-book-v1";

export type HeldSpot = {
  symbol: string;
  name: string;
  binanceBase: string;
  entryUsd: number;
  qty: number;
  sizeUsd: number;
  invalidationUsd: number;
  targetUsd: number;
  targetFraction: number;
  targetSold: boolean;
  closed: boolean;
  exitNote: string | null;
  venue: IranVenue;
  openedAt: string;
  tomanPerUsdt: number | null;
};

export type WatchHit = {
  symbol: string;
  name: string;
  kind: "target" | "stop" | "kill";
  sellFraction: number;
  price: number;
  titleFa: string;
  titleEn: string;
  textFa: string;
  textEn: string;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadHeld(): HeldSpot[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(HELD_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HeldSpot[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((row) => row && typeof row.symbol === "string" && row.entryUsd > 0 && row.qty > 0);
  } catch {
    return [];
  }
}

export function saveHeld(rows: HeldSpot[]): void {
  if (!canStore()) return;
  try {
    localStorage.setItem(HELD_KEY, JSON.stringify(rows.slice(0, 20)));
    window.dispatchEvent(new Event(HELD_EVENT));
  } catch {
    /* quota */
  }
}

export function readCashConfirmed(): boolean {
  if (!canStore()) return false;
  return localStorage.getItem(CASH_CONFIRMED) === "1";
}

export function writeCashConfirmed(on: boolean): void {
  if (!canStore()) return;
  try {
    localStorage.setItem(CASH_CONFIRMED, on ? "1" : "0");
    window.dispatchEvent(new Event(CASH_EVENT));
  } catch {
    /* quota */
  }
}

export function readIranVenue(): IranVenue {
  if (!canStore()) return "nobitex";
  const raw = localStorage.getItem(VENUE_KEY);
  return raw === "wallex" ? "wallex" : "nobitex";
}

export function writeIranVenue(venue: IranVenue): void {
  if (!canStore()) return;
  try {
    localStorage.setItem(VENUE_KEY, venue);
  } catch {
    /* quota */
  }
}

export function recordHeld(input: {
  symbol: string;
  name: string;
  entryUsd: number;
  qty: number;
  invalidationUsd: number;
  targetUsd: number;
  targetFraction: number;
  venue: IranVenue;
  tomanPerUsdt: number | null;
}): HeldSpot {
  const symbol = input.symbol.toUpperCase();
  const next: HeldSpot = {
    symbol,
    name: input.name,
    binanceBase: candidateBases(symbol)[0] ?? symbol,
    entryUsd: input.entryUsd,
    qty: input.qty,
    sizeUsd: input.entryUsd * input.qty,
    invalidationUsd: input.invalidationUsd,
    targetUsd: input.targetUsd,
    targetFraction: input.targetFraction,
    targetSold: false,
    closed: false,
    exitNote: null,
    venue: input.venue,
    openedAt: new Date().toISOString(),
    tomanPerUsdt: input.tomanPerUsdt,
  };
  const rows = [next, ...loadHeld().filter((row) => row.symbol !== symbol)];
  saveHeld(rows);
  mirrorBook(rows);
  return next;
}

export function closeHeld(symbol: string, note: string): void {
  const key = symbol.toUpperCase();
  const rows = loadHeld().map((row) =>
    row.symbol === key && !row.closed ? { ...row, closed: true, exitNote: note } : row,
  );
  saveHeld(rows);
  mirrorBook(rows);
}

function mirrorBook(rows: HeldSpot[]): void {
  if (!canStore()) return;
  let manual: HoldingInput[] = [];
  try {
    const raw = localStorage.getItem(BOOK_KEY);
    manual = raw ? (JSON.parse(raw) as HoldingInput[]) : [];
    if (!Array.isArray(manual)) manual = [];
  } catch {
    manual = [];
  }
  const open = rows.filter((row) => !row.closed);
  const symbols = new Set(open.map((row) => row.symbol));
  const kept = manual.filter((row) => row && !symbols.has(String(row.symbol).toUpperCase()));
  const merged: HoldingInput[] = [
    ...open.map((row) => ({
      symbol: row.symbol,
      entryUsd: row.entryUsd,
      sizeUsd: row.sizeUsd,
      invalidationUsd: row.invalidationUsd,
    })),
    ...kept,
  ];
  try {
    localStorage.setItem(BOOK_KEY, JSON.stringify(merged));
  } catch {
    /* quota */
  }
}

export function evaluateWatch(
  rows: HeldSpot[],
  prices: Record<string, number>,
  killFlat: boolean,
): { next: HeldSpot[]; hits: WatchHit[] } {
  const hits: WatchHit[] = [];
  const next = rows.map((row) => {
    if (row.closed) return row;
    const price = prices[row.symbol];
    if (!(price > 0)) return row;
    if (killFlat || price <= row.invalidationUsd) {
      const kind = !killFlat || price <= row.invalidationUsd ? "stop" : "kill";
      hits.push(hit(row, kind, 1, price));
      return {
        ...row,
        closed: true,
        exitNote: kind === "kill" ? "kill" : "invalidation",
      };
    }
    if (!row.targetSold && row.targetUsd > 0 && price >= row.targetUsd) {
      hits.push(hit(row, "target", row.targetFraction, price));
      const left = row.qty * (1 - row.targetFraction);
      return {
        ...row,
        targetSold: true,
        qty: left,
        sizeUsd: left * row.entryUsd,
      };
    }
    return row;
  });
  return { next, hits };
}

function hit(row: HeldSpot, kind: WatchHit["kind"], sellFraction: number, price: number): WatchHit {
  if (kind === "target") {
    return {
      symbol: row.symbol,
      name: row.name,
      kind,
      sellFraction,
      price,
      titleFa: `${row.symbol} به هدف رسید`,
      titleEn: `${row.symbol} tagged the target`,
      textFa: `یک‌سوم ${row.symbol} را لیمیت بفروش. بقیه تا ابطال ${row.invalidationUsd} می‌ماند.`,
      textEn: `Sell one third of ${row.symbol} with a limit. The rest stays until invalidation at ${row.invalidationUsd}.`,
    };
  }
  if (kind === "kill") {
    return {
      symbol: row.symbol,
      name: row.name,
      kind,
      sellFraction,
      price,
      titleFa: `${row.symbol} را ببند`,
      titleEn: `Close ${row.symbol}`,
      textFa: "کلید قطع بیت‌کوین روشن است. ماندهٔ پوزیشن اسپات را بفروش و در تتر بمان.",
      textEn: "The Bitcoin kill switch is on. Sell the remaining spot position and stay in tether.",
    };
  }
  return {
    symbol: row.symbol,
    name: row.name,
    kind,
    sellFraction,
    price,
    titleFa: `${row.symbol} باطل شد`,
    titleEn: `${row.symbol} invalidated`,
    textFa: `قیمت به ابطال رسید. ماندهٔ ${row.symbol} را بفروش. به بازنده اضافه نکن.`,
    textEn: `Price reached invalidation. Sell the rest of ${row.symbol}. Do not add to the loser.`,
  };
}
