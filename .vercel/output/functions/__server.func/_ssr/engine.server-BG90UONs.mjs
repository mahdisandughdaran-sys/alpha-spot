import { c as explainPick, i as confidenceOf, n as buildChecklist, o as dominanceBiasOf } from "./explain-D9oCZMGL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine.server-BG90UONs.js
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
	const mapped = BINANCE_SYMBOL[symbol] ?? symbol;
	const out = [];
	for (const base of [
		mapped,
		symbol,
		`1000${symbol}`
	]) if (!out.includes(base) && usdtBases.has(base)) out.push(base);
	if (out.length === 0) out.push(mapped);
	return out;
}
var HOT_NARRATIVES = /* @__PURE__ */ new Set([
	"AI",
	"RWA",
	"DePIN",
	"L2",
	"Solana"
]);
var META = {
	BTC: {
		tags: ["L1"],
		tagsFa: ["لایه یک", "ذخیره ارزش"],
		accrual: "store-of-value",
		note: "سقف عرضه ثابت؛ ذخیره ارزش شبکه."
	},
	ETH: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "burn",
		note: "سوزاندن کارمزد و استیکینگ؛ ارزش واقعی برای هولدر."
	},
	SOL: {
		tags: ["L1", "Solana"],
		tagsFa: ["لایه یک", "سولانا"],
		accrual: "staking",
		note: "استیکینگ بومی سولانا."
	},
	BNB: {
		tags: ["L1"],
		tagsFa: ["لایه یک", "صرافی"],
		accrual: "burn",
		note: "سوزاندن دوره‌ای عرضه."
	},
	XRP: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "none",
		note: "توکن شبکه پرداخت؛ ارزش‌افزایی مستقیم ضعیف."
	},
	ADA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ بدون قفل اجباری."
	},
	DOGE: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "عرضه تورمی و بدون ارزش‌افزایی پروتکل."
	},
	TRX: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ و کارمزد شبکه."
	},
	TON: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ تون."
	},
	AVAX: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ آوالانچ."
	},
	LINK: {
		tags: ["oracle", "RWA"],
		tagsFa: ["اوراکل", "RWA"],
		accrual: "staking",
		note: "استیکینگ چین‌لینک و روایت RWA."
	},
	SUI: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ سویی."
	},
	SHIB: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "burn",
		note: "سوزاندن داوطلبانه؛ کاربرد مالی ضعیف."
	},
	DOT: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ پولکادات."
	},
	BCH: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "store-of-value",
		note: "فورک بیت‌کوین؛ سقف عرضه مشخص."
	},
	NEAR: {
		tags: ["L1", "AI"],
		tagsFa: ["لایه یک", "هوش مصنوعی"],
		accrual: "staking",
		note: "استیکینگ و روایت AI."
	},
	LEO: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "burn",
		note: "توکن صرافی با سوزاندن."
	},
	LTC: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "store-of-value",
		note: "سقف عرضه مشخص."
	},
	DAI: {
		tags: ["stable"],
		tagsFa: ["استیبل"],
		accrual: "none",
		note: "استیبل‌کوین."
	},
	UNI: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: "عمدتاً حاکمیتی؛ تقسیم کارمزد محدود."
	},
	PEPE: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم‌کوین بدون ارزش‌افزایی."
	},
	ICP: {
		tags: ["L1", "AI"],
		tagsFa: ["لایه یک", "هوش مصنوعی"],
		accrual: "burn",
		note: "سوزاندن چرخه‌ها."
	},
	TAO: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "staking",
		note: "استیکینگ ساب‌نت‌های AI."
	},
	APT: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ آپتوس."
	},
	POL: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "staking",
		note: "استیکینگ پالیگان."
	},
	MATIC: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "staking",
		note: "استیکینگ پالیگان."
	},
	ETC: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: "کاربرد مالی محدود."
	},
	XLM: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "none",
		note: "شبکه پرداخت."
	},
	HBAR: {
		tags: [
			"L1",
			"RWA",
			"enterprise"
		],
		tagsFa: ["لایه یک", "RWA"],
		accrual: "staking",
		note: "روایت سازمانی و RWA."
	},
	OKB: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "burn",
		note: "توکن صرافی."
	},
	CRO: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "none",
		note: "توکن اکوسیستم صرافی."
	},
	FIL: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: "پاداش ذخیره‌سازی غیرمتمرکز."
	},
	ATOM: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ کاسموس."
	},
	RENDER: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "burn",
		note: "کارمزد رندر و سوزاندن."
	},
	RNDR: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "burn",
		note: "کارمزد رندر و سوزاندن."
	},
	FET: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: "روایت AI و استیکینگ."
	},
	ASI: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: "اتحاد هوش مصنوعی."
	},
	ARB: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: "حاکمیت آربیتروم."
	},
	OP: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: "حاکمیت آپتیمیسم."
	},
	IMX: {
		tags: ["L2", "gaming"],
		tagsFa: ["لایه دو", "گیمینگ"],
		accrual: "burn",
		note: "سوزاندن کارمزد."
	},
	INJ: {
		tags: ["L1", "defi"],
		tagsFa: ["لایه یک", "دیفای"],
		accrual: "burn",
		note: "سوزاندن حراجی."
	},
	STX: {
		tags: ["L2", "BTC"],
		tagsFa: ["لایه دو", "بیت‌کوین"],
		accrual: "staking",
		note: "Stacking روی بیت‌کوین."
	},
	TIA: {
		tags: ["modular", "L1"],
		tagsFa: ["ماژولار"],
		accrual: "staking",
		note: "استیکینگ سلستیا."
	},
	SEI: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ سِی."
	},
	S: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ سونیک."
	},
	WLD: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی", "هویت"],
		accrual: "none",
		note: "توکن هویت؛ تورم عرضه بالا."
	},
	ONDO: {
		tags: ["RWA"],
		tagsFa: ["RWA"],
		accrual: "real-yield",
		note: "بازده دارایی واقعی."
	},
	AAVE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "کارمزد پروتکل و استیکینگ ایمنی."
	},
	MKR: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "سوزاندن/بازخرید از درآمد."
	},
	SKY: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "بازخرید از درآمد پروتکل."
	},
	ENA: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "درآمد استیبل‌کوین ترکیبی."
	},
	PENDLE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "کارمزد معاملات بازده."
	},
	JUP: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "burn",
		note: "بازخرید از کارمزد."
	},
	JTO: {
		tags: ["Solana", "DePIN"],
		tagsFa: ["سولانا", "DePIN"],
		accrual: "staking",
		note: "استیکینگ جیتو."
	},
	PYTH: {
		tags: ["oracle", "Solana"],
		tagsFa: ["اوراکل", "سولانا"],
		accrual: "staking",
		note: "استیکینگ داده قیمت."
	},
	WIF: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "none",
		note: "میم سولانا."
	},
	BONK: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "burn",
		note: "میم با سوزاندن محدود."
	},
	PENGU: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم‌کوین."
	},
	FLOKI: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم‌کوین."
	},
	GRT: {
		tags: ["AI", "data"],
		tagsFa: ["داده", "هوش مصنوعی"],
		accrual: "staking",
		note: "استیکینگ ایندکس."
	},
	AR: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "none",
		note: "ذخیره دائمی؛ ارزش‌افزایی غیرمستقیم."
	},
	HNT: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: "پاداش پوشش بی‌سیم."
	},
	AKT: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: "بازار محاسبات ابری."
	},
	RUNE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: "سوزاندن در استخرها."
	},
	CRV: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "کارمزد استخر برای لاک‌کنندگان."
	},
	LDO: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: "حاکمیت لیدو."
	},
	ENS: {
		tags: ["identity"],
		tagsFa: ["هویت"],
		accrual: "real-yield",
		note: "درآمد ثبت دامنه."
	},
	QNT: {
		tags: ["enterprise"],
		tagsFa: ["سازمانی"],
		accrual: "none",
		note: "لایسنس سازمانی."
	},
	ALGO: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "پاداش مشارکت."
	},
	VET: {
		tags: ["enterprise"],
		tagsFa: ["سازمانی"],
		accrual: "none",
		note: "توکن گاز جدا دارد."
	},
	EOS: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ منابع."
	},
	XMR: {
		tags: ["privacy"],
		tagsFa: ["حریم خصوصی"],
		accrual: "none",
		note: "پول خصوصی؛ بدون ارزش‌افزایی قراردادی."
	},
	KAS: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: "PoW؛ بدون مکانیزم بازخرید."
	},
	FTM: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ فانتوم."
	},
	SAND: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "none",
		note: "گیمینگ؛ تورم عرضه."
	},
	MANA: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "burn",
		note: "سوزاندن زمین."
	},
	AXS: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "staking",
		note: "استیکینگ بازی."
	},
	GALA: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "none",
		note: "گیمینگ تورمی."
	},
	APE: {
		tags: ["gaming", "nft"],
		tagsFa: ["گیمینگ"],
		accrual: "staking",
		note: "استیکینگ اکوسیستم."
	},
	STRK: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: "حاکمیت استارک‌نت."
	},
	ZK: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: "حاکمیت zkSync."
	},
	TUSD: {
		tags: ["stable"],
		tagsFa: ["استیبل"],
		accrual: "none",
		note: "استیبل."
	},
	CAKE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: "سوزاندن کارمزد."
	},
	COMP: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: "حاکمیت کامپاند."
	},
	SNX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "کارمزد معاملات برای استیکرها."
	},
	DYDX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "کارمزد معاملات."
	},
	GMX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: "تقسیم کارمزد."
	},
	VIRTUAL: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "none",
		note: "روایت ایجنت AI."
	},
	KAITO: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "none",
		note: "روایت AI."
	},
	W: {
		tags: ["Solana"],
		tagsFa: ["سولانا"],
		accrual: "none",
		note: "توکن بریج ورم‌هول."
	},
	JASMY: {
		tags: ["data"],
		tagsFa: ["داده"],
		accrual: "none",
		note: "داده شخصی."
	},
	IOTA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: "لجر بدون کارمزد."
	},
	HYPE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: "سوزاندن از کارمزد پرپ."
	},
	BERA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "استیکینگ برچین."
	},
	TRUMP: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم سیاسی."
	},
	MELANIA: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم سیاسی."
	},
	SPX: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم."
	},
	MOG: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: "میم."
	},
	POPCAT: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "none",
		note: "میم سولانا."
	},
	GOAT: {
		tags: ["meme", "AI"],
		tagsFa: ["میم", "هوش مصنوعی"],
		accrual: "none",
		note: "میم AI."
	},
	TAO2: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: "AI."
	},
	OM: {
		tags: ["RWA"],
		tagsFa: ["RWA"],
		accrual: "staking",
		note: "روایت RWA."
	},
	MOVE: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: "لایه یک موفمنت."
	},
	SSV: {
		tags: ["staking"],
		tagsFa: ["استیکینگ"],
		accrual: "staking",
		note: "زیرساخت استیکینگ."
	},
	EIGEN: {
		tags: ["restaking"],
		tagsFa: ["ری‌استیک"],
		accrual: "staking",
		note: "ری‌استیکینگ."
	},
	ETHFI: {
		tags: ["restaking"],
		tagsFa: ["ری‌استیک"],
		accrual: "real-yield",
		note: "درآمد ری‌استیک."
	},
	RAY: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "burn",
		note: "کارمزد دکس سولانا."
	},
	ORCA: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "real-yield",
		note: "کارمزد دکس."
	},
	WETH: {
		tags: ["wrapped"],
		tagsFa: ["رپد"],
		accrual: "none",
		note: "رپد."
	}
};
var ACCRUAL_FIX = { JUP: "burn" };
function lookupMeta(symbol) {
	const key = symbol.toUpperCase();
	const found = META[key];
	if (found) {
		const accrual = ACCRUAL_FIX[key] ?? found.accrual;
		return {
			...found,
			accrual
		};
	}
	return {
		tags: [],
		tagsFa: [],
		accrual: "none",
		note: "در کاتالوگ روایت نبود؛ امتیاز خنثی."
	};
}
function isHot(tags) {
	return tags.some((t) => HOT_NARRATIVES.has(t));
}
function mcFdvRatio(circulating, maxSupply, price, marketCap) {
	if (maxSupply && maxSupply > 0 && price > 0) {
		const fdv = price * maxSupply;
		if (fdv > 0 && marketCap > 0) return marketCap / fdv;
		if (circulating && circulating > 0) return circulating / maxSupply;
	}
	return null;
}
function clamp(n, min = 0, max = 100) {
	return Math.min(max, Math.max(min, n));
}
function vsBtc(coinPct, btcPct) {
	const c = 1 + coinPct / 100;
	const b = 1 + btcPct / 100;
	if (b === 0) return 0;
	return c / b - 1;
}
function mean(xs) {
	if (xs.length === 0) return 0;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function stdev(xs) {
	if (xs.length < 2) return 0;
	const m = mean(xs);
	const v = xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
	return Math.sqrt(v);
}
function dailyReturns(closes) {
	const out = [];
	for (let i = 1; i < closes.length; i++) {
		const prev = closes[i - 1];
		const cur = closes[i];
		if (prev && prev !== 0 && Number.isFinite(cur)) out.push(cur / prev - 1);
	}
	return out;
}
function maxDrawdown(closes) {
	if (closes.length < 2) return 0;
	let peak = closes[0] ?? 0;
	let dd = 0;
	for (const p of closes) {
		if (p > peak) peak = p;
		if (peak > 0) dd = Math.min(dd, p / peak - 1);
	}
	return dd;
}
function rsi(closes, period = 14) {
	if (closes.length < period + 1) return null;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		if (d >= 0) gain += d;
		else loss -= d;
	}
	gain /= period;
	loss /= period;
	for (let i = period + 1; i < closes.length; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		const g = Math.max(d, 0);
		const l = Math.max(-d, 0);
		gain = (gain * (period - 1) + g) / period;
		loss = (loss * (period - 1) + l) / period;
	}
	if (loss === 0) return 100;
	return 100 - 100 / (1 + gain / loss);
}
function sma(closes, period) {
	if (closes.length < period) return null;
	return mean(closes.slice(-period));
}
function ema(closes, period) {
	if (closes.length < period) return null;
	const k = 2 / (period + 1);
	let prev = 0;
	for (let i = 0; i < period; i++) prev += closes[i] ?? 0;
	prev /= period;
	for (let i = period; i < closes.length; i++) prev = ((closes[i] ?? 0) - prev) * k + prev;
	return prev;
}
function percentileRank(value, all) {
	if (all.length <= 1) return 50;
	let less = 0;
	let equal = 0;
	for (const x of all) if (x < value) less += 1;
	else if (x === value) equal += 1;
	return (less + equal * .5) / all.length * 100;
}
function tanhScore(x, scale, center = 50) {
	return clamp(center + 50 * Math.tanh(x / scale));
}
function lookback(closes, days) {
	if (closes.length < days + 1) return null;
	const last = closes[closes.length - 1];
	const prev = closes[closes.length - 1 - days];
	if (last == null || prev == null || prev === 0) return null;
	return last / prev - 1;
}
function distFromHigh(closes) {
	if (closes.length < 3) return null;
	const last = closes[closes.length - 1];
	if (last == null || last === 0) return null;
	return last / Math.max(...closes) - 1;
}
function weeklyFromDaily(closes) {
	const out = [];
	for (let end = closes.length; end >= 1; end -= 7) {
		const bar = closes[end - 1];
		if (bar != null) out.unshift(bar);
	}
	return out;
}
function detectWeeklyStructure(closes) {
	const w = weeklyFromDaily(closes);
	if (w.length < 8) return "range";
	const window = w.slice(-12);
	const last = window[window.length - 1];
	const prior = window.slice(0, -1);
	const priorHigh = Math.max(...prior);
	const priorLow = Math.min(...prior);
	const split = Math.max(2, window.length - 4);
	const older = window.slice(0, split);
	const recent = window.slice(split);
	const olderHigh = Math.max(...older);
	const olderLow = Math.min(...older);
	const recentHigh = Math.max(...recent);
	const recentLow = Math.min(...recent);
	if (last > priorHigh) return "bull";
	if (last < priorLow) return "bear";
	if (recentHigh >= olderHigh && recentLow >= olderLow) return "bull";
	if (recentHigh <= olderHigh && recentLow <= olderLow) return "bear";
	return "range";
}
function obvSeries(closes, volumes) {
	const n = Math.min(closes.length, volumes.length);
	const out = [];
	let acc = 0;
	if (n === 0) return out;
	out.push(0);
	for (let i = 1; i < n; i++) {
		if (closes[i] > closes[i - 1]) acc += volumes[i] ?? 0;
		else if (closes[i] < closes[i - 1]) acc -= volumes[i] ?? 0;
		out.push(acc);
	}
	return out;
}
function obvIsRising(closes, volumes) {
	const s = obvSeries(closes, volumes);
	if (s.length < 15) return null;
	return s[s.length - 1] >= mean(s.slice(-10));
}
var FACTOR_WEIGHTS = {
	rs: .22,
	tokenomics: .16,
	entry: .16,
	trend: .16,
	liquidity: .14,
	risk: .1,
	narrative: .06
};
var FACTOR_LABELS = {
	rs: "قدرت نسبی به بیت‌کوین",
	tokenomics: "توکنومیکس · MC/FDV",
	entry: "موقعیت ورود",
	trend: "روند کلان",
	liquidity: "نقدشوندگی اسپات",
	risk: "بازده به ریسک",
	narrative: "روایت و ارزش‌افزایی"
};
function factor(key, score, note) {
	return {
		key,
		label: FACTOR_LABELS[key],
		score: clamp(score),
		weight: FACTOR_WEIGHTS[key],
		note
	};
}
function rsiEntryScore(value, shortReversal) {
	if (value == null) return {
		score: 55,
		note: "RSI روزانه در دسترس نبود؛ وزن روی بقیه سیگنال‌ها رفت."
	};
	if (value >= 78) return {
		score: 14,
		note: `RSI ${value.toFixed(0)} — اشباع خرید؛ خرید اسپات در سقف ضعیف است.`
	};
	if (value >= 70) return {
		score: 32,
		note: `RSI ${value.toFixed(0)} — گرم؛ ریسک ادامه بدون اصلاح بالاست.`
	};
	if (value >= 42 && value <= 58) return {
		score: 96,
		note: `RSI ${value.toFixed(0)} — ناحیه تعادلی مناسب برای ورود اسپات.`
	};
	if (value >= 35 && value <= 65) return {
		score: 84,
		note: `RSI ${value.toFixed(0)} — نه هیجانی، نه فرسوده.`
	};
	if (value >= 30 && value <= 70) return {
		score: 70,
		note: `RSI ${value.toFixed(0)} — قابل قبول با احتیاط.`
	};
	if (value < 25) {
		if (shortReversal) return {
			score: 62,
			note: `RSI ${value.toFixed(0)} اشباع فروش است ولی برگشت کوتاه‌مدت دیده می‌شود.`
		};
		return {
			score: 28,
			note: `RSI ${value.toFixed(0)} — چاقوی در حال سقوط؛ هنوز برگشت تأیید نشده.`
		};
	}
	if (value < 35) return {
		score: shortReversal ? 68 : 48,
		note: `RSI ${value.toFixed(0)} — نزدیک اشباع فروش.`
	};
	return {
		score: 58,
		note: `RSI ${value.toFixed(0)}.`
	};
}
function pullbackScore(dist, athDd) {
	if (dist != null) {
		const pct = Math.abs(dist) * 100;
		if (dist > -.04) return {
			score: 16,
			note: `فقط ${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — خرید سقف.`
		};
		if (dist > -.08) return {
			score: 40,
			note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح خیلی کم.`
		};
		if (dist >= -.18) return {
			score: 94,
			note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح سالم، نه سقوط.`
		};
		if (dist >= -.28) return {
			score: 72,
			note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح عمیق‌تر ولی قابل کار.`
		};
		if (dist >= -.4) return {
			score: 44,
			note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — آسیب دیده.`
		};
		return {
			score: 30,
			note: `${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — روند آسیب‌دیده.`
		};
	}
	if (athDd != null) {
		const dd = Math.abs(athDd);
		if (dd < 8) return {
			score: 28,
			note: `فقط ${dd.toFixed(0)}٪ زیر ATH — فضای کمی برای خطا.`
		};
		if (dd < 25) return {
			score: 70,
			note: `${dd.toFixed(0)}٪ زیر ATH.`
		};
		if (dd < 55) return {
			score: 78,
			note: `${dd.toFixed(0)}٪ زیر ATH — از اوج تاریخی فاصله معقول.`
		};
		if (dd < 80) return {
			score: 58,
			note: `${dd.toFixed(0)}٪ زیر ATH.`
		};
		return {
			score: 36,
			note: `${dd.toFixed(0)}٪ زیر ATH — بازار این دارایی را مدت‌ها تنبیه کرده.`
		};
	}
	return {
		score: 55,
		note: "فاصله از اوج مشخص نبود."
	};
}
function enrichFromKlines(draft) {
	const closes = draft.pairCloses;
	const usd = draft.usdCloses;
	const vols = draft.usdVolumes;
	const klineDays = Math.max(closes.length, usd.length);
	const rs7 = closes.length >= 8 ? lookback(closes, 7) : null;
	const rs14 = lookback(closes, 14);
	const rs30 = lookback(closes, Math.min(29, Math.max(1, closes.length - 1)));
	const rsi14 = rsi(closes, 14);
	const rets = closes.length >= 8 ? dailyReturns(closes.slice(-31)) : [];
	const vol = rets.length >= 5 ? stdev(rets) : null;
	const dd = closes.length >= 8 ? maxDrawdown(closes.slice(-31)) : null;
	const dist = closes.length >= 8 ? distFromHigh(closes.slice(-31)) : null;
	const s10 = sma(closes, Math.min(10, closes.length));
	const lastPair = closes[closes.length - 1];
	const aboveSma = s10 != null && lastPair != null ? lastPair >= s10 : null;
	const ema200 = ema(usd, 200);
	const lastUsd = usd[usd.length - 1];
	const aboveEma200 = ema200 != null && lastUsd != null ? lastUsd >= ema200 : null;
	const weeklyStructure = usd.length >= 56 ? detectWeeklyStructure(usd) : null;
	const obvRising = usd.length >= 15 && vols.length >= 15 ? obvIsRising(usd, vols) : null;
	const window = closes.slice(-31);
	const first = window[0] ?? 1;
	const pairSeries = window.map((v, i) => ({
		t: i,
		v: first ? v / first * 100 : 100
	}));
	return {
		...draft,
		hasKlines: closes.length >= 8,
		klineDays,
		rs7d: rs7 ?? draft.rs7d,
		rs14d: rs14 ?? draft.rs14d,
		rs30d: rs30 ?? draft.rs30d,
		rsi14,
		volatility30d: vol,
		maxDrawdown30d: dd,
		distFrom30dHighPct: dist,
		aboveSma,
		aboveEma200,
		weeklyStructure,
		obvRising,
		pairSeries
	};
}
function detectRegime(rows, btcDominance) {
	const sorted = [...rows.filter((r) => r.symbol !== "BTC").map((r) => r.rs7d)].sort((a, b) => a - b);
	const mid = sorted[Math.floor(sorted.length / 2)] ?? 0;
	if (mid < -.03 || btcDominance >= 55) {
		if (mid < -.03 && btcDominance >= 52) return {
			regime: "btc",
			medianRs7: mid,
			note: `میانه آلت‌ها در ۷ روز ${pct(mid)} ضعیف‌تر از بیت‌کوین بوده و دامیننس BTC ${btcDominance.toFixed(1)}٪ است — فصل بیت‌کوین.`
		};
	}
	if (mid > .03 && btcDominance < 54) return {
		regime: "alt",
		medianRs7: mid,
		note: `میانه آلت‌ها در ۷ روز ${pct(mid)} قوی‌تر از بیت‌کوین است — سرمایه دارد به آلت می‌چرخد.`
	};
	if (mid < -.03) return {
		regime: "btc",
		medianRs7: mid,
		note: `میانه آلت‌ها در ۷ روز ${pct(mid)} مقابل بیت‌کوین منفی است.`
	};
	if (mid > .03) return {
		regime: "alt",
		medianRs7: mid,
		note: `میانه آلت‌ها در ۷ روز ${pct(mid)} بیت‌کوین را شکست داده.`
	};
	return {
		regime: "neutral",
		medianRs7: mid,
		note: `بازار خنثی است؛ میانه آلت‌ها مقابل بیت‌کوین ${pct(mid)} در ۷ روز.`
	};
}
function pct(x) {
	const v = x * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}٪`;
}
function scoreUniverse(drafts, regime) {
	const rsBlend = drafts.map((d) => blendRs(d));
	const sharpe = drafts.map((d) => sharpeLike(d));
	const vols = drafts.map((d) => d.volume24h);
	const turns = drafts.map((d) => d.turnover);
	return drafts.map((d, i) => {
		const factors = [
			scoreRs(d, rsBlend[i] ?? 0, rsBlend),
			scoreTokenomics(d),
			scoreTrend(d),
			scoreEntry(d),
			scoreLiquidity(d, vols, turns),
			scoreRisk(d, sharpe[i] ?? 0, sharpe),
			scoreNarrative(d)
		];
		let score = factors.reduce((s, f) => s + f.score * f.weight, 0);
		if (d.symbol === "BTC") {
			if (regime === "btc") score += 6;
			if (regime === "alt") score -= 4;
		} else if (regime === "btc" && (d.rs7d ?? 0) < 0) score -= 3;
		if (d.volume24h < 8e6) score -= 8;
		if (!d.hasKlines) score -= 4;
		if (d.mcFdv != null && d.mcFdv < .5 && d.symbol !== "BTC" && d.symbol !== "ETH") score -= 5;
		if (d.aboveEma200 === false && d.weeklyStructure === "bear") score -= 4;
		const { pairCloses: _p, usdCloses: _u, usdVolumes: _v, ...rest } = d;
		return {
			...rest,
			score: clamp(score),
			factors
		};
	});
}
function capRs(x, cap = .35) {
	return Math.max(-cap, Math.min(cap, x));
}
function blendRs(d) {
	const a = capRs(d.rs7d);
	const b = capRs(d.rs14d ?? d.rs7d);
	const c = capRs(d.rs30d ?? d.rs7d);
	return .5 * a + .25 * b + .25 * c;
}
function sharpeLike(d) {
	const ret = d.rs30d ?? d.rs7d;
	const vol = d.volatility30d;
	if (vol && vol > 0) return ret / vol;
	return ret / .08;
}
function scoreRs(d, blend, all) {
	const p = percentileRank(blend, all);
	const abs = tanhScore(blend, .12, 50);
	let score = .55 * p + .45 * abs;
	let note = `ترکیب ۷/۱۴/۳۰ روزه مقابل BTC: ${pct(blend)} (صدک ${p.toFixed(0)} در این مجموعه).`;
	if (d.rs7d > .18) {
		score -= 10;
		note += " جهش ۷ روزه تند است و از امتیاز قدرت نسبی کم شد.";
	}
	if ((d.rs30d ?? 0) > .45) note += " بازده ۳۰ روزه سقف‌گذاری شد تا جهش‌های انفجاری به‌تنهایی برنده نشوند.";
	if (d.symbol === "BTC") note = "بیت‌کوین معیار است؛ امتیازش از فرصت از دست‌رفته آلت‌ها و پایداری نقدینگی می‌آید.";
	return factor("rs", score, note);
}
function scoreTokenomics(d) {
	const bits = [];
	let score = 55;
	if (d.mcFdv != null) {
		const pctPts = d.mcFdv * 100;
		if (d.mcFdv >= .7) {
			score = 92;
			bits.push(`نسبت MC/FDV ${pctPts.toFixed(0)}٪ — عرضه رقیق‌شده نزدیک گردش است.`);
		} else if (d.mcFdv >= .5) {
			score = 70;
			bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — قابل قبول، ولی آزادسازی هنوز اثر دارد.`);
		} else if (d.mcFdv >= .35) {
			score = 38;
			bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — کمتر از نصف تا ۷۰٪ توکن‌ها در گردش است.`);
		} else {
			score = 16;
			bits.push(`MC/FDV ${pctPts.toFixed(0)}٪ — فشار فروش آزادسازی ساختاری است.`);
		}
	} else if (d.symbol === "ETH") {
		score = 84;
		bits.push("اتریوم سقف عرضه ثابت ندارد؛ ارزش از سوزاندن کارمزد و استیک می‌آید.");
	} else {
		score = 48;
		bits.push("سقف عرضه در داده نبود؛ امتیاز توکنومیکس خنثی ماند.");
	}
	if (d.symbol === "BTC") {
		score = Math.max(score, 94);
		bits.push("سقف ۲۱ میلیون مشخص و قابل حسابرسی است.");
	}
	return factor("tokenomics", score, bits.join(" "));
}
function scoreTrend(d) {
	let score = 50;
	const bits = [];
	const trend7 = d.symbol === "BTC" ? d.pct7d / 100 : d.rs7d;
	const trend30 = d.symbol === "BTC" ? lookback(d.pairCloses, Math.min(29, Math.max(1, d.pairCloses.length - 1))) ?? trend7 : d.rs30d ?? d.rs7d;
	if (d.aboveEma200 === true) {
		score += 14;
		bits.push("قیمت دلار بالای EMA ۲۰۰ روزانه است");
	} else if (d.aboveEma200 === false) {
		score -= 12;
		bits.push("زیر EMA ۲۰۰ روزانه — روند دلاری فرسایشی");
	}
	if (d.weeklyStructure === "bull") {
		score += 14;
		bits.push("ساختار هفتگی صعودی (کف و سقف بالاتر / شکست)");
	} else if (d.weeklyStructure === "bear") {
		score -= 12;
		bits.push("ساختار هفتگی نزولی");
	} else if (d.weeklyStructure === "range") bits.push("هفتگی در ناحیه انباشت/رنج");
	if (d.aboveSma === true) {
		score += 8;
		bits.push(d.symbol === "BTC" ? "بالای میانگین ۱۰ روزه" : "جفت BTC بالای میانگین ۱۰ روزه");
	} else if (d.aboveSma === false) {
		score -= 6;
		bits.push("زیر میانگین ۱۰ روزه");
	}
	const s7 = Math.sign(trend7);
	const s30 = Math.sign(trend30);
	if (s7 > 0 && s30 > 0) {
		score += 8;
		bits.push("۷ و ۳۰ روز هر دو مثبت‌اند");
	} else if (s7 < 0 && s30 < 0) {
		score -= 8;
		bits.push("۷ و ۳۰ روز هر دو منفی‌اند");
	}
	if (d.obvRising === true) {
		score += 8;
		bits.push("OBV در حال افزایش — حجم از روند حمایت می‌کند");
	} else if (d.obvRising === false) {
		score -= 6;
		bits.push("OBV هم‌جهت نیست");
	}
	if (d.volumeChange24h > 15 && d.pct24h > 0) {
		score += 6;
		bits.push("حجم با رشد قیمت آمده");
	} else if (d.volumeChange24h < -20 && d.pct24h > 2) {
		score -= 6;
		bits.push("رشد قیمت بدون حجم");
	}
	if (!d.hasKlines) {
		score -= 6;
		bits.push("بدون کندل کافی؛ روند با دادهٔ کوتاه‌مدت تخمین زده شد");
	}
	return factor("trend", score, bits.join("؛ ") || "روند متوسط.");
}
function scoreEntry(d) {
	const reversal = d.pct6h > 0 && d.pct24h > 0;
	const rsiPart = rsiEntryScore(d.rsi14, reversal);
	const pb = pullbackScore(d.distFrom30dHighPct, d.athDrawdownPct);
	let score = .55 * rsiPart.score + .45 * pb.score;
	if (d.rs7d > .12 && d.rs24h > .05) score -= 12;
	if ((d.rs30d ?? 0) > .4 && (d.distFrom30dHighPct ?? 0) > -.08) score -= 18;
	if ((d.rs30d ?? 0) > .8) score -= 16;
	if ((d.rs30d ?? 0) > 1.5) score -= 10;
	if (d.rs7d > 0 && d.rs24h < -.02 && (d.rsi14 == null || d.rsi14 < 62)) score += 8;
	const note = `${rsiPart.note} ${pb.note}`;
	return factor("entry", score, note);
}
function scoreLiquidity(d, vols, turns) {
	const volP = percentileRank(d.volume24h, vols);
	const turnP = percentileRank(d.turnover, turns);
	let score = .5 * tanhScore(Math.log10(Math.max(d.volume24h, 1) / 1e7), 1.6, 48) + .3 * volP + .2 * turnP;
	if (d.hasBtcPair) score += 7;
	if (d.turnover >= .02) score += 10;
	else if (d.turnover < .008) score -= 10;
	const volM = d.volume24h / 1e6;
	const turnPct = d.turnover * 100;
	const pair = d.hasBtcPair ? "جفت BTC واقعی روی بایننس دارد" : "جفت BTC مستقیم روی بایننس نیست";
	const depth = d.turnover >= .02 ? "گردش روزانه بالای ۲٪ مارکت‌کپ است." : "گردش زیر آستانه ۲٪ است؛ خروج ممکن است لغزش داشته باشد.";
	return factor("liquidity", score, `حجم ۲۴س ${volM.toFixed(0)} میلیون دلار، گردش ${turnPct.toFixed(2)}٪ از مارکت‌کپ. ${pair}. ${depth}`);
}
function scoreRisk(d, sh, all) {
	let score = percentileRank(sh, all);
	const bits = [];
	if (d.maxDrawdown30d != null) {
		const dd = Math.abs(d.maxDrawdown30d) * 100;
		if (dd < 8) {
			score += 10;
			bits.push(`حداکثر افت ۳۰ روزه جفت BTC فقط ${dd.toFixed(1)}٪`);
		} else if (dd > 25) {
			score -= 12;
			bits.push(`افت ۳۰ روزه ${dd.toFixed(0)}٪ — پرنوسان`);
		} else bits.push(`افت ۳۰ روزه ${dd.toFixed(0)}٪`);
	}
	if (d.beta != null && d.symbol !== "BTC") {
		if (d.beta > 1.8) {
			score -= 10;
			bits.push(`بتا ${d.beta.toFixed(2)} نسبت به بازار بالاست`);
		} else if (d.beta < 1.25) {
			score += 6;
			bits.push(`بتا ${d.beta.toFixed(2)} کنترل‌شده‌تر است`);
		}
	}
	if (d.volatility30d != null) bits.push(`نوسان روزانه جفت BTC ${(d.volatility30d * 100).toFixed(1)}٪`);
	return factor("risk", score, bits.join("؛ ") || "ریسک متوسط مجموعه.");
}
function scoreNarrative(d) {
	const meta = lookupMeta(d.symbol);
	let score = 46;
	const bits = [];
	const tags = d.narrativeTags.length ? d.narrativeTags : meta.tags;
	const tagsFa = d.narrativeTagsFa.length ? d.narrativeTagsFa : meta.tagsFa;
	const accrual = d.accrual || meta.accrual;
	if (tagsFa.length) bits.push(`روایت: ${tagsFa.join("، ")}`);
	if (isHot(tags)) {
		score += 20;
		bits.push("در ترند فعال بازار است");
	} else if (tags.length) score += 6;
	else bits.push(meta.note);
	if (accrual === "real-yield" || accrual === "burn" || accrual === "store-of-value") score += 18;
	else if (accrual === "staking") score += 10;
	else if (accrual === "governance") {
		score += 2;
		bits.push("عمدتاً حاکمیتی است و ارزش مالی مستقیم کمی دارد");
	} else {
		score -= 6;
		bits.push("مکانیزم ارزش‌افزایی مالی ضعیف است");
	}
	if (d.accrualNote) bits.push(d.accrualNote);
	return factor("narrative", score, bits.join("؛ "));
}
function pickWinner(ranked, regime) {
	const eligible = ranked.filter((r) => {
		if (r.volume24h < 8e6) return false;
		if (r.rank > 100) return false;
		if (r.symbol !== "BTC" && r.mcFdv != null && r.mcFdv < .32) return false;
		if (r.symbol !== "BTC" && r.distFrom30dHighPct != null && r.distFrom30dHighPct > -.03) return false;
		if (r.rs7d > .18 && (r.rsi14 == null || r.rsi14 > 60) && (r.distFrom30dHighPct == null || r.distFrom30dHighPct > -.1)) return false;
		return true;
	});
	const sorted = [...eligible.length ? eligible : ranked.filter((r) => r.rank <= 100)].sort((a, b) => b.score - a.score);
	let pick = sorted[0];
	const btc = ranked.find((r) => r.symbol === "BTC");
	if (pick && btc && pick.symbol !== "BTC" && regime === "btc") {
		if (pick.score - btc.score < 3.5) pick = btc;
	}
	if (pick && pick.rsi14 != null && pick.rsi14 > 78) {
		const alt = sorted.find((r) => r.symbol !== pick.symbol && (r.rsi14 == null || r.rsi14 < 72));
		if (alt && pick.score - alt.score < 8) pick = alt;
	}
	const runnerUp = sorted.find((r) => r.symbol !== pick?.symbol) ?? null;
	return {
		pick: pick ?? ranked[0],
		runnerUp
	};
}
function splitByScore(rows, totalWeight, maxN) {
	const picks = rows.slice(0, maxN);
	if (picks.length === 0) return [];
	const scores = picks.map((r) => Math.max(r.score, 1));
	const sum = scores.reduce((a, b) => a + b, 0);
	return picks.map((r, i) => ({
		symbol: r.symbol,
		name: r.name,
		rank: r.rank,
		weight: totalWeight * ((scores[i] ?? 1) / sum),
		score: r.score,
		reason: r.rank <= 50 ? "لارج‌کپ با امتیاز مدل بالا" : r.narrativeTagsFa[0] ? `میدکپ · ${r.narrativeTagsFa[0]}` : "میدکپ با پتانسیل بالاتر"
	}));
}
function buildPortfolio(ranked, regime) {
	const btc = ranked.find((r) => r.symbol === "BTC");
	const eth = ranked.find((r) => r.symbol === "ETH");
	const corePct = .55;
	const btcShare = regime === "btc" ? .4 : regime === "alt" ? .3 : .35;
	const ethShare = corePct - btcShare;
	const coreLegs = [];
	if (btc) coreLegs.push({
		symbol: btc.symbol,
		name: btc.name,
		rank: btc.rank,
		weight: eth ? btcShare : corePct,
		score: btc.score,
		reason: "هسته پایدار پرتفوی اسپات"
	});
	if (eth) coreLegs.push({
		symbol: eth.symbol,
		name: eth.name,
		rank: eth.rank,
		weight: btc ? ethShare : corePct,
		score: eth.score,
		reason: "لایه یک با ارزش‌افزایی واقعی"
	});
	const used = new Set(coreLegs.map((l) => l.symbol));
	const liquid = ranked.filter((r) => !used.has(r.symbol) && r.volume24h >= 8e6);
	const large = liquid.filter((r) => r.rank >= 3 && r.rank <= 50);
	const mid = liquid.filter((r) => r.rank >= 51 && r.rank <= 100);
	const largeLegs = splitByScore(large, .3, 4);
	const midLegs = splitByScore(mid, .15, 3);
	return [
		{
			key: "core",
			title: "هسته · بیت‌کوین و اتریوم",
			targetPct: 55,
			note: regime === "btc" ? "رژیم بیت‌کوین: وزن هسته بیشتر روی BTC است." : regime === "alt" ? "چرخش آلت: ETH داخل هسته وزن بیشتری می‌گیرد." : "بازار خنثی: هسته بین BTC و ETH تقسیم می‌شود.",
			legs: coreLegs
		},
		{
			key: "large",
			title: "لارج‌کپ · رتبه ۲۰ تا ۵۰",
			targetPct: 30,
			note: "آلت‌های نقدشونده با MC/FDV و روند قابل دفاع.",
			legs: largeLegs
		},
		{
			key: "mid",
			title: "میدکپ · رتبه ۵۰ تا ۱۰۰",
			targetPct: 15,
			note: "آستین هایپ و روایت روز؛ حجم کوچک‌تر، ریسک بالاتر.",
			legs: midLegs
		}
	];
}
var PAPRIKA = "https://api.coinpaprika.com/v1";
var BINANCE = "https://data-api.binance.vision/api/v3";
var CACHE_MS = 12e4;
var TARGET_UNIVERSE = 100;
var KLINE_LIMIT = 220;
var cache = null;
async function fetchJson(url, ms = 14e3) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.1"
			}
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
async function mapPool(items, limit, fn) {
	const out = new Array(items.length);
	let i = 0;
	async function worker() {
		while (i < items.length) {
			const idx = i++;
			out[idx] = await fn(items[idx]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return out;
}
function parseKlines(raw) {
	if (!Array.isArray(raw) || raw.length < 8) return null;
	const times = [];
	const closes = [];
	const volumes = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const t = Number(row[0]);
		const c = Number(row[4]);
		const v = Number(row[5]);
		if (!Number.isFinite(t) || !Number.isFinite(c)) continue;
		times.push(t);
		closes.push(c);
		volumes.push(Number.isFinite(v) ? v : 0);
	}
	if (closes.length < 8) return null;
	return {
		times,
		closes,
		volumes
	};
}
function alignPair(coin, btc) {
	const map = /* @__PURE__ */ new Map();
	btc.times.forEach((t, i) => {
		const px = btc.closes[i];
		if (px) map.set(t, px);
	});
	const pair = [];
	coin.times.forEach((t, i) => {
		const b = map.get(t);
		const c = coin.closes[i];
		if (b && b !== 0 && c != null) pair.push(c / b);
	});
	return pair;
}
async function runAnalysis() {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return cache.value;
	const [tickers, global, binanceTickers, btcKlines] = await Promise.all([
		fetchJson(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`),
		fetchJson(`${PAPRIKA}/global`),
		fetchJson(`${BINANCE}/ticker/24hr`),
		fetchJson(`${BINANCE}/klines?symbol=BTCUSDT&interval=1d&limit=${KLINE_LIMIT}`)
	]);
	const usdtBases = /* @__PURE__ */ new Set();
	const btcBases = /* @__PURE__ */ new Set();
	for (const t of binanceTickers) {
		if (t.symbol.endsWith("USDT")) usdtBases.add(t.symbol.slice(0, -4));
		if (t.symbol.endsWith("BTC")) btcBases.add(t.symbol.slice(0, -3));
	}
	const btcTicker = tickers.find((t) => t.symbol === "BTC");
	if (!btcTicker) throw new Error("داده بیت‌کوین در دسترس نیست");
	const btcUsd = btcTicker.quotes.USD;
	const btcPct7d = (btcUsd.percent_change_7d || 0) / 100;
	const btcPct30d = btcUsd.percent_change_30d == null ? null : btcUsd.percent_change_30d / 100;
	const ranked = [...tickers].filter((t) => typeof t.rank === "number" && t.rank > 0).sort((a, b) => a.rank - b.rank);
	const universe = [];
	for (const t of ranked) {
		if (t.rank > TARGET_UNIVERSE) break;
		if (t.symbol === "BTC") {
			universe.push(t);
			continue;
		}
		if (isNonSpotCandidate(t.symbol, t.name)) continue;
		universe.push(t);
	}
	const btcParsed = parseKlines(btcKlines);
	const klineNeed = universe.filter((t) => t.symbol.toUpperCase() !== "BTC");
	let klinesTried = klineNeed.length;
	const klineById = /* @__PURE__ */ new Map();
	if (btcParsed) {
		const fetched = await mapPool(klineNeed, 14, async (ticker) => {
			const bases = candidateBases(ticker.symbol.toUpperCase(), usdtBases);
			for (const sym of bases) {
				if (!usdtBases.has(sym) && bases.length > 1) continue;
				try {
					const parsed = parseKlines(await fetchJson(`${BINANCE}/klines?symbol=${sym}USDT&interval=1d&limit=${KLINE_LIMIT}`, 11e3));
					if (!parsed) continue;
					const pair = alignPair(parsed, btcParsed);
					return {
						id: ticker.id,
						pair: pair.length >= 8 ? pair : null,
						usd: parsed
					};
				} catch {
					continue;
				}
			}
			return {
				id: ticker.id,
				pair: null,
				usd: null
			};
		});
		for (const row of fetched) klineById.set(row.id, row);
	} else klinesTried = 0;
	const drafts = universe.map((t) => {
		const usd = t.quotes.USD;
		const btc = t.quotes.BTC;
		const symbol = t.symbol.toUpperCase();
		const bases = candidateBases(symbol, usdtBases);
		const hasBtcPair = symbol === "BTC" ? true : bases.some((b) => btcBases.has(b));
		const pack = klineById.get(t.id);
		const pairCloses = symbol === "BTC" && btcParsed ? btcParsed.closes : pack?.pair ?? [];
		const usdCloses = symbol === "BTC" && btcParsed ? btcParsed.closes : pack?.usd?.closes ?? [];
		const usdVolumes = symbol === "BTC" && btcParsed ? btcParsed.volumes : pack?.usd?.volumes ?? [];
		const rs7d = symbol === "BTC" ? 0 : vsBtc(usd.percent_change_7d || 0, btcUsd.percent_change_7d || 0);
		const rs24h = symbol === "BTC" ? 0 : vsBtc(usd.percent_change_24h || 0, btcUsd.percent_change_24h || 0);
		const rs30Fallback = symbol === "BTC" || usd.percent_change_30d == null || btcUsd.percent_change_30d == null ? null : vsBtc(usd.percent_change_30d, btcUsd.percent_change_30d);
		const origin = pairCloses.slice(-31)[0];
		const window = pairCloses.slice(-31);
		const pairSeries = window.length > 0 && origin ? window.map((v, i) => ({
			t: i,
			v: v / origin * 100
		})) : [];
		const circulating = t.circulating_supply ?? t.total_supply ?? null;
		const maxSupply = t.max_supply && t.max_supply > 0 ? t.max_supply : null;
		const mcFdv = mcFdvRatio(circulating, maxSupply, usd.price, usd.market_cap || 0);
		const meta = lookupMeta(symbol);
		const enriched = enrichFromKlines({
			id: t.id,
			symbol,
			name: t.name,
			rank: t.rank,
			priceUsd: usd.price,
			priceBtc: btc.price,
			marketCap: usd.market_cap || 0,
			volume24h: usd.volume_24h || 0,
			volumeChange24h: usd.volume_24h_change_24h || 0,
			beta: t.beta_value,
			athDrawdownPct: usd.percent_from_price_ath,
			pct1h: usd.percent_change_1h || 0,
			pct6h: usd.percent_change_6h || 0,
			pct12h: usd.percent_change_12h || 0,
			pct24h: usd.percent_change_24h || 0,
			pct7d: usd.percent_change_7d || 0,
			pct30d: usd.percent_change_30d ?? null,
			rs24h,
			rs7d,
			rs14d: null,
			rs30d: rs30Fallback,
			rsi14: null,
			volatility30d: null,
			maxDrawdown30d: null,
			distFrom30dHighPct: null,
			aboveSma: null,
			aboveEma200: null,
			weeklyStructure: null,
			obvRising: null,
			hasBtcPair,
			hasKlines: pairCloses.length >= 8,
			klineDays: Math.max(pairCloses.length, usdCloses.length),
			pairSeries,
			turnover: usd.market_cap ? usd.volume_24h / usd.market_cap : 0,
			circulatingSupply: circulating,
			maxSupply,
			mcFdv,
			narrativeTags: meta.tags,
			narrativeTagsFa: meta.tagsFa,
			accrual: meta.accrual,
			accrualNote: meta.note,
			pairCloses,
			usdCloses,
			usdVolumes
		});
		if (symbol === "BTC") return {
			...enriched,
			rs7d: 0,
			rs14d: 0,
			rs30d: 0,
			rs24h: 0
		};
		return enriched;
	});
	const klinesOk = drafts.filter((d) => d.hasKlines).length;
	const { regime, medianRs7, note: regimeNote } = detectRegime(drafts, global.bitcoin_dominance_percentage);
	const dom = dominanceBiasOf(global.bitcoin_dominance_percentage, btcPct7d, medianRs7);
	const scored = scoreUniverse(drafts, regime).sort((a, b) => b.score - a.score);
	const { pick, runnerUp } = pickWinner(scored, regime);
	const conf = confidenceOf(pick, runnerUp, pick.hasKlines, klinesOk, drafts.length);
	const { reasons, caution } = explainPick(pick, runnerUp, regime, regimeNote, btcPct7d, {
		klinesOk,
		klinesTried: drafts.length,
		dominanceNote: dom.note
	});
	const checklist = buildChecklist(pick, {
		regime,
		btcDominance: global.bitcoin_dominance_percentage,
		dominanceBias: dom.bias
	});
	const portfolio = buildPortfolio(scored, regime);
	const result = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		sources: ["CoinPaprika", "Binance"],
		btcDominance: global.bitcoin_dominance_percentage,
		btcPriceUsd: btcUsd.price,
		btcPct7d,
		btcPct30d,
		regime,
		regimeNote,
		dominanceBias: dom.bias,
		dominanceNote: dom.note,
		universeSize: scored.length,
		scannedCount: ranked.length,
		klinesOk,
		klinesTried,
		pick,
		runnerUp,
		top: scored.slice(0, 16),
		reasons,
		caution,
		confidence: conf.confidence,
		confidenceNote: conf.note,
		checklist,
		portfolio
	};
	cache = {
		at: now,
		value: result
	};
	return result;
}
//#endregion
export { runAnalysis };
