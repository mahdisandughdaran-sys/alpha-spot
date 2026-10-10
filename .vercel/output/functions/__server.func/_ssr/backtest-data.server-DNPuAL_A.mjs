import { b as writeCache, f as readCache, l as maxDrawdown, s as evaluateKillSwitch } from "./kill-switch-Cnn3GgHf.mjs";
import { a as lookupMeta, c as scoreUniverse, i as enrichFromKlines, n as detectRegime, s as pickWinner } from "./scoring-DksQ3SdW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/backtest-data.server-DNPuAL_A.js
var WARMUP = 220;
var STEP = 7;
var COST_BPS = 15;
function dayKey(ms) {
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
	if (!btc || btc.bars.length < 227) return emptyReport("کندل تاریخی بیت‌کوین برای بک‌تست کافی نبود.");
	const maps = /* @__PURE__ */ new Map();
	for (const s of series) {
		const map = /* @__PURE__ */ new Map();
		for (const bar of s.bars) if (bar.c > 0) map.set(dayKey(bar.t), bar);
		maps.set(s.symbol, map);
	}
	const btcMap = maps.get("BTC");
	if (!btcMap) return emptyReport("سری بیت‌کوین ساخته نشد.");
	const calendar = [...btcMap.keys()].sort((a, b) => a - b);
	if (calendar.length < 227) return emptyReport("تقویم روزانه کوتاه‌تر از پنجره گرم‌شدن مدل است.");
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
	if (periods === 0 || curve.length === 0) return emptyReport("در این بازه هیچ نقطه بازچینش معتبری ساخته نشد.");
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
	const note = totalReturn >= btcReturn ? `در این مسیر، مدل از خرید و نگهداری بیت‌کوین جلوتر بود: ${(totalReturn * 100).toFixed(1)}٪ در برابر ${(btcReturn * 100).toFixed(1)}٪.` : `در این مسیر بیت‌کوین بهتر بود: مدل ${(totalReturn * 100).toFixed(1)}٪ و BTC ${(btcReturn * 100).toFixed(1)}٪.`;
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
		assumptions: [
			"بازچینش هفتگی روی همان امتیاز اسپات (قدرت نسبی، روند، ورود، ریسک) فقط با داده‌ای که تا همان روز وجود داشته.",
			"توکنومیکس و روایت ثابت‌اند؛ تاریخچه واقعی MC/FDV و آنلاک در این بک‌تست نیست.",
			"اگر کلید قطع معلق باشد نگهداری بیت‌کوین است؛ در ریسک بالا نیمی از بازده آلت و نیمی بیت‌کوین.",
			`هزینه جابه‌جایی ${COST_BPS} نقطه پایه. اسلیپیج دفتر سفارش تاریخی در داده عمومی نیست.`,
			"جهان تست، ارزهای نقد شونده با تاریخچه بلند بایننس است نه هر صد ارز امروز — سوگیری بقا دارد."
		],
		note
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
function emptyReport(note) {
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
var BINANCE = "https://data-api.binance.vision/api/v3";
var FRESH_SEC = 43200;
var STALE_SEC = 1209600;
function barsFrom(raw) {
	if (!Array.isArray(raw)) return [];
	const out = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const t = Number(row[0]);
		const c = Number(row[4]);
		const q = Number(row[7]);
		if (!Number.isFinite(t) || !Number.isFinite(c) || c <= 0) continue;
		out.push({
			t,
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
//#endregion
export { runHistoricalBacktest };
