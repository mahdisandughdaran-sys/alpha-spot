import type {
  CoinRow,
  DeskAction,
  HoldingInput,
  PositionAdvice,
  RebalanceDestination,
  RebalancePlan,
  BtcKillSwitch,
} from "./types.ts";
import { msg } from "@/lib/i18n/lex";

const EXIT_SCORE = 60;
const QUALIFIED_SCORE = 68;

function findCoin(coins: CoinRow[], symbol: string): CoinRow | undefined {
  const key = symbol.toUpperCase();
  return coins.find((c) => c.symbol === key);
}

function qualifiedTargets(coins: CoinRow[], except: string): CoinRow[] {
  return coins
    .filter(
      (c) =>
        c.symbol !== except &&
        c.symbol !== "BTC" &&
        c.score >= QUALIFIED_SCORE &&
        !c.highDilution &&
        c.buySignal === "open" &&
        c.volume24h >= 8_000_000 &&
        c.rank <= 100,
    )
    .sort((a, b) => b.score - a.score);
}

export function advisePosition(
  holding: HoldingInput,
  coins: CoinRow[],
  kill: BtcKillSwitch,
): PositionAdvice {
  const symbol = holding.symbol.toUpperCase();
  const coin = findCoin(coins, symbol);
  const btc = findCoin(coins, "BTC");
  const entry = holding.entryUsd;
  const pnlPct =
    coin && entry > 0 ? coin.priceUsd / entry - 1 : null;
  const size = Math.max(holding.sizeUsd, 0);

  const base = {
    symbol,
    name: coin?.name ?? symbol,
    score: coin?.score ?? null,
    priceUsd: coin?.priceUsd ?? null,
    pnlPct,
    pairSupportBroken: Boolean(coin && coin.symbol !== "BTC" && coin.pairSupportBroken),
    pairWeekly: coin?.pairWeekly ?? null,
    highDilution: coin?.highDilution ?? false,
  };

  if (!coin) {
    return {
      ...base,
      action: "HOLD",
      reason: msg(
        "این نماد در صد ارز اول اسکن‌شده نیست؛ بدون داده جفت BTC سیگنال خروج صادر نمی‌شود.",
        "This ticker is not in the top 100 scanned; without BTC-pair data, no exit signal is issued.",
      ),
      targetSymbol: null,
      targetName: null,
      suggestedSizeUsd: size,
    };
  }

  const broken = coin.symbol !== "BTC" && coin.pairSupportBroken;
  const weakScore = coin.score < EXIT_SCORE;
  const targets = qualifiedTargets(coins, coin.symbol);

  const rotateTo = (action: DeskAction, reason: string, suggested: number, dest: CoinRow | null) => ({
    ...base,
    action,
    reason,
    targetSymbol: dest?.symbol ?? null,
    targetName: dest?.name ?? null,
    suggestedSizeUsd: suggested,
  });

  if (kill.status === "SUSPENDED" && coin.symbol !== "BTC") {
    return rotateTo(
      "REBALANCE",
      msg(
        "کلید قطع بیت‌کوین فعال است؛ خرید اسپات معلق است و سرمایه باید به سمت بیت‌کوین بچرخد.",
        "The Bitcoin kill-switch is on; spot buys are suspended and capital should rotate toward Bitcoin.",
      ),
      size,
      btc ?? null,
    );
  }

  if (broken || weakScore) {
    const dest =
      kill.status === "HIGH_RISK"
        ? (btc ?? targets[0] ?? null)
        : (targets[0] ?? btc ?? null);
    const whyFa = broken
      ? "حمایت هفتگی ALT/BTC شکست؛ قدرت نسبی در برابر بیت‌کوین از دست رفته است."
      : `امتیاز مدل ${coin.score.toFixed(1)} زیر حد نصاب ${EXIT_SCORE} است.`;
    const whyEn = broken
      ? "Weekly ALT/BTC support broke; relative strength versus Bitcoin is lost."
      : `Model score ${coin.score.toFixed(1)} is below the ${EXIT_SCORE} floor.`;
    if (dest && dest.symbol !== coin.symbol) {
      return rotateTo(
        "REBALANCE",
        msg(`${whyFa} پیشنهاد چرخش به ${dest.symbol}.`, `${whyEn} Suggest rotating into ${dest.symbol}.`),
        size,
        dest,
      );
    }
    return rotateTo(
      "SELL",
      msg(
        `${whyFa} مقصد واجد شرایطی برای چرخش نماند؛ خروج پیشنهاد می‌شود.`,
        `${whyEn} No qualified destination is left for a rotation; an exit is suggested.`,
      ),
      0,
      null,
    );
  }

  if (kill.status === "HIGH_RISK" && coin.symbol !== "BTC") {
    return rotateTo(
      "HOLD",
      msg(
        "تز ورود هنوز سالم است، اما ریسک کلان بالا است و حجم پیشنهادی همین پوزیشن نصف می‌شود.",
        "The entry thesis is still intact, but macro risk is high and the suggested size of this position is halved.",
      ),
      size * 0.5,
      null,
    );
  }

  if (coin.highDilution && coin.symbol !== "BTC") {
    const dest = targets[0] ?? btc ?? null;
    if (dest) {
      return rotateTo(
        "REBALANCE",
        msg(
          `برچسب High Dilution Risk فعال است (${coin.unlockPenalty} امتیاز جریمه). چرخش به گزینه تمیزتر منطقی است.`,
          `The High Dilution Risk tag is active (${coin.unlockPenalty} point penalty). Rotating into a cleaner name makes sense.`,
        ),
        size,
        dest,
      );
    }
  }

  return rotateTo(
    "HOLD",
    msg(
      "امتیاز بالای حد نصاب است و حمایت هفتگی ALT/BTC نشکسته. نگهداری.",
      "The score is above the floor and weekly ALT/BTC support is intact. Hold.",
    ),
    size,
    null,
  );
}

export function buildRebalancePlan(
  holdings: HoldingInput[],
  coins: CoinRow[],
  kill: BtcKillSwitch,
): RebalancePlan {
  const rows = holdings.map((h) => advisePosition(h, coins, kill));
  const bucket = new Map<string, RebalanceDestination>();
  let rotateUsd = 0;
  let holdUsd = 0;
  let sellUsd = 0;

  for (const row of rows) {
    const held = holdings.find((h) => h.symbol.toUpperCase() === row.symbol);
    const size = held?.sizeUsd ?? 0;
    if (row.action === "HOLD") {
      holdUsd += row.suggestedSizeUsd;
      continue;
    }
    if (row.action === "SELL") {
      sellUsd += size;
      continue;
    }
    rotateUsd += size;
    if (!row.targetSymbol) {
      sellUsd += size;
      continue;
    }
    const prev = bucket.get(row.targetSymbol);
    const coin = findCoin(coins, row.targetSymbol);
    if (prev) prev.usd += size;
    else {
      bucket.set(row.targetSymbol, {
        symbol: row.targetSymbol,
        name: row.targetName ?? row.targetSymbol,
        score: coin?.score ?? 0,
        usd: size,
        reason:
          row.targetSymbol === "BTC"
            ? msg("پناهگاه وقتی کلید قطع یا قدرت نسبی می‌شکند", "A shelter when the kill-switch or relative strength breaks")
            : msg(
                "برترین گزینه واجد شرایط با امتیاز بالای ۶۸ و بدون جریمه رقیق‌سازی",
                "The top qualified name, scored above 68, with no dilution penalty",
              ),
      });
    }
  }

  const destinations = [...bucket.values()].sort((a, b) => b.usd - a.usd);
  let note = msg(
    "پایش روی پوزیشن‌های همین مرورگر است و سفارش واقعی ارسال نمی‌کند.",
    "This watch covers positions in this browser only and does not send a live order.",
  );
  if (kill.status === "SUSPENDED") {
    note = msg(
      "کلید قطع فعال است؛ آلت‌های داخل سبد پیشنهاد چرخش به بیت‌کوین دارند.",
      "The kill-switch is on; alts in the book are flagged to rotate into Bitcoin.",
    );
  } else if (rotateUsd > 0) {
    note = msg(
      "سرمایه ضعیف‌شده برای چرخش به مقصدهای واجد شرایط نشانه‌گذاری شد.",
      "Weakened capital was flagged to rotate into qualified destinations.",
    );
  } else if (kill.status === "HIGH_RISK") {
    note = msg(
      "ریسک کلان بالا است؛ پوزیشن‌های سالم با نصف حجم پیشنهادی نگه داشته می‌شوند.",
      "Macro risk is high; healthy positions are kept at half the suggested size.",
    );
  }

  return { rows, destinations, rotateUsd, holdUsd, sellUsd, note };
}
