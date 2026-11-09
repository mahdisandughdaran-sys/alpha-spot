import { i as msg } from "./lex-BMsOT1Y7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/planner-B2iE6X4J.js
/** Dominance is in percentage points. A move inside this band is noise. */
var DOMINANCE_DROP = 1.5;
/** Together, satellites stay under one third of capital. Not a fitted weight. */
var SATELLITE_CAP = .32;
/** Fraction of capital risked to the locked invalidation. */
var RISK_FRACTION = .01;
function dominanceIsFalling(now, prev) {
	if (now == null || prev == null) return false;
	if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
	return now < prev - DOMINANCE_DROP;
}
/**
* The only risk classification the banner, the phase, and the book share.
* A non-severe weekly bear does not defend while price is still above the
* 200-day average — that kill-switch state is still NORMAL.
*/
function deskPosture(kill) {
	if (kill.weeklyMomentum != null && kill.weeklyMomentum <= -.18) return "cash";
	const below = kill.aboveEma200 === false;
	const severe = kill.severeWeekly === true;
	if (kill.status === "SUSPENDED" || below && severe) return "cash";
	if (kill.status === "HIGH_RISK" || below || severe) return "defend";
	return "core";
}
function riskPhase(kill) {
	const posture = deskPosture(kill);
	if (posture === "cash") return "crash";
	if (posture === "defend") return "defend";
	return "trend";
}
/** Book mode used by exits. Alt season stays "core": Bitcoin's trend is intact. */
function cycleMode(kill) {
	const phase = riskPhase(kill);
	if (phase === "crash") return "cash";
	if (phase === "defend") return "defend";
	return "core";
}
/** One sentence per verdict kind. The banner and explainCycle use these same words. */
function bookSentence(kind) {
	if (kind === "buy") return msg("آلت بخر", "Buy the alt");
	if (kind === "hold") return msg("بیت‌کوین بماند، قمر بسته", "Bitcoin stays, satellite closed");
	if (kind === "stay") return msg("بیت‌کوین بخر", "Buy Bitcoin");
	if (kind === "wait") return msg("بیت‌کوین بماند، آلت منتظر محدوده", "Keep Bitcoin, the alt waits for the zone");
	return msg("نقد بمان", "Stay in cash");
}
function planCycle(input) {
	const risk = riskPhase(input.kill);
	if (risk === "crash") return {
		phase: "crash",
		cash: 1,
		btc: 0,
		altBudget: 0,
		maxNames: 0
	};
	if (risk === "defend") return {
		phase: "defend",
		cash: 0,
		btc: 1,
		altBudget: 0,
		maxNames: 0
	};
	const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
	const median = input.medianRs7;
	const weeklyBull = input.kill.weeklyStructure === "bull";
	const broad = input.regime === "alt" && median != null && median > .04;
	const leaders = falling && (input.regime === "alt" || median != null && median > .025);
	if (weeklyBull && (leaders || broad && falling)) return {
		phase: "alt-season",
		cash: 0,
		btc: 1,
		altBudget: SATELLITE_CAP,
		maxNames: 2
	};
	if (falling || input.regime === "alt") return {
		phase: "early-alt",
		cash: 0,
		btc: 1,
		altBudget: SATELLITE_CAP,
		maxNames: 1
	};
	return {
		phase: "btc",
		cash: 0,
		btc: 1,
		altBudget: 0,
		maxNames: 0
	};
}
function stanceFromWeights(cash, btc, alt) {
	if (alt >= .2) return "alt";
	if (cash >= .5 && cash >= btc && cash >= alt) return "cash";
	return "btc";
}
function explainCycle(input) {
	const pct = (n) => `${Math.round(n * 100)}`;
	const names = input.names.filter((row) => row.weight > 0).map((row) => `${row.symbol} ${pct(row.weight)}٪`).join("، ");
	const namesEn = input.names.filter((row) => row.weight > 0).map((row) => `${row.symbol} ${pct(row.weight)}%`).join(", ");
	const headline = bookSentence(input.kind);
	if (input.phase === "crash") return {
		headline,
		why: msg("روند بیت‌کوین شکسته است: یا زیر میانگین ۲۰۰روزه با ساختار هفتگی شدید، یا افت چهارهفته‌ای عمیق. آلت در این رژیم سخت‌تر از بیت‌کوین می‌ریزد. تمام دفتر تتر است تا آن سقوط تجربه نشود.", "Bitcoin’s trend is broken: under the 200-day average with a severe weekly structure, or a deep four-week drop. Alts fall harder than Bitcoin here. The whole book is tether so that drawdown is not held."),
		flip: msg("برگشت به بیت‌کوین فقط وقتی قیمت دوباره بالای میانگین ۲۰۰روزه باشد و ساختار هفتگی شدید نباشد، و افت چهارهفته‌ای از آستانهٔ سقوط برگشته باشد.", "Bitcoin comes back only after price is back above the 200-day average, weekly structure is no longer severe, and the four-week drop has left the crash threshold.")
	};
	if (input.phase === "defend") return {
		headline,
		why: msg("فقط یکی از دو ستون روند بیت‌کوین خراب است. این نقد شدن نیست. هسته نصف نمی‌شود: وزن هسته ۱۰۰٪ بیت‌کوین می‌ماند و قمر تازه باز نمی‌شود.", "Only one of Bitcoin’s two trend pillars is broken. This is not cash. The core is not cut in half: the core weight stays 100% Bitcoin and a new satellite does not open."),
		flip: msg("اگر ستون دوم هم بشکند، یا افت چهارهفته‌ای به آستانهٔ سقوط برسد، دفتر به تتر می‌رود. اگر هر دو ستون سالم شوند، قمر دوباره اجازهٔ ورود دارد.", "If the second pillar breaks, or the four-week drop hits the crash threshold, the book goes to tether. If both pillars heal, a satellite may open again.")
	};
	if (input.stance === "alt" && input.names.length > 0) {
		const season = input.phase === "alt-season";
		return {
			headline,
			why: msg(season ? `روند بیت‌کوین سالم است و آلت‌ها جلوترند. وزن هر قمر یک درصد ریسک تا حد ابطال ساختاری است و مجموع قمرها از یک‌سوم دفتر بیشتر نمی‌شود: ${names}. بقیه ${pct(input.btc)}٪ بیت‌کوین می‌ماند.` : `چرخش شروع شده ولی هنوز فصل کامل نیست. یک لیدر، نه یک سبد شلوغ: ${names}. بقیه ${pct(input.btc)}٪ بیت‌کوین است.`, season ? `Bitcoin’s trend is healthy and alts are leading. Each satellite risks one percent to its structural invalidation, and the satellites together stay under a third of the book: ${namesEn}. The other ${pct(input.btc)}% stays in Bitcoin.` : `Rotation has started but it is not a full season yet. One leader, not a crowded basket: ${namesEn}. The rest is ${pct(input.btc)}% Bitcoin.`),
			flip: msg("خروج آلت با ابطال همان نام، شکست ساختار هفتگی جفت، یا خراب شدن روند بیت‌کوین. خاموش شدن یک‌هفته‌ای دامیننس به‌تنهایی دلیل فروش نیست.", "An alt exits on that name’s invalidation, a weekly pair-structure break, or Bitcoin’s trend breaking. Dominance cooling for a single week is not, by itself, a sale.")
		};
	}
	if (input.phase === "early-alt" || input.phase === "alt-season") return {
		headline,
		why: msg("علامت چرخش هست، ولی هنوز هیچ آلتی هم ناحیهٔ تأییدشده دارد و هم ابطال ساختاری از کلوز جفت. تا آن نام پیدا شود دفتر بیت‌کوین می‌ماند، نه یک آلت تصادفی و نه نقد.", "The rotation sign is on, but no alt has both a confirmed zone and a structural invalidation from the pair closes. Until that name shows up the book stays in Bitcoin, not a random alt and not cash."),
		flip: msg("با قرار گرفتن لیدر داخل محدوده و با حمایت هفتگی قابل‌اندازه‌گیری روی جفت، بخشی از بیت‌کوین به همان آلت می‌رود. اندازه را فاصلهٔ حد تعیین می‌کند، نه بودجهٔ فصل.", "When a leader trades inside its zone and the pair’s weekly support can be measured, part of the Bitcoin sleeve moves into that alt. The stop distance sets the size, not the season’s budget.")
	};
	return {
		headline,
		why: msg("روند بیت‌کوین سالم است و آلت‌ها هنوز رهبری نمی‌کنند. خریدن آلت اینجا یعنی جا ماندن از خود بیت‌کوین. تمام دفتر بیت‌کوین است و قمر بسته است.", "Bitcoin’s trend is healthy and alts are not leading yet. Buying an alt here means lagging Bitcoin. The whole book is Bitcoin and the satellite stays shut."),
		flip: msg("اگر دامیننس حدود سی‌روزه بیفتد یا رژیم آلت روشن شود، و یک نام هم ناحیه داشته باشد هم ابطال ساختاری، وزن به همان قمر می‌رود. نقد فقط وقتی هر دو ستون روند با هم بشکنند یا افت چهارهفته‌ای به آستانهٔ سقوط برسد.", "If dominance falls over about thirty days or the alt regime turns on, and a name has both a zone and a structural invalidation, weight moves into that satellite. Cash is only when both trend pillars break together, or the four-week drop hits the crash threshold.")
	};
}
//#endregion
export { deskPosture as a, stanceFromWeights as c, cycleMode as i, SATELLITE_CAP as n, explainCycle as o, bookSentence as r, planCycle as s, RISK_FRACTION as t };
