import { createServerFn } from "@tanstack/react-start";
import type { SpotIntel } from "./intel.server.ts";

export type { RadarCoin, SpotIntel, WhalePrint } from "./intel.server.ts";

export const loadSpotIntel = createServerFn({ method: "GET" }).handler(async (): Promise<SpotIntel> => {
  const { buildSpotIntel } = await import("./intel.server.ts");
  return buildSpotIntel();
});
