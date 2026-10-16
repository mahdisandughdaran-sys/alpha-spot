//#region node_modules/.nitro/vite/services/ssr/assets/spot-assets-Cm-rMs8a.js
var SPOT_ASSETS = [
	{
		id: "btc",
		symbol: "BTC",
		nameFa: "بیت‌کوین",
		nameEn: "Bitcoin",
		pair: "BTCUSDT",
		enabled: true
	},
	{
		id: "eth",
		symbol: "ETH",
		nameFa: "اتریوم",
		nameEn: "Ethereum",
		pair: "ETHUSDT",
		enabled: true
	},
	{
		id: "sol",
		symbol: "SOL",
		nameFa: "سولانا",
		nameEn: "Solana",
		pair: "SOLUSDT",
		enabled: false
	},
	{
		id: "bnb",
		symbol: "BNB",
		nameFa: "بی‌ان‌بی",
		nameEn: "BNB",
		pair: "BNBUSDT",
		enabled: false
	},
	{
		id: "xrp",
		symbol: "XRP",
		nameFa: "ریپل",
		nameEn: "XRP",
		pair: "XRPUSDT",
		enabled: false
	},
	{
		id: "ton",
		symbol: "TON",
		nameFa: "تون",
		nameEn: "Toncoin",
		pair: "TONUSDT",
		enabled: false
	}
];
function getSpotAsset(id) {
	const key = id.trim().toLowerCase();
	return SPOT_ASSETS.find((asset) => asset.id === key) ?? null;
}
//#endregion
export { getSpotAsset as n, SPOT_ASSETS as t };
