import { clamp } from "./math.ts";
import type { BookCheck, BookGate, BuySignal, CoinRow } from "./types.ts";

export const SLIP_NOTIONAL_USD = 10_000;
export const THIN_SLIP_BPS = 35;
export const THIN_DEPTH_USD = 25_000;
export const CROWDED_ANNUAL = 0.3;
export const HOT_OI_CHANGE = 0.25;
export const HOT_LONG_RATIO = 2.3;

export type BookLevel = { price: number; qty: number };

export type BookInput = {
  symbol: string;
  asks: BookLevel[];
  funding8h: number | null;
  notionalUsd?: number;
  openInterestUsd?: number | null;
  oiChange24h?: number | null;
  longShortRatio?: number | null;
  smallCap?: boolean;
};

export function annualizedFunding(rate8h: number): number {
  return rate8h * 3 * 365;
}

export function oiChange(nowUsd: number | null, prevUsd: number | null): number | null {
  if (nowUsd == null || prevUsd == null || !(prevUsd > 0)) return null;
  return nowUsd / prevUsd - 1;
}

export function hotDerivatives(input: {
  oiChange24h?: number | null;
  longShortRatio?: number | null;
}): boolean {
  const change = input.oiChange24h;
  const ratio = input.longShortRatio;
  if (change != null && change >= HOT_OI_CHANGE && (ratio == null || ratio >= 1.6)) return true;
  if (ratio != null && ratio >= HOT_LONG_RATIO) return true;
  return false;
}

function usdCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  return Math.round(n).toLocaleString("en-US");
}

function derivSentence(input: BookInput): string {
  const parts: string[] = [];
  if (input.openInterestUsd != null && input.openInterestUsd > 0) {
    parts.push(`سود باز $${usdCompact(input.openInterestUsd)}`);
  }
  if (input.oiChange24h != null && Number.isFinite(input.oiChange24h)) {
    const pct = input.oiChange24h * 100;
    const sign = pct > 0 ? "+" : "";
    parts.push(`تغییر ۲۴س ${sign}${pct.toFixed(1)}٪`);
  }
  if (input.longShortRatio != null && Number.isFinite(input.longShortRatio)) {
    parts.push(`لانگ/شورت ${input.longShortRatio.toFixed(2)}`);
  }
  return parts.length ? `${parts.join("، ")}.` : "";
}

export function assessBook(input: BookInput): BookCheck {
  const notionalUsd = input.notionalUsd ?? SLIP_NOTIONAL_USD;
  const symbol = input.symbol.toUpperCase();
  const asks = input.asks
    .filter((lvl) => lvl.price > 0 && lvl.qty > 0)
    .sort((a, b) => a.price - b.price);
  const funding8h = input.funding8h;
  const fundingAnnual =
    funding8h == null || !Number.isFinite(funding8h) ? null : annualizedFunding(funding8h);
  const openInterestUsd =
    input.openInterestUsd != null && Number.isFinite(input.openInterestUsd)
      ? input.openInterestUsd
      : null;
  const oiChange24h =
    input.oiChange24h != null && Number.isFinite(input.oiChange24h) ? input.oiChange24h : null;
  const longShortRatio =
    input.longShortRatio != null && Number.isFinite(input.longShortRatio)
      ? input.longShortRatio
      : null;
  const smallCap = input.smallCap === true;
  const deriv = derivSentence({
    ...input,
    openInterestUsd,
    oiChange24h,
    longShortRatio,
  });

  if (asks.length === 0) {
    return {
      symbol,
      notionalUsd,
      slippageBps: null,
      depthUsd: null,
      filledPct: null,
      funding8h,
      fundingAnnual,
      openInterestUsd,
      oiChange24h,
      longShortRatio,
      smallCap,
      gate: "unknown",
      note: deriv
        ? `دفتر سفارش بایننس برای این نماد پاسخ نداد. ${deriv}`
        : "دفتر سفارش بایننس برای این نماد پاسخ نداد؛ فیلتر اسلیپیج اعمال نشد.",
    };
  }

  const best = asks[0]!.price;
  const band = best * 1.001;
  let depthUsd = 0;
  for (const lvl of asks) {
    if (lvl.price > band) break;
    depthUsd += lvl.price * lvl.qty;
  }

  let spent = 0;
  let qty = 0;
  for (const lvl of asks) {
    if (spent >= notionalUsd) break;
    const room = notionalUsd - spent;
    const levelUsd = lvl.price * lvl.qty;
    const take = Math.min(room, levelUsd);
    spent += take;
    qty += take / lvl.price;
  }

  const filledPct = notionalUsd > 0 ? spent / notionalUsd : 0;
  const avg = qty > 0 ? spent / qty : best;
  const slippageBps = best > 0 ? (avg / best - 1) * 10_000 : 0;
  const thin = filledPct < 0.9 || slippageBps > THIN_SLIP_BPS || depthUsd < THIN_DEPTH_USD;
  const crowded = fundingAnnual != null && fundingAnnual > CROWDED_ANNUAL;
  const levered = smallCap && hotDerivatives({ oiChange24h, longShortRatio });
  const gate: BookGate = thin ? "thin" : crowded ? "crowded" : levered ? "levered" : "pass";

  const slipTxt = `${slippageBps.toFixed(1)} bps`;
  const depthTxt =
    depthUsd >= 1_000_000
      ? `${(depthUsd / 1_000_000).toFixed(2)}M`
      : `${Math.round(depthUsd).toLocaleString("en-US")}`;
  const fundTxt =
    fundingAnnual == null
      ? "فاندینگ آتی در دسترس نبود"
      : `فاندینگ سالانه ${(fundingAnnual * 100).toFixed(1)}٪`;
  const tail = deriv ? ` ${deriv}` : "";

  const note =
    gate === "thin"
      ? `خرید ${Math.round(notionalUsd).toLocaleString("en-US")} دلار حدود ${slipTxt} لغزش دارد و عمق ۱۰bps برابر $${depthTxt} است. سیگنال خرید معلق شد.${tail}`
      : gate === "crowded"
        ? `دفتر سفارش قابل قبول است (${slipTxt}، عمق $${depthTxt}) اما ${fundTxt} — پوزیشن لانگ آتی شلوغ است و حجم اسپات نصف شد.${tail}`
        : gate === "levered"
          ? `دفتر اسپات قابل قبول است (${slipTxt}) اما سود باز آلت خرد داغ است و حجم اسپات نصف شد. ${fundTxt}.${tail}`
          : `اسلیپیج ${slipTxt}، عمق ۱۰bps برابر $${depthTxt}. ${fundTxt}.${tail}`;

  return {
    symbol,
    notionalUsd,
    slippageBps,
    depthUsd,
    filledPct,
    funding8h,
    fundingAnnual,
    openInterestUsd,
    oiChange24h,
    longShortRatio,
    smallCap,
    gate,
    note,
  };
}

export function applyBookGate(row: CoinRow, book: BookCheck | undefined): CoinRow {
  if (!book || book.gate === "unknown" || book.gate === "pass") return row;
  if (book.gate === "thin") {
    return {
      ...row,
      score: clamp(row.score - 14),
      buySignal: "suspended",
      sizeMultiplier: 0,
    };
  }
  const buySignal: BuySignal = row.buySignal === "open" ? "reduced" : row.buySignal;
  const sizeMultiplier = row.buySignal === "suspended" ? 0 : Math.min(row.sizeMultiplier, 0.5);
  const penalty = book.gate === "levered" ? 8 : 6;
  return {
    ...row,
    score: clamp(row.score - penalty),
    buySignal,
    sizeMultiplier,
  };
}
