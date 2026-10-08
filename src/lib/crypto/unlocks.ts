import type { RawUnlockEvent, UnlockAssessment } from "./types.ts";

/** Subtracted from the total 0–100 score when 30-day unlocks exceed 3% of supply. */
export function dilutionPenalty(pctOfSupply30d: number): number {
  if (!(pctOfSupply30d > 3)) return 0;
  if (pctOfSupply30d <= 5) return 15;
  if (pctOfSupply30d <= 8) return 18;
  return 20;
}

function dayKey(ms: number): string {
  const d = new Date(ms);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function emptyUnlock(note = "برنامه آزادسازی برای این نماد ثبت نشده است."): UnlockAssessment {
  return {
    penalty: 0,
    highDilution: false,
    pct30d: null,
    nextDate: null,
    nextDays: null,
    cliff: false,
    note,
  };
}

/**
 * Cliff-style if a single UTC day releases at least 1% of supply.
 * Penalty fires when the next 30 days sum to more than 3% of max (or total) supply.
 * The 14–30 day band is flagged separately for the desk calendar.
 */
export function assessUnlocks(input: {
  maxSupply: number | null;
  totalSupply: number | null;
  events: RawUnlockEvent[];
  now?: Date;
}): UnlockAssessment {
  const supply =
    input.maxSupply && input.maxSupply > 0
      ? input.maxSupply
      : input.totalSupply && input.totalSupply > 0
        ? input.totalSupply
        : null;
  if (!supply) {
    return emptyUnlock("عرضه کل برای تبدیل مقدار آزادسازی به درصد در دسترس نبود.");
  }
  if (input.events.length === 0) {
    return emptyUnlock("رویداد آزادسازی آینده در تقویم این نماد نیست.");
  }

  const now = input.now ?? new Date();
  const nowMs = now.getTime();
  const byDay = new Map<string, { ms: number; amount: number; days: number }>();

  for (const event of input.events) {
    const ms = Date.parse(event.time);
    if (!Number.isFinite(ms) || ms <= nowMs) continue;
    if (!Number.isFinite(event.amount) || event.amount <= 0) continue;
    const days = Math.ceil((ms - nowMs) / 86_400_000);
    if (days <= 0 || days > 30) continue;
    const key = dayKey(ms);
    const prev = byDay.get(key);
    if (prev) prev.amount += event.amount;
    else byDay.set(key, { ms, amount: event.amount, days });
  }

  if (byDay.size === 0) {
    return emptyUnlock("در ۳۰ روز آینده آزادسازی ثبت‌شده‌ای نیست.");
  }

  let pct30d = 0;
  let cliff = false;
  let bandPct = 0;
  let next: { key: string; days: number; pct: number } | null = null;

  for (const [key, row] of byDay) {
    const pct = (row.amount / supply) * 100;
    pct30d += pct;
    const cliffDay = pct >= 1;
    if (cliffDay) cliff = true;
    if (row.days >= 14 && row.days <= 30) {
      bandPct += pct;
      if (cliffDay) cliff = true;
    }
    if (!next || row.days < next.days) next = { key, days: row.days, pct };
  }

  const penalty = dilutionPenalty(pct30d);
  const highDilution = penalty > 0;
  const pctLabel = pct30d.toFixed(2);
  const bandLabel = bandPct.toFixed(2);
  let note = `آزادسازی ۳۰ روز آینده ${pctLabel}٪ از عرضه است`;
  if (bandPct > 0) note += `؛ سهم بازه ۱۴ تا ۳۰ روز ${bandLabel}٪`;
  if (cliff) note += "؛ دست‌کم یک روز کلیف‌مانند (بالای ۱٪ عرضه در یک روز) دیده شد";
  if (highDilution) {
    note += `. برچسب High Dilution Risk و کسر ${penalty} امتیاز از نمره کل.`;
  } else {
    note += ". زیر آستانه ۳٪ است و جریمه امتیاز ندارد.";
  }

  return {
    penalty,
    highDilution,
    pct30d,
    nextDate: next ? next.key : null,
    nextDays: next ? next.days : null,
    cliff,
    note,
  };
}
