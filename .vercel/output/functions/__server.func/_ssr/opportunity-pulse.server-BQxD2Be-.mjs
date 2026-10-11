//#region node_modules/.nitro/vite/services/ssr/assets/opportunity-pulse.server-BQxD2Be-.js
var BINANCE = "https://data-api.binance.vision/api/v3";
var cache = null;
async function quoteSpot(symbols) {
	const now = Date.now();
	if (!cache || now - cache.at > 2e4) {
		const ctrl = new AbortController();
		const timer = setTimeout(() => ctrl.abort(), 8e3);
		try {
			const res = await fetch(`${BINANCE}/ticker/price`, {
				signal: ctrl.signal,
				headers: {
					Accept: "application/json",
					"User-Agent": "AlphaSpot/1.4"
				}
			});
			if (!res.ok) return [];
			const json = await res.json();
			if (!Array.isArray(json)) return [];
			const rows = [];
			for (const row of json) {
				if (!row.symbol?.endsWith("USDT")) continue;
				const symbol = row.symbol.slice(0, -4);
				const price = Number(row.price);
				if (!/^[A-Z0-9]{2,15}$/.test(symbol) || !(price > 0)) continue;
				rows.push({
					symbol,
					price
				});
			}
			cache = {
				at: now,
				rows
			};
		} catch {
			return [];
		} finally {
			clearTimeout(timer);
		}
	}
	const want = new Set(symbols);
	return (cache?.rows ?? []).filter((row) => want.has(row.symbol));
}
//#endregion
export { quoteSpot };
