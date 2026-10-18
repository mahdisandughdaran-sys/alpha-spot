import { i as msg } from "./lex-C7bdiIgA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/validity-azgosvoe.js
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
	const buy = verdict.kind === "buy" && verdict.symbol != null;
	return {
		horizon,
		kind: buy ? "buy" : "cash",
		symbol: buy ? verdict.symbol : null,
		name: buy ? verdict.name : null,
		priceUsd: buy ? verdict.priceUsd : null,
		invalidationUsd: verdict.invalidationUsd,
		reason: verdict.reason,
		issuedAt,
		validUntil: validUntilFrom(issuedAt, horizon),
		held: false,
		dissent: null
	};
}
function verdictFromCall(call) {
	const buy = call.kind === "buy" && call.symbol != null;
	return {
		kind: buy ? "buy" : "cash",
		symbol: buy ? call.symbol : null,
		name: buy ? call.name : null,
		priceUsd: buy ? call.priceUsd : null,
		reachUsd: null,
		invalidationUsd: call.invalidationUsd,
		reason: call.reason,
		horizon: call.horizon,
		validUntil: call.validUntil
	};
}
function cashCall(horizon, issuedAt, reason) {
	return {
		horizon,
		kind: "cash",
		symbol: null,
		name: null,
		priceUsd: null,
		invalidationUsd: null,
		reason,
		issuedAt,
		validUntil: validUntilFrom(issuedAt, horizon),
		held: false,
		dissent: null
	};
}
function sameOrder(a, b) {
	return a.kind === b.kind && a.symbol === b.symbol;
}
/** A published call does not flip until it expires, unless a buy is invalidated. */
function reconcileCall(stored, fresh, nowMs, livePrice) {
	if (!stored || stored.horizon !== fresh.horizon) return fresh;
	const until = Date.parse(stored.validUntil);
	if (!Number.isFinite(until) || nowMs >= until) return fresh;
	if (stored.kind === "buy" && stored.invalidationUsd != null && livePrice != null && livePrice > 0 && livePrice < stored.invalidationUsd) return {
		...fresh,
		kind: "cash",
		symbol: null,
		name: null,
		priceUsd: null,
		invalidationUsd: stored.invalidationUsd,
		reason: msg("هیچ ارزی نخر. حکم قبلی باطل شد چون قیمت از حد ابطال پایین‌تر رفت.", "Do not buy any coin. The earlier call died because price crossed under invalidation."),
		held: false,
		dissent: null
	};
	if (sameOrder(stored, fresh)) return {
		...stored,
		priceUsd: fresh.kind === "buy" ? fresh.priceUsd ?? stored.priceUsd : stored.priceUsd,
		held: true,
		dissent: null
	};
	const dissent = fresh.kind === "buy" && fresh.symbol ? msg(`تحلیل لحظه‌ای الان ${fresh.symbol} را می‌گوید، ولی این حکم تا پایان اعتبار عوض نمی‌شود.`, `The live tape now names ${fresh.symbol}, but this call does not change before it expires.`) : msg("تحلیل لحظه‌ای الان جور دیگری می‌گوید، ولی این حکم تا پایان اعتبار عوض نمی‌شود.", "The live tape now disagrees, but this call does not change before it expires.");
	return {
		...stored,
		held: true,
		dissent
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
export { sealAnalysis as a, cashCall as i, VALID_MS as n, verdictFromCall as o, callFromVerdict as r, HORIZON_ORDER as t };
