import { t as createServerFn } from "./ssr.mjs";
import { t as buildAlphaStack } from "./alpha-stack-C9qd7R3T.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alpha-tape-CfLCgpr3.js
var PAIRS = [
	"BTCUSDT",
	"ETHUSDT",
	"SOLUSDT",
	"BNBUSDT",
	"XRPUSDT",
	"LINKUSDT"
];
var loadAlphaTape_createServerFn_handler = createServerRpc({
	id: "88179c77737b445156eab2075dbd88be85e0748569f675db1063a65b699aeec0",
	name: "loadAlphaTape",
	filename: "src/lib/crypto/alpha-tape.ts"
}, (opts) => loadAlphaTape.__executeServer(opts));
var loadAlphaTape = createServerFn({ method: "POST" }).validator((input) => {
	const pair = String(input?.pair ?? "BTCUSDT").toUpperCase();
	if (!PAIRS.includes(pair)) throw new Error("این جفت در پشته اسپات نیست.");
	return { pair };
}).handler(loadAlphaTape_createServerFn_handler, async ({ data }) => {
	const { loadSpotCandles } = await import("./spot-plan.server-C_OI8Vru.mjs");
	const candles = await loadSpotCandles(data.pair);
	if (candles.length < 40) throw new Error("کندل روزانه برای پشته اندیکاتور کافی نبود.");
	const last = candles[candles.length - 1];
	if (!last || !(last.c > 0)) throw new Error("قیمت این جفت نامعتبر بود.");
	return {
		pair: data.pair,
		symbol: data.pair.replace(/USDT$/, ""),
		price: last.c,
		fetchedAt: (/* @__PURE__ */ new Date()).toISOString(),
		stack: buildAlphaStack(candles)
	};
});
//#endregion
export { loadAlphaTape_createServerFn_handler };
