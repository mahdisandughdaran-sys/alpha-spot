import { b as writeCache, f as readCache, n as clamp, p as readCachePrefix, s as evaluateKillSwitch, t as cacheHealth, v as vsBtc } from "./kill-switch-Cnn3GgHf.mjs";
import { a as lookupMeta, c as scoreUniverse, i as enrichFromKlines, n as detectRegime, o as mcFdvRatio, r as emptyUnlock, s as pickWinner, t as assessUnlocks } from "./scoring-DksQ3SdW.mjs";
import { n as isNonSpotCandidate, t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
import { c as explainPick, i as confidenceOf, n as buildChecklist, o as dominanceBiasOf } from "./explain-B7DJSO3j.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/engine.server-C5hhHF0b.js
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
var cache$1 = null;
async function fetchJson$2(url, ms = 8e3) {
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
function num$1(v) {
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
		const json = await fetchJson$2(`${LISTING}?start=${start}&limit=100&sort=next_unlock_date&direction=asc&enableSmallUnlocks=true`, 1e4);
		const data = json && typeof json === "object" && "data" in json ? json.data : null;
		const list = data?.tokenUnlockList;
		if (!Array.isArray(list) || list.length === 0) break;
		if (typeof data?.totalCount === "number") total = data.totalCount;
		for (const raw of list) {
			if (!raw || typeof raw !== "object") continue;
			const row = raw;
			const symbol = typeof row.symbol === "string" ? row.symbol.toUpperCase() : "";
			const cryptoId = num$1(row.cryptoId);
			if (!symbol || cryptoId == null) continue;
			const cmcRank = num$1(row.cmcRank);
			const next = {
				cryptoId,
				symbol,
				maxSupply: num$1(row.maxSupply),
				totalSupply: num$1(row.totalSupply),
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
		const amount = num$1(row.amount);
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
	if (cache$1 && now - cache$1.at < CACHE_MS$1) {
		if (wanted.every((s) => cache$1.bySymbol.has(s))) return {
			source: "coinmarketcap",
			bySymbol: cache$1.bySymbol
		};
	}
	const fresh = await readStoredUnlocks(UNLOCK_FRESH);
	if (fresh && wanted.every((s) => fresh.has(s))) {
		cache$1 = {
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
			cache$1 = {
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
		const json = await fetchJson$2(`${HISTORY}?cryptoId=${row.cryptoId}`, 8e3);
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
	cache$1 = {
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
	const parts = [];
	if (input.openInterestUsd != null && input.openInterestUsd > 0) parts.push(`سود باز $${usdCompact(input.openInterestUsd)}`);
	if (input.oiChange24h != null && Number.isFinite(input.oiChange24h)) {
		const pct = input.oiChange24h * 100;
		const sign = pct > 0 ? "+" : "";
		parts.push(`تغییر ۲۴س ${sign}${pct.toFixed(1)}٪`);
	}
	if (input.longShortRatio != null && Number.isFinite(input.longShortRatio)) parts.push(`لانگ/شورت ${input.longShortRatio.toFixed(2)}`);
	return parts.length ? `${parts.join("، ")}.` : "";
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
		note: deriv ? `دفتر سفارش بایننس برای این نماد پاسخ نداد. ${deriv}` : "دفتر سفارش بایننس برای این نماد پاسخ نداد؛ فیلتر اسلیپیج اعمال نشد."
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
	const tail = deriv ? ` ${deriv}` : "";
	const note = gate === "thin" ? `خرید ${Math.round(notionalUsd).toLocaleString("en-US")} دلار حدود ${slipTxt} لغزش دارد و عمق ۱۰bps برابر $${depthTxt} است. سیگنال خرید معلق شد.${tail}` : gate === "crowded" ? `دفتر سفارش قابل قبول است (${slipTxt}، عمق $${depthTxt}) اما ${fundTxt} — پوزیشن لانگ آتی شلوغ است و حجم اسپات نصف شد.${tail}` : gate === "levered" ? `دفتر اسپات قابل قبول است (${slipTxt}) اما سود باز آلت خرد داغ است و حجم اسپات نصف شد. ${fundTxt}.${tail}` : `اسلیپیج ${slipTxt}، عمق ۱۰bps برابر $${depthTxt}. ${fundTxt}.${tail}`;
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
async function fetchJson$1(url, ms = 7e3) {
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
function num(value) {
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
		fetchJson$1(`${OKX}/api/v5/public/funding-rate?instId=${inst}`, 5e3),
		fetchJson$1(`${OKX}/api/v5/rubik/stat/contracts/open-interest-history?instId=${inst}&period=1H`, 5e3),
		fetchJson$1(`${OKX}/api/v5/rubik/stat/contracts/long-short-account-ratio?ccy=${base}&period=1H`, 5e3)
	]);
	const rows = hist?.data ?? [];
	const nowUsd = num(rows[0]?.[3]);
	const prevUsd = num(rows[23]?.[3] ?? rows[rows.length - 1]?.[3]);
	return {
		funding8h: num(fund?.data?.[0]?.fundingRate),
		openInterestUsd: nowUsd,
		oiChange24h: rows.length > 1 ? oiChange(nowUsd, prevUsd) : null,
		longShortRatio: num(lsr?.data?.[0]?.[1])
	};
}
async function binanceDeriv(base) {
	const symbol = `${base}USDT`;
	const [premium, oi, hist, ratio] = await Promise.all([
		fetchJson$1(`${FAPI}/fapi/v1/premiumIndex?symbol=${symbol}`, 2500),
		fetchJson$1(`${FAPI}/fapi/v1/openInterest?symbol=${symbol}`, 2500),
		fetchJson$1(`${FAPI}/futures/data/openInterestHist?symbol=${symbol}&period=1h&limit=24`, 2500),
		fetchJson$1(`${FAPI}/futures/data/globalLongShortAccountRatio?symbol=${symbol}&period=1h&limit=1`, 2500)
	]);
	const mark = num(premium?.markPrice);
	const contracts = num(oi?.openInterest);
	const nowUsd = mark != null && contracts != null ? contracts * mark : null;
	const oldest = Array.isArray(hist) && hist.length ? num(hist[0]?.sumOpenInterestValue) : null;
	const newest = Array.isArray(hist) && hist.length ? num(hist[hist.length - 1]?.sumOpenInterestValue) : null;
	return {
		funding8h: num(premium?.lastFundingRate),
		openInterestUsd: nowUsd ?? newest,
		oiChange24h: oiChange(newest, oldest),
		longShortRatio: num(ratio?.[0]?.longShortRatio)
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
	const json = await fetchJson$1(`${DEPTH}?symbol=${base}USDT&limit=100`);
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
var PAPRIKA = "https://api.coinpaprika.com/v1";
var BINANCE = "https://data-api.binance.vision/api/v3";
var CACHE_MS = 12e4;
var ANALYSIS_KEY = "analysis:spot:v4";
var ANALYSIS_FRESH = 120;
var ANALYSIS_STALE = 21600;
var KLINE_FRESH = 21600;
var KLINE_STALE = 1209600;
var TARGET_UNIVERSE = 100;
var KLINE_LIMIT = 220;
var cache = null;
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
	const closes = [];
	const volumes = [];
	for (const row of raw) {
		if (!Array.isArray(row)) continue;
		const t = Number(row[0]);
		const c = Number(row[4]);
		const v = Number(row[5]);
		if (!Number.isFinite(t) || !Number.isFinite(c)) continue;
		times.push(t);
		closes.push(c);
		volumes.push(Number.isFinite(v) ? v : 0);
	}
	if (closes.length < 8) return null;
	return {
		times,
		closes,
		volumes
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
async function readStoredAnalysis(maxAgeSec) {
	const raw = await readCache(ANALYSIS_KEY, maxAgeSec);
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (!parsed?.pick?.symbol || !parsed.killSwitch) return null;
		parsed.cacheRows = parsed.cacheRows ?? 0;
		parsed.cacheKlines = parsed.cacheKlines ?? 0;
		return parsed;
	} catch {
		return null;
	}
}
async function runAnalysis() {
	const now = Date.now();
	if (cache && now - cache.at < CACHE_MS) return {
		...cache.value,
		dataCache: "memory"
	};
	const storedFresh = await readStoredAnalysis(ANALYSIS_FRESH);
	if (storedFresh) {
		storedFresh.dataCache = "stored";
		cache = {
			at: now,
			value: storedFresh
		};
		return storedFresh;
	}
	try {
		const result = await computeAnalysis();
		cache = {
			at: Date.now(),
			value: result
		};
		await writeCache(ANALYSIS_KEY, JSON.stringify(result));
		return result;
	} catch (err) {
		const stale = await readStoredAnalysis(ANALYSIS_STALE);
		if (stale) {
			stale.dataCache = "stored";
			stale.caution = ["داده زنده ناقص بود؛ آخرین تحلیل ذخیره‌شده نشان داده می‌شود.", ...stale.caution].slice(0, 6);
			cache = {
				at: Date.now(),
				value: stale
			};
			return stale;
		}
		throw err instanceof Error ? err : /* @__PURE__ */ new Error("تحلیل انجام نشد.");
	}
}
async function computeAnalysis() {
	const [tickers, global] = await Promise.all([fetchJson(`${PAPRIKA}/tickers?quotes=USD,BTC&limit=180`), fetchJson(`${PAPRIKA}/global`)]);
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
	const { regime, medianRs7, note: regimeNote } = detectRegime(drafts, global.bitcoin_dominance_percentage);
	const dom = dominanceBiasOf(global.bitcoin_dominance_percentage, btcPct7d, medianRs7);
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
	let { pick, runnerUp } = pickWinner(scored, regime, killSwitch);
	const rejected = books.filter((book) => book.gate === "thin").map((book) => book.symbol);
	if (bookBy.get(pick.symbol)?.gate === "thin") {
		const btcRow = scored.find((row) => row.symbol === "BTC");
		if (btcRow && pick.symbol !== "BTC") {
			runnerUp = pick;
			pick = btcRow;
		}
	}
	const pickBook = bookBy.get(pick.symbol);
	const conf = confidenceOf(pick, runnerUp, pick.hasKlines, klinesOk, drafts.length);
	const { reasons, caution } = explainPick(pick, runnerUp, regime, regimeNote, btcPct7d, {
		klinesOk,
		klinesTried: drafts.length,
		dominanceNote: dom.note
	});
	if (!btcParsed) caution.unshift("کندل بایننس در این لحظه در دسترس نبود؛ امتیاز با دادهٔ زنده پاپریکا (بازده کوتاه‌مدت و MC/FDV) ساخته شد.");
	else if (!binanceOpen.value) caution.unshift("بخشی از کندل‌ها از کش ذخیره‌شده آمد چون بایننس محدود بود.");
	if (rejected.length) caution.unshift(`دفتر سفارش نازک بود و سیگنال خرید این‌ها معلق شد: ${rejected.join("، ")}.`);
	if (pickBook?.gate === "crowded" || pickBook?.gate === "levered") caution.unshift(pickBook.note);
	if (killSwitch.active) caution.unshift(killSwitch.note);
	if (pick.highDilution) caution.unshift(`${pick.symbol} برچسب High Dilution Risk دارد و ${pick.unlockPenalty} امتیاز از نمره کل کم شده است.`);
	if (unlockSource === "unavailable") caution.push("تقویم آزادسازی الان در دسترس نبود؛ جریمه کلیف اعمال نشد. تحلیل قیمتی همچنان معتبر است.");
	const checklist = buildChecklist(pick, {
		regime,
		btcDominance: global.bitcoin_dominance_percentage,
		dominanceBias: dom.bias,
		kill: killSwitch,
		book: pickBook
	});
	const portfolio = buildPortfolio(scored, regime, killSwitch);
	const sawBook = books.some((book) => book.slippageBps != null);
	const sawFunding = books.some((book) => book.funding8h != null);
	const sawOi = books.some((book) => book.openInterestUsd != null);
	const health = await cacheHealth();
	return {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		sources: [
			"CoinPaprika",
			...btcParsed ? ["Binance"] : [],
			...sawBook ? ["Order book"] : [],
			...sawFunding ? ["Funding"] : [],
			...sawOi ? ["Open interest"] : [],
			...unlockSource === "coinmarketcap" ? ["CMC Unlocks"] : []
		],
		btcDominance: global.bitcoin_dominance_percentage,
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
		spotBuys: killSwitch.spotBuys,
		unlockSource,
		unlockMatched,
		pick,
		runnerUp,
		top: scored,
		reasons,
		caution: caution.slice(0, 6),
		confidence: conf.confidence,
		confidenceNote: conf.note,
		checklist,
		portfolio,
		books,
		dataCache: "live",
		cacheRows: health.rows,
		cacheKlines: health.klines
	};
}
//#endregion
export { runAnalysis };
