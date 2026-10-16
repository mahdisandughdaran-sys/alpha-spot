import { createServerFn } from "@tanstack/react-start";
import { getSpotAsset } from "./spot-assets.ts";
import type { SpotDesk } from "./spot-plan.server.ts";

export const loadSpotDesk = createServerFn({ method: "POST" })
  .validator((input: { assetId?: string }) => {
    const asset = getSpotAsset(String(input?.assetId ?? ""));
    if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
    if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
    return { assetId: asset.id };
  })
  .handler(async ({ data }): Promise<SpotDesk> => {
    const { loadSpotPlan } = await import("./spot-plan.server.ts");
    return loadSpotPlan(data.assetId);
  });
