import { t as buildSpotPlan } from "./spot-plan-Dc7G_xLN.mjs";
import { r as resolveSpotAsset } from "./spot-assets-BHAayhSJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spot-plan.server-BGMFTT4G.js
var BINANCE = "https://data-api.binance.vision/api/v3/klines";
var TTL_MS = 12e4;
var memory = /* @__PURE__ */ new Map();
async function loadSpotPlan(assetId) {
	const asset = resolveSpotAsset(assetId);
	if (!asset || !asset.enabled) throw new Error("این ارز هنوز روی میز اسپات فعال نشده.");
	const candles = await loadSpotCandles(asset.pair);
	if (candles.length < 20) throw new Error("کندل روزانه این جفت از بایننس کامل نرسید.");
	return {
		assetId: asset.id,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		plan: buildSpotPlan(candles, asset)
	};
}
async function loadSpotCandles(pair) {
	const hit = memory.get(pair);
	if (hit && Date.now() - hit.at < TTL_MS) return hit.candles;
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 12e3);
	try {
		const res = await fetch(`${BINANCE}?symbol=${pair}&interval=1d&limit=240`, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.5"
			}
		});
		if (!res.ok) throw new Error(`بایننس پاسخ ${res.status} داد.`);
		const candles = parseKlines(await res.json());
		if (candles.length >= 20) memory.set(pair, {
			at: Date.now(),
			candles
		});
		return candles;
	} catch (err) {
		if (hit && hit.candles.length >= 20) return hit.candles;
		throw err instanceof Error ? err : /* @__PURE__ */ new Error("داده بازار نرسید.");
	} finally {
		clearTimeout(timer);
	}
}
function parseKlines(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		if (!Array.isArray(row) || row.length < 6) continue;
		const candle = {
			t: Number(row[0]),
			o: Number(row[1]),
			h: Number(row[2]),
			l: Number(row[3]),
			c: Number(row[4]),
			v: Number(row[5])
		};
		if (!Object.values(candle).every(Number.isFinite)) continue;
		if (!(candle.c > 0) || candle.h < candle.l) continue;
		out.push(candle);
	}
	return out;
}
//#endregion
export { loadSpotCandles, loadSpotPlan };
