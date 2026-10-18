import type { VenueId } from "./venues.ts";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function baseOf(value: unknown): string | null {
  if (typeof value === "string" && /^[A-Za-z0-9]{2,15}$/.test(value)) return value.toUpperCase();
  const row = asRecord(value);
  if (!row) return null;
  const raw = row.id ?? row.symbol ?? row.code ?? row.name;
  return typeof raw === "string" ? baseOf(raw) : null;
}

function addBase(out: Set<string>, value: unknown) {
  const base = baseOf(value);
  if (base) out.add(base);
}

export function basesFromBinance(payload: unknown): string[] | null {
  const rows = Array.isArray(payload)
    ? payload
    : Array.isArray(asRecord(payload)?.symbols)
      ? (asRecord(payload)?.symbols as unknown[])
      : null;
  if (!rows) return null;
  const out = new Set<string>();
  for (const item of rows) {
    const rec = asRecord(item);
    if (!rec) continue;
    if (typeof rec.baseAsset === "string") {
      const quote = String(rec.quoteAsset ?? "");
      const status = String(rec.status ?? "TRADING");
      if (quote && quote !== "USDT") continue;
      if (status && status !== "TRADING") continue;
      addBase(out, rec.baseAsset);
      continue;
    }
    const symbol = String(rec.symbol ?? "");
    if (!symbol.endsWith("USDT")) continue;
    addBase(out, symbol.slice(0, -4));
  }
  return out.size ? [...out] : null;
}

export function basesFromBybit(payload: unknown): string[] | null {
  const result = asRecord(asRecord(payload)?.result);
  const list = Array.isArray(result?.list) ? result.list : Array.isArray(payload) ? payload : null;
  if (!list) return null;
  const out = new Set<string>();
  for (const item of list) {
    const rec = asRecord(item);
    if (!rec) continue;
    const quote = String(rec.quoteCoin ?? rec.quote ?? "USDT");
    const status = String(rec.status ?? "Trading");
    if (quote && quote !== "USDT") continue;
    if (status && status !== "Trading") continue;
    addBase(out, rec.baseCoin ?? rec.baseCoin ?? rec.base);
    if (!rec.baseCoin && typeof rec.symbol === "string" && rec.symbol.endsWith("USDT")) {
      addBase(out, rec.symbol.slice(0, -4));
    }
  }
  return out.size ? [...out] : null;
}

export function parseVenueBases(venue: VenueId, payload: unknown): string[] | null {
  if (venue === "binance") return basesFromBinance(payload);
  return basesFromBybit(payload);
}
