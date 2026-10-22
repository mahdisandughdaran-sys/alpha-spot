import { createServerFn } from "@tanstack/react-start";
import type { BacktestReport } from "./backtest.ts";
import type { DispatchInput, DispatchResult } from "./dispatch.server.ts";
import type { OpportunityBacktestReport } from "./opportunity-backtest.ts";
import type { PulseResult } from "./pulse.server.ts";
import type { MacroDesk } from "./macro.ts";
import type { UsdtRate } from "./fx.server.ts";
import { normalizeVenueCall, type VenueCall, type VenueResult } from "./venues.ts";

export const runSpotBacktest = createServerFn({ method: "POST" }).handler(
  async (): Promise<BacktestReport> => {
    const { runHistoricalBacktest } = await import("./backtest-data.server.ts");
    return runHistoricalBacktest();
  },
);

export const runOpportunityBacktest = createServerFn({ method: "POST" }).handler(
  async (): Promise<OpportunityBacktestReport> => {
    const { runOpportunityHistory } = await import("./backtest-data.server.ts");
    return runOpportunityHistory();
  },
);

export const checkOpportunityQuotes = createServerFn({ method: "POST" })
  .validator((input: { symbols: string[] }) => {
    if (!input || !Array.isArray(input.symbols)) throw new Error("نمادها نامعتبرند.");
    return {
      symbols: input.symbols
        .filter((symbol) => typeof symbol === "string" && /^[A-Z0-9]{2,15}$/.test(symbol))
        .slice(0, 40),
    };
  })
  .handler(async ({ data }) => {
    const { quoteSpot } = await import("./opportunity-pulse.server.ts");
    return quoteSpot(data.symbols);
  });

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

export const loadMacroDesk = createServerFn({ method: "GET" }).handler(async (): Promise<MacroDesk> => {
  const { loadMacroNews } = await import("./macro-news.server.ts");
  return loadMacroNews();
});

export const loadUsdtRate = createServerFn({ method: "GET" }).handler(async (): Promise<UsdtRate> => {
  const { loadUsdtToman } = await import("./fx.server.ts");
  return loadUsdtToman();
});

export const runVenue = createServerFn({ method: "POST" })
  .validator((input: VenueCall) => normalizeVenueCall(input))
  .handler(async ({ data }): Promise<VenueResult> => {
    const { executeVenue } = await import("./venues.server.ts");
    return executeVenue(data);
  });
