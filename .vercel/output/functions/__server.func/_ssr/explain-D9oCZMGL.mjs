//#region node_modules/.nitro/vite/services/ssr/assets/explain-D9oCZMGL.js
function buildChecklist(pick, ctx) {
	const mcOk = pick.symbol === "BTC" || pick.symbol === "ETH" ? true : pick.mcFdv == null ? null : pick.mcFdv >= .7;
	const pairOk = pick.symbol === "BTC" ? ctx.regime !== "alt" : pick.weeklyStructure === "bull" || pick.rs7d > 0 && pick.rs30d != null && pick.rs30d > 0;
	const domOk = ctx.dominanceBias === "falling" || ctx.dominanceBias === "resistance" ? true : ctx.dominanceBias === "rising" ? pick.symbol === "BTC" : null;
	const liqOk = pick.turnover >= .02;
	const emaOk = pick.aboveEma200;
	return [
		{
			key: "mcfdv",
			label: "نسبت MC / FDV",
			desired: "ترجیحاً بالای ۰٫۷",
			ok: mcOk,
			detail: pick.mcFdv == null ? "سقف عرضه در داده نبود." : `MC/FDV ${(pick.mcFdv * 100).toFixed(0)}٪`
		},
		{
			key: "pair",
			label: "نمودار ALT/BTC",
			desired: "روند صعودی یا شکست مقاومت",
			ok: pairOk,
			detail: pick.symbol === "BTC" ? "خود بیت‌کوین معیار است." : pick.weeklyStructure === "bull" ? "ساختار هفتگی جفت/دلار صعودی است." : pick.rs7d > 0 ? "قدرت نسبی ۷ روزه مثبت است." : "جفت بیت‌کوین هنوز شکست معتبر ندارد."
		},
		{
			key: "dom",
			label: "دامیننس بیت‌کوین",
			desired: "کاهشی یا برخورد به مقاومت",
			ok: domOk,
			detail: `دامیننس ${ctx.btcDominance.toFixed(1)}٪ · رژیم ${ctx.regime}`
		},
		{
			key: "liq",
			label: "حجم و عمق نقدشوندگی",
			desired: "حجم روزانه بالای ۲٪ مارکت‌کپ",
			ok: liqOk,
			detail: `گردش ${(pick.turnover * 100).toFixed(2)}٪ از مارکت‌کپ`
		},
		{
			key: "ema",
			label: "وضعیت تکنیکال دلاری",
			desired: "بالای EMA ۲۰۰ روزانه / فاز انباشت",
			ok: emaOk,
			detail: emaOk === true ? "قیمت بالای میانگین نمایی ۲۰۰ روزه است." : emaOk === false ? "زیر EMA ۲۰۰ — روند دلاری هنوز فرسایشی است." : "کندل ۲۰۰ روزه کامل نبود."
		}
	];
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
		note: `دامیننس BTC ${dominance.toFixed(1)}٪ و میانه آلت‌ها منفی است — سرمایه به بیت‌کوین جذب می‌شود.`
	};
	if (dominance >= 54.5 && Math.abs(btcPct7d) < .05) return {
		bias: "resistance",
		note: `دامیننس ${dominance.toFixed(1)}٪ نزدیک مقاومت تاریخی است؛ اگر بشکند آلت‌ها جا می‌مانند.`
	};
	if (dominance < 52 && medianRs7 > 0) return {
		bias: "falling",
		note: `دامیننس ${dominance.toFixed(1)}٪ در حال کاهش است — فضای آلت‌سیزن بازتر شده.`
	};
	return {
		bias: "neutral",
		note: `دامیننس ${dominance.toFixed(1)}٪ در ناحیه میانی است.`
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
//#endregion
export { confidenceTitle as a, explainPick as c, confidenceOf as i, regimeTitle as l, buildChecklist as n, dominanceBiasOf as o, checklistPassCount as r, dominanceTitle as s, btcPriceLabel as t };
