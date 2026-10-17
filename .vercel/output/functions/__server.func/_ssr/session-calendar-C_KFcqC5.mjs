import { n as msg } from "./lex-pVOST3Oe.mjs";
import { t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
import { c as pickWinner } from "./scoring-ymNazmVA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/session-calendar-C_KFcqC5.js
function buildChecklist(pick, ctx) {
	const mcOk = pick.symbol === "BTC" || pick.symbol === "ETH" ? true : pick.mcFdv == null ? null : pick.mcFdv >= .7;
	const pairOk = pick.symbol === "BTC" ? ctx.regime !== "alt" : pick.weeklyStructure === "bull" || pick.rs7d > 0 && pick.rs30d != null && pick.rs30d > 0;
	const domOk = ctx.dominanceBias === "falling" || ctx.dominanceBias === "resistance" ? true : ctx.dominanceBias === "rising" ? pick.symbol === "BTC" : null;
	const liqOk = pick.turnover >= .02;
	const emaOk = pick.aboveEma200;
	const items = [
		{
			key: "mcfdv",
			label: msg("نسبت MC / FDV", "MC / FDV ratio"),
			desired: msg("ترجیحاً بالای ۰٫۷", "Preferably above 0.7"),
			ok: mcOk,
			detail: pick.mcFdv == null ? msg("سقف عرضه در داده نبود.", "The supply cap was missing from the data.") : msg(`MC/FDV ${(pick.mcFdv * 100).toFixed(0)}٪`, `MC/FDV ${(pick.mcFdv * 100).toFixed(0)}%`)
		},
		{
			key: "pair",
			label: msg("نمودار ALT/BTC", "ALT/BTC chart"),
			desired: msg("روند صعودی یا شکست مقاومت", "Uptrend or a resistance break"),
			ok: pairOk,
			detail: pick.symbol === "BTC" ? msg("خود بیت‌کوین معیار است.", "Bitcoin itself is the benchmark.") : pick.weeklyStructure === "bull" ? msg("ساختار هفتگی جفت/دلار صعودی است.", "Weekly pair/dollar structure is bullish.") : pick.rs7d > 0 ? msg("قدرت نسبی ۷ روزه مثبت است.", "7-day relative strength is positive.") : msg("جفت بیت‌کوین هنوز شکست معتبر ندارد.", "The Bitcoin pair still has no valid breakout.")
		},
		{
			key: "dom",
			label: msg("دامیننس بیت‌کوین", "Bitcoin dominance"),
			desired: msg("کاهشی یا برخورد به مقاومت", "Falling, or a test of resistance"),
			ok: domOk,
			detail: ctx.btcDominance == null ? msg(`دامیننس در این منبع نبود · رژیم ${ctx.regime}`, `Dominance was not in this source · regime ${ctx.regime}`) : msg(`دامیننس ${ctx.btcDominance.toFixed(1)}٪ · رژیم ${ctx.regime}`, `Dominance ${ctx.btcDominance.toFixed(1)}% · regime ${ctx.regime}`)
		},
		{
			key: "liq",
			label: msg("حجم و عمق نقدشوندگی", "Volume and liquidity depth"),
			desired: msg("حجم روزانه بالای ۲٪ مارکت‌کپ", "Daily volume above 2% of market cap"),
			ok: liqOk,
			detail: msg(`گردش ${(pick.turnover * 100).toFixed(2)}٪ از مارکت‌کپ`, `Turnover ${(pick.turnover * 100).toFixed(2)}% of market cap`)
		},
		{
			key: "ema",
			label: msg("وضعیت تکنیکال دلاری", "Dollar technical state"),
			desired: msg("بالای EMA ۲۰۰ روزانه / فاز انباشت", "Above the daily 200 EMA / accumulation phase"),
			ok: emaOk,
			detail: emaOk === true ? msg("قیمت بالای میانگین نمایی ۲۰۰ روزه است.", "Price is above the 200-day exponential moving average.") : emaOk === false ? msg("زیر EMA ۲۰۰ — روند دلاری هنوز فرسایشی است.", "Below the 200 EMA — the dollar trend is still grinding lower.") : msg("کندل ۲۰۰ روزه کامل نبود.", "The 200-day candle history was incomplete.")
		},
		{
			key: "unlock",
			label: msg("آزادسازی ۳۰ روز", "30-day unlock"),
			desired: msg("کمتر از ۳٪ عرضه کل", "Under 3% of total supply"),
			ok: pick.symbol === "BTC" ? true : pick.unlockPct30d == null ? null : !pick.highDilution,
			detail: pick.unlockPct30d == null ? msg("تقویم آزادسازی برای این نماد نبود.", "There was no unlock calendar for this symbol.") : pick.highDilution ? msg(`${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · جریمه ${pick.unlockPenalty} امتیاز · High Dilution Risk`, `${pick.unlockPct30d.toFixed(2)}% of supply in 30 days · a ${pick.unlockPenalty}-point penalty · High Dilution Risk`) : msg(`${pick.unlockPct30d.toFixed(2)}٪ عرضه در ۳۰ روز · بدون جریمه`, `${pick.unlockPct30d.toFixed(2)}% of supply in 30 days · no penalty`)
		},
		{
			key: "kill",
			label: msg("کلید قطع بیت‌کوین", "Bitcoin kill switch"),
			desired: msg("بالای EMA ۲۰۰ و هفتگی غیرنزولی شدید", "Above the 200 EMA and weekly not severely bearish"),
			ok: ctx.kill ? ctx.kill.status === "NORMAL" : null,
			detail: ctx.kill?.note ?? msg("فیلتر کلان هنوز محاسبه نشده است.", "The macro filter has not been computed yet.")
		}
	];
	if (ctx.book && pick.symbol !== "BTC") items.push({
		key: "book",
		label: msg("دفتر سفارش و فاندینگ", "Order book and funding"),
		desired: msg("اسلیپیج زیر ۳۵bps و فاندینگ سالانه زیر ۳۰٪", "Slippage under 35 bps and annualized funding under 30%"),
		ok: ctx.book.gate === "pass" ? true : ctx.book.gate === "unknown" ? null : false,
		detail: ctx.book.note
	});
	return items;
}
function checklistPassCount(items) {
	let pass = 0;
	let fail = 0;
	let unknown = 0;
	for (const item of items) if (item.ok === true) pass += 1;
	else if (item.ok === false) fail += 1;
	else unknown += 1;
	return {
		pass,
		fail,
		unknown
	};
}
function dominanceBiasOf(dominance, btcPct7d, medianRs7) {
	if (dominance >= 55 && medianRs7 < 0) return {
		bias: "rising",
		note: msg(`دامیننس BTC ${dominance.toFixed(1)}٪ و میانه آلت‌ها منفی است — سرمایه به بیت‌کوین جذب می‌شود.`, `BTC dominance is ${dominance.toFixed(1)}% and the median alt is negative — capital is being pulled into Bitcoin.`)
	};
	if (dominance >= 54.5 && Math.abs(btcPct7d) < .05) return {
		bias: "resistance",
		note: msg(`دامیننس ${dominance.toFixed(1)}٪ نزدیک مقاومت تاریخی است؛ اگر بشکند آلت‌ها جا می‌مانند.`, `Dominance at ${dominance.toFixed(1)}% is near historical resistance; if it breaks, alts get left behind.`)
	};
	if (dominance < 52 && medianRs7 > 0) return {
		bias: "falling",
		note: msg(`دامیننس ${dominance.toFixed(1)}٪ در حال کاهش است — فضای آلت‌سیزن بازتر شده.`, `Dominance at ${dominance.toFixed(1)}% is falling — the alt-season window is more open.`)
	};
	return {
		bias: "neutral",
		note: msg(`دامیننس ${dominance.toFixed(1)}٪ در ناحیه میانی است.`, `Dominance at ${dominance.toFixed(1)}% is in the middle zone.`)
	};
}
function pct(x, digits = 1) {
	const v = x * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(digits)}٪`;
}
function usd(n) {
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (n >= 1) return n.toFixed(4);
	return n.toPrecision(4);
}
function btcPriceLabel(priceBtc) {
	if (priceBtc >= .01) return `${priceBtc.toFixed(5)} BTC`;
	if (priceBtc >= 1e-4) return `${priceBtc.toFixed(6)} BTC`;
	const sats = priceBtc * 1e8;
	if (sats >= 1) return `${sats.toFixed(sats >= 100 ? 0 : 1)} sats`;
	return `${priceBtc.toExponential(2)} BTC`;
}
function confidenceOf(pick, runnerUp, hasDepth, klinesOk, universeSize) {
	const gap = runnerUp ? pick.score - runnerUp.score : 10;
	const rsiOk = pick.rsi14 == null || pick.rsi14 >= 32 && pick.rsi14 <= 68;
	const liquid = pick.volume24h >= 2e7;
	const aligned = pick.factors.filter((f) => f.score >= 60).length >= 5;
	const coverage = universeSize > 0 ? klinesOk / universeSize : 0;
	const tokenomicsOk = pick.mcFdv == null || pick.mcFdv >= .5;
	if (pick.score >= 72 && gap >= 4 && hasDepth && rsiOk && liquid && aligned && coverage >= .7 && tokenomicsOk) return {
		confidence: "high",
		note: "فاکتورها هم‌جهت‌اند، کندل‌ها کامل است و فاصله با گزینه دوم معنادار است."
	};
	if (pick.score >= 60 && (hasDepth || gap >= 3)) return {
		confidence: "medium",
		note: "سیگنال قابل اتکاست ولی یا فاصله با بقیه کم است یا یکی از فاکتورها کامل هم‌خوان نیست."
	};
	return {
		confidence: "low",
		note: "بازار مخلوط است؛ این بهترین گزینهٔ نسبی است نه یک موقعیت ایده‌آل."
	};
}
function explainPick(pick, runnerUp, regime, regimeNote, btcPct7d, extra) {
	const reasons = [];
	const caution = [];
	reasons.push(regimeNote);
	if (extra?.dominanceNote) reasons.push(extra.dominanceNote);
	if (pick.symbol === "BTC") {
		reasons.push(`در ۷ روز گذشته بیت‌کوین ${pct(btcPct7d)} روی دلار بوده و آلت‌های رقیب نتوانسته‌اند هزینه فرصت بیت را جبران کنند.`);
		reasons.push("برای خرید اسپات، نقدشوندگی بیت‌کوین بی‌رقیب است و ریسک انتخاب آلتِ عقب‌افتاده را حذف می‌کند.");
	} else {
		reasons.push(`${pick.name} در ۷ روز ${pct(pick.rs7d)} نسبت به بیت‌کوین ${pick.rs7d >= 0 ? "قوی‌تر" : "ضعیف‌تر"} بوده` + (pick.rs30d != null ? ` و در افق ۳۰ روز ${pct(pick.rs30d)}.` : "."));
		reasons.push(`قیمت دلاری ${usd(pick.priceUsd)} دلار معادل ${btcPriceLabel(pick.priceBtc)} است — تصمیم روی همین جفت گرفته شد، نه فقط نمودار تتر.`);
	}
	const entry = pick.factors.find((f) => f.key === "entry");
	const rs = pick.factors.find((f) => f.key === "rs");
	const tok = pick.factors.find((f) => f.key === "tokenomics");
	const trend = pick.factors.find((f) => f.key === "trend");
	if (tok) reasons.push(tok.note);
	if (entry) reasons.push(entry.note);
	if (rs && pick.symbol !== "BTC") reasons.push(rs.note);
	if (trend) reasons.push(trend.note);
	if (pick.rsi14 != null && pick.rsi14 > 68) caution.push("RSI بالاست؛ اگر وارد می‌شوید حجم را بشکنید یا منتظر اصلاح کوتاه بمانید.");
	if (pick.rsi14 != null && pick.rsi14 < 32 && pick.rs7d < 0) caution.push("هنوز در ضعف نسبی است؛ این انتخابِ «کم‌بدتر» است نه برگشت قطعی.");
	if (pick.athDrawdownPct != null && pick.athDrawdownPct < -70) caution.push("از اوج تاریخی خیلی فاصله دارد؛ ممکن است ارزش به‌دام‌افتاده باشد نه فرصت.");
	if (!pick.hasKlines) caution.push("کندل جفت BTC برای این ارز کامل نبود؛ افق بلندتر با قطعیت کمتر است.");
	if (pick.mcFdv != null && pick.mcFdv < .5) caution.push(`فقط ${(pick.mcFdv * 100).toFixed(0)}٪ توکن‌ها در گردش است؛ آزادسازی می‌تواند فشار فروش بسازد.`);
	if (pick.aboveEma200 === false) caution.push("زیر EMA ۲۰۰ روزانه است؛ خرید اسپات در روند نزولی فرسایشی ریسک بیشتری دارد.");
	if (pick.turnover < .02 && pick.symbol !== "BTC") caution.push("گردش روزانه زیر ۲٪ مارکت‌کپ است؛ ورود و خروج ممکن است لغزش داشته باشد.");
	if (runnerUp && runnerUp.score > pick.score - 4) caution.push(`فاصله با ${runnerUp.symbol} فقط ${(pick.score - runnerUp.score).toFixed(1)} امتیاز است — بازار یک برندهٔ بی‌چون‌وچرا ندارد.`);
	if (regime === "btc" && pick.symbol !== "BTC") caution.push("رژیم کلی هنوز به نفع بیت‌کوین است؛ آلت باید دلیل مشخص داشته باشد که دارد.");
	if (extra && extra.klinesTried > 0 && extra.klinesOk / extra.klinesTried < .7) caution.push(`فقط ${extra.klinesOk} از ${extra.klinesTried} ارز کندل کامل گرفتند؛ پوشش داده ناقص است.`);
	return {
		reasons: reasons.slice(0, 7),
		caution: caution.slice(0, 5)
	};
}
function regimeTitle(regime) {
	if (regime === "btc") return "فصل بیت‌کوین";
	if (regime === "alt") return "چرخش به آلت";
	return "بازار خنثی";
}
function confidenceTitle(c) {
	if (c === "high") return "اعتماد بالا";
	if (c === "medium") return "اعتماد متوسط";
	return "اعتماد محتاط";
}
function dominanceTitle(b) {
	if (b === "rising") return "دامیننس صعودی";
	if (b === "falling") return "دامیننس کاهشی";
	if (b === "resistance") return "دامیننس روی مقاومت";
	return "دامیننس میانی";
}
function verdictSentence(kind) {
	if (kind === "buy") return msg("الان این را بخر", "Buy this now");
	return msg("هیچ ارزی نخر", "Do not buy any coin");
}
function cashOut(fa, en) {
	return {
		kind: "cash",
		symbol: null,
		name: null,
		priceUsd: null,
		reachUsd: null,
		invalidationUsd: null,
		reason: msg(fa, en)
	};
}
function isListed(symbol, bases) {
	if (!bases || bases.size === 0) return false;
	const upper = symbol.toUpperCase();
	if (bases.has(upper)) return true;
	return candidateBases(upper).some((base) => bases.has(base));
}
function opportunityFor(symbol, items) {
	return items.find((item) => item.symbol === symbol);
}
function timingOpen(row, opp) {
	if (!opp) return false;
	if (!(opp.status === "in-zone" || opp.status === "confirmed" || opp.status === "actionable")) return false;
	if (row.rsi14 != null && row.rsi14 > 78) return false;
	if (row.distFrom30dHighPct != null && row.distFrom30dHighPct > -.03) return false;
	return true;
}
function zonePrices(opp) {
	const zone = opp?.zone;
	if (!zone || !(zone.invalidation > 0)) return null;
	if (opp.status === "invalidated") return null;
	const reach = opp.priceUsd > zone.high ? zone.high : zone.low;
	if (!(reach > 0)) return null;
	return {
		reach,
		kill: zone.invalidation
	};
}
function buyReason(row, horizon) {
	if (horizon === "day") return msg("حکم یک‌روزه است و فقط ۲۴ ساعت معتبر می‌ماند. قدرت ۲۴ساعته با نقطه ورود هم‌خوان است؛ فردا این حرف می‌تواند عوض شود.", "This is a one-day call, valid for 24 hours. The 24-hour strength agrees with the entry; tomorrow this sentence may change.");
	if (horizon === "week") return msg("حکم یک‌هفته‌ای است و تا هفت روز عوض نمی‌شود، مگر قیمت حد ابطال را بشکند. قدرت نسبی ۷روزه و نقطه ورود هم‌خوان‌اند.", "This is a one-week call. It does not change for seven days unless price breaks invalidation. 7-day strength and the entry agree.");
	const weeklyFa = row.weeklyStructure === "bull" ? "ساختار هفتگی صعودی است" : row.weeklyStructure === "bear" ? "ساختار هفتگی نزولی است" : "ساختار هفتگی رنج است";
	const weeklyEn = row.weeklyStructure === "bull" ? "weekly structure is bullish" : row.weeklyStructure === "bear" ? "weekly structure is bearish" : "weekly structure is a range";
	const emaFa = row.aboveEma200 === true ? "بالای EMA۲۰۰" : row.aboveEma200 === false ? "زیر EMA۲۰۰" : "EMA۲۰۰ نامشخص";
	const emaEn = row.aboveEma200 === true ? "above the 200 EMA" : row.aboveEma200 === false ? "below the 200 EMA" : "200 EMA unknown";
	return msg(`حکم یک‌ماهه است و تا سی روز عوض نمی‌شود، مگر ساختار هفتگی یا EMA۲۰۰ بشکند. ${emaFa} و ${weeklyFa}.`, `This is a one-month call. It does not change for thirty days unless weekly structure or the 200 EMA breaks. ${emaEn}, and ${weeklyEn}.`);
}
/**
* One sentence. The estimated liquidation map is not an input.
* Exchange-flow, stablecoin, and ETF figures are not invented here.
*/
function buildVerdict(input) {
	if (input.kill.status === "SUSPENDED") return cashOut("هیچ ارزی نخر. کلید قطع بیت‌کوین فعال است و خرید اسپات بسته است.", "Do not buy any coin. The Bitcoin kill-switch is on and spot buys are closed.");
	const { pick, refused, viaSeasonRule } = pickWinner(input.ranked, input.regime, input.kill);
	if (refused || !pick) return cashOut(refused ? "هیچ ارزی نخر. هیچ ارزی از فیلتر حجم، سقف ۳۰روزه و توکنومیکس رد نشد." : "هیچ ارزی نخر. از این داده انتخابی ساخته نشد.", refused ? "Do not buy any coin. No coin cleared the volume, 30-day-high, and tokenomics filters." : "Do not buy any coin. This tape did not produce a pick.");
	if (pick.symbol !== "BTC" && input.listed == null) return cashOut("هیچ ارزی نخر. فهرست تأیید نشد؛ خرید اسپات صادر نمی‌شود.", "Do not buy any coin. The exchange list was not confirmed, so no spot buy is issued.");
	if (pick.symbol !== "BTC" && !isListed(pick.symbol, input.listed)) return cashOut(`هیچ ارزی نخر. ${pick.symbol} در صرافی انتخاب‌شده تأیید نشد.`, `Do not buy any coin. ${pick.symbol} is not confirmed on the selected exchange.`);
	const opp = opportunityFor(pick.symbol, input.opportunities);
	if (timingOpen(pick, opp)) return {
		kind: "buy",
		symbol: pick.symbol,
		name: pick.name,
		priceUsd: pick.priceUsd,
		reachUsd: null,
		invalidationUsd: opp?.zone?.invalidation ?? null,
		reason: buyReason(pick, input.horizon)
	};
	if (viaSeasonRule) return cashOut("هیچ ارزی نخر. در فصل بیت‌کوین فاصله با بیت‌کوین به ۳٫۵ امتیاز نرسید و خود بیت‌کوین هم در ناحیه خرید اسپات نیست.", "Do not buy any coin. In Bitcoin season the lead over Bitcoin was under 3.5 points, and Bitcoin itself is not in a spot buy zone.");
	const levels = zonePrices(opp);
	if (!levels) return cashOut("هیچ ارزی نخر. وقت خرید اسپات نیست؛ بهترین نام مجاز در محدوده خرید نیست.", "Do not buy any coin. It is not time for a spot buy; the best allowed name is not in a buy zone.");
	const rsiHot = pick.rsi14 != null && pick.rsi14 > 78;
	return {
		kind: "cash",
		symbol: null,
		name: null,
		priceUsd: null,
		reachUsd: levels.reach,
		invalidationUsd: levels.kill,
		reason: rsiHot ? msg(`هیچ ارزی نخر. وقت خرید اسپات نیست؛ RSI ${pick.symbol} روی ${pick.rsi14?.toFixed(0)} داغ است.`, `Do not buy any coin. It is not time for a spot buy; ${pick.symbol} RSI is ${pick.rsi14?.toFixed(0)} and hot.`) : msg(`هیچ ارزی نخر. وقت خرید اسپات نیست؛ ${pick.symbol} هنوز به محدوده خرید نرسیده.`, `Do not buy any coin. It is not time for a spot buy; ${pick.symbol} is not in the buy zone yet.`)
	};
}
var US_CLOSED = {
	"2026-01-01": ["سال نو میلادی", "New Year's Day"],
	"2026-01-19": ["روز مارتین لوتر کینگ", "Martin Luther King Jr. Day"],
	"2026-02-16": ["روز رؤسای جمهور", "Presidents Day"],
	"2026-04-03": ["جمعهٔ خوب", "Good Friday"],
	"2026-05-25": ["یادبود", "Memorial Day"],
	"2026-06-19": ["جونتینث", "Juneteenth"],
	"2026-07-03": ["استقلال آمریکا (تعویض‌شده)", "Independence Day observed"],
	"2026-09-07": ["روز کارگر آمریکا", "Labor Day"],
	"2026-11-26": ["روز شکرگزاری", "Thanksgiving"],
	"2026-12-25": ["کریسمس", "Christmas"],
	"2027-01-01": ["سال نو میلادی", "New Year's Day"]
};
var US_EARLY = {
	"2026-11-27": ["جمعهٔ بعد از شکرگزاری · بورس آمریکا ساعت ۱۳ می‌بندد", "Day after Thanksgiving, US stocks close at 1pm"],
	"2026-12-24": ["شب کریسمس · بورس آمریکا ساعت ۱۳ می‌بندد", "Christmas Eve, US stocks close at 1pm"]
};
var MACRO_EVENTS = [
	{
		ymd: "2026-10-15",
		nameFa: "PPI و فروش خرده‌فروشی آمریکا",
		nameEn: "US PPI and retail sales"
	},
	{
		ymd: "2026-10-27",
		nameFa: "شروع جلسهٔ FOMC",
		nameEn: "FOMC meeting starts"
	},
	{
		ymd: "2026-10-28",
		nameFa: "بیانیهٔ نرخ بهرهٔ فدرال رزرو",
		nameEn: "Federal Reserve rate decision"
	},
	{
		ymd: "2026-10-29",
		nameFa: "GDP و PCE آمریکا",
		nameEn: "US GDP and PCE"
	},
	{
		ymd: "2026-11-06",
		nameFa: "گزارش اشتغال آمریکا",
		nameEn: "US jobs report"
	},
	{
		ymd: "2026-11-26",
		nameFa: "thanksgiving · بورس آمریکا تعطیل",
		nameEn: "Thanksgiving, NYSE closed"
	},
	{
		ymd: "2026-12-08",
		nameFa: "شروع جلسهٔ FOMC و نمودار نقطه‌ای",
		nameEn: "FOMC meeting and dot plot"
	},
	{
		ymd: "2026-12-09",
		nameFa: "بیانیهٔ نرخ بهرهٔ فدرال رزرو",
		nameEn: "Federal Reserve rate decision"
	}
];
function ymd(date, timeZone) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(date);
}
function holiday(dateKey, table, market) {
	const names = table[dateKey];
	if (!names) return null;
	return {
		ymd: dateKey,
		nameFa: names[0],
		nameEn: names[1],
		market
	};
}
function upcomingEvents(fromYmd, limit = 4) {
	return MACRO_EVENTS.filter((event) => event.ymd >= fromYmd).slice(0, limit);
}
function evaluate(now) {
	const tehranYmd = ymd(now, "Asia/Tehran");
	const newYorkYmd = ymd(now, "America/New_York");
	const reasons = [];
	const holidays = [];
	const us = holiday(newYorkYmd, US_CLOSED, "us");
	if (us) {
		reasons.push("us-holiday");
		holidays.push(us);
	}
	const early = holiday(newYorkYmd, US_EARLY, "us");
	const blockSpot = reasons.length > 0;
	const namesFa = holidays.map((item) => item.nameFa).join("، ");
	const namesEn = holidays.map((item) => item.nameEn).join(", ");
	return {
		tehranYmd,
		newYorkYmd,
		blockSpot,
		reasons,
		holidays,
		earlyClose: early,
		titleFa: blockSpot ? "امروز خرید اسپات توصیه نمی‌شود" : "تقویم معامله باز است",
		titleEn: blockSpot ? "No spot buy is recommended today" : "The trading calendar is open",
		reasonFa: blockSpot ? `امروز ${namesFa} است. میز فقط وقتی بورس نیویورک کامل بسته است خرید اسپات را نگه می‌دارد.` : "جمعه و تعطیل رسمی ایران دیگر خرید را نمی‌بندد. فقط تعطیلی کامل بورس نیویورک مانده است.",
		reasonEn: blockSpot ? `Today is ${namesEn}. The desk holds a spot buy only when the New York market is fully closed.` : "Fridays and Iranian public holidays no longer block a buy. Only a full NYSE close does."
	};
}
function nextClosedDay(now) {
	for (let i = 1; i <= 370; i++) {
		const day = evaluate(new Date(now.getTime() + i * 24 * 60 * 60 * 1e3));
		if (day.blockSpot && day.holidays[0]) return day.holidays[0];
	}
	return null;
}
function sessionCalendar(now = /* @__PURE__ */ new Date()) {
	return {
		...evaluate(now),
		nextClosed: nextClosedDay(now)
	};
}
//#endregion
export { confidenceOf as a, dominanceTitle as c, sessionCalendar as d, upcomingEvents as f, checklistPassCount as i, explainPick as l, buildChecklist as n, confidenceTitle as o, verdictSentence as p, buildVerdict as r, dominanceBiasOf as s, btcPriceLabel as t, regimeTitle as u };
