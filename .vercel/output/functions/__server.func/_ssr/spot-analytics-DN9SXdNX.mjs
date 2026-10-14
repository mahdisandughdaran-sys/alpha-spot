import { t as clamp, u as percentileRank } from "./math-s2DhiTks.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/spot-analytics-DN9SXdNX.js
var SECTOR_DEFS = [
	{
		key: "AI",
		label: "هوش مصنوعی",
		match: ["AI"]
	},
	{
		key: "RWA",
		label: "دارایی واقعی",
		match: ["RWA"]
	},
	{
		key: "DePIN",
		label: "زیرساخت فیزیکی",
		match: ["DePIN"]
	},
	{
		key: "DeFi",
		label: "دیفای",
		match: ["defi"]
	},
	{
		key: "L2",
		label: "لایه دو",
		match: ["L2"]
	},
	{
		key: "meme",
		label: "میم",
		match: ["meme"]
	},
	{
		key: "payments",
		label: "پرداخت",
		match: ["payments"]
	},
	{
		key: "L1",
		label: "لایه یک",
		match: ["L1"]
	}
];
/** FDV divided by market cap. Above 5 means most of the supply is still locked. */
function fdvMultiple(mcFdv) {
	if (mcFdv == null || !(mcFdv > 0)) return null;
	return 1 / mcFdv;
}
/**
* Points removed from the 0–100 score when FDV is more than 5× the market cap.
* Bitcoin and ether are exempt: one has a hard cap, the other has no cap by design.
*/
function inflationPenalty(mcFdv, symbol) {
	if (symbol === "BTC" || symbol === "ETH") return 0;
	const ratio = fdvMultiple(mcFdv);
	if (ratio == null || ratio <= 5) return 0;
	if (ratio <= 8) return 8;
	if (ratio <= 12) return 12;
	return 16;
}
/**
* Close-to-close accumulation / distribution over the last 14 sessions.
* Positive means volume showed up on up days. This is a proxy, not labeled whale wallets.
*/
function accumulationIndex(closes, volumes) {
	const n = Math.min(closes.length, volumes.length);
	if (n < 16) return null;
	let pos = 0;
	let neg = 0;
	const start = Math.max(1, n - 14);
	for (let i = start; i < n; i++) {
		const prev = closes[i - 1] ?? 0;
		const close = closes[i] ?? 0;
		const vol = volumes[i] ?? 0;
		if (!(prev > 0) || !(close > 0) || !(vol > 0)) continue;
		const change = (close - prev) / prev;
		if (change >= .002) pos += vol * Math.min(change / .02, 2);
		else if (change <= -.002) neg += vol * Math.min(Math.abs(change) / .02, 2);
	}
	const total = pos + neg;
	if (!(total > 0)) return null;
	const score = (pos - neg) / total * 100;
	return {
		score,
		state: score >= 20 ? "accumulation" : score <= -20 ? "distribution" : "neutral"
	};
}
/** Small score nudge. Accumulation only helps after a real pullback, not at the high. */
function flowAdjustment(input) {
	if (input.symbol === "BTC" || !input.state || input.state === "neutral") return 0;
	const pulledBack = input.distFrom30dHighPct != null && input.distFrom30dHighPct <= -.06;
	const nearHigh = input.distFrom30dHighPct != null && input.distFrom30dHighPct > -.05;
	if (input.state === "accumulation" && pulledBack) return 4;
	if (input.state === "distribution" && nearHigh) return -6;
	if (input.state === "distribution") return -2;
	return 0;
}
function primarySector(tags) {
	for (const def of SECTOR_DEFS) if (tags.some((tag) => def.match.includes(tag))) return {
		key: def.key,
		label: def.label
	};
	return {
		key: "other",
		label: "سایر"
	};
}
function buildSectorBoard(rows) {
	const map = /* @__PURE__ */ new Map();
	for (const row of rows) {
		if (row.symbol === "BTC") continue;
		const sec = primarySector(row.narrativeTags);
		const acc = map.get(sec.key) ?? {
			key: sec.key,
			label: sec.label,
			vol: 0,
			weighted: 0,
			members: 0,
			symbols: []
		};
		const weight = Math.max(row.volume24h, 0);
		acc.vol += weight;
		acc.weighted += weight * row.pct7d;
		acc.members += 1;
		if (acc.symbols.length < 4) acc.symbols.push(row.symbol);
		map.set(sec.key, acc);
	}
	const raw = [...map.values()].filter((row) => row.members > 0 && row.vol > 0);
	const returns = raw.map((row) => row.weighted / row.vol);
	return raw.map((row) => {
		const ret = row.weighted / row.vol;
		const rank = percentileRank(ret, returns);
		const absolute = clamp(50 + Math.max(-15, Math.min(15, ret)) * 2.2);
		const score = clamp(.6 * rank + .4 * absolute);
		const tone = score >= 64 ? "نقدینگی هفت‌روزه را جذب می‌کند" : score <= 32 ? "نقدینگی از این بخش خارج می‌شود" : "جریان بخش خنثی است";
		return {
			key: row.key,
			label: row.label,
			score,
			return7d: ret,
			members: row.members,
			leaders: row.symbols,
			note: `${row.label} ${tone}. بازده وزنی ۷ روز ${ret >= 0 ? "+" : ""}${ret.toFixed(1)}٪ روی ${row.members} ارز.`
		};
	}).sort((a, b) => b.score - a.score);
}
function sectorAdjustment(input) {
	if (input.symbol === "BTC") return 0;
	const extended = input.rs7d > .18 || input.distFrom30dHighPct != null && input.distFrom30dHighPct > -.05;
	if (input.isLeader && input.sectorScore >= 64 && !extended) return 4;
	if (input.sectorScore <= 32) return -3;
	return 0;
}
function applySectorLayer(rows) {
	const board = buildSectorBoard(rows);
	const leader = board.find((row) => row.members >= 2) ?? null;
	const byKey = new Map(board.map((row) => [row.key, row]));
	return rows.map((row) => {
		const id = primarySector(row.narrativeTags);
		const sec = byKey.get(id.key);
		const boost = sectorAdjustment({
			symbol: row.symbol,
			sectorScore: sec?.score ?? 50,
			isLeader: leader != null && leader.key === id.key,
			rs7d: row.rs7d,
			distFrom30dHighPct: row.distFrom30dHighPct
		});
		if (boost !== 0) {
			const narrative = row.factors.find((factor) => factor.key === "narrative");
			if (narrative) narrative.note += boost > 0 ? ` مومنتوم بخش ${id.label} بالا است و ${boost} امتیاز به نمره کل اضافه شد.` : ` مومنتوم بخش ${id.label} ضعیف است و ${Math.abs(boost)} امتیاز از نمره کل کم شد.`;
		}
		return {
			...row,
			sectorKey: id.key,
			sectorLabel: id.label,
			sectorMomentum: sec?.score ?? null,
			sectorBoost: boost,
			score: clamp(row.score + boost)
		};
	});
}
function scoreBtcMacroRisk(input) {
	let score = 22;
	const drivers = [];
	if (input.aboveEma200 === false) {
		score += 26;
		drivers.push("قیمت بیت‌کوین زیر میانگین ۲۰۰ روزه است؛ خرید آلت در اصلاح سنگین بازار پرریسک است.");
	} else if (input.aboveEma200 === true) {
		score -= 6;
		drivers.push("قیمت بالای میانگین ۲۰۰ روزه است.");
	}
	if (input.severeWeekly) {
		score += 24;
		drivers.push("ساختار هفتگی شدیداً نزولی است: افت عمیق یا شکست کف.");
	} else if (input.weeklyStructure === "bear") {
		score += 14;
		drivers.push("ساختار هفتگی نزولی است.");
	} else if (input.weeklyStructure === "bull") {
		score -= 8;
		drivers.push("ساختار هفتگی صعودی است.");
	}
	if (input.weeklySupportBroken) {
		score += 10;
		drivers.push("حمایت چند هفته اخیر بیت‌کوین شکسته شده است.");
	}
	if (input.btcPct7d <= -.08) {
		score += 12;
		drivers.push("افت هفت‌روزه بیت‌کوین بیش از ۸٪ است.");
	} else if (input.btcPct7d <= -.03) {
		score += 6;
		drivers.push("هفته اخیر بیت‌کوین منفی است.");
	} else if (input.btcPct7d >= .04) score -= 4;
	if (input.btcPct30d != null && input.btcPct30d <= -.15) {
		score += 10;
		drivers.push("افت سی‌روزه بیت‌کوین عمیق است.");
	}
	if (input.dominanceBias === "rising") {
		score += 8;
		drivers.push("دامیننس بالا می‌رود و نقدینگی از آلت‌ها خارج می‌شود.");
	} else if (input.dominanceBias === "falling") {
		score -= 4;
		drivers.push("دامیننس پایین می‌آید؛ بخشی از نقدینگی به آلت‌ها برمی‌گردد.");
	}
	score = clamp(score);
	const level = score >= 70 ? "severe" : score >= 45 ? "elevated" : "calm";
	const sizeMultiplier = score >= 70 ? .5 : score >= 45 ? .75 : 1;
	const headline = level === "severe" ? `ریسک کلان بیت‌کوین ${Math.round(score)} — کاهش حجم` : level === "elevated" ? `ریسک کلان بیت‌کوین ${Math.round(score)} — احتیاط` : `ریسک کلان بیت‌کوین ${Math.round(score)} — مسیر باز`;
	return {
		score,
		level,
		headline,
		advice: level === "severe" ? "امتیاز از ۷۰ گذشته است. خرید تازه آلت را نصف کنید یا متوقف کنید. اگر آلت دارید، خروج یا کم کردن حجم را جدی بگیرید. در این حالت خود بیت‌کوین پناهگاه مدل است." : level === "elevated" ? "هنوز قطع کامل نیست، ولی حجم آلت را از حالت عادی کمتر بگیرید و حد ضرر ATR را اجرا کنید، نه حدس شخصی را." : "فیلتر کلان مانع خرید اسپات نیست. همچنان سقف نخرید و فقط جایی وارد شوید که جفت بیت‌کوین و نقدشوندگی هم تأیید کنند.",
		drivers,
		sizeMultiplier
	};
}
/** Close-to-close ATR proxy. Stop is 2.2×ATR, target is 3.4×ATR, and the stop trails at the same distance. */
function buildAtrPlan(input) {
	if (!(input.price > 0)) return null;
	const daily = input.volatility30d != null && input.volatility30d > .004 ? Math.min(input.volatility30d, .18) : .035;
	const atrPct = daily * 1.25;
	const stopMult = 2.2;
	const targetMult = 3.4;
	const stopPct = Math.min(.45, stopMult * atrPct);
	const targetPct = targetMult * atrPct;
	const size = input.sizeMultiplier > 0 && input.sizeMultiplier < 1 ? input.sizeMultiplier : input.sizeMultiplier === 0 ? 0 : 1;
	return {
		atrPct,
		stop: input.price * (1 - stopPct),
		target: input.price * (1 + targetPct),
		stopPct,
		targetPct,
		trailPct: stopPct,
		rewardRisk: targetMult / stopMult,
		sizeMultiplier: size,
		note: `نوسان روزانه حدود ${(daily * 100).toFixed(1)}٪ است، پس ATR تقریبی ${(atrPct * 100).toFixed(1)}٪ قیمت می‌شود. حد ضرر را ${(stopPct * 100).toFixed(1)}٪ پایین‌تر بگذارید و با همین فاصله دنبال کنید تا نوسان معمولی شما را خارج نکند. هدف محافظه‌کارانه ${(targetPct * 100).toFixed(1)}٪ بالاتر است.`
	};
}
//#endregion
export { fdvMultiple as a, primarySector as c, buildSectorBoard as i, scoreBtcMacroRisk as l, applySectorLayer as n, flowAdjustment as o, buildAtrPlan as r, inflationPenalty as s, accumulationIndex as t };
