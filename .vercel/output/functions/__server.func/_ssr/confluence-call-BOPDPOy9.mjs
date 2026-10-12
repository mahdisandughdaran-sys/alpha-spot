import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/confluence-call-BOPDPOy9.js
var readConfluence_createServerFn_handler = createServerRpc({
	id: "aeda1b5d2fcb813d1aee768482968dab0e154d7a661f86eb7f4b93b477d24ef1",
	name: "readConfluence",
	filename: "src/lib/crypto/confluence-call.ts"
}, (opts) => readConfluence.__executeServer(opts));
var readConfluence = createServerFn({ method: "POST" }).validator((input) => {
	const symbol = (input?.symbol ?? "").trim().toUpperCase();
	if (!/^[A-Z0-9]{2,12}$/.test(symbol)) throw new Error("نماد نامعتبر است.");
	return { symbol };
}).handler(readConfluence_createServerFn_handler, async ({ data }) => {
	const { loadConfluence } = await import("./confluence.server-KJpiJHu0.mjs");
	return loadConfluence(data.symbol);
});
//#endregion
export { readConfluence_createServerFn_handler };
