import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { o as normalizeVenueCall } from "./venues-BFan2-LH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-9Nqy4v8R.js
var runSpotBacktest_createServerFn_handler = createServerRpc({
	id: "b5f74dffff4b6c35ce44b7129d8d5ebb42b2ff29c152c819a7d42fa5ca8fc035",
	name: "runSpotBacktest",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => runSpotBacktest.__executeServer(opts));
var runSpotBacktest = createServerFn({ method: "POST" }).handler(runSpotBacktest_createServerFn_handler, async () => {
	const { runHistoricalBacktest } = await import("./backtest-data.server-DNPuAL_A.mjs");
	return runHistoricalBacktest();
});
var checkDeskPulse_createServerFn_handler = createServerRpc({
	id: "2430eb14739b94c669f882053cb7ce0e872ee809f7eb597b1f6e667f4e495a81",
	name: "checkDeskPulse",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => checkDeskPulse.__executeServer(opts));
var checkDeskPulse = createServerFn({ method: "POST" }).handler(checkDeskPulse_createServerFn_handler, async () => {
	const { pulseBtc } = await import("./pulse.server-BHMnurFQ.mjs");
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
var runVenue_createServerFn_handler = createServerRpc({
	id: "eed7d3073443c33758c00a8a490ad465452ee6d3f46e47d1fde88dd2a65e227a",
	name: "runVenue",
	filename: "src/lib/crypto/ops.ts"
}, (opts) => runVenue.__executeServer(opts));
var runVenue = createServerFn({ method: "POST" }).validator((input) => normalizeVenueCall(input)).handler(runVenue_createServerFn_handler, async ({ data }) => {
	const { executeVenue } = await import("./venues.server-BRK5ZA-4.mjs");
	return executeVenue(data);
});
//#endregion
export { checkDeskPulse_createServerFn_handler, dispatchDeskSignal_createServerFn_handler, runSpotBacktest_createServerFn_handler, runVenue_createServerFn_handler };
