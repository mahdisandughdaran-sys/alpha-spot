import { t as createServerFn } from "./ssr.mjs";
import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { n as normalizeSymbol } from "./ta-CFwhxRm-.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ta-call-C4Mm8P4u.js
var loadTechnical_createServerFn_handler = createServerRpc({
	id: "7dbc2a920099b330b24b1f535c04eb1b7f4049c52042c2f09febcaf09bad718b",
	name: "loadTechnical",
	filename: "src/lib/crypto/ta-call.ts"
}, (opts) => loadTechnical.__executeServer(opts));
var loadTechnical = createServerFn({ method: "POST" }).validator((input) => {
	const symbol = normalizeSymbol(String(input?.symbol ?? ""));
	if (!symbol) throw new Error(msg("نماد نامعتبر است.", "That symbol is not valid."));
	const interval = input?.interval;
	if (interval !== "4h" && interval !== "1d" && interval !== "1w") throw new Error(msg("بازه نامعتبر است.", "That timeframe is not valid."));
	return {
		symbol,
		interval
	};
}).handler(loadTechnical_createServerFn_handler, async ({ data }) => {
	const { loadTa } = await import("./ta.server-9Aq1FbVs.mjs");
	return loadTa(data.symbol, data.interval);
});
//#endregion
export { loadTechnical_createServerFn_handler };
