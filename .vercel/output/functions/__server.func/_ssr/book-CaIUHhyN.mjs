import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { g as weeklyFromDaily } from "./math-B3CMdRol.mjs";
import { t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
import { c as stanceFromWeights, i as cycleMode, n as SATELLITE_CAP, o as explainCycle, s as planCycle, t as RISK_FRACTION } from "./planner-B2iE6X4J.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-CaIUHhyN.js
/** Dominance is stored in percentage points (56 means 56%). A quarter point is noise. */
var DOMINANCE_DROP = 1.5;
function isListed(symbol, bases) {
	if (!bases || bases.size === 0) return false;
	const upper = symbol.toUpperCase();
	if (bases.has(upper)) return true;
	return candidateBases(upper).some((base) => bases.has(base));
}
function bookMode(kill) {
	return cycleMode(kill);
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
/** Support of the pair, expressed as a USD invalidation under the last price. */
function campaignInvalidation(pairCloses, priceUsd) {
	if (!(priceUsd > 0)) return null;
	const weekly = weeklyFromDaily(pairCloses);
	if (weekly.length < 8) return null;
	const last = weekly[weekly.length - 1];
	const prior = weekly.slice(-9, -1);
	if (last == null || !(last > 0) || prior.length < 4) return null;
	const support = Math.min(...prior);
	if (!(support > 0) || support >= last) return null;
	const distance = 1 - support / last;
	if (!(distance >= .02) || distance > .45) return null;
	return {
		invalidationUsd: priceUsd * (support / last),
		distance
	};
}
function inZone(opp) {
	if (!opp?.zone || !(opp.zone.invalidation > 0)) return false;
	return opp.status === "in-zone" || opp.status === "confirmed" || opp.status === "actionable";
}
/** One percent of capital divided by the stop distance. The cap is applied to the sleeve, not here. */
function riskWeight(priceUsd, invalidationUsd) {
	if (!(priceUsd > invalidationUsd)) return null;
	const distance = (priceUsd - invalidationUsd) / priceUsd;
	if (!(distance >= .02)) return null;
	return RISK_FRACTION / distance;
}
/**
* Weekly support of the raw BTC pair. The 30-day index and a fixed 12% fallback
* are not a stop. Fewer than 56 daily closes cannot build eight weekly bars.
*/
function structuralStop(pairCloses, priceUsd) {
	const closes = (pairCloses ?? []).filter((value) => value > 0);
	if (closes.length < 56) return null;
	return campaignInvalidation(closes, priceUsd);
}
function medianAltRs7(ranked) {
	const values = ranked.filter((row) => row.symbol !== "BTC" && Number.isFinite(row.rs7d)).map((row) => row.rs7d).sort((a, b) => a - b);
	if (!values.length) return null;
	return values[Math.floor(values.length / 2)] ?? null;
}
/**
* Cycle book. Cash in a broken Bitcoin trend, Bitcoin when alts are not
* leading, and one or two liquid alts only while Bitcoin's trend is healthy.
*/
function decideBook(input) {
	const btc = input.ranked.find((row) => row.symbol === "BTC");
	const mode = bookMode(input.kill);
	const falling = dominanceIsFalling(input.dominance, input.dominancePrev);
	const btcName = btc?.name ?? "Bitcoin";
	const btcPrice = btc?.priceUsd ?? input.kill.priceUsd ?? null;
	const intent = planCycle({
		kill: input.kill,
		regime: input.regime ?? "neutral",
		dominance: input.dominance,
		dominancePrev: input.dominancePrev,
		medianRs7: medianAltRs7(input.ranked)
	});
	const pack = (weights) => {
		const stance = stanceFromWeights(weights.cash, weights.btc, weights.alt);
		const copy = explainCycle({
			phase: intent.phase,
			stance,
			cash: weights.cash,
			btc: weights.btc,
			alt: weights.alt,
			names: weights.names,
			kind: weights.verdict.kind
		});
		const plan = {
			phase: intent.phase,
			stance,
			cash: weights.cash,
			btc: weights.btc,
			alt: weights.alt,
			names: weights.names,
			...copy
		};
		return {
			mode,
			plan,
			satelliteEarned: input.satelliteEarned,
			dominanceFalling: falling,
			coreWeight: weights.btc,
			satelliteWeight: weights.alt,
			cashWeight: weights.cash,
			campaigns: weights.campaigns,
			candidate: weights.candidate,
			verdict: {
				...weights.verdict,
				reason: plan.why
			}
		};
	};
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
		const reason = msg("هیچ‌چیز نخر. روند بیت‌کوین شکسته و دفتر در تتر است. آلت صفر است.", "Buy nothing. Bitcoin’s trend is broken and the book is in tether. Alts are zero.");
		return pack({
			cash: 1,
			btc: 0,
			alt: 0,
			names: [],
			campaigns: [{
				symbol: "USDT",
				name: "Tether",
				sleeve: "cash",
				status: "open",
				weight: 1,
				entryUsd: 1,
				invalidationUsd: null,
				reason
			}, coreCampaign(0, reason)],
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
		});
	}
	if (mode === "defend") {
		const reason = msg("بیت‌کوین بماند، قمر بسته. فقط یک ستون خراب است. هسته ۱۰۰٪ بیت‌کوین می‌ماند و نصف نمی‌شود. قمر تازه باز نمی‌شود.", "Bitcoin stays, satellite closed. Only one pillar is broken. The core stays 100% Bitcoin and is not cut in half. No new satellite opens.");
		return pack({
			cash: 0,
			btc: 1,
			alt: 0,
			names: [],
			campaigns: [coreCampaign(1, reason)],
			candidate: null,
			verdict: {
				kind: "hold",
				symbol: "BTC",
				name: btcName,
				priceUsd: btcPrice,
				reachUsd: null,
				invalidationUsd: null,
				reason
			}
		});
	}
	const structural = input.ranked.filter((row) => row.symbol !== "BTC" && spotVeto(row, input.listed) == null).filter((row) => row.aboveSma === true && !row.pairSupportBroken && row.pairWeekly !== "bear").sort((a, b) => b.score - a.score);
	const pool = intent.phase === "early-alt" || intent.phase === "alt-season" ? structural.slice(0, Math.max(intent.maxNames, 1)) : [];
	let reachUsd = null;
	let candidate = null;
	const ready = [];
	for (const row of pool) {
		const opp = input.opportunities.find((item) => item.symbol === row.symbol);
		const zone = opp?.zone;
		const inside = inZone(opp);
		const structured = structuralStop(row.pairCloses, row.priceUsd);
		if (input.pauseSatellites || !inside || !structured) {
			if (!candidate) {
				reachUsd = zone && zone.low > 0 ? row.priceUsd > zone.high ? zone.high : zone.low : null;
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: inside ? row.priceUsd : null,
					invalidationUsd: structured?.invalidationUsd ?? null,
					reason: input.pauseSatellites ? msg(`${row.symbol} آماده است، ولی تقویم امروز آلت تازه باز نمی‌کند. تا آن وقت دفتر بیت‌کوین می‌ماند.`, `${row.symbol} is ready, but the calendar does not open a new alt today. Until then the book stays in Bitcoin.`) : !inside ? msg(`${row.symbol} دروازهٔ ساختاری را دارد ولی هنوز در محدودهٔ تأییدشده نیست. تا ورود، دفتر بیت‌کوین می‌ماند.`, `${row.symbol} has cleared the structural gate but is not in a confirmed zone yet. Until the entry, the book stays in Bitcoin.`) : msg(`${row.symbol} در محدوده است، ولی حمایت هفتگی جفت از کلوز خام قابل‌اندازه‌گیری نیست. پوزیشن باز نمی‌شود.`, `${row.symbol} is in the zone, but weekly pair support cannot be measured from the raw closes. The position does not open.`)
				};
			}
			continue;
		}
		const risk = riskWeight(row.priceUsd, structured.invalidationUsd);
		if (risk == null) {
			if (!candidate) {
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: row.priceUsd,
					invalidationUsd: structured.invalidationUsd,
					reason: msg(`${row.symbol} در بازی است، ولی فاصله تا ابطال برای یک کمپین کافی نیست.`, `${row.symbol} is in play, but the distance to invalidation is not enough for a campaign.`)
				};
				reachUsd = zone ? row.priceUsd > zone.high ? zone.high : zone.low : null;
			}
			continue;
		}
		ready.push({
			row,
			invalidation: structured.invalidationUsd,
			risk
		});
	}
	let room = Math.min(SATELLITE_CAP, Math.max(0, intent.altBudget));
	const open = [];
	for (const item of ready) {
		const weight = Math.min(room, item.risk);
		if (!(weight > .01)) continue;
		room -= weight;
		const campaign = {
			symbol: item.row.symbol,
			name: item.row.name,
			sleeve: "satellite",
			status: "open",
			weight,
			entryUsd: item.row.priceUsd,
			invalidationUsd: item.invalidation,
			reason: msg(`${item.row.symbol} آستین آلت است، نه تمام دفتر. وزن ${(weight * 100).toFixed(1)}٪ یعنی یک درصد ریسک تا ابطال ${item.invalidation.toFixed(4)}. به بازنده اضافه نکن.`, `${item.row.symbol} is an alt sleeve, not the whole book. A weight of ${(weight * 100).toFixed(1)}% is one percent of risk to invalidation ${item.invalidation.toFixed(4)}. Do not add to a loser.`)
		};
		open.push(campaign);
		if (!candidate) candidate = campaign;
	}
	const used = open.reduce((sum, row) => sum + row.weight, 0);
	const cashWeight = 0;
	const coreWeight = Math.max(0, 1 - used);
	const reason = msg("دفتر چرخه ساخته شد.", "The cycle book was built.");
	const campaigns = [
		coreCampaign(coreWeight, reason),
		...[],
		...open,
		...candidate && candidate.status !== "open" ? [candidate] : []
	];
	const lead = open[0];
	const verdict = lead ? {
		kind: "buy",
		symbol: lead.symbol,
		name: lead.name,
		priceUsd: lead.entryUsd,
		reachUsd: null,
		invalidationUsd: lead.invalidationUsd,
		reason
	} : {
		kind: candidate?.status === "waiting" ? "wait" : "stay",
		symbol: "BTC",
		name: btcName,
		priceUsd: btcPrice,
		reachUsd,
		invalidationUsd: null,
		reason
	};
	return pack({
		cash: cashWeight,
		btc: coreWeight,
		alt: used,
		names: open.map((row) => ({
			symbol: row.symbol,
			name: row.name,
			weight: row.weight
		})),
		campaigns,
		candidate,
		verdict
	});
}
//#endregion
export { dominanceLookback as i, decideBook as n, dominanceIsFalling as r, bookMode as t };
