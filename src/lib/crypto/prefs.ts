import type { Horizon } from "./lens.ts";
import type { VenueId } from "./venues.ts";
import { isVenue } from "./venues.ts";

const KEY = "alpha-spot-prefs-v1";

export type DeskPrefs = {
  venue: VenueId;
  horizon: Horizon;
};

function canStore(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function loadPrefs(): DeskPrefs | null {
  if (!canStore()) return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DeskPrefs;
    if (!parsed || !isVenue(parsed.venue)) return null;
    if (parsed.horizon !== "week" && parsed.horizon !== "month") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function savePrefs(prefs: DeskPrefs) {
  if (!canStore()) return;
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* quota */
  }
}
