import { i as msg } from "./lex-C7bdiIgA.mjs";
import { d as rsi, s as maxDrawdown } from "./math-s2DhiTks.mjs";
import { a as writeCache, n as evaluateKillSwitch, r as readCache } from "./kill-switch-C8MdklMf.mjs";
import { a as enrichFromKlines, c as pickWinner, l as scoreUniverse, o as lookupMeta, r as detectRegime } from "./scoring-CE7dNVWF.mjs";
import { n as evaluateAsset } from "./opportunity-BRXgfBlA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backtest-data.server-DUo6AjPa.js
var WARMUP = 220;
var STEP = 7;
var COST_BPS = 15;
function dayKey$1(ms) {
	return Math.floor(ms / 864e5);
}
function draftAt(input) {
	const meta = lookupMeta(input.symbol);
	const lastUsd = input.usd[input.usd.length - 1] ?? 0;
	const lastPair = input.pair[input.pair.length - 1] ?? 0;
	const volume24h = Math.max(input.quote, 0);
	const turnover = .025;
	return enrichFromKlines({
		id: input.symbol.toLowerCase(),
		symbol: input.symbol,
		name: input.name,
		rank: input.rank,
		priceUsd: lastUsd,
		priceBtc: input.symbol === "BTC" ? 1 : lastPair,
		marketCap: volume24h > 0 ? volume24h / turnover : 0,
		volume24h,
		volumeChange24h: 0,
		beta: null,
		athDrawdownPct: null,
		pct1h: 0,
		pct6h: 0,
		pct12h: 0,
		pct24h: 0,
		pct7d: 0,
		pct30d: null,
		rs24h: 0,
		rs7d: 0,
		rs14d: null,
		rs30d: null,
		rsi14: null,
		volatility30d: null,
		maxDrawdown30d: null,
		distFrom30dHighPct: null,
		aboveSma: null,
		aboveEma200: null,
		weeklyStructure: null,
		obvRising: null,
		hasBtcPair: true,
		hasKlines: input.pair.length >= 8,
		klineDays: input.usd.length,
		pairSeries: [],
		turnover,
		circulatingSupply: null,
		maxSupply: null,
		mcFdv: input.symbol === "BTC" || input.symbol === "ETH" ? 1 : .85,
		narrativeTags: meta.tags,
		narrativeTagsFa: meta.tagsFa,
		accrual: meta.accrual,
		accrualNote: meta.note,
		pairWeekly: null,
		pairSupportBroken: false,
		pairCloses: input.pair,
		usdCloses: input.usd,
		usdVolumes: input.vols
	});
}
function alignUntil(map, calendar, endIdx) {
	const closes = [];
	const vols = [];
	let last = null;
	let lastQ = 0;
	let missing = 0;
	for (let i = 0; i <= endIdx; i++) {
		const bar = map.get(calendar[i] ?? -1);
		if (bar && bar.c > 0) {
			last = bar.c;
			lastQ = bar.q > 0 ? bar.q : lastQ;
			missing = 0;
			closes.push(last);
			vols.push(lastQ);
		} else if (last != null) {
			missing += 1;
			if (missing > 5) return null;
			closes.push(last);
			vols.push(lastQ);
		}
	}
	if (closes.length < 40) return null;
	return {
		closes,
		vols
	};
}
function priceAt(map, day) {
	const bar = map.get(day);
	return bar && bar.c > 0 ? bar.c : null;
}
function simulateSpotBacktest(series) {
	const btc = series.find((s) => s.symbol === "BTC");
	if (!btc || btc.bars.length < 227) return emptyReport$1(msg("کندل تاریخی بیت‌کوین برای بک‌تست کافی نبود.", "Historical Bitcoin candles were not enough for the backtest."));
	const maps = /* @__PURE__ */ new Map();
	for (const s of series) {
		const map = /* @__PURE__ */ new Map();
		for (const bar of s.bars) if (bar.c > 0) map.set(dayKey$1(bar.t), bar);
		maps.set(s.symbol, map);
	}
	const btcMap = maps.get("BTC");
	if (!btcMap) return emptyReport$1(msg("سری بیت‌کوین ساخته نشد.", "The Bitcoin series could not be built."));
	const calendar = [...btcMap.keys()].sort((a, b) => a - b);
	if (calendar.length < 227) return emptyReport$1(msg("تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن مدل است.", "The daily calendar is shorter than the model warmup window."));
	let equity = 1;
	let btcEquity = 1;
	let held = "";
	let trades = 0;
	let winners = 0;
	let periods = 0;
	const curve = [];
	const holdDays = /* @__PURE__ */ new Map();
	const meta = new Map(series.map((s) => [s.symbol, s]));
	const startIdx = WARMUP;
	const startDay = calendar[startIdx] ?? calendar[0];
	const startBtc = priceAt(btcMap, startDay) ?? 1;
	for (let i = startIdx; i < calendar.length - 1; i += STEP) {
		const j = Math.min(i + STEP, calendar.length - 1);
		if (j <= i) break;
		const day = calendar[i];
		const nextDay = calendar[j];
		const btcNow = alignUntil(btcMap, calendar, i);
		if (!btcNow) continue;
		const drafts = [];
		const btcSeries = meta.get("BTC");
		if (!btcSeries) continue;
		const btcDraft = draftAt({
			symbol: "BTC",
			name: btcSeries.name,
			rank: btcSeries.rank,
			usd: btcNow.closes,
			vols: btcNow.vols,
			pair: btcNow.closes,
			quote: btcNow.vols[btcNow.vols.length - 1] ?? 0
		});
		drafts.push(btcDraft);
		for (const s of series) {
			if (s.symbol === "BTC") continue;
			const map = maps.get(s.symbol);
			if (!map) continue;
			const aligned = alignUntil(map, calendar, i);
			if (!aligned) continue;
			const n = Math.min(aligned.closes.length, btcNow.closes.length);
			const usd = aligned.closes.slice(-n);
			const vols = aligned.vols.slice(-n);
			const btcSlice = btcNow.closes.slice(-n);
			const pair = usd.map((c, idx) => {
				const b = btcSlice[idx] ?? 0;
				return b > 0 ? c / b : 0;
			});
			if (pair.some((p) => p <= 0)) continue;
			drafts.push(draftAt({
				symbol: s.symbol,
				name: s.name,
				rank: s.rank,
				usd,
				vols,
				pair,
				quote: vols[vols.length - 1] ?? 0
			}));
		}
		const { regime } = detectRegime(drafts, 50);
		const kill = evaluateKillSwitch({
			priceUsd: btcNow.closes[btcNow.closes.length - 1] ?? 0,
			closes: btcNow.closes
		});
		const scored = scoreUniverse(drafts, regime, { kill }).sort((a, b) => b.score - a.score);
		if (scored.length === 0) continue;
		const { pick } = pickWinner(scored, regime, kill);
		const symbol = pick?.symbol ?? "BTC";
		const assetMap = maps.get(symbol) ?? btcMap;
		const p0 = priceAt(symbol === "BTC" ? btcMap : assetMap, day);
		const p1 = priceAt(symbol === "BTC" ? btcMap : assetMap, nextDay);
		const b0 = priceAt(btcMap, day);
		const b1 = priceAt(btcMap, nextDay);
		if (!p0 || !p1 || !b0 || !b1) continue;
		let assetRet = p1 / p0 - 1;
		const btcRet = b1 / b0 - 1;
		if (symbol !== "BTC" && kill.status === "HIGH_RISK") assetRet = .5 * assetRet + .5 * btcRet;
		if (symbol !== "BTC" && kill.status === "SUSPENDED") assetRet = btcRet;
		let cost = 0;
		if (symbol !== held) {
			trades += 1;
			cost = COST_BPS / 1e4;
			held = symbol;
		}
		const period = (1 + assetRet) * (1 - cost) - 1;
		equity *= 1 + period;
		if (periods === 0) btcEquity = 1;
		btcEquity *= 1 + btcRet;
		periods += 1;
		if (period > 0) winners += 1;
		const bucket = holdDays.get(symbol) ?? {
			periods: 0,
			ret: 0
		};
		bucket.periods += 1;
		bucket.ret = (1 + bucket.ret) * (1 + period) - 1;
		holdDays.set(symbol, bucket);
		curve.push({
			t: nextDay * 864e5,
			equity,
			btc: btcEquity
		});
	}
	if (periods === 0 || curve.length === 0) return emptyReport$1(msg("در این بازه هیچ نقطه بازچینش معتبری ساخته نشد.", "No valid rebalance point was produced in this window."));
	const fromMs = (calendar[startIdx] ?? startDay) * 864e5;
	const toMs = (calendar[calendar.length - 1] ?? startDay) * 864e5;
	const endBtc = priceAt(btcMap, calendar[calendar.length - 1] ?? startDay) ?? startBtc;
	const btcReturn = startBtc > 0 ? endBtc / startBtc - 1 : btcEquity - 1;
	const eqCurve = curve.map((p) => p.equity);
	const btcCurve = curve.map((p) => p.btc);
	const holdings = [...holdDays.entries()].map(([symbol, v]) => ({
		symbol,
		periods: v.periods,
		returnPct: v.ret
	})).sort((a, b) => b.periods - a.periods);
	const totalReturn = equity - 1;
	const winRate = winners / periods;
	const months = monthlyPath(curve);
	const monthStats = summarizeMonths(months);
	const avgPct = (monthStats.avg * 100).toFixed(1);
	const modelPct = (totalReturn * 100).toFixed(1);
	const btcPct = (btcReturn * 100).toFixed(1);
	const faMonth = monthStats.sample === "full" ? "میانگین ماه‌های کامل مدل" : "میانگین ماه‌های مدل";
	const enMonth = monthStats.sample === "full" ? "Mean return of the model’s complete months" : "Mean monthly return of the model";
	const note = msg(totalReturn >= btcReturn ? `در این مسیر، مدل از خرید و نگهداری بیت‌کوین جلوتر بود: ${modelPct}٪ در برابر ${btcPct}٪. ${faMonth} ${avgPct}٪ بود.` : `در این مسیر بیت‌کوین بهتر بود: مدل ${modelPct}٪ و BTC ${btcPct}٪. ${faMonth} ${avgPct}٪ بود.`, totalReturn >= btcReturn ? `On this path the model beat buy-and-hold Bitcoin: ${modelPct}% versus ${btcPct}%. ${enMonth} was ${avgPct}%.` : `On this path Bitcoin was better: the model ${modelPct}% and BTC ${btcPct}%. ${enMonth} was ${avgPct}%.`);
	return {
		from: new Date(fromMs).toISOString(),
		to: new Date(toMs).toISOString(),
		days: calendar.length,
		weeks: periods,
		trades,
		winRate,
		winners,
		totalReturn,
		btcReturn,
		maxDrawdown: maxDrawdown(eqCurve),
		btcMaxDrawdown: maxDrawdown(btcCurve),
		curve: downsample(curve, 90),
		holdings,
		months,
		monthCount: monthStats.count,
		monthSample: monthStats.sample,
		avgMonthly: monthStats.avg,
		medianMonthly: monthStats.median,
		compoundMonthly: monthStats.compound,
		bestMonth: monthStats.best,
		worstMonth: monthStats.worst,
		positiveMonths: monthStats.positive,
		monthsAhead: monthStats.ahead,
		assumptions: [
			msg("بازچینش هفتگی روی همان امتیاز اسپات (قدرت نسبی، روند، ورود، ریسک) فقط با داده‌ای که تا همان روز وجود داشته.", "Weekly rebalance uses the same spot score (relative strength, trend, entry, risk) and only data that existed through that day."),
			msg("توکنومیکس و روایت ثابت‌اند؛ تاریخچه واقعی MC/FDV و آنلاک در این بک‌تست نیست.", "Tokenomics and narrative are held fixed; this backtest has no real MC/FDV or unlock history."),
			msg("اگر کلید قطع معلق باشد نگهداری بیت‌کوین است؛ در ریسک بالا نیمی از بازده آلت و نیمی بیت‌کوین.", "If the kill-switch is suspended, the hold is Bitcoin; in high risk, half the return is the alt and half is Bitcoin."),
			msg(`هزینه جابه‌جایی ${COST_BPS} نقطه پایه. اسلیپیج دفتر سفارش تاریخی در داده عمومی نیست.`, `Turnover cost is ${COST_BPS} basis points. Historical order-book slippage is not in the public data.`),
			msg("جهان تست، ارزهای نقد شونده با تاریخچه بلند بایننس است نه هر صد ارز امروز — سوگیری بقا دارد.", "The test universe is liquid names with a long Binance history, not today’s top 100 — it has survivorship bias."),
			msg("بازده ماهانه از آخر هر ماه تا آخر ماه بعد، روی همان مسیر هفتگی و بعد از هزینه جابه‌جایی است. هفته به ماهی می‌رود که در آن تمام شده. این بک‌تست مدل انتخاب میز اصلی است، نه حکم‌های قفل‌شده میز بیت‌کوین. ماهی با کمتر از سه هفته «ناقص» است و اگر سه ماه کامل باشد از میانگین کنار گذاشته می‌شود.", "Monthly return runs from one month-end to the next on the same weekly path, after turnover cost. A week is booked in the month it ends. This backtest is the main desk’s pick model, not the Bitcoin desk’s locked calls. A month with fewer than three weeks is partial, and is left out of the average once three complete months exist.")
		],
		note
	};
}
function monthKey(ms) {
	const d = new Date(ms);
	const y = d.getUTCFullYear();
	const m = d.getUTCMonth() + 1;
	return `${y}-${String(m).padStart(2, "0")}`;
}
function monthlyPath(curve) {
	if (curve.length === 0) return [];
	const out = [];
	let startEq = 1;
	let startBtc = 1;
	let key = "";
	let lastEq = 1;
	let lastBtc = 1;
	let weeks = 0;
	const close = () => {
		if (weeks === 0) return;
		out.push({
			key,
			model: startEq > 0 ? lastEq / startEq - 1 : 0,
			btc: startBtc > 0 ? lastBtc / startBtc - 1 : 0,
			weeks,
			partial: weeks < 3
		});
	};
	for (const point of curve) {
		const next = monthKey(point.t);
		if (weeks > 0 && next !== key) {
			close();
			startEq = lastEq;
			startBtc = lastBtc;
			weeks = 0;
		}
		if (weeks === 0) key = next;
		lastEq = point.equity;
		lastBtc = point.btc;
		weeks += 1;
	}
	close();
	return out;
}
function median(values) {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const mid = Math.floor(sorted.length / 2);
	if (sorted.length % 2 === 0) return ((sorted[mid - 1] ?? 0) + (sorted[mid] ?? 0)) / 2;
	return sorted[mid] ?? 0;
}
function summarizeMonths(months) {
	const full = months.filter((row) => !row.partial);
	const basis = full.length >= 3 ? full : months;
	const sample = full.length >= 3 ? "full" : "all";
	const rets = basis.map((row) => row.model);
	const count = rets.length;
	if (count === 0) return {
		count: 0,
		sample,
		avg: 0,
		median: 0,
		compound: 0,
		best: 0,
		worst: 0,
		positive: 0,
		ahead: 0
	};
	const avg = rets.reduce((sum, value) => sum + value, 0) / count;
	const growth = basis.reduce((product, row) => product * (1 + row.model), 1);
	return {
		count,
		sample,
		avg,
		median: median(rets),
		compound: growth > 0 ? growth ** (1 / count) - 1 : 0,
		best: Math.max(...rets),
		worst: Math.min(...rets),
		positive: basis.filter((row) => row.model > 0).length,
		ahead: basis.filter((row) => row.model > row.btc).length
	};
}
function downsample(points, max) {
	if (points.length <= max) return points;
	const step = Math.ceil(points.length / max);
	const out = [];
	for (let i = 0; i < points.length; i += step) {
		const row = points[i];
		if (row) out.push(row);
	}
	const last = points[points.length - 1];
	if (last && out[out.length - 1] !== last) out.push(last);
	return out;
}
function emptyReport$1(note) {
	return {
		from: "",
		to: "",
		days: 0,
		weeks: 0,
		trades: 0,
		winRate: 0,
		winners: 0,
		totalReturn: 0,
		btcReturn: 0,
		maxDrawdown: 0,
		btcMaxDrawdown: 0,
		curve: [],
		holdings: [],
		months: [],
		monthCount: 0,
		monthSample: "all",
		avgMonthly: 0,
		medianMonthly: 0,
		compoundMonthly: 0,
		bestMonth: 0,
		worstMonth: 0,
		positiveMonths: 0,
		monthsAhead: 0,
		assumptions: [],
		note
	};
}
var BACKTEST_UNIVERSE = [
	{
		symbol: "BTC",
		name: "Bitcoin",
		rank: 1
	},
	{
		symbol: "ETH",
		name: "Ethereum",
		rank: 2
	},
	{
		symbol: "BNB",
		name: "BNB",
		rank: 4
	},
	{
		symbol: "SOL",
		name: "Solana",
		rank: 5
	},
	{
		symbol: "XRP",
		name: "XRP",
		rank: 6
	},
	{
		symbol: "DOGE",
		name: "Dogecoin",
		rank: 8
	},
	{
		symbol: "TRX",
		name: "TRON",
		rank: 9
	},
	{
		symbol: "TON",
		name: "Toncoin",
		rank: 12
	},
	{
		symbol: "ADA",
		name: "Cardano",
		rank: 13
	},
	{
		symbol: "AVAX",
		name: "Avalanche",
		rank: 15
	},
	{
		symbol: "LINK",
		name: "Chainlink",
		rank: 16
	},
	{
		symbol: "SUI",
		name: "Sui",
		rank: 18
	},
	{
		symbol: "DOT",
		name: "Polkadot",
		rank: 20
	},
	{
		symbol: "LTC",
		name: "Litecoin",
		rank: 22
	},
	{
		symbol: "UNI",
		name: "Uniswap",
		rank: 25
	},
	{
		symbol: "NEAR",
		name: "NEAR",
		rank: 28
	},
	{
		symbol: "APT",
		name: "Aptos",
		rank: 32
	},
	{
		symbol: "ATOM",
		name: "Cosmos",
		rank: 35
	}
];
var MAX_OPEN = 4;
function dayKey(ms) {
	return Math.floor(ms / 864e5);
}
function richFrom(bar) {
	if (!(bar.c > 0)) return null;
	const o = bar.o && bar.o > 0 ? bar.o : bar.c;
	const h = bar.h && bar.h > 0 ? bar.h : Math.max(o, bar.c);
	const l = bar.l && bar.l > 0 ? bar.l : Math.min(o, bar.c);
	return {
		t: bar.t,
		o,
		h: Math.max(h, o, bar.c),
		l: Math.min(l, o, bar.c),
		c: bar.c,
		v: bar.q > 0 ? bar.q / bar.c : 0,
		q: bar.q > 0 ? bar.q : bar.c
	};
}
function stats(trades, equity, start = 1) {
	if (trades.length === 0) return {
		winRate: null,
		avgR: null,
		profitFactor: null,
		totalReturn: null,
		maxDrawdown: null
	};
	const wins = trades.filter((t) => t.pnl > 0);
	const gain = trades.filter((t) => t.pnl > 0).reduce((s, t) => s + t.pnl, 0);
	const loss = Math.abs(trades.filter((t) => t.pnl < 0).reduce((s, t) => s + t.pnl, 0));
	const last = equity[equity.length - 1] ?? start;
	return {
		winRate: wins.length / trades.length,
		avgR: trades.reduce((s, t) => s + t.r, 0) / trades.length,
		profitFactor: loss === 0 ? null : gain / loss,
		totalReturn: last / start - 1,
		maxDrawdown: equity.length > 1 ? maxDrawdown(equity) : null
	};
}
function btcRegime(closes) {
	if (closes.length < 60) return "range";
	const last = closes[closes.length - 1] ?? 0;
	const prev = closes[closes.length - 31] ?? last;
	const ret = prev ? last / prev - 1 : 0;
	const ma = closes.slice(-50).reduce((s, v) => s + v, 0) / Math.min(50, closes.length);
	if (last > ma && ret > 0) return "bull";
	if (last < ma && ret < 0) return "bear";
	return "range";
}
function fillBuy(px) {
	return px * 1.0017999999999998;
}
function fillSell(px) {
	return px * .9982;
}
function simulateBook(maps, calendar, signal) {
	let equity = 1;
	const curve = [1];
	const open = [];
	const trades = [];
	const symbols = [...maps.keys()];
	for (let i = 120; i < calendar.length; i++) {
		const day = calendar[i];
		for (let p = open.length - 1; p >= 0; p--) {
			const pos = open[p];
			if (pos.entryIndex >= i) continue;
			const bar = maps.get(pos.symbol)?.get(day);
			if (!bar) continue;
			let exitPx = null;
			if (bar.l <= pos.stop) exitPx = bar.o < pos.stop ? bar.o : pos.stop;
			else if (pos.target != null && bar.h >= pos.target) exitPx = pos.target;
			else if (i - pos.entryIndex >= pos.maxDays) exitPx = bar.c;
			if (exitPx == null) continue;
			const pnl = pos.units * (fillSell(exitPx) - pos.entryFill);
			const riskUsd = Math.max(pos.entryFill * pos.units * pos.riskPct, 1e-9);
			equity += pnl;
			trades.push({
				...pos,
				exitIndex: i,
				pnl,
				r: pnl / riskUsd
			});
			open.splice(p, 1);
		}
		if (open.length < MAX_OPEN) {
			const ideas = [];
			for (const symbol of symbols) {
				if (open.some((pos) => pos.symbol === symbol)) continue;
				const map = maps.get(symbol);
				if (!map) continue;
				const bars = collect(map, calendar, i);
				const btcBars = collect(maps.get("BTC") ?? /* @__PURE__ */ new Map(), calendar, i);
				if (bars.length < 90) continue;
				const idea = signal(symbol, bars, btcBars.map((b) => b.c), i);
				const last = bars[bars.length - 1];
				if (!idea || !last) continue;
				ideas.push({
					symbol,
					...idea,
					close: last.c
				});
			}
			ideas.sort((a, b) => b.score - a.score);
			for (const idea of ideas) {
				if (open.length >= MAX_OPEN) break;
				const entryFill = fillBuy(idea.close);
				const riskPct = (entryFill - idea.stop) / entryFill;
				if (riskPct < .004 || riskPct > .25) continue;
				const notional = Math.min(equity * .15, equity * .01 / riskPct);
				if (notional <= 0 || equity <= 0) continue;
				open.push({
					symbol: idea.symbol,
					entryIndex: i,
					entryFill,
					stop: idea.stop,
					target: idea.target,
					riskPct,
					units: notional / entryFill,
					regime: btcRegime(collect(maps.get("BTC") ?? /* @__PURE__ */ new Map(), calendar, i).map((b) => b.c)),
					maxDays: idea.maxDays
				});
			}
		}
		curve.push(equity);
	}
	return {
		trades,
		equity: curve
	};
}
function collect(map, calendar, end) {
	const out = [];
	const start = Math.max(0, end - 159);
	for (let i = start; i <= end; i++) {
		const bar = map.get(calendar[i] ?? -1);
		if (bar) out.push(bar);
	}
	return out;
}
function bucket(trades, regime) {
	const rows = trades.filter((t) => t.regime === regime);
	return {
		regime,
		trades: rows.length,
		winRate: rows.length ? rows.filter((t) => t.pnl > 0).length / rows.length : null,
		avgR: rows.length ? rows.reduce((s, t) => s + t.r, 0) / rows.length : null
	};
}
function simulateOpportunityBacktest(series) {
	const maps = /* @__PURE__ */ new Map();
	let degraded = 0;
	for (const item of series) {
		const map = /* @__PURE__ */ new Map();
		for (const bar of item.bars) {
			if (bar.h == null || bar.l == null) degraded += 1;
			const rich = richFrom(bar);
			if (rich) map.set(dayKey(bar.t), rich);
		}
		if (map.size > 80) maps.set(item.symbol, map);
	}
	const btc = maps.get("BTC");
	const assumptions = [
		msg("ورود فقط بعد از بسته شدن کندلی است که تأیید را ساخته. کندل‌های بعد از آن برای خروج استفاده می‌شوند.", "Entry is only after the candle that built the confirmation has closed. Later candles are used for the exit."),
		msg("کارمزد ۱۰ نقطه پایه و لغزش ۸ نقطه پایه در هر طرف لحاظ شده است.", "A 10 bp fee and 8 bp of slippage are charged on each side."),
		msg("اگر در یک کندل هم حد ضرر و هم هدف لمس شود، خروج روی حد ضرر فرض می‌شود.", "If one candle touches both the stop and the target, the exit is assumed at the stop."),
		msg("ریسک هر معامله ۱٪ سرمایه و سقف اندازه ۱۵٪ است. حداکثر چهار موقعیت باز.", "Each trade risks 1% of capital, with a 15% size cap. At most four positions are open."),
		msg("وزن‌های اسکنر روی این نمونه بهینه نشده‌اند. بخش پایانی فقط برای دیدن پایداری است.", "Scanner weights were not fit on this sample. The final slice is only a stability check."),
		msg("نتیجه گذشته تضمین آینده نیست.", "Past results are not a guarantee of the future.")
	];
	if (!btc || btc.size < 140) return emptyReport(msg("کندل تاریخی بیت‌کوین برای ارزیابی فرصت‌ها کافی نبود.", "Historical Bitcoin candles were not enough to evaluate the setups."), assumptions);
	const calendar = [...btc.keys()].sort((a, b) => a - b);
	if (calendar.length < 140) return emptyReport(msg("تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن است.", "The daily calendar is shorter than the warmup window."), assumptions);
	const model = simulateBook(maps, calendar, (_symbol, bars, btcCloses) => {
		const last = bars[bars.length - 1];
		if (!last) return null;
		const opp = evaluateAsset({
			symbol: _symbol,
			name: _symbol,
			rank: 10,
			priceUsd: last.c,
			volume24h: last.q,
			turnover: .03,
			bars,
			btcCloses
		}, {
			generatedAt: new Date(last.t).toISOString(),
			regime: "neutral",
			spotBuys: "open"
		});
		if (opp.status !== "actionable" && opp.status !== "confirmed" || !opp.zone) return null;
		return {
			stop: opp.zone.invalidation,
			target: opp.targetUsd,
			score: opp.score,
			maxDays: 12
		};
	});
	const dip = simulateBook(maps, calendar, (_symbol, bars) => {
		if (bars.length < 12) return null;
		const last = bars[bars.length - 1];
		const prev = bars[bars.length - 11];
		if (last.c / prev.c - 1 > -.1) return null;
		return {
			stop: last.c * .92,
			target: null,
			score: 1,
			maxDays: 10
		};
	});
	const rsiBook = simulateBook(maps, calendar, (_symbol, bars) => {
		const last = bars[bars.length - 1];
		const value = rsi(bars.map((b) => b.c), 14);
		if (!last || value == null || value >= 30) return null;
		return {
			stop: last.c * .92,
			target: null,
			score: 40 - value,
			maxDays: 10
		};
	});
	const modelStats = stats(model.trades, model.equity);
	const holdoutCut = Math.floor(calendar.length * .6);
	const holdoutTrades = model.trades.filter((t) => t.entryIndex >= holdoutCut);
	const holdoutRate = holdoutTrades.length ? holdoutTrades.filter((t) => t.pnl > 0).length / holdoutTrades.length : null;
	const holdoutR = holdoutTrades.length ? holdoutTrades.reduce((s, t) => s + t.r, 0) / holdoutTrades.length : null;
	let holdoutNote = msg("۴۰٪ پایانی تقویم جدا شمرده شده تا وزن‌ها روی کل نمونه قشنگ‌تر از واقعیت به‌نظر نرسند.", "The last 40% of the calendar is scored apart so the weights do not look cleaner on the full sample than they are.");
	if (modelStats.winRate != null && holdoutRate != null && model.trades.length >= 15 && holdoutTrades.length >= 8 && Math.abs(modelStats.winRate - holdoutRate) > .15) holdoutNote = msg("نرخ برد کل نمونه و بازه پایانی بیش از ۱۵ واحد اختلاف دارند. به عدد کلی اعتماد نکنید.", "The full-sample win rate and the final window differ by more than 15 points. Do not trust the headline number.");
	if (holdoutTrades.length < 8) holdoutNote = msg("نمونه بازه پایانی کوچک است و نرخ برد جداگانه‌ای از آن ساخته نمی‌شود.", "The final-window sample is small, so a separate win rate is not produced.");
	const btcCloses = calendar.map((day) => btc.get(day)?.c ?? 0).filter((n) => n > 0);
	const btcEquity = btcCloses.map((px) => px / (btcCloses[0] || px));
	const from = (/* @__PURE__ */ new Date((calendar[0] ?? 0) * 864e5)).toISOString().slice(0, 10);
	const to = (/* @__PURE__ */ new Date((calendar[calendar.length - 1] ?? 0) * 864e5)).toISOString().slice(0, 10);
	const enough = model.trades.length >= 30;
	if (degraded > series.length) assumptions.unshift(msg("بخشی از کندل‌ها سقف و کف جدا نداشتند و با قیمت پایانی تقریب زده شدند.", "Some candles had no separate high and low and were approximated with the close."));
	return {
		from,
		to,
		symbols: maps.size,
		days: calendar.length,
		trades: model.trades.length,
		winRate: modelStats.winRate,
		avgR: modelStats.avgR,
		profitFactor: modelStats.profitFactor,
		totalReturn: modelStats.totalReturn,
		maxDrawdown: modelStats.maxDrawdown,
		byRegime: [
			bucket(model.trades, "bull"),
			bucket(model.trades, "bear"),
			bucket(model.trades, "range")
		],
		baselines: [
			rowOf(msg("افت ۱۰٪ و خروج زمانی", "A 10% dip with a time exit"), dip.trades, dip.equity),
			rowOf(msg("ورود با RSI زیر ۳۰", "Entry when RSI is under 30"), rsiBook.trades, rsiBook.equity),
			{
				name: msg("نگهداری بیت‌کوین", "Bitcoin hold"),
				trades: 1,
				winRate: null,
				avgR: null,
				totalReturn: btcEquity.length ? (btcEquity[btcEquity.length - 1] ?? 1) - 1 : null,
				maxDrawdown: btcEquity.length > 2 ? maxDrawdown(btcEquity) : null
			}
		],
		holdout: {
			trades: holdoutTrades.length,
			winRate: holdoutTrades.length >= 8 ? holdoutRate : null,
			avgR: holdoutTrades.length >= 8 ? holdoutR : null,
			note: holdoutNote
		},
		sampleEnough: enough,
		samples: model.trades.slice(-12).map((trade) => ({
			symbol: trade.symbol,
			r: trade.r,
			regime: trade.regime,
			entryIndex: trade.entryIndex,
			exitIndex: trade.exitIndex
		})),
		assumptions,
		note: enough ? msg("این ارزیابی گذشته است و تضمین آینده نیست. کارمزد و لغزش داخل عددها هستند.", "This is a historical evaluation and not a guarantee of the future. Fees and slippage are inside the numbers.") : msg("تعداد معامله‌های تأییدشده برای حرف زدن از نرخ برد کافی نیست. نتیجه را به‌عنوان شاهد آماری نخوانید.", "There are not enough confirmed trades to talk about a win rate. Do not read the result as statistical evidence.")
	};
}
function rowOf(name, trades, equity) {
	const s = stats(trades, equity);
	return {
		name,
		trades: trades.length,
		...s
	};
}
function emptyReport(note, assumptions) {
	return {
		from: "",
		to: "",
		symbols: 0,
		days: 0,
		trades: 0,
		winRate: null,
		avgR: null,
		profitFactor: null,
		totalReturn: null,
		maxDrawdown: null,
		byRegime: [],
		baselines: [],
		holdout: {
			trades: 0,
			winRate: null,
			avgR: null,
			note: ""
		},
		sampleEnough: false,
		samples: [],
		assumptions,
		note
	};
}
var BINANCE = "https://data-api.binance.vision/api/v3";
var FRESH_SEC = 43200;
var STALE_SEC = 1209600;
function barsFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const t = Number(row[0]);
		const o = Number(row[1]);
		const h = Number(row[2]);
		const l = Number(row[3]);
		const c = Number(row[4]);
		const q = Number(row[7]);
		if (!Number.isFinite(t) || !Number.isFinite(c) || c <= 0) continue;
		out.push({
			t,
			o: Number.isFinite(o) ? o : c,
			h: Number.isFinite(h) ? h : c,
			l: Number.isFinite(l) ? l : c,
			c,
			q: Number.isFinite(q) ? q : 0
		});
	}
	out.sort((a, b) => a.t - b.t);
	return out;
}
async function fetchWindow(symbol, endTime) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 12e3);
	try {
		const end = endTime ? `&endTime=${endTime}` : "";
		const res = await fetch(`${BINANCE}/klines?symbol=${symbol}USDT&interval=1d&limit=1000${end}`, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.3"
			}
		});
		if (!res.ok) return null;
		const json = await res.json();
		return Array.isArray(json) ? json : null;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
async function loadSymbol(symbol) {
	const key = `k3y:${symbol}USDT`;
	const cached = await readCache(key, FRESH_SEC);
	if (cached) {
		const parsed = barsFrom(JSON.parse(cached));
		if (parsed.length > 400) return parsed;
	}
	const recent = await fetchWindow(symbol);
	if (!recent || recent.length < 30) {
		const stale = await readCache(key, STALE_SEC);
		if (!stale) return null;
		const parsed = barsFrom(JSON.parse(stale));
		return parsed.length > 200 ? parsed : null;
	}
	const first = recent[0];
	const merged = [...(first ? await fetchWindow(symbol, Number(first[0]) - 1) : null) ?? [], ...recent];
	const dedup = /* @__PURE__ */ new Map();
	for (const row of merged) if (Array.isArray(row)) dedup.set(Number(row[0]), row);
	const trimmed = [...dedup.values()].sort((a, b) => Number(a[0]) - Number(b[0])).slice(-1200);
	await writeCache(key, JSON.stringify(trimmed));
	const bars = barsFrom(trimmed);
	return bars.length > 200 ? bars : null;
}
async function runHistoricalBacktest() {
	const series = [];
	const queue = [...BACKTEST_UNIVERSE];
	let cursor = 0;
	async function worker() {
		while (cursor < queue.length) {
			const item = queue[cursor++];
			if (!item) continue;
			const bars = await loadSymbol(item.symbol);
			if (bars) series.push({
				...item,
				bars
			});
		}
	}
	await Promise.all(Array.from({ length: 4 }, () => worker()));
	if (!series.some((s) => s.symbol === "BTC")) return simulateSpotBacktest([]);
	return simulateSpotBacktest(series);
}
async function runOpportunityHistory() {
	const series = [];
	const queue = [...BACKTEST_UNIVERSE];
	let cursor = 0;
	async function worker() {
		while (cursor < queue.length) {
			const item = queue[cursor++];
			if (!item) continue;
			const bars = await loadSymbol(item.symbol);
			if (bars) series.push({
				...item,
				bars
			});
		}
	}
	await Promise.all(Array.from({ length: 4 }, () => worker()));
	return simulateOpportunityBacktest(series);
}
//#endregion
export { runHistoricalBacktest, runOpportunityHistory };
