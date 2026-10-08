import { detectWeeklyStructure, ema, lookback, weeklySupportBroken } from "./math.ts";
import type { BtcKillSwitch, BuySignal, KillSwitchStatus, WeeklyStructure } from "./types.ts";

export function classifyMacroRisk(
  belowEma: boolean,
  severeWeekly: boolean,
): KillSwitchStatus {
  if (belowEma && severeWeekly) return "SUSPENDED";
  if (belowEma || severeWeekly) return "HIGH_RISK";
  return "NORMAL";
}

export function spotBuysFor(status: KillSwitchStatus): BuySignal {
  if (status === "SUSPENDED") return "suspended";
  if (status === "HIGH_RISK") return "reduced";
  return "open";
}

export function isSevereWeekly(input: {
  weeklyStructure: WeeklyStructure | null;
  weeklyMomentum: number | null;
  weeklySupportBroken: boolean;
}): boolean {
  if (input.weeklyStructure !== "bear") return false;
  const crashed = input.weeklyMomentum != null && input.weeklyMomentum <= -0.08;
  return crashed || input.weeklySupportBroken;
}

function pct(x: number): string {
  const v = x * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}٪`;
}

export function evaluateKillSwitch(input: {
  priceUsd: number;
  closes: number[];
}): BtcKillSwitch {
  const ema200 = ema(input.closes, 200);
  const aboveEma200 =
    ema200 == null || !Number.isFinite(input.priceUsd) ? null : input.priceUsd >= ema200;
  const distanceToEma =
    ema200 && ema200 !== 0 && Number.isFinite(input.priceUsd)
      ? input.priceUsd / ema200 - 1
      : null;
  const weeklyStructure =
    input.closes.length >= 56 ? detectWeeklyStructure(input.closes) : null;
  const weeklyMomentum = lookback(input.closes, 28);
  const supportBroken = weeklySupportBroken(input.closes);
  const severeWeekly = isSevereWeekly({
    weeklyStructure,
    weeklyMomentum,
    weeklySupportBroken: supportBroken,
  });

  if (aboveEma200 == null && weeklyStructure == null) {
    return {
      status: "NORMAL",
      active: false,
      aboveEma200: null,
      ema200: null,
      priceUsd: input.priceUsd,
      distanceToEma: null,
      weeklyStructure: null,
      weeklyMomentum,
      severeWeekly: false,
      weeklySupportBroken: false,
      sizeMultiplier: 1,
      spotBuys: "open",
      headline: "فیلتر کلان در دسترس نیست",
      note: "کندل روزانه بیت‌کوین برای EMA ۲۰۰ و ساختار هفتگی کافی نبود؛ کلید قطع اجرا نشد و سیگنال‌ها بدون این فیلتر مانده‌اند.",
    };
  }

  const below = aboveEma200 === false;
  const status = classifyMacroRisk(below, severeWeekly);
  const spotBuys = spotBuysFor(status);
  const sizeMultiplier = status === "SUSPENDED" ? 0 : status === "HIGH_RISK" ? 0.5 : 1;

  const emaBit =
    aboveEma200 == null
      ? "EMA ۲۰۰ محاسبه نشد"
      : aboveEma200
        ? `قیمت بالای EMA ۲۰۰ است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}`
        : `قیمت زیر EMA ۲۰۰ روزانه است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}`;
  const weekBit = severeWeekly
    ? `ساختار هفتگی شدیداً نزولی است${weeklyMomentum == null ? "" : `؛ بازده ۴ هفته ${pct(weeklyMomentum)}`}`
    : weeklyStructure === "bear"
      ? "ساختار هفتگی نزولی است ولی هنوز به آستانه شدید (افت ۴ هفته‌ای بیش از ۸٪ یا شکست کف ۸ هفته) نرسیده"
      : weeklyStructure === "bull"
        ? "ساختار هفتگی صعودی است"
        : "ساختار هفتگی خنثی یا نامشخص است";

  let headline = "ریسک کلان نرمال";
  let note = `${emaBit}. ${weekBit}. خرید اسپات با حجم کامل مدل مجاز است.`;
  if (status === "SUSPENDED") {
    headline = "کلید قطع اضطراری فعال";
    note = `${emaBit}. ${weekBit}. هر دو شرط برقرار است؛ سیگنال خرید اسپات آلت‌کوین معلق شد و وزن پیشنهادی به بیت‌کوین برمی‌گردد.`;
  } else if (status === "HIGH_RISK") {
    headline = "ریسک کلان بالا · حجم نصف";
    note = `${emaBit}. ${weekBit}. کلید احتیاط فعال است و حجم پیشنهادی پوزیشن‌های اسپات ۵۰٪ کاهش یافت.`;
  }

  return {
    status,
    active: status !== "NORMAL",
    aboveEma200,
    ema200,
    priceUsd: input.priceUsd,
    distanceToEma,
    weeklyStructure,
    weeklyMomentum,
    severeWeekly,
    weeklySupportBroken: supportBroken,
    sizeMultiplier,
    spotBuys,
    headline,
    note,
  };
}
