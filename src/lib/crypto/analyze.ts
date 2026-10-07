import { createServerFn } from "@tanstack/react-start";
import type { AnalysisResult } from "./types";

export const runSpotAnalysis = createServerFn({ method: "POST" }).handler(
  async (): Promise<AnalysisResult> => {
    const { runAnalysis } = await import("./engine.server");
    return runAnalysis();
  },
);
