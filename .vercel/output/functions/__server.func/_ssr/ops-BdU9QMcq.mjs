import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { o as normalizeVenueCall } from "./venues-XIXD-v6f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-BdU9QMcq.js
var runSpotBacktest_createServerFn_handler = createServerRpc({
	id: "b5f74dffff4b6c35ce44b7129d8d5ebb42b2ff29c152c819a7d42fa5ca8fc035",
	name: "runSpotBacktest",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => runSpotBacktest.__executeServer(opts));
var runSpotBacktest = createServerFn({ method: "POST" }).handler(runSpotBacktest_createServerFn_handler, async () => {
	const { runHistoricalBacktest } = await import("./backtest-data.server-CN8Gxp1u.mjs");
	return runHistoricalBacktest();
});
var runOpportunityBacktest_createServerFn_handler = createServerRpc({
	id: "5469c7ef2b6a0c6da8b20e30389ebaa2b621913c5d8e6fe0888226964b424d35",
	name: "runOpportunityBacktest",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => runOpportunityBacktest.__executeServer(opts));
var runOpportunityBacktest = createServerFn({ method: "POST" }).handler(runOpportunityBacktest_createServerFn_handler, async () => {
	const { runOpportunityHistory } = await import("./backtest-data.server-CN8Gxp1u.mjs");
	return runOpportunityHistory();
});
var checkOpportunityQuotes_createServerFn_handler = createServerRpc({
	id: "3d750ceb230c06ac4407a1ae107889436f44c8752c9c19bf5d7306a2a4e8cff8",
	name: "checkOpportunityQuotes",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => checkOpportunityQuotes.__executeServer(opts));
var checkOpportunityQuotes = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || !Array.isArray(input.symbols)) throw new Error("نمادها نامعتبرند.");
	return { symbols: input.symbols.filter((symbol) => typeof symbol === "string" && /^[A-Z0-9]{2,15}$/.test(symbol)).slice(0, 40) };
}).handler(checkOpportunityQuotes_createServerFn_handler, async ({ data }) => {
	const { quoteSpot } = await import("./opportunity-pulse.server-BQxD2Be-.mjs");
	return quoteSpot(data.symbols);
});
var checkDeskPulse_createServerFn_handler = createServerRpc({
	id: "2430eb14739b94c669f882053cb7ce0e872ee809f7eb597b1f6e667f4e495a81",
	name: "checkDeskPulse",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => checkDeskPulse.__executeServer(opts));
var checkDeskPulse = createServerFn({ method: "POST" }).handler(checkDeskPulse_createServerFn_handler, async () => {
	const { pulseBtc } = await import("./pulse.server-BT7qSsG2.mjs");
	return pulseBtc();
});
var dispatchDeskSignal_createServerFn_handler = createServerRpc({
	id: "d6d9cdc69038feacef9008e70b9d27c67fb1b102a7bbc2e3a99d3ce283b3fa4b",
	name: "dispatchDeskSignal",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => dispatchDeskSignal.__executeServer(opts));
var dispatchDeskSignal = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("پیام خالی است.");
	if (typeof input.title !== "string" || typeof input.text !== "string") throw new Error("متن سیگنال ناقص است.");
	if (!Array.isArray(input.orders)) throw new Error("سفارش‌ها نامعتبرند.");
	return input;
}).handler(dispatchDeskSignal_createServerFn_handler, async ({ data }) => {
	const { sendDeskSignal } = await import("./dispatch.server-edEL48uf.mjs");
	return sendDeskSignal(data);
});
var loadMacroDesk_createServerFn_handler = createServerRpc({
	id: "f697a98ee6b797ad586422b6949d2f49da1bb56769cc8f2a69c205e8d833816f",
	name: "loadMacroDesk",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => loadMacroDesk.__executeServer(opts));
var loadMacroDesk = createServerFn({ method: "GET" }).handler(loadMacroDesk_createServerFn_handler, async () => {
	const { loadMacroNews } = await import("./macro-news.server-D75KrM5L.mjs");
	return loadMacroNews();
});
var loadUsdtRate_createServerFn_handler = createServerRpc({
	id: "1a57782f2dbce6bdc548c7ca19f206e1ca080c248a41081285d461f214d83626",
	name: "loadUsdtRate",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => loadUsdtRate.__executeServer(opts));
var loadUsdtRate = createServerFn({ method: "GET" }).handler(loadUsdtRate_createServerFn_handler, async () => {
	const { loadUsdtToman } = await import("./fx.server-DX5u_5Xs.mjs");
	return loadUsdtToman();
});
var runVenue_createServerFn_handler = createServerRpc({
	id: "eed7d3073443c33758c00a8a490ad465452ee6d3f46e47d1fde88dd2a65e227a",
	name: "runVenue",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => runVenue.__executeServer(opts));
var runVenue = createServerFn({ method: "POST" }).validator((input) => normalizeVenueCall(input)).handler(runVenue_createServerFn_handler, async ({ data }) => {
	const { executeVenue } = await import("./venues.server-BrgNzjci.mjs");
	return executeVenue(data);
});
//#endregion
export { checkDeskPulse_createServerFn_handler, checkOpportunityQuotes_createServerFn_handler, dispatchDeskSignal_createServerFn_handler, loadMacroDesk_createServerFn_handler, loadUsdtRate_createServerFn_handler, runOpportunityBacktest_createServerFn_handler, runSpotBacktest_createServerFn_handler, runVenue_createServerFn_handler };
