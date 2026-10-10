//#region node_modules/.nitro/vite/services/ssr/assets/exclusions-CgnBvqEr.js
var STABLES = /* @__PURE__ */ new Set([
	"USDT",
	"USDC",
	"DAI",
	"FDUSD",
	"USDE",
	"TUSD",
	"USDP",
	"PYUSD",
	"BUSD",
	"USDS",
	"USD1",
	"USDD",
	"FRAX",
	"GUSD",
	"LUSD",
	"RLUSD",
	"EURC",
	"EURT",
	"AEUR",
	"USDG",
	"USDF",
	"USD0",
	"GHO",
	"CRVUSD",
	"SUSD",
	"USDBC",
	"USDC.E",
	"SUSDS",
	"SUSDE",
	"SYRUPUSDC",
	"USYC",
	"USDL"
]);
var PEGGED = /* @__PURE__ */ new Set([
	"WBTC",
	"WETH",
	"STETH",
	"WSTETH",
	"WEETH",
	"WBETH",
	"CBETH",
	"RETH",
	"CBBTC",
	"TBTC",
	"LBTC",
	"LSETH",
	"RSETH",
	"METH",
	"WBNB",
	"WBT",
	"JITOSOL",
	"JUPSOL",
	"MSOL",
	"BNSOL",
	"KHYPE",
	"EZETH",
	"PUFETH",
	"RSWETH"
]);
var NAME_HINTS = [
	"wrapped",
	"staked",
	"liquid stak",
	"bridged",
	"pegged",
	"usd coin",
	"trueusd",
	"tether"
];
function isNonSpotCandidate(symbol, name) {
	const sym = symbol.toUpperCase();
	if (STABLES.has(sym) || PEGGED.has(sym)) return true;
	if (sym.startsWith("USD") || sym.endsWith("USD")) return true;
	const lower = name.toLowerCase();
	return NAME_HINTS.some((h) => lower.includes(h));
}
var BINANCE_SYMBOL = {
	IOTA: "IOTA",
	MIOTA: "IOTA",
	RENDER: "RENDER",
	RNDR: "RENDER",
	POL: "POL",
	MATIC: "POL",
	TON: "TON",
	FET: "FET",
	UNI: "UNI",
	HYPE: "HYPE",
	BEAM: "BEAMX",
	FLOKI: "FLOKI",
	BONK: "BONK",
	PEPE: "PEPE",
	SHIB: "SHIB"
};
function candidateBases(symbol, usdtBases) {
	const raw = [
		BINANCE_SYMBOL[symbol] ?? symbol,
		symbol,
		`1000${symbol}`
	];
	const unique = [];
	for (const base of raw) if (!unique.includes(base)) unique.push(base);
	if (usdtBases && usdtBases.size > 0) {
		const listed = unique.filter((b) => usdtBases.has(b));
		if (listed.length) return listed;
	}
	return unique;
}
//#endregion
export { isNonSpotCandidate as n, candidateBases as t };
