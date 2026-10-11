import { _ as stdev, a as distFromHigh, b as weeklySupportBroken, c as lookback, d as obvIsRising, f as percentileRank, g as sma, h as rsi, i as detectWeeklyStructure, l as maxDrawdown, n as clamp, o as ema, r as dailyReturns, u as mean, v as tanhScore } from "./kill-switch-NCjjezCO.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/opportunity-CQiiG9Av.js
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
function emptyUnlock(note = "برنامه آزادسازی برای این نماد ثبت نشده است.") {
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
	if (!supply) return emptyUnlock("عرضه کل برای تبدیل مقدار آزادسازی به درصد در دسترس نبود.");
	if (input.events.length === 0) return emptyUnlock("رویداد آزادسازی آینده در تقویم این نماد نیست.");
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
	if (byDay.size === 0) return emptyUnlock("در ۳۰ روز آینده آزادسازی ثبت‌شده‌ای نیست.");
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
	if (bandPct > 0) note += `؛ سهم بازه ۱۴ تا ۳۰ روز ${bandLabel}٪`;
	if (cliff) note += "؛ دست‌کم یک روز کلیف‌مانند (بالای ۱٪ عرضه در یک روز) دیده شد";
	if (highDilution) note += `. برچسب High Dilution Risk و کسر ${penalty} امتیاز از نمره کل.`;
	else note += ". زیر آستانه ۳٪ است و جریمه امتیاز ندارد.";
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
			if (tok) tok.note += ` جریمه کلیف/رقیق‌سازی: ${unlock.penalty} امتیاز از نمره کل کسر شد. ${unlock.note}`;
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
function pickWinner(ranked, regime, kill) {
	const eligible = ranked.filter((r) => {
		if (r.buySignal === "suspended") return false;
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
	if (pick?.highDilution) {
		const cleaner = sorted.find((r) => r.symbol !== pick.symbol && !r.highDilution && pick.score - r.score < 8);
		if (cleaner) pick = cleaner;
	}
	if (kill?.status === "SUSPENDED") {
		const btc = ranked.find((r) => r.symbol === "BTC");
		if (btc) return {
			pick: btc,
			runnerUp: sorted.find((r) => r.symbol !== "BTC") ?? null
		};
	}
	const runnerUp = sorted.find((r) => r.symbol !== pick?.symbol) ?? null;
	return {
		pick: pick ?? ranked[0],
		runnerUp
	};
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
//#endregion
export { enrichFromKlines as a, mcFdvRatio as c, scoreUniverse as d, emptyUnlock as i, pickWinner as l, detectRegime as n, evaluateAsset as o, emptyOpportunityBoard as r, lookupMeta as s, assessUnlocks as t, scanOpportunities as u };
