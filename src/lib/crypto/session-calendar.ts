export type ClosedReason = "us-holiday";

export type Holiday = {
  ymd: string;
  nameFa: string;
  nameEn: string;
  market: "us";
};

export type SessionDay = {
  tehranYmd: string;
  newYorkYmd: string;
  blockSpot: boolean;
  reasons: ClosedReason[];
  holidays: Holiday[];
  earlyClose: Holiday | null;
  titleFa: string;
  titleEn: string;
  reasonFa: string;
  reasonEn: string;
  nextClosed: Holiday | null;
};

const US_CLOSED: Record<string, [string, string]> = {
  "2026-01-01": ["سال نو میلادی", "New Year's Day"],
  "2026-01-19": ["روز مارتین لوتر کینگ", "Martin Luther King Jr. Day"],
  "2026-02-16": ["روز رؤسای جمهور", "Presidents Day"],
  "2026-04-03": ["جمعهٔ خوب", "Good Friday"],
  "2026-05-25": ["یادبود", "Memorial Day"],
  "2026-06-19": ["جونتینث", "Juneteenth"],
  "2026-07-03": ["استقلال آمریکا (تعویض‌شده)", "Independence Day observed"],
  "2026-09-07": ["روز کارگر آمریکا", "Labor Day"],
  "2026-11-26": ["روز شکرگزاری", "Thanksgiving"],
  "2026-12-25": ["کریسمس", "Christmas"],
  "2027-01-01": ["سال نو میلادی", "New Year's Day"],
};

const US_EARLY: Record<string, [string, string]> = {
  "2026-11-27": ["جمعهٔ بعد از شکرگزاری · بورس آمریکا ساعت ۱۳ می‌بندد", "Day after Thanksgiving, US stocks close at 1pm"],
  "2026-12-24": ["شب کریسمس · بورس آمریکا ساعت ۱۳ می‌بندد", "Christmas Eve, US stocks close at 1pm"],
};

export const MACRO_EVENTS: { ymd: string; nameFa: string; nameEn: string }[] = [
  { ymd: "2026-10-15", nameFa: "PPI و فروش خرده‌فروشی آمریکا", nameEn: "US PPI and retail sales" },
  { ymd: "2026-10-27", nameFa: "شروع جلسهٔ FOMC", nameEn: "FOMC meeting starts" },
  { ymd: "2026-10-28", nameFa: "بیانیهٔ نرخ بهرهٔ فدرال رزرو", nameEn: "Federal Reserve rate decision" },
  { ymd: "2026-10-29", nameFa: "GDP و PCE آمریکا", nameEn: "US GDP and PCE" },
  { ymd: "2026-11-06", nameFa: "گزارش اشتغال آمریکا", nameEn: "US jobs report" },
  { ymd: "2026-11-26", nameFa: "thanksgiving · بورس آمریکا تعطیل", nameEn: "Thanksgiving, NYSE closed" },
  { ymd: "2026-12-08", nameFa: "شروع جلسهٔ FOMC و نمودار نقطه‌ای", nameEn: "FOMC meeting and dot plot" },
  { ymd: "2026-12-09", nameFa: "بیانیهٔ نرخ بهرهٔ فدرال رزرو", nameEn: "Federal Reserve rate decision" },
];

function ymd(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function holiday(dateKey: string, table: Record<string, [string, string]>, market: "us"): Holiday | null {
  const names = table[dateKey];
  if (!names) return null;
  return { ymd: dateKey, nameFa: names[0], nameEn: names[1], market };
}

export function upcomingEvents(fromYmd: string, limit = 4) {
  return MACRO_EVENTS.filter((event) => event.ymd >= fromYmd).slice(0, limit);
}

function evaluate(now: Date): Omit<SessionDay, "nextClosed"> {
  const tehranYmd = ymd(now, "Asia/Tehran");
  const newYorkYmd = ymd(now, "America/New_York");
  const reasons: ClosedReason[] = [];
  const holidays: Holiday[] = [];

  const us = holiday(newYorkYmd, US_CLOSED, "us");
  if (us) {
    reasons.push("us-holiday");
    holidays.push(us);
  }

  const early = holiday(newYorkYmd, US_EARLY, "us");
  const blockSpot = reasons.length > 0;
  const namesFa = holidays.map((item) => item.nameFa).join("، ");
  const namesEn = holidays.map((item) => item.nameEn).join(", ");

  return {
    tehranYmd,
    newYorkYmd,
    blockSpot,
    reasons,
    holidays,
    earlyClose: early,
    titleFa: blockSpot ? "امروز خرید اسپات توصیه نمی‌شود" : "تقویم معامله باز است",
    titleEn: blockSpot ? "No spot buy is recommended today" : "The trading calendar is open",
    reasonFa: blockSpot
      ? `امروز ${namesFa} است. میز فقط وقتی بورس نیویورک کامل بسته است خرید اسپات را نگه می‌دارد.`
      : "جمعه و تعطیل رسمی ایران دیگر خرید را نمی‌بندد. فقط تعطیلی کامل بورس نیویورک مانده است.",
    reasonEn: blockSpot
      ? `Today is ${namesEn}. The desk holds a spot buy only when the New York market is fully closed.`
      : "Fridays and Iranian public holidays no longer block a buy. Only a full NYSE close does.",
  };
}

function nextClosedDay(now: Date): Holiday | null {
  for (let i = 1; i <= 370; i++) {
    const probe = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
    const day = evaluate(probe);
    if (day.blockSpot && day.holidays[0]) return day.holidays[0];
  }
  return null;
}

export function sessionCalendar(now = new Date()): SessionDay {
  return { ...evaluate(now), nextClosed: nextClosedDay(now) };
}
