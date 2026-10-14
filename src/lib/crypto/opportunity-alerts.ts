import type { Opportunity, OpportunityStatus } from "./opportunity.ts";
import { msg } from "@/lib/i18n/lex";

export type OpportunityAlertKind =
  | "approaching"
  | "entered"
  | "confirmed"
  | "invalidated"
  | "shock"
  | "score-shift";

export type OpportunityAlert = {
  id: string;
  at: string;
  symbol: string;
  kind: OpportunityAlertKind;
  title: string;
  text: string;
};

const KEY = "alpha-spot-opp-alerts-v1";
const SNAP = "alpha-spot-opp-snap-v1";

export type OpportunitySnap = {
  symbol: string;
  name: string;
  status: OpportunityStatus;
  score: number;
  zoneLow: number | null;
  zoneHigh: number | null;
  invalidation: number | null;
  priceUsd: number;
  volumeZNote: boolean;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function snapshotOf(items: Opportunity[]): OpportunitySnap[] {
  return items
    .filter((row) => row.zone || row.status === "actionable" || row.status === "confirmed")
    .slice(0, 40)
    .map((row) => ({
      symbol: row.symbol,
      name: row.name,
      status: row.status,
      score: row.score,
      zoneLow: row.zone?.low ?? null,
      zoneHigh: row.zone?.high ?? null,
      invalidation: row.zone?.invalidation ?? null,
      priceUsd: row.priceUsd,
      volumeZNote: row.parts.some((part) => part.key === "volume" && part.score <= 30),
    }));
}

export function loadOppSnapshot(): OpportunitySnap[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(SNAP);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OpportunitySnap[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveOppSnapshot(items: Opportunity[]): OpportunitySnap[] {
  const next = snapshotOf(items);
  if (canStore()) {
    try {
      localStorage.setItem(SNAP, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}

export function loadOppAlerts(): OpportunityAlert[] {
  if (!canStore()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as OpportunityAlert[];
    return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
  } catch {
    return [];
  }
}

export function saveOppAlerts(rows: OpportunityAlert[]): OpportunityAlert[] {
  const next = rows.slice(0, 40);
  if (canStore()) {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* quota */
    }
  }
  return next;
}

function dayStamp(iso: string): string {
  return iso.slice(0, 10);
}

function zoneTag(low: number | null, high: number | null): string {
  if (low == null || high == null) return "none";
  return `${low.toPrecision(4)}:${high.toPrecision(4)}`;
}

export function alertsFromScan(
  prev: OpportunitySnap[],
  next: Opportunity[],
  at: string,
): OpportunityAlert[] {
  const before = new Map(prev.map((row) => [row.symbol, row]));
  const out: OpportunityAlert[] = [];
  const day = dayStamp(at);
  for (const row of next) {
    const old = before.get(row.symbol);
    const tag = zoneTag(row.zone?.low ?? null, row.zone?.high ?? null);
    const push = (kind: OpportunityAlertKind, title: string, text: string) => {
      out.push({
        id: `${row.symbol}:${kind}:${tag}:${day}`,
        at,
        symbol: row.symbol,
        kind,
        title,
        text,
      });
    };
    if (row.status === "approaching" && old?.status !== "approaching") {
      push(
        "approaching",
        msg(`${row.symbol} به محدوده نزدیک شده`, `${row.symbol} has approached the zone`),
        msg(
          `${row.summary} نزدیک شدن به‌تنهایی تأیید خرید نیست.`,
          `${row.summary} Approaching the zone alone is not a buy confirmation.`,
        ),
      );
    }
    if ((row.status === "in-zone" || row.status === "confirmed" || row.status === "actionable") && old && old.status !== "in-zone" && old.status !== "confirmed" && old.status !== "actionable") {
      push(
        "entered",
        msg(`${row.symbol} وارد محدوده شده`, `${row.symbol} has entered the zone`),
        msg(
          "قیمت به باند رسیده است. تا تأیید RSI یا MACD این یک ورود قطعی نیست.",
          "Price has reached the band. Until RSI or MACD confirms, this is not a definite entry.",
        ),
      );
    }
    if ((row.status === "confirmed" || row.status === "actionable") && old?.status !== "confirmed" && old?.status !== "actionable") {
      push("confirmed", msg(`${row.symbol} شرایط تأیید را گرفته`, `${row.symbol} has met the confirmation conditions`), row.summary);
    }
    if (row.status === "invalidated" && old?.status !== "invalidated") {
      push("invalidated", msg(`سناریوی ${row.symbol} نامعتبر شد`, `The ${row.symbol} scenario was invalidated`), row.summary);
    }
    if (row.parts.some((part) => part.key === "volume" && part.score <= 30) && !old?.volumeZNote) {
      push(
        "shock",
        msg(`حجم یا فشار غیرعادی در ${row.symbol}`, `Unusual volume or pressure in ${row.symbol}`),
        row.parts.find((part) => part.key === "volume")?.note ??
          msg("حجم از حالت عادی خارج شده است.", "Volume has left its normal range."),
      );
    }
    if (old && Math.abs(row.score - old.score) >= 8) {
      push(
        "score-shift",
        msg(`امتیاز فرصت ${row.symbol} تغییر کرد`, `The ${row.symbol} opportunity score changed`),
        msg(
          `از ${old.score.toFixed(1)} به ${row.score.toFixed(1)}. دلیل را در جزئیات عوامل ببینید، نه در درصد افت قیمت.`,
          `From ${old.score.toFixed(1)} to ${row.score.toFixed(1)}. See the factor detail, not the percent price drop.`,
        ),
      );
    }
  }
  return out;
}

export function alertsFromQuotes(
  snap: OpportunitySnap[],
  quotes: { symbol: string; price: number }[],
  at: string,
): OpportunityAlert[] {
  const px = new Map(quotes.map((row) => [row.symbol, row.price]));
  const day = dayStamp(at);
  const out: OpportunityAlert[] = [];
  for (const row of snap) {
    const price = px.get(row.symbol);
    if (price == null || price <= 0 || row.zoneHigh == null || row.zoneLow == null) continue;
    const tag = zoneTag(row.zoneLow, row.zoneHigh);
    const distance = (price - row.zoneHigh) / price;
    if (distance > 0 && distance <= 0.03) {
      out.push({
        id: `${row.symbol}:approaching:${tag}:${day}`,
        at,
        symbol: row.symbol,
        kind: "approaching",
        title: msg(`${row.symbol} به محدوده نزدیک است`, `${row.symbol} is near the zone`),
        text: msg(
          `آخرین قیمت ${price} و سقف محدوده ${row.zoneHigh.toPrecision(4)} است. این نزدیکی تأیید خرید نیست.`,
          `Last price is ${price} and the zone high is ${row.zoneHigh.toPrecision(4)}. This proximity is not a buy confirmation.`,
        ),
      });
    } else if (price <= row.zoneHigh && price >= row.zoneLow) {
      out.push({
        id: `${row.symbol}:entered:${tag}:${day}`,
        at,
        symbol: row.symbol,
        kind: "entered",
        title: msg(`${row.symbol} داخل محدوده است`, `${row.symbol} is inside the zone`),
        text: msg(
          "قیمت لحظه‌ای وارد باند شده. تأیید هنوز به کندل روزانه، RSI یا MACD نیاز دارد.",
          "The live price has entered the band. Confirmation still needs a daily close, RSI, or MACD.",
        ),
      });
    } else if (row.invalidation != null && price < row.invalidation) {
      out.push({
        id: `${row.symbol}:invalidated:${tag}:${day}`,
        at,
        symbol: row.symbol,
        kind: "invalidated",
        title: msg(`هشدار اولیه ابطال ${row.symbol}`, `Early invalidation warning for ${row.symbol}`),
        text: msg(
          "قیمت لحظه‌ای زیر سطح ابطال است. ابطال قطعی فقط با بسته شدن روزانه زیر همین سطح ثبت می‌شود.",
          "The live price is under the invalidation level. A hard invalidation is recorded only when the daily close finishes under that level.",
        ),
      });
    }
  }
  return out;
}
