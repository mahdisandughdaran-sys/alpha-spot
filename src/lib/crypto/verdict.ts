import { msg } from "@/lib/i18n/lex";
import { candidateBases } from "./exclusions.ts";
import type { Horizon } from "./lens.ts";
import type { Opportunity } from "./opportunity.ts";
import { pickWinner } from "./scoring.ts";
import type { BtcKillSwitch, CoinRow, Regime, SpotVerdict, VerdictKind } from "./types.ts";

export type { SpotVerdict, VerdictKind };

export function verdictSentence(kind: VerdictKind): string {
  if (kind === "buy") return msg("الان این را بخر", "Buy this now");
  return msg("هیچ ارزی نخر", "Do not buy any coin");
}

function cashOut(fa: string, en: string): SpotVerdict {
  return {
    kind: "cash",
    symbol: null,
    name: null,
    priceUsd: null,
    reachUsd: null,
    invalidationUsd: null,
    reason: msg(fa, en),
  };
}

export function isListed(symbol: string, bases: Set<string> | null): boolean {
  if (!bases || bases.size === 0) return false;
  const upper = symbol.toUpperCase();
  if (bases.has(upper)) return true;
  return candidateBases(upper).some((base) => bases.has(base));
}

function opportunityFor(symbol: string, items: Opportunity[]): Opportunity | undefined {
  return items.find((item) => item.symbol === symbol);
}

function timingOpen(row: CoinRow, opp: Opportunity | undefined): boolean {
  if (!opp) return false;
  const inZone = opp.status === "in-zone" || opp.status === "confirmed" || opp.status === "actionable";
  if (!inZone) return false;
  if (row.rsi14 != null && row.rsi14 > 78) return false;
  if (row.distFrom30dHighPct != null && row.distFrom30dHighPct > -0.03) return false;
  return true;
}

function zonePrices(opp: Opportunity | undefined): { reach: number; kill: number } | null {
  const zone = opp?.zone;
  if (!zone || !(zone.invalidation > 0)) return null;
  if (opp.status === "invalidated") return null;
  const price = opp.priceUsd;
  const reach = price > zone.high ? zone.high : zone.low;
  if (!(reach > 0)) return null;
  return { reach, kill: zone.invalidation };
}

function buyReason(row: CoinRow, horizon: Horizon): string {
  if (horizon === "day") {
    return msg(
      "حکم یک‌روزه است و فقط ۲۴ ساعت معتبر می‌ماند. قدرت ۲۴ساعته با نقطه ورود هم‌خوان است؛ فردا این حرف می‌تواند عوض شود.",
      "This is a one-day call, valid for 24 hours. The 24-hour strength agrees with the entry; tomorrow this sentence may change.",
    );
  }
  if (horizon === "week") {
    return msg(
      "حکم یک‌هفته‌ای است و تا هفت روز عوض نمی‌شود، مگر قیمت حد ابطال را بشکند. قدرت نسبی ۷روزه و نقطه ورود هم‌خوان‌اند.",
      "This is a one-week call. It does not change for seven days unless price breaks invalidation. 7-day strength and the entry agree.",
    );
  }
  const weeklyFa =
    row.weeklyStructure === "bull"
      ? "ساختار هفتگی صعودی است"
      : row.weeklyStructure === "bear"
        ? "ساختار هفتگی نزولی است"
        : "ساختار هفتگی رنج است";
  const weeklyEn =
    row.weeklyStructure === "bull"
      ? "weekly structure is bullish"
      : row.weeklyStructure === "bear"
        ? "weekly structure is bearish"
        : "weekly structure is a range";
  const emaFa =
    row.aboveEma200 === true ? "بالای EMA۲۰۰" : row.aboveEma200 === false ? "زیر EMA۲۰۰" : "EMA۲۰۰ نامشخص";
  const emaEn =
    row.aboveEma200 === true ? "above the 200 EMA" : row.aboveEma200 === false ? "below the 200 EMA" : "200 EMA unknown";
  return msg(
    `حکم یک‌ماهه است و تا سی روز عوض نمی‌شود، مگر ساختار هفتگی یا EMA۲۰۰ بشکند. ${emaFa} و ${weeklyFa}.`,
    `This is a one-month call. It does not change for thirty days unless weekly structure or the 200 EMA breaks. ${emaEn}, and ${weeklyEn}.`,
  );
}

/**
 * One sentence. The estimated liquidation map is not an input.
 * Exchange-flow, stablecoin, and ETF figures are not invented here.
 */
export function buildVerdict(input: {
  ranked: CoinRow[];
  regime: Regime;
  kill: BtcKillSwitch;
  opportunities: Opportunity[];
  listed: Set<string> | null;
  horizon: Horizon;
}): SpotVerdict {
  if (input.kill.status === "SUSPENDED") {
    return cashOut(
      "هیچ ارزی نخر. کلید قطع بیت‌کوین فعال است و خرید اسپات بسته است.",
      "Do not buy any coin. The Bitcoin kill-switch is on and spot buys are closed.",
    );
  }

  const { pick, refused, viaSeasonRule } = pickWinner(input.ranked, input.regime, input.kill);
  if (refused || !pick) {
    return cashOut(
      refused
        ? "هیچ ارزی نخر. هیچ ارزی از فیلتر حجم، سقف ۳۰روزه و توکنومیکس رد نشد."
        : "هیچ ارزی نخر. از این داده انتخابی ساخته نشد.",
      refused
        ? "Do not buy any coin. No coin cleared the volume, 30-day-high, and tokenomics filters."
        : "Do not buy any coin. This tape did not produce a pick.",
    );
  }

  if (pick.symbol !== "BTC" && input.listed == null) {
    return cashOut(
      "هیچ ارزی نخر. فهرست تأیید نشد؛ خرید اسپات صادر نمی‌شود.",
      "Do not buy any coin. The exchange list was not confirmed, so no spot buy is issued.",
    );
  }

  if (pick.symbol !== "BTC" && !isListed(pick.symbol, input.listed)) {
    return cashOut(
      `هیچ ارزی نخر. ${pick.symbol} در صرافی انتخاب‌شده تأیید نشد.`,
      `Do not buy any coin. ${pick.symbol} is not confirmed on the selected exchange.`,
    );
  }

  const opp = opportunityFor(pick.symbol, input.opportunities);
  if (timingOpen(pick, opp)) {
    return {
      kind: "buy",
      symbol: pick.symbol,
      name: pick.name,
      priceUsd: pick.priceUsd,
      reachUsd: null,
      invalidationUsd: opp?.zone?.invalidation ?? null,
      reason: buyReason(pick, input.horizon),
    };
  }

  if (viaSeasonRule) {
    return cashOut(
      "هیچ ارزی نخر. در فصل بیت‌کوین فاصله با بیت‌کوین به ۳٫۵ امتیاز نرسید و خود بیت‌کوین هم در ناحیه خرید اسپات نیست.",
      "Do not buy any coin. In Bitcoin season the lead over Bitcoin was under 3.5 points, and Bitcoin itself is not in a spot buy zone.",
    );
  }

  const levels = zonePrices(opp);
  if (!levels) {
    return cashOut(
      "هیچ ارزی نخر. وقت خرید اسپات نیست؛ بهترین نام مجاز در محدوده خرید نیست.",
      "Do not buy any coin. It is not time for a spot buy; the best allowed name is not in a buy zone.",
    );
  }

  const rsiHot = pick.rsi14 != null && pick.rsi14 > 78;
  return {
    kind: "cash",
    symbol: null,
    name: null,
    priceUsd: null,
    reachUsd: levels.reach,
    invalidationUsd: levels.kill,
    reason: rsiHot
      ? msg(
          `هیچ ارزی نخر. وقت خرید اسپات نیست؛ RSI ${pick.symbol} روی ${pick.rsi14?.toFixed(0)} داغ است.`,
          `Do not buy any coin. It is not time for a spot buy; ${pick.symbol} RSI is ${pick.rsi14?.toFixed(0)} and hot.`,
        )
      : msg(
          `هیچ ارزی نخر. وقت خرید اسپات نیست؛ ${pick.symbol} هنوز به محدوده خرید نرسیده.`,
          `Do not buy any coin. It is not time for a spot buy; ${pick.symbol} is not in the buy zone yet.`,
        ),
  };
}
