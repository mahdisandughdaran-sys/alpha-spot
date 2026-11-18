import { d as rsi, l as obvIsRising } from "./math-B3CMdRol.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ta-CFwhxRm-.js
var STABLES = /* @__PURE__ */ new Set([
	"USDT",
	"USDC",
	"FDUSD",
	"TUSD",
	"DAI",
	"BUSD"
]);
function normalizeSymbol(raw) {
	let symbol = raw.trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (symbol.endsWith("USDT")) symbol = symbol.slice(0, -4);
	if (!/^[A-Z0-9]{2,12}$/.test(symbol)) return null;
	if (STABLES.has(symbol)) return null;
	return symbol;
}
function formatPx(n) {
	if (!Number.isFinite(n)) return "—";
	const abs = Math.abs(n);
	if (abs >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (abs >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
	return n.toPrecision(4);
}
function smaSeries(values, period) {
	const out = values.map(() => null);
	if (values.length < period || period < 1) return out;
	let sum = 0;
	for (let i = 0; i < period; i++) sum += values[i] ?? 0;
	out[period - 1] = sum / period;
	for (let i = period; i < values.length; i++) {
		sum += (values[i] ?? 0) - (values[i - period] ?? 0);
		out[i] = sum / period;
	}
	return out;
}
function emaSeries(values, period) {
	const out = values.map(() => null);
	if (values.length < period || period < 1) return out;
	const k = 2 / (period + 1);
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
function rsiSeries(closes, period = 14) {
	const out = closes.map(() => null);
	if (closes.length < period + 1) return out;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		if (d >= 0) gain += d;
		else loss -= d;
	}
	gain /= period;
	loss /= period;
	const reading = (g, l) => l === 0 ? 100 : 100 - 100 / (1 + g / l);
	out[period] = reading(gain, loss);
	for (let i = period + 1; i < closes.length; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		gain = (gain * (period - 1) + Math.max(d, 0)) / period;
		loss = (loss * (period - 1) + Math.max(-d, 0)) / period;
		out[i] = reading(gain, loss);
	}
	return out;
}
function macdSeries(closes, fast = 12, slow = 26, signal = 9) {
	const emaFast = emaSeries(closes, fast);
	const emaSlow = emaSeries(closes, slow);
	const line = closes.map((_, i) => {
		const a = emaFast[i];
		const b = emaSlow[i];
		if (a == null || b == null) return null;
		return a - b;
	});
	const compact = [];
	const index = [];
	line.forEach((value, i) => {
		if (value == null) return;
		compact.push(value);
		index.push(i);
	});
	const sig = emaSeries(compact, signal);
	const hist = closes.map(() => null);
	sig.forEach((value, j) => {
		if (value == null) return;
		const at = index[j];
		if (at == null) return;
		hist[at] = (compact[j] ?? 0) - value;
	});
	return {
		line,
		hist
	};
}
function bollingerAt(closes, index, period = 20, mult = 2) {
	if (index + 1 < period || index < 0) return null;
	let sum = 0;
	for (let i = index - period + 1; i <= index; i++) sum += closes[i] ?? 0;
	const mid = sum / period;
	let variance = 0;
	for (let i = index - period + 1; i <= index; i++) {
		const d = (closes[i] ?? 0) - mid;
		variance += d * d;
	}
	const sd = Math.sqrt(variance / period);
	const upper = mid + mult * sd;
	const lower = mid - mult * sd;
	const width = upper - lower;
	const price = closes[index] ?? mid;
	return {
		mid,
		upper,
		lower,
		pctB: width === 0 ? .5 : (price - lower) / width,
		bandwidth: mid === 0 ? 0 : width / mid
	};
}
function bandwidthRank(closes, period = 20, look = 120) {
	const bands = [];
	let last = null;
	for (let i = 0; i < closes.length; i++) {
		const band = bollingerAt(closes, i, period);
		if (!band) continue;
		bands.push(band.bandwidth);
		last = band;
	}
	if (!last) return null;
	const window = bands.slice(-look);
	if (window.length < 2) return {
		pctB: last.pctB,
		rank: 50
	};
	const current = window[window.length - 1] ?? 0;
	let less = 0;
	for (let i = 0; i < window.length - 1; i++) if ((window[i] ?? 0) < current) less += 1;
	return {
		pctB: last.pctB,
		rank: less / (window.length - 1) * 100
	};
}
function atrSeries(candles, period = 14) {
	const tr = [];
	for (let i = 0; i < candles.length; i++) {
		const bar = candles[i];
		if (!bar) {
			tr.push(0);
			continue;
		}
		if (i === 0) {
			tr.push(bar.high - bar.low);
			continue;
		}
		const prev = candles[i - 1]?.close ?? bar.close;
		tr.push(Math.max(bar.high - bar.low, Math.abs(bar.high - prev), Math.abs(bar.low - prev)));
	}
	return wilder(tr, period);
}
function adxLast(candles, period = 14) {
	if (candles.length < period * 2) return null;
	const plusDm = [];
	const minusDm = [];
	const tr = [];
	for (let i = 0; i < candles.length; i++) {
		const bar = candles[i];
		if (!bar) continue;
		if (i === 0) {
			plusDm.push(0);
			minusDm.push(0);
			tr.push(bar.high - bar.low);
			continue;
		}
		const prev = candles[i - 1];
		if (!prev) continue;
		const up = bar.high - prev.high;
		const down = prev.low - bar.low;
		plusDm.push(up > down && up > 0 ? up : 0);
		minusDm.push(down > up && down > 0 ? down : 0);
		tr.push(Math.max(bar.high - bar.low, Math.abs(bar.high - prev.close), Math.abs(bar.low - prev.close)));
	}
	const smTr = wilder(tr, period);
	const smPlus = wilder(plusDm, period);
	const smMinus = wilder(minusDm, period);
	const dx = [];
	const plus = [];
	const minus = [];
	for (let i = 0; i < candles.length; i++) {
		const atr = smTr[i];
		if (atr == null || atr === 0) {
			dx.push(0);
			plus.push(0);
			minus.push(0);
			continue;
		}
		const p = 100 * (smPlus[i] ?? 0) / atr;
		const m = 100 * (smMinus[i] ?? 0) / atr;
		plus.push(p);
		minus.push(m);
		const den = p + m;
		dx.push(den === 0 ? 0 : 100 * Math.abs(p - m) / den);
	}
	const start = period - 1;
	if (dx.length < start + period) return null;
	let adx = 0;
	for (let i = 0; i < period; i++) adx += dx[start + i] ?? 0;
	adx /= period;
	for (let i = start + period; i < dx.length; i++) adx = (adx * (period - 1) + (dx[i] ?? 0)) / period;
	const last = dx.length - 1;
	return {
		adx,
		plus: plus[last] ?? 0,
		minus: minus[last] ?? 0
	};
}
function wilder(values, period) {
	const out = values.map(() => null);
	if (values.length < period || period < 1) return out;
	let prev = 0;
	for (let i = 0; i < period; i++) prev += values[i] ?? 0;
	prev /= period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = (prev * (period - 1) + (values[i] ?? 0)) / period;
		out[i] = prev;
	}
	return out;
}
function floorPivots(candle) {
	const pp = (candle.high + candle.low + candle.close) / 3;
	const range = candle.high - candle.low;
	return {
		pp,
		r1: 2 * pp - candle.low,
		s1: 2 * pp - candle.high,
		r2: pp + range,
		s2: pp - range
	};
}
function swings(candles, wing = 2) {
	const highs = [];
	const lows = [];
	for (let i = wing; i < candles.length - wing; i++) {
		const bar = candles[i];
		if (!bar) continue;
		let isHigh = true;
		let isLow = true;
		for (let k = 1; k <= wing; k++) {
			const left = candles[i - k];
			const right = candles[i + k];
			if (!left || !right) {
				isHigh = false;
				isLow = false;
				break;
			}
			if (bar.high <= left.high || bar.high <= right.high) isHigh = false;
			if (bar.low >= left.low || bar.low >= right.low) isLow = false;
		}
		if (isHigh) highs.push({
			i,
			price: bar.high
		});
		if (isLow) lows.push({
			i,
			price: bar.low
		});
	}
	return {
		highs,
		lows
	};
}
function last(rows) {
	return rows.length ? rows[rows.length - 1] ?? null : null;
}
function readChart(input) {
	const candles = input.candles.filter((bar) => bar.close > 0 && bar.high >= bar.low);
	if (candles.length < 40) return null;
	const now = input.now ?? Date.now();
	const tip = candles[candles.length - 1];
	const live = tip.closeTime > now;
	const closes = candles.map((bar) => bar.close);
	const volumes = candles.map((bar) => bar.volume);
	const sma50Line = smaSeries(closes, 50);
	const sma200Line = smaSeries(closes, 200);
	const rsiLine = rsiSeries(closes, 14);
	const macd = macdSeries(closes);
	const atrLine = atrSeries(candles, 14);
	const bandRank = bandwidthRank(closes);
	const adx = adxLast(candles, 14);
	const swing = swings(candles, 2);
	const prev = candles[candles.length - 2] ?? tip;
	const pivots = floorPivots(prev);
	const sma50 = last(sma50Line.filter((v) => v != null));
	const sma200 = last(sma200Line.filter((v) => v != null));
	const rsiNow = rsi(closes, 14);
	const atr = last(atrLine.filter((v) => v != null));
	const hist = macd.hist;
	const histNow = last(hist.filter((v) => v != null));
	const histPrev = hist.filter((v) => v != null);
	const prevHist = histPrev.length > 1 ? histPrev[histPrev.length - 2] : histNow;
	const hi2 = swing.highs.slice(-2);
	const lo2 = swing.lows.slice(-2);
	const resistance = hi2.length ? hi2[hi2.length - 1] : null;
	const support = lo2.length ? lo2[lo2.length - 1] : null;
	let structure = "unknown";
	let higherHigh = false;
	let higherLow = false;
	if (hi2.length === 2 && lo2.length === 2) {
		higherHigh = hi2[1].price > hi2[0].price;
		higherLow = lo2[1].price > lo2[0].price;
		const lowerHigh = hi2[1].price < hi2[0].price;
		const lowerLow = lo2[1].price < lo2[0].price;
		if (higherHigh && higherLow) structure = "up";
		else if (lowerHigh && lowerLow) structure = "down";
		else structure = "range";
	}
	const votes = [];
	if (structure === "up") votes.push({
		id: "dow",
		nameFa: "ساختار داو",
		nameEn: "Dow structure",
		bias: "bull"
	});
	else if (structure === "down") votes.push({
		id: "dow",
		nameFa: "ساختار داو",
		nameEn: "Dow structure",
		bias: "bear"
	});
	else if (structure === "range") votes.push({
		id: "dow",
		nameFa: "ساختار داو",
		nameEn: "Dow structure",
		bias: "flat"
	});
	if (sma200 != null) votes.push({
		id: "sma200",
		nameFa: "قیمت و میانگین ۲۰۰",
		nameEn: "Price vs 200 SMA",
		bias: tip.close > sma200 ? "bull" : tip.close < sma200 ? "bear" : "flat"
	});
	if (sma50 != null && sma200 != null) votes.push({
		id: "smaCross",
		nameFa: "میانگین ۵۰ و ۲۰۰",
		nameEn: "50 vs 200 SMA",
		bias: sma50 > sma200 ? "bull" : sma50 < sma200 ? "bear" : "flat"
	});
	if (histNow != null && histNow !== 0) votes.push({
		id: "macd",
		nameFa: "هیستوگرام مکدی",
		nameEn: "MACD histogram",
		bias: histNow > 0 ? "bull" : "bear"
	});
	if (adx && adx.adx >= 25) votes.push({
		id: "adx",
		nameFa: "ADX وایلدر",
		nameEn: "Wilder ADX",
		bias: adx.plus > adx.minus ? "bull" : adx.minus > adx.plus ? "bear" : "flat"
	});
	const obv = obvIsRising(closes, volumes);
	const back = closes[closes.length - 11];
	const priceUp = back != null && tip.close > back;
	const priceDown = back != null && tip.close < back;
	let obvNote = "quiet";
	if (obv === true && priceUp) {
		votes.push({
			id: "obv",
			nameFa: "OBV گرانویل",
			nameEn: "Granville OBV",
			bias: "bull"
		});
		obvNote = "with";
	} else if (obv === false && priceDown) {
		votes.push({
			id: "obv",
			nameFa: "OBV گرانویل",
			nameEn: "Granville OBV",
			bias: "bear"
		});
		obvNote = "with";
	} else if (obv != null && (priceUp || priceDown)) {
		votes.push({
			id: "obv",
			nameFa: "OBV گرانویل",
			nameEn: "Granville OBV",
			bias: "flat"
		});
		obvNote = "against";
	}
	const directional = votes.filter((vote) => vote.bias !== "flat");
	const sum = directional.reduce((acc, vote) => acc + (vote.bias === "bull" ? 1 : -1), 0);
	const bias = directional.length < 2 ? "flat" : sum >= 2 ? "bull" : sum <= -2 ? "bear" : "flat";
	const agree = bias === "flat" ? 0 : directional.filter((vote) => vote.bias === bias).length;
	const dissent = bias === "flat" ? [] : directional.filter((vote) => vote.bias !== bias);
	const biasFa = bias === "bull" ? "خوانش صعودی" : bias === "bear" ? "خوانش نزولی" : "خوانش خنثی";
	const biasEn = bias === "bull" ? "Bullish read" : bias === "bear" ? "Bearish read" : "Neutral read";
	const summaryFa = bias === "flat" ? "روش‌های جهت‌دار روی این شکل یک طرف نمی‌سازند. خط‌ها را جدا بخوان، نه به صورت یک دستور." : `${agree} روش از ${directional.length} روش جهت‌دار ${bias === "bull" ? "صعودی" : "نزولی"} است${dissent.length ? `؛ مخالف: ${dissent.map((vote) => vote.nameFa).join("، ")}` : ""}. این دستور خرید یا فروش نیست.`;
	const summaryEn = bias === "flat" ? "The directional methods do not build one side on this chart. Read the lines separately, not as an order." : `${agree} of ${directional.length} directional methods are ${bias === "bull" ? "bullish" : "bearish"}${dissent.length ? `; against: ${dissent.map((vote) => vote.nameEn).join(", ")}` : ""}. This is not a buy or sell order.`;
	const windowStart = Math.max(0, candles.length - 110);
	const visible = candles.slice(windowStart);
	const visHigh = Math.max(...visible.map((bar) => bar.high));
	const visLow = Math.min(...visible.map((bar) => bar.low));
	const onScale = (price) => price <= visHigh * 1.08 && price >= visLow * .92;
	const marks = [];
	if (support && onScale(support.price)) marks.push({
		id: "support",
		price: support.price,
		tone: "up",
		dash: true
	});
	if (resistance && onScale(resistance.price)) marks.push({
		id: "resistance",
		price: resistance.price,
		tone: "down",
		dash: true
	});
	const nearPivot = atr != null && Math.abs(tip.close - pivots.pp) <= atr * 1.2;
	if (nearPivot && onScale(pivots.pp)) marks.push({
		id: "pivot",
		price: pivots.pp,
		tone: "subtle",
		dash: true
	});
	const cross = recentCross(sma50Line, sma200Line, 6);
	const above200 = sma200 != null && tip.close >= sma200;
	const above50 = sma50 != null && tip.close >= sma50;
	const shortAbove = sma50 != null && sma200 != null && sma50 >= sma200;
	const step1Fa = !sma50 ? "تاریخ این نماد برای میانگین ۵۰ کندل هم کوتاه است. شکل را فقط با سقف و کف بخوان." : sma200 == null ? `خط زرد میانگین سادهٔ ۵۰ کندل بسته است و روی ${formatPx(sma50)} نشسته. قیمت آخر ${above50 ? "بالای" : "زیر"} این خط است. میانگین ۲۰۰ کندل در این تاریخ جا نشده، پس رژیم بلند را از همین شکل نخوان.` : `خط روشن میانگین سادهٔ ۲۰۰ کندل است، روی ${formatPx(sma200)}. خط زرد میانگین ۵۰ کندل است، روی ${formatPx(sma50)}. قیمت آخر ${above200 ? "بالای" : "زیر"} خط روشن است و خط زرد هم ${shortAbove ? "بالای" : "زیر"} خط روشن است.${cross === "golden" ? " در شش کندل اخیر خط زرد از پایینِ خط روشن گذشته؛ این همان کراس طلایی است، نه دستور." : cross === "death" ? " در شش کندل اخیر خط زرد از بالای خط روشن به زیر آن آمده؛ این کراس مرگ است، نه دستور." : ""} تا قیمت آن طرف خط روشن نرود، رژیم بلندمدت همین می‌ماند.`;
	const step1En = !sma50 ? "This history is too short even for a 50-candle average. Read the chart from swings only." : sma200 == null ? `The yellow line is the 50-candle simple average, at ${formatPx(sma50)}. The last price is ${above50 ? "above" : "below"} it. There is not enough history for a 200-candle average, so do not read a long regime from this chart.` : `The light line is the 200-candle simple average, at ${formatPx(sma200)}. The yellow line is the 50-candle average, at ${formatPx(sma50)}. The last price is ${above200 ? "above" : "below"} the light line, and the yellow line is ${shortAbove ? "above" : "below"} it.${cross === "golden" ? " In the last six candles the yellow line crossed up through the light line. That is a golden cross, not an order." : cross === "death" ? " In the last six candles the yellow line crossed down through the light line. That is a death cross, not an order." : ""} The long regime stays like this until price gets to the other side of the light line.`;
	const structFa = structure === "up" ? "سقف تازه بالاتر از سقف قبل است و کف تازه بالاتر از کف قبل. داو این را روند صعودی می‌خواند." : structure === "down" ? "سقف تازه پایین‌تر از سقف قبل است و کف تازه پایین‌تر از کف قبل. داو این را روند نزولی می‌خواند." : structure === "range" ? "سقف و کف تازه یک‌طرف نشده‌اند. داو این را روند نمی‌خواند؛ محدوده است." : "دو سقف و دو کف تأییدشده روی این تاریخ نیست، پس ساختار داو را از شکل نمی‌شود خواند.";
	const structEn = structure === "up" ? "The newer high is above the prior high and the newer low is above the prior low. Dow reads that as an uptrend." : structure === "down" ? "The newer high is below the prior high and the newer low is below the prior low. Dow reads that as a downtrend." : structure === "range" ? "The newer high and low do not agree on one side. Dow does not call that a trend; it is a range." : "There are not two confirmed highs and two confirmed lows, so Dow structure cannot be read from this chart.";
	const step2Fa = `${resistance ? `خط‌چین قرمز آخرین سقف تأییدشده است، ${formatPx(resistance.price)}. دو کندل دو طرفش پایین‌تر بودند.` : "سقف تأییدشده‌ای برای مقاومت روی شکل نیست."} ${support ? `خط‌چین سبز آخرین کف تأییدشده است، ${formatPx(support.price)}.` : "کف تأییدشده‌ای برای حمایت روی شکل نیست."} ${structFa}${nearPivot ? ` خط‌چین کمرنگ محور کندل قبلی است، ${formatPx(pivots.pp)}، چون نزدیک قیمت بود روی شکل آمده.` : ""}`;
	const step2En = `${resistance ? `The red dashed line is the last confirmed high, ${formatPx(resistance.price)}. Two candles on each side were lower.` : "There is no confirmed high to mark as resistance."} ${support ? `The green dashed line is the last confirmed low, ${formatPx(support.price)}.` : "There is no confirmed low to mark as support."} ${structEn}${nearPivot ? ` The faint dashed line is the prior candle's pivot, ${formatPx(pivots.pp)}, drawn because it sits near price.` : ""}`;
	const pctB = bandRank?.pctB ?? null;
	const squeeze = (bandRank?.rank ?? 50) < 20;
	const bandWhere = pctB == null ? "unknown" : pctB > .8 ? "high" : pctB < .2 ? "low" : "mid";
	const atrPct = atr != null && tip.close !== 0 ? atr / tip.close : null;
	const step3Fa = `نوار کم‌رنگ دور کندل‌ها باند بولینگر است: میانگین ۲۰ کندل، به‌علاوه و منهای دو انحراف معیار. قیمت ${bandWhere === "high" ? "نزدیک لبهٔ بالای نوار" : bandWhere === "low" ? "نزدیک لبهٔ پایین نوار" : bandWhere === "mid" ? "وسط نوار" : "نسبت به نوار نامشخص"} است${pctB != null ? ` (%B برابر ${pctB.toFixed(2)})` : ""}. ${squeeze ? "پهنای نوار از ۸۰٪ تاریخ اخیر خودش کمتر است؛ فشرده است، نه اینکه جهت بدهد." : "نوار نسبت به تاریخ اخیر خودش فشرده نیست."} ${atr != null && atrPct != null ? `علامت زرد کوتاه کنار کندل آخر، یک ATR ۱۴ وایلدر است: ${formatPx(atr)}، یعنی حدود ${(atrPct * 100).toFixed(1)}٪ حرکت معمول. این فاصلهٔ نوسان است، نه حد ضرر.` : ""}`;
	const step3En = `The pale band around the candles is Bollinger: the 20-candle average, plus and minus two standard deviations. Price is ${bandWhere === "high" ? "near the top of the band" : bandWhere === "low" ? "near the bottom of the band" : bandWhere === "mid" ? "in the middle of the band" : "not clearly placed against the band"}${pctB != null ? ` (%B is ${pctB.toFixed(2)})` : ""}. ${squeeze ? "The band is narrower than 80% of its own recent history. That is compression, not a direction." : "The band is not compressed versus its own recent history."} ${atr != null && atrPct != null ? `The short yellow mark beside the last candle is one Wilder ATR(14): ${formatPx(atr)}, about ${(atrPct * 100).toFixed(1)}% of usual movement. That is a volatility distance, not a stop order.` : ""}`;
	const rsiFa = rsiNow == null ? "RSI ۱۴ وایلدر هنوز روی این تاریخ ساخته نمی‌شود." : `نوار میانی RSI ۱۴ وایلدر است و عقربه‌اش روی ${rsiNow.toFixed(0)} است. خط‌های ۳۰ و ۷۰ فقط منطقهٔ کشیدگی‌اند. ماندن بالای ۷۰ در یک روند قوی، برگشت را ثابت نمی‌کند و زیر ۳۰ هم به‌تنهایی خرید نیست.`;
	const rsiEn = rsiNow == null ? "Wilder RSI(14) cannot be built on this history yet." : `The middle strip is Wilder RSI(14), and the needle is at ${rsiNow.toFixed(0)}. The 30 and 70 lines only mark stretch. Staying above 70 in a strong trend does not prove a reversal, and below 30 is not a buy by itself.`;
	const macdSide = histNow == null ? "na" : histNow > 0 ? "up" : histNow < 0 ? "down" : "zero";
	const macdGrew = histNow != null && prevHist != null && Math.abs(histNow) > Math.abs(prevHist) && Math.sign(histNow) === Math.sign(prevHist);
	const macdFa = histNow == null ? "هیستوگرام مکدی هنوز ساخته نمی‌شود." : `نوار پایین هیستوگرام مکدی اپل است، ۱۲ و ۲۶ و ۹. میله‌ها ${macdSide === "up" ? "بالای" : macdSide === "down" ? "زیر" : "روی"} صفرند${macdSide === "zero" ? "" : macdGrew ? " و از کندل قبل بلندتر شده‌اند" : " و از کندل قبل بلندتر نشده‌اند"}. عبور از صفر از رنگ یک میله مهم‌تر است.`;
	const macdEn = histNow == null ? "The MACD histogram cannot be built yet." : `The bottom strip is Appel's MACD histogram, 12, 26, and 9. The bars are ${macdSide === "up" ? "above" : macdSide === "down" ? "below" : "on"} zero${macdSide === "zero" ? "" : macdGrew ? " and taller than the prior candle" : " and not taller than the prior candle"}. A cross of zero matters more than the color of one bar.`;
	const adxFa = !adx ? "ADX وایلدر هنوز عدد ندارد." : adx.adx < 25 ? `ADX وایلدر ${adx.adx.toFixed(0)} است و به آستانهٔ ۲۵ نرسیده. جهت DI را سنگین نخوان؛ بازار بیشتر نوسان می‌کند تا روند.` : `ADX وایلدر ${adx.adx.toFixed(0)} است، بالای ۲۵. DI مثبت ${adx.plus.toFixed(0)} و DI منفی ${adx.minus.toFixed(0)} است. ADX خودش جهت نمی‌گوید؛ جلو بودن DI جهت را می‌گوید.`;
	const adxEn = !adx ? "Wilder ADX has no reading yet." : adx.adx < 25 ? `Wilder ADX is ${adx.adx.toFixed(0)}, under the 25 threshold. Do not lean on DI direction; the market is chopping more than trending.` : `Wilder ADX is ${adx.adx.toFixed(0)}, above 25. +DI is ${adx.plus.toFixed(0)} and −DI is ${adx.minus.toFixed(0)}. ADX itself does not point; whichever DI is ahead does.`;
	const obvFa = obvNote === "with" ? "OBV گرانویل با جهت ده کندل اخیر همراه است." : obvNote === "against" ? "OBV گرانویل با جهت ده کندل اخیر همراه نیست؛ حجم، حرکت قیمت را تأیید نمی‌کند." : "OBV گرانویل حرف روشنی کنار این ده کندل ندارد.";
	const obvEn = obvNote === "with" ? "Granville OBV agrees with the last ten candles." : obvNote === "against" ? "Granville OBV does not agree with the last ten candles; volume is not confirming the price move." : "Granville OBV has nothing clear to add beside these ten candles.";
	const bars = visible.map((bar, offset) => {
		const i = windowStart + offset;
		const band = bollingerAt(closes, i);
		return {
			t: bar.t,
			open: bar.open,
			high: bar.high,
			low: bar.low,
			close: bar.close,
			sma50: sma50Line[i] ?? null,
			sma200: sma200Line[i] ?? null,
			upper: band?.upper ?? null,
			lower: band?.lower ?? null,
			rsi: rsiLine[i] ?? null,
			macd: hist[i] ?? null
		};
	});
	const changePct = prev.close === 0 ? 0 : tip.close / prev.close - 1;
	return {
		symbol: input.symbol,
		interval: input.interval,
		live,
		lastPrice: tip.close,
		changePct,
		bias,
		biasFa,
		biasEn,
		summaryFa,
		summaryEn,
		sma50,
		sma200,
		rsi: rsiNow,
		atr,
		atrPct,
		adx: adx?.adx ?? null,
		plusDi: adx?.plus ?? null,
		minusDi: adx?.minus ?? null,
		pctB,
		squeeze,
		structure,
		votes,
		marks,
		bars,
		steps: [
			{
				n: 1,
				titleFa: "خط‌های میانگین روی شکل",
				titleEn: "The averages on the chart",
				bodyFa: step1Fa,
				bodyEn: step1En
			},
			{
				n: 2,
				titleFa: "سقف و کف همین شکل",
				titleEn: "Highs and lows on this chart",
				bodyFa: step2Fa,
				bodyEn: step2En
			},
			{
				n: 3,
				titleFa: "نوار دور کندل‌ها",
				titleEn: "The band around the candles",
				bodyFa: step3Fa,
				bodyEn: step3En
			},
			{
				n: 4,
				titleFa: "نوار میانی",
				titleEn: "The middle strip",
				bodyFa: rsiFa,
				bodyEn: rsiEn
			},
			{
				n: 5,
				titleFa: "نوار پایین",
				titleEn: "The bottom strip",
				bodyFa: `${macdFa} ${adxFa} ${obvFa}`,
				bodyEn: `${macdEn} ${adxEn} ${obvEn}`
			}
		]
	};
}
function recentCross(fast, slow, back) {
	const last = fast.length - 1;
	const prev = last - back;
	if (prev < 0) return null;
	const fastNow = fast[last];
	const slowNow = slow[last];
	const fastThen = fast[prev];
	const slowThen = slow[prev];
	if (fastNow == null || slowNow == null || fastThen == null || slowThen == null) return null;
	const now = fastNow - slowNow;
	const then = fastThen - slowThen;
	if (then <= 0 && now > 0) return "golden";
	if (then >= 0 && now < 0) return "death";
	return null;
}
//#endregion
export { normalizeSymbol as n, readChart as r, formatPx as t };
