import { t as createServerFn } from "./ssr.mjs";
import { r as resolveSpotAsset } from "./spot-assets-CjnbgLce.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spot-desk-C1LmuvhX.js
var loadSpotDesk_createServerFn_handler = createServerRpc({
	id: "fe1f268360652ffd8c110e19f0058a6289058902cc00444298fe7779506355bb",
	name: "loadSpotDesk",
	filename: "src/lib/crypto/spot-desk.ts"
}, (opts) => loadSpotDesk.__executeServer(opts));
var loadSpotDesk = createServerFn({ method: "POST" }).validator((input) => {
	const asset = resolveSpotAsset(String(input?.assetId ?? ""));
	if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
	if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
	return { assetId: asset.id };
}).handler(loadSpotDesk_createServerFn_handler, async ({ data }) => {
	const { loadSpotPlan } = await import("./spot-plan.server-BDDx34LE.mjs");
	return loadSpotPlan(data.assetId);
});
var loadSpotBoard_createServerFn_handler = createServerRpc({
	id: "c46ebafb3476d206d2a8f7363ac5cbefff0a2c20a40c24eeb2c15ccc577d431b",
	name: "loadSpotBoard",
	filename: "src/lib/crypto/spot-desk.ts"
}, (opts) => loadSpotBoard.__executeServer(opts));
var loadSpotBoard = createServerFn({ method: "POST" }).validator((input) => ({ force: Boolean(input?.force) })).handler(loadSpotBoard_createServerFn_handler, async ({ data }) => {
	const { loadTopSpotBoard } = await import("./spot-board.server-Bb1SkYIy.mjs");
	return loadTopSpotBoard(data.force);
});
//#endregion
export { loadSpotBoard_createServerFn_handler, loadSpotDesk_createServerFn_handler };
