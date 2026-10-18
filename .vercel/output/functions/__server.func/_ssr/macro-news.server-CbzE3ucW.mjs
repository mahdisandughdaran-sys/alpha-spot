import { i as msg } from "./lex-BmeYOjQo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/macro-news.server-CbzE3ucW.js
var FEEDS = [
	"https://www.coindesk.com/arc/outboundfeeds/rss/",
	"https://cointelegraph.com/rss",
	"https://decrypt.co/feed"
];
var cache = null;
var TTL = 9e5;
var FRESH_MS = 12096e5;
var NOISE = /\b(price prediction|price forecast|could reach|might reach|you won.?t believe|top \d+|best crypto to buy|how to buy|airdrop|sponsored|presale|100x|memecoin to)\b/i;
var CRYPTO = /\b(bitcoin|btc|ethereum|ether|eth|crypto|cryptocurrency|xrp|solana|stablecoin|usdt|usdc|tether|etf|blockchain|defi|binance|coinbase|kraken|sec|cftc|token|altcoin)\b/i;
function decode(value) {
	return value.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;|'/g, "'").replace(/\s+/g, " ").trim();
}
function grab(xml, tag) {
	const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
	return match ? decode(match[1]) : "";
}
function linkOf(chunk) {
	const href = chunk.match(/<link[^>]+href=["'](https:[^"']+)["']/i);
	if (href) return href[1];
	const plain = grab(chunk, "link") || grab(chunk, "guid");
	return plain.startsWith("https://") ? plain : "";
}
function tagFor(title) {
	const text = title.toLowerCase();
	if (/hack|exploit|stolen|breach|drained|outage/.test(text)) return {
		fa: "امنیت",
		en: "Security"
	};
	if (/etf|sec\b|cftc|regulat|lawsuit|approval|ban\b/.test(text)) return {
		fa: "قانون",
		en: "Policy"
	};
	if (/ethereum|\beth\b/.test(text) && !/\bbitcoin\b|\bbtc\b/.test(text)) return {
		fa: "اتریوم",
		en: "ETH"
	};
	if (/\bbitcoin\b|\bbtc\b/.test(text) && !/ethereum|\beth\b/.test(text)) return {
		fa: "بیت‌کوین",
		en: "BTC"
	};
	if (/ethereum|\beth\b|\bbitcoin\b|\bbtc\b/.test(text)) return {
		fa: "بازار",
		en: "Market"
	};
	if (/fed\b|fomc|rate cut|rate hike|inflation/.test(text)) return {
		fa: "کلان",
		en: "Macro"
	};
	return {
		fa: "کریپتو",
		en: "Crypto"
	};
}
function importance(title, summary) {
	const text = `${title} ${summary}`;
	if (NOISE.test(text) || !CRYPTO.test(text)) return 0;
	const lower = text.toLowerCase();
	let score = 1;
	if (/\b(bitcoin|btc|ethereum|ether)\b|\beth\b/.test(lower)) score += 3;
	if (/\b(etf|sec|cftc|regulat|lawsuit|blackrock|approval|ban)\b/.test(lower)) score += 4;
	if (/\b(hack|exploit|stolen|breach|drained|bankrupt|halt|outage)\b/.test(lower)) score += 4;
	if (/\b(liquidat|billion|all-time|record|crash|stablecoin|usdt|usdc|tether)\b/.test(lower)) score += 2;
	if (/\b(fomc|federal reserve|rate cut|rate hike|inflation)\b/.test(lower)) score += 2;
	if (/\b(binance|coinbase|kraken|microstrategy|treasury|etf)\b/.test(lower)) score += 1;
	return score;
}
function parseFeed(xml) {
	return xml.split(/<item\b/i).slice(1).map((chunk) => {
		const title = grab(chunk, "title");
		const link = linkOf(chunk);
		const publishedAt = grab(chunk, "pubDate") || grab(chunk, "published") || grab(chunk, "updated");
		const summary = grab(chunk, "description").slice(0, 240);
		const tag = tagFor(`${title} ${summary}`);
		return {
			title,
			link,
			publishedAt,
			summary,
			tagFa: tag.fa,
			tagEn: tag.en,
			score: importance(title, summary)
		};
	}).filter((item) => item.title && item.link.startsWith("https://") && item.score > 0);
}
async function loadMacroNews() {
	if (cache && Date.now() - cache.at < TTL) return cache.value;
	const collected = [];
	let failed = 0;
	for (const url of FEEDS) try {
		const response = await fetch(url, {
			headers: { Accept: "application/rss+xml, application/xml, text/xml, */*" },
			signal: AbortSignal.timeout(12e3)
		});
		if (!response.ok) {
			failed += 1;
			continue;
		}
		collected.push(...parseFeed(await response.text()));
	} catch {
		failed += 1;
	}
	const now = Date.now();
	const seen = /* @__PURE__ */ new Set();
	const ranked = collected.filter((item) => {
		const key = item.title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
		if (!key || seen.has(key) || seen.has(item.link)) return false;
		const at = Date.parse(item.publishedAt);
		if (Number.isFinite(at) && now - at > FRESH_MS) return false;
		seen.add(key);
		seen.add(item.link);
		return true;
	}).sort((a, b) => b.score - a.score || Date.parse(b.publishedAt) - Date.parse(a.publishedAt));
	const important = ranked.filter((item) => item.score >= 4);
	const picked = (important.length >= 4 ? important : ranked.filter((item) => item.score >= 3)).slice(0, 10);
	const value = {
		items: picked.map(({ score: _score, ...item }) => item),
		source: "CoinDesk · Cointelegraph · Decrypt",
		note: picked.length > 0 ? null : failed === FEEDS.length ? msg("فید اخبار کریپتو الان جواب نداد.", "The crypto news feed did not answer.") : msg("خبر مهم تازه‌ای در فیدهای کریپتو نبود.", "No fresh important crypto headline was in the feeds.")
	};
	cache = {
		at: Date.now(),
		value
	};
	return value;
}
//#endregion
export { loadMacroNews };
