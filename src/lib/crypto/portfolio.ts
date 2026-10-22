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
      title: msg("بیت‌کوین", "Bitcoin"),
      targetPct: Math.round(book.coreWeight * 100),
      note:
        book.mode === "cash"
          ? msg(
              "روند بیت‌کوین شکسته است. حتی خود بیت‌کوین در تتر است، نه در بازار.",
              "Bitcoin’s trend is broken. Even Bitcoin is held as tether, not in the market.",
            )
          : book.plan.phase === "defend"
            ? msg(
                "فقط دیده‌بان. بقیه دفتر نقد است تا ریزش ادامه پیدا کند بدون اینکه تمام سرمایه داخلش باشد.",
                "Scout only. The rest of the book is cash so a continuing drop is not fully held.",
              )
            : msg(
                "روند سالم است و آلت رهبری نمی‌کند، یا هنوز نامی برای آستین آلت واجد شرایط نشده. این بخش بیت‌کوین است.",
                "The trend is healthy and alts are not leading, or no name has qualified for the alt sleeve yet. This sleeve is Bitcoin.",
              ),
      legs: coreLegs,
    },
    {
      key: "large",
      title: msg("آلت لیدر", "Leading alts"),
      targetPct: Math.round(book.satelliteWeight * 100),
      note: msg(
        "حداکثر دو نام نقدشونده. فقط وقتی روند بیت‌کوین سالم است. در فصل کامل با ساختار جفت وارد می‌شود؛ در شروع چرخش باید داخل محدوده باشد. هر نام حداکثر حدود یک‌سوم دفتر است.",
        "At most two liquid names. Only while Bitcoin’s trend is healthy. A full season can enter on pair structure; an early rotation must be inside the zone. Each name is at most about a third of the book.",
      ),
      legs: satelliteLegs,
    },
    {
      key: "mid",
      title: msg("نقد", "Cash"),
      targetPct: Math.round(book.cashWeight * 100),
      note: msg(
        "نقد وقتی است که روند بیت‌کوین می‌شکند، یا یکی از ستون‌ها خراب است و فقط دیده‌بان مانده. RSI داغ دلیل نقد شدن نیست.",
        "Cash is for a broken Bitcoin trend, or for one broken pillar where only a scout remains. A hot RSI is not a reason to go to cash.",
      ),
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
    regime: _regime,
  });
  return portfolioFromBook(book, ranked);
}

export function sleeveTotal(sleeves: Sleeve[]): number {
  return sleeves.reduce(
    (s, sl) => s + sl.legs.reduce((a, l) => a + l.weight, 0),
    0,
  );
}
