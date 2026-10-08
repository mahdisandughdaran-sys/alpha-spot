import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-4w4RNT1k.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var runSpotAnalysis_createServerFn_handler = createServerRpc({
	id: "2975be20775612443781264b5ca2666618f65f485e3407bef4ba4edec84f952e",
	name: "runSpotAnalysis",
	filename: "src/lib/crypto/analyze.ts"
}, (opts) => runSpotAnalysis.__executeServer(opts));
var runSpotAnalysis = createServerFn({ method: "POST" }).handler(runSpotAnalysis_createServerFn_handler, async () => {
	const { runAnalysis } = await import("./engine.server-uSrZACtI.mjs");
	return runAnalysis();
});
//#endregion
export { runSpotAnalysis_createServerFn_handler };
