const DB = "alpha-spot";
const STORE = "holds";

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "check") event.waitUntil(checkPrices());
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "spot-watch") event.waitUntil(checkPrices());
});

function openDb() {
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

async function readRows() {
  const db = await openDb();
  const rows = await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const req = tx.objectStore(STORE).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
  db.close();
  return rows;
}

async function putRow(row) {
  const db = await openDb();
  await new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(row);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function checkPrices() {
  const windows = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
  if (windows.length) return;
  const rows = await readRows();
  for (const row of rows) {
    if (!row || row.closed) continue;
    const base = row.binanceBase || row.symbol;
    let price = 0;
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${base}USDT`);
      if (res.ok) {
        const body = await res.json();
        price = Number(body.price);
      }
    } catch {
      price = 0;
    }
    if (!(price > 0)) continue;
    const hit = decide(row, price);
    if (!hit) continue;
    await putRow(hit.next);
    try {
      await self.registration.showNotification(hit.title, { body: hit.body, tag: `${row.symbol}:${hit.kind}` });
    } catch {
      /* permission missing */
    }
    await sendTelegram(row, hit.title, hit.body);
  }
}

function decide(row, price) {
  if (price <= row.invalidationUsd) {
    return {
      kind: "stop",
      title: `${row.symbol} باطل شد`,
      body: `قیمت به ابطال رسید. ماندهٔ ${row.symbol} را بفروش.`,
      next: { ...row, closed: true, exitNote: "invalidation" },
    };
  }
  if (!row.targetSold && row.targetUsd > 0 && price >= row.targetUsd) {
    const left = row.qty * (1 - (row.targetFraction || 1 / 3));
    return {
      kind: "target",
      title: `${row.symbol} به هدف رسید`,
      body: `یک‌سوم ${row.symbol} را لیمیت بفروش. بقیه تا ابطال می‌ماند.`,
      next: { ...row, targetSold: true, qty: left, sizeUsd: left * row.entryUsd },
    };
  }
  return null;
}

async function sendTelegram(row, title, text) {
  if (!row.telegramToken || !row.telegramChat) return;
  try {
    await fetch(`https://api.telegram.org/bot${row.telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: row.telegramChat,
        text: `${title}\n${text}`,
      }),
    });
  } catch {
    /* offline */
  }
}
