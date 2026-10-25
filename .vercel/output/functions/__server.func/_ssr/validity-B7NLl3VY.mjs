import { i as msg } from "./lex-BMsOT1Y7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validity-B7NLl3VY.js
var HORIZON_ORDER = [
	"day",
	"week",
	"month"
];
var VALID_MS = {
	day: 864e5,
	week: 6048e5,
	month: 2592e6
};
var LOCK_KEY = "alpha-spot-call-lock-v1";
function validUntilFrom(issuedAt, horizon) {
	const t = Date.parse(issuedAt);
	return new Date((Number.isFinite(t) ? t : Date.now()) + VALID_MS[horizon]).toISOString();
}
function callFromVerdict(verdict, horizon, issuedAt) {
	const positioned = verdict.kind !== "cash" && verdict.symbol != null;
	return {
		horizon,
		kind: verdict.kind,
		symbol: positioned ? verdict.symbol : null,
		name: positioned ? verdict.name : null,
		priceUsd: positioned ? verdict.priceUsd : null,
		invalidationUsd: verdict.kind === "buy" ? verdict.invalidationUsd : null,
		reason: verdict.reason,
		issuedAt,
		validUntil: validUntilFrom(issuedAt, horizon),
		held: false,
		dissent: null
	};
}
function verdictFromCall(call) {
	return {
		kind: call.kind,
		symbol: call.symbol,
		name: call.name,
		priceUsd: call.priceUsd,
		reachUsd: null,
		invalidationUsd: call.invalidationUsd,
		reason: call.reason,
		horizon: call.horizon,
		validUntil: call.validUntil
	};
}
/** A published satellite campaign does not flip because the score moved. The structural book does. */
function reconcileCall(stored, fresh, nowMs, livePrice) {
	if (!stored || stored.horizon !== fresh.horizon) return fresh;
	const until = Date.parse(stored.validUntil);
	const open = Number.isFinite(until) && nowMs < until;
	if (fresh.kind === "cash") return {
		...fresh,
		held: false,
		dissent: null
	};
	if (open && stored.kind === "buy" && stored.symbol && stored.symbol !== "BTC" && stored.invalidationUsd != null && livePrice != null && livePrice > 0 && livePrice < stored.invalidationUsd) return {
		...fresh,
		kind: "stay",
		symbol: "BTC",
		name: "Bitcoin",
		priceUsd: fresh.symbol === "BTC" ? fresh.priceUsd : stored.priceUsd,
		invalidationUsd: stored.invalidationUsd,
		reason: msg("کمپین آلت باطل شد چون قیمت از حد ابطال پایین‌تر رفت. هسته بیت‌کوین می‌ماند. این «هیچ‌چیز نخر» نیست.", "The alt campaign died because price crossed under invalidation. The Bitcoin core stays. This is not “buy nothing”."),
		held: false,
		dissent: null
	};
	if (open && stored.kind === "buy" && stored.symbol && stored.symbol !== "BTC") {
		if (fresh.kind === "buy" && fresh.symbol === stored.symbol) return {
			...stored,
			priceUsd: fresh.priceUsd ?? stored.priceUsd,
			held: true,
			dissent: null
		};
		return {
			...stored,
			held: true,
			dissent: msg("امتیاز یا نام پیشنهادی جابه‌جا شد، ولی کمپین باز تا ابطال، شکست ساختار هفتگی، یا کلید قطع عوض نمی‌شود.", "The score or the suggested name moved, but the open campaign does not change until invalidation, a weekly structure break, or the kill switch.")
		};
	}
	return {
		...fresh,
		held: false,
		dissent: null
	};
}
function canStore() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function readLocks() {
	if (!canStore()) return {};
	try {
		const raw = localStorage.getItem(LOCK_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function writeLocks(store) {
	if (!canStore()) return;
	try {
		localStorage.setItem(LOCK_KEY, JSON.stringify(store));
	} catch {}
}
function lockCalls(venue, fresh, prices, nowMs = Date.now()) {
	const store = readLocks();
	const prev = store[venue] ?? [];
	const next = fresh.map((call) => {
		const stored = prev.find((item) => item.horizon === call.horizon) ?? null;
		return reconcileCall(stored, call, nowMs, stored?.symbol ? prices[stored.symbol] ?? null : null);
	});
	store[venue] = next;
	writeLocks(store);
	return next;
}
/** Keep week and month calls from flipping every time the desk is run again. */
function sealAnalysis(data, venue, nowMs = Date.now()) {
	if (!data.calls?.length) return data;
	const prices = {};
	for (const row of data.top) prices[row.symbol] = row.priceUsd;
	if (data.btcPriceUsd > 0) prices.BTC = data.btcPriceUsd;
	const calls = lockCalls(venue, data.calls, prices, nowMs);
	const focus = calls.find((call) => call.horizon === data.horizon) ?? calls[0];
	if (!focus) return {
		...data,
		calls
	};
	return {
		...data,
		calls,
		verdict: verdictFromCall(focus)
	};
}
//#endregion
export { verdictFromCall as a, sealAnalysis as i, VALID_MS as n, callFromVerdict as r, HORIZON_ORDER as t };
