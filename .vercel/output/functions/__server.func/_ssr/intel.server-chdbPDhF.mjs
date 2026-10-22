import { a as exchangeNetflow, c as nuplFromMvrv, d as returnOver, f as scoreCoin, l as nuplZone, m as whaleThreshold, n as altSeasonIndex, o as flowBiasOf, p as soprProxy, r as bookHeat, s as mvrvZone, t as altSeasonCopy, u as onchainScore } from "./intel-math-DPHS_7yU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/intel.server-chdbPDhF.js
var VISION = "https://data-api.binance.vision/api/v3";
var CM = "https://community-api.coinmetrics.io/v4/timeseries/asset-metrics";
var PAPRIKA = "https://api.coinpaprika.com/v1/global";
var FNG = "https://api.alternative.me/fng/?limit=1";
var CHAINS = "https://api.llama.fi/v2/chains";
var GECKO = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=80&page=1&sparkline=false";
var TTL_MS = 9e4;
var UNIVERSE = [
	{
		symbol: "BTC",
		nameEn: "Bitcoin",
		nameFa: "بیت‌کوین",
		pair: "BTCUSDT",
		repo: "bitcoin/bitcoin",
		chain: "Bitcoin"
	},
	{
		symbol: "ETH",
		nameEn: "Ethereum",
		nameFa: "اتریوم",
		pair: "ETHUSDT",
		repo: "ethereum/go-ethereum",
		chain: "Ethereum"
	},
	{
		symbol: "SOL",
		nameEn: "Solana",
		nameFa: "سولانا",
		pair: "SOLUSDT",
		repo: "anza-xyz/agave",
		chain: "Solana"
	},
	{
		symbol: "BNB",
		nameEn: "BNB",
		nameFa: "بی‌ان‌بی",
		pair: "BNBUSDT",
		repo: "bnb-chain/bsc",
		chain: "BSC"
	},
	{
		symbol: "XRP",
		nameEn: "XRP",
		nameFa: "ریپل",
		pair: "XRPUSDT",
		repo: "XRPLF/rippled",
		chain: null
	},
	{
		symbol: "ADA",
		nameEn: "Cardano",
		nameFa: "کاردانو",
		pair: "ADAUSDT",
		repo: "IntersectMBO/cardano-node",
		chain: "Cardano"
	},
	{
		symbol: "DOGE",
		nameEn: "Dogecoin",
		nameFa: "دوج‌کوین",
		pair: "DOGEUSDT",
		repo: "dogecoin/dogecoin",
		chain: "Dogecoin"
	},
	{
		symbol: "AVAX",
		nameEn: "Avalanche",
		nameFa: "آوالانچ",
		pair: "AVAXUSDT",
		repo: "ava-labs/avalanchego",
		chain: "Avalanche"
	},
	{
		symbol: "LINK",
		nameEn: "Chainlink",
		nameFa: "چین‌لینک",
		pair: "LINKUSDT",
		repo: "smartcontractkit/chainlink",
		chain: null
	},
	{
		symbol: "TON",
		nameEn: "Toncoin",
		nameFa: "تون",
		pair: "TONUSDT",
		repo: "ton-blockchain/ton",
		chain: "TON"
	},
	{
		symbol: "SUI",
		nameEn: "Sui",
		nameFa: "سویی",
		pair: "SUIUSDT",
		repo: "MystenLabs/sui",
		chain: "Sui"
	},
	{
		symbol: "NEAR",
		nameEn: "NEAR",
		nameFa: "نیر",
		pair: "NEARUSDT",
		repo: "near/nearcore",
		chain: "Near"
	},
	{
		symbol: "DOT",
		nameEn: "Polkadot",
		nameFa: "پولکادات",
		pair: "DOTUSDT",
		repo: "paritytech/polkadot-sdk",
		chain: "Polkadot"
	},
	{
		symbol: "ATOM",
		nameEn: "Cosmos",
		nameFa: "کازموس",
		pair: "ATOMUSDT",
		repo: "cosmos/gaia",
		chain: null
	},
	{
		symbol: "APT",
		nameEn: "Aptos",
		nameFa: "اپتوس",
		pair: "APTUSDT",
		repo: "aptos-labs/aptos-core",
		chain: "Aptos"
	},
	{
		symbol: "INJ",
		nameEn: "Injective",
		nameFa: "اینجکتیو",
		pair: "INJUSDT",
		repo: "InjectiveLabs/injective-core",
		chain: "Injective"
	}
];
var WHALE_SYMBOLS = /* @__PURE__ */ new Set([
	"BTC",
	"ETH",
	"SOL",
	"BNB",
	"XRP",
	"LINK"
]);
var memory = null;
async function fetchJson(url, ms = 12e3, headers) {
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		const res = await fetch(url, {
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/2",
				...headers
			}
		});
		if (!res.ok) throw new Error(String(res.status));
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
async function pool(items, size, fn) {
	const out = new Array(items.length);
	let cursor = 0;
	async function worker() {
		while (cursor < items.length) {
			const index = cursor;
			cursor += 1;
			const item = items[index];
			if (item === void 0) return;
			out[index] = await fn(item);
		}
	}
	await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => worker()));
	return out;
}
async function loadOnchain() {
	const empty = {
		mvrv: null,
		flowIn7d: null,
		flowOut7d: null,
		soprMeasured: null
	};
	try {
		const rows = (await fetchJson(`${CM}?assets=btc&metrics=CapMVRVCur,FlowInExUSD,FlowOutExUSD&frequency=1d&page_size=8`, 14e3)).data ?? [];
		if (!rows.length) return empty;
		const last = rows[rows.length - 1];
		const mvrv = num(last?.CapMVRVCur);
		const week = rows.slice(-7);
		return {
			mvrv,
			flowIn7d: sum(week.map((row) => num(row.FlowInExUSD))),
			flowOut7d: sum(week.map((row) => num(row.FlowOutExUSD))),
			soprMeasured: null
		};
	} catch {
		return empty;
	}
}
function num(value) {
	if (value == null || value === "") return null;
	const n = Number(value);
	return Number.isFinite(n) ? n : null;
}
function sum(values) {
	const ok = values.filter((v) => v != null);
	if (!ok.length) return null;
	return ok.reduce((a, b) => a + b, 0);
}
async function loadKlines(pair) {
	return (await fetchJson(`${VISION}/klines?symbol=${pair}&interval=1d&limit=240`, 12e3)).map((row) => ({
		t: row[0],
		o: Number(row[1]),
		h: Number(row[2]),
		l: Number(row[3]),
		c: Number(row[4]),
		v: Number(row[5]),
		tb: Number(row[9])
	}));
}
async function loadDepth(pair) {
	try {
		const body = await fetchJson(`${VISION}/depth?symbol=${pair}&limit=500`, 1e4);
		return {
			bids: body.bids.map(([p, q]) => [Number(p), Number(q)]),
			asks: body.asks.map(([p, q]) => [Number(p), Number(q)])
		};
	} catch {
		return null;
	}
}
async function loadWhales(symbol, pair) {
	const floor = whaleThreshold(symbol);
	const minuteFloor = symbol === "BTC" ? 4e6 : symbol === "ETH" ? 15e5 : symbol === "SOL" || symbol === "BNB" ? 7e5 : 28e4;
	const [trades, minutes] = await Promise.all([fetchJson(`${VISION}/aggTrades?symbol=${pair}&limit=1000`, 1e4).catch(() => []), fetchJson(`${VISION}/klines?symbol=${pair}&interval=1m&limit=180`, 1e4).catch(() => [])]);
	const prints = [];
	for (const row of trades) {
		const price = Number(row.p);
		const usd = price * Number(row.q);
		if (!(usd >= floor)) continue;
		prints.push({
			symbol,
			side: row.m ? "sell" : "buy",
			usd,
			price,
			time: row.T,
			kind: "print"
		});
	}
	let net = 0;
	let gross = 0;
	for (const row of minutes) {
		const quote = Number(row[7]);
		const taker = Number(row[10]);
		if (!(quote > 0)) continue;
		net += 2 * taker - quote;
		gross += quote;
		if (quote < minuteFloor) continue;
		const share = taker / quote;
		if (share < .58 && share > .42) continue;
		prints.push({
			symbol,
			side: share >= .58 ? "buy" : "sell",
			usd: quote,
			price: Number(row[4]),
			time: row[0],
			kind: "minute"
		});
	}
	prints.sort((a, b) => b.usd - a.usd);
	return {
		prints: prints.slice(0, 6),
		net,
		gross
	};
}
async function loadFundamentals() {
	const fdv = /* @__PURE__ */ new Map();
	const tvl = /* @__PURE__ */ new Map();
	const github = /* @__PURE__ */ new Map();
	const [gecko, chains, global, fear] = await Promise.all([
		fetchJson(GECKO, 12e3).catch(() => []),
		fetchJson(CHAINS, 12e3).catch(() => []),
		fetchJson(PAPRIKA, 1e4).catch(() => ({})),
		fetchJson(FNG, 8e3).catch(() => ({}))
	]);
	for (const row of gecko) {
		const symbol = row.symbol?.toUpperCase();
		const cap = row.market_cap ?? 0;
		const diluted = row.fully_diluted_valuation ?? 0;
		if (!symbol || !(cap > 0) || !(diluted > 0)) continue;
		fdv.set(symbol, Math.min(1.5, cap / diluted));
	}
	const byName = new Map(chains.map((chain) => [String(chain.name ?? "").toLowerCase(), chain.tvl ?? 0]));
	for (const coin of UNIVERSE) {
		if (!coin.chain) continue;
		const value = byName.get(coin.chain.toLowerCase());
		if (value != null && value > 0) tvl.set(coin.symbol, value);
	}
	const since = (/* @__PURE__ */ new Date(Date.now() - 12096e5)).toISOString();
	await pool(UNIVERSE.filter((coin) => coin.repo && [
		"BTC",
		"ETH",
		"SOL",
		"AVAX",
		"SUI",
		"NEAR",
		"APT",
		"LINK"
	].includes(coin.symbol)), 4, async (coin) => {
		if (!coin.repo) return;
		try {
			const commits = await fetchJson(`https://api.github.com/repos/${coin.repo}/commits?per_page=30&since=${encodeURIComponent(since)}`, 4500, { Accept: "application/vnd.github+json" });
			if (Array.isArray(commits)) github.set(coin.symbol, commits.length);
		} catch {}
	});
	const fearValue = Number(fear.data?.[0]?.value);
	return {
		fdv,
		tvl,
		github,
		dominance: typeof global.bitcoin_dominance_percentage === "number" ? global.bitcoin_dominance_percentage : null,
		fear: Number.isFinite(fearValue) ? fearValue : null
	};
}
function marketCopy(input) {
	const zone = input.mvrv == null ? "رژیم آن‌چین بیت‌کوین همین حالا خوانده نشد" : input.mvrv < 1 ? "بیت‌کوین در ناحیه ارزش تاریخی است" : input.mvrv < 2 ? "بیت‌کوین در ناحیه انباشت قابل دفاع است، نه در سقف چرخه" : input.mvrv < 3.2 ? "بیت‌کوین گرم شده؛ خرید اسپات باید پله‌ای و دور از تعقیب باشد" : "بیت‌کوین در ناحیه سرخوشی تاریخی است؛ انباشت تازه را کوچک کن";
	const zoneEn = input.mvrv == null ? "Bitcoin’s on-chain regime did not load" : input.mvrv < 1 ? "Bitcoin is in a historical value zone" : input.mvrv < 2 ? "Bitcoin is in a defensible accumulation zone, not a cycle top" : input.mvrv < 3.2 ? "Bitcoin is warm; spot buys should be staged, not chased" : "Bitcoin is in historical euphoria; keep new accumulation small";
	const flow = input.bias === "outflow" ? "در هفت روز اخیر خروج از صرافی بیشتر از ورود بوده؛ این با نگهداری اسپات جور است." : input.bias === "inflow" ? "در هفت روز اخیر ورود به صرافی بیشتر بوده؛ فشار فروش آن‌چین را جدی بگیر." : input.bias === "flat" ? "جریان هفت‌روزه صرافی تقریباً خنثی است." : "جریان صرافی در این نوبت نیامد.";
	const flowEn = input.bias === "outflow" ? "Over the last seven days, more coin left exchanges than entered; that fits holding spot." : input.bias === "inflow" ? "Over the last seven days, more coin entered exchanges; respect that on-chain sell pressure." : input.bias === "flat" ? "Seven-day exchange flow is roughly flat." : "Exchange flow did not arrive this pass.";
	const fearFa = input.fear == null ? "" : input.fear >= 80 ? " شاخص ترس و طمع داغ است." : input.fear <= 25 ? " شاخص ترس و طمع در ترس است." : "";
	const fearEn = input.fear == null ? "" : input.fear >= 80 ? " The fear and greed index is hot." : input.fear <= 25 ? " The fear and greed index is in fear." : "";
	const nupl = input.nupl == null ? "" : ` NUPL ${input.nupl.toFixed(2)}.`;
	return {
		fa: `${zone}. ${flow}${fearFa}${nupl} ${input.altFa}`,
		en: `${zoneEn}. ${flowEn}${fearEn}${nupl} ${input.altEn}`
	};
}
async function buildSpotIntel() {
	if (memory && Date.now() - memory.at < TTL_MS) return memory.value;
	const [onchain, fundamentals, books] = await Promise.all([
		loadOnchain(),
		loadFundamentals(),
		pool(UNIVERSE, 6, async (coin) => {
			try {
				const [candles, depth, whales] = await Promise.all([
					loadKlines(coin.pair),
					loadDepth(coin.pair),
					WHALE_SYMBOLS.has(coin.symbol) ? loadWhales(coin.symbol, coin.pair) : Promise.resolve({
						prints: [],
						net: 0,
						gross: 0
					})
				]);
				return {
					coin,
					candles,
					depth,
					whales,
					error: null
				};
			} catch (error) {
				return {
					coin,
					candles: [],
					depth: null,
					whales: {
						prints: [],
						net: 0,
						gross: 0
					},
					error: error instanceof Error ? error.message : "fail"
				};
			}
		})
	]);
	const btcCandles = books.find((row) => row.coin.symbol === "BTC")?.candles ?? [];
	const btcRet30 = returnOver(btcCandles, 30);
	const nupl = onchain.mvrv == null ? null : nuplFromMvrv(onchain.mvrv);
	const bias = flowBiasOf(onchain.flowIn7d, onchain.flowOut7d);
	const chainScore = onchainScore(onchain.mvrv, nupl, onchain.flowIn7d, onchain.flowOut7d);
	const returns = books.map((row) => ({
		symbol: row.coin.symbol,
		ret30: returnOver(row.candles, 30)
	}));
	const season = altSeasonIndex(returns, btcRet30);
	const seasonCopy = altSeasonCopy(season);
	const market = {
		onchainScore: chainScore,
		mvrv: onchain.mvrv,
		nupl,
		flowBias: bias,
		altSeason: season,
		fearGreed: fundamentals.fear
	};
	const coins = [];
	const whales = [];
	let failed = 0;
	for (const row of books) {
		whales.push(...row.whales.prints);
		const math = scoreCoin({
			symbol: row.coin.symbol,
			candles: row.candles,
			mcFdv: fundamentals.fdv.get(row.coin.symbol) ?? null,
			tvlUsd: fundamentals.tvl.get(row.coin.symbol) ?? null,
			githubCommits14d: fundamentals.github.get(row.coin.symbol) ?? null,
			whaleNetUsd: row.whales.net,
			whaleGrossUsd: row.whales.gross,
			btcRet30,
			market
		});
		if (!math) {
			failed += 1;
			continue;
		}
		const heat = row.depth ? bookHeat(row.depth.bids, row.depth.asks) : null;
		coins.push({
			...math,
			symbol: row.coin.symbol,
			nameFa: row.coin.nameFa,
			nameEn: row.coin.nameEn,
			mcFdv: fundamentals.fdv.get(row.coin.symbol) ?? null,
			tvlUsd: fundamentals.tvl.get(row.coin.symbol) ?? null,
			githubCommits14d: fundamentals.github.get(row.coin.symbol) ?? null,
			whaleNetUsd: row.whales.net,
			heat: heat?.bins ?? [],
			heatMid: heat?.mid ?? null
		});
	}
	coins.sort((a, b) => b.score - a.score);
	whales.sort((a, b) => b.usd - a.usd);
	const top = coins[0];
	const btc = coins.find((row) => row.symbol === "BTC") ?? top;
	let lead = top;
	if (btc && top && top.symbol !== "BTC" && season <= 30 && top.score < btc.score + 3.5) lead = btc;
	if (!lead) throw new Error("رادار اسپات به دفتر بازار وصل نشد. چند لحظه بعد دوباره تلاش کن.");
	const stance = lead.action === "accumulate" ? {
		fa: "انباشت پله‌ای",
		en: "staged accumulation"
	} : lead.action === "watch" ? {
		fa: "پایش، نه خرید فوری",
		en: "watch, not an immediate buy"
	} : {
		fa: "اجتناب",
		en: "avoid"
	};
	const leadFa = `حکم رادار: ${lead.nameFa} (${lead.symbol}) — ${stance.fa}. امتیاز ${lead.score.toFixed(0)} از ۱۰۰.`;
	const leadEn = `Radar call: ${lead.nameEn} (${lead.symbol}) — ${stance.en}. Score ${lead.score.toFixed(0)} out of 100.`;
	if (!coins.length) throw new Error("رادار اسپات به دفتر بازار وصل نشد. چند لحظه بعد دوباره تلاش کن.");
	const note = marketCopy({
		mvrv: onchain.mvrv,
		nupl,
		bias,
		altFa: seasonCopy.fa,
		altEn: seasonCopy.en,
		fear: fundamentals.fear
	});
	const value = {
		generatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		sources: [
			"CoinMetrics Community",
			"Binance Vision",
			"CoinGecko",
			"DefiLlama",
			"CoinPaprika",
			"Alternative.me",
			"GitHub"
		],
		mvrv: onchain.mvrv,
		mvrvZone: mvrvZone(onchain.mvrv),
		nupl,
		nuplZone: nuplZone(nupl),
		flowIn7d: onchain.flowIn7d,
		flowOut7d: onchain.flowOut7d,
		netflow7d: onchain.flowIn7d != null && onchain.flowOut7d != null ? exchangeNetflow(onchain.flowIn7d, onchain.flowOut7d) : null,
		flowBias: bias,
		soprProxy: soprProxy(btcCandles),
		soprMeasured: onchain.soprMeasured,
		fearGreed: fundamentals.fear,
		dominance: fundamentals.dominance,
		altSeason: season,
		altSeasonFa: seasonCopy.fa,
		altSeasonEn: seasonCopy.en,
		marketFa: note.fa,
		marketEn: note.en,
		coins,
		whales: whales.slice(0, 12),
		leadSymbol: lead.symbol,
		leadFa,
		leadEn,
		partial: failed ? `${failed}` : null
	};
	memory = {
		at: Date.now(),
		value
	};
	return value;
}
//#endregion
export { buildSpotIntel };
