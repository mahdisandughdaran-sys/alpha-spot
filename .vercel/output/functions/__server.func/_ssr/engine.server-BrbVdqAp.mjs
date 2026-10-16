import { n as msg } from "./lex-pVOST3Oe.mjs";
import { h as vsBtc, m as tanhScore, t as clamp, u as percentileRank } from "./math-s2DhiTks.mjs";
import { i as candidateBases, o as isNonSpotCandidate } from "./venues-Ca5MVLXD.mjs";
import { a as writeCache, i as readCachePrefix, n as evaluateKillSwitch, r as readCache, t as cacheHealth } from "./kill-switch-DvqAi3f8.mjs";
import { a as enrichFromKlines, c as pickWinner, i as emptyUnlock, l as scoreUniverse, n as assessUnlocks, o as lookupMeta, r as detectRegime, s as mcFdvRatio, t as FACTOR_WEIGHTS } from "./scoring-ymNazmVA.mjs";
import { r as scanOpportunities, t as emptyOpportunityBoard } from "./opportunity-BRXgfBlA.mjs";
import { a as confidenceOf, d as sessionCalendar, l as explainPick, n as buildChecklist, r as buildVerdict, s as dominanceBiasOf } from "./session-calendar-FqdOYORn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine.server-BrbVdqAp.js
function splitByScore(rows, totalWeight, maxN) {
	const picks = rows.slice(0, maxN);
	if (picks.length === 0) return [];
	const scores = picks.map((r) => Math.max(r.score, 1));
	const sum = scores.reduce((a, b) => a + b, 0);
	return picks.map((r, i) => ({
		symbol: r.symbol,
		name: r.name,
		rank: r.rank,
		weight: totalWeight * ((scores[i] ?? 1) / sum),
		score: r.score,
		reason: r.rank <= 50 ? "لارج‌کپ با امتیاز مدل بالا" : r.narrativeTagsFa[0] ? `میدکپ · ${r.narrativeTagsFa[0]}` : "میدکپ با پتانسیل بالاتر"
	}));
}
function buildPortfolio(ranked, regime, kill) {
	const btc = ranked.find((r) => r.symbol === "BTC");
	const eth = ranked.find((r) => r.symbol === "ETH");
	const corePct = .55;
	const btcShare = regime === "btc" ? .4 : regime === "alt" ? .3 : .35;
	const ethShare = corePct - btcShare;
	const coreLegs = [];
	if (btc) coreLegs.push({
		symbol: btc.symbol,
		name: btc.name,
		rank: btc.rank,
		weight: eth ? btcShare : corePct,
		score: btc.score,
		reason: "هسته پایدار پرتفوی اسپات"
	});
	if (eth) coreLegs.push({
		symbol: eth.symbol,
		name: eth.name,
		rank: eth.rank,
		weight: btc ? ethShare : corePct,
		score: eth.score,
		reason: "لایه یک با ارزش‌افزایی واقعی"
	});
	const used = new Set(coreLegs.map((l) => l.symbol));
	const liquid = ranked.filter((r) => !used.has(r.symbol) && r.volume24h >= 8e6);
	const large = liquid.filter((r) => r.rank >= 3 && r.rank <= 50);
	const mid = liquid.filter((r) => r.rank >= 51 && r.rank <= 100);
	const largeLegs = splitByScore(large, .3, 4);
	const midLegs = splitByScore(mid, .15, 3);
	const sleeves = [
		{
			key: "core",
			title: "هسته · بیت‌کوین و اتریوم",
			targetPct: 55,
			note: regime === "btc" ? "رژیم بیت‌کوین: وزن هسته بیشتر روی BTC است." : regime === "alt" ? "چرخش آلت: ETH داخل هسته وزن بیشتری می‌گیرد." : "بازار خنثی: هسته بین BTC و ETH تقسیم می‌شود.",
			legs: coreLegs
		},
		{
			key: "large",
			title: "لارج‌کپ · رتبه ۲۰ تا ۵۰",
			targetPct: 30,
			note: "آلت‌های نقدشونده با MC/FDV و روند قابل دفاع.",
			legs: largeLegs
		},
		{
			key: "mid",
			title: "میدکپ · رتبه ۵۰ تا ۱۰۰",
			targetPct: 15,
			note: "آستین هایپ و روایت روز؛ حجم کوچک‌تر، ریسک بالاتر.",
			legs: midLegs
		}
	];
	if (!kill || kill.status === "NORMAL") return sleeves;
	if (kill.status === "SUSPENDED") return [
		{
			key: "core",
			title: "پناهگاه · بیت‌کوین",
			targetPct: 100,
			note: "خرید اسپات آلت معلق شد. وزن پیشنهادی کامل به BTC برگشت.",
			legs: btc ? [{
				symbol: btc.symbol,
				name: btc.name,
				rank: btc.rank,
				weight: 1,
				score: btc.score,
				reason: "کلید قطع فعال است؛ تنها وزن باز، پناهگاه بیت‌کوین است."
			}] : []
		},
		{
			key: "large",
			title: "لارج‌کپ · معلق",
			targetPct: 0,
			note: "سیگنال خرید تا رفع کلید قطع صادر نمی‌شود.",
			legs: []
		},
		{
			key: "mid",
			title: "میدکپ · معلق",
			targetPct: 0,
			note: "سیگنال خرید تا رفع کلید قطع صادر نمی‌شود.",
			legs: []
		}
	];
	let freed = 0;
	return sleeves.map((sleeve) => ({
		...sleeve,
		note: `${sleeve.note} حجم آلت‌ها به‌خاطر ریسک کلان نصف شد.`,
		legs: sleeve.legs.map((leg) => {
			if (leg.symbol === "BTC") return leg;
			freed += leg.weight * .5;
			return {
				...leg,
				weight: leg.weight * .5,
				reason: `${leg.reason} · حجم ۵۰٪`
			};
		})
	})).map((sleeve) => ({
		...sleeve,
		legs: sleeve.legs.map((leg) => leg.symbol === "BTC" ? {
			...leg,
			weight: leg.weight + freed
		} : leg)
	}));
}
var LISTING = "https://api.coinmarketcap.com/data-api/v3/token-unlock/listing";
var HISTORY = "https://api.coinmarketcap.com/data-api/v3/token-unlock/historical";
var CACHE_MS$1 = 6e5;
var UNLOCK_KEY = "unlocks:bundle:v1";
var UNLOCK_FRESH = 21600;
var UNLOCK_STALE = 259200;
var cache = null;
async function fetchJson$3(url, ms = 8e3) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "Mozilla/5.0 AlphaSpot/1.2"
			}
		});
		if (!res.ok) return null;
		const json = await res.json();
		if (json && typeof json === "object" && "status" in json && json.status && typeof json.status === "object" && "error_code" in json.status && String(json.status.error_code ?? "0") !== "0") return null;
		return json;
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function num$2(v) {
	const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
	return Number.isFinite(n) ? n : null;
}
async function mapPool$1(items, limit, fn) {
	const out = new Array(items.length);
	let i = 0;
	async function worker() {
		while (i < items.length) {
			const idx = i++;
			out[idx] = await fn(items[idx]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return out;
}
async function loadIndex() {
	const map = /* @__PURE__ */ new Map();
	let start = 1;
	let total = 1200;
	for (let page = 0; page < 16; page++) {
		const json = await fetchJson$3(`${LISTING}?start=${start}&limit=100&sort=next_unlock_date&direction=asc&enableSmallUnlocks=true`, 1e4);
		const data = json && typeof json === "object" && "data" in json ? json.data : null;
		const list = data?.tokenUnlockList;
		if (!Array.isArray(list) || list.length === 0) break;
		if (typeof data?.totalCount === "number") total = data.totalCount;
		for (const raw of list) {
			if (!raw || typeof raw !== "object") continue;
			const row = raw;
			const symbol = typeof row.symbol === "string" ? row.symbol.toUpperCase() : "";
			const cryptoId = num$2(row.cryptoId);
			if (!symbol || cryptoId == null) continue;
			const cmcRank = num$2(row.cmcRank);
			const next = {
				cryptoId,
				symbol,
				maxSupply: num$2(row.maxSupply),
				totalSupply: num$2(row.totalSupply),
				cmcRank
			};
			const prev = map.get(symbol);
			if (!prev || cmcRank != null && (prev.cmcRank == null || cmcRank < prev.cmcRank)) map.set(symbol, next);
		}
		start += 100;
		if (start > total) break;
	}
	return map;
}
function readEvents(json) {
	const hist = (json && typeof json === "object" && "data" in json ? json.data : null)?.tokenHistory;
	if (!Array.isArray(hist)) return [];
	const events = [];
	for (const raw of hist) {
		if (!raw || typeof raw !== "object") continue;
		const row = raw;
		const time = typeof row.time === "string" ? row.time : "";
		const amount = num$2(row.amount);
		if (!time || amount == null || amount <= 0) continue;
		events.push({
			time,
			amount,
			allocationName: typeof row.allocationName === "string" ? row.allocationName : ""
		});
	}
	return events;
}
async function loadUnlockAssessments(symbols) {
	const wanted = [...new Set(symbols.map((s) => s.toUpperCase()).filter((s) => s && s !== "BTC"))];
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS$1) {
		if (wanted.every((s) => cache.bySymbol.has(s))) return {
			source: "coinmarketcap",
			bySymbol: cache.bySymbol
		};
	}
	const fresh = await readStoredUnlocks(UNLOCK_FRESH);
	if (fresh && wanted.every((s) => fresh.has(s))) {
		cache = {
			at: now,
			bySymbol: fresh
		};
		return {
			source: "coinmarketcap",
			bySymbol: fresh
		};
	}
	const index = await loadIndex();
	if (index.size === 0) {
		const stale = await readStoredUnlocks(UNLOCK_STALE);
		if (stale && [...stale.keys()].length > 0) {
			cache = {
				at: now,
				bySymbol: stale
			};
			return {
				source: "coinmarketcap",
				bySymbol: stale
			};
		}
		return {
			source: "unavailable",
			bySymbol: /* @__PURE__ */ new Map()
		};
	}
	const assessed = await mapPool$1(wanted.map((symbol) => index.get(symbol)).filter((row) => Boolean(row)), 8, async (row) => {
		const json = await fetchJson$3(`${HISTORY}?cryptoId=${row.cryptoId}`, 8e3);
		if (!json) return [row.symbol, emptyUnlock("تقویم این نماد الان پاسخ نداد.")];
		const events = readEvents(json);
		return [row.symbol, assessUnlocks({
			maxSupply: row.maxSupply,
			totalSupply: row.totalSupply,
			events
		})];
	});
	const bySymbol = /* @__PURE__ */ new Map();
	for (const symbol of wanted) if (!index.has(symbol)) bySymbol.set(symbol, emptyUnlock());
	for (const [symbol, assessment] of assessed) bySymbol.set(symbol, assessment);
	cache = {
		at: now,
		bySymbol
	};
	await writeCache(UNLOCK_KEY, JSON.stringify([...bySymbol.entries()]));
	return {
		source: "coinmarketcap",
		bySymbol
	};
}
async function readStoredUnlocks(maxAgeSec) {
	const raw = await readCache(UNLOCK_KEY, maxAgeSec);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return null;
		return new Map(parsed);
	} catch {
		return null;
	}
}
function annualizedFunding(rate8h) {
	return rate8h * 3 * 365;
}
function oiChange(nowUsd, prevUsd) {
	if (nowUsd == null || prevUsd == null || !(prevUsd > 0)) return null;
	return nowUsd / prevUsd - 1;
}
function hotDerivatives(input) {
	const change = input.oiChange24h;
	const ratio = input.longShortRatio;
	if (change != null && change >= .25 && (ratio == null || ratio >= 1.6)) return true;
	if (ratio != null && ratio >= 2.3) return true;
	return false;
}
function usdCompact(n) {
	if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	return Math.round(n).toLocaleString("en-US");
}
function derivSentence(input) {
	const faParts = [];
	const enParts = [];
	if (input.openInterestUsd != null && input.openInterestUsd > 0) {
		const usd = usdCompact(input.openInterestUsd);
		faParts.push(`سود باز $${usd}`);
		enParts.push(`open interest $${usd}`);
	}
	if (input.oiChange24h != null && Number.isFinite(input.oiChange24h)) {
		const pct = input.oiChange24h * 100;
		const sign = pct > 0 ? "+" : "";
		faParts.push(`تغییر ۲۴س ${sign}${pct.toFixed(1)}٪`);
		enParts.push(`24h change ${sign}${pct.toFixed(1)}%`);
	}
	if (input.longShortRatio != null && Number.isFinite(input.longShortRatio)) {
		faParts.push(`لانگ/شورت ${input.longShortRatio.toFixed(2)}`);
		enParts.push(`long/short ${input.longShortRatio.toFixed(2)}`);
	}
	return {
		fa: faParts.length ? `${faParts.join("، ")}.` : "",
		en: enParts.length ? `${enParts.join(", ")}.` : ""
	};
}
function assessBook(input) {
	const notionalUsd = input.notionalUsd ?? 1e4;
	const symbol = input.symbol.toUpperCase();
	const asks = input.asks.filter((lvl) => lvl.price > 0 && lvl.qty > 0).sort((a, b) => a.price - b.price);
	const funding8h = input.funding8h;
	const fundingAnnual = funding8h == null || !Number.isFinite(funding8h) ? null : annualizedFunding(funding8h);
	const openInterestUsd = input.openInterestUsd != null && Number.isFinite(input.openInterestUsd) ? input.openInterestUsd : null;
	const oiChange24h = input.oiChange24h != null && Number.isFinite(input.oiChange24h) ? input.oiChange24h : null;
	const longShortRatio = input.longShortRatio != null && Number.isFinite(input.longShortRatio) ? input.longShortRatio : null;
	const smallCap = input.smallCap === true;
	const deriv = derivSentence({
		...input,
		openInterestUsd,
		oiChange24h,
		longShortRatio
	});
	if (asks.length === 0) return {
		symbol,
		notionalUsd,
		slippageBps: null,
		depthUsd: null,
		filledPct: null,
		funding8h,
		fundingAnnual,
		openInterestUsd,
		oiChange24h,
		longShortRatio,
		smallCap,
		gate: "unknown",
		note: deriv.fa ? msg(`دفتر سفارش بایننس برای این نماد پاسخ نداد. ${deriv.fa}`, `The Binance order book did not respond for this symbol. ${deriv.en}`) : msg("دفتر سفارش بایننس برای این نماد پاسخ نداد؛ فیلتر اسلیپیج اعمال نشد.", "The Binance order book did not respond for this symbol; the slippage filter was not applied.")
	};
	const best = asks[0].price;
	const band = best * 1.001;
	let depthUsd = 0;
	for (const lvl of asks) {
		if (lvl.price > band) break;
		depthUsd += lvl.price * lvl.qty;
	}
	let spent = 0;
	let qty = 0;
	for (const lvl of asks) {
		if (spent >= notionalUsd) break;
		const room = notionalUsd - spent;
		const levelUsd = lvl.price * lvl.qty;
		const take = Math.min(room, levelUsd);
		spent += take;
		qty += take / lvl.price;
	}
	const filledPct = notionalUsd > 0 ? spent / notionalUsd : 0;
	const avg = qty > 0 ? spent / qty : best;
	const slippageBps = best > 0 ? (avg / best - 1) * 1e4 : 0;
	const thin = filledPct < .9 || slippageBps > 35 || depthUsd < 25e3;
	const crowded = fundingAnnual != null && fundingAnnual > .3;
	const levered = smallCap && hotDerivatives({
		oiChange24h,
		longShortRatio
	});
	const gate = thin ? "thin" : crowded ? "crowded" : levered ? "levered" : "pass";
	const slipTxt = `${slippageBps.toFixed(1)} bps`;
	const depthTxt = depthUsd >= 1e6 ? `${(depthUsd / 1e6).toFixed(2)}M` : `${Math.round(depthUsd).toLocaleString("en-US")}`;
	const fundTxt = fundingAnnual == null ? "فاندینگ آتی در دسترس نبود" : `فاندینگ سالانه ${(fundingAnnual * 100).toFixed(1)}٪`;
	const fundEn = fundingAnnual == null ? "futures funding was unavailable" : `annualized funding ${(fundingAnnual * 100).toFixed(1)}%`;
	const tail = deriv.fa ? ` ${deriv.fa}` : "";
	const tailEn = deriv.en ? ` ${deriv.en}` : "";
	const note = msg(gate === "thin" ? `خرید ${Math.round(notionalUsd).toLocaleString("en-US")} دلار حدود ${slipTxt} لغزش دارد و عمق ۱۰bps برابر $${depthTxt} است. سیگنال خرید معلق شد.${tail}` : gate === "crowded" ? `دفتر سفارش قابل قبول است (${slipTxt}، عمق $${depthTxt}) اما ${fundTxt} — پوزیشن لانگ آتی شلوغ است و حجم اسپات نصف شد.${tail}` : gate === "levered" ? `دفتر اسپات قابل قبول است (${slipTxt}) اما سود باز آلت خرد داغ است و حجم اسپات نصف شد. ${fundTxt}.${tail}` : `اسلیپیج ${slipTxt}، عمق ۱۰bps برابر $${depthTxt}. ${fundTxt}.${tail}`, gate === "thin" ? `A buy of ${Math.round(notionalUsd).toLocaleString("en-US")} dollars has about ${slipTxt} of slippage and 10 bps of depth at $${depthTxt}. The buy signal was suspended.${tailEn}` : gate === "crowded" ? `The order book is acceptable (${slipTxt}, depth $${depthTxt}) but ${fundEn} — the futures long is crowded and spot size was halved.${tailEn}` : gate === "levered" ? `The spot book is acceptable (${slipTxt}) but small-cap open interest is hot and spot size was halved. ${fundEn}.${tailEn}` : `Slippage ${slipTxt}, 10 bps depth $${depthTxt}. ${fundEn}.${tailEn}`);
	return {
		symbol,
		notionalUsd,
		slippageBps,
		depthUsd,
		filledPct,
		funding8h,
		fundingAnnual,
		openInterestUsd,
		oiChange24h,
		longShortRatio,
		smallCap,
		gate,
		note
	};
}
function applyBookGate(row, book) {
	if (!book || book.gate === "unknown" || book.gate === "pass") return row;
	if (book.gate === "thin") return {
		...row,
		score: clamp(row.score - 14),
		buySignal: "suspended",
		sizeMultiplier: 0
	};
	const buySignal = row.buySignal === "open" ? "reduced" : row.buySignal;
	const sizeMultiplier = row.buySignal === "suspended" ? 0 : Math.min(row.sizeMultiplier, .5);
	const penalty = book.gate === "levered" ? 8 : 6;
	return {
		...row,
		score: clamp(row.score - penalty),
		buySignal,
		sizeMultiplier
	};
}
var DEPTH = "https://data-api.binance.vision/api/v3/depth";
var OKX = "https://www.okx.com";
var FAPI = "https://fapi.binance.com";
var FRESH_DEPTH = 90;
var FRESH_DERIV = 600;
var EMPTY_DERIV = {
	funding8h: null,
	openInterestUsd: null,
	oiChange24h: null,
	longShortRatio: null
};
async function fetchJson$2(url, ms = 7e3) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.4"
			}
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
function num$1(value) {
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}
function levelsOf(raw) {
	if (!raw) return [];
	const out = [];
	for (const row of raw) {
		const price = Number(row[0]);
		const qty = Number(row[1]);
		if (Number.isFinite(price) && Number.isFinite(qty)) out.push({
			price,
			qty
		});
	}
	return out;
}
function mergeDeriv(primary, extra) {
	return {
		funding8h: primary.funding8h ?? extra.funding8h,
		openInterestUsd: primary.openInterestUsd ?? extra.openInterestUsd,
		oiChange24h: primary.oiChange24h ?? extra.oiChange24h,
		longShortRatio: primary.longShortRatio ?? extra.longShortRatio
	};
}
function hasDeriv(row) {
	return row.funding8h != null || row.openInterestUsd != null || row.oiChange24h != null || row.longShortRatio != null;
}
async function okxDeriv(base) {
	const inst = `${base}-USDT-SWAP`;
	const [fund, hist, lsr] = await Promise.all([
		fetchJson$2(`${OKX}/api/v5/public/funding-rate?instId=${inst}`, 5e3),
		fetchJson$2(`${OKX}/api/v5/rubik/stat/contracts/open-interest-history?instId=${inst}&period=1H`, 5e3),
		fetchJson$2(`${OKX}/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=${base}&period=1H`, 5e3)
	]);
	const rows = hist?.data ?? [];
	const nowUsd = num$1(rows[0]?.[3]);
	const prevUsd = num$1(rows[23]?.[3] ?? rows[rows.length - 1]?.[3]);
	return {
		funding8h: num$1(fund?.data?.[0]?.fundingRate),
		openInterestUsd: nowUsd,
		oiChange24h: rows.length > 1 ? oiChange(nowUsd, prevUsd) : null,
		longShortRatio: num$1(lsr?.data?.[0]?.[1])
	};
}
async function binanceDeriv(base) {
	const symbol = `${base}USDT`;
	const [premium, oi, hist, ratio] = await Promise.all([
		fetchJson$2(`${FAPI}/fapi/v1/premiumIndex?symbol=${symbol}`, 2500),
		fetchJson$2(`${FAPI}/fapi/v1/openInterest?symbol=${symbol}`, 2500),
		fetchJson$2(`${FAPI}/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=24`, 2500),
		fetchJson$2(`${FAPI}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=1`, 2500)
	]);
	const mark = num$1(premium?.markPrice);
	const contracts = num$1(oi?.openInterest);
	const nowUsd = mark != null && contracts != null ? contracts * mark : null;
	const oldest = Array.isArray(hist) && hist.length ? num$1(hist[0]?.sumOpenInterestValue) : null;
	const newest = Array.isArray(hist) && hist.length ? num$1(hist[hist.length - 1]?.sumOpenInterestValue) : null;
	return {
		funding8h: num$1(premium?.lastFundingRate),
		openInterestUsd: nowUsd ?? newest,
		oiChange24h: oiChange(newest, oldest),
		longShortRatio: num$1(ratio?.[0]?.longShortRatio)
	};
}
async function derivativesFor(base) {
	const key = `deriv:${base}USDT`;
	const fresh = await readCache(key, FRESH_DERIV);
	if (fresh) try {
		const parsed = JSON.parse(fresh);
		if (parsed && typeof parsed === "object") return {
			...EMPTY_DERIV,
			...parsed
		};
	} catch {}
	const [okx, binance] = await Promise.all([okxDeriv(base), binanceDeriv(base)]);
	const merged = mergeDeriv(okx, binance);
	if (hasDeriv(merged)) await writeCache(key, JSON.stringify(merged));
	return merged;
}
async function depthFor(base) {
	const key = `depth:${base}USDT:100`;
	const fresh = await readCache(key, FRESH_DEPTH);
	if (fresh) try {
		return levelsOf(JSON.parse(fresh).asks);
	} catch {}
	const json = await fetchJson$2(`${DEPTH}?symbol=${base}USDT&limit=100`);
	if (!json?.asks) return null;
	await writeCache(key, JSON.stringify({ asks: json.asks.slice(0, 100) }));
	return levelsOf(json.asks);
}
async function oneBook(target) {
	const bases = candidateBases(target.symbol.toUpperCase());
	let asks = null;
	let used = bases[0] ?? target.symbol;
	for (const base of bases) {
		const got = await depthFor(base);
		if (got && got.length) {
			asks = got;
			used = base;
			break;
		}
	}
	const deriv = await derivativesFor(used);
	return assessBook({
		symbol: target.symbol,
		asks: asks ?? [],
		funding8h: deriv.funding8h,
		openInterestUsd: deriv.openInterestUsd,
		oiChange24h: deriv.oiChange24h,
		longShortRatio: deriv.longShortRatio,
		smallCap: target.smallCap
	});
}
async function loadTopBooks(targets) {
	const seen = /* @__PURE__ */ new Set();
	const queue = [];
	for (const target of targets) {
		const symbol = target.symbol.toUpperCase();
		if (!symbol || symbol === "BTC" || seen.has(symbol)) continue;
		seen.add(symbol);
		queue.push({
			symbol,
			smallCap: target.smallCap
		});
		if (queue.length >= 12) break;
	}
	const out = [];
	let i = 0;
	async function worker() {
		while (i < queue.length) {
			const idx = i++;
			const target = queue[idx];
			if (!target) continue;
			try {
				out.push(await oneBook(target));
			} catch {
				out.push(assessBook({
					symbol: target.symbol,
					asks: [],
					funding8h: null,
					smallCap: target.smallCap
				}));
			}
		}
	}
	await Promise.all(Array.from({ length: Math.min(3, queue.length) }, () => worker()));
	return out;
}
function num(value) {
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : NaN;
	return Number.isFinite(n) ? n : null;
}
function emptyQuote(price, volume, extra = {}) {
	return {
		price,
		volume_24h: volume,
		volume_24h_change_24h: 0,
		market_cap: 0,
		percent_change_1h: 0,
		percent_change_6h: 0,
		percent_change_12h: 0,
		percent_change_24h: 0,
		percent_change_7d: 0,
		percent_from_price_ath: null,
		...extra
	};
}
function asRecord$1(value) {
	return value && typeof value === "object" ? value : null;
}
/** CoinGecko /coins/markets + /global. Returns null when the payload is not a usable top list. */
function fromCoinGecko(markets, global) {
	if (!Array.isArray(markets) || markets.length < 10) return null;
	const rows = markets.map((raw) => asRecord$1(raw)).filter((row) => row != null);
	const btc = rows.find((row) => String(row.symbol ?? "").toUpperCase() === "BTC");
	const btcPrice = btc ? num(btc.current_price) : null;
	if (!btcPrice || btcPrice <= 0) return null;
	const tickers = [];
	for (const row of rows) {
		const symbol = String(row.symbol ?? "").toUpperCase();
		const name = String(row.name ?? symbol);
		const rank = num(row.market_cap_rank);
		const price = num(row.current_price);
		if (!symbol || rank == null || rank <= 0 || price == null || price <= 0) continue;
		if (symbol !== "BTC" && isNonSpotCandidate(symbol, name)) continue;
		const pct = (key) => num(row[key]) ?? 0;
		const pct30 = num(row.price_change_percentage_30d_in_currency) ?? num(row.price_change_percentage_30d);
		const usd = emptyQuote(price, num(row.total_volume) ?? 0, {
			market_cap: num(row.market_cap) ?? 0,
			percent_change_1h: num(row.price_change_percentage_1h_in_currency) ?? num(row.price_change_percentage_1h) ?? 0,
			percent_change_24h: num(row.price_change_percentage_24h_in_currency) ?? num(row.price_change_percentage_24h) ?? pct("price_change_percentage_24h"),
			percent_change_7d: num(row.price_change_percentage_7d_in_currency) ?? num(row.price_change_percentage_7d) ?? 0,
			percent_change_30d: pct30 ?? void 0,
			percent_from_price_ath: num(row.ath_change_percentage)
		});
		const btcQuote = emptyQuote(price / btcPrice, 0);
		tickers.push({
			id: String(row.id ?? symbol),
			name,
			symbol,
			rank,
			total_supply: num(row.total_supply),
			max_supply: num(row.max_supply),
			circulating_supply: num(row.circulating_supply),
			beta_value: null,
			quotes: {
				USD: usd,
				BTC: btcQuote
			}
		});
	}
	if (!tickers.some((row) => row.symbol === "BTC")) return null;
	return {
		tickers,
		dominance: num(asRecord$1(asRecord$1(asRecord$1(global)?.data)?.market_cap_percentage)?.btc)
	};
}
var LEVERED = /(UP|DOWN|BULL|BEAR)$/;
/** Public Binance 24h tickers. No market cap and no 7d/30d — those stay empty rather than invented. */
function fromBinanceTickers(raw) {
	if (!Array.isArray(raw) || raw.length < 10) return null;
	const rows = raw.map((item) => asRecord$1(item)).filter((row) => row != null).map((row) => {
		return {
			symbol: String(row.symbol ?? ""),
			price: num(row.lastPrice ?? row.price),
			quoteVolume: num(row.quoteVolume) ?? 0,
			change24: num(row.priceChangePercent) ?? 0
		};
	}).filter((row) => row.symbol.endsWith("USDT") && row.price != null && row.price > 0);
	const btc = rows.find((row) => row.symbol === "BTCUSDT");
	if (!btc?.price) return null;
	const tickers = rows.filter((row) => {
		const base = row.symbol.slice(0, -4);
		if (!base || LEVERED.test(base)) return false;
		if (base !== "BTC" && isNonSpotCandidate(base, base)) return false;
		return true;
	}).sort((a, b) => b.quoteVolume - a.quoteVolume).slice(0, 100).map((row, index) => {
		const base = row.symbol.slice(0, -4);
		const price = row.price ?? 0;
		const usd = emptyQuote(price, row.quoteVolume, { percent_change_24h: row.change24 });
		return {
			id: `binance:${base}`,
			name: base,
			symbol: base,
			rank: index + 1,
			total_supply: null,
			max_supply: null,
			circulating_supply: null,
			beta_value: null,
			quotes: {
				USD: usd,
				BTC: emptyQuote(price / (btc.price ?? 1), 0)
			}
		};
	});
	if (!tickers.some((row) => row.symbol === "BTC")) return null;
	return {
		tickers,
		dominance: null
	};
}
var FACTOR_KEYS = Object.keys(FACTOR_WEIGHTS);
function capRs(x) {
	return Math.max(-.35, Math.min(.35, x));
}
/** Base weights stay. A cut only shrinks a factor that lagged Bitcoin, then the set is renormalized. */
function normalizedWeights(cuts) {
	const raw = FACTOR_KEYS.map((key) => {
		const cut = cuts?.[key];
		const multiplier = cut == null || !Number.isFinite(cut) ? 1 : Math.min(1, Math.max(.7, cut));
		return [key, FACTOR_WEIGHTS[key] * multiplier];
	});
	const sum = raw.reduce((total, [, weight]) => total + weight, 0) || 1;
	return Object.fromEntries(raw.map(([key, weight]) => [key, weight / sum]));
}
function blendOf(row, horizon) {
	if (row.symbol === "BTC") return 0;
	const week = capRs(row.rs7d);
	const mid = capRs(row.rs14d ?? row.rs7d);
	const month = capRs(row.rs30d ?? row.rs7d);
	if (horizon === "week") return .72 * week + .18 * mid + .1 * month;
	return .15 * week + .15 * mid + .7 * month;
}
/**
* Horizon changes which evidence the existing factors listen to.
* Week: 7-day relative strength and entry. Month: 30-day strength, EMA200, weekly structure.
* It does not add a factor and does not replace the published base weights.
*/
function applyLens(rows, horizon, cuts) {
	const weights = normalizedWeights(cuts);
	const blends = rows.map((row) => blendOf(row, horizon));
	return rows.map((row, index) => {
		const factors = row.factors.map((factor) => ({ ...factor }));
		const rs = factors.find((factor) => factor.key === "rs");
		if (rs && row.symbol !== "BTC") {
			const blend = blends[index] ?? 0;
			const p = percentileRank(blend, blends);
			const abs = tanhScore(blend, .12, 50);
			let score = .55 * p + .45 * abs;
			if (row.rs7d > .18) score -= 10;
			rs.score = clamp(score);
		}
		if (horizon === "week") {
			const entry = factors.find((factor) => factor.key === "entry");
			if (entry) entry.score = clamp(50 + (entry.score - 50) * 1.35);
		}
		if (horizon === "month") {
			const trend = factors.find((factor) => factor.key === "trend");
			if (trend) {
				let bump = 0;
				if (row.aboveEma200 === true) bump += 8;
				else if (row.aboveEma200 === false) bump -= 8;
				if (row.weeklyStructure === "bull") bump += 8;
				else if (row.weeklyStructure === "bear") bump -= 8;
				trend.score = clamp(trend.score + bump);
			}
		}
		const oldWeighted = row.factors.reduce((sum, factor) => sum + factor.score * FACTOR_WEIGHTS[factor.key], 0);
		const newWeighted = factors.reduce((sum, factor) => sum + factor.score * weights[factor.key], 0);
		for (const factor of factors) factor.weight = weights[factor.key] ?? factor.weight;
		return {
			...row,
			factors,
			score: clamp(row.score + (newWeighted - oldWeighted))
		};
	});
}
function asRecord(value) {
	return value && typeof value === "object" ? value : null;
}
function baseOf(value) {
	if (typeof value === "string" && /^[A-Za-z0-9]{2,15}$/.test(value)) return value.toUpperCase();
	const row = asRecord(value);
	if (!row) return null;
	const raw = row.id ?? row.symbol ?? row.code ?? row.name;
	return typeof raw === "string" ? baseOf(raw) : null;
}
function addBase(out, value) {
	const base = baseOf(value);
	if (base) out.add(base);
}
function basesFromNobitex(payload) {
	const stats = asRecord(asRecord(payload)?.stats);
	if (!stats) return null;
	const out = /* @__PURE__ */ new Set();
	for (const key of Object.keys(stats)) {
		const base = key.split("-")[0];
		if (base) addBase(out, base);
	}
	return out.size ? [...out] : null;
}
function basesFromWallex(payload) {
	const result = asRecord(asRecord(payload)?.result) ?? asRecord(payload);
	const symbols = result?.symbols ?? result?.markets ?? asRecord(payload)?.markets;
	const out = /* @__PURE__ */ new Set();
	const take = (row) => {
		const rec = asRecord(row);
		if (!rec) return;
		addBase(out, rec.baseAsset ?? rec.base_asset ?? rec.base ?? rec.srcCurrency);
	};
	if (Array.isArray(symbols)) symbols.forEach(take);
	else if (symbols && typeof symbols === "object") Object.values(symbols).forEach(take);
	return out.size ? [...out] : null;
}
function basesFromOmpfinex(payload) {
	const root = asRecord(payload);
	const list = Array.isArray(payload) ? payload : Array.isArray(root?.data) ? root.data : Array.isArray(root?.markets) ? root.markets : Array.isArray(asRecord(root?.data)?.markets) ? asRecord(root?.data)?.markets : null;
	if (!list) return null;
	const out = /* @__PURE__ */ new Set();
	for (const item of list) {
		const rec = asRecord(item);
		if (!rec) continue;
		const direct = rec.base_currency ?? rec.baseCurrency ?? rec.baseAsset ?? rec.base ?? rec.from;
		if (direct) addBase(out, direct);
		else if (typeof rec.symbol === "string") addBase(out, rec.symbol.replace(/[-_/]?(USDT|IRT|IRR|TMN|RLS)$/i, ""));
	}
	return out.size ? [...out] : null;
}
function basesFromBinance(payload) {
	const rows = Array.isArray(payload) ? payload : Array.isArray(asRecord(payload)?.symbols) ? asRecord(payload)?.symbols : null;
	if (!rows) return null;
	const out = /* @__PURE__ */ new Set();
	for (const item of rows) {
		const rec = asRecord(item);
		if (!rec) continue;
		if (typeof rec.baseAsset === "string") {
			const quote = String(rec.quoteAsset ?? "");
			const status = String(rec.status ?? "TRADING");
			if (quote && quote !== "USDT") continue;
			if (status && status !== "TRADING") continue;
			addBase(out, rec.baseAsset);
			continue;
		}
		const symbol = String(rec.symbol ?? "");
		if (!symbol.endsWith("USDT")) continue;
		addBase(out, symbol.slice(0, -4));
	}
	return out.size ? [...out] : null;
}
function basesFromBybit(payload) {
	const result = asRecord(asRecord(payload)?.result);
	const list = Array.isArray(result?.list) ? result.list : Array.isArray(payload) ? payload : null;
	if (!list) return null;
	const out = /* @__PURE__ */ new Set();
	for (const item of list) {
		const rec = asRecord(item);
		if (!rec) continue;
		const quote = String(rec.quoteCoin ?? rec.quote ?? "USDT");
		const status = String(rec.status ?? "Trading");
		if (quote && quote !== "USDT") continue;
		if (status && status !== "Trading") continue;
		addBase(out, rec.baseCoin ?? rec.baseCoin ?? rec.base);
		if (!rec.baseCoin && typeof rec.symbol === "string" && rec.symbol.endsWith("USDT")) addBase(out, rec.symbol.slice(0, -4));
	}
	return out.size ? [...out] : null;
}
function parseVenueBases(venue, payload) {
	if (venue === "nobitex") return basesFromNobitex(payload);
	if (venue === "wallex") return basesFromWallex(payload);
	if (venue === "ompfinex") return basesFromOmpfinex(payload);
	if (venue === "binance") return basesFromBinance(payload);
	return basesFromBybit(payload);
}
var URLS = {
	nobitex: ["https://apiv2.nobitex.ir/market/stats"],
	wallex: ["https://api.wallex.ir/v1/markets"],
	ompfinex: ["https://api.ompfinex.com/v1/market", "https://api.ompfinex.com/v2/markets"],
	binance: ["https://data-api.binance.vision/api/v3/ticker/price"],
	bybit: ["https://api.bybit.com/v5/market/instruments-info?category=spot&limit=1000"]
};
var memory$1 = /* @__PURE__ */ new Map();
var FRESH_MS = 6e5;
async function fetchJson$1(url) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.1"
			}
		});
		if (!res.ok) return null;
		return await res.json();
	} catch {
		return null;
	} finally {
		clearTimeout(timer);
	}
}
async function loadVenueListing(venue) {
	const hit = memory$1.get(venue);
	if (hit && Date.now() - hit.at < FRESH_MS) return {
		ok: true,
		bases: hit.bases
	};
	for (const url of URLS[venue]) {
		const payload = await fetchJson$1(url);
		const bases = payload ? parseVenueBases(venue, payload) : null;
		if (bases && bases.length > 0) {
			memory$1.set(venue, {
				at: Date.now(),
				bases
			});
			return {
				ok: true,
				bases
			};
		}
	}
	return { ok: false };
}
var PAPRIKA = "https://api.coinpaprika.com/v1";
var BINANCE = "https://data-api.binance.vision/api/v3";
var CACHE_MS = 12e4;
var ANALYSIS_FRESH = 120;
var ANALYSIS_STALE = 21600;
var KLINE_FRESH = 21600;
var KLINE_STALE = 1209600;
var TARGET_UNIVERSE = 100;
var KLINE_LIMIT = 220;
var memory = /* @__PURE__ */ new Map();
function cacheKey(run) {
	const cuts = run.cuts ?? {};
	const packed = Object.keys(cuts).sort().map((key) => `${key}:${Number(cuts[key]).toFixed(4)}`).join(",");
	return `analysis:spot:v6:${run.venue}:${run.horizon}:${packed}`;
}
async function fetchJson(url, ms = 14e3) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.1"
			}
		});
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
async function fetchMaybe(url, ms = 1e4) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.1"
			}
		});
		if (!res.ok) return {
			ok: false,
			status: res.status
		};
		return {
			ok: true,
			data: await res.json()
		};
	} catch {
		return {
			ok: false,
			status: 0
		};
	} finally {
		clearTimeout(timer);
	}
}
async function mapPool(items, limit, fn) {
	const out = new Array(items.length);
	let i = 0;
	async function worker() {
		while (i < items.length) {
			const idx = i++;
			out[idx] = await fn(items[idx]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()));
	return out;
}
function parseKlines(raw) {
	if (!Array.isArray(raw) || raw.length < 8) return null;
	const times = [];
	const opens = [];
	const highs = [];
	const lows = [];
	const closes = [];
	const volumes = [];
	const quotes = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const t = Number(row[0]);
		const o = Number(row[1]);
		const h = Number(row[2]);
		const l = Number(row[3]);
		const c = Number(row[4]);
		const v = Number(row[5]);
		const q = Number(row[7]);
		if (!Number.isFinite(t) || !Number.isFinite(c) || c <= 0) continue;
		times.push(t);
		opens.push(Number.isFinite(o) && o > 0 ? o : c);
		highs.push(Number.isFinite(h) && h > 0 ? h : c);
		lows.push(Number.isFinite(l) && l > 0 ? l : c);
		closes.push(c);
		volumes.push(Number.isFinite(v) ? v : 0);
		quotes.push(Number.isFinite(q) ? q : 0);
	}
	if (closes.length < 8) return null;
	return {
		times,
		opens,
		highs,
		lows,
		closes,
		volumes,
		quotes
	};
}
function alignPair(coin, btc) {
	const map = /* @__PURE__ */ new Map();
	btc.times.forEach((t, i) => {
		const px = btc.closes[i];
		if (px) map.set(t, px);
	});
	const pair = [];
	coin.times.forEach((t, i) => {
		const b = map.get(t);
		const c = coin.closes[i];
		if (b && b !== 0 && c != null) pair.push(c / b);
	});
	return pair;
}
function klineKey(base) {
	return `k:220:${base}USDT`;
}
function freshEnough(at, maxSec) {
	return at > 0 && Date.now() - at <= maxSec * 1e3;
}
function parseCachedKline(payload) {
	try {
		return parseKlines(JSON.parse(payload));
	} catch {
		return null;
	}
}
async function loadKline(base, store, binanceOpen) {
	const key = klineKey(base);
	const hit = store.get(key);
	if (hit && freshEnough(hit.at, KLINE_FRESH)) {
		const parsed = parseCachedKline(hit.payload);
		if (parsed) return parsed;
	}
	const stale = hit && freshEnough(hit.at, KLINE_STALE) ? parseCachedKline(hit.payload) : null;
	if (!binanceOpen.value) return stale;
	const res = await fetchMaybe(`${BINANCE}/klines?symbol=${base}USDT&interval=1d&limit=${KLINE_LIMIT}`, base === "BTC" ? 12e3 : 9e3);
	if (!res.ok) {
		if (res.status === 418 || res.status === 429 || res.status === 0) binanceOpen.value = false;
		return stale;
	}
	const parsed = parseKlines(res.data);
	if (!parsed) return stale;
	const payload = JSON.stringify(res.data);
	store.set(key, {
		payload,
		at: Date.now()
	});
	await writeCache(key, payload);
	return parsed;
}
function barsOf(parsed) {
	const out = [];
	for (let i = 0; i < parsed.closes.length; i++) {
		const c = parsed.closes[i] ?? 0;
		if (c <= 0) continue;
		out.push({
			t: parsed.times[i] ?? i,
			o: parsed.opens[i] || c,
			h: parsed.highs[i] || c,
			l: parsed.lows[i] || c,
			c,
			v: parsed.volumes[i] ?? 0,
			q: parsed.quotes[i] ?? 0
		});
	}
	return out;
}
async function readStoredAnalysis(key, maxAgeSec) {
	const raw = await readCache(key, maxAgeSec);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed?.pick?.symbol || !parsed.killSwitch || !parsed.opportunities?.items) return null;
		const kind = parsed.verdict?.kind;
		if (kind !== "buy" && kind !== "wait" && kind !== "stay") return null;
		parsed.cacheRows = parsed.cacheRows ?? 0;
		parsed.cacheKlines = parsed.cacheKlines ?? 0;
		return parsed;
	} catch {
		return null;
	}
}
async function runAnalysis(run) {
	const key = cacheKey(run);
	const now = Date.now();
	const hit = memory.get(key);
	if (hit && now - hit.at < CACHE_MS) return {
		...hit.value,
		dataCache: "memory"
	};
	const storedFresh = await readStoredAnalysis(key, ANALYSIS_FRESH);
	if (storedFresh) {
		storedFresh.dataCache = "stored";
		memory.set(key, {
			at: now,
			value: storedFresh
		});
		return storedFresh;
	}
	try {
		const result = await computeAnalysis(run);
		memory.set(key, {
			at: Date.now(),
			value: result
		});
		await writeCache(key, JSON.stringify(result));
		return result;
	} catch (err) {
		const stale = await readStoredAnalysis(key, ANALYSIS_STALE);
		if (stale) {
			stale.dataCache = "stored";
			stale.caution = ["داده زنده ناقص بود؛ آخرین تحلیل ذخیره‌شده نشان داده می‌شود.", ...stale.caution].slice(0, 6);
			memory.set(key, {
				at: Date.now(),
				value: stale
			});
			return stale;
		}
		throw err instanceof Error ? err : /* @__PURE__ */ new Error("تحلیل انجام نشد.");
	}
}
async function loadUniverse() {
	try {
		const [tickers, global] = await Promise.all([fetchJson(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`), fetchJson(`${PAPRIKA}/global`)]);
		if (!Array.isArray(tickers) || tickers.length === 0) throw new Error("empty");
		return {
			tickers,
			dominance: global.bitcoin_dominance_percentage,
			source: "CoinPaprika"
		};
	} catch {}
	try {
		const [markets, global] = await Promise.all([fetchJson("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=150&page=1&sparkline=false&price_change_percentage=1h,24h,7d,30d"), fetchJson("https://api.coingecko.com/api/v3/global")]);
		const parsed = fromCoinGecko(markets, global);
		if (parsed) return {
			tickers: parsed.tickers,
			dominance: parsed.dominance,
			source: "CoinGecko"
		};
	} catch {}
	const parsed = fromBinanceTickers(await fetchJson(`${BINANCE}/ticker/24hr`));
	if (!parsed) throw new Error("فهرست بازار از CoinPaprika، CoinGecko و بایننس ساخته نشد.");
	return {
		tickers: parsed.tickers,
		dominance: null,
		source: "Binance ticker"
	};
}
async function computeAnalysis(run) {
	const listingPromise = loadVenueListing(run.venue);
	const loaded = await loadUniverse();
	const tickers = loaded.tickers;
	const btcTicker = tickers.find((t) => t.symbol === "BTC");
	if (!btcTicker) throw new Error("داده بیت‌کوین در دسترس نیست");
	const btcUsd = btcTicker.quotes.USD;
	const btcPct7d = (btcUsd.percent_change_7d || 0) / 100;
	const btcPct30d = btcUsd.percent_change_30d == null ? null : btcUsd.percent_change_30d / 100;
	const ranked = [...tickers].filter((t) => typeof t.rank === "number" && t.rank > 0).sort((a, b) => a.rank - b.rank);
	const universe = [];
	for (const t of ranked) {
		if (t.rank > TARGET_UNIVERSE) break;
		if (t.symbol === "BTC") {
			universe.push(t);
			continue;
		}
		if (isNonSpotCandidate(t.symbol, t.name)) continue;
		universe.push(t);
	}
	let binanceOpen = { value: true };
	const klineStore = await readCachePrefix("k:220:");
	const btcParsed = await loadKline("BTC", klineStore, binanceOpen);
	if (!btcParsed) binanceOpen.value = false;
	const klineNeed = universe.filter((t) => t.symbol.toUpperCase() !== "BTC");
	const klinesTried = klineNeed.length;
	const klineById = /* @__PURE__ */ new Map();
	if (btcParsed) {
		const fetched = await mapPool(klineNeed, 6, async (ticker) => {
			const symbol = ticker.symbol.toUpperCase();
			const bases = candidateBases(symbol);
			for (const sym of bases) {
				const parsed = await loadKline(sym, klineStore, binanceOpen);
				if (!parsed) continue;
				const pair = alignPair(parsed, btcParsed);
				return {
					id: ticker.id,
					pair: pair.length >= 8 ? pair : null,
					usd: parsed
				};
			}
			return {
				id: ticker.id,
				pair: null,
				usd: null
			};
		});
		for (const row of fetched) klineById.set(row.id, row);
	}
	const drafts = universe.map((t) => {
		const usd = t.quotes.USD;
		const btc = t.quotes.BTC;
		const symbol = t.symbol.toUpperCase();
		const pack = klineById.get(t.id);
		const pairCloses = symbol === "BTC" && btcParsed ? btcParsed.closes : pack?.pair ?? [];
		const usdCloses = symbol === "BTC" && btcParsed ? btcParsed.closes : pack?.usd?.closes ?? [];
		const usdVolumes = symbol === "BTC" && btcParsed ? btcParsed.volumes : pack?.usd?.volumes ?? [];
		const rs7d = symbol === "BTC" ? 0 : vsBtc(usd.percent_change_7d || 0, btcUsd.percent_change_7d || 0);
		const rs24h = symbol === "BTC" ? 0 : vsBtc(usd.percent_change_24h || 0, btcUsd.percent_change_24h || 0);
		const rs30Fallback = symbol === "BTC" || usd.percent_change_30d == null || btcUsd.percent_change_30d == null ? null : vsBtc(usd.percent_change_30d, btcUsd.percent_change_30d);
		const origin = pairCloses.slice(-31)[0];
		const window = pairCloses.slice(-31);
		const pairSeries = window.length > 0 && origin ? window.map((v, i) => ({
			t: i,
			v: v / origin * 100
		})) : [];
		const circulating = t.circulating_supply ?? t.total_supply ?? null;
		const maxSupply = t.max_supply && t.max_supply > 0 ? t.max_supply : null;
		const mcFdv = mcFdvRatio(circulating, maxSupply, usd.price, usd.market_cap || 0);
		const meta = lookupMeta(symbol);
		const listedOnBinance = pairCloses.length >= 8 || usdCloses.length >= 8;
		const draft = {
			id: t.id,
			symbol,
			name: t.name,
			rank: t.rank,
			priceUsd: usd.price,
			priceBtc: btc.price,
			marketCap: usd.market_cap || 0,
			volume24h: usd.volume_24h || 0,
			volumeChange24h: usd.volume_24h_change_24h || 0,
			beta: t.beta_value,
			athDrawdownPct: usd.percent_from_price_ath,
			pct1h: usd.percent_change_1h || 0,
			pct6h: usd.percent_change_6h || 0,
			pct12h: usd.percent_change_12h || 0,
			pct24h: usd.percent_change_24h || 0,
			pct7d: usd.percent_change_7d || 0,
			pct30d: usd.percent_change_30d ?? null,
			rs24h,
			rs7d,
			rs14d: null,
			rs30d: rs30Fallback,
			rsi14: null,
			volatility30d: null,
			maxDrawdown30d: null,
			distFrom30dHighPct: null,
			aboveSma: null,
			aboveEma200: null,
			weeklyStructure: null,
			obvRising: null,
			hasBtcPair: listedOnBinance || symbol === "BTC" || symbol === "ETH",
			hasKlines: pairCloses.length >= 8,
			klineDays: Math.max(pairCloses.length, usdCloses.length),
			pairSeries,
			turnover: usd.market_cap ? usd.volume_24h / usd.market_cap : 0,
			circulatingSupply: circulating,
			maxSupply,
			mcFdv,
			narrativeTags: meta.tags,
			narrativeTagsFa: meta.tagsFa,
			accrual: meta.accrual,
			accrualNote: meta.note,
			pairWeekly: null,
			pairSupportBroken: false,
			pairCloses,
			usdCloses,
			usdVolumes
		};
		const enriched = enrichFromKlines(draft);
		if (symbol === "BTC") return {
			...enriched,
			rs7d: 0,
			rs14d: 0,
			rs30d: 0,
			rs24h: 0
		};
		return enriched;
	});
	const klinesOk = drafts.filter((d) => d.hasKlines).length;
	const btcDraft = drafts.find((d) => d.symbol === "BTC");
	const killSwitch = evaluateKillSwitch({
		priceUsd: btcUsd.price,
		closes: btcDraft?.usdCloses ?? []
	});
	let unlockSource = "unavailable";
	let unlockMatched = 0;
	let unlocks = /* @__PURE__ */ new Map();
	try {
		const loaded = await loadUnlockAssessments(drafts.map((d) => d.symbol));
		unlockSource = loaded.source;
		unlocks = loaded.bySymbol;
		unlockMatched = [...unlocks.values()].filter((u) => u.pct30d != null).length;
	} catch {
		unlockSource = "unavailable";
	}
	const { regime, medianRs7, note: regimeNote } = detectRegime(drafts, loaded.dominance);
	const dom = loaded.dominance == null ? {
		bias: "neutral",
		note: msg("دامیننس بیت‌کوین در این منبع نبود و عددی برایش ساخته نشد.", "Bitcoin dominance was missing from this source, so no figure was invented.")
	} : dominanceBiasOf(loaded.dominance, btcPct7d, medianRs7);
	let scored = scoreUniverse(drafts, regime, {
		unlocks,
		kill: killSwitch
	}).sort((a, b) => b.score - a.score);
	let books = [];
	try {
		const targets = [];
		const seen = /* @__PURE__ */ new Set();
		const push = (symbol, smallCap) => {
			if (!symbol || symbol === "BTC" || seen.has(symbol) || targets.length >= 12) return;
			seen.add(symbol);
			targets.push({
				symbol,
				smallCap
			});
		};
		for (const row of scored) {
			if (targets.length >= 6) break;
			push(row.symbol, false);
		}
		for (const row of scored) {
			if (!(row.rank >= 40 || row.marketCap < 2e9) || row.volume24h < 4e6) continue;
			push(row.symbol, true);
		}
		books = await loadTopBooks(targets);
	} catch {
		books = [];
	}
	const bookBy = new Map(books.map((book) => [book.symbol, book]));
	scored = scored.map((row) => applyBookGate(row, bookBy.get(row.symbol))).sort((a, b) => b.score - a.score);
	scored = applyLens(scored, run.horizon, run.cuts).sort((a, b) => b.score - a.score);
	const decision = pickWinner(scored, regime, killSwitch);
	let pick = decision.pick;
	let runnerUp = decision.runnerUp;
	const btcRow = scored.find((row) => row.symbol === "BTC");
	if (!btcRow) throw new Error("داده بیت‌کوین در دسترس نیست");
	if (pick && bookBy.get(pick.symbol)?.gate === "thin" && pick.symbol !== "BTC") {
		runnerUp = pick;
		pick = btcRow;
	}
	const shown = pick ?? btcRow;
	const rejected = books.filter((book) => book.gate === "thin").map((book) => book.symbol);
	const pickBook = bookBy.get(shown.symbol);
	const conf = confidenceOf(shown, runnerUp, shown.hasKlines, klinesOk, drafts.length);
	const explained = explainPick(shown, runnerUp, regime, regimeNote, btcPct7d, {
		klinesOk,
		klinesTried: drafts.length,
		dominanceNote: dom.note
	});
	const reasons = explained.reasons;
	const caution = explained.caution;
	if (!btcParsed) caution.unshift(loaded.source === "CoinPaprika" ? "کندل بایننس در این لحظه در دسترس نبود؛ امتیاز با دادهٔ زندهٔ فهرست (بازده کوتاه‌مدت و MC/FDV) ساخته شد." : `کندل بایننس نبود. فهرست از ${loaded.source} آمد و عددی که در آن منبع نبود ساخته نشد.`);
	else if (!binanceOpen.value) caution.unshift("بخشی از کندل‌ها از کش ذخیره‌شده آمد چون بایننس محدود بود.");
	if (loaded.source !== "CoinPaprika") caution.unshift(`CoinPaprika در دسترس نبود؛ فهرست از ${loaded.source} ساخته شد.`);
	if (loaded.source === "Binance ticker") caution.unshift("تیکر عمومی بایننس بازده ۷ و ۳۰ روزه و دامیننس ندارد؛ آن عددها ساخته نشدند.");
	if (rejected.length) caution.unshift(`دفتر سفارش نازک بود و سیگنال خرید این‌ها معلق شد: ${rejected.join("، ")}.`);
	if (pickBook?.gate === "crowded" || pickBook?.gate === "levered") caution.unshift(pickBook.note);
	if (killSwitch.active) caution.unshift(killSwitch.note);
	if (shown.highDilution) caution.unshift(`${shown.symbol} برچسب High Dilution Risk دارد و ${shown.unlockPenalty} امتیاز از نمره کل کم شده است.`);
	if (unlockSource === "unavailable") caution.push("تقویم آزادسازی الان در دسترس نبود؛ جریمه کلیف اعمال نشد. تحلیل قیمتی همچنان معتبر است.");
	const checklist = buildChecklist(shown, {
		regime,
		btcDominance: loaded.dominance,
		dominanceBias: dom.bias,
		kill: killSwitch,
		book: pickBook
	});
	const portfolio = buildPortfolio(scored, regime, killSwitch);
	const sawBook = books.some((book) => book.slippageBps != null);
	const sawFunding = books.some((book) => book.funding8h != null);
	const sawOi = books.some((book) => book.openInterestUsd != null);
	const health = await cacheHealth();
	const generatedAt = (/* @__PURE__ */ new Date()).toISOString();
	const calendar = sessionCalendar(/* @__PURE__ */ new Date());
	const sessionBuys = calendar.blockSpot ? "suspended" : killSwitch.spotBuys;
	let opportunities = emptyOpportunityBoard(generatedAt, "اسکنر فرصت اجرا نشد؛ رتبه‌بندی فعلی میز دست نخورده است.");
	try {
		const btcBars = btcParsed ? barsOf(btcParsed) : [];
		const inputs = drafts.map((draft) => {
			const parsed = draft.symbol === "BTC" ? btcParsed : klineById.get(draft.id)?.usd ?? null;
			return {
				symbol: draft.symbol,
				name: draft.name,
				rank: draft.rank,
				priceUsd: draft.priceUsd,
				volume24h: draft.volume24h,
				turnover: draft.turnover,
				bars: parsed ? barsOf(parsed) : [],
				btcCloses: btcBars.map((bar) => bar.c)
			};
		});
		opportunities = scanOpportunities(inputs, {
			generatedAt,
			regime,
			spotBuys: sessionBuys
		});
	} catch {
		opportunities = emptyOpportunityBoard(generatedAt, "اسکنر فرصت به خطا خورد و نتیجه آن کنار گذاشته شد. انتخاب اصلی میز همچنان معتبر است.");
	}
	const listing = await listingPromise;
	const listed = listing.ok ? new Set(listing.bases) : null;
	let verdict = buildVerdict({
		ranked: scored,
		regime,
		kill: killSwitch,
		opportunities: opportunities.items,
		listed,
		horizon: run.horizon
	});
	if (calendar.blockSpot) {
		const held = verdict.symbol;
		verdict = {
			kind: "stay",
			symbol: null,
			name: null,
			priceUsd: null,
			reachUsd: null,
			invalidationUsd: null,
			reason: msg(`${calendar.reasonFa}${held ? ` نام برتر مدل ${held} بود و به خاطر تعطیلی صادر نشد.` : ""}`, `${calendar.reasonEn}${held ? ` The model's top name was ${held} and was withheld because of the holiday.` : ""}`)
		};
	}
	if (decision.refused) reasons.splice(0, reasons.length, verdict.reason);
	else if (!reasons.includes(verdict.reason)) reasons.unshift(verdict.reason);
	if (!listing.ok && !verdict.reason.includes("فهرست تأیید نشد")) caution.unshift(msg("فهرست تأیید نشد؛ خرید آلت صادر نمی‌شود.", "The exchange list was not confirmed, so no alt buy is issued."));
	return {
		generatedAt,
		sources: [
			loaded.source,
			...btcParsed ? ["Binance"] : [],
			...sawBook ? ["Order book"] : [],
			...sawFunding ? ["Funding"] : [],
			...sawOi ? ["Open interest"] : [],
			...unlockSource === "coinmarketcap" ? ["CMC Unlocks"] : []
		],
		btcDominance: loaded.dominance,
		btcPriceUsd: btcUsd.price,
		btcPct7d,
		btcPct30d,
		regime,
		regimeNote,
		dominanceBias: dom.bias,
		dominanceNote: dom.note,
		universeSize: scored.length,
		scannedCount: ranked.length,
		klinesOk,
		klinesTried,
		killSwitch,
		spotBuys: sessionBuys,
		unlockSource,
		unlockMatched,
		pick: shown,
		runnerUp,
		viaSeasonRule: decision.viaSeasonRule,
		refused: decision.refused || calendar.blockSpot,
		verdict,
		listingOk: listing.ok,
		horizon: run.horizon,
		venue: run.venue,
		top: scored,
		reasons,
		caution: calendar.blockSpot ? [verdict.reason, ...caution].slice(0, 6) : caution.slice(0, 6),
		confidence: conf.confidence,
		confidenceNote: conf.note,
		checklist,
		portfolio,
		books,
		opportunities,
		dataCache: "live",
		cacheRows: health.rows,
		cacheKlines: health.klines
	};
}
//#endregion
export { runAnalysis };
