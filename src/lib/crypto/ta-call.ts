import { createServerFn } from "@tanstack/react-start";
import { msg } from "@/lib/i18n/lex";
import { normalizeSymbol, type IntervalId, type TaRead } from "./ta.ts";

export const loadTechnical = createServerFn({ method: "POST" })
  .validator((input: { symbol?: string; interval?: string }) => {
    const symbol = normalizeSymbol(String(input?.symbol ?? ""));
    if (!symbol) throw new Error(msg("نماد نامعتبر است.", "That symbol is not valid."));
    const interval = input?.interval;
    if (interval !== "4h" && interval !== "1d" && interval !== "1w") {
      throw new Error(msg("بازه نامعتبر است.", "That timeframe is not valid."));
    }
    return { symbol, interval: interval as IntervalId };
  })
  .handler(async ({ data }): Promise<TaRead> => {
    const { loadTa } = await import("./ta.server.ts");
    return loadTa(data.symbol, data.interval);
  });
