import { decideBook, isListed } from "./book.ts";
import { msg } from "@/lib/i18n/lex";
import type { Horizon } from "./lens.ts";
import type { Opportunity } from "./opportunity.ts";
import type { BtcKillSwitch, CoinRow, Regime, SpotVerdict, VerdictKind } from "./types.ts";

export type { SpotVerdict, VerdictKind };
export { isListed };

export function verdictSentence(kind: VerdictKind): string {
  if (kind === "buy") return msg("قمر را باز کن", "Open the satellite");
  if (kind === "stay") return msg("هسته را نگه دار", "Hold the core");
  if (kind === "wait") return msg("هسته بماند، قمر منتظر محدوده", "Keep the core, satellite waits");
  return msg("هیچ‌چیز نخر", "Buy nothing");
}

/**
 * The sentence is the book. A hot RSI, a thin score lead, and a missed zone
 * do not send the book to cash. Cash is only the Bitcoin kill switch.
 */
export function buildVerdict(input: {
  ranked: CoinRow[];
  regime: Regime;
  kill: BtcKillSwitch;
  opportunities: Opportunity[];
  listed: Set<string> | null;
  horizon: Horizon;
  dominance?: number | null;
  dominancePrev?: number | null;
  satelliteEarned?: boolean;
  pauseSatellites?: boolean;
}): SpotVerdict {
  void input.regime;
  void input.horizon;
  const book = decideBook({
    ranked: input.ranked,
    kill: input.kill,
    dominance: input.dominance ?? null,
    dominancePrev: input.dominancePrev ?? null,
    opportunities: input.opportunities,
    listed: input.listed,
    satelliteEarned: input.satelliteEarned ?? false,
    pauseSatellites: input.pauseSatellites ?? false,
  });
  return book.verdict;
}
