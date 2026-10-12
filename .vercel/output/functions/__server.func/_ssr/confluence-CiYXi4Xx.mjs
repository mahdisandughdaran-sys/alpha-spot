//#region node_modules/.nitro/vite/services/ssr/assets/confluence-CiYXi4Xx.js
var LEVERAGES = [
	{
		lev: 5,
		w: .5
	},
	{
		lev: 10,
		w: 1
	},
	{
		lev: 25,
		w: 1.2
	},
	{
		lev: 50,
		w: .9
	},
	{
		lev: 100,
		w: .4
	}
];
var MMR = .005;
var BINS = 42;
function liquidationOfLong(entry, lev) {
	return entry * (1 - 1 / lev + MMR);
}
function liquidationOfShort(entry, lev) {
	return entry * (1 + 1 / lev - MMR);
}
/** (capital × risk) / stop. Percents are fractions: 0.02 and 0.025. */
function sizePosition(capitalUsd, riskPct, stopPct) {
	const capital = Number.isFinite(capitalUsd) ? Math.max(0, capitalUsd) : 0;
	const risk = Number.isFinite(riskPct) ? Math.max(0, riskPct) : 0;
	const stop = Number.isFinite(stopPct) ? stopPct : 0;
	const maxLossUsd = capital * risk;
	if (!(stop > 0) || !(capital > 0) || !(risk > 0)) return {
		positionUsd: 0,
		maxLossUsd
	};
	return {
		positionUsd: maxLossUsd / stop,
		maxLossUsd
	};
}
function sum(xs) {
	let s = 0;
	for (const x of xs) s += x;
	return s;
}
function mean(xs) {
	if (xs.length === 0) return 0;
	return sum(xs) / xs.length;
}
function ratioOf(buy, volume) {
	if (!(volume > 0)) return .5;
	return buy / volume;
}
function classifyFlow(input) {
	const hollow = input.ret4h > .025 && (input.buyRatio4h < .48 || input.volumeAccel < .72 || input.cvdNorm < -.04);
	const blowoff = input.ret4h > .045 && input.buyRatio4h < .52 && input.volumeAccel < 1;
	if (hollow || blowoff) return "fake_pump";
	if (input.buyRatio4h < .46 && input.buyRatio24h < .49 && input.cvdNorm < 0) return "distribution";
	if (input.buyRatio4h >= .545 && input.buyRatio24h >= .515 && input.cvdNorm > .02 && !(input.ret4h > .06 && input.volumeAccel < .85)) return "institutional";
	if (input.ret4h <= .005 && input.buyRatio4h >= .54 && input.cvdNorm > 0) return "absorption";
	return "balanced";
}
function readFlow(bars) {
	if (bars.length < 8) return null;
	const usable = bars.filter((bar) => bar.volume > 0 && bar.close > 0 && bar.takerBuy >= 0 && bar.takerBuy <= bar.volume * 1.001);
	if (usable.length < 8) return null;
	const last = usable[usable.length - 1];
	const closeAt = (back) => usable[Math.max(0, usable.length - 1 - back)].close;
	const window = (n) => usable.slice(-n);
	const buyOf = (rows) => sum(rows.map((row) => row.takerBuy));
	const volOf = (rows) => sum(rows.map((row) => row.volume));
	const w4 = window(4);
	const w24 = window(Math.min(24, usable.length));
	const prev4 = usable.slice(-8, -4);
	const buy4 = buyOf(w4);
	const vol4 = volOf(w4);
	const buy24 = buyOf(w24);
	const vol24 = volOf(w24);
	const sell24 = Math.max(0, vol24 - buy24);
	const volPrev = volOf(prev4);
	const deltas = usable.map((bar) => bar.takerBuy - (bar.volume - bar.takerBuy));
	let cvd = 0;
	const cvdSeries = deltas.map((delta) => cvd += delta);
	const back = Math.min(6, cvdSeries.length - 1);
	const cvdNorm = (cvdSeries[cvdSeries.length - 1] - cvdSeries[cvdSeries.length - 1 - back]) / ((mean(usable.slice(-back).map((bar) => bar.volume)) || 1) * back);
	const ret4h = closeAt(Math.min(4, usable.length - 1)) > 0 ? last.close / closeAt(4) - 1 : 0;
	const ret24h = closeAt(Math.min(24, usable.length - 1)) > 0 ? last.close / closeAt(Math.min(24, usable.length - 1)) - 1 : 0;
	const volumeAccel = volPrev > 0 ? vol4 / volPrev : 1;
	const buyRatio4h = ratioOf(buy4, vol4);
	const buyRatio24h = ratioOf(buy24, vol24);
	const points = usable.slice(-24).map((bar) => ({
		t: bar.t,
		delta: bar.takerBuy - (bar.volume - bar.takerBuy),
		buyRatio: ratioOf(bar.takerBuy, bar.volume),
		close: bar.close
	}));
	return {
		label: classifyFlow({
			buyRatio4h,
			buyRatio24h,
			cvdNorm,
			ret4h,
			volumeAccel
		}),
		buyRatio4h,
		buyRatio24h,
		delta4h: buy4 - (vol4 - buy4),
		delta24h: buy24 - sell24,
		cvdNorm,
		ret4h,
		ret24h,
		volumeAccel,
		buy24h: buy24,
		sell24h: sell24,
		points
	};
}
function buildLiquidationMap(bars, price, skew) {
	const empty = {
		bins: [],
		clusters: []
	};
	if (!(price > 0) || bars.length < 8) return empty;
	const afterLow = new Array(bars.length);
	const afterHigh = new Array(bars.length);
	let minLow = Infinity;
	let maxHigh = 0;
	for (let i = bars.length - 1; i >= 0; i--) {
		afterLow[i] = minLow;
		afterHigh[i] = maxHigh;
		minLow = Math.min(minLow, bars[i].low);
		maxHigh = Math.max(maxHigh, bars[i].high);
	}
	let longMul = 1;
	let shortMul = 1;
	if (skew.longShortRatio != null && skew.longShortRatio > 0) {
		longMul *= Math.min(1.45, Math.max(.75, skew.longShortRatio));
		shortMul *= Math.min(1.45, Math.max(.75, 1 / skew.longShortRatio));
	}
	if (skew.funding8h != null) {
		if (skew.funding8h > 3e-4) longMul *= 1.12;
		if (skew.funding8h < -1e-4) shortMul *= 1.12;
	}
	const floor = price * .88;
	const ceil = price * 1.12;
	const span = ceil - floor;
	const longHeat = new Array(BINS).fill(0);
	const shortHeat = new Array(BINS).fill(0);
	const binOf = (px) => {
		const t = (px - floor) / span;
		return Math.max(0, Math.min(41, Math.floor(t * BINS)));
	};
	for (let i = 0; i < bars.length - 2; i++) {
		const bar = bars[i];
		if (!(bar.volume > 0) || !(bar.close > 0) || !(bar.high > 0) || !(bar.low > 0)) continue;
		const entry = (bar.high + bar.low + bar.close) / 3;
		const age = bars.length - 1 - i;
		const decay = Math.exp(-age / 36);
		const weight = bar.volume * decay;
		for (const { lev, w } of LEVERAGES) {
			const longPx = liquidationOfLong(entry, lev);
			const shortPx = liquidationOfShort(entry, lev);
			if (longPx < price * .9975 && longPx > floor && afterLow[i] > longPx) longHeat[binOf(longPx)] += weight * w * longMul;
			if (shortPx > price * 1.0025 && shortPx < ceil && afterHigh[i] < shortPx) shortHeat[binOf(shortPx)] += weight * w * shortMul;
		}
	}
	const peak = Math.max(...longHeat, ...shortHeat, 1e-9);
	const bins = [];
	for (let i = 0; i < BINS; i++) {
		const longN = longHeat[i] / peak;
		const shortN = shortHeat[i] / peak;
		if (longN < .04 && shortN < .04) continue;
		const low = floor + span * i / BINS;
		const high = floor + span * (i + 1) / BINS;
		bins.push({
			price: (low + high) / 2,
			longHeat: longN,
			shortHeat: shortN
		});
	}
	return {
		bins,
		clusters: [...clustersOf("long", longHeat, floor, span, price), ...clustersOf("short", shortHeat, floor, span, price)]
	};
}
function clustersOf(side, heat, floor, span, price) {
	const max = Math.max(...heat, 0);
	if (!(max > 0)) return [];
	const cut = max * .45;
	const groups = [];
	let cur = null;
	for (let i = 0; i < heat.length; i++) {
		const h = heat[i];
		const low = floor + span * i / BINS;
		const high = floor + span * (i + 1) / BINS;
		const mid = (low + high) / 2;
		if (h >= cut && (side === "long" ? mid < price : mid > price)) {
			if (!cur) cur = {
				sum: 0,
				low,
				high,
				wpx: 0
			};
			cur.sum += h;
			cur.high = high;
			cur.wpx += h * mid;
		} else if (cur) {
			groups.push(cur);
			cur = null;
		}
	}
	if (cur) groups.push(cur);
	const top = Math.max(...groups.map((group) => group.sum), 1);
	return groups.sort((a, b) => b.sum - a.sum).slice(0, 3).map((group) => {
		const px = group.wpx / group.sum;
		return {
			side,
			price: px,
			low: group.low,
			high: group.high,
			heat: group.sum / top,
			distance: (px - price) / price
		};
	});
}
function pct(n, digits = 1) {
	return `${(n * 100).toFixed(digits)}٪`;
}
function usd(n) {
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
	if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	return n.toPrecision(3);
}
function flowSentence(flow) {
	if (flow.label === "institutional") return `نسبت خرید تیکر ۴ساعته ${pct(flow.buyRatio4h)} و ۲۴ساعته ${pct(flow.buyRatio24h)} است و دلتای تجمعی بالا می‌رود. این فشار خرید واقعی است، نه یک کندل خالی.`;
	if (flow.label === "fake_pump") return `قیمت ۴ساعته ${pct(flow.ret4h)} جابه‌جا شده ولی خریدار تیکر ${pct(flow.buyRatio4h)} مانده و شتاب حجم ${flow.volumeAccel.toFixed(2)} است. الگو پامپ توخالی است.`;
	if (flow.label === "absorption") return `قیمت ۴ساعته ${pct(flow.ret4h)} است ولی خریدار تیکر ${pct(flow.buyRatio4h)} جذب می‌کند. پول وارد می‌شود بدون جهش نمایشی.`;
	if (flow.label === "distribution") return `فروشنده تیکر غالب است (خرید ۴ساعته ${pct(flow.buyRatio4h)}) و دلتای تجمعی پایین می‌آید.`;
	return `جریان نزدیک تعادل است: خرید ۴ساعته ${pct(flow.buyRatio4h)} و ۲۴ساعته ${pct(flow.buyRatio24h)}. به‌تنهایی مجوز ورود نمی‌دهد.`;
}
function clampStop(entry, stop) {
	let pctStop = entry > 0 ? (entry - stop) / entry : .025;
	if (!(pctStop > 0)) pctStop = .025;
	pctStop = Math.min(.08, Math.max(.015, pctStop));
	return {
		stop: entry * (1 - pctStop),
		stopPct: pctStop
	};
}
function judgeConfluence(input) {
	const price = input.price;
	const longs = input.clusters.filter((cluster) => cluster.side === "long");
	const shorts = input.clusters.filter((cluster) => cluster.side === "short");
	const longWall = longs[0] ?? null;
	const shortWall = shorts[0] ?? null;
	const insideWall = longs.some((cluster) => cluster.heat >= .35 && price <= cluster.high * 1.002 && (price >= cluster.low * .998 || cluster.distance > -.005));
	const sweepWall = longs.find((cluster) => cluster.heat >= .48 && cluster.distance <= -.007 && cluster.distance >= -.034) ?? null;
	const sweepZone = Boolean(sweepWall && !insideWall);
	const magnet = Boolean(shortWall && shortWall.heat >= .45 && shortWall.distance >= .008 && shortWall.distance <= .05);
	let label = input.flow.label;
	const diverged = input.futuresBuyRatio4h != null && input.futuresBuyRatio4h < .48 && (label === "institutional" || label === "absorption");
	if (diverged) label = "balanced";
	let score = 50;
	if (label === "institutional") score += 24;
	else if (label === "absorption") score += 16;
	else if (label === "distribution") score -= 16;
	else if (label === "fake_pump") score -= 32;
	if (insideWall) score -= 30;
	else if (sweepZone) score += 18;
	else if (longWall && longWall.distance > -.007) score -= 14;
	if (magnet) score += 8;
	if (input.flow.ret24h > .1) score -= 8;
	const crowded = input.longShortRatio != null && input.longShortRatio > 2.1 && input.funding8h != null && input.funding8h > 4e-4;
	if (crowded) score -= 10;
	const hardAvoid = insideWall || input.flow.label === "fake_pump";
	const bid = label === "institutional" || label === "absorption";
	let decision;
	if (hardAvoid || score < 46) decision = "AVOID";
	else if (score >= 68 && bid) decision = "BUY";
	else decision = "WAIT";
	let entryStyle = "none";
	let entryPrice = null;
	if (decision !== "AVOID" && sweepZone && sweepWall) {
		entryStyle = "limit_sweep";
		entryPrice = sweepWall.low * .998;
	} else if (decision === "BUY") {
		entryStyle = "market";
		entryPrice = price;
	} else if (decision === "WAIT" && longWall && longWall.distance < -.004 && longWall.distance >= -.05) {
		entryStyle = "limit_sweep";
		entryPrice = longWall.low * .998;
	}
	const anchor = entryPrice ?? price;
	const stopped = clampStop(anchor, longWall ? longWall.low * .993 : anchor * .975);
	const reasons = [flowSentence(input.flow)];
	if (diverged) reasons.push(`اسپات خریدار است ولی نسبت خرید تیکر فیوچرز ۴ساعته ${pct(input.futuresBuyRatio4h ?? 0)} است. همگرایی کامل نیست.`);
	if (insideWall && longWall) reasons.push(`قیمت داخل دیوار لیکوییدیشن لانگ حول $${usd(longWall.price)} است. خرید بازار یعنی ایستادن جلوی آبشار.`);
	else if (sweepZone && sweepWall) reasons.push(`خوشه لانگ سویپ‌نشده در $${usd(sweepWall.price)} نشسته، ${pct(Math.abs(sweepWall.distance))} زیر قیمت. ورود تمیز، لیمیت زیر خوشه است نه بازار.`);
	else if (longWall) reasons.push(`نزدیک‌ترین استخر لانگ $${usd(longWall.price)} است (${pct(longWall.distance)}). دیوار چسبیده به قیمت نیست.`);
	else reasons.push("زیر قیمت، خوشه لیکوییدیشن متراکم و هنوز سویپ‌نشده دیده نشد.");
	if (magnet && shortWall) reasons.push(`بالای قیمت استخر شورت در $${usd(shortWall.price)} است (${pct(shortWall.distance)}). اگر خریدار بماند، سوخت حرکت همان‌جاست.`);
	if (crowded) reasons.push("فاندینگ مثبت و نسبت لانگ/شورت شلوغ است. اهرم سمت خرید ازدحام دارد.");
	else if (input.longShortRatio != null && input.longShortRatio > 1.8) reasons.push(`نسبت حساب‌های لانگ به شورت ${input.longShortRatio.toFixed(2)} است. سمت خرید فیوچرز شلوغ‌تر است.`);
	if (input.flow.ret24h > .1) reasons.push(`بازده ۲۴ساعته ${pct(input.flow.ret24h)} است. بخشی از حرکت خرج شده.`);
	let alert;
	if (insideWall && longWall) alert = `هشدار دیوار: لیکوییدیشن لانگ حول $${usd(longWall.price)} — فاصله ${pct(longWall.distance)}. خرید نکنید.`;
	else if (sweepZone && sweepWall) alert = `منطقه سویپ: خوشه لانگ $${usd(sweepWall.price)}، ${pct(Math.abs(sweepWall.distance))} پایین‌تر. لیمیت، نه بازار.`;
	else if (magnet && shortWall) alert = `آهنربای شورت در $${usd(shortWall.price)} بالای قیمت است.`;
	else if (longWall) alert = `دیوار لانگ در $${usd(longWall.price)} (${pct(Math.abs(longWall.distance))} دورتر) هنوز به قیمت نچسبیده.`;
	else alert = "خوشه لیکوییدیشن متراکم در باند ۱۲٪ دیده نشد.";
	return {
		decision,
		entryStyle,
		entryPrice,
		stopPrice: stopped.stop,
		stopPct: stopped.stopPct,
		insideWall,
		sweepZone,
		magnet,
		score,
		reasons: reasons.slice(0, 5),
		alert
	};
}
//#endregion
export { sizePosition as i, judgeConfluence as n, readFlow as r, buildLiquidationMap as t };
