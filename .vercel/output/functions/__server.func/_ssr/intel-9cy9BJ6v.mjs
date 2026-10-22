import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intel-9cy9BJ6v.js
var loadSpotIntel_createServerFn_handler = createServerRpc({
	id: "b75b2ca9a7e6b1657d3f52153d9da8c9b30fe4c58222635e1fa38d0fac75eb37",
	name: "loadSpotIntel",
	filename: "src/lib/crypto/intel.ts"
}, (opts) => loadSpotIntel.__executeServer(opts));
var loadSpotIntel = createServerFn({ method: "GET" }).handler(loadSpotIntel_createServerFn_handler, async () => {
	const { buildSpotIntel } = await import("./intel.server-chdbPDhF.mjs");
	return buildSpotIntel();
});
//#endregion
export { loadSpotIntel_createServerFn_handler };
