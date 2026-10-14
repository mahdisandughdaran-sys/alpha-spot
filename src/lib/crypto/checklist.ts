import { msg } from "@/lib/i18n/lex";
import type {
  AnalysisResult,
  BookCheck,
  BtcKillSwitch,
  CheckItem,
  CoinRow,
  DominanceBias,
  Regime,
} from "./types.ts";

export function buildChecklist(
  pick: CoinRow,
  ctx: {
    regime: Regime;
    btcDominance: number | null;
    dominanceBias: DominanceBias;
    kill?: BtcKillSwitch;
    book?: BookCheck;
  },
): CheckItem[] {
  const mcOk =
    pick.symbol === "BTC" || pick.symbol === "ETH"
      ? true
      : pick.mcFdv == null
        ? null
        : pick.mcFdv >= 0.7;

  const pairOk =
    pick.symbol === "BTC"
      ? ctx.regime !== "alt"
      : pick.weeklyStructure === "bull" || (pick.rs7d > 0 && pick.rs30d != null && pick.rs30d > 0);

  const domOk =
    ctx.dominanceBias === "falling" || ctx.dominanceBias === "resistance"
      ? true
      : ctx.dominanceBias === "rising"
        ? pick.symbol === "BTC"
        : null;

  const liqOk = pick.turnover >= 0.02;
  const emaOk = pick.aboveEma200;

  const items: CheckItem[] = [
    {
      key: "mcfdv",
      label: msg("نسبت MC / FDV", "MC / FDV ratio"),
      desired: msg("ترجیحاً بالای ۰٫۷", "Preferably above 0.7"),
      ok: mcOk,
      detail:
        pick.mcFdv == null
          ? msg("سقف عرضه در داده نبود.", "The supply cap was missing from the data.")
          : msg(
              `MC/FDV ${(pick.mcFdv * 100).toFixed(0)}٪`,
              `MC/FDV ${(pick.mcFdv * 100).toFixed(0)}%`,
            ),
    },
    {
      key: "pair",
      label: msg("نمودار ALT/BTC", "ALT/BTC chart"),
      desired: msg("روند صعودی یا شکست مقاومت", "Uptrend or a resistance break"),
      ok: pairOk,
      detail:
        pick.symbol === "BTC"
          ? msg("خود بیت‌کوین معیار است.", "Bitcoin itself is the benchmark.")
          : pick.weeklyStructure === "bull"
            ? msg("ساختار هفتگی جفت/دلار صعودی است.", "Weekly pair/dollar structure is bullish.")
            : pick.rs7d > 0
              ? msg("قدرت نسبی ۷ روزه مثبت است.", "7-day relative strength is positive.")
              : msg("جفت بیت‌کوین هنوز شکست معتبر ندارد.", "The Bitcoin pair still has no valid breakout."),
    },
    {
      key: "dom",
      label: msg("دامیننس بیت‌کوین", "Bitcoin dominance"),
      desired: msg("کاهشی یا برخورد به مقاومت", "Falling, or a test of resistance"),
      ok: domOk,
      detail:
        ctx.btcDominance == null
          ? msg(
              `دامیننس در این منبع نبود · رژیم ${ctx.regime}`,
              `Dominance was not in this source · regime ${ctx.regime}`,
            )
          : msg(
              `دامیننس ${ctx.btcDominance.toFixed(1)}٪ · رژیم ${ctx.regime}`,
              `Dominance ${ctx.btcDominance.toFixed(1)}% · regime ${ctx.regime}`,
            ),
    },
    {
      key: "liq",
      label: msg("حجم و عمق نقدشوندگی", "Volume and liquidity depth"),
      desired: msg("حجم روزانه بالای ۲٪ مارکت‌کپ", "Daily volume above 2% of market cap"),
      ok: liqOk,
      detail: msg(
        `گردش ${(pick.turnover * 100).toFixed(2)}٪ از مارکت‌کپ`,
        `Turnover ${(pick.turnover * 100).toFixed(2)}% of market cap`,
      ),
    },
    {
      key: "ema",
      label: msg("وضعیت تکنیکال دلاری", "Dollar technical state"),
      desired: msg("بالای EMA ۲۰۰ روزانه / فاز انباشت", "Above the daily 200 EMA / accumulation phase"),
      ok: emaOk,
      detail:
        emaOk === true
          ? msg("قیمت بالای میانگین نمایی ۲۰۰ روزه است.", "Price is above the 200-day exponential moving average.")
          : emaOk === false
            ? msg("زیر EMA ۲۰۰ — روند دلاری هنوز فرسایشی است.", "Below the 200 EMA — the dollar trend is still grinding lower.")
            : msg("کندل ۲۰۰ روزه کامل نبود.", "The 200-day candle history was incomplete."),
    },
    {
      key: "unlock",
      label: msg("آزادسازی ۳۰ روز", "30-day unlock"),
      desired: msg("کمتر از ۳٪ عرضه کل", "Under 3% of total supply"),
      ok: pick.symbol === "BTC" ? true : pick.unlockPct30d == null ? null : !pick.highDilution,
      detail:
        pick.unlockPct30d == null
          ? msg("تقویم آزادسازی برای این نماد نبود.", "There was no unlock calendar for this symbol.")
          : pick.highDilution
            ? msg(
                `${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · جریمه ${pick.unlockPenalty} امتیاز · High Dilution Risk`,
                `${pick.unlockPct30d.toFixed(2)}% of supply in 30 days · a ${pick.unlockPenalty}-point penalty · High Dilution Risk`,
              )
            : msg(
                `${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · بدون جریمه`,
                `${pick.unlockPct30d.toFixed(2)}% of supply in 30 days · no penalty`,
              ),
    },
    {
      key: "kill",
      label: msg("کلید قطع بیت‌کوین", "Bitcoin kill switch"),
      desired: msg("بالای EMA ۲۰۰ و هفتگی غیرنزولی شدید", "Above the 200 EMA and weekly not severely bearish"),
      ok: ctx.kill ? ctx.kill.status === "NORMAL" : null,
      detail: ctx.kill?.note ?? msg("فیلتر کلان هنوز محاسبه نشده است.", "The macro filter has not been computed yet."),
    },
  ];

  if (ctx.book && pick.symbol !== "BTC") {
    items.push({
      key: "book",
      label: msg("دفتر سفارش و فاندینگ", "Order book and funding"),
      desired: msg("اسلیپیج زیر ۳۵bps و فاندینگ سالانه زیر ۳۰٪", "Slippage under 35 bps and annualized funding under 30%"),
      ok: ctx.book.gate === "pass" ? true : ctx.book.gate === "unknown" ? null : false,
      detail: ctx.book.note,
    });
  }
  return items;
}

export function checklistPassCount(items: CheckItem[]): {
  pass: number;
  fail: number;
  unknown: number;
} {
  let pass = 0;
  let fail = 0;
  let unknown = 0;
  for (const item of items) {
    if (item.ok === true) pass += 1;
    else if (item.ok === false) fail += 1;
    else unknown += 1;
  }
  return { pass, fail, unknown };
}

export function dominanceBiasOf(
  dominance: number,
  btcPct7d: number,
  medianRs7: number,
): { bias: DominanceBias; note: string } {
  if (dominance >= 55 && medianRs7 < 0) {
    return {
      bias: "rising",
      note: msg(
        `دامیننس BTC ${dominance.toFixed(1)}٪ و میانه آلت‌ها منفی است — سرمایه به بیت‌کوین جذب می‌شود.`,
        `BTC dominance is ${dominance.toFixed(1)}% and the median alt is negative — capital is being pulled into Bitcoin.`,
      ),
    };
  }
  if (dominance >= 54.5 && Math.abs(btcPct7d) < 0.05) {
    return {
      bias: "resistance",
      note: msg(
        `دامیننس ${dominance.toFixed(1)}٪ نزدیک مقاومت تاریخی است؛ اگر بشکند آلت‌ها جا می‌مانند.`,
        `Dominance at ${dominance.toFixed(1)}% is near historical resistance; if it breaks, alts get left behind.`,
      ),
    };
  }
  if (dominance < 52 && medianRs7 > 0) {
    return {
      bias: "falling",
      note: msg(
        `دامیننس ${dominance.toFixed(1)}٪ در حال کاهش است — فضای آلت‌سیزن بازتر شده.`,
        `Dominance at ${dominance.toFixed(1)}% is falling — the alt-season window is more open.`,
      ),
    };
  }
  return {
    bias: "neutral",
    note: msg(
      `دامیننس ${dominance.toFixed(1)}٪ در ناحیه میانی است.`,
      `Dominance at ${dominance.toFixed(1)}% is in the middle zone.`,
    ),
  };
}

export function emptyAnalysisFields(): Pick<
  AnalysisResult,
  "checklist" | "portfolio"
> {
  return { checklist: [], portfolio: [] };
}
