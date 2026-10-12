import { clamp } from "./math.ts";
import type { BuySignal, CoinRow, WeeklyStructure } from "./types.ts";

/** Higher means more pressure. Separate from the spot score, where higher is better. */
export type RiskTone = "low" | "mid" | "high";

export type RiskSliceKey = "liquidity" | "unlock" | "beta";

export type RiskSlice = {
  key: RiskSliceKey;
  label: string;
  short: string;
  value: number;
  formula: string;
  detail: string;
};

export type RiskView = {
  composite: number;
  tone: RiskTone;
  toneLabel: string;
  headline: string;
  slices: RiskSlice[];
};

export type RiskInput = {
  symbol: string;
  beta: number | null;
  turnover: number;
  volume24h: number;
  hasBtcPair: boolean;
  unlockPct30d: number | null;
  unlockPenalty: number;
  unlockDays: number | null;
  unlockCliff: boolean;
  factors: { key: string; score: number }[];
};

export type FilterableCoin = RiskInput & {
  score: number;
  highDilution: boolean;
  buySignal: BuySignal;
  rank: number;
  weeklyStructure: WeeklyStructure | null;
  aboveEma200: boolean | null;
};

export type DeskFilter = "all" | "unlock" | "rebalance" | "btc-cycle";

const TONE_LABEL: Record<RiskTone, string> = {
  low: "کم‌ریسک",
  mid: "ریسک متوسط",
  high: "ریسک بالا",
};

export function riskTone(value: number): RiskTone {
  if (value < 35) return "low";
  if (value < 65) return "mid";
  return "high";
}

function roundRisk(n: number): number {
  return Math.round(clamp(n, 0, 100));
}

export function unlockExplain(row: RiskInput): string {
  if (row.symbol === "BTC") {
    return "بیت‌کوین برنامه آزادسازی ندارد و جریمه آنلاک نمی‌گیرد.";
  }
  if (row.unlockPct30d == null) {
    return "تقویم آزادسازی برای این نماد ثبت نشده، پس جریمه‌ای کسر نشده است.";
  }
  if (row.unlockPct30d > 80) {
    return `رقم آزادسازی ${row.unlockPct30d.toFixed(0)}٪ از عرضه گذشته است. این معمولاً خطای واحد در تقویم است، نه فروش واقعی این‌قدر بزرگ. هشدار زنده برای ارقام بالای ۸۰٪ ساخته نمی‌شود.`;
  }
  const pct = row.unlockPct30d.toFixed(2);
  const when =
    row.unlockDays == null
      ? ""
      : row.unlockDays <= 2
        ? ` نزدیک‌ترین رویداد تا ${row.unlockDays * 24} ساعت دیگر است.`
        : ` نزدیک‌ترین رویداد ${row.unlockDays} روز دیگر است.`;
  const cliff = row.unlockCliff
    ? " حداقل یک روز کلیف‌مانند دیده شده: بیش از ۱٪ عرضه در یک روز."
    : "";
  if (row.unlockPenalty > 0) {
    return `جریمه ${row.unlockPenalty} امتیاز به‌دلیل آزادسازی ${pct}٪ از کل عرضه در ۳۰ روز آینده.${when} آستانه مدل: بیش از ۳٪ عرضه ۱۵ امتیاز، بیش از ۵٪ هجده امتیاز، و بیش از ۸٪ بیست امتیاز کم می‌کند.${cliff}`;
  }
  return `جریمه آنلاک صفر است. آزادسازی ۳۰ روز ${pct}٪ است و زیر آستانه ۳٪ مانده.${when}${cliff}`;
}

function liquidityRisk(row: RiskInput): number {
  const factor = row.factors.find((item) => item.key === "liquidity");
  if (factor) return roundRisk(100 - factor.score);
  let score = 55;
  if (row.turnover >= 0.02) score -= 25;
  else if (row.turnover < 0.008) score += 20;
  if (row.volume24h < 8_000_000) score += 15;
  if (!row.hasBtcPair) score += 10;
  return roundRisk(score);
}

function unlockPressure(row: RiskInput): number {
  if (row.symbol === "BTC" || row.unlockPct30d == null || row.unlockPct30d > 80) return 0;
  return roundRisk((row.unlockPct30d / 8) * 100);
}

function betaExposure(row: RiskInput): number {
  if (row.symbol === "BTC") return 15;
  if (row.beta == null) return 50;
  return roundRisk((row.beta / 2) * 100);
}

export function buildRiskView(row: RiskInput): RiskView {
  const liquidity = liquidityRisk(row);
  const unlock = unlockPressure(row);
  const beta = betaExposure(row);
  const unlockKnown = row.symbol === "BTC" || (row.unlockPct30d != null && row.unlockPct30d <= 80);
  const liqWeight = unlockKnown ? 0.4 : 0.62;
  const unlockWeight = unlockKnown ? 0.35 : 0;
  const betaWeight = unlockKnown ? 0.25 : 0.38;
  const composite = roundRisk(liqWeight * liquidity + unlockWeight * unlock + betaWeight * beta);
  const tone = riskTone(composite);
  const volM = row.volume24h / 1e6;
  const slices: RiskSlice[] = [
    {
      key: "liquidity",
      label: "ریسک نقدینگی",
      short: "نقدینگی",
      value: liquidity,
      formula: "۱۰۰ منهای امتیاز نقدینگی مدل. امتیاز از حجم ۲۴ساعته، گردش نسبت به مارکت‌کپ، و جفت واقعی BTC ساخته می‌شود.",
      detail: `حجم ۲۴ساعته ${volM.toFixed(0)} میلیون دلار و گردش ${(row.turnover * 100).toFixed(2)}٪ مارکت‌کپ. نوار بالاتر یعنی خروج سخت‌تر است.${row.hasBtcPair ? " جفت BTC روی بایننس هست." : " جفت BTC مستقیم روی بایننس نیست."}`,
    },
    {
      key: "unlock",
      label: "فشار فروش آنلاک",
      short: "آنلاک",
      value: unlock,
      formula: "حداقل ۱۰۰ و (درصد آزادسازی ۳۰ روز ÷ ۸ × ۱۰۰). هشت درصد عرضه، نوار را پر می‌کند.",
      detail: unlockExplain(row),
    },
    {
      key: "beta",
      label: "حساسیت به بیت‌کوین",
      short: "بیت‌کوین",
      value: beta,
      formula:
        row.symbol === "BTC"
          ? "خود بیت‌کوین معیار بازار است. این نوار روی ۱۵ ثابت است تا هم‌حرکتی با خودش به‌اشتباه ریسک اضافه حساب نشود."
          : "حداقل ۱۰۰ و (بتا ÷ ۲ × ۱۰۰). بتا ۱ یعنی هم‌حرکت با بازار و بتا ۲ نوار را پر می‌کند. این همبستگی آماری دقیق نیست؛ پروکسی بتای مدل است.",
      detail:
        row.symbol === "BTC"
          ? "بیت‌کوین پناهگاه اسپات مدل است، نه یک آلت با بتای بالا."
          : row.beta == null
            ? "بتا برای این نماد محاسبه نشد؛ نوار روی ۵۰، یعنی نامعلوم، مانده است."
            : `بتای فعلی ${row.beta.toFixed(2)} است. نوار ${beta}٪ یعنی حساسیت نسبی به حرکت بازار.`,
    },
  ];
  const mix = unlockKnown
    ? "۴۰٪ نقدینگی، ۳۵٪ آنلاک، ۲۵٪ حساسیت به بیت‌کوین"
    : "بدون تقویم آنلاک: ۶۲٪ نقدینگی و ۳۸٪ حساسیت به بیت‌کوین";
  return {
    composite,
    tone,
    toneLabel: TONE_LABEL[tone],
    headline: `فشار ریسک ${composite}. ${mix}. زیر ۳۵ کم‌ریسک، تا ۶۵ هشدار، و از ۶۵ به بالا پرریسک است. این عدد برعکس امتیاز اسپات است: اینجا بالاتر خطرناک‌تر است.`,
    slices,
  };
}

export function applyDeskFilter<T extends FilterableCoin>(rows: T[], filter: DeskFilter): T[] {
  if (filter === "unlock") {
    return [...rows].sort((a, b) => {
      const pressure = unlockPressure(b) - unlockPressure(a);
      if (pressure !== 0) return pressure;
      return b.unlockPenalty - a.unlockPenalty;
    });
  }
  if (filter === "rebalance") {
    return rows
      .filter(
        (row) =>
          row.score >= 68 &&
          !row.highDilution &&
          row.buySignal === "open" &&
          row.volume24h >= 8_000_000 &&
          row.rank <= 100,
      )
      .sort((a, b) => b.score - a.score);
  }
  if (filter === "btc-cycle") {
    return rows
      .filter((row) => {
        const calm = row.symbol === "BTC" || (row.beta != null && row.beta < 1.35);
        const trendOk = row.weeklyStructure !== "bear" && (row.aboveEma200 !== false || row.symbol === "BTC");
        return calm && trendOk && row.buySignal !== "suspended" && buildRiskView(row).composite < 50;
      })
      .sort((a, b) => buildRiskView(a).composite - buildRiskView(b).composite);
  }
  return rows;
}

export type DeskAlertItem = {
  id: string;
  tone: RiskTone;
  text: string;
};

export function deskAlerts(
  rows: RiskInput[],
  kill?: { status: string; headline: string; note: string },
): DeskAlertItem[] {
  const items: DeskAlertItem[] = [];
  if (kill && kill.status !== "NORMAL") {
    items.push({
      id: `kill:${kill.status}`,
      tone: kill.status === "SUSPENDED" ? "high" : "mid",
      text: `${kill.headline} ${kill.note}`,
    });
  }
  const ranked = [...rows].sort((a, b) => (a.unlockDays ?? 99) - (b.unlockDays ?? 99));
  for (const row of ranked) {
    if (row.symbol === "BTC" || row.unlockDays == null || row.unlockPct30d == null) continue;
    if (!(row.unlockPct30d >= 1) || row.unlockPct30d > 80) continue;
    if (row.unlockDays <= 2) {
      const window = row.unlockDays <= 1 ? "۲۴ ساعت" : "۴۸ ساعت";
      items.push({
        id: `unlock:${row.symbol}:${row.unlockDays}`,
        tone: "high",
        text: `توکن ${row.symbol} تا ${window} دیگر رویداد آزادسازی دارد و ${row.unlockPct30d.toFixed(1)}٪ از عرضه در ۳۰ روز آینده خارج می‌شود.`,
      });
    } else if (row.unlockPenalty > 0 && row.unlockDays <= 7) {
      items.push({
        id: `unlock:${row.symbol}:${row.unlockDays}`,
        tone: "mid",
        text: `توکن ${row.symbol} تا ${row.unlockDays} روز دیگر آزادسازی دارد؛ ${row.unlockPct30d.toFixed(1)}٪ عرضه در ۳۰ روز و جریمه ${row.unlockPenalty} امتیاز.`,
      });
    }
  }
  return items.slice(0, 4);
}

export function riskViewOfRow(row: CoinRow): RiskView {
  return buildRiskView(row);
}
