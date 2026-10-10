import { b as writeCache, f as readCache, s as evaluateKillSwitch } from "./kill-switch-Cnn3GgHf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pulse.server-BHMnurFQ.js
var BINANCE = "https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=220";
var KEY = "k:220:BTCUSDT";
var FRESH = 21600;
var STALE = 1209600;
function closesOf(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const c = Number(row[4]);
		if (Number.isFinite(c)) out.push(c);
	}
	return out;
}
async function loadRaw() {
	const fresh = await readCache(KEY, FRESH);
	if (fresh) try {
		return {
			raw: JSON.parse(fresh),
			fromCache: true
		};
	} catch {}
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 1e4);
	try {
		const res = await fetch(BINANCE, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.3"
			}
		});
		if (res.ok) {
			const raw = await res.json();
			await writeCache(KEY, JSON.stringify(raw));
			return {
				raw,
				fromCache: false
			};
		}
	} catch {} finally {
		clearTimeout(timer);
	}
	const stale = await readCache(KEY, STALE);
	if (!stale) return null;
	try {
		return {
			raw: JSON.parse(stale),
			fromCache: true
		};
	} catch {
		return null;
	}
}
async function pulseBtc() {
	const loaded = await loadRaw();
	const closes = loaded ? closesOf(loaded.raw) : [];
	const priceUsd = closes[closes.length - 1] ?? 0;
	const kill = evaluateKillSwitch({
		priceUsd,
		closes
	});
	return {
		at: (/* @__PURE__ */ new Date()).toISOString(),
		status: kill.status,
		priceUsd,
		headline: kill.headline,
		note: kill.note,
		fromCache: loaded?.fromCache ?? false
	};
}
//#endregion
export { pulseBtc };
