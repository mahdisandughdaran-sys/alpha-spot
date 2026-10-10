import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-Dslb7Kef.js
var runSpotAnalysis_createServerFn_handler = createServerRpc({
	id: "2975be20775612443781264b5ca2666618f65f485e3407bef4ba4edec84f952e",
	name: "runSpotAnalysis",
	filename: "src/lib/crypto/analyze.ts"
}, (opts) => runSpotAnalysis.__executeServer(opts));
var runSpotAnalysis = createServerFn({ method: "POST" }).handler(runSpotAnalysis_createServerFn_handler, async () => {
	const { runAnalysis } = await import("./engine.server-C5hhHF0b.mjs");
	return runAnalysis();
});
//#endregion
export { runSpotAnalysis_createServerFn_handler };
