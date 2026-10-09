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
    btcDominance: number;
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
      label: "نسبت MC / FDV",
      desired: "ترجیحاً بالای ۰٫۷",
      ok: mcOk,
      detail:
        pick.mcFdv == null
          ? "سقف عرضه در داده نبود."
          : `MC/FDV ${(pick.mcFdv * 100).toFixed(0)}٪`,
    },
    {
      key: "pair",
      label: "نمودار ALT/BTC",
      desired: "روند صعودی یا شکست مقاومت",
      ok: pairOk,
      detail:
        pick.symbol === "BTC"
          ? "خود بیت‌کوین معیار است."
          : pick.weeklyStructure === "bull"
            ? "ساختار هفتگی جفت/دلار صعودی است."
            : pick.rs7d > 0
              ? "قدرت نسبی ۷ روزه مثبت است."
              : "جفت بیت‌کوین هنوز شکست معتبر ندارد.",
    },
    {
      key: "dom",
      label: "دامیننس بیت‌کوین",
      desired: "کاهشی یا برخورد به مقاومت",
      ok: domOk,
      detail: `دامیننس ${ctx.btcDominance.toFixed(1)}٪ · رژیم ${ctx.regime}`,
    },
    {
      key: "liq",
      label: "حجم و عمق نقدشوندگی",
      desired: "حجم روزانه بالای ۲٪ مارکت‌کپ",
      ok: liqOk,
      detail: `گردش ${(pick.turnover * 100).toFixed(2)}٪ از مارکت‌کپ`,
    },
    {
      key: "ema",
      label: "وضعیت تکنیکال دلاری",
      desired: "بالای EMA ۲۰۰ روزانه / فاز انباشت",
      ok: emaOk,
      detail:
        emaOk === true
          ? "قیمت بالای میانگین نمایی ۲۰۰ روزه است."
          : emaOk === false
            ? "زیر EMA ۲۰۰ — روند دلاری هنوز فرسایشی است."
            : "کندل ۲۰۰ روزه کامل نبود.",
    },
    {
      key: "unlock",
      label: "آزادسازی ۳۰ روز",
      desired: "کمتر از ۳٪ عرضه کل",
      ok: pick.symbol === "BTC" ? true : pick.unlockPct30d == null ? null : !pick.highDilution,
      detail:
        pick.unlockPct30d == null
          ? "تقویم آزادسازی برای این نماد نبود."
          : pick.highDilution
            ? `${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · جریمه ${pick.unlockPenalty} امتیاز · High Dilution Risk`
            : `${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · بدون جریمه`,
    },
    {
      key: "kill",
      label: "کلید قطع بیت‌کوین",
      desired: "بالای EMA ۲۰۰ و هفتگی غیرنزولی شدید",
      ok: ctx.kill ? ctx.kill.status === "NORMAL" : null,
      detail: ctx.kill?.note ?? "فیلتر کلان هنوز محاسبه نشده است.",
    },
  ];

  if (ctx.book && pick.symbol !== "BTC") {
    items.push({
      key: "book",
      label: "دفتر سفارش و فاندینگ",
      desired: "اسلیپیج زیر ۳۵bps و فاندینگ سالانه زیر ۳۰٪",
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
      note: `دامیننس BTC ${dominance.toFixed(1)}٪ و میانه آلت‌ها منفی است — سرمایه به بیت‌کوین جذب می‌شود.`,
    };
  }
  if (dominance >= 54.5 && Math.abs(btcPct7d) < 0.05) {
    return {
      bias: "resistance",
      note: `دامیننس ${dominance.toFixed(1)}٪ نزدیک مقاومت تاریخی است؛ اگر بشکند آلت‌ها جا می‌مانند.`,
    };
  }
  if (dominance < 52 && medianRs7 > 0) {
    return {
      bias: "falling",
      note: `دامیننس ${dominance.toFixed(1)}٪ در حال کاهش است — فضای آلت‌سیزن بازتر شده.`,
    };
  }
  return {
    bias: "neutral",
    note: `دامیننس ${dominance.toFixed(1)}٪ در ناحیه میانی است.`,
  };
}

export function emptyAnalysisFields(): Pick<
  AnalysisResult,
  "checklist" | "portfolio"
> {
  return { checklist: [], portfolio: [] };
}
