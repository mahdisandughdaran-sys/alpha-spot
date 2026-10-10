import { VENUES, type QuoteCcy, type VenueId } from "./venues.ts";

const KEY = "alpha-spot-venues-v1";

export type VenueVault = {
  venue: VenueId;
  key: string;
  secret: string;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  notionalUsd: number;
};

export const emptyVault: VenueVault = {
  venue: "nobitex",
  key: "",
  secret: "",
  quote: "USDT",
  tomanPerUsdt: 0,
  notionalUsd: 100,
};

export function loadVault(): VenueVault {
  if (typeof localStorage === "undefined") return emptyVault;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptyVault;
    const parsed = JSON.parse(raw) as Partial<VenueVault>;
    const venue = VENUES.includes(parsed.venue as VenueId) ? (parsed.venue as VenueId) : "nobitex";
    const quote: QuoteCcy = parsed.quote === "IRT" ? "IRT" : "USDT";
    return {
      ...emptyVault,
      venue,
      quote,
      key: typeof parsed.key === "string" ? parsed.key : "",
      secret: typeof parsed.secret === "string" ? parsed.secret : "",
      notionalUsd: Number(parsed.notionalUsd) || 100,
      tomanPerUsdt: Number(parsed.tomanPerUsdt) || 0,
    };
  } catch {
    return emptyVault;
  }
}

export function saveVault(next: VenueVault): void {
  localStorage.setItem(KEY, JSON.stringify(next));
}
