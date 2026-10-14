import { msg } from "@/lib/i18n/lex";
import { candidateBases } from "./exclusions.ts";
import type { Horizon } from "./lens.ts";
import type { Opportunity } from "./opportunity.ts";
import { pickWinner } from "./scoring.ts";
import type { BtcKillSwitch, CoinRow, Regime, SpotVerdict, VerdictKind } from "./types.ts";

export type { SpotVerdict, VerdictKind };

export function verdictSentence(kind: VerdictKind): string {
  if (kind === "buy") return msg("الان این را بخر", "Buy this now");
  if (kind === "wait") {
    return msg(
      "این بهترین نام است ولی هنوز وقت خریدش نیست",
      "This is the best name, but it is not time to buy it yet",
    );
  }
  return msg("الان هیچ آلتی نخر؛ بیت‌کوین بماند", "Do not buy any alt now; stay in Bitcoin");
}

function stay(reason: string): SpotVerdict {
  return {
    kind: "stay",
    symbol: null,
    name: null,
    priceUsd: null,
    reachUsd: null,
    invalidationUsd: null,
    reason,
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
  if (horizon === "week") {
    return msg(
      `قدرت نسبی ۷روزه و نقطهٔ ورود هم‌خوان‌اند و قیمت داخل محدوده است.`,
      `7-day relative strength and the entry line up, and the price is inside the buy zone.`,
    );
  }
  const weekly =
    row.weeklyStructure === "bull"
      ? msg("ساختار هفتگی صعودی است", "Weekly structure is bullish")
      : row.weeklyStructure === "bear"
        ? msg("ساختار هفتگی نزولی است", "Weekly structure is bearish")
        : msg("ساختار هفتگی رنج است", "Weekly structure is a range");
  const ema =
    row.aboveEma200 === true
      ? msg("بالای EMA۲۰۰", "above the 200 EMA")
      : row.aboveEma200 === false
        ? msg("زیر EMA۲۰۰", "below the 200 EMA")
        : msg("EMA۲۰۰ نامشخص", "200 EMA unknown");
  return msg(
    `افق یک‌ماهه: بازده ۳۰روزه، ${ema} و ${weekly}.`,
    `One-month horizon: the 30-day return, ${ema}, and ${weekly}.`,
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
    return stay(
      msg(
        "کلید قطع بیت‌کوین فعال است؛ هیچ آلتی خریده نمی‌شود.",
        "The Bitcoin kill-switch is on; no alt is bought.",
      ),
    );
  }

  const { pick, refused, viaSeasonRule } = pickWinner(input.ranked, input.regime, input.kill);
  if (refused || !pick || viaSeasonRule) {
    return stay(
      refused
        ? msg(
            "هیچ ارزی از فیلتر حجم، سقف ۳۰روزه و توکنومیکس رد نشد.",
            "No coin cleared the volume, 30-day-high, and tokenomics filters.",
          )
        : msg(
            "در فصل بیت‌کوین فاصله با بیت‌کوین به ۳٫۵ امتیاز نرسید.",
            "In Bitcoin season the lead over Bitcoin was under 3.5 points.",
          ),
    );
  }

  if (pick.symbol !== "BTC" && input.listed == null) {
    return stay(
      msg(
        "فهرست تأیید نشد؛ خرید آلت صادر نمی‌شود.",
        "The exchange list was not confirmed, so no alt buy is issued.",
      ),
    );
  }

  if (pick.symbol !== "BTC" && !isListed(pick.symbol, input.listed)) {
    return stay(
      msg(
        `${pick.symbol} در صرافی انتخاب‌شده تأیید نشد، پس خرید آلت صادر نمی‌شود.`,
        `${pick.symbol} is not confirmed on the selected exchange, so no alt buy is issued.`,
      ),
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
      invalidationUsd: null,
      reason: buyReason(pick, input.horizon),
    };
  }

  const levels = zonePrices(opp);
  if (!levels) {
    return stay(
      msg(
        "بهترین نام مجاز در محدودهٔ خرید نیست و سطح عددی رسیدن و ابطال هم در داده نیست.",
        "The best allowed name is not in a buy zone, and the tape has no numeric reach or invalidation.",
      ),
    );
  }

  const rsiHot = pick.rsi14 != null && pick.rsi14 > 78;
  return {
    kind: "wait",
    symbol: pick.symbol,
    name: pick.name,
    priceUsd: pick.priceUsd,
    reachUsd: levels.reach,
    invalidationUsd: levels.kill,
    reason: rsiHot
      ? msg(
          `RSI ${pick.rsi14?.toFixed(0)} بالای ۷۸ است؛ تا برگشت از اشباع خریده نمی‌شود.`,
          `RSI ${pick.rsi14?.toFixed(0)} is above 78; it is not bought until that cools.`,
        )
      : msg(
          "قیمت هنوز به محدودهٔ خرید یا تأیید نرسیده است.",
          "Price is not in the buy zone and is not confirmed.",
        ),
  };
}
