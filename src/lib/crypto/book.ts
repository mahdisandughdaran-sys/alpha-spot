import { msg } from "@/lib/i18n/lex";
import { candidateBases } from "./exclusions.ts";
import { weeklyFromDaily } from "./math.ts";
import type { Opportunity } from "./opportunity.ts";
import {
  explainCycle,
  planCycle,
  stanceFromWeights,
  cycleMode,
  type CyclePlan,
} from "./planner.ts";
import type { BtcKillSwitch, CoinRow, Regime, SpotVerdict } from "./types.ts";

/** Together, satellites stay under one third of capital. Not a fitted weight. */
export const SATELLITE_CAP = 0.32;
export const SATELLITE_MAX = 2;
/** Fraction of capital risked to the locked invalidation. */
export const RISK_FRACTION = 0.01;
export const VOLUME_FLOOR = 8_000_000;
/** Free float below this is a veto, not a score. */
export const FLOAT_VETO = 0.35;
/** Dominance is stored in percentage points (56 means 56%). A quarter point is noise. */
export const DOMINANCE_DROP = 1.5;
/** About thirty days, not the 7-day median. */
export const DOMINANCE_LOOKBACK_DAYS = 30;

export type BookMode = "core" | "defend" | "cash";
export type CampaignStatus = "empty" | "waiting" | "open";
export type VetoReason = "volume" | "float" | "unlock" | "venue";

export type Campaign = {
  symbol: string;
  name: string;
  sleeve: "core" | "satellite" | "cash";
  status: CampaignStatus;
  weight: number;
  entryUsd: number | null;
  invalidationUsd: number | null;
  reason: string;
};

export type SpotBook = {
  mode: BookMode;
  plan: CyclePlan;
  /** False unless the alt sleeve beat the one-line rule on the untouched window. */
  satelliteEarned: boolean;
  dominanceFalling: boolean;
  coreWeight: number;
  satelliteWeight: number;
  cashWeight: number;
  campaigns: Campaign[];
  /** Best satellite that passed the structural gates, even if it is not sized yet. */
  candidate: Campaign | null;
  verdict: SpotVerdict;
};

export function isListed(symbol: string, bases: Set<string> | null): boolean {
  if (!bases || bases.size === 0) return false;
  const upper = symbol.toUpperCase();
  if (bases.has(upper)) return true;
  return candidateBases(upper).some((base) => bases.has(base));
}

export function bookMode(kill: BtcKillSwitch): BookMode {
  return cycleMode(kill);
}

export function dominanceIsFalling(now: number | null, prev: number | null): boolean {
  if (now == null || prev == null) return false;
  if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
  return now < prev - DOMINANCE_DROP;
}

export type DominancePoint = { t: number; v: number };

/** Same-source level now versus ~30 days earlier. A gap or a stale print returns nulls. */
export function dominanceLookback(
  series: DominancePoint[],
  atMs: number,
  days = DOMINANCE_LOOKBACK_DAYS,
): { now: number | null; prev: number | null } {
  if (!series.length || !Number.isFinite(atMs)) return { now: null, prev: null };
  const now = latestAtOrBefore(series, atMs);
  const prev = latestAtOrBefore(series, atMs - days * 86_400_000);
  if (!now || !prev) return { now: null, prev: null };
  const gapDays = (now.t - prev.t) / 86_400_000;
  if (gapDays < 20 || gapDays > 45) return { now: null, prev: null };
  if (atMs - now.t > 5 * 86_400_000) return { now: null, prev: null };
  return { now: now.v, prev: prev.v };
}

function latestAtOrBefore(series: DominancePoint[], atMs: number): DominancePoint | null {
  let found: DominancePoint | null = null;
  for (const point of series) {
    if (!Number.isFinite(point.t) || !Number.isFinite(point.v)) continue;
    if (point.t <= atMs) found = point;
    else break;
  }
  return found;
}

export function spotVeto(row: CoinRow, listed: Set<string> | null): VetoReason | null {
  if (row.symbol === "BTC") return null;
  if (!(row.volume24h >= VOLUME_FLOOR)) return "volume";
  if (!row.hasBtcPair) return "venue";
  if (listed == null || !isListed(row.symbol, listed)) return "venue";
  if (row.mcFdv != null && row.mcFdv < FLOAT_VETO) return "float";
  if (row.unlockCliff || row.highDilution) return "unlock";
  return null;
}

export function vetoLabel(reason: VetoReason): string {
  if (reason === "volume") return msg("حجم زیر حد", "Volume is under the floor");
  if (reason === "float") return msg("گردش آزاد خیلی کم", "Free float is too thin");
  if (reason === "unlock") return msg("کلیف آنلاک", "Unlock cliff");
  return msg("در صرافی تأیید نشد", "Not confirmed on the exchange");
}

/** Support of the pair, expressed as a USD invalidation under the last price. */
export function campaignInvalidation(
  pairCloses: number[],
  priceUsd: number,
): { invalidationUsd: number; distance: number } | null {
  if (!(priceUsd > 0)) return null;
  const weekly = weeklyFromDaily(pairCloses);
  if (weekly.length < 8) return null;
  const last = weekly[weekly.length - 1];
  const prior = weekly.slice(-9, -1);
  if (last == null || !(last > 0) || prior.length < 4) return null;
  const support = Math.min(...prior);
  if (!(support > 0) || support >= last) return null;
  const distance = 1 - support / last;
  if (!(distance >= 0.02) || distance > 0.45) return null;
  return { invalidationUsd: priceUsd * (support / last), distance };
}

function inZone(opp: Opportunity | undefined): boolean {
  if (!opp?.zone || !(opp.zone.invalidation > 0)) return false;
  return opp.status === "in-zone" || opp.status === "confirmed" || opp.status === "actionable";
}

function sizeFor(priceUsd: number, invalidationUsd: number): number | null {
  if (!(priceUsd > invalidationUsd)) return null;
  const distance = (priceUsd - invalidationUsd) / priceUsd;
  if (!(distance >= 0.02)) return null;
  return Math.min(SATELLITE_CAP, RISK_FRACTION / distance);
}

function medianAltRs7(ranked: CoinRow[]): number | null {
  const values = ranked
    .filter((row) => row.symbol !== "BTC" && Number.isFinite(row.rs7d))
    .map((row) => row.rs7d)
    .sort((a, b) => a - b);
  if (!values.length) return null;
  return values[Math.floor(values.length / 2)] ?? null;
}

function trendStop(row: CoinRow): number | null {
  if (!(row.priceUsd > 0)) return null;
  const closes = (row.pairSeries ?? []).map((point) => point.v).filter((value) => value > 0);
  const structured = campaignInvalidation(closes, row.priceUsd);
  if (structured) return structured.invalidationUsd;
  return row.priceUsd * 0.88;
}

/**
 * Cycle book. Cash in a broken Bitcoin trend, Bitcoin when alts are not
 * leading, and one or two liquid alts only while Bitcoin's trend is healthy.
 */
export function decideBook(input: {
  ranked: CoinRow[];
  kill: BtcKillSwitch;
  dominance: number | null;
  dominancePrev: number | null;
  opportunities: Opportunity[];
  listed: Set<string> | null;
  satelliteEarned: boolean;
  regime?: Regime;
  /** Holiday and similar: do not open a new alt. A healthy core is not cashed. */
  pauseSatellites?: boolean;
}): SpotBook {
  const btc = input.ranked.find((row) => row.symbol === "BTC");
  const mode = bookMode(input.kill);
  const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
  const btcName = btc?.name ?? "Bitcoin";
  const btcPrice = btc?.priceUsd ?? input.kill.priceUsd ?? null;
  const intent = planCycle({
    kill: input.kill,
    regime: input.regime ?? "neutral",
    dominance: input.dominance,
    dominancePrev: input.dominancePrev,
    medianRs7: medianAltRs7(input.ranked),
  });

  const pack = (weights: {
    cash: number;
    btc: number;
    alt: number;
    names: { symbol: string; name: string; weight: number }[];
    campaigns: Campaign[];
    candidate: Campaign | null;
    verdict: SpotVerdict;
  }): SpotBook => {
    const stance = stanceFromWeights(weights.cash, weights.btc, weights.alt);
    const copy = explainCycle({
      phase: intent.phase,
      stance,
      cash: weights.cash,
      btc: weights.btc,
      alt: weights.alt,
      names: weights.names,
    });
    const plan: CyclePlan = {
      phase: intent.phase,
      stance,
      cash: weights.cash,
      btc: weights.btc,
      alt: weights.alt,
      names: weights.names,
      ...copy,
    };
    return {
      mode,
      plan,
      satelliteEarned: input.satelliteEarned,
      dominanceFalling: falling,
      coreWeight: weights.btc,
      satelliteWeight: weights.alt,
      cashWeight: weights.cash,
      campaigns: weights.campaigns,
      candidate: weights.candidate,
      verdict: { ...weights.verdict, reason: plan.why },
    };
  };

  const coreCampaign = (weight: number, reason: string): Campaign => ({
    symbol: "BTC",
    name: btcName,
    sleeve: "core",
    status: weight > 0 ? "open" : "empty",
    weight,
    entryUsd: weight > 0 ? btcPrice : null,
    invalidationUsd: null,
    reason,
  });

  if (mode === "cash" || !btc) {
    const reason = msg(
      "هیچ‌چیز نخر. روند بیت‌کوین شکسته و دفتر در تتر است. آلت صفر است.",
      "Buy nothing. Bitcoin’s trend is broken and the book is in tether. Alts are zero.",
    );
    const cash: Campaign = {
      symbol: "USDT",
      name: "Tether",
      sleeve: "cash",
      status: "open",
      weight: 1,
      entryUsd: 1,
      invalidationUsd: null,
      reason,
    };
    return pack({
      cash: 1,
      btc: 0,
      alt: 0,
      names: [],
      campaigns: [cash, coreCampaign(0, reason)],
      candidate: null,
      verdict: {
        kind: "cash",
        symbol: null,
        name: null,
        priceUsd: btcPrice,
        reachUsd: null,
        invalidationUsd: null,
        reason,
      },
    });
  }

  if (mode === "defend") {
    const reason = msg(
      "دفتر کوتاه شد. بیشتر سرمایه نقد می‌ماند و فقط دیده‌بان بیت‌کوین سر جایش است. آلت باز نمی‌شود.",
      "The book is cut back. Most of the capital stays in cash and only a Bitcoin scout remains. No alt opens.",
    );
    const cashWeight = intent.cash;
    const coreWeight = intent.btc;
    const cash: Campaign = {
      symbol: "USDT",
      name: "Tether",
      sleeve: "cash",
      status: "open",
      weight: cashWeight,
      entryUsd: 1,
      invalidationUsd: null,
      reason,
    };
    return pack({
      cash: cashWeight,
      btc: coreWeight,
      alt: 0,
      names: [],
      campaigns: [cash, coreCampaign(coreWeight, reason)],
      candidate: null,
      verdict: {
        kind: "stay",
        symbol: "BTC",
        name: btcName,
        priceUsd: btcPrice,
        reachUsd: null,
        invalidationUsd: null,
        reason,
      },
    });
  }

  const structural = input.ranked
    .filter((row) => row.symbol !== "BTC" && spotVeto(row, input.listed) == null)
    .filter((row) => row.aboveSma === true && !row.pairSupportBroken && row.pairWeekly !== "bear")
    .sort((a, b) => b.score - a.score);

  const altPhase = intent.phase === "early-alt" || intent.phase === "alt-season";
  const trend = intent.phase === "alt-season";
  const pool = altPhase ? structural.slice(0, Math.max(intent.maxNames, 1)) : [];

  let reachUsd: number | null = null;
  let candidate: Campaign | null = null;
  const ready: { row: CoinRow; invalidation: number }[] = [];

  for (const row of pool) {
    const opp = input.opportunities.find((item) => item.symbol === row.symbol);
    const zone = opp?.zone;
    const inside = inZone(opp);
    if (input.pauseSatellites || (!inside && !trend)) {
      if (!candidate) {
        reachUsd = zone && zone.low > 0 ? (row.priceUsd > zone.high ? zone.high : zone.low) : null;
        candidate = {
          symbol: row.symbol,
          name: row.name,
          sleeve: "satellite",
          status: "waiting",
          weight: 0,
          entryUsd: inside ? row.priceUsd : null,
          invalidationUsd: zone?.invalidation ?? null,
          reason: input.pauseSatellites
            ? msg(
                `${row.symbol} آماده است، ولی تقویم امروز آلت تازه باز نمی‌کند. تا آن وقت دفتر بیت‌کوین می‌ماند.`,
                `${row.symbol} is ready, but the calendar does not open a new alt today. Until then the book stays in Bitcoin.`,
              )
            : msg(
                `${row.symbol} دروازهٔ ساختاری را دارد ولی هنوز در محدوده نیست. تا ورود، دفتر بیت‌کوین می‌ماند.`,
                `${row.symbol} has cleared the structural gate but is not in the zone yet. Until the entry, the book stays in Bitcoin.`,
              ),
        };
      }
      continue;
    }
    const invalidation = inside && zone?.invalidation ? zone.invalidation : trendStop(row);
    if (invalidation == null || sizeFor(row.priceUsd, invalidation) == null) {
      if (!candidate) {
        candidate = {
          symbol: row.symbol,
          name: row.name,
          sleeve: "satellite",
          status: "waiting",
          weight: 0,
          entryUsd: row.priceUsd,
          invalidationUsd: invalidation,
          reason: msg(
            `${row.symbol} در بازی است، ولی فاصله تا ابطال برای یک کمپین کافی نیست.`,
            `${row.symbol} is in play, but the distance to invalidation is not enough for a campaign.`,
          ),
        };
        reachUsd = zone ? (row.priceUsd > zone.high ? zone.high : zone.low) : null;
      }
      continue;
    }
    ready.push({ row, invalidation });
  }

  const count = ready.length;
  const each = count > 0 ? Math.min(SATELLITE_CAP, intent.altBudget / count) : 0;
  const open: Campaign[] = [];
  for (const item of ready) {
    if (!(each > 0.01)) continue;
    const campaign: Campaign = {
      symbol: item.row.symbol,
      name: item.row.name,
      sleeve: "satellite",
      status: "open",
      weight: each,
      entryUsd: item.row.priceUsd,
      invalidationUsd: item.invalidation,
      reason: msg(
        `${item.row.symbol} آستین آلت است، نه تمام دفتر. ابطال روی ${item.invalidation.toFixed(4)} قفل شد. به بازنده اضافه نکن.`,
        `${item.row.symbol} is an alt sleeve, not the whole book. Invalidation is locked at ${item.invalidation.toFixed(4)}. Do not add to a loser.`,
      ),
    };
    open.push(campaign);
    if (!candidate) candidate = campaign;
  }

  const used = open.reduce((sum, row) => sum + row.weight, 0);
  const cashWeight = used > 0 ? intent.cash : 0;
  const coreWeight = Math.max(0, 1 - used - cashWeight);
  const reason = msg(
    "دفتر چرخه ساخته شد.",
    "The cycle book was built.",
  );
  const campaigns: Campaign[] = [
    coreCampaign(coreWeight, reason),
    ...(cashWeight > 0
      ? [
          {
            symbol: "USDT",
            name: "Tether",
            sleeve: "cash" as const,
            status: "open" as const,
            weight: cashWeight,
            entryUsd: 1,
            invalidationUsd: null,
            reason,
          },
        ]
      : []),
    ...open,
    ...(candidate && candidate.status !== "open" ? [candidate] : []),
  ];
  const lead = open[0];
  const verdict: SpotVerdict = lead
    ? {
        kind: "buy",
        symbol: lead.symbol,
        name: lead.name,
        priceUsd: lead.entryUsd,
        reachUsd: null,
        invalidationUsd: lead.invalidationUsd,
        reason,
      }
    : {
        kind: candidate?.status === "waiting" ? "wait" : "stay",
        symbol: "BTC",
        name: btcName,
        priceUsd: btcPrice,
        reachUsd,
        invalidationUsd: null,
        reason,
      };

  return pack({
    cash: cashWeight,
    btc: coreWeight,
    alt: used,
    names: open.map((row) => ({ symbol: row.symbol, name: row.name, weight: row.weight })),
    campaigns,
    candidate,
    verdict,
  });
}
