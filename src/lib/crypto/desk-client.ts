import type { BookCheck, CoinRow, Sleeve } from "./types.ts";

const SETTINGS = "alpha-spot-desk-v1";
const ORDERS = "alpha-spot-orders-v1";
const ALERTS = "alpha-spot-alerts-v1";
const SEEN = "alpha-spot-seen-v1";

export type DeskSettings = {
  capitalUsd: number;
  webhookUrl: string;
  telegramToken: string;
  telegramChat: string;
  alertKill: boolean;
  alertScore: boolean;
  scoreFloor: number;
};

export const defaultDeskSettings: DeskSettings = {
  capitalUsd: 10_000,
  webhookUrl: "",
  telegramToken: "",
  telegramChat: "",
  alertKill: true,
  alertScore: true,
  scoreFloor: 60,
};

export type PaperOrder = {
  id: string;
  at: string;
  symbol: string;
  side: "BUY";
  notionalUsd: number;
  weight: number;
  priceUsd: number;
  slippageBps: number | null;
  status: "paper" | "sent" | "failed";
};

export type DeskAlert = {
  id: string;
  at: string;
  title: string;
  text: string;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadDeskSettings(): DeskSettings {
  if (!canStore()) return { ...defaultDeskSettings };
  try {
    const raw = localStorage.getItem(SETTINGS);
    if (!raw) return { ...defaultDeskSettings };
    const parsed = JSON.parse(raw) as Partial<DeskSettings>;
    return {
      ...defaultDeskSettings,
      ...parsed,
      capitalUsd: Number(parsed.capitalUsd) > 0 ? Number(parsed.capitalUsd) : 10_000,
      scoreFloor: Number.isFinite(Number(parsed.scoreFloor)) ? Number(parsed.scoreFloor) : 60,
    };
  } catch {
    return { ...defaultDeskSettings };
  }
}

export function saveDeskSettings(next: DeskSettings): void {
  if (!canStore()) return;
  try {
    localStorage.setItem(SETTINGS, JSON.stringify(next));
  } catch {
    /* quota */
  }
}

export function planOrders(
  sleeves: Sleeve[],
  coins: CoinRow[],
  books: BookCheck[],
  capitalUsd: number,
): PaperOrder[] {
  const weights = new Map<string, number>();
  for (const sleeve of sleeves) {
    for (const leg of sleeve.legs) {
      weights.set(leg.symbol, (weights.get(leg.symbol) ?? 0) + leg.weight);
    }
  }
  const at = new Date().toISOString();
  const orders: PaperOrder[] = [];
  for (const [symbol, weight] of weights) {
    if (weight <= 0) continue;
    const coin = coins.find((row) => row.symbol === symbol);
    const book = books.find((row) => row.symbol === symbol);
    orders.push({
      id: `${at}:${symbol}`,
      at,
      symbol,
      side: "BUY",
      notionalUsd: Math.round(capitalUsd * weight),
      weight,
      priceUsd: coin?.priceUsd ?? 0,
      slippageBps: book?.slippageBps ?? null,
      status: "paper",
    });
  }
  return orders.sort((a, b) => b.notionalUsd - a.notionalUsd);
}

export function loadOrders(): PaperOrder[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(ORDERS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as PaperOrder[];
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

export function saveOrders(rows: PaperOrder[]): PaperOrder[] {
  const next = rows.slice(0, 40);
  if (canStore()) {
    try {
      localStorage.setItem(ORDERS, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}

export function loadAlerts(): DeskAlert[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(ALERTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as DeskAlert[];
    return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
  } catch {
    return [];
  }
}

export function pushAlert(alert: DeskAlert): DeskAlert[] {
  const next = [alert, ...loadAlerts().filter((row) => row.id !== alert.id)].slice(0, 30);
  if (canStore()) {
    try {
      localStorage.setItem(ALERTS, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}

function seenMap(): Record<string, string> {
  if (!canStore()) return {};
  try {
    const raw = localStorage.getItem(SEEN);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function hasSeen(id: string): boolean {
  return Boolean(seenMap()[id]);
}

export function markSeen(id: string): void {
  if (!canStore()) return;
  const map = seenMap();
  map[id] = new Date().toISOString();
  const entries = Object.entries(map).slice(-80);
  try {
    localStorage.setItem(SEEN, JSON.stringify(Object.fromEntries(entries)));
  } catch {
    /* quota */
  }
}
