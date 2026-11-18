import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { r as readChart } from "./ta-CFwhxRm-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ta.server-9Aq1FbVs.js
var TTL = 45e3;
var memory = /* @__PURE__ */ new Map();
async function fetchJson(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.6"
			}
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function candlesFrom(rows) {
	const out = [];
	for (const row of rows) {
		const open = Number(row[1]);
		const high = Number(row[2]);
		const low = Number(row[3]);
		const close = Number(row[4]);
		const volume = Number(row[5]);
		if (!(close > 0) || !(high >= low)) continue;
		out.push({
			t: Number(row[0]),
			open,
			high,
			low,
			close,
			volume: Number.isFinite(volume) ? volume : 0,
			closeTime: Number(row[6])
		});
	}
	return out;
}
async function fetchCandles(symbol, interval) {
	for (const host of ["https://data-api.binance.vision", "https://api.binance.com"]) {
		const rows = await fetchJson(`${host}/api/v3/klines?symbol=${symbol}USDT&interval=${interval}&limit=320`);
		if (!rows || !Array.isArray(rows)) continue;
		const candles = candlesFrom(rows);
		if (candles.length >= 40) return candles;
	}
	return null;
}
async function loadTa(symbol, interval) {
	const key = `${symbol}:${interval}`;
	const cached = memory.get(key);
	if (cached && Date.now() - cached.at < TTL) return cached.row;
	const candles = await fetchCandles(symbol, interval);
	if (!candles) throw new Error(msg("کندل این نماد از بایننس نیامد.", "Binance did not return candles for this symbol."));
	const read = readChart({
		symbol,
		interval,
		candles
	});
	if (!read) throw new Error(msg("کندل برای این خواندن کافی نیست.", "There are not enough candles for this reading."));
	memory.set(key, {
		at: Date.now(),
		row: read
	});
	return read;
}
//#endregion
export { loadTa };
