import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { _ as weeklySupportBroken, a as ema, c as mean, d as rsi, f as sma, i as distFromHigh, l as obvIsRising, m as tanhScore, n as dailyReturns, o as lookback, p as stdev, r as detectWeeklyStructure, s as maxDrawdown, t as clamp, u as percentileRank } from "./math-B3CMdRol.mjs";
import { a as writeCache, r as readCache } from "./kill-switch-Wk07hsQA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dominance.server-p3ByacWc.js
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
		note: msg("سقف عرضه ثابت؛ ذخیره ارزش شبکه.", "Fixed supply cap; the network's store of value.")
	},
	ETH: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "burn",
		note: msg("سوزاندن کارمزد و استیکینگ؛ ارزش واقعی برای هولدر.", "Fee burns and staking; real value for the holder.")
	},
	SOL: {
		tags: ["L1", "Solana"],
		tagsFa: ["لایه یک", "سولانا"],
		accrual: "staking",
		note: msg("استیکینگ بومی سولانا.", "Native Solana staking.")
	},
	BNB: {
		tags: ["L1"],
		tagsFa: ["لایه یک", "صرافی"],
		accrual: "burn",
		note: msg("سوزاندن دوره‌ای عرضه.", "Periodic supply burns.")
	},
	XRP: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "none",
		note: msg("توکن شبکه پرداخت؛ ارزش‌افزایی مستقیم ضعیف.", "Payments-network token; weak direct value accrual.")
	},
	ADA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ بدون قفل اجباری.", "Staking with no forced lockup.")
	},
	DOGE: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("عرضه تورمی و بدون ارزش‌افزایی پروتکل.", "Inflationary supply and no protocol value accrual.")
	},
	TRX: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ و کارمزد شبکه.", "Staking and network fees.")
	},
	TON: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ تون.", "TON staking.")
	},
	AVAX: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ آوالانچ.", "Avalanche staking.")
	},
	LINK: {
		tags: ["oracle", "RWA"],
		tagsFa: ["اوراکل", "RWA"],
		accrual: "staking",
		note: msg("استیکینگ چین‌لینک و روایت RWA.", "Chainlink staking and the RWA narrative.")
	},
	SUI: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ سویی.", "Sui staking.")
	},
	SHIB: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "burn",
		note: msg("سوزاندن داوطلبانه؛ کاربرد مالی ضعیف.", "Voluntary burns; weak financial use.")
	},
	DOT: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ پولکادات.", "Polkadot staking.")
	},
	BCH: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "store-of-value",
		note: msg("فورک بیت‌کوین؛ سقف عرضه مشخص.", "Bitcoin fork; a defined supply cap.")
	},
	NEAR: {
		tags: ["L1", "AI"],
		tagsFa: ["لایه یک", "هوش مصنوعی"],
		accrual: "staking",
		note: msg("استیکینگ و روایت AI.", "Staking and the AI narrative.")
	},
	LEO: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "burn",
		note: msg("توکن صرافی با سوزاندن.", "Exchange token with a burn.")
	},
	LTC: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "store-of-value",
		note: msg("سقف عرضه مشخص.", "Defined supply cap.")
	},
	DAI: {
		tags: ["stable"],
		tagsFa: ["استیبل"],
		accrual: "none",
		note: msg("استیبل‌کوین.", "Stablecoin.")
	},
	UNI: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: msg("عمدتاً حاکمیتی؛ تقسیم کارمزد محدود.", "Mostly governance; limited fee sharing.")
	},
	PEPE: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم‌کوین بدون ارزش‌افزایی.", "Meme coin with no value accrual.")
	},
	ICP: {
		tags: ["L1", "AI"],
		tagsFa: ["لایه یک", "هوش مصنوعی"],
		accrual: "burn",
		note: msg("سوزاندن چرخه‌ها.", "Cycle burns.")
	},
	TAO: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "staking",
		note: msg("استیکینگ ساب‌نت‌های AI.", "Staking of AI subnets.")
	},
	APT: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ آپتوس.", "Aptos staking.")
	},
	POL: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "staking",
		note: msg("استیکینگ پالیگان.", "Polygon staking.")
	},
	MATIC: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "staking",
		note: msg("استیکینگ پالیگان.", "Polygon staking.")
	},
	ETC: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: msg("کاربرد مالی محدود.", "Limited financial utility.")
	},
	XLM: {
		tags: ["payments"],
		tagsFa: ["پرداخت"],
		accrual: "none",
		note: msg("شبکه پرداخت.", "Payments network.")
	},
	HBAR: {
		tags: [
			"L1",
			"RWA",
			"enterprise"
		],
		tagsFa: ["لایه یک", "RWA"],
		accrual: "staking",
		note: msg("روایت سازمانی و RWA.", "Enterprise and RWA narrative.")
	},
	OKB: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "burn",
		note: msg("توکن صرافی.", "Exchange token.")
	},
	CRO: {
		tags: ["exchange"],
		tagsFa: ["صرافی"],
		accrual: "none",
		note: msg("توکن اکوسیستم صرافی.", "Exchange-ecosystem token.")
	},
	FIL: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: msg("پاداش ذخیره‌سازی غیرمتمرکز.", "Decentralized storage rewards.")
	},
	ATOM: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ کاسموس.", "Cosmos staking.")
	},
	RENDER: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "burn",
		note: msg("کارمزد رندر و سوزاندن.", "Render fees and burns.")
	},
	RNDR: {
		tags: ["AI", "DePIN"],
		tagsFa: ["هوش مصنوعی", "DePIN"],
		accrual: "burn",
		note: msg("کارمزد رندر و سوزاندن.", "Render fees and burns.")
	},
	FET: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: msg("روایت AI و استیکینگ.", "AI narrative and staking.")
	},
	ASI: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: msg("اتحاد هوش مصنوعی.", "Artificial-intelligence alliance.")
	},
	ARB: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: msg("حاکمیت آربیتروم.", "Arbitrum governance.")
	},
	OP: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: msg("حاکمیت آپتیمیسم.", "Optimism governance.")
	},
	IMX: {
		tags: ["L2", "gaming"],
		tagsFa: ["لایه دو", "گیمینگ"],
		accrual: "burn",
		note: msg("سوزاندن کارمزد.", "Fee burn.")
	},
	INJ: {
		tags: ["L1", "defi"],
		tagsFa: ["لایه یک", "دیفای"],
		accrual: "burn",
		note: msg("سوزاندن حراجی.", "Auction burn.")
	},
	STX: {
		tags: ["L2", "BTC"],
		tagsFa: ["لایه دو", "بیت‌کوین"],
		accrual: "staking",
		note: msg("Stacking روی بیت‌کوین.", "Stacking on Bitcoin.")
	},
	TIA: {
		tags: ["modular", "L1"],
		tagsFa: ["ماژولار"],
		accrual: "staking",
		note: msg("استیکینگ سلستیا.", "Celestia staking.")
	},
	SEI: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ سِی.", "Sei staking.")
	},
	S: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ سونیک.", "Sonic staking.")
	},
	WLD: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی", "هویت"],
		accrual: "none",
		note: msg("توکن هویت؛ تورم عرضه بالا.", "Identity token; high supply inflation.")
	},
	ONDO: {
		tags: ["RWA"],
		tagsFa: ["RWA"],
		accrual: "real-yield",
		note: msg("بازده دارایی واقعی.", "Real-asset yield.")
	},
	AAVE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد پروتکل و استیکینگ ایمنی.", "Protocol fees and safety-module staking.")
	},
	MKR: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("سوزاندن/بازخرید از درآمد.", "Burn or buyback from revenue.")
	},
	SKY: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("بازخرید از درآمد پروتکل.", "Buybacks from protocol revenue.")
	},
	ENA: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("درآمد استیبل‌کوین ترکیبی.", "Synthetic-stablecoin revenue.")
	},
	PENDLE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد معاملات بازده.", "Yield-trading fees.")
	},
	JUP: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "burn",
		note: msg("بازخرید از کارمزد.", "Buybacks funded by fees.")
	},
	JTO: {
		tags: ["Solana", "DePIN"],
		tagsFa: ["سولانا", "DePIN"],
		accrual: "staking",
		note: msg("استیکینگ جیتو.", "Jito staking.")
	},
	PYTH: {
		tags: ["oracle", "Solana"],
		tagsFa: ["اوراکل", "سولانا"],
		accrual: "staking",
		note: msg("استیکینگ داده قیمت.", "Price-feed staking.")
	},
	WIF: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "none",
		note: msg("میم سولانا.", "Solana meme.")
	},
	BONK: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "burn",
		note: msg("میم با سوزاندن محدود.", "Meme with limited burns.")
	},
	PENGU: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم‌کوین.", "Meme coin.")
	},
	FLOKI: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم‌کوین.", "Meme coin.")
	},
	GRT: {
		tags: ["AI", "data"],
		tagsFa: ["داده", "هوش مصنوعی"],
		accrual: "staking",
		note: msg("استیکینگ ایندکس.", "Indexer staking.")
	},
	AR: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "none",
		note: msg("ذخیره دائمی؛ ارزش‌افزایی غیرمستقیم.", "Permanent storage; indirect value accrual.")
	},
	HNT: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: msg("پاداش پوشش بی‌سیم.", "Wireless-coverage rewards.")
	},
	AKT: {
		tags: ["DePIN"],
		tagsFa: ["DePIN"],
		accrual: "staking",
		note: msg("بازار محاسبات ابری.", "Cloud-compute market.")
	},
	RUNE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: msg("سوزاندن در استخرها.", "Burns inside the pools.")
	},
	CRV: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد استخر برای لاک‌کنندگان.", "Pool fees for lockers.")
	},
	LDO: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: msg("حاکمیت لیدو.", "Lido governance.")
	},
	ENS: {
		tags: ["identity"],
		tagsFa: ["هویت"],
		accrual: "real-yield",
		note: msg("درآمد ثبت دامنه.", "Domain-registration revenue.")
	},
	QNT: {
		tags: ["enterprise"],
		tagsFa: ["سازمانی"],
		accrual: "none",
		note: msg("لایسنس سازمانی.", "Enterprise license.")
	},
	ALGO: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("پاداش مشارکت.", "Participation rewards.")
	},
	VET: {
		tags: ["enterprise"],
		tagsFa: ["سازمانی"],
		accrual: "none",
		note: msg("توکن گاز جدا دارد.", "It has a separate gas token.")
	},
	EOS: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ منابع.", "Resource staking.")
	},
	XMR: {
		tags: ["privacy"],
		tagsFa: ["حریم خصوصی"],
		accrual: "none",
		note: msg("پول خصوصی؛ بدون ارزش‌افزایی قراردادی.", "Private money; no contractual value accrual.")
	},
	KAS: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: msg("PoW؛ بدون مکانیزم بازخرید.", "Proof of work; no buyback mechanism.")
	},
	FTM: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ فانتوم.", "Fantom staking.")
	},
	SAND: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "none",
		note: msg("گیمینگ؛ تورم عرضه.", "Gaming; inflationary supply.")
	},
	MANA: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "burn",
		note: msg("سوزاندن زمین.", "Land burns.")
	},
	AXS: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "staking",
		note: msg("استیکینگ بازی.", "Game staking.")
	},
	GALA: {
		tags: ["gaming"],
		tagsFa: ["گیمینگ"],
		accrual: "none",
		note: msg("گیمینگ تورمی.", "Inflationary gaming token.")
	},
	APE: {
		tags: ["gaming", "nft"],
		tagsFa: ["گیمینگ"],
		accrual: "staking",
		note: msg("استیکینگ اکوسیستم.", "Ecosystem staking.")
	},
	STRK: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: msg("حاکمیت استارک‌نت.", "Starknet governance.")
	},
	ZK: {
		tags: ["L2"],
		tagsFa: ["لایه دو"],
		accrual: "governance",
		note: msg("حاکمیت zkSync.", "zkSync governance.")
	},
	TUSD: {
		tags: ["stable"],
		tagsFa: ["استیبل"],
		accrual: "none",
		note: msg("استیبل.", "Stablecoin.")
	},
	CAKE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: msg("سوزاندن کارمزد.", "Fee burn.")
	},
	COMP: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "governance",
		note: msg("حاکمیت کامپاند.", "Compound governance.")
	},
	SNX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد معاملات برای استیکرها.", "Trading fees for stakers.")
	},
	DYDX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد معاملات.", "Trading fees.")
	},
	GMX: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "real-yield",
		note: msg("تقسیم کارمزد.", "Fee share.")
	},
	VIRTUAL: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "none",
		note: msg("روایت ایجنت AI.", "AI-agent narrative.")
	},
	KAITO: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "none",
		note: msg("روایت AI.", "AI narrative.")
	},
	W: {
		tags: ["Solana"],
		tagsFa: ["سولانا"],
		accrual: "none",
		note: msg("توکن بریج ورم‌هول.", "Wormhole bridge token.")
	},
	JASMY: {
		tags: ["data"],
		tagsFa: ["داده"],
		accrual: "none",
		note: msg("داده شخصی.", "Personal-data token.")
	},
	IOTA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "none",
		note: msg("لجر بدون کارمزد.", "Feeless ledger.")
	},
	HYPE: {
		tags: ["defi"],
		tagsFa: ["دیفای"],
		accrual: "burn",
		note: msg("سوزاندن از کارمزد پرپ.", "Burns funded by perp fees.")
	},
	BERA: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("استیکینگ برچین.", "Berachain staking.")
	},
	TRUMP: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم سیاسی.", "Political meme.")
	},
	MELANIA: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم سیاسی.", "Political meme.")
	},
	SPX: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم.", "Meme.")
	},
	MOG: {
		tags: ["meme"],
		tagsFa: ["میم"],
		accrual: "none",
		note: msg("میم.", "Meme.")
	},
	POPCAT: {
		tags: ["meme", "Solana"],
		tagsFa: ["میم", "سولانا"],
		accrual: "none",
		note: msg("میم سولانا.", "Solana meme.")
	},
	GOAT: {
		tags: ["meme", "AI"],
		tagsFa: ["میم", "هوش مصنوعی"],
		accrual: "none",
		note: msg("میم AI.", "AI meme.")
	},
	TAO2: {
		tags: ["AI"],
		tagsFa: ["هوش مصنوعی"],
		accrual: "staking",
		note: msg("AI.", "AI.")
	},
	OM: {
		tags: ["RWA"],
		tagsFa: ["RWA"],
		accrual: "staking",
		note: msg("روایت RWA.", "RWA narrative.")
	},
	MOVE: {
		tags: ["L1"],
		tagsFa: ["لایه یک"],
		accrual: "staking",
		note: msg("لایه یک موفمنت.", "Movement layer one.")
	},
	SSV: {
		tags: ["staking"],
		tagsFa: ["استیکینگ"],
		accrual: "staking",
		note: msg("زیرساخت استیکینگ.", "Staking infrastructure.")
	},
	EIGEN: {
		tags: ["restaking"],
		tagsFa: ["ری‌استیک"],
		accrual: "staking",
		note: msg("ری‌استیکینگ.", "Restaking.")
	},
	ETHFI: {
		tags: ["restaking"],
		tagsFa: ["ری‌استیک"],
		accrual: "real-yield",
		note: msg("درآمد ری‌استیک.", "Restaking revenue.")
	},
	RAY: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "burn",
		note: msg("کارمزد دکس سولانا.", "Solana DEX fees.")
	},
	ORCA: {
		tags: ["Solana", "defi"],
		tagsFa: ["سولانا", "دیفای"],
		accrual: "real-yield",
		note: msg("کارمزد دکس.", "DEX fees.")
	},
	WETH: {
		tags: ["wrapped"],
		tagsFa: ["رپد"],
		accrual: "none",
		note: msg("رپد.", "Wrapped asset.")
	}
};
var ACCRUAL_FIX = { JUP: "burn" };
function isCatalogued(symbol) {
	return Object.prototype.hasOwnProperty.call(META, symbol.toUpperCase());
}
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
		note: msg("در کاتالوگ روایت نبود؛ امتیاز خنثی.", "Not in the narrative catalog; the score stays neutral.")
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
/**
* Fixed priors. They are not fitted on the backtest sample.
* Each factor has one job. Relative strength only caps structure.
* RSI and MACD only confirm. ATR only sizes the zone and the risk.
* A lower price is never itself a point.
*/
var OPPORTUNITY_WEIGHTS = {
	structure: .26,
	rewardRisk: .18,
	trend: .14,
	liquidity: .14,
	volume: .08,
	volatility: .08,
	proximity: .06,
	data: .06
};
var PART_LABEL = {
	structure: "ساختار حمایت",
	rewardRisk: "نسبت سود به زیان",
	trend: "روند میانگین",
	liquidity: "نقدشوندگی",
	volume: "حجم",
	volatility: "نوسان",
	proximity: "فاصله تا محدوده",
	data: "کیفیت داده"
};
var STATUS_LABEL = {
	actionable: "قابل بررسی",
	confirmed: "تأیید تکنیکال",
	"in-zone": "داخل محدوده، بدون تأیید",
	approaching: "نزدیک محدوده",
	watching: "در انتظار",
	invalidated: "نامعتبر",
	passed: "عبور بدون ورود",
	unconfirmed: "فرصت تأییدنشده"
};
function emptyOpportunityBoard(generatedAt, note) {
	return {
		generatedAt,
		scanned: 0,
		withData: 0,
		items: [],
		actionable: [],
		watch: [],
		near: [],
		inZone: [],
		confirmed: [],
		invalidated: [],
		passed: [],
		unconfirmed: [],
		note
	};
}
function confirmationMet(input) {
	return input.overlapped && input.held && (input.rsiTurn || input.macdTurn) && !input.climaticSell;
}
function atr(bars, period = 14) {
	if (bars.length < period + 1) return null;
	const trs = [];
	for (let i = 1; i < bars.length; i++) {
		const prev = bars[i - 1].c;
		const bar = bars[i];
		trs.push(Math.max(bar.h - bar.l, Math.abs(bar.h - prev), Math.abs(bar.l - prev)));
	}
	let value = mean(trs.slice(0, period));
	for (let i = period; i < trs.length; i++) value = (value * (period - 1) + trs[i]) / period;
	return value > 0 ? value : null;
}
function pivotLows(bars, left = 2, right = 2) {
	const out = [];
	for (let i = left; i < bars.length - right; i++) {
		const price = bars[i].l;
		let ok = true;
		for (let j = i - left; j <= i + right; j++) if (j !== i && bars[j].l <= price) {
			ok = false;
			break;
		}
		if (ok) out.push({
			index: i,
			price
		});
	}
	return out;
}
function pivotHighs(bars, left = 2, right = 2) {
	const out = [];
	for (let i = left; i < bars.length - right; i++) {
		const price = bars[i].h;
		let ok = true;
		for (let j = i - left; j <= i + right; j++) if (j !== i && bars[j].h >= price) {
			ok = false;
			break;
		}
		if (ok) out.push({
			index: i,
			price
		});
	}
	return out;
}
function emaAt(values, period) {
	return ema(values, period);
}
function macdHist(closes) {
	if (closes.length < 35) return null;
	const fast = emaSeries(closes, 12);
	const slow = emaSeries(closes, 26);
	if (!fast || !slow) return null;
	const macd = [];
	for (let i = 0; i < closes.length; i++) {
		const f = fast[i];
		const s = slow[i];
		if (f == null || s == null) macd.push(NaN);
		else macd.push(f - s);
	}
	const seq = macd.map((v, i) => Number.isFinite(v) && i >= 25 ? v : null).filter((v) => v != null);
	if (seq.length < 9) return null;
	const signal = emaAt(seq, 9);
	const last = seq[seq.length - 1];
	if (signal == null || last == null) return null;
	return last - signal;
}
function emaSeries(values, period) {
	if (values.length < period) return null;
	const k = 2 / (period + 1);
	const out = Array.from({ length: values.length }, () => null);
	let prev = 0;
	for (let i = 0; i < period; i++) prev += values[i] ?? 0;
	prev /= period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = ((values[i] ?? 0) - prev) * k + prev;
		out[i] = prev;
	}
	return out;
}
function volumeZ(bars) {
	const useQuote = bars.slice(-21).reduce((s, b) => s + b.q, 0) > 0;
	const seq = bars.slice(-21).map((b) => useQuote ? b.q : b.v);
	if (seq.length < 8) return null;
	const last = seq[seq.length - 1] ?? 0;
	const base = seq.slice(0, -1);
	const sd = stdev(base);
	if (sd === 0) return 0;
	return (last - mean(base)) / sd;
}
function relativeStrength(closes, btc) {
	const n = Math.min(closes.length, btc.length, 31);
	if (n < 20) return null;
	const c0 = closes[closes.length - n];
	const c1 = closes[closes.length - 1];
	const b0 = btc[btc.length - n];
	const b1 = btc[btc.length - 1];
	if (!c0 || !c1 || !b0 || !b1) return null;
	return c1 / c0 - b1 / b0;
}
function supportZones(bars, atrValue) {
	const pivots = pivotLows(bars).filter((p) => p.index >= bars.length - 90);
	if (pivots.length === 0) return [];
	const band = Math.max(atrValue * .75, (bars[bars.length - 1]?.c ?? 1) * .012);
	const sorted = [...pivots].sort((a, b) => a.price - b.price);
	const groups = [];
	for (const pivot of sorted) {
		const current = groups[groups.length - 1];
		const anchor = current?.[0];
		if (!current || !anchor || pivot.price - anchor.price > band) groups.push([pivot]);
		else current.push(pivot);
	}
	return groups.map((group) => {
		const prices = group.map((g) => g.price);
		return {
			low: Math.min(...prices),
			high: Math.max(...prices),
			touches: group.length,
			lastIndex: Math.max(...group.map((g) => g.index))
		};
	});
}
function chooseZone(bars, atrValue, ema50) {
	const price = bars[bars.length - 1]?.c ?? 0;
	if (price <= 0) return null;
	const zones = supportZones(bars, atrValue).filter((zone) => {
		const mid = (zone.low + zone.high) / 2;
		const notTooFar = (price - zone.high) / price <= .3;
		const stillRelevant = price >= zone.low * .9;
		return mid > 0 && notTooFar && stillRelevant;
	});
	const below = zones.filter((zone) => zone.high <= price * .998);
	const inside = zones.filter((zone) => price >= zone.low && price <= zone.high);
	const broken = zones.filter((zone) => price < zone.low && price >= zone.low * .9);
	const ranked = (below.length > 0 ? below : inside.length > 0 ? inside : broken).sort((a, b) => Math.abs(price - a.high) - Math.abs(price - b.high));
	for (const zone of ranked) {
		const mid = (zone.low + zone.high) / 2;
		const nearEma = ema50 != null && Math.abs(mid - ema50) <= atrValue;
		if (zone.touches >= 2 || zone.touches === 1 && nearEma) return zone;
	}
	return null;
}
function overlappedRecent(bars, zone, lookback) {
	return bars.slice(-lookback).some((bar) => bar.l <= zone.high && bar.h >= zone.low);
}
function rsiTurn(closes) {
	const now = rsi(closes, 14);
	if (now == null || now <= 35) return false;
	let wasWeak = false;
	let earlier = null;
	for (let k = 0; k < 5; k++) {
		const value = rsi(closes.slice(0, closes.length - k), 14);
		if (k === 3) earlier = value;
		if (value != null && value < 38) wasWeak = true;
	}
	return wasWeak && earlier != null && now > earlier;
}
function macdTurn(closes) {
	const now = macdHist(closes);
	const prev = macdHist(closes.slice(0, -1));
	if (now == null || prev == null) return false;
	return now > 0 && prev <= 0;
}
function rewardMultiple(bars, zone, invalidation) {
	const mid = (zone.low + zone.high) / 2;
	const risk = mid - invalidation;
	if (risk <= 0) return {
		rr: null,
		target: null
	};
	const highs = pivotHighs(bars).filter((p) => p.price > zone.high * 1.01);
	const lastHigh = highs.length ? highs[highs.length - 1].price : null;
	const windowHigh = Math.max(...bars.slice(-40).map((b) => b.h));
	const target = lastHigh != null && lastHigh > mid ? Math.min(lastHigh, windowHigh) : windowHigh;
	if (target <= mid) return {
		rr: null,
		target: null
	};
	return {
		rr: (target - mid) / risk,
		target
	};
}
function part(key, score, note) {
	return {
		key,
		label: PART_LABEL[key],
		score: clamp(score),
		weight: OPPORTUNITY_WEIGHTS[key],
		note
	};
}
function evaluateAsset(input, ctx) {
	const bars = input.bars.filter((b) => b.c > 0 && b.h > 0 && b.l > 0);
	const closes = bars.map((b) => b.c);
	const last = bars[bars.length - 1];
	const price = input.priceUsd > 0 ? input.priceUsd : last?.c ?? 0;
	const base = {
		symbol: input.symbol,
		name: input.name,
		rank: input.rank,
		priceUsd: price,
		volume24h: input.volume24h,
		updatedAt: ctx.generatedAt,
		confirmRules: [
			"قیمت باید واقعاً داخل محدوده معامله شده باشد، نه فقط به آن نزدیک شده باشد.",
			"بسته شدن روزانه نباید زیر کف محدوده باشد.",
			"یا RSI از زیر ۳۸ برگشته و بالاتر از سه کندل قبل است، یا هیستوگرام MACD از منفی به مثبت چرخیده است.",
			"کندل نزولی با حجم غیرعادی (z بالای ۱٫۲) تأیید را باطل می‌کند."
		],
		invalidateRules: ["بسته شدن روزانه زیر کف محدوده منهای نصف ATR.", "یا دو بسته شدن پیاپی زیر کف محدوده."],
		path: bars.slice(-90).map((b, i) => ({
			t: i,
			c: b.c
		}))
	};
	const unfinished = (summary, hurts) => ({
		...base,
		status: "unconfirmed",
		statusLabel: STATUS_LABEL.unconfirmed,
		zone: null,
		distancePct: null,
		summary,
		risk: "high",
		confidence: "unrated",
		confidenceNote: "فرصت تأییدنشده است. سطح اطمینان وقتی اعلام می‌شود که هم داده کافی باشد و هم قوانین تأیید و ابطال قابل محاسبه باشند.",
		score: 0,
		parts: [],
		helps: [],
		hurts,
		rewardRisk: null,
		targetUsd: null,
		blockedByKill: ctx.spotBuys === "suspended",
		scenarios: [
			{
				key: "reach",
				title: "رسیدن به محدوده",
				state: "not-applicable",
				detail: "محدوده آزمون‌شده‌ای تعریف نشد."
			},
			{
				key: "confirm",
				title: "تأیید تکنیکال",
				state: "not-applicable",
				detail: "بدون محدوده، تأیید ورود معنی ندارد."
			},
			{
				key: "invalidate",
				title: "باطل شدن",
				state: "not-applicable",
				detail: "سطح ابطال عددی ندارد."
			},
			{
				key: "miss",
				title: "عبور بدون ورود",
				state: "not-applicable",
				detail: "سناریوی تعقیب ساخته نشد."
			}
		]
	});
	if (!last || bars.length < 80) return unfinished(`${input.symbol} کندل روزانه کافی برای ساخت حمایت، ATR و MACD ندارد. ارزان‌تر شدن آن فرصت محسوب نمی‌شود.`, ["داده روزانه ناکافی است."]);
	const atrValue = atr(bars);
	if (atrValue == null) return unfinished(`${input.symbol} نوسان قابل محاسبه ندارد.`, ["ATR ساخته نشد."]);
	const ema50 = emaAt(closes, 50);
	const ema50Prev = emaAt(closes.slice(0, -5), 50);
	const zonePick = chooseZone(bars, atrValue, ema50);
	const high60 = Math.max(...bars.slice(-60).map((b) => b.h));
	const extended = price >= high60 * .96 || (rsi(closes, 14) ?? 0) >= 70;
	if (!zonePick) return unfinished(extended ? `${input.symbol} نزدیک سقف اخیر است، اما حمایت آزمون‌شده‌ای زیر قیمت پیدا نشد. فقط به‌خاطر گران بودن به فهرست انتظار نمی‌رود.` : `${input.symbol} افت یا نوسان داشته، ولی دو برخورد یا تلاقی با EMA۵۰ در زیر قیمت دیده نشد. افت قیمت به‌تنهایی محدوده ورود نمی‌سازد.`, [extended ? "سقف اخیر بدون حمایت مشخص." : "حمایت تکرارشده پیدا نشد."]);
	const pad = Math.min(atrValue * .15, price * .01);
	const zoneLow = Math.max(0, zonePick.low - pad);
	const zoneHigh = zonePick.high + pad;
	const invalidation = zoneLow - atrValue * .5;
	const zone = {
		low: zoneLow,
		high: zoneHigh,
		touches: zonePick.touches,
		invalidation,
		atr: atrValue,
		reason: zonePick.touches >= 2 ? `${zonePick.touches} کف تأییدشده در ${formatPx(zoneLow)} تا ${formatPx(zoneHigh)}، با عرض کنترل‌شده توسط ATR.` : `یک کف تأییدشده نزدیک EMA۵۰ در ${formatPx(zoneLow)} تا ${formatPx(zoneHigh)}.`
	};
	const prev = bars[bars.length - 2];
	const broken = last.c < invalidation || prev != null && last.c < zoneLow && prev.c < zoneLow;
	const overlapped = overlappedRecent(bars, {
		...zonePick,
		low: zoneLow,
		high: zoneHigh
	}, 3);
	const held = last.c >= zoneLow;
	const z = volumeZ(bars);
	const climaticSell = last.c < last.o && (z ?? 0) > 1.2;
	const turnRsi = rsiTurn(closes);
	const turnMacd = macdTurn(closes);
	const confirmed = confirmationMet({
		overlapped,
		held,
		rsiTurn: turnRsi,
		macdTurn: turnMacd,
		climaticSell
	});
	const inZone = last.l <= zoneHigh && last.h >= zoneLow && last.c <= zoneHigh * 1.01;
	const distancePct = price > 0 ? (price - zoneHigh) / price : null;
	const pressingHigh = last.c >= high60 * .98;
	const missed = !overlappedRecent(bars, {
		...zonePick,
		low: zoneLow,
		high: zoneHigh
	}, 12) && last.c > zoneHigh * 1.08 && pressingHigh && bars.length - 1 - zonePick.lastIndex >= 12;
	let status;
	if (broken) status = "invalidated";
	else if (confirmed) status = "confirmed";
	else if (inZone || last.c <= zoneHigh && last.c >= zoneLow) status = "in-zone";
	else if (missed) status = "passed";
	else if (distancePct != null && distancePct > 0 && distancePct <= .03) status = "approaching";
	else if (distancePct != null && distancePct > 0 && distancePct <= .22) status = "watching";
	else status = "unconfirmed";
	const rs = input.symbol === "BTC" ? 0 : relativeStrength(closes, input.btcCloses);
	let structure = zone.touches >= 3 ? 74 : zone.touches >= 2 ? 62 : 48;
	const lows = pivotLows(bars).slice(-2);
	if (lows.length === 2 && lows[1].price > lows[0].price) structure += 14;
	if (lows.length === 2 && lows[1].price < lows[0].price * .99) structure -= 22;
	if (ema50 != null && Math.abs((zoneLow + zoneHigh) / 2 - ema50) <= atrValue) structure += 8;
	if (rs != null && rs < -.12) structure = Math.min(structure, 42);
	if (rs != null && rs > .05) structure = Math.min(100, structure + 6);
	const { rr, target } = rewardMultiple(bars, {
		...zonePick,
		low: zoneLow,
		high: zoneHigh
	}, invalidation);
	const rrScore = rr == null ? 20 : clamp(rr / 3 * 100);
	let trend = 40;
	let trendNote = "میانگین ۵۰روزه نامشخص است.";
	if (ema50 != null && ema50Prev != null) {
		const rising = ema50 > ema50Prev;
		if (last.c >= ema50 && rising) {
			trend = 84;
			trendNote = "قیمت بالای EMA۵۰ است و خود میانگین صعودی است.";
		} else if (last.c >= ema50) {
			trend = 64;
			trendNote = "قیمت بالای EMA۵۰ است ولی شیب میانگین صاف یا منفی است.";
		} else if (rising) {
			trend = 46;
			trendNote = "قیمت زیر EMA۵۰ است؛ روند میانگین هنوز کاملاً نشکسته.";
		} else {
			trend = 22;
			trendNote = "قیمت و EMA۵۰ هر دو ضعیف‌اند. این اصلاح سالم نیست.";
		}
	}
	const volScore = volumeScore(input.volume24h);
	const turnScore = input.turnover >= .02 ? 85 : input.turnover >= .008 ? 60 : 35;
	const liquidity = volScore * .7 + turnScore * .3;
	const liquidityNote = input.volume24h >= 8e6 ? "حجم تتری برای بررسی اسپات کافی است. اسپرد خام در این اسکن نیست." : input.volume24h >= 2e6 ? "حجم قابل قبول است ولی برای اندازه بزرگ باید تب عمق جدا دیده شود." : "حجم پایین است. حتی اگر ساختار خوب باشد، اجرای سفارش خودش ریسک است.";
	let volume = 58;
	let volumeNote = "حجم نسبت به بیست روز اخیر عادی است.";
	if (z == null) {
		volume = 45;
		volumeNote = "سری حجم برای سنجش ناهنجاری کوتاه بود.";
	} else if (z > 2 && last.c < last.o) {
		volume = 24;
		volumeNote = "حجم غیرعادی روی کندل نزولی است؛ این تأیید خرید نیست.";
	} else if (z > 1.4 && last.c >= last.o && (status === "in-zone" || status === "confirmed")) {
		volume = 78;
		volumeNote = "حجم بالاتر از معمول همراه با بسته شدن مثبت داخل محدوده است.";
	} else if (z > 2) {
		volume = 48;
		volumeNote = "حجم بالا بیرون از تأیید محدوده، به‌تنهایی دلیل ورود نیست.";
	}
	const atrPct = atrValue / price;
	let volatility = 70;
	let volNote = `ATR حدود ${(atrPct * 100).toFixed(1)}٪ قیمت است.`;
	if (atrPct >= .02 && atrPct <= .06) {
		volatility = 86;
		volNote = `${volNote} برای محدوده روزانه قابل‌تعریف است.`;
	} else if (atrPct > .12) {
		volatility = 28;
		volNote = `${volNote} نوسان آن‌قدر زیاد است که محدوده به‌راحتی شکسته می‌شود.`;
	} else if (atrPct > .08) volatility = 48;
	let proximity = 20;
	let proxNote = "فاصله تا محدوده زیاد است و فقط به‌خاطر نزدیک بودن امتیاز نمی‌گیرد.";
	if (structure >= 48 && distancePct != null) {
		if (distancePct <= 0) {
			proximity = 68;
			proxNote = "قیمت داخل یا روی محدوده است. نزدیکی کیفیت ساخت محدوده را عوض نمی‌کند.";
		} else if (distancePct <= .03) {
			proximity = 80;
			proxNote = "کمتر از ۳٪ تا سقف محدوده مانده است.";
		} else if (distancePct <= .08) {
			proximity = 60;
			proxNote = "فاصله هنوز عملی است.";
		} else if (distancePct <= .15) {
			proximity = 42;
			proxNote = "باید منتظر ماند؛ عجله برای خرید قبل از محدوده توجیه ندارد.";
		}
	} else if (structure < 48) {
		proximity = 12;
		proxNote = "ساختار ضعیف است؛ نزدیک بودن به یک کف شکننده امتیاز نمی‌سازد.";
	}
	const data = bars.length >= 180 ? 92 : bars.length >= 120 ? 74 : 55;
	const parts = [
		part("structure", structure, rs != null && rs < -.12 ? "کف‌ها شمرده شدند، اما سی‌روز اخیر در برابر بیت‌کوین ضعیف است و سقف ساختار محدود شد." : zone.reason),
		part("rewardRisk", rrScore, rr == null ? "هدف قابل اندازه‌گیری بالای محدوده پیدا نشد." : `فاصله تا ابطال در برابر فاصله تا عرضه قبلی حدود ${rr.toFixed(2)} برابر است.`),
		part("trend", trend, trendNote),
		part("liquidity", liquidity, liquidityNote),
		part("volume", volume, volumeNote),
		part("volatility", volatility, volNote),
		part("proximity", proximity, proxNote),
		part("data", data, `${bars.length} کندل روزانه در محاسبه آمده و از آینده استفاده نشده است.`)
	];
	let score = parts.reduce((sum, row) => sum + row.score * row.weight, 0);
	const hurts = [];
	const helps = [];
	for (const row of parts) {
		if (row.score >= 70) helps.push(`${row.label}: ${row.note}`);
		if (row.score < 45) hurts.push(`${row.label}: ${row.note}`);
	}
	if (ctx.regime === "btc" && input.symbol !== "BTC") {
		score -= 4;
		hurts.push("فصل نسبی بیت‌کوین است؛ آلت بدون ساختار قوی بالا نمی‌ماند.");
	}
	if (input.volume24h < 2e6) score = Math.min(score, 42);
	if (status === "invalidated" || status === "passed" || status === "unconfirmed") score = Math.min(score, status === "unconfirmed" ? 35 : 48);
	score = clamp(score);
	if (status === "confirmed" && (rr ?? 0) >= 1.2 && structure >= 50 && input.volume24h >= 2e6 && ctx.spotBuys !== "suspended") status = "actionable";
	const blockedByKill = ctx.spotBuys === "suspended" && (status === "confirmed" || status === "actionable");
	if (blockedByKill) status = "confirmed";
	let confidence = "low";
	let confidenceNote = "قوانین نوشته شده‌اند اما ساختار یا نقدشوندگی ضعیف است. این نرخ برد تاریخی نیست.";
	if (status === "unconfirmed") {
		confidence = "unrated";
		confidenceNote = "فرصت تأییدنشده. عدد اطمینان ساخته نمی‌شود.";
	} else if (bars.length >= 160 && structure >= 60 && input.volume24h >= 8e6) {
		confidence = "high";
		confidenceNote = "داده و قوانین کامل‌اند. این سطح کیفیت تحلیل است، نه نتیجه بک‌تست. تا وقتی نمونه ارزیابی کافی نباشد، بازده آینده از آن نتیجه گرفته نمی‌شود.";
	} else if (bars.length >= 100 && structure >= 45) {
		confidence = "medium";
		confidenceNote = "سناریو قابل‌آزمون است، ولی یا تاریخچه کوتاه‌تر است یا ساختار فقط متوسط است. بک‌تست جدا باید خوانده شود.";
	}
	let risk = "medium";
	if (atrPct > .08 || (rr ?? 0) < 1 || input.volume24h < 2e6 || status === "invalidated") risk = "high";
	else if (atrPct <= .05 && (rr ?? 0) >= 2 && structure >= 60 && input.volume24h >= 8e6) risk = "low";
	const distanceText = distancePct == null ? "" : distancePct <= 0 ? "قیمت فعلی داخل محدوده است." : `قیمت فعلی حدود ${(distancePct * 100).toFixed(1)}٪ بالای سقف محدوده است.`;
	const summary = [
		`${input.name} (${input.symbol}) به‌خاطر ${zone.reason}`,
		distanceText,
		"رسیدن قیمت به این باند خرید نیست.",
		confirmed ? "قوانین تأیید در آخرین کندل برقرار شده‌اند و هنوز هم تضمین سود نیستند." : "برای تأیید، برگشت RSI از زیر ۳۸ یا چرخش هیستوگرام MACD همراه با ماندن قیمت در محدوده لازم است.",
		`باطل شدن: بسته شدن زیر ${formatPx(invalidation)}.`,
		status === "passed" ? "قیمت بدون لمس محدوده بالا رفته و سیستم آن را تعقیب نمی‌کند." : "",
		blockedByKill ? "کلید قطع بیت‌کوین خرید اسپات را معلق کرده؛ این فقط پایش است." : ""
	].filter(Boolean).join(" ");
	const scenarios = [
		{
			key: "reach",
			title: "رسیدن به محدوده",
			state: broken ? "failed" : overlapped || inZone || status === "confirmed" || status === "actionable" ? "met" : "waiting",
			detail: zone.reason
		},
		{
			key: "confirm",
			title: "تأیید تکنیکال",
			state: status === "confirmed" || status === "actionable" ? "met" : inZone || overlapped ? "active" : "waiting",
			detail: turnRsi ? "RSI از ناحیه ضعیف برگشته است." : turnMacd ? "هیستوگرام MACD مثبت شده است." : "هنوز نه RSI و نه MACD شرایط تأیید را کامل نکرده‌اند."
		},
		{
			key: "invalidate",
			title: "باطل شدن سناریو",
			state: status === "invalidated" ? "failed" : "waiting",
			detail: `بسته شدن زیر ${formatPx(invalidation)} یا دو کلوز زیر ${formatPx(zoneLow)}.`
		},
		{
			key: "miss",
			title: "ادامه بدون ورود به محدوده",
			state: status === "passed" ? "met" : "waiting",
			detail: status === "passed" ? "قیمت بدون ساختن شرط ورود از محدوده فاصله گرفته. خرید تعقیبی صادر نمی‌شود." : "اگر قیمت بدون لمس محدوده بیش از ۸٪ از سقف آن دور شود، سناریو به تعقیب تبدیل نمی‌شود."
		}
	];
	return {
		...base,
		status,
		statusLabel: STATUS_LABEL[status],
		zone,
		distancePct,
		summary,
		risk,
		confidence,
		confidenceNote,
		score,
		parts,
		helps: helps.slice(0, 4),
		hurts: hurts.slice(0, 4),
		rewardRisk: rr,
		targetUsd: target,
		blockedByKill,
		scenarios
	};
}
function volumeScore(volume24h) {
	if (volume24h >= 2e7) return 90;
	if (volume24h >= 8e6) return 74;
	if (volume24h >= 2e6) return 55;
	return 22;
}
function formatPx(n) {
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (n >= 1) return n.toFixed(4);
	return n.toPrecision(4);
}
function scanOpportunities(inputs, ctx) {
	const items = inputs.map((row) => evaluateAsset(row, ctx)).sort((a, b) => b.score - a.score || a.rank - b.rank);
	const pick = (status) => items.filter((row) => row.status === status);
	const withData = items.filter((row) => row.zone != null || row.path.length >= 80).length;
	return {
		generatedAt: ctx.generatedAt,
		scanned: items.length,
		withData,
		items,
		actionable: pick("actionable"),
		watch: pick("watching"),
		near: pick("approaching"),
		inZone: pick("in-zone"),
		confirmed: pick("confirmed"),
		invalidated: pick("invalidated"),
		passed: pick("passed"),
		unconfirmed: pick("unconfirmed"),
		note: "رتبه از ساختار، نسبت محدوده تا ابطال، روند EMA، نقدشوندگی، حجم، نوسان، فاصله و کیفیت داده ساخته می‌شود. درصد افت از سقف عامل جداگانه‌ای نیست."
	};
}
/** Subtracted from the total 0–100 score when 30-day unlocks exceed 3% of supply. */
function dilutionPenalty(pctOfSupply30d) {
	if (!(pctOfSupply30d > 3)) return 0;
	if (pctOfSupply30d <= 5) return 15;
	if (pctOfSupply30d <= 8) return 18;
	return 20;
}
function dayKey(ms) {
	const d = new Date(ms);
	return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function emptyUnlock(note = msg("برنامه آزادسازی برای این نماد ثبت نشده است.", "No unlock schedule is on file for this symbol.")) {
	return {
		penalty: 0,
		highDilution: false,
		pct30d: null,
		nextDate: null,
		nextDays: null,
		cliff: false,
		note
	};
}
/**
* Cliff-style if a single UTC day releases at least 1% of supply.
* Penalty fires when the next 30 days sum to more than 3% of max (or total) supply.
* The 14–30 day band is flagged separately for the desk calendar.
*/
function assessUnlocks(input) {
	const supply = input.maxSupply && input.maxSupply > 0 ? input.maxSupply : input.totalSupply && input.totalSupply > 0 ? input.totalSupply : null;
	if (!supply) return emptyUnlock(msg("عرضه کل برای تبدیل مقدار آزادسازی به درصد در دسترس نبود.", "Total supply was unavailable, so unlock amounts could not be turned into a percent."));
	if (input.events.length === 0) return emptyUnlock(msg("رویداد آزادسازی آینده در تقویم این نماد نیست.", "No future unlock event is on this symbol’s calendar."));
	const nowMs = (input.now ?? /* @__PURE__ */ new Date()).getTime();
	const byDay = /* @__PURE__ */ new Map();
	for (const event of input.events) {
		const ms = Date.parse(event.time);
		if (!Number.isFinite(ms) || ms <= nowMs) continue;
		if (!Number.isFinite(event.amount) || event.amount <= 0) continue;
		const days = Math.ceil((ms - nowMs) / 864e5);
		if (days <= 0 || days > 30) continue;
		const key = dayKey(ms);
		const prev = byDay.get(key);
		if (prev) prev.amount += event.amount;
		else byDay.set(key, {
			ms,
			amount: event.amount,
			days
		});
	}
	if (byDay.size === 0) return emptyUnlock(msg("در ۳۰ روز آینده آزادسازی ثبت‌شده‌ای نیست.", "No recorded unlock falls in the next 30 days."));
	let pct30d = 0;
	let cliff = false;
	let bandPct = 0;
	let next = null;
	for (const [key, row] of byDay) {
		const pct = row.amount / supply * 100;
		pct30d += pct;
		const cliffDay = pct >= 1;
		if (cliffDay) cliff = true;
		if (row.days >= 14 && row.days <= 30) {
			bandPct += pct;
			if (cliffDay) cliff = true;
		}
		if (!next || row.days < next.days) next = {
			key,
			days: row.days,
			pct
		};
	}
	const penalty = dilutionPenalty(pct30d);
	const highDilution = penalty > 0;
	const pctLabel = pct30d.toFixed(2);
	const bandLabel = bandPct.toFixed(2);
	let note = `آزادسازی ۳۰ روز آینده ${pctLabel}٪ از عرضه است`;
	let noteEn = `Unlocks over the next 30 days are ${pctLabel}% of supply`;
	if (bandPct > 0) {
		note += `؛ سهم بازه ۱۴ تا ۳۰ روز ${bandLabel}٪`;
		noteEn += `; the 14–30 day band is ${bandLabel}%`;
	}
	if (cliff) {
		note += "؛ دست‌کم یک روز کلیف‌مانند (بالای ۱٪ عرضه در یک روز) دیده شد";
		noteEn += "; at least one cliff-like day (above 1% of supply in a single day) was seen";
	}
	if (highDilution) {
		note += `. برچسب High Dilution Risk و کسر ${penalty} امتیاز از نمره کل.`;
		noteEn += `. High Dilution Risk tag, and ${penalty} points deducted from the total score.`;
	} else {
		note += ". زیر آستانه ۳٪ است و جریمه امتیاز ندارد.";
		noteEn += ". It is under the 3% threshold and carries no score penalty.";
	}
	note = msg(note, noteEn);
	return {
		penalty,
		highDilution,
		pct30d,
		nextDate: next ? next.key : null,
		nextDays: next ? next.days : null,
		cliff,
		note
	};
}
function along(parts, faSep, enSep = faSep) {
	const fa = [];
	const en = [];
	for (const part of parts) {
		const cut = part.indexOf("⁣");
		if (cut < 0) {
			fa.push(part);
			en.push(part);
		} else {
			fa.push(part.slice(0, cut));
			en.push(part.slice(cut + 1));
		}
	}
	return msg(fa.join(faSep), en.join(enSep));
}
/** Time-varying factors only. Tokenomics and narrative are vetoes, not weights. The old weights were renormalized, not refit. */
var FACTOR_WEIGHTS = {
	rs: 22 / 78,
	tokenomics: 0,
	entry: 16 / 78,
	trend: 16 / 78,
	liquidity: 14 / 78,
	risk: 10 / 78,
	narrative: 0
};
var FACTOR_LABELS = {
	rs: msg("قدرت نسبی به بیت‌کوین", "Relative strength vs Bitcoin"),
	tokenomics: msg("وتو · گردش و آنلاک", "Veto · float and unlocks"),
	entry: msg("ورود · قدرت نسبی سقف‌دار", "Entry · capped relative strength"),
	trend: msg("روند کلان", "Macro trend"),
	liquidity: msg("نقدشوندگی اسپات", "Spot liquidity"),
	risk: msg("بازده به ریسک", "Return versus risk"),
	narrative: msg("وتو نیست · روایت وزن ندارد", "Not a weight · narrative is off")
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
	const pairWeekly = closes.length >= 56 ? detectWeeklyStructure(closes) : null;
	const supportBroken = weeklySupportBroken(closes);
	const window = closes.slice(-31);
	const first = window[0] ?? 1;
	const pairSeries = window.map((v, i) => ({
		t: i,
		v: first ? v / first * 100 : 100
	}));
	const usdWindow = usd.slice(-31);
	const usdFirst = usdWindow[0] ?? 1;
	const spotIndex = usdWindow.map((v, i) => ({
		t: i,
		v: usdFirst ? v / usdFirst * 100 : 100
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
		pairWeekly,
		pairSupportBroken: supportBroken,
		pairSeries,
		spotIndex
	};
}
function detectRegime(rows, btcDominance) {
	const sorted = [...rows.filter((r) => r.symbol !== "BTC").map((r) => r.rs7d)].sort((a, b) => a - b);
	const mid = sorted[Math.floor(sorted.length / 2)] ?? 0;
	const dom = typeof btcDominance === "number" && Number.isFinite(btcDominance) ? btcDominance : null;
	if (mid < -.03 || dom != null && dom >= 55) {
		if (mid < -.03 && dom != null && dom >= 52) return {
			regime: "btc",
			medianRs7: mid,
			note: msg(`میانه آلت‌ها در ۷ روز ${pct(mid)} ضعیف‌تر از بیت‌کوین بوده و دامیننس BTC ${dom.toFixed(1)}٪ است — فصل بیت‌کوین.`, `The median alt was ${pctEn(mid)} weaker than Bitcoin over 7 days and BTC dominance is ${dom.toFixed(1)}% — Bitcoin season.`)
		};
	}
	if (mid > .03 && dom != null && dom < 54) return {
		regime: "alt",
		medianRs7: mid,
		note: msg(`میانه آلت‌ها در ۷ روز ${pct(mid)} قوی‌تر از بیت‌کوین است — سرمایه دارد به آلت می‌چرخد.`, `The median alt is ${pctEn(mid)} stronger than Bitcoin over 7 days — capital is rotating into alts.`)
	};
	if (mid < -.03) return {
		regime: "btc",
		medianRs7: mid,
		note: msg(`میانه آلت‌ها در ۷ روز ${pct(mid)} مقابل بیت‌کوین منفی است.`, `The median alt versus Bitcoin is ${pctEn(mid)} over 7 days, and that is negative.`)
	};
	if (mid > .03) return {
		regime: "alt",
		medianRs7: mid,
		note: msg(`میانه آلت‌ها در ۷ روز ${pct(mid)} بیت‌کوین را شکست داده.`, `The median alt beat Bitcoin by ${pctEn(mid)} over 7 days.`)
	};
	return {
		regime: "neutral",
		medianRs7: mid,
		note: msg(`بازار خنثی است؛ میانه آلت‌ها مقابل بیت‌کوین ${pct(mid)} در ۷ روز.`, `The market is neutral; the median alt versus Bitcoin is ${pctEn(mid)} over 7 days.`)
	};
}
function pct(x) {
	const v = x * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}٪`;
}
function pctEn(x) {
	const v = x * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
function scoreUniverse(drafts, regime, ctx) {
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
		const unlock = ctx?.unlocks?.get(d.symbol) ?? emptyUnlock();
		const penalty = d.symbol === "BTC" ? 0 : unlock.penalty;
		let score = factors.reduce((s, f) => s + f.score * f.weight, 0) - penalty;
		const tok = factors.find((f) => f.key === "tokenomics");
		if (tok) tok.note = along([msg("توکنومیکس وزن ندارد. گردش خیلی کم، کلیف، حجم زیر حد، یا نبودن در صرافی نام را حذف می‌کند.", "Tokenomics has no weight. Very low float, a cliff, volume under the floor, or a missing exchange listing removes the name."), tok.note], " ");
		const narrative = factors.find((f) => f.key === "narrative");
		if (narrative) narrative.note = along([msg("روایت در رتبه شرکت نمی‌کند.", "Narrative does not take part in the rank."), narrative.note], " ");
		const kill = ctx?.kill;
		let buySignal = "open";
		let sizeMultiplier = 1;
		if (d.symbol !== "BTC" && kill && kill.status === "SUSPENDED") {
			buySignal = "suspended";
			sizeMultiplier = 0;
		}
		const { pairCloses: _p, usdCloses: _u, usdVolumes: _v, ...rest } = d;
		return {
			...rest,
			unlockPenalty: penalty,
			highDilution: d.symbol === "BTC" ? false : unlock.highDilution,
			unlockPct30d: d.symbol === "BTC" ? null : unlock.pct30d,
			unlockDate: d.symbol === "BTC" ? null : unlock.nextDate,
			unlockDays: d.symbol === "BTC" ? null : unlock.nextDays,
			unlockCliff: d.symbol === "BTC" ? false : unlock.cliff,
			buySignal,
			sizeMultiplier,
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
	let fa = `ترکیب ۷/۱۴/۳۰ روزه مقابل BTC: ${pct(blend)} (صدک ${p.toFixed(0)} در این مجموعه).`;
	let en = `Blended 7/14/30-day strength vs BTC: ${pctEn(blend)} (${p.toFixed(0)}th percentile in this set).`;
	if (d.rs7d > .18) {
		score -= 10;
		fa += " جهش ۷ روزه تند است و از امتیاز قدرت نسبی کم شد.";
		en += " The 7-day jump is sharp, so relative-strength points were cut.";
	}
	if ((d.rs30d ?? 0) > .45) {
		fa += " بازده ۳۰ روزه سقف‌گذاری شد تا جهش‌های انفجاری به‌تنهایی برنده نشوند.";
		en += " The 30-day return was capped so explosive jumps do not win on their own.";
	}
	if (d.symbol === "BTC") {
		fa = "بیت‌کوین معیار است؛ امتیازش از فرصت از دست‌رفته آلت‌ها و پایداری نقدینگی می‌آید.";
		en = "Bitcoin is the benchmark; its score comes from missed alt opportunity and durable liquidity.";
	}
	return factor("rs", score, msg(fa, en));
}
function scoreTokenomics(d) {
	const bits = [];
	let score = 55;
	if (d.mcFdv != null) {
		const pctPts = d.mcFdv * 100;
		if (d.mcFdv >= .7) {
			score = 92;
			bits.push(msg(`نسبت MC/FDV ${pctPts.toFixed(0)}٪ — عرضه رقیق‌شده نزدیک گردش است.`, `MC/FDV ratio ${pctPts.toFixed(0)}% — diluted supply is close to what circulates.`));
		} else if (d.mcFdv >= .5) {
			score = 70;
			bits.push(msg(`MC/FDV ${pctPts.toFixed(0)}٪ — قابل قبول، ولی آزادسازی هنوز اثر دارد.`, `MC/FDV ${pctPts.toFixed(0)}% — acceptable, but unlocks still matter.`));
		} else if (d.mcFdv >= .35) {
			score = 38;
			bits.push(msg(`MC/FDV ${pctPts.toFixed(0)}٪ — کمتر از نصف تا ۷۰٪ توکن‌ها در گردش است.`, `MC/FDV ${pctPts.toFixed(0)}% — circulating supply is under half, short of 70%.`));
		} else {
			score = 16;
			bits.push(msg(`MC/FDV ${pctPts.toFixed(0)}٪ — فشار فروش آزادسازی ساختاری است.`, `MC/FDV ${pctPts.toFixed(0)}% — unlock sell pressure is structural.`));
		}
	} else if (d.symbol === "ETH") {
		score = 84;
		bits.push(msg("اتریوم سقف عرضه ثابت ندارد؛ ارزش از سوزاندن کارمزد و استیک می‌آید.", "Ethereum has no fixed supply cap; value comes from fee burns and staking."));
	} else {
		score = 48;
		bits.push(msg("سقف عرضه در داده نبود؛ امتیاز توکنومیکس خنثی ماند.", "The supply cap was missing from the data; the tokenomics score stayed neutral."));
	}
	if (d.symbol === "BTC") {
		score = Math.max(score, 94);
		bits.push(msg("سقف ۲۱ میلیون مشخص و قابل حسابرسی است.", "The 21 million cap is explicit and auditable."));
	}
	return factor("tokenomics", score, along(bits, " "));
}
function scoreTrend(d) {
	let score = 50;
	const bits = [];
	const trend7 = d.symbol === "BTC" ? d.pct7d / 100 : d.rs7d;
	const trend30 = d.symbol === "BTC" ? lookback(d.pairCloses, Math.min(29, Math.max(1, d.pairCloses.length - 1))) ?? trend7 : d.rs30d ?? d.rs7d;
	if (d.aboveEma200 === true) {
		score += 14;
		bits.push(msg("قیمت دلار بالای EMA ۲۰۰ روزانه است", "The dollar price is above the daily 200 EMA"));
	} else if (d.aboveEma200 === false) {
		score -= 12;
		bits.push(msg("زیر EMA ۲۰۰ روزانه — روند دلاری فرسایشی", "Below the daily 200 EMA — the dollar trend is grinding lower"));
	}
	if (d.weeklyStructure === "bull") {
		score += 14;
		bits.push(msg("ساختار هفتگی صعودی (کف و سقف بالاتر / شکست)", "Weekly structure is bullish (higher lows and highs / breakout)"));
	} else if (d.weeklyStructure === "bear") {
		score -= 12;
		bits.push(msg("ساختار هفتگی نزولی", "Weekly structure is bearish"));
	} else if (d.weeklyStructure === "range") bits.push(msg("هفتگی در ناحیه انباشت/رنج", "Weekly action is in accumulation or a range"));
	if (d.aboveSma === true) {
		score += 8;
		bits.push(d.symbol === "BTC" ? msg("بالای میانگین ۱۰ روزه", "Above the 10-day average") : msg("جفت BTC بالای میانگین ۱۰ روزه", "The BTC pair is above the 10-day average"));
	} else if (d.aboveSma === false) {
		score -= 6;
		bits.push(msg("زیر میانگین ۱۰ روزه", "Below the 10-day average"));
	}
	const s7 = Math.sign(trend7);
	const s30 = Math.sign(trend30);
	if (s7 > 0 && s30 > 0) {
		score += 8;
		bits.push(msg("۷ و ۳۰ روز هر دو مثبت‌اند", "Both the 7-day and the 30-day are positive"));
	} else if (s7 < 0 && s30 < 0) {
		score -= 8;
		bits.push(msg("۷ و ۳۰ روز هر دو منفی‌اند", "Both the 7-day and the 30-day are negative"));
	}
	if (d.obvRising === true) {
		score += 8;
		bits.push(msg("OBV در حال افزایش — حجم از روند حمایت می‌کند", "OBV is rising — volume supports the trend"));
	} else if (d.obvRising === false) {
		score -= 6;
		bits.push(msg("OBV هم‌جهت نیست", "OBV is not aligned"));
	}
	if (d.volumeChange24h > 15 && d.pct24h > 0) {
		score += 6;
		bits.push(msg("حجم با رشد قیمت آمده", "Volume arrived with the price rise"));
	} else if (d.volumeChange24h < -20 && d.pct24h > 2) {
		score -= 6;
		bits.push(msg("رشد قیمت بدون حجم", "Price rose without volume"));
	}
	if (!d.hasKlines) {
		score -= 6;
		bits.push(msg("بدون کندل کافی؛ روند با دادهٔ کوتاه‌مدت تخمین زده شد", "Not enough candles; the trend was estimated from short-term data"));
	}
	return factor("trend", score, bits.length ? along(bits, "؛ ", "; ") : msg("روند متوسط.", "Average trend."));
}
function scoreEntry(d) {
	const blend = blendRs(d);
	let score = tanhScore(blend, .12, 50);
	const bits = [];
	if (d.symbol === "BTC") bits.push(msg("ورود بیت‌کوین قدرت نسبی به خودش نیست؛ امتیاز ورود خنثی می‌ماند مگر روند سهموی شود.", "Bitcoin’s entry is not relative strength versus itself; the entry score stays neutral unless the trend turns parabolic."));
	else bits.push(msg(`ورود از قدرت نسبی سقف‌دار است: ${pct(blend)}. جلو افتادن از بیت‌کوین امتیاز دارد، نه RSI متعادل.`, `Entry is capped relative strength: ${pctEn(blend)}. Leading Bitcoin scores; a balanced RSI does not.`));
	if (d.rs7d > .18) {
		score -= 14;
		bits.push(msg("جهش ۷ روزه سهموی است و از امتیاز ورود کم شد.", "The 7-day jump is parabolic, so entry points were cut."));
	}
	if ((d.rs30d ?? 0) > .4 && (d.distFrom30dHighPct ?? 0) > -.08) {
		score -= 18;
		bits.push(msg("رالی ۳۰ روزه هنوز به سقف چسبیده؛ این تعقیب سقف است.", "The 30-day rally is still glued to the high; this is chasing the high."));
	}
	if ((d.rs30d ?? 0) > .8) score -= 12;
	if ((d.rs30d ?? 0) > 1.5) score -= 10;
	const reversal = d.pct6h > 0 && d.pct24h > 0;
	if (d.rsi14 != null && d.rsi14 < 25 && !reversal) {
		score -= 16;
		bits.push(msg(`RSI ${d.rsi14.toFixed(0)} — چاقوی در حال سقوط، نه نقطه ورود.`, `RSI ${d.rsi14.toFixed(0)} — a falling knife, not an entry.`));
	}
	return factor("entry", score, along(bits, " "));
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
	const pairFa = d.hasBtcPair ? "جفت BTC واقعی روی بایننس دارد" : "جفت BTC مستقیم روی بایننس نیست";
	const pairEn = d.hasBtcPair ? "It has a real BTC pair on Binance" : "There is no direct BTC pair on Binance";
	const depthFa = d.turnover >= .02 ? "گردش روزانه بالای ۲٪ مارکت‌کپ است." : "گردش زیر آستانه ۲٪ است؛ خروج ممکن است لغزش داشته باشد.";
	const depthEn = d.turnover >= .02 ? "Daily turnover is above 2% of market cap." : "Turnover is under the 2% threshold; an exit may slip.";
	return factor("liquidity", score, msg(`حجم ۲۴س ${volM.toFixed(0)} میلیون دلار، گردش ${turnPct.toFixed(2)}٪ از مارکت‌کپ. ${pairFa}. ${depthFa}`, `24h volume is ${volM.toFixed(0)} million dollars, turnover ${turnPct.toFixed(2)}% of market cap. ${pairEn}. ${depthEn}`));
}
function scoreRisk(d, sh, all) {
	let score = percentileRank(sh, all);
	const bits = [];
	if (d.maxDrawdown30d != null) {
		const dd = Math.abs(d.maxDrawdown30d) * 100;
		if (dd < 8) {
			score += 10;
			bits.push(msg(`حداکثر افت ۳۰ روزه جفت BTC فقط ${dd.toFixed(1)}٪`, `The BTC pair's 30-day max drawdown is only ${dd.toFixed(1)}%`));
		} else if (dd > 25) {
			score -= 12;
			bits.push(msg(`افت ۳۰ روزه ${dd.toFixed(0)}٪ — پرنوسان`, `30-day drawdown ${dd.toFixed(0)}% — volatile`));
		} else bits.push(msg(`افت ۳۰ روزه ${dd.toFixed(0)}٪`, `30-day drawdown ${dd.toFixed(0)}%`));
	}
	if (d.beta != null && d.symbol !== "BTC") {
		if (d.beta > 1.8) {
			score -= 10;
			bits.push(msg(`بتا ${d.beta.toFixed(2)} نسبت به بازار بالاست`, `Beta ${d.beta.toFixed(2)} is high versus the market`));
		} else if (d.beta < 1.25) {
			score += 6;
			bits.push(msg(`بتا ${d.beta.toFixed(2)} کنترل‌شده‌تر است`, `Beta ${d.beta.toFixed(2)} is more contained`));
		}
	}
	if (d.volatility30d != null) bits.push(msg(`نوسان روزانه جفت BTC ${(d.volatility30d * 100).toFixed(1)}٪`, `Daily BTC-pair volatility is ${(d.volatility30d * 100).toFixed(1)}%`));
	return factor("risk", score, bits.length ? along(bits, "؛ ", "; ") : msg("ریسک متوسط مجموعه.", "Average risk for the set."));
}
function scoreNarrative(d) {
	if (!isCatalogued(d.symbol)) return factor("narrative", 50, msg("در کاتالوگ روایت نبود؛ امتیاز خنثی ماند و جریمه نشد.", "Not in the narrative catalog; the score stayed neutral and was not penalized."));
	const meta = lookupMeta(d.symbol);
	let score = 46;
	const bits = [];
	const tags = d.narrativeTags.length ? d.narrativeTags : meta.tags;
	const tagsFa = d.narrativeTagsFa.length ? d.narrativeTagsFa : meta.tagsFa;
	const accrual = d.accrual || meta.accrual;
	if (tagsFa.length) bits.push(msg(`روایت: ${tagsFa.join("، ")}`, `Narrative: ${tags.join(", ")}`));
	if (isHot(tags)) {
		score += 20;
		bits.push(msg("در ترند فعال بازار است", "It is in an active market trend"));
	} else if (tags.length) score += 6;
	else bits.push(meta.note);
	if (accrual === "real-yield" || accrual === "burn" || accrual === "store-of-value") score += 18;
	else if (accrual === "staking") score += 10;
	else if (accrual === "governance") {
		score += 2;
		bits.push(msg("عمدتاً حاکمیتی است و ارزش مالی مستقیم کمی دارد", "It is mostly governance and has little direct financial value"));
	} else {
		score -= 6;
		bits.push(msg("مکانیزم ارزش‌افزایی مالی ضعیف است", "The financial value-accrual mechanism is weak"));
	}
	if (d.accrualNote) bits.push(d.accrualNote);
	return factor("narrative", score, along(bits, "؛ ", "; "));
}
function passesSpotGate(r) {
	if (r.symbol === "BTC") return true;
	if (r.buySignal === "suspended") return false;
	if (r.volume24h < 8e6) return false;
	if (r.symbol !== "BTC" && r.mcFdv != null && r.mcFdv < .35) return false;
	if (r.unlockCliff || r.highDilution) return false;
	if (!r.hasBtcPair) return false;
	return true;
}
function pickWinner(ranked, regime, _kill) {
	const eligible = ranked.filter(passesSpotGate);
	if (!eligible.length) return {
		pick: null,
		runnerUp: null,
		refused: true,
		viaSeasonRule: false
	};
	const sorted = [...eligible].sort((a, b) => b.score - a.score);
	let pick = sorted[0] ?? null;
	let viaSeasonRule = false;
	if (regime === "btc" && pick && pick.symbol !== "BTC") {
		const btc = sorted.find((row) => row.symbol === "BTC");
		if (btc && pick.score - btc.score < 3.5) {
			pick = btc;
			viaSeasonRule = true;
		}
	}
	const runnerUp = sorted.find((row) => row.symbol !== pick?.symbol) ?? null;
	return {
		pick,
		runnerUp,
		refused: false,
		viaSeasonRule
	};
}
/** The headline is the book, not the highest score. A stay or a wait is Bitcoin. */
function headlineForBook(ranked, verdict) {
	const btc = ranked.find((row) => row.symbol === "BTC") ?? null;
	const eligible = ranked.filter(passesSpotGate);
	if (verdict.kind === "buy" && verdict.symbol) {
		const sat = eligible.find((row) => row.symbol === verdict.symbol) ?? ranked.find((row) => row.symbol === verdict.symbol) ?? null;
		if (sat) return {
			pick: sat,
			runnerUp: eligible.find((row) => row.symbol !== sat.symbol) ?? null
		};
	}
	return {
		pick: btc,
		runnerUp: eligible.find((row) => row.symbol !== "BTC") ?? null
	};
}
var KEY = "dom:cmc:v1";
var FRESH_SEC = 43200;
var STALE_SEC = 1209600;
/** 1 Jan 2022. The untouched window starts here. */
var START_SEC = 1640995200;
var memory = null;
async function loadDominanceSeries() {
	if (memory && Date.now() - memory.at < FRESH_SEC * 1e3 && memory.points.length > 100) return memory.points;
	const cached = await readCache(KEY, FRESH_SEC);
	const cachedPoints = cached ? parsePoints(cached) : [];
	if (cachedPoints.length > 100) {
		memory = {
			at: Date.now(),
			points: cachedPoints
		};
		return cachedPoints;
	}
	const fresh = await fetchSeries();
	if (fresh.length > 100) {
		memory = {
			at: Date.now(),
			points: fresh
		};
		await writeCache(KEY, JSON.stringify(fresh));
		return fresh;
	}
	const stale = await readCache(KEY, STALE_SEC);
	const stalePoints = stale ? parsePoints(stale) : [];
	if (stalePoints.length > 100) {
		memory = {
			at: Date.now(),
			points: stalePoints
		};
		return stalePoints;
	}
	return memory?.points ?? [];
}
async function fetchSeries() {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 15e3);
	try {
		const end = Math.floor(Date.now() / 1e3);
		const res = await fetch(`https://api.coinmarketcap.com/data-api/v3/global-metrics/quotes/historical?convertId=2781&interval=1d&timeStart=${START_SEC}&timeEnd=${end}`, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "Mozilla/5.0 AlphaSpot/1.4"
			}
		});
		if (!res.ok) return [];
		const quotes = (await res.json()).data?.quotes;
		if (!Array.isArray(quotes)) return [];
		const points = [];
		for (const row of quotes) {
			const t = Date.parse(row.timestamp ?? "");
			const v = row.btcDominance;
			if (!Number.isFinite(t) || v == null || !Number.isFinite(v)) continue;
			points.push({
				t,
				v
			});
		}
		points.sort((a, b) => a.t - b.t);
		return points;
	} catch {
		return [];
	} finally {
		clearTimeout(timer);
	}
}
function parsePoints(raw) {
	try {
		const json = JSON.parse(raw);
		if (!Array.isArray(json)) return [];
		return json.filter((point) => point && Number.isFinite(point.t) && Number.isFinite(point.v)).sort((a, b) => a.t - b.t);
	} catch {
		return [];
	}
}
//#endregion
export { emptyUnlock as a, headlineForBook as c, mcFdvRatio as d, pickWinner as f, emptyOpportunityBoard as i, loadDominanceSeries as l, scoreUniverse as m, assessUnlocks as n, enrichFromKlines as o, scanOpportunities as p, detectRegime as r, evaluateAsset as s, FACTOR_WEIGHTS as t, lookupMeta as u };
