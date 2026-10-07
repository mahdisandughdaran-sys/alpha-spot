import { createServerFn } from "@tanstack/react-start";
import type { AnalysisResult } from "./types.ts";

export const runSpotAnalysis = createServerFn({ method: "POST" }).handler(
  async (): Promise<AnalysisResult> => {
    const { runAnalysis } = await import("./engine.server.ts");
    return runAnalysis();
  },
);
