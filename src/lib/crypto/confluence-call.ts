import { createServerFn } from "@tanstack/react-start";
import type { ConfluenceReport } from "./confluence.ts";

export const readConfluence = createServerFn({ method: "POST" })
  .validator((input: { symbol?: string }) => {
    const symbol = (input?.symbol ?? "").trim().toUpperCase();
    if (!/^[A-Z0-9]{2,12}$/.test(symbol)) throw new Error("نماد نامعتبر است.");
    return { symbol };
  })
  .handler(async ({ data }): Promise<ConfluenceReport> => {
    const { loadConfluence } = await import("./confluence.server.ts");
    return loadConfluence(data.symbol);
  });
