import { i as msg } from "./lex-BmeYOjQo.mjs";
import { a as ema, d as rsi, f as sma, g as weeklySupportBroken, i as distFromHigh, l as obvIsRising, m as tanhScore, n as dailyReturns, o as lookback, p as stdev, r as detectWeeklyStructure, s as maxDrawdown, t as clamp, u as percentileRank } from "./math-s2DhiTks.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scoring-CT_4_iXC.js
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
	rs: msg("قدرت نسبی به بیت‌کوین", "Relative strength vs Bitcoin"),
	tokenomics: msg("توکنومیکس · MC/FDV", "Tokenomics · MC/FDV"),
	entry: msg("موقعیت ورود", "Entry location"),
	trend: msg("روند کلان", "Macro trend"),
	liquidity: msg("نقدشوندگی اسپات", "Spot liquidity"),
	risk: msg("بازده به ریسک", "Return versus risk"),
	narrative: msg("روایت و ارزش‌افزایی", "Narrative and value accrual")
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
		note: msg("RSI روزانه در دسترس نبود؛ وزن روی بقیه سیگنال‌ها رفت.", "Daily RSI was unavailable; weight shifted to the other signals.")
	};
	if (value >= 78) return {
		score: 14,
		note: msg(`RSI ${value.toFixed(0)} — اشباع خرید؛ خرید اسپات در سقف ضعیف است.`, `RSI ${value.toFixed(0)} — overbought; a spot buy into the high is weak.`)
	};
	if (value >= 70) return {
		score: 32,
		note: msg(`RSI ${value.toFixed(0)} — گرم؛ ریسک ادامه بدون اصلاح بالاست.`, `RSI ${value.toFixed(0)} — hot; the risk of continuation without a pullback is high.`)
	};
	if (value >= 42 && value <= 58) return {
		score: 96,
		note: msg(`RSI ${value.toFixed(0)} — ناحیه تعادلی مناسب برای ورود اسپات.`, `RSI ${value.toFixed(0)} — a balanced zone, suitable for a spot entry.`)
	};
	if (value >= 35 && value <= 65) return {
		score: 84,
		note: msg(`RSI ${value.toFixed(0)} — نه هیجانی، نه فرسوده.`, `RSI ${value.toFixed(0)} — neither euphoric nor exhausted.`)
	};
	if (value >= 30 && value <= 70) return {
		score: 70,
		note: msg(`RSI ${value.toFixed(0)} — قابل قبول با احتیاط.`, `RSI ${value.toFixed(0)} — acceptable, with caution.`)
	};
	if (value < 25) {
		if (shortReversal) return {
			score: 62,
			note: msg(`RSI ${value.toFixed(0)} اشباع فروش است ولی برگشت کوتاه‌مدت دیده می‌شود.`, `RSI ${value.toFixed(0)} is oversold, but a short-term reversal is showing.`)
		};
		return {
			score: 28,
			note: msg(`RSI ${value.toFixed(0)} — چاقوی در حال سقوط؛ هنوز برگشت تأیید نشده.`, `RSI ${value.toFixed(0)} — a falling knife; the reversal is not confirmed yet.`)
		};
	}
	if (value < 35) return {
		score: shortReversal ? 68 : 48,
		note: msg(`RSI ${value.toFixed(0)} — نزدیک اشباع فروش.`, `RSI ${value.toFixed(0)} — near oversold.`)
	};
	return {
		score: 58,
		note: msg(`RSI ${value.toFixed(0)}.`, `RSI ${value.toFixed(0)}.`)
	};
}
function pullbackScore(dist, athDd) {
	if (dist != null) {
		const pct = Math.abs(dist) * 100;
		if (dist > -.04) return {
			score: 16,
			note: msg(`فقط ${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — خرید سقف.`, `Only ${pct.toFixed(1)}% under the 30-day high — buying the high.`)
		};
		if (dist > -.08) return {
			score: 40,
			note: msg(`${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح خیلی کم.`, `${pct.toFixed(1)}% under the 30-day high — a very shallow pullback.`)
		};
		if (dist >= -.18) return {
			score: 94,
			note: msg(`${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح سالم، نه سقوط.`, `${pct.toFixed(1)}% under the 30-day high — a healthy pullback, not a collapse.`)
		};
		if (dist >= -.28) return {
			score: 72,
			note: msg(`${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — اصلاح عمیق‌تر ولی قابل کار.`, `${pct.toFixed(1)}% under the 30-day high — a deeper pullback, but still workable.`)
		};
		if (dist >= -.4) return {
			score: 44,
			note: msg(`${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — آسیب دیده.`, `${pct.toFixed(1)}% under the 30-day high — damaged.`)
		};
		return {
			score: 30,
			note: msg(`${pct.toFixed(1)}٪ زیر اوج ۳۰ روزه — روند آسیب‌دیده.`, `${pct.toFixed(1)}% under the 30-day high — a damaged trend.`)
		};
	}
	if (athDd != null) {
		const dd = Math.abs(athDd);
		if (dd < 8) return {
			score: 28,
			note: msg(`فقط ${dd.toFixed(0)}٪ زیر ATH — فضای کمی برای خطا.`, `Only ${dd.toFixed(0)}% under ATH — little room for error.`)
		};
		if (dd < 25) return {
			score: 70,
			note: msg(`${dd.toFixed(0)}٪ زیر ATH.`, `${dd.toFixed(0)}% under ATH.`)
		};
		if (dd < 55) return {
			score: 78,
			note: msg(`${dd.toFixed(0)}٪ زیر ATH — از اوج تاریخی فاصله معقول.`, `${dd.toFixed(0)}% under ATH — a reasonable distance from the all-time high.`)
		};
		if (dd < 80) return {
			score: 58,
			note: msg(`${dd.toFixed(0)}٪ زیر ATH.`, `${dd.toFixed(0)}% under ATH.`)
		};
		return {
			score: 36,
			note: msg(`${dd.toFixed(0)}٪ زیر ATH — بازار این دارایی را مدت‌ها تنبیه کرده.`, `${dd.toFixed(0)}% under ATH — the market has punished this asset for a long time.`)
		};
	}
	return {
		score: 55,
		note: msg("فاصله از اوج مشخص نبود.", "Distance from the high was not known.")
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
		let score = factors.reduce((s, f) => s + f.score * f.weight, 0);
		const unlock = ctx?.unlocks?.get(d.symbol) ?? emptyUnlock();
		if (d.symbol !== "BTC" && unlock.penalty > 0) {
			score -= unlock.penalty;
			const tok = factors.find((f) => f.key === "tokenomics");
			if (tok) tok.note = along([tok.note, msg(` جریمه کلیف/رقیق‌سازی: ${unlock.penalty} امتیاز از نمره کل کسر شد. ${unlock.note}`, ` Cliff/dilution penalty: ${unlock.penalty} points were deducted from the total score. ${unlock.note}`)], "");
		}
		if (d.symbol === "BTC") {
			if (regime === "btc") score += 6;
			if (regime === "alt") score -= 4;
		} else if (regime === "btc" && (d.rs7d ?? 0) < 0) score -= 3;
		if (d.volume24h < 8e6) score -= 8;
		if (!d.hasKlines) score -= 4;
		if (d.mcFdv != null && d.mcFdv < .5 && d.symbol !== "BTC" && d.symbol !== "ETH") score -= 5;
		if (d.aboveEma200 === false && d.weeklyStructure === "bear") score -= 4;
		const kill = ctx?.kill;
		let buySignal = "open";
		let sizeMultiplier = 1;
		if (d.symbol !== "BTC" && kill && kill.status === "SUSPENDED") {
			buySignal = "suspended";
			sizeMultiplier = 0;
		} else if (d.symbol !== "BTC" && kill && kill.status === "HIGH_RISK") {
			buySignal = "reduced";
			sizeMultiplier = .5;
		}
		const { pairCloses: _p, usdCloses: _u, usdVolumes: _v, ...rest } = d;
		return {
			...rest,
			unlockPenalty: d.symbol === "BTC" ? 0 : unlock.penalty,
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
	const reversal = d.pct6h > 0 && d.pct24h > 0;
	const rsiPart = rsiEntryScore(d.rsi14, reversal);
	const pb = pullbackScore(d.distFrom30dHighPct, d.athDrawdownPct);
	let score = .55 * rsiPart.score + .45 * pb.score;
	if (d.rs7d > .12 && d.rs24h > .05) score -= 12;
	if ((d.rs30d ?? 0) > .4 && (d.distFrom30dHighPct ?? 0) > -.08) score -= 18;
	if ((d.rs30d ?? 0) > .8) score -= 16;
	if ((d.rs30d ?? 0) > 1.5) score -= 10;
	if (d.rs7d > 0 && d.rs24h < -.02 && (d.rsi14 == null || d.rsi14 < 62)) score += 8;
	const note = along([rsiPart.note, pb.note], " ");
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
	if (r.buySignal === "suspended") return false;
	if (r.volume24h < 8e6) return false;
	if (r.rank > 100) return false;
	if (r.symbol !== "BTC" && r.mcFdv != null && r.mcFdv < .32) return false;
	if (r.symbol !== "BTC" && r.distFrom30dHighPct != null && r.distFrom30dHighPct > -.03) return false;
	if (r.rs7d > .18 && (r.rsi14 == null || r.rsi14 > 60) && (r.distFrom30dHighPct == null || r.distFrom30dHighPct > -.1)) return false;
	return true;
}
function pickWinner(ranked, regime, kill) {
	if (kill?.status === "SUSPENDED") return {
		pick: null,
		runnerUp: null,
		refused: true,
		viaSeasonRule: false
	};
	const eligible = ranked.filter(passesSpotGate);
	if (!eligible.length) return {
		pick: null,
		runnerUp: null,
		refused: true,
		viaSeasonRule: false
	};
	const sorted = [...eligible].sort((a, b) => b.score - a.score);
	let pick = sorted[0];
	const btc = ranked.find((r) => r.symbol === "BTC");
	let seasonForced = false;
	if (pick && btc && pick.symbol !== "BTC" && regime === "btc") {
		if (pick.score - btc.score < 3.5) {
			pick = btc;
			seasonForced = true;
		}
	}
	if (pick && pick.rsi14 != null && pick.rsi14 > 78) {
		const alt = sorted.find((r) => r.symbol !== pick.symbol && (r.rsi14 == null || r.rsi14 < 72));
		if (alt && pick.score - alt.score < 8) pick = alt;
	}
	if (pick?.highDilution) {
		const cleaner = sorted.find((r) => r.symbol !== pick.symbol && !r.highDilution && pick.score - r.score < 8);
		if (cleaner) pick = cleaner;
	}
	const viaSeasonRule = seasonForced && pick?.symbol === "BTC";
	const runnerUp = sorted.find((r) => r.symbol !== pick?.symbol) ?? null;
	return {
		pick: pick ?? null,
		runnerUp,
		refused: false,
		viaSeasonRule
	};
}
//#endregion
export { enrichFromKlines as a, pickWinner as c, emptyUnlock as i, scoreUniverse as l, assessUnlocks as n, lookupMeta as o, detectRegime as r, mcFdvRatio as s, FACTOR_WEIGHTS as t };
