import { createServerFn } from "@tanstack/react-start";
import { buildAlphaStack, type AlphaStack } from "./alpha-stack.ts";

const PAIRS = ["BTCUSDT", "ETHUSDT", "SOLUSDT", "BNBUSDT", "XRPUSDT", "LINKUSDT"] as const;

export type AlphaTape = {
  pair: string;
  symbol: string;
  price: number;
  fetchedAt: string;
  stack: AlphaStack;
};

export const loadAlphaTape = createServerFn({ method: "POST" })
  .validator((input: { pair?: string } | undefined) => {
    const pair = String(input?.pair ?? "BTCUSDT").toUpperCase();
    if (!(PAIRS as readonly string[]).includes(pair)) throw new Error("این جفت در پشته اسپات نیست.");
    return { pair };
  })
  .handler(async ({ data }): Promise<AlphaTape> => {
    const { loadSpotCandles } = await import("./spot-plan.server.ts");
    const candles = await loadSpotCandles(data.pair);
    if (candles.length < 40) throw new Error("کندل روزانه برای پشته اندیکاتور کافی نبود.");
    const last = candles[candles.length - 1];
    if (!last || !(last.c > 0)) throw new Error("قیمت این جفت نامعتبر بود.");
    return {
      pair: data.pair,
      symbol: data.pair.replace(/USDT$/, ""),
      price: last.c,
      fetchedAt: new Date().toISOString(),
      stack: buildAlphaStack(candles),
    };
  });
