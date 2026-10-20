import { decideBook, type SpotBook } from "./book.ts";
import { msg } from "@/lib/i18n/lex";
import type { BtcKillSwitch, CoinRow, Regime, Sleeve, SleeveLeg } from "./types.ts";
import type { Opportunity } from "./opportunity.ts";

function legFrom(input: {
  symbol: string;
  name: string;
  weight: number;
  score: number;
  rank: number;
  reason: string;
}): SleeveLeg {
  return {
    symbol: input.symbol,
    name: input.name,
    rank: input.rank,
    weight: input.weight,
    score: input.score,
    reason: input.reason,
  };
}

export function portfolioFromBook(book: SpotBook, ranked: CoinRow[]): Sleeve[] {
  const find = (symbol: string) => ranked.find((row) => row.symbol === symbol);
  const btc = find("BTC");
  const core = book.campaigns.find((row) => row.sleeve === "core" && row.weight > 0);
  const satellites = book.campaigns.filter((row) => row.sleeve === "satellite" && row.status === "open");
  const cash = book.campaigns.find((row) => row.sleeve === "cash" && row.weight > 0);

  const coreLegs: SleeveLeg[] = [];
  if (core && core.weight > 0) {
    coreLegs.push(
      legFrom({
        symbol: "BTC",
        name: btc?.name ?? "Bitcoin",
        weight: core.weight,
        score: btc?.score ?? 0,
        rank: btc?.rank ?? 1,
        reason: core.reason,
      }),
    );
  }

  const satelliteLegs = satellites.map((row) => {
    const coin = find(row.symbol);
    return legFrom({
      symbol: row.symbol,
      name: row.name,
      weight: row.weight,
      score: coin?.score ?? 0,
      rank: coin?.rank ?? 0,
      reason: row.reason,
    });
  });

  const cashLegs: SleeveLeg[] = [];
  if (cash && cash.weight > 0) {
    cashLegs.push(
      legFrom({
        symbol: "USDT",
        name: "Tether",
        weight: cash.weight,
        score: 0,
        rank: 0,
        reason: cash.reason,
      }),
    );
  }

  return [
    {
      key: "core",
      title: "هسته · بیت‌کوین",
      targetPct: Math.round(book.coreWeight * 100),
      note:
        book.mode === "cash"
          ? "کلید قطع روشن است. هسته هم در تتر است، نه در بیت‌کوین."
          : "هر روز بالای میانگین ۲۰۰روزه با ساختار هفتگی سالم، بخش اصلی دفتر بیت‌کوین است. نزدیکی به سقف دلیل خروج نیست.",
      legs: coreLegs,
    },
    {
      key: "large",
      title: "قمر · حداکثر دو نام",
      targetPct: Math.round(book.satelliteWeight * 100),
      note: book.satelliteEarned
        ? msg(
            "فقط وقتی هسته روشن است، دامیننس می‌افتد، جفت بالای میانگین خودش است، و وتو نخورده. روی هم کمتر از یک‌سوم.",
            "Only while the core is on, dominance is falling, the pair is above its own average, and no veto fired. Together, under one third.",
          )
        : msg(
            "قمر به میز وصل نیست. این آستین آلت نمی‌خرد، حتی اگر بک‌تست خط پایه را برده باشد. آن عدد آزمایش است، نه اجازه.",
            "The satellite is not wired to the desk. This sleeve does not buy an alt, even if the backtest beat the baseline. That number is an experiment, not permission.",
          ),
      legs: satelliteLegs,
    },
    {
      key: "mid",
      title: "نقد · فقط کلید قطع",
      targetPct: Math.round(book.cashWeight * 100),
      note: "زیر میانگین ۲۰۰روزه و ساختار هفتگی شکسته، تنها جایی است که دفتر به تتر می‌رود. RSI داغ و کم بودن امتیاز اینجا نیستند.",
      legs: cashLegs,
    },
  ];
}

export function buildPortfolio(
  ranked: CoinRow[],
  _regime: Regime,
  kill?: BtcKillSwitch,
  extra?: {
    dominance?: number | null;
    dominancePrev?: number | null;
    opportunities?: Opportunity[];
    listed?: Set<string> | null;
    satelliteEarned?: boolean;
    pauseSatellites?: boolean;
  },
): Sleeve[] {
  const fallback = {
    status: "NORMAL",
    active: false,
    aboveEma200: true,
    ema200: null,
    priceUsd: ranked.find((row) => row.symbol === "BTC")?.priceUsd ?? 0,
    distanceToEma: null,
    weeklyStructure: "bull",
    weeklyMomentum: null,
    severeWeekly: false,
    weeklySupportBroken: false,
    sizeMultiplier: 1,
    spotBuys: "open",
    headline: "",
    note: "",
  } as BtcKillSwitch;
  const book = decideBook({
    ranked,
    kill: kill ?? fallback,
    dominance: extra?.dominance ?? null,
    dominancePrev: extra?.dominancePrev ?? null,
    opportunities: extra?.opportunities ?? [],
    listed: extra?.listed === undefined ? null : extra.listed,
    satelliteEarned: extra?.satelliteEarned ?? false,
    pauseSatellites: extra?.pauseSatellites ?? false,
  });
  return portfolioFromBook(book, ranked);
}

export function sleeveTotal(sleeves: Sleeve[]): number {
  return sleeves.reduce(
    (s, sl) => s + sl.legs.reduce((a, l) => a + l.weight, 0),
    0,
  );
}
