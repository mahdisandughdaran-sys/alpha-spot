import { t as createServerFn } from "./ssr.mjs";
import { n as getSpotAsset } from "./spot-assets-CW_rSYyd.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spot-desk-YW2cTJ-m.js
var loadSpotDesk_createServerFn_handler = createServerRpc({
	id: "fe1f268360652ffd8c110e19f0058a6289058902cc00444298fe7779506355bb",
	name: "loadSpotDesk",
	filename: "src/lib/crypto/spot-desk.ts"
}, (opts) => loadSpotDesk.__executeServer(opts));
var loadSpotDesk = createServerFn({ method: "POST" }).validator((input) => {
	const asset = getSpotAsset(String(input?.assetId ?? ""));
	if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
	if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
	return { assetId: asset.id };
}).handler(loadSpotDesk_createServerFn_handler, async ({ data }) => {
	const { loadSpotPlan } = await import("./spot-plan.server-Dd7Vt9iG.mjs");
	return loadSpotPlan(data.assetId);
});
//#endregion
export { loadSpotDesk_createServerFn_handler };
