//#region node_modules/.nitro/vite/services/ssr/assets/fx.server-DX5u_5Xs.js
var cache = null;
async function loadUsdtToman() {
	const now = Date.now();
	if (cache && now - cache.at < 6e4 && cache.rate.toman) return cache.rate;
	const nobitex = await readNobitex();
	const toman = nobitex ?? await readWallex();
	const rate = {
		toman,
		source: nobitex ? "Nobitex" : toman ? "Wallex" : null,
		at: (/* @__PURE__ */ new Date()).toISOString()
	};
	cache = {
		at: toman ? now : now - 45e3,
		rate
	};
	return rate;
}
async function readNobitex() {
	const fromBook = tomanFromRial(pick(await getJson("https://apiv2.nobitex.ir/v3/orderbook/USDTIRT"), "lastTradePrice"));
	if (fromBook) return fromBook;
	const pair = pick(pick(await getJson("https://apiv2.nobitex.ir/market/stats?srcCurrency=usdt&dstCurrency=rls"), "stats"), "usdt-rls");
	return tomanFromRial(pick(pair, "latest") ?? pick(pair, "bestSell"));
}
async function readWallex() {
	const result = pick(await getJson("https://api.wallex.ir/v1/markets"), "result");
	const symbols = pick(result, "symbols") ?? result;
	const row = pick(symbols, "USDTTMN") ?? pick(symbols, "USDTIRT") ?? pick(symbols, "USDTIRR");
	const last = pick(pick(row, "stats"), "lastPrice") ?? pick(row, "lastPrice") ?? pick(row, "price");
	const n = Number(last);
	if (!(n > 1e3)) return null;
	return n > 2e5 ? Math.round(n / 10) : Math.round(n);
}
function pick(value, key) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return void 0;
	return value[key];
}
function tomanFromRial(raw) {
	const n = Number(raw);
	if (!(n > 1e4)) return null;
	return Math.round(n / 10);
}
async function getJson(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 4500);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.5"
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
//#endregion
export { loadUsdtToman };
