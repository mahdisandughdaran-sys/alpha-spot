import { createServerFn } from "@tanstack/react-start";
import { resolveSpotAsset } from "./spot-assets.ts";
import type { SpotBoard } from "./spot-board.server.ts";
import type { SpotDesk } from "./spot-plan.server.ts";

export type { SpotBoard, SpotBoardRow } from "./spot-board.server.ts";

export const loadSpotDesk = createServerFn({ method: "POST" })
  .validator((input: { assetId?: string }) => {
    const asset = resolveSpotAsset(String(input?.assetId ?? ""));
    if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
    if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
    return { assetId: asset.id };
  })
  .handler(async ({ data }): Promise<SpotDesk> => {
    const { loadSpotPlan } = await import("./spot-plan.server.ts");
    return loadSpotPlan(data.assetId);
  });

export const loadSpotBoard = createServerFn({ method: "POST" })
  .validator((input: { force?: boolean } | undefined) => ({
    force: Boolean(input?.force),
  }))
  .handler(async ({ data }): Promise<SpotBoard> => {
    const { loadTopSpotBoard } = await import("./spot-board.server.ts");
    return loadTopSpotBoard(data.force);
  });
