import type {
  CoinRow,
  DeskAction,
  HoldingInput,
  PositionAdvice,
  RebalanceDestination,
  RebalancePlan,
  BtcKillSwitch,
} from "./types.ts";

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
      reason: "این نماد در صد ارز اول اسکن‌شده نیست؛ بدون داده جفت BTC سیگنال خروج صادر نمی‌شود.",
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
      "کلید قطع بیت‌کوین فعال است؛ خرید اسپات معلق است و سرمایه باید به سمت بیت‌کوین بچرخد.",
      size,
      btc ?? null,
    );
  }

  if (broken || weakScore) {
    const dest =
      kill.status === "HIGH_RISK"
        ? (btc ?? targets[0] ?? null)
        : (targets[0] ?? btc ?? null);
    const why = broken
      ? "حمایت هفتگی ALT/BTC شکست؛ قدرت نسبی در برابر بیت‌کوین از دست رفته است."
      : `امتیاز مدل ${coin.score.toFixed(1)} زیر حد نصاب ${EXIT_SCORE} است.`;
    if (dest && dest.symbol !== coin.symbol) {
      return rotateTo("REBALANCE", `${why} پیشنهاد چرخش به ${dest.symbol}.`, size, dest);
    }
    return rotateTo("SELL", `${why} مقصد واجد شرایطی برای چرخش نماند؛ خروج پیشنهاد می‌شود.`, 0, null);
  }

  if (kill.status === "HIGH_RISK" && coin.symbol !== "BTC") {
    return rotateTo(
      "HOLD",
      "تز ورود هنوز سالم است، اما ریسک کلان بالا است و حجم پیشنهادی همین پوزیشن نصف می‌شود.",
      size * 0.5,
      null,
    );
  }

  if (coin.highDilution && coin.symbol !== "BTC") {
    const dest = targets[0] ?? btc ?? null;
    if (dest) {
      return rotateTo(
        "REBALANCE",
        `برچسب High Dilution Risk فعال است (${coin.unlockPenalty} امتیاز جریمه). چرخش به گزینه تمیزتر منطقی است.`,
        size,
        dest,
      );
    }
  }

  return rotateTo("HOLD", "امتیاز بالای حد نصاب است و حمایت هفتگی ALT/BTC نشکسته. نگهداری.", size, null);
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
            ? "پناهگاه وقتی کلید قطع یا قدرت نسبی می‌شکند"
            : "برترین گزینه واجد شرایط با امتیاز بالای ۶۸ و بدون جریمه رقیق‌سازی",
      });
    }
  }

  const destinations = [...bucket.values()].sort((a, b) => b.usd - a.usd);
  let note = "پایش روی پوزیشن‌های همین مرورگر است و سفارش واقعی ارسال نمی‌کند.";
  if (kill.status === "SUSPENDED") {
    note = "کلید قطع فعال است؛ آلت‌های داخل سبد پیشنهاد چرخش به بیت‌کوین دارند.";
  } else if (rotateUsd > 0) {
    note = "سرمایه ضعیف‌شده برای چرخش به مقصدهای واجد شرایط نشانه‌گذاری شد.";
  } else if (kill.status === "HIGH_RISK") {
    note = "ریسک کلان بالا است؛ پوزیشن‌های سالم با نصف حجم پیشنهادی نگه داشته می‌شوند.";
  }

  return { rows, destinations, rotateUsd, holdUsd, sellUsd, note };
}
