import type {
  BuySignal,
  BtcKillSwitch,
  CoinDraft,
  CoinRow,
  FactorKey,
  FactorScore,
  Regime,
  UnlockAssessment,
} from "./types.ts";
import { isHot, lookupMeta } from "./catalog.ts";
import {
  clamp,
  detectWeeklyStructure,
  distFromHigh,
  lookback,
  maxDrawdown,
  percentileRank,
  rsi,
  sma,
  ema,
  stdev,
  dailyReturns,
  tanhScore,
  obvIsRising,
  weeklySupportBroken,
} from "./math.ts";
import { emptyUnlock } from "./unlocks.ts";

export const FACTOR_WEIGHTS: Record<FactorKey, number> = {
  rs: 0.22,
  tokenomics: 0.16,
  entry: 0.16,
  trend: 0.16,
  liquidity: 0.14,
  risk: 0.1,
  narrative: 0.06,
};

export const FACTOR_LABELS: Record<FactorKey, string> = {
  rs: "قدرت نسبی به بیت‌کوین",
  tokenomics: "توکنومیکس · MC/FDV",
  entry: "موقعیت ورود",
  trend: "روند کلان",
  liquidity: "نقدشوندگی اسپات",
  risk: "بازده به ریسک",
  narrative: "روایت و ارزش‌افزایی",
};

export function factorWeightSum(): number {
  return Object.values(FACTOR_WEIGHTS).reduce((a, b) => a + b, 0);
}

function factor(key: FactorKey, score: number, note: string): FactorScore {
  return {
    key,
    label: FACTOR_LABELS[key],
    score: clamp(score),
    weight: FACTOR_WEIGHTS[key],
    note,
  };
}

function rsiEntryScore(value: number | null, shortReversal: boolean): {
  score: number;
  note: string;
} {
  if (value == null) {
    return { score: 55, note: "RSI روزانه در دسترس نبود؛ وزن روی بقیه سیگنال‌ها رفت." };
  }
  if (value >= 78) {
    return { score: 14, note: `RSI ${value.toFixed(0)} — اشباع خرید؛ خرید اسپات در سقف ضعیف است.` };
  }
  if (value >= 70) {
    return { score: 32, note: `RSI ${value.toFixed(0)} — گرم؛ ریسک ادامه بدون اصلاح بالاست.` };
  }
  if (value >= 42 && value <= 58) {
    return { score: 96, note: `RSI ${value.toFixed(0)} — ناحیه تعادلی مناسب برای ورود اسپات.` };
  }
  if (value >= 35 && value <= 65) {
    return { score: 84, note: `RSI ${value.toFixed(0)} — نه هیجانی، نه فرسوده.` };
  }
  if (value >= 30 && value <= 70) {
    return { score: 70, note: `RSI ${value.toFixed(0)} — قابل قبول با احتیاط.` };
  }
  if (value < 25) {
    if (shortReversal) {
      return { score: 62, note: `RSI ${value.toFixed(0)} اشباع فروش است ولی برگشت کوتاه‌مدت دیده می‌شود.` };
    }
    return { score: 28, note: `RSI ${value.toFixed(0)} — چاقوی در حال سقوط؛ هنوز برگشت تأیید نشده.` };
  }
  if (value < 35) {
    return {
      score: shortReversal ? 68 : 48,
      note: `RSI ${value.toFixed(0)} — نزدیک اشباع فروش.`,
    };
  }
  return { score: 58, note: `RSI ${value.toFixed(0)}.` };
}

function pullbackScore(dist: number | null, athDd: number | null): {
  score: number;
  note: string;
} {
  if (dist != null) {
    const pct = Math.abs(dist) * 100;
    if (dist > -0.04) {
      return { score: 16, note: `فقط ${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — خرید سقف.` };
    }
    if (dist > -0.08) {
      return { score: 40, note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح خیلی کم.` };
    }
    if (dist >= -0.18) {
      return { score: 94, note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح سالم، نه سقوط.` };
    }
    if (dist >= -0.28) {
      return { score: 72, note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح عمیق‌تر ولی قابل کار.` };
    }
    if (dist >= -0.4) {
      return { score: 44, note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — آسیب دیده.` };
    }
    return { score: 30, note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — روند آسیب‌دیده.` };
  }
  if (athDd != null) {
    const dd = Math.abs(athDd);
    if (dd < 8) return { score: 28, note: `فقط ${dd.toFixed(0)}٪ زیر ATH — فضای کمی برای خطا.` };
    if (dd < 25) return { score: 70, note: `${dd.toFixed(0)}٪ زیر ATH.` };
    if (dd < 55) return { score: 78, note: `${dd.toFixed(0)}٪ زیر ATH — از اوج تاریخی فاصله معقول.` };
    if (dd < 80) return { score: 58, note: `${dd.toFixed(0)}٪ زیر ATH.` };
    return { score: 36, note: `${dd.toFixed(0)}٪ زیر ATH — بازار این دارایی را مدت‌ها تنبیه کرده.` };
  }
  return { score: 55, note: "فاصله از اوج مشخص نبود." };
}

export function enrichFromKlines(draft: CoinDraft): CoinDraft {
  const closes = draft.pairCloses;
  const usd = draft.usdCloses;
  const vols = draft.usdVolumes;
  const klineDays = Math.max(closes.length, usd.length);

  const rs7 = closes.length >= 8 ? lookback(closes, 7) : null;
  const rs14 = lookback(closes, 14);
  const rs30 = lookback(closes, Math.min(29, Math.max(1, closes.length - 1)));
  const rsi14 = rsi(closes, 14);
  const rets = closes.length >= 8 ? dailyReturns(closes.slice(-31)) : [];
  const vol = rets.length >= 5 ? stdev(rets) : null;
  const dd = closes.length >= 8 ? maxDrawdown(closes.slice(-31)) : null;
  const dist = closes.length >= 8 ? distFromHigh(closes.slice(-31)) : null;
  const s10 = sma(closes, Math.min(10, closes.length));
  const lastPair = closes[closes.length - 1];
  const aboveSma = s10 != null && lastPair != null ? lastPair >= s10 : null;

  const ema200 = ema(usd, 200);
  const lastUsd = usd[usd.length - 1];
  const aboveEma200 =
    ema200 != null && lastUsd != null ? lastUsd >= ema200 : null;
  const weeklyStructure = usd.length >= 56 ? detectWeeklyStructure(usd) : null;
  const obvRising = usd.length >= 15 && vols.length >= 15 ? obvIsRising(usd, vols) : null;

  const pairWeekly = closes.length >= 56 ? detectWeeklyStructure(closes) : null;
  const supportBroken = weeklySupportBroken(closes);

  const window = closes.slice(-31);
  const first = window[0] ?? 1;
  const pairSeries = window.map((v, i) => ({
    t: i,
    v: first ? (v / first) * 100 : 100,
  }));

  return {
    ...draft,
    hasKlines: closes.length >= 8,
    klineDays,
    rs7d: rs7 ?? draft.rs7d,
    rs14d: rs14 ?? draft.rs14d,
    rs30d: rs30 ?? draft.rs30d,
    rsi14,
    volatility30d: vol,
    maxDrawdown30d: dd,
    distFrom30dHighPct: dist,
    aboveSma,
    aboveEma200,
    weeklyStructure,
    obvRising,
    pairWeekly,
    pairSupportBroken: supportBroken,
    pairSeries,
  };
}

export function detectRegime(rows: CoinDraft[], btcDominance: number): {
  regime: Regime;
  medianRs7: number;
  note: string;
} {
  const alts = rows.filter((r) => r.symbol !== "BTC").map((r) => r.rs7d);
  const sorted = [...alts].sort((a, b) => a - b);
  const mid = sorted[Math.floor(sorted.length / 2)] ?? 0;
  if (mid < -0.03 || btcDominance >= 55) {
    if (mid < -0.03 && btcDominance >= 52) {
      return {
        regime: "btc",
        medianRs7: mid,
        note: `میانه آلت‌ها در ۷ روز ${pct(mid)} ضعیف‌تر از بیت‌کوین بوده و دامیننس BTC ${btcDominance.toFixed(1)}٪ است — فصل بیت‌کوین.`,
      };
    }
  }
  if (mid > 0.03 && btcDominance < 54) {
    return {
      regime: "alt",
      medianRs7: mid,
      note: `میانه آلت‌ها در ۷ روز ${pct(mid)} قوی‌تر از بیت‌کوین است — سرمایه دارد به آلت می‌چرخد.`,
    };
  }
  if (mid < -0.03) {
    return {
      regime: "btc",
      medianRs7: mid,
      note: `میانه آلت‌ها در ۷ روز ${pct(mid)} مقابل بیت‌کوین منفی است.`,
    };
  }
  if (mid > 0.03) {
    return {
      regime: "alt",
      medianRs7: mid,
      note: `میانه آلت‌ها در ۷ روز ${pct(mid)} بیت‌کوین را شکست داده.`,
    };
  }
  return {
    regime: "neutral",
    medianRs7: mid,
    note: `بازار خنثی است؛ میانه آلت‌ها مقابل بیت‌کوین ${pct(mid)} در ۷ روز.`,
  };
}

function pct(x: number): string {
  const v = x * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(1)}٪`;
}

export function scoreUniverse(
  drafts: CoinDraft[],
  regime: Regime,
  ctx?: {
    unlocks?: Map<string, UnlockAssessment>;
    kill?: BtcKillSwitch;
  },
): CoinRow[] {
  const rsBlend = drafts.map((d) => blendRs(d));
  const sharpe = drafts.map((d) => sharpeLike(d));
  const vols = drafts.map((d) => d.volume24h);
  const turns = drafts.map((d) => d.turnover);

  return drafts.map((d, i) => {
    const factors = [
      scoreRs(d, rsBlend[i] ?? 0, rsBlend),
      scoreTokenomics(d),
      scoreTrend(d),
      scoreEntry(d),
      scoreLiquidity(d, vols, turns),
      scoreRisk(d, sharpe[i] ?? 0, sharpe),
      scoreNarrative(d),
    ];

    let score = factors.reduce((s, f) => s + f.score * f.weight, 0);

    const unlock = ctx?.unlocks?.get(d.symbol) ?? emptyUnlock();
    if (d.symbol !== "BTC" && unlock.penalty > 0) {
      score -= unlock.penalty;
      const tok = factors.find((f) => f.key === "tokenomics");
      if (tok) {
        tok.note += ` جریمه کلیف/رقیق‌سازی: ${unlock.penalty} امتیاز از نمره کل کسر شد. ${unlock.note}`;
      }
    }

    if (d.symbol === "BTC") {
      if (regime === "btc") score += 6;
      if (regime === "alt") score -= 4;
    } else if (regime === "btc" && (d.rs7d ?? 0) < 0) {
      score -= 3;
    }

    if (d.volume24h < 8_000_000) score -= 8;
    if (!d.hasKlines) score -= 4;
    if (d.mcFdv != null && d.mcFdv < 0.5 && d.symbol !== "BTC" && d.symbol !== "ETH") {
      score -= 5;
    }
    if (d.aboveEma200 === false && d.weeklyStructure === "bear") score -= 4;

    const kill = ctx?.kill;
    let buySignal: BuySignal = "open";
    let sizeMultiplier = 1;
    if (d.symbol !== "BTC" && kill && kill.status === "SUSPENDED") {
      buySignal = "suspended";
      sizeMultiplier = 0;
    } else if (d.symbol !== "BTC" && kill && kill.status === "HIGH_RISK") {
      buySignal = "reduced";
      sizeMultiplier = 0.5;
    }

    const { pairCloses: _p, usdCloses: _u, usdVolumes: _v, ...rest } = d;
    return {
      ...rest,
      unlockPenalty: d.symbol === "BTC" ? 0 : unlock.penalty,
      highDilution: d.symbol === "BTC" ? false : unlock.highDilution,
      unlockPct30d: d.symbol === "BTC" ? null : unlock.pct30d,
      unlockDate: d.symbol === "BTC" ? null : unlock.nextDate,
      unlockDays: d.symbol === "BTC" ? null : unlock.nextDays,
      unlockCliff: d.symbol === "BTC" ? false : unlock.cliff,
      buySignal,
      sizeMultiplier,
      score: clamp(score),
      factors,
    };
  });
}

function capRs(x: number, cap = 0.35): number {
  return Math.max(-cap, Math.min(cap, x));
}

function blendRs(d: CoinDraft): number {
  const a = capRs(d.rs7d);
  const b = capRs(d.rs14d ?? d.rs7d);
  const c = capRs(d.rs30d ?? d.rs7d);
  return 0.5 * a + 0.25 * b + 0.25 * c;
}

function sharpeLike(d: CoinDraft): number {
  const ret = d.rs30d ?? d.rs7d;
  const vol = d.volatility30d;
  if (vol && vol > 0) return ret / vol;
  return ret / 0.08;
}

function scoreRs(d: CoinDraft, blend: number, all: number[]): FactorScore {
  const p = percentileRank(blend, all);
  const abs = tanhScore(blend, 0.12, 50);
  let score = 0.55 * p + 0.45 * abs;
  let note = `ترکیب ۷/۱۴/۳۰ روزه مقابل BTC: ${pct(blend)} (صدک ${p.toFixed(0)} در این مجموعه).`;
  if (d.rs7d > 0.18) {
    score -= 10;
    note += " جهش ۷ روزه تند است و از امتیاز قدرت نسبی کم شد.";
  }
  if ((d.rs30d ?? 0) > 0.45) {
    note += " بازده ۳۰ روزه سقف‌گذاری شد تا جهش‌های انفجاری به‌تنهایی برنده نشوند.";
  }
  if (d.symbol === "BTC") {
    note = "بیت‌کوین معیار است؛ امتیازش از فرصت از دست‌رفته آلت‌ها و پایداری نقدینگی می‌آید.";
  }
  return factor("rs", score, note);
}

function scoreTokenomics(d: CoinDraft): FactorScore {
  const bits: string[] = [];
  let score = 55;
  if (d.mcFdv != null) {
    const pctPts = d.mcFdv * 100;
    if (d.mcFdv >= 0.7) {
      score = 92;
      bits.push(`نسبت MC/FDV ${pctPts.toFixed(0)}٪ — عرضه رقیق‌شده نزدیک گردش است.`);
    } else if (d.mcFdv >= 0.5) {
      score = 70;
      bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — قابل قبول، ولی آزادسازی هنوز اثر دارد.`);
    } else if (d.mcFdv >= 0.35) {
      score = 38;
      bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — کمتر از نصف تا ۷۰٪ توکن‌ها در گردش است.`);
    } else {
      score = 16;
      bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — فشار فروش آزادسازی ساختاری است.`);
    }
  } else if (d.symbol === "ETH") {
    score = 84;
    bits.push("اتریوم سقف عرضه ثابت ندارد؛ ارزش از سوزاندن کارمزد و استیک می‌آید.");
  } else {
    score = 48;
    bits.push("سقف عرضه در داده نبود؛ امتیاز توکنومیکس خنثی ماند.");
  }
  if (d.symbol === "BTC") {
    score = Math.max(score, 94);
    bits.push("سقف ۲۱ میلیون مشخص و قابل حسابرسی است.");
  }
  return factor("tokenomics", score, bits.join(" "));
}

function scoreTrend(d: CoinDraft): FactorScore {
  let score = 50;
  const bits: string[] = [];
  const trend7 = d.symbol === "BTC" ? d.pct7d / 100 : d.rs7d;
  const trend30 =
    d.symbol === "BTC"
      ? (lookback(d.pairCloses, Math.min(29, Math.max(1, d.pairCloses.length - 1))) ??
        trend7)
      : (d.rs30d ?? d.rs7d);

  if (d.aboveEma200 === true) {
    score += 14;
    bits.push("قیمت دلار بالای EMA ۲۰۰ روزانه است");
  } else if (d.aboveEma200 === false) {
    score -= 12;
    bits.push("زیر EMA ۲۰۰ روزانه — روند دلاری فرسایشی");
  }

  if (d.weeklyStructure === "bull") {
    score += 14;
    bits.push("ساختار هفتگی صعودی (کف و سقف بالاتر / شکست)");
  } else if (d.weeklyStructure === "bear") {
    score -= 12;
    bits.push("ساختار هفتگی نزولی");
  } else if (d.weeklyStructure === "range") {
    bits.push("هفتگی در ناحیه انباشت/رنج");
  }

  if (d.aboveSma === true) {
    score += 8;
    bits.push(
      d.symbol === "BTC"
        ? "بالای میانگین ۱۰ روزه"
        : "جفت BTC بالای میانگین ۱۰ روزه",
    );
  } else if (d.aboveSma === false) {
    score -= 6;
    bits.push("زیر میانگین ۱۰ روزه");
  }

  const s7 = Math.sign(trend7);
  const s30 = Math.sign(trend30);
  if (s7 > 0 && s30 > 0) {
    score += 8;
    bits.push("۷ و ۳۰ روز هر دو مثبت‌اند");
  } else if (s7 < 0 && s30 < 0) {
    score -= 8;
    bits.push("۷ و ۳۰ روز هر دو منفی‌اند");
  }

  if (d.obvRising === true) {
    score += 8;
    bits.push("OBV در حال افزایش — حجم از روند حمایت می‌کند");
  } else if (d.obvRising === false) {
    score -= 6;
    bits.push("OBV هم‌جهت نیست");
  }

  if (d.volumeChange24h > 15 && d.pct24h > 0) {
    score += 6;
    bits.push("حجم با رشد قیمت آمده");
  } else if (d.volumeChange24h < -20 && d.pct24h > 2) {
    score -= 6;
    bits.push("رشد قیمت بدون حجم");
  }

  if (!d.hasKlines) {
    score -= 6;
    bits.push("بدون کندل کافی؛ روند با دادهٔ کوتاه‌مدت تخمین زده شد");
  }

  return factor("trend", score, bits.join("؛ ") || "روند متوسط.");
}

function scoreEntry(d: CoinDraft): FactorScore {
  const reversal = d.pct6h > 0 && d.pct24h > 0;
  const rsiPart = rsiEntryScore(d.rsi14, reversal);
  const pb = pullbackScore(d.distFrom30dHighPct, d.athDrawdownPct);

  let score = 0.55 * rsiPart.score + 0.45 * pb.score;

  if (d.rs7d > 0.12 && d.rs24h > 0.05) {
    score -= 12;
  }
  if ((d.rs30d ?? 0) > 0.4 && (d.distFrom30dHighPct ?? 0) > -0.08) {
    score -= 18;
  }
  if ((d.rs30d ?? 0) > 0.8) {
    score -= 16;
  }
  if ((d.rs30d ?? 0) > 1.5) {
    score -= 10;
  }
  if (d.rs7d > 0 && d.rs24h < -0.02 && (d.rsi14 == null || d.rsi14 < 62)) {
    score += 8;
  }

  const note = `${rsiPart.note} ${pb.note}`;
  return factor("entry", score, note);
}

function scoreLiquidity(
  d: CoinDraft,
  vols: number[],
  turns: number[],
): FactorScore {
  const volP = percentileRank(d.volume24h, vols);
  const turnP = percentileRank(d.turnover, turns);
  const abs = tanhScore(Math.log10(Math.max(d.volume24h, 1) / 1e7), 1.6, 48);
  let score = 0.5 * abs + 0.3 * volP + 0.2 * turnP;
  if (d.hasBtcPair) score += 7;
  if (d.turnover >= 0.02) score += 10;
  else if (d.turnover < 0.008) score -= 10;
  const volM = d.volume24h / 1e6;
  const turnPct = d.turnover * 100;
  const pair = d.hasBtcPair ? "جفت BTC واقعی روی بایننس دارد" : "جفت BTC مستقیم روی بایننس نیست";
  const depth =
    d.turnover >= 0.02
      ? "گردش روزانه بالای ۲٪ مارکت‌کپ است."
      : "گردش زیر آستانه ۲٪ است؛ خروج ممکن است لغزش داشته باشد.";
  return factor(
    "liquidity",
    score,
    `حجم ۲۴س ${volM.toFixed(0)} میلیون دلار، گردش ${turnPct.toFixed(2)}٪ از مارکت‌کپ. ${pair}. ${depth}`,
  );
}

function scoreRisk(d: CoinDraft, sh: number, all: number[]): FactorScore {
  const p = percentileRank(sh, all);
  let score = p;
  const bits: string[] = [];

  if (d.maxDrawdown30d != null) {
    const dd = Math.abs(d.maxDrawdown30d) * 100;
    if (dd < 8) {
      score += 10;
      bits.push(`حداکثر افت ۳۰ روزه جفت BTC فقط ${dd.toFixed(1)}٪`);
    } else if (dd > 25) {
      score -= 12;
      bits.push(`افت ۳۰ روزه ${dd.toFixed(0)}٪ — پرنوسان`);
    } else {
      bits.push(`افت ۳۰ روزه ${dd.toFixed(0)}٪`);
    }
  }

  if (d.beta != null && d.symbol !== "BTC") {
    if (d.beta > 1.8) {
      score -= 10;
      bits.push(`بتا ${d.beta.toFixed(2)} نسبت به بازار بالاست`);
    } else if (d.beta < 1.25) {
      score += 6;
      bits.push(`بتا ${d.beta.toFixed(2)} کنترل‌شده‌تر است`);
    }
  }

  if (d.volatility30d != null) {
    bits.push(`نوسان روزانه جفت BTC ${(d.volatility30d * 100).toFixed(1)}٪`);
  }

  return factor("risk", score, bits.join("؛ ") || "ریسک متوسط مجموعه.");
}

function scoreNarrative(d: CoinDraft): FactorScore {
  const meta = lookupMeta(d.symbol);
  let score = 46;
  const bits: string[] = [];
  const tags = d.narrativeTags.length ? d.narrativeTags : meta.tags;
  const tagsFa = d.narrativeTagsFa.length ? d.narrativeTagsFa : meta.tagsFa;
  const accrual = d.accrual || meta.accrual;

  if (tagsFa.length) bits.push(`روایت: ${tagsFa.join("، ")}`);
  if (isHot(tags)) {
    score += 20;
    bits.push("در ترند فعال بازار است");
  } else if (tags.length) {
    score += 6;
  } else {
    bits.push(meta.note);
  }

  if (accrual === "real-yield" || accrual === "burn" || accrual === "store-of-value") {
    score += 18;
  } else if (accrual === "staking") {
    score += 10;
  } else if (accrual === "governance") {
    score += 2;
    bits.push("عمدتاً حاکمیتی است و ارزش مالی مستقیم کمی دارد");
  } else {
    score -= 6;
    bits.push("مکانیزم ارزش‌افزایی مالی ضعیف است");
  }
  if (d.accrualNote) bits.push(d.accrualNote);

  return factor("narrative", score, bits.join("؛ "));
}

export function pickWinner(
  ranked: CoinRow[],
  regime: Regime,
  kill?: BtcKillSwitch,
): { pick: CoinRow; runnerUp: CoinRow | null } {
  const eligible = ranked.filter((r) => {
    if (r.buySignal === "suspended") return false;
    if (r.volume24h < 8_000_000) return false;
    if (r.rank > 100) return false;
    if (
      r.symbol !== "BTC" &&
      r.mcFdv != null &&
      r.mcFdv < 0.32
    ) {
      return false;
    }
    if (
      r.symbol !== "BTC" &&
      r.distFrom30dHighPct != null &&
      r.distFrom30dHighPct > -0.03
    ) {
      return false;
    }
    const extendedPump =
      r.rs7d > 0.18 &&
      (r.rsi14 == null || r.rsi14 > 60) &&
      (r.distFrom30dHighPct == null || r.distFrom30dHighPct > -0.1);
    if (extendedPump) return false;
    return true;
  });
  const list = eligible.length ? eligible : ranked.filter((r) => r.rank <= 100);
  const sorted = [...list].sort((a, b) => b.score - a.score);
  let pick = sorted[0];
  const btc = ranked.find((r) => r.symbol === "BTC");

  if (pick && btc && pick.symbol !== "BTC" && regime === "btc") {
    if (pick.score - btc.score < 3.5) pick = btc;
  }

  if (pick && pick.rsi14 != null && pick.rsi14 > 78) {
    const alt = sorted.find(
      (r) => r.symbol !== pick!.symbol && (r.rsi14 == null || r.rsi14 < 72),
    );
    if (alt && pick.score - alt.score < 8) pick = alt;
  }

  if (pick?.highDilution) {
    const cleaner = sorted.find(
      (r) => r.symbol !== pick!.symbol && !r.highDilution && pick!.score - r.score < 8,
    );
    if (cleaner) pick = cleaner;
  }

  if (kill?.status === "SUSPENDED") {
    const btc = ranked.find((r) => r.symbol === "BTC");
    if (btc) {
      const runnerUp = sorted.find((r) => r.symbol !== "BTC") ?? null;
      return { pick: btc, runnerUp };
    }
  }

  const runnerUp =
    sorted.find((r) => r.symbol !== pick?.symbol) ?? null;

  return { pick: pick ?? ranked[0]!, runnerUp };
}
