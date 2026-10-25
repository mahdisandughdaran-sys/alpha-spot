//#region node_modules/.nitro/vite/services/ssr/assets/math-B3CMdRol.js
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
function weeklySupportBroken(closes) {
	const w = weeklyFromDaily(closes);
	if (w.length < 8) return false;
	const last = w[w.length - 1];
	if (last == null) return false;
	const prior = w.slice(-9, -1);
	if (prior.length < 4) return false;
	return last < Math.min(...prior);
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
//#endregion
export { weeklySupportBroken as _, ema as a, mean as c, rsi as d, sma as f, weeklyFromDaily as g, vsBtc as h, distFromHigh as i, obvIsRising as l, tanhScore as m, dailyReturns as n, lookback as o, stdev as p, detectWeeklyStructure as r, maxDrawdown as s, clamp as t, percentileRank as u };
