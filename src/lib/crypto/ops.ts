import { createServerFn } from "@tanstack/react-start";
import type { BacktestReport } from "./backtest.ts";
import type { DispatchInput, DispatchResult } from "./dispatch.server.ts";
import type { PulseResult } from "./pulse.server.ts";
import { normalizeVenueCall, type VenueCall, type VenueResult } from "./venues.ts";

export const runSpotBacktest = createServerFn({ method: "POST" }).handler(
  async (): Promise<BacktestReport> => {
    const { runHistoricalBacktest } = await import("./backtest-data.server.ts");
    return runHistoricalBacktest();
  },
);

export const checkDeskPulse = createServerFn({ method: "POST" }).handler(
  async (): Promise<PulseResult> => {
    const { pulseBtc } = await import("./pulse.server.ts");
    return pulseBtc();
  },
);

export const dispatchDeskSignal = createServerFn({ method: "POST" })
  .validator((input: DispatchInput) => {
    if (!input || typeof input !== "object") throw new Error("پیام خالی است.");
    if (typeof input.title !== "string" || typeof input.text !== "string") {
      throw new Error("متن سیگنال ناقص است.");
    }
    if (!Array.isArray(input.orders)) throw new Error("سفارش‌ها نامعتبرند.");
    return input;
  })
  .handler(async ({ data }): Promise<DispatchResult> => {
    const { sendDeskSignal } = await import("./dispatch.server.ts");
    return sendDeskSignal(data);
  });

export const runVenue = createServerFn({ method: "POST" })
  .validator((input: VenueCall) => normalizeVenueCall(input))
  .handler(async ({ data }): Promise<VenueResult> => {
    const { executeVenue } = await import("./venues.server.ts");
    return executeVenue(data);
  });
