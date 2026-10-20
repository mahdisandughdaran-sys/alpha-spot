import { i as msg, s as splitBi } from "./lex-Cs-UGOvC.mjs";
import { t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-DUiljI1y.js
/** Together, satellites stay under one third of capital. Not a fitted weight. */
var SATELLITE_CAP = .32;
/** Fraction of capital risked to the locked invalidation. */
var RISK_FRACTION = .01;
/** Dominance is stored in percentage points (56 means 56%). A quarter point is noise. */
var DOMINANCE_DROP = 1.5;
function isListed(symbol, bases) {
	if (!bases || bases.size === 0) return false;
	const upper = symbol.toUpperCase();
	if (bases.has(upper)) return true;
	return candidateBases(upper).some((base) => bases.has(base));
}
function bookMode(kill) {
	if (kill.status === "SUSPENDED") return "cash";
	const broken = kill.weeklySupportBroken || kill.severeWeekly || kill.weeklyStructure === "bear";
	if (kill.aboveEma200 === true && !broken) return "core";
	return "defend";
}
function dominanceIsFalling(now, prev) {
	if (now == null || prev == null) return false;
	if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
	return now < prev - DOMINANCE_DROP;
}
/** Same-source level now versus ~30 days earlier. A gap or a stale print returns nulls. */
function dominanceLookback(series, atMs, days = 30) {
	if (!series.length || !Number.isFinite(atMs)) return {
		now: null,
		prev: null
	};
	const now = latestAtOrBefore(series, atMs);
	const prev = latestAtOrBefore(series, atMs - days * 864e5);
	if (!now || !prev) return {
		now: null,
		prev: null
	};
	const gapDays = (now.t - prev.t) / 864e5;
	if (gapDays < 20 || gapDays > 45) return {
		now: null,
		prev: null
	};
	if (atMs - now.t > 432e6) return {
		now: null,
		prev: null
	};
	return {
		now: now.v,
		prev: prev.v
	};
}
function latestAtOrBefore(series, atMs) {
	let found = null;
	for (const point of series) {
		if (!Number.isFinite(point.t) || !Number.isFinite(point.v)) continue;
		if (point.t <= atMs) found = point;
		else break;
	}
	return found;
}
function spotVeto(row, listed) {
	if (row.symbol === "BTC") return null;
	if (!(row.volume24h >= 8e6)) return "volume";
	if (!row.hasBtcPair) return "venue";
	if (listed == null || !isListed(row.symbol, listed)) return "venue";
	if (row.mcFdv != null && row.mcFdv < .35) return "float";
	if (row.unlockCliff || row.highDilution) return "unlock";
	return null;
}
function inZone(opp) {
	if (!opp?.zone || !(opp.zone.invalidation > 0)) return false;
	return opp.status === "in-zone" || opp.status === "confirmed" || opp.status === "actionable";
}
function sizeFor(priceUsd, invalidationUsd) {
	if (!(priceUsd > invalidationUsd)) return null;
	const distance = (priceUsd - invalidationUsd) / priceUsd;
	if (!(distance >= .02)) return null;
	return Math.min(SATELLITE_CAP, RISK_FRACTION / distance);
}
/**
* One book. Core is Bitcoin. Cash is only the kill switch.
* A satellite is at most two names and never the book.
*/
function decideBook(input) {
	const btc = input.ranked.find((row) => row.symbol === "BTC");
	const mode = bookMode(input.kill);
	const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
	const btcName = btc?.name ?? "Bitcoin";
	const btcPrice = btc?.priceUsd ?? input.kill.priceUsd ?? null;
	const coreCampaign = (weight, reason) => ({
		symbol: "BTC",
		name: btcName,
		sleeve: "core",
		status: weight > 0 ? "open" : "empty",
		weight,
		entryUsd: weight > 0 ? btcPrice : null,
		invalidationUsd: null,
		reason
	});
	if (mode === "cash" || !btc) {
		const reason = msg("هیچ‌چیز نخر. کلید قطع روشن است: قیمت زیر میانگین ۲۰۰روزه است و ساختار هفتگی شکسته. آلت صفر است و دفتر به تتر می‌رود.", "Buy nothing. The kill switch is on: price is under the 200-day average and weekly structure is broken. Alts are zero and the book is in tether.");
		const cash = {
			symbol: "USDT",
			name: "Tether",
			sleeve: "cash",
			status: "open",
			weight: 1,
			entryUsd: 1,
			invalidationUsd: null,
			reason
		};
		return {
			mode: "cash",
			satelliteEarned: input.satelliteEarned,
			dominanceFalling: falling,
			coreWeight: 0,
			satelliteWeight: 0,
			cashWeight: 1,
			campaigns: [cash, coreCampaign(0, reason)],
			candidate: null,
			verdict: {
				kind: "cash",
				symbol: null,
				name: null,
				priceUsd: btcPrice,
				reachUsd: null,
				invalidationUsd: null,
				reason
			}
		};
	}
	const structural = input.ranked.filter((row) => row.symbol !== "BTC" && spotVeto(row, input.listed) == null).filter((row) => row.aboveSma === true && !row.pairSupportBroken && row.pairWeekly !== "bear").sort((a, b) => b.score - a.score);
	const pool = mode === "core" && falling ? structural.slice(0, 2) : [];
	let reachUsd = null;
	let candidate = null;
	const open = [];
	let used = 0;
	for (const row of pool) {
		const opp = input.opportunities.find((item) => item.symbol === row.symbol);
		const zone = opp?.zone;
		if (!inZone(opp)) {
			if (!candidate) {
				reachUsd = zone && zone.low > 0 ? row.priceUsd > zone.high ? zone.high : zone.low : null;
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: null,
					invalidationUsd: zone?.invalidation ?? null,
					reason: msg(`${row.symbol} چهار دروازهٔ قمر را دارد ولی هنوز در محدوده نیست. هسته دست نمی‌خورد.`, `${row.symbol} has cleared the four satellite gates but is not in the zone. The core stays put.`)
				};
			}
			continue;
		}
		const invalidation = zone?.invalidation ?? null;
		const weight = invalidation != null ? sizeFor(row.priceUsd, invalidation) : null;
		if (weight == null || input.pauseSatellites) {
			if (!candidate) {
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: row.priceUsd,
					invalidationUsd: invalidation,
					reason: input.pauseSatellites ? msg(`${row.symbol} در محدوده است، ولی تقویم امروز قمر تازه باز نمی‌کند. هسته دست نمی‌خورد.`, `${row.symbol} is in the zone, but the calendar does not open a new satellite today. The core stays put.`) : msg(`${row.symbol} در محدوده است، ولی فاصله تا ابطال برای اندازه گرفتن کافی نیست.`, `${row.symbol} is in the zone, but the distance to invalidation is not enough to size a position.`)
				};
				reachUsd = zone ? row.priceUsd > zone.high ? zone.high : zone.low : null;
			}
			continue;
		}
		const room = Math.max(0, SATELLITE_CAP - used);
		const sized = Math.min(weight, room);
		if (!(sized > .01)) continue;
		used += sized;
		const campaign = {
			symbol: row.symbol,
			name: row.name,
			sleeve: "satellite",
			status: "open",
			weight: sized,
			entryUsd: row.priceUsd,
			invalidationUsd: invalidation,
			reason: msg(`${row.symbol} قمر است، نه هسته. ابطال روی ${invalidation?.toFixed(4)} قفل شد. به بازنده اضافه نکن.`, `${row.symbol} is a satellite, not the core. Invalidation is locked at ${invalidation?.toFixed(4)}. Do not add to a loser.`)
		};
		open.push(campaign);
		if (!candidate) candidate = campaign;
	}
	if (!candidate && mode === "core" && !falling) {
		const named = structural[0];
		if (named) candidate = {
			symbol: named.symbol,
			name: named.name,
			sleeve: "satellite",
			status: "empty",
			weight: 0,
			entryUsd: null,
			invalidationUsd: null,
			reason: msg("دامیننس بیت‌کوین در حال افت نیست. میانهٔ ۷روزه برای باز کردن قمر کافی نیست.", "Bitcoin dominance is not falling. A 7-day median is not enough to open a satellite.")
		};
	}
	const coreWeight = 1 - used;
	const holdReason = mode === "defend" ? msg("هسته را نگه دار. یکی از دو شرط روند بیت‌کوین غایب است، ولی کلید قطع روشن نیست. این نقد شدن نیست و RSI داغ هم دلیل خروج نیست.", "Hold the core. One of Bitcoin’s two trend conditions is missing, but the kill switch is off. This is not cash, and a hot RSI is not an exit.") : open.length > 0 ? msg(`هسته بیت‌کوین است (${Math.round(coreWeight * 100)}٪). قمر: ${open.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}٪`).join("، ")}. خروج قمر فقط با ابطال، شکست ساختار هفتگی جفت، یا کلید قطع.`, `The core is Bitcoin (${Math.round(coreWeight * 100)}%). Satellite: ${open.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}%`).join(", ")}. A satellite exits only on invalidation, a weekly pair-structure break, or the kill switch.`) : candidate?.status === "waiting" ? msg(`هسته را نگه دار: بیت‌کوین. ${splitBi(candidate.reason).fa}`, `Hold the core: Bitcoin. ${splitBi(candidate.reason).en ?? splitBi(candidate.reason).fa}`) : msg("هسته را نگه دار: بیت‌کوین. بالای میانگین ۲۰۰روزه و ساختار هفتگی نشکسته. لازم نیست به ناحیهٔ RSI برسد و نزدیکی به سقف دلیل نقد شدن نیست.", "Hold the core: Bitcoin. Price is above the 200-day average and weekly structure is not broken. It does not need an RSI zone, and trading near the high is not a reason to go to cash.");
	const campaigns = [
		coreCampaign(coreWeight, holdReason),
		...open,
		...candidate && candidate.status !== "open" ? [candidate] : []
	];
	const lead = open[0];
	const verdict = lead != null ? {
		kind: "buy",
		symbol: lead.symbol,
		name: lead.name,
		priceUsd: lead.entryUsd,
		reachUsd: null,
		invalidationUsd: lead.invalidationUsd,
		reason: holdReason
	} : {
		kind: candidate?.status === "waiting" ? "wait" : "stay",
		symbol: "BTC",
		name: btcName,
		priceUsd: btcPrice,
		reachUsd,
		invalidationUsd: null,
		reason: holdReason
	};
	return {
		mode,
		satelliteEarned: input.satelliteEarned,
		dominanceFalling: falling,
		coreWeight,
		satelliteWeight: used,
		cashWeight: 0,
		campaigns,
		candidate,
		verdict
	};
}
//#endregion
export { dominanceLookback as a, dominanceIsFalling as i, bookMode as n, decideBook as r, SATELLITE_CAP as t };
