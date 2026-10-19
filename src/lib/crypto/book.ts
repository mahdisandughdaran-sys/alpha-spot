import { msg, splitBi } from "@/lib/i18n/lex";
import { candidateBases } from "./exclusions.ts";
import { weeklyFromDaily } from "./math.ts";
import type { Opportunity } from "./opportunity.ts";
import type { BtcKillSwitch, CoinRow, SpotVerdict } from "./types.ts";

/** Together, satellites stay under one third of capital. Not a fitted weight. */
export const SATELLITE_CAP = 0.32;
export const SATELLITE_MAX = 2;
/** Fraction of capital risked to the locked invalidation. */
export const RISK_FRACTION = 0.01;
export const VOLUME_FLOOR = 8_000_000;
/** Free float below this is a veto, not a score. */
export const FLOAT_VETO = 0.35;
/** Dominance must be lower than ~30 days earlier by this many points. Not the 7-day median. */
export const DOMINANCE_DROP = 0.25;

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
  if (kill.status === "SUSPENDED") return "cash";
  const broken =
    kill.weeklySupportBroken || kill.severeWeekly || kill.weeklyStructure === "bear";
  if (kill.aboveEma200 === true && !broken) return "core";
  return "defend";
}

export function dominanceIsFalling(now: number | null, prev: number | null): boolean {
  if (now == null || prev == null) return false;
  if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
  return now < prev - DOMINANCE_DROP;
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

/**
 * One book. Core is Bitcoin. Cash is only the kill switch.
 * A satellite is at most two names and never the book.
 */
export function decideBook(input: {
  ranked: CoinRow[];
  kill: BtcKillSwitch;
  dominance: number | null;
  dominancePrev: number | null;
  opportunities: Opportunity[];
  listed: Set<string> | null;
  satelliteEarned: boolean;
  /** Holiday and similar: do not open a new satellite. The core stays. */
  pauseSatellites?: boolean;
}): SpotBook {
  const btc = input.ranked.find((row) => row.symbol === "BTC");
  const mode = bookMode(input.kill);
  const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
  const btcName = btc?.name ?? "Bitcoin";
  const btcPrice = btc?.priceUsd ?? input.kill.priceUsd ?? null;

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
      "هیچ‌چیز نخر. کلید قطع روشن است: قیمت زیر میانگین ۲۰۰روزه است و ساختار هفتگی شکسته. آلت صفر است و دفتر به تتر می‌رود.",
      "Buy nothing. The kill switch is on: price is under the 200-day average and weekly structure is broken. Alts are zero and the book is in tether.",
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
    return {
      mode: "cash",
      satelliteEarned: input.satelliteEarned,
      dominanceFalling: falling,
      coreWeight: 0,
      satelliteWeight: 0,
      cashWeight: 1,
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
    };
  }

  const structural = input.ranked
    .filter((row) => row.symbol !== "BTC" && spotVeto(row, input.listed) == null)
    .filter((row) => row.aboveSma === true && !row.pairSupportBroken && row.pairWeekly !== "bear")
    .sort((a, b) => b.score - a.score);

  const gatesOpen = mode === "core" && falling;
  const pool = gatesOpen ? structural.slice(0, SATELLITE_MAX) : [];

  let reachUsd: number | null = null;
  let candidate: Campaign | null = null;
  const open: Campaign[] = [];
  let used = 0;

  for (const row of pool) {
    const opp = input.opportunities.find((item) => item.symbol === row.symbol);
    const zone = opp?.zone;
    const waiting = !inZone(opp);
    if (waiting) {
      if (!candidate) {
        reachUsd = zone && zone.low > 0 ? (row.priceUsd > zone.high ? zone.high : zone.low) : null;
        candidate = {
          symbol: row.symbol,
          name: row.name,
          sleeve: "satellite",
          status: "waiting",
          weight: 0,
          entryUsd: null,
          invalidationUsd: zone?.invalidation ?? null,
          reason: msg(
            `${row.symbol} چهار دروازهٔ قمر را دارد ولی هنوز در محدوده نیست. هسته دست نمی‌خورد.`,
            `${row.symbol} has cleared the four satellite gates but is not in the zone. The core stays put.`,
          ),
        };
      }
      continue;
    }
    const invalidation = zone?.invalidation ?? null;
    const weight = invalidation != null ? sizeFor(row.priceUsd, invalidation) : null;
    if (weight == null || input.pauseSatellites || !input.satelliteEarned) {
      if (!candidate) {
        candidate = {
          symbol: row.symbol,
          name: row.name,
          sleeve: "satellite",
          status: "waiting",
          weight: 0,
          entryUsd: row.priceUsd,
          invalidationUsd: invalidation,
          reason: !input.satelliteEarned
            ? msg(
                `${row.symbol} در محدوده است، ولی قمر خاموش است تا روی بازهٔ دست‌نخورده خط پایه را ببرد.`,
                `${row.symbol} is in the zone, but the satellite stays off until it beats the baseline on the untouched window.`,
              )
            : msg(
                `${row.symbol} در محدوده است، ولی امروز قمر تازه باز نمی‌شود.`,
                `${row.symbol} is in the zone, but a new satellite does not open today.`,
              ),
        };
        reachUsd = zone ? (row.priceUsd > zone.high ? zone.high : zone.low) : null;
      }
      continue;
    }
    const room = Math.max(0, SATELLITE_CAP - used);
    const sized = Math.min(weight, room);
    if (!(sized > 0.01)) continue;
    used += sized;
    const campaign: Campaign = {
      symbol: row.symbol,
      name: row.name,
      sleeve: "satellite",
      status: "open",
      weight: sized,
      entryUsd: row.priceUsd,
      invalidationUsd: invalidation,
      reason: msg(
        `${row.symbol} قمر است، نه هسته. ابطال روی ${invalidation?.toFixed(4)} قفل شد. به بازنده اضافه نکن.`,
        `${row.symbol} is a satellite, not the core. Invalidation is locked at ${invalidation?.toFixed(4)}. Do not add to a loser.`,
      ),
    };
    open.push(campaign);
    if (!candidate) candidate = campaign;
  }

  if (!candidate && mode === "core" && !falling) {
    const named = structural[0];
    if (named) {
      candidate = {
        symbol: named.symbol,
        name: named.name,
        sleeve: "satellite",
        status: "empty",
        weight: 0,
        entryUsd: null,
        invalidationUsd: null,
        reason: msg(
          "دامیننس بیت‌کوین در حال افت نیست. میانهٔ ۷روزه برای باز کردن قمر کافی نیست.",
          "Bitcoin dominance is not falling. A 7-day median is not enough to open a satellite.",
        ),
      };
    }
  }

  const coreWeight = 1 - used;
  const holdReason =
    mode === "defend"
      ? msg(
          "هسته را نگه دار. یکی از دو شرط روند بیت‌کوین غایب است، ولی کلید قطع روشن نیست. این نقد شدن نیست و RSI داغ هم دلیل خروج نیست.",
          "Hold the core. One of Bitcoin’s two trend conditions is missing, but the kill switch is off. This is not cash, and a hot RSI is not an exit.",
        )
      : open.length > 0
        ? msg(
            `هسته بیت‌کوین است (${Math.round(coreWeight * 100)}٪). قمر: ${open.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}٪`).join("، ")}. خروج قمر فقط با ابطال، شکست ساختار هفتگی جفت، یا کلید قطع.`,
            `The core is Bitcoin (${Math.round(coreWeight * 100)}%). Satellite: ${open.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}%`).join(", ")}. A satellite exits only on invalidation, a weekly pair-structure break, or the kill switch.`,
          )
        : candidate?.status === "waiting"
          ? msg(
              `هسته را نگه دار: بیت‌کوین. ${splitBi(candidate.reason).fa}`,
              `Hold the core: Bitcoin. ${splitBi(candidate.reason).en ?? splitBi(candidate.reason).fa}`,
            )
          : msg(
              "هسته را نگه دار: بیت‌کوین. بالای میانگین ۲۰۰روزه و ساختار هفتگی نشکسته. لازم نیست به ناحیهٔ RSI برسد و نزدیکی به سقف دلیل نقد شدن نیست.",
              "Hold the core: Bitcoin. Price is above the 200-day average and weekly structure is not broken. It does not need an RSI zone, and trading near the high is not a reason to go to cash.",
            );

  const campaigns: Campaign[] = [
    coreCampaign(coreWeight, holdReason),
    ...open,
    ...(candidate && candidate.status !== "open" ? [candidate] : []),
  ];

  return {
    mode,
    satelliteEarned: input.satelliteEarned,
    dominanceFalling: falling,
    coreWeight,
    satelliteWeight: used,
    cashWeight: 0,
    campaigns,
    candidate,
    verdict: {
      kind: candidate?.status === "waiting" ? "wait" : "stay",
      symbol: "BTC",
      name: btcName,
      priceUsd: btcPrice,
      reachUsd,
      invalidationUsd: open[0]?.invalidationUsd ?? null,
      reason: holdReason,
    },
  };
}
