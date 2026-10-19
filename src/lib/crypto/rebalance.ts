import type {
  CoinRow,
  DeskAction,
  HoldingInput,
  PositionAdvice,
  RebalanceDestination,
  RebalancePlan,
  BtcKillSwitch,
} from "./types.ts";
import { bookMode } from "./book.ts";
import { msg } from "@/lib/i18n/lex";

function findCoin(coins: CoinRow[], symbol: string): CoinRow | undefined {
  const key = symbol.toUpperCase();
  return coins.find((c) => c.symbol === key);
}

function sentence(fa: string, en: string): string {
  return msg(fa, en);
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
  const price = coin?.priceUsd ?? null;
  const pnlPct = coin && entry > 0 ? coin.priceUsd / entry - 1 : null;
  const size = Math.max(holding.sizeUsd, 0);
  const mode = bookMode(kill);
  const underwater = pnlPct != null && pnlPct < 0;

  const base = {
    symbol,
    name: coin?.name ?? symbol,
    score: coin?.score ?? null,
    priceUsd: price,
    pnlPct,
    pairSupportBroken: Boolean(coin && coin.symbol !== "BTC" && coin.pairSupportBroken),
    pairWeekly: coin?.pairWeekly ?? null,
    highDilution: coin?.highDilution ?? false,
  };

  const hold = (reason: string, suggested = size): PositionAdvice => ({
    ...base,
    action: "HOLD",
    reason,
    targetSymbol: null,
    targetName: null,
    suggestedSizeUsd: underwater ? Math.min(suggested, size) : suggested,
  });

  const exitTo = (
    action: DeskAction,
    reason: string,
    dest: { symbol: string; name: string } | null,
  ): PositionAdvice => ({
    ...base,
    action,
    reason,
    targetSymbol: dest?.symbol ?? null,
    targetName: dest?.name ?? null,
    suggestedSizeUsd: 0,
  });

  if (!coin && symbol !== "USDT") {
    return hold(
      sentence(
        "این نماد در صد ارز اول اسکن‌شده نیست. بدون داده، به بازنده اضافه نمی‌شود و به خاطر امتیاز هم فروخته نمی‌شود.",
        "This ticker is not in the top 100 scanned. Without data it is not averaged down, and it is not sold because of a score.",
      ),
    );
  }

  if (mode === "cash") {
    return exitTo(
      "SELL",
      sentence(
        "کلید قطع روشن است. کمپین بسته می‌شود و مقصد تتر است، نه آلت بعدی.",
        "The kill switch is on. The campaign closes and the destination is tether, not the next alt.",
      ),
      null,
    );
  }

  if (symbol === "BTC") {
    return hold(
      sentence(
        "بیت‌کوین هسته است. افت امتیاز یا RSI داغ دلیل فروش نیست. خروج فقط با کلید قطع.",
        "Bitcoin is the core. A lower score or a hot RSI is not a sale. The exit is only the kill switch.",
      ),
    );
  }

  const invalidated =
    holding.invalidationUsd != null &&
    price != null &&
    price > 0 &&
    price <= holding.invalidationUsd;
  const structureBroke = Boolean(coin?.pairSupportBroken);

  if (invalidated || structureBroke) {
    const why = invalidated
      ? sentence(
          "قیمت به ابطالِ قفل‌شده در روز ورود رسید. به بازنده اضافه نکن.",
          "Price hit the invalidation locked on the entry day. Do not add to the loser.",
        )
      : sentence(
          "ساختار هفتگی جفت با بیت‌کوین شکست. این خروج است، نه چرخش به آلتی که امروز امتیازش بالاتر است.",
          "Weekly structure of the Bitcoin pair broke. This is an exit, not a rotation into whichever alt scores higher today.",
        );
    if (mode === "core" && btc) {
      return exitTo("REBALANCE", why, { symbol: btc.symbol, name: btc.name });
    }
    return exitTo("SELL", why, null);
  }

  return hold(
    sentence(
      "کمپین باز است. جابه‌جایی امتیاز فردا دلیل فروش نیست و حجم روی ضرر بیشتر نمی‌شود.",
      "The campaign is open. Tomorrow’s score moving is not a sale, and size does not increase on a loss.",
    ),
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
      holdUsd += size;
      continue;
    }
    if (row.action === "SELL" || !row.targetSymbol) {
      sellUsd += size;
      continue;
    }
    rotateUsd += size;
    const prev = bucket.get(row.targetSymbol);
    const coin = findCoin(coins, row.targetSymbol);
    if (prev) prev.usd += size;
    else {
      bucket.set(row.targetSymbol, {
        symbol: row.targetSymbol,
        name: row.targetName ?? row.targetSymbol,
        score: coin?.score ?? 0,
        usd: size,
        reason: sentence(
          "برگشت به هسته بعد از ابطال کمپین. مقصد، آلتِ رتبهٔ بعد نیست.",
          "Back to the core after the campaign was invalidated. The destination is not the next-ranked alt.",
        ),
      });
    }
  }

  const destinations = [...bucket.values()].sort((a, b) => b.usd - a.usd);
  const mode = bookMode(kill);
  let note = sentence(
    "پایش همین مرورگر است و سفارش نمی‌فرستد. خروج فقط با ابطال قفل‌شده، شکست ساختار هفتگی جفت، یا کلید قطع.",
    "This watch lives in this browser and sends no order. An exit happens only on the locked invalidation, a weekly pair-structure break, or the kill switch.",
  );
  if (mode === "cash") {
    note = sentence(
      "کلید قطع روشن است. آلت و بیت‌کوین هر دو به تتر پیشنهاد می‌شوند.",
      "The kill switch is on. Both alts and Bitcoin are flagged for tether.",
    );
  } else if (rotateUsd > 0) {
    note = sentence(
      "کمپینِ باطل‌شده به هستهٔ بیت‌کوین برمی‌گردد. امتیاز پایین‌تر چرخش نمی‌سازد.",
      "An invalidated campaign returns to the Bitcoin core. A lower score does not rotate the book.",
    );
  }

  return { rows, destinations, rotateUsd, holdUsd, sellUsd, note };
}
