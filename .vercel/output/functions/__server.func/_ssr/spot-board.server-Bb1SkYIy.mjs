import { t as buildSpotPlan } from "./spot-plan-CNe4MMcc.mjs";
import { n as rememberSpotNames, t as pickTopSpot } from "./spot-assets-CjnbgLce.mjs";
import { loadSpotCandles } from "./spot-plan.server-BDDx34LE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spot-board.server-Bb1SkYIy.js
var PAPRIKA = "https://api.coinpaprika.com/v1/tickers?quotes=USD&limit=250";
var GECKO = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=250&page=1&sparkline=false";
var PRICES = "https://data-api.binance.vision/api/v3/ticker/price";
var BOARD_TTL_MS = 12e4;
var boardCache = null;
async function loadTopSpotBoard(force = false) {
	if (!force && boardCache && Date.now() - boardCache.at < BOARD_TTL_MS) {
		rememberSpotNames(boardCache.value.rows.map((row) => ({
			id: row.assetId,
			nameFa: row.plan.nameFa,
			nameEn: row.plan.nameEn
		})));
		return boardCache.value;
	}
	const [ranked, bases] = await Promise.all([fetchRanked(), fetchUsdtBases()]);
	const source = ranked.rows.length > 0 ? "live" : "fallback";
	const candidates = pickTopSpot(ranked.rows, bases, 70);
	rememberSpotNames(candidates);
	const plans = await firstPlans(candidates, 50, 8);
	const rows = [];
	for (let i = 0; i < candidates.length && rows.length < 50; i++) {
		const plan = plans[i];
		const asset = candidates[i];
		if (!plan || !asset) continue;
		rows.push({
			rank: rows.length + 1,
			marketRank: asset.marketRank,
			assetId: asset.id,
			plan
		});
	}
	if (rows.length < 20) throw new Error("تحلیل پنجاه ارز اول کامل نشد. کمی بعد دوباره بزن.");
	const value = {
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		source,
		feed: ranked.feed,
		rows
	};
	rememberSpotNames(rows.map((row) => ({
		id: row.assetId,
		nameFa: row.plan.nameFa,
		nameEn: row.plan.nameEn
	})));
	boardCache = {
		at: Date.now(),
		value
	};
	return value;
}
async function firstPlans(assets, want, workers) {
	const results = new Array(assets.length).fill(null);
	let next = 0;
	let ok = 0;
	async function run() {
		while (ok < want && next < assets.length) {
			const index = next;
			next += 1;
			const asset = assets[index];
			if (!asset) continue;
			try {
				const candles = await loadSpotCandles(asset.pair);
				if (candles.length < 20) continue;
				results[index] = buildSpotPlan(candles, asset);
				ok += 1;
			} catch {}
		}
	}
	const count = Math.min(workers, assets.length);
	await Promise.all(Array.from({ length: count }, () => run()));
	return results;
}
async function fetchRanked() {
	try {
		const rows = readPaprika(await fetchJson(PAPRIKA));
		if (rows.length >= 50) return {
			rows,
			feed: "CoinPaprika"
		};
	} catch {}
	try {
		const rows = readGecko(await fetchJson(GECKO));
		if (rows.length >= 50) return {
			rows,
			feed: "CoinGecko"
		};
	} catch {}
	return {
		rows: [],
		feed: "fallback"
	};
}
async function fetchUsdtBases() {
	try {
		const raw = await fetchJson(PRICES);
		if (!Array.isArray(raw)) return null;
		const bases = /* @__PURE__ */ new Set();
		for (const item of raw) {
			if (!item || typeof item !== "object") continue;
			const symbol = String(item.symbol ?? "");
			if (!symbol.endsWith("USDT")) continue;
			bases.add(symbol.slice(0, -4));
		}
		return bases.size > 0 ? bases : null;
	} catch {
		return null;
	}
}
async function fetchJson(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.5"
			}
		});
		if (!res.ok) throw new Error(String(res.status));
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
function readPaprika(raw) {
	if (!Array.isArray(raw)) return [];
	const rows = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const symbol = String(row.symbol ?? "").toUpperCase();
		const rank = Number(row.rank);
		if (!symbol || !Number.isFinite(rank) || rank <= 0) continue;
		rows.push({
			symbol,
			name: String(row.name ?? symbol),
			rank
		});
	}
	return rows;
}
function readGecko(raw) {
	if (!Array.isArray(raw)) return [];
	const rows = [];
	for (const item of raw) {
		if (!item || typeof item !== "object") continue;
		const row = item;
		const symbol = String(row.symbol ?? "").toUpperCase();
		const rank = Number(row.market_cap_rank);
		if (!symbol || !Number.isFinite(rank) || rank <= 0) continue;
		rows.push({
			symbol,
			name: String(row.name ?? symbol),
			rank
		});
	}
	return rows;
}
//#endregion
export { loadTopSpotBoard };
