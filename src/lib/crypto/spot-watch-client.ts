import { loadDeskSettings } from "./desk-client.ts";
import { evaluateWatch, loadHeld, saveHeld, type HeldSpot, type WatchHit } from "./held-spot.ts";

const DB = "alpha-spot";
const STORE = "holds";

type Armed = HeldSpot & {
  telegramToken?: string;
  telegramChat?: string;
  webhookUrl?: string;
};

export async function syncWatchStore(rows: HeldSpot[]): Promise<void> {
  if (typeof indexedDB === "undefined") return;
  const settings = loadDeskSettings();
  const armed: Armed[] = rows
    .filter((row) => !row.closed)
    .map((row) => ({
      ...row,
      telegramToken: settings.telegramToken,
      telegramChat: settings.telegramChat,
      webhookUrl: settings.webhookUrl,
    }));
  await writeAll(armed);
  await registerWatch();
}

export async function armWatchAlerts(): Promise<"granted" | "denied" | "default" | "unsupported"> {
  if (typeof window === "undefined" || typeof Notification === "undefined") return "unsupported";
  const perm = await Notification.requestPermission();
  await registerWatch();
  return perm;
}

export function applyWatch(
  prices: Record<string, number>,
  killFlat: boolean,
): { hits: WatchHit[]; changed: boolean } {
  const rows = loadHeld();
  const { next, hits } = evaluateWatch(rows, prices, killFlat);
  const changed = JSON.stringify(next) !== JSON.stringify(rows);
  if (changed) {
    saveHeld(next);
    void syncWatchStore(next);
  }
  return { hits, changed };
}

async function registerWatch(): Promise<void> {
  if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
  try {
    const reg = await navigator.serviceWorker.register("/spot-watch-sw.js");
    const periodic = reg as ServiceWorkerRegistration & {
      periodicSync?: { register: (tag: string, opts: { minInterval: number }) => Promise<void> };
    };
    if (periodic.periodicSync && typeof Notification !== "undefined" && Notification.permission === "granted") {
      try {
        await periodic.periodicSync.register("spot-watch", { minInterval: 15 * 60 * 1000 });
      } catch {
        /* not an installed app, or this browser has no periodic sync */
      }
    }
    reg.active?.postMessage({ type: "check" });
  } catch {
    /* the preview frame may block the worker */
  }
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "symbol" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function writeAll(rows: Armed[]): Promise<void> {
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    store.clear();
    for (const row of rows) store.put(row);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}
