import { msg } from "@/lib/i18n/lex";
import type { BtcKillSwitch, Regime } from "./types.ts";

/**
 * Cycle brain.
 *
 * Cash when Bitcoin's trend is actually breaking, so a deep drawdown is not
 * the default holding. Bitcoin when the trend is intact and alts are not
 * leading. Alts only while that Bitcoin trend is still healthy and either
 * dominance is falling or the median alt is clearly ahead — that is when the
 * long alt rallies happen. A broken Bitcoin trend never funds an alt.
 *
 * The weights are rules, not a fit. Nothing here is a promise of return.
 */

export type CyclePhase = "crash" | "defend" | "btc" | "early-alt" | "alt-season";
export type CycleStance = "cash" | "btc" | "alt";

export type CycleIntent = {
  phase: CyclePhase;
  /** Cash weight intended before an alt name actually qualifies. */
  cash: number;
  btc: number;
  altBudget: number;
  maxNames: number;
};

export type CycleName = {
  symbol: string;
  name: string;
  weight: number;
};

export type CyclePlan = {
  phase: CyclePhase;
  stance: CycleStance;
  cash: number;
  btc: number;
  alt: number;
  names: CycleName[];
  headline: string;
  why: string;
  flip: string;
};

/** Dominance is in percentage points. A move inside this band is noise. */
const DOMINANCE_DROP = 1.5;
/** Four-week drop deep enough to be a crash leg, not a bull-market dip. */
export const CRASH_MOMENTUM = -0.18;

function dominanceIsFalling(now: number | null, prev: number | null): boolean {
  if (now == null || prev == null) return false;
  if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
  return now < prev - DOMINANCE_DROP;
}

export function riskPhase(kill: BtcKillSwitch): "crash" | "defend" | "trend" {
  if (kill.status === "SUSPENDED") return "crash";
  if (kill.weeklyMomentum != null && kill.weeklyMomentum <= CRASH_MOMENTUM) return "crash";
  if (kill.weeklyStructure === "bear" && kill.aboveEma200 === false) return "crash";
  if (kill.aboveEma200 == null && kill.weeklyStructure == null && kill.status === "NORMAL") {
    return "trend";
  }
  if (
    kill.status === "HIGH_RISK" ||
    kill.severeWeekly ||
    kill.weeklyStructure === "bear" ||
    kill.aboveEma200 === false
  ) {
    return "defend";
  }
  return "trend";
}

/** Book mode used by exits. Alt season stays "core": Bitcoin's trend is intact. */
export function cycleMode(kill: BtcKillSwitch): "cash" | "defend" | "core" {
  const phase = riskPhase(kill);
  if (phase === "crash") return "cash";
  if (phase === "defend") return "defend";
  return "core";
}

export function planCycle(input: {
  kill: BtcKillSwitch;
  regime: Regime;
  dominance: number | null;
  dominancePrev: number | null;
  medianRs7: number | null;
}): CycleIntent {
  const risk = riskPhase(input.kill);
  if (risk === "crash") {
    return { phase: "crash", cash: 1, btc: 0, altBudget: 0, maxNames: 0 };
  }
  if (risk === "defend") {
    return { phase: "defend", cash: 0.6, btc: 0.4, altBudget: 0, maxNames: 0 };
  }

  const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
  const median = input.medianRs7;
  const weeklyBull = input.kill.weeklyStructure === "bull";
  const broad = input.regime === "alt" && median != null && median > 0.04;
  const leaders = falling && (input.regime === "alt" || (median != null && median > 0.025));

  if (weeklyBull && (leaders || (broad && falling))) {
    return { phase: "alt-season", cash: 0.08, btc: 0.28, altBudget: 0.64, maxNames: 2 };
  }
  if (falling || input.regime === "alt") {
    return { phase: "early-alt", cash: 0.1, btc: 0.62, altBudget: 0.28, maxNames: 1 };
  }
  return { phase: "btc", cash: 0, btc: 1, altBudget: 0, maxNames: 0 };
}

export function stanceFromWeights(cash: number, btc: number, alt: number): CycleStance {
  if (alt >= 0.2) return "alt";
  if (cash >= 0.5 && cash >= btc && cash >= alt) return "cash";
  return "btc";
}

export function explainCycle(input: {
  phase: CyclePhase;
  stance: CycleStance;
  cash: number;
  btc: number;
  alt: number;
  names: CycleName[];
}): Pick<CyclePlan, "headline" | "why" | "flip"> {
  const pct = (n: number) => `${Math.round(n * 100)}`;
  const names = input.names
    .filter((row) => row.weight > 0)
    .map((row) => `${row.symbol} ${pct(row.weight)}٪`)
    .join("، ");
  const namesEn = input.names
    .filter((row) => row.weight > 0)
    .map((row) => `${row.symbol} ${pct(row.weight)}%`)
    .join(", ");

  if (input.phase === "crash") {
    return {
      headline: msg("نقد بمان", "Stay in cash"),
      why: msg(
        "روند بیت‌کوین شکسته است: یا زیر میانگین ۲۰۰روزه با ساختار هفتگی نزولی، یا افت چهارهفته‌ای عمیق، یا هر دو ستون کلید قطع. آلت در این رژیم سخت‌تر از بیت‌کوین می‌ریزد. تمام دفتر تتر است تا آن سقوط تجربه نشود.",
        "Bitcoin’s trend is broken: under the 200-day average with a bearish weekly structure, a deep four-week drop, or both kill-switch pillars. Alts fall harder than Bitcoin here. The whole book is tether so that drawdown is not held.",
      ),
      flip: msg(
        "برگشت به بیت‌کوین فقط وقتی قیمت دوباره بالای میانگین ۲۰۰روزه باشد و ساختار هفتگی دیگر نزولی نباشد.",
        "Bitcoin comes back only after price is back above the 200-day average and weekly structure is no longer bearish.",
      ),
    };
  }

  if (input.phase === "defend") {
    return {
      headline: msg("نقد بمان", "Stay in cash"),
      why: msg(
        `یکی از ستون‌های روند بیت‌کوین خراب است، ولی هنوز شکست کامل نیست. ${pct(input.cash)}٪ نقد می‌ماند و ${pct(input.btc)}٪ فقط دیده‌بان بیت‌کوین است. آلت در این حالت بسته است، چون رالی آلت وسط روند خراب بیت‌کوین دوام نمی‌آورد.`,
        `One of Bitcoin’s trend pillars is broken, but the break is not complete. ${pct(input.cash)}% stays in cash and ${pct(input.btc)}% is only a Bitcoin scout. Alts stay shut, because an alt rally does not last through a damaged Bitcoin trend.`,
      ),
      flip: msg(
        "اگر ستون دوم هم بشکند، دیده‌بان هم به نقد می‌رود. اگر هر دو ستون سالم شوند، دفتر به بیت‌کوین برمی‌گردد.",
        "If the second pillar breaks, the scout goes to cash too. If both pillars heal, the book returns to Bitcoin.",
      ),
    };
  }

  if (input.stance === "alt" && input.names.length > 0) {
    const season = input.phase === "alt-season";
    return {
      headline: msg("آلت بخر", "Buy the alt"),
      why: msg(
        season
          ? `روند بیت‌کوین سالم است و آلت‌ها جلوترند. وزن اصلی روی لیدرهای نقدشونده است تا صعود بلند گرفته شود، نه روی تمام بازار: ${names}. ${pct(input.btc)}٪ بیت‌کوین لنگر می‌ماند و ${pct(input.cash)}٪ نقد است تا ته آلت‌سیزن دفتر را صفر نکند.`
          : `چرخش شروع شده ولی هنوز فصل کامل نیست. یک لیدر، نه یک سبد شلوغ: ${names}. بقیه ${pct(input.btc)}٪ بیت‌کوین و ${pct(input.cash)}٪ نقد است.`,
        season
          ? `Bitcoin’s trend is healthy and alts are leading. The main weight sits on liquid leaders so the long rally is held, not on the whole market: ${namesEn}. ${pct(input.btc)}% Bitcoin stays as the anchor and ${pct(input.cash)}% is cash so the end of alt season does not zero the book.`
          : `Rotation has started but it is not a full season yet. One leader, not a crowded basket: ${namesEn}. The rest is ${pct(input.btc)}% Bitcoin and ${pct(input.cash)}% cash.`,
      ),
      flip: msg(
        "خروج آلت با ابطال همان نام، شکست ساختار هفتگی جفت، یا خراب شدن روند بیت‌کوین. خاموش شدن یک‌هفته‌ای دامیننس به‌تنهایی دلیل فروش نیست.",
        "An alt exits on that name’s invalidation, a weekly pair-structure break, or Bitcoin’s trend breaking. Dominance cooling for a single week is not, by itself, a sale.",
      ),
    };
  }

  if (input.phase === "early-alt" || input.phase === "alt-season") {
    return {
      headline: msg("بیت‌کوین بخر", "Buy Bitcoin"),
      why: msg(
        "علامت چرخش هست، ولی هنوز هیچ آلتی هم دروازهٔ ساختاری را رد کرده و هم جای ورود دارد. تا آن نام پیدا شود دفتر بیت‌کوین می‌ماند، نه یک آلت تصادفی.",
        "The rotation sign is on, but no alt has both cleared the structural gate and reached an entry. Until that name shows up the book stays in Bitcoin, not a random alt.",
      ),
      flip: msg(
        "با قرار گرفتن لیدر داخل محدوده، یا در فصل کامل با ساختار سالم جفت، بخشی از بیت‌کوین به همان آلت می‌رود.",
        "When a leader trades inside its zone — or, in a full season, holds a healthy pair structure — part of the Bitcoin sleeve moves into that alt.",
      ),
    };
  }

  return {
    headline: msg("بیت‌کوین بخر", "Buy Bitcoin"),
    why: msg(
      "روند بیت‌کوین سالم است و آلت‌ها هنوز رهبری نمی‌کنند. خریدن آلت اینجا یعنی جا ماندن از خود بیت‌کوین و خوردن ریزش عمیق‌تر آلت. تمام دفتر بیت‌کوین است.",
      "Bitcoin’s trend is healthy and alts are not leading yet. Buying an alt here means lagging Bitcoin and taking the deeper alt drawdown. The whole book is Bitcoin.",
    ),
    flip: msg(
      "اگر دامیننس حدود سی‌روزه بیفتد و میانهٔ آلت‌ها جلو بیفتد، وزن به یک یا دو لیدر می‌رود. اگر ساختار هفتگی نزولی شود یا قیمت میانگین ۲۰۰روزه را از دست بدهد، دفتر به نقد برمی‌گردد.",
      "If dominance falls over about thirty days and the median alt takes the lead, weight moves into one or two leaders. If weekly structure turns bearish or price loses the 200-day average, the book goes back to cash.",
    ),
  };
}
