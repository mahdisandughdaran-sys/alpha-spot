import { n as TSS_SERVER_FUNCTION } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/limit-eJTtcwDW.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var hits = /* @__PURE__ */ new Map();
function takeToken(key, limit, windowMs) {
	const now = Date.now();
	const prev = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
	if (prev.length >= limit) {
		hits.set(key, prev);
		return false;
	}
	prev.push(now);
	hits.set(key, prev);
	return true;
}
//#endregion
export { takeToken as n, createServerRpc as t };
