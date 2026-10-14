import { createServerFn } from "@tanstack/react-start";
import type { Horizon, WeightCuts } from "./lens.ts";
import type { AnalysisResult, FactorKey } from "./types.ts";
import { isVenue, type VenueId } from "./venues.ts";

const FACTORS: FactorKey[] = ["rs", "tokenomics", "entry", "trend", "liquidity", "risk", "narrative"];

export const runSpotAnalysis = createServerFn({ method: "POST" })
  .validator((input: { venue?: string; horizon?: string; cuts?: Record<string, unknown> }) => {
    if (!input || !isVenue(String(input.venue ?? ""))) throw new Error("صرافی نامعتبر است.");
    if (input.horizon !== "week" && input.horizon !== "month") throw new Error("افق نامعتبر است.");
    const cuts: WeightCuts = {};
    if (input.cuts && typeof input.cuts === "object") {
      for (const key of FACTORS) {
        const value = input.cuts[key];
        if (typeof value === "number" && Number.isFinite(value)) cuts[key] = value;
      }
    }
    return {
      venue: input.venue as VenueId,
      horizon: input.horizon as Horizon,
      cuts,
    };
  })
  .handler(async ({ data }): Promise<AnalysisResult> => {
    const { runAnalysis } = await import("./engine.server.ts");
    return runAnalysis(data);
  });
