import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { g as weeklyFromDaily } from "./math-B3CMdRol.mjs";
import { t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book-BCrdaOpc.js
/** Dominance is in percentage points. A move inside this band is noise. */
var DOMINANCE_DROP$1 = 1.5;
function dominanceIsFalling$1(now, prev) {
	if (now == null || prev == null) return false;
	if (!Number.isFinite(now) || !Number.isFinite(prev)) return false;
	return now < prev - DOMINANCE_DROP$1;
}
function riskPhase(kill) {
	if (kill.status === "SUSPENDED") return "crash";
	if (kill.weeklyMomentum != null && kill.weeklyMomentum <= -.18) return "crash";
	if (kill.weeklyStructure === "bear" && kill.aboveEma200 === false) return "crash";
	if (kill.aboveEma200 == null && kill.weeklyStructure == null && kill.status === "NORMAL") return "trend";
	if (kill.status === "HIGH_RISK" || kill.severeWeekly || kill.weeklyStructure === "bear" || kill.aboveEma200 === false) return "defend";
	return "trend";
}
/** Book mode used by exits. Alt season stays "core": Bitcoin's trend is intact. */
function cycleMode(kill) {
	const phase = riskPhase(kill);
	if (phase === "crash") return "cash";
	if (phase === "defend") return "defend";
	return "core";
}
function planCycle(input) {
	const risk = riskPhase(input.kill);
	if (risk === "crash") return {
		phase: "crash",
		cash: 1,
		btc: 0,
		altBudget: 0,
		maxNames: 0
	};
	if (risk === "defend") return {
		phase: "defend",
		cash: .6,
		btc: .4,
		altBudget: 0,
		maxNames: 0
	};
	const falling = dominanceIsFalling$1(input.dominance, input.dominancePrev);
	const median = input.medianRs7;
	const weeklyBull = input.kill.weeklyStructure === "bull";
	const broad = input.regime === "alt" && median != null && median > .04;
	const leaders = falling && (input.regime === "alt" || median != null && median > .025);
	if (weeklyBull && (leaders || broad && falling)) return {
		phase: "alt-season",
		cash: .08,
		btc: .28,
		altBudget: .64,
		maxNames: 2
	};
	if (falling || input.regime === "alt") return {
		phase: "early-alt",
		cash: .1,
		btc: .62,
		altBudget: .28,
		maxNames: 1
	};
	return {
		phase: "btc",
		cash: 0,
		btc: 1,
		altBudget: 0,
		maxNames: 0
	};
}
function stanceFromWeights(cash, btc, alt) {
	if (alt >= .2) return "alt";
	if (cash >= .5 && cash >= btc && cash >= alt) return "cash";
	return "btc";
}
function explainCycle(input) {
	const pct = (n) => `${Math.round(n * 100)}`;
	const names = input.names.filter((row) => row.weight > 0).map((row) => `${row.symbol} ${pct(row.weight)}٪`).join("، ");
	const namesEn = input.names.filter((row) => row.weight > 0).map((row) => `${row.symbol} ${pct(row.weight)}%`).join(", ");
	if (input.phase === "crash") return {
		headline: msg("نقد بمان", "Stay in cash"),
		why: msg("روند بیت‌کوین شکسته است: یا زیر میانگین ۲۰۰روزه با ساختار هفتگی نزولی، یا افت چهارهفته‌ای عمیق، یا هر دو ستون کلید قطع. آلت در این رژیم سخت‌تر از بیت‌کوین می‌ریزد. تمام دفتر تتر است تا آن سقوط تجربه نشود.", "Bitcoin’s trend is broken: under the 200-day average with a bearish weekly structure, a deep four-week drop, or both kill-switch pillars. Alts fall harder than Bitcoin here. The whole book is tether so that drawdown is not held."),
		flip: msg("برگشت به بیت‌کوین فقط وقتی قیمت دوباره بالای میانگین ۲۰۰روزه باشد و ساختار هفتگی دیگر نزولی نباشد.", "Bitcoin comes back only after price is back above the 200-day average and weekly structure is no longer bearish.")
	};
	if (input.phase === "defend") return {
		headline: msg("نقد بمان", "Stay in cash"),
		why: msg(`یکی از ستون‌های روند بیت‌کوین خراب است، ولی هنوز شکست کامل نیست. ${pct(input.cash)}٪ نقد می‌ماند و ${pct(input.btc)}٪ فقط دیده‌بان بیت‌کوین است. آلت در این حالت بسته است، چون رالی آلت وسط روند خراب بیت‌کوین دوام نمی‌آورد.`, `One of Bitcoin’s trend pillars is broken, but the break is not complete. ${pct(input.cash)}% stays in cash and ${pct(input.btc)}% is only a Bitcoin scout. Alts stay shut, because an alt rally does not last through a damaged Bitcoin trend.`),
		flip: msg("اگر ستون دوم هم بشکند، دیده‌بان هم به نقد می‌رود. اگر هر دو ستون سالم شوند، دفتر به بیت‌کوین برمی‌گردد.", "If the second pillar breaks, the scout goes to cash too. If both pillars heal, the book returns to Bitcoin.")
	};
	if (input.stance === "alt" && input.names.length > 0) {
		const season = input.phase === "alt-season";
		return {
			headline: msg("آلت بخر", "Buy the alt"),
			why: msg(season ? `روند بیت‌کوین سالم است و آلت‌ها جلوترند. وزن اصلی روی لیدرهای نقدشونده است تا صعود بلند گرفته شود، نه روی تمام بازار: ${names}. ${pct(input.btc)}٪ بیت‌کوین لنگر می‌ماند و ${pct(input.cash)}٪ نقد است تا ته آلت‌سیزن دفتر را صفر نکند.` : `چرخش شروع شده ولی هنوز فصل کامل نیست. یک لیدر، نه یک سبد شلوغ: ${names}. بقیه ${pct(input.btc)}٪ بیت‌کوین و ${pct(input.cash)}٪ نقد است.`, season ? `Bitcoin’s trend is healthy and alts are leading. The main weight sits on liquid leaders so the long rally is held, not on the whole market: ${namesEn}. ${pct(input.btc)}% Bitcoin stays as the anchor and ${pct(input.cash)}% is cash so the end of alt season does not zero the book.` : `Rotation has started but it is not a full season yet. One leader, not a crowded basket: ${namesEn}. The rest is ${pct(input.btc)}% Bitcoin and ${pct(input.cash)}% cash.`),
			flip: msg("خروج آلت با ابطال همان نام، شکست ساختار هفتگی جفت، یا خراب شدن روند بیت‌کوین. خاموش شدن یک‌هفته‌ای دامیننس به‌تنهایی دلیل فروش نیست.", "An alt exits on that name’s invalidation, a weekly pair-structure break, or Bitcoin’s trend breaking. Dominance cooling for a single week is not, by itself, a sale.")
		};
	}
	if (input.phase === "early-alt" || input.phase === "alt-season") return {
		headline: msg("بیت‌کوین بخر", "Buy Bitcoin"),
		why: msg("علامت چرخش هست، ولی هنوز هیچ آلتی هم دروازهٔ ساختاری را رد کرده و هم جای ورود دارد. تا آن نام پیدا شود دفتر بیت‌کوین می‌ماند، نه یک آلت تصادفی.", "The rotation sign is on, but no alt has both cleared the structural gate and reached an entry. Until that name shows up the book stays in Bitcoin, not a random alt."),
		flip: msg("با قرار گرفتن لیدر داخل محدوده، یا در فصل کامل با ساختار سالم جفت، بخشی از بیت‌کوین به همان آلت می‌رود.", "When a leader trades inside its zone — or, in a full season, holds a healthy pair structure — part of the Bitcoin sleeve moves into that alt.")
	};
	return {
		headline: msg("بیت‌کوین بخر", "Buy Bitcoin"),
		why: msg("روند بیت‌کوین سالم است و آلت‌ها هنوز رهبری نمی‌کنند. خریدن آلت اینجا یعنی جا ماندن از خود بیت‌کوین و خوردن ریزش عمیق‌تر آلت. تمام دفتر بیت‌کوین است.", "Bitcoin’s trend is healthy and alts are not leading yet. Buying an alt here means lagging Bitcoin and taking the deeper alt drawdown. The whole book is Bitcoin."),
		flip: msg("اگر دامیننس حدود سی‌روزه بیفتد و میانهٔ آلت‌ها جلو بیفتد، وزن به یک یا دو لیدر می‌رود. اگر ساختار هفتگی نزولی شود یا قیمت میانگین ۲۰۰روزه را از دست بدهد، دفتر به نقد برمی‌گردد.", "If dominance falls over about thirty days and the median alt takes the lead, weight moves into one or two leaders. If weekly structure turns bearish or price loses the 200-day average, the book goes back to cash.")
	};
}
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
function sizeFor(priceUsd, invalidationUsd) {
	if (!(priceUsd > invalidationUsd)) return null;
	const distance = (priceUsd - invalidationUsd) / priceUsd;
	if (!(distance >= .02)) return null;
	return Math.min(SATELLITE_CAP, RISK_FRACTION / distance);
}
function medianAltRs7(ranked) {
	const values = ranked.filter((row) => row.symbol !== "BTC" && Number.isFinite(row.rs7d)).map((row) => row.rs7d).sort((a, b) => a - b);
	if (!values.length) return null;
	return values[Math.floor(values.length / 2)] ?? null;
}
function trendStop(row) {
	if (!(row.priceUsd > 0)) return null;
	const structured = campaignInvalidation((row.pairSeries ?? []).map((point) => point.v).filter((value) => value > 0), row.priceUsd);
	if (structured) return structured.invalidationUsd;
	return row.priceUsd * .88;
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
			names: weights.names
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
		const reason = msg("دفتر کوتاه شد. بیشتر سرمایه نقد می‌ماند و فقط دیده‌بان بیت‌کوین سر جایش است. آلت باز نمی‌شود.", "The book is cut back. Most of the capital stays in cash and only a Bitcoin scout remains. No alt opens.");
		const cashWeight = intent.cash;
		const coreWeight = intent.btc;
		return pack({
			cash: cashWeight,
			btc: coreWeight,
			alt: 0,
			names: [],
			campaigns: [{
				symbol: "USDT",
				name: "Tether",
				sleeve: "cash",
				status: "open",
				weight: cashWeight,
				entryUsd: 1,
				invalidationUsd: null,
				reason
			}, coreCampaign(coreWeight, reason)],
			candidate: null,
			verdict: {
				kind: "stay",
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
	const altPhase = intent.phase === "early-alt" || intent.phase === "alt-season";
	const trend = intent.phase === "alt-season";
	const pool = altPhase ? structural.slice(0, Math.max(intent.maxNames, 1)) : [];
	let reachUsd = null;
	let candidate = null;
	const ready = [];
	for (const row of pool) {
		const opp = input.opportunities.find((item) => item.symbol === row.symbol);
		const zone = opp?.zone;
		const inside = inZone(opp);
		if (input.pauseSatellites || !inside && !trend) {
			if (!candidate) {
				reachUsd = zone && zone.low > 0 ? row.priceUsd > zone.high ? zone.high : zone.low : null;
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: inside ? row.priceUsd : null,
					invalidationUsd: zone?.invalidation ?? null,
					reason: input.pauseSatellites ? msg(`${row.symbol} آماده است، ولی تقویم امروز آلت تازه باز نمی‌کند. تا آن وقت دفتر بیت‌کوین می‌ماند.`, `${row.symbol} is ready, but the calendar does not open a new alt today. Until then the book stays in Bitcoin.`) : msg(`${row.symbol} دروازهٔ ساختاری را دارد ولی هنوز در محدوده نیست. تا ورود، دفتر بیت‌کوین می‌ماند.`, `${row.symbol} has cleared the structural gate but is not in the zone yet. Until the entry, the book stays in Bitcoin.`)
				};
			}
			continue;
		}
		const invalidation = inside && zone?.invalidation ? zone.invalidation : trendStop(row);
		if (invalidation == null || sizeFor(row.priceUsd, invalidation) == null) {
			if (!candidate) {
				candidate = {
					symbol: row.symbol,
					name: row.name,
					sleeve: "satellite",
					status: "waiting",
					weight: 0,
					entryUsd: row.priceUsd,
					invalidationUsd: invalidation,
					reason: msg(`${row.symbol} در بازی است، ولی فاصله تا ابطال برای یک کمپین کافی نیست.`, `${row.symbol} is in play, but the distance to invalidation is not enough for a campaign.`)
				};
				reachUsd = zone ? row.priceUsd > zone.high ? zone.high : zone.low : null;
			}
			continue;
		}
		ready.push({
			row,
			invalidation
		});
	}
	const count = ready.length;
	const each = count > 0 ? Math.min(SATELLITE_CAP, intent.altBudget / count) : 0;
	const open = [];
	for (const item of ready) {
		if (!(each > .01)) continue;
		const campaign = {
			symbol: item.row.symbol,
			name: item.row.name,
			sleeve: "satellite",
			status: "open",
			weight: each,
			entryUsd: item.row.priceUsd,
			invalidationUsd: item.invalidation,
			reason: msg(`${item.row.symbol} آستین آلت است، نه تمام دفتر. ابطال روی ${item.invalidation.toFixed(4)} قفل شد. به بازنده اضافه نکن.`, `${item.row.symbol} is an alt sleeve, not the whole book. Invalidation is locked at ${item.invalidation.toFixed(4)}. Do not add to a loser.`)
		};
		open.push(campaign);
		if (!candidate) candidate = campaign;
	}
	const used = open.reduce((sum, row) => sum + row.weight, 0);
	const cashWeight = used > 0 ? intent.cash : 0;
	const coreWeight = Math.max(0, 1 - used - cashWeight);
	const reason = msg("دفتر چرخه ساخته شد.", "The cycle book was built.");
	const campaigns = [
		coreCampaign(coreWeight, reason),
		...cashWeight > 0 ? [{
			symbol: "USDT",
			name: "Tether",
			sleeve: "cash",
			status: "open",
			weight: cashWeight,
			entryUsd: 1,
			invalidationUsd: null,
			reason
		}] : [],
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
export { dominanceLookback as a, dominanceIsFalling as i, bookMode as n, decideBook as r, SATELLITE_CAP as t };
