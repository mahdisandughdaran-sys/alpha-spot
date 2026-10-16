import { t as createServerFn } from "./ssr.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
import { s as isVenue } from "./venues-Ca5MVLXD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analyze-CVu-iPfW.js
var FACTORS = [
	"rs",
	"tokenomics",
	"entry",
	"trend",
	"liquidity",
	"risk",
	"narrative"
];
var runSpotAnalysis_createServerFn_handler = createServerRpc({
	id: "2975be20775612443781264b5ca2666618f65f485e3407bef4ba4edec84f952e",
	name: "runSpotAnalysis",
	filename: "src/lib/crypto/analyze.ts"
}, (opts) => runSpotAnalysis.__executeServer(opts));
var runSpotAnalysis = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || !isVenue(String(input.venue ?? ""))) throw new Error("صرافی نامعتبر است.");
	if (input.horizon !== "week" && input.horizon !== "month") throw new Error("افق نامعتبر است.");
	const cuts = {};
	if (input.cuts && typeof input.cuts === "object") for (const key of FACTORS) {
		const value = input.cuts[key];
		if (typeof value === "number" && Number.isFinite(value)) cuts[key] = value;
	}
	return {
		venue: input.venue,
		horizon: input.horizon,
		cuts
	};
}).handler(runSpotAnalysis_createServerFn_handler, async ({ data }) => {
	const { runAnalysis } = await import("./engine.server-B9tF88AR.mjs");
	return runAnalysis(data);
});
//#endregion
export { runSpotAnalysis_createServerFn_handler };
