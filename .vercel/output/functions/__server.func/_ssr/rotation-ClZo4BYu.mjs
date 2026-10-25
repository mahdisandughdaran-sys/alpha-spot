import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { n as bookMode } from "./book-BCrdaOpc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rotation-ClZo4BYu.js
/** The only ways a satellite campaign ends. A closed dominance gate is not one of them. */
function campaignExit(input) {
	if (bookMode(input.kill) === "cash") return "kill";
	if (input.invalidationUsd != null && input.priceUsd != null && input.priceUsd > 0 && input.priceUsd <= input.invalidationUsd) return "invalidation";
	if (input.pairSupportBroken) return "structure";
	return null;
}
function findCoin(coins, symbol) {
	const key = symbol.toUpperCase();
	return coins.find((c) => c.symbol === key);
}
function sentence(fa, en) {
	return msg(fa, en);
}
function advisePosition(holding, coins, kill) {
	const symbol = holding.symbol.toUpperCase();
	const coin = findCoin(coins, symbol);
	const btc = findCoin(coins, "BTC");
	const entry = holding.entryUsd;
	const price = coin?.priceUsd ?? null;
	const pnlPct = coin && entry > 0 ? coin.priceUsd / entry - 1 : null;
	const size = Math.max(holding.sizeUsd, 0);
	const mode = bookMode(kill);
	const underwater = pnlPct != null && pnlPct < 0;
	const base = {
		symbol,
		name: coin?.name ?? symbol,
		score: coin?.score ?? null,
		priceUsd: price,
		pnlPct,
		pairSupportBroken: Boolean(coin && coin.symbol !== "BTC" && coin.pairSupportBroken),
		pairWeekly: coin?.pairWeekly ?? null,
		highDilution: coin?.highDilution ?? false
	};
	const hold = (reason, suggested = size) => ({
		...base,
		action: "HOLD",
		reason,
		targetSymbol: null,
		targetName: null,
		suggestedSizeUsd: underwater ? Math.min(suggested, size) : suggested
	});
	const exitTo = (action, reason, dest) => ({
		...base,
		action,
		reason,
		targetSymbol: dest?.symbol ?? null,
		targetName: dest?.name ?? null,
		suggestedSizeUsd: 0
	});
	if (!coin && symbol !== "USDT") return hold(sentence("این نماد در صد ارز اول اسکن‌شده نیست. بدون داده، به بازنده اضافه نمی‌شود و به خاطر امتیاز هم فروخته نمی‌شود.", "This ticker is not in the top 100 scanned. Without data it is not averaged down, and it is not sold because of a score."));
	const exit = campaignExit({
		kill,
		priceUsd: price,
		invalidationUsd: holding.invalidationUsd ?? null,
		pairSupportBroken: Boolean(coin && coin.symbol !== "BTC" && coin.pairSupportBroken)
	});
	if (exit === "kill") return exitTo("SELL", sentence("کلید قطع روشن است. کمپین بسته می‌شود و مقصد تتر است، نه آلت بعدی.", "The kill switch is on. The campaign closes and the destination is tether, not the next alt."), null);
	if (symbol === "BTC") return hold(sentence("بیت‌کوین هسته است. افت امتیاز یا RSI داغ دلیل فروش نیست. خروج فقط با کلید قطع.", "Bitcoin is the core. A lower score or a hot RSI is not a sale. The exit is only the kill switch."));
	if (exit === "invalidation" || exit === "structure") {
		const why = exit === "invalidation" ? sentence("قیمت به ابطالِ قفل‌شده در روز ورود رسید. به بازنده اضافه نکن.", "Price hit the invalidation locked on the entry day. Do not add to the loser.") : sentence("ساختار هفتگی جفت با بیت‌کوین شکست. این خروج است، نه چرخش به آلتی که امروز امتیازش بالاتر است.", "Weekly structure of the Bitcoin pair broke. This is an exit, not a rotation into whichever alt scores higher today.");
		if (mode === "core" && btc) return exitTo("REBALANCE", why, {
			symbol: btc.symbol,
			name: btc.name
		});
		return exitTo("SELL", why, null);
	}
	return hold(sentence("کمپین باز است. جابه‌جایی امتیاز فردا دلیل فروش نیست و حجم روی ضرر بیشتر نمی‌شود.", "The campaign is open. Tomorrow’s score moving is not a sale, and size does not increase on a loss."));
}
function buildRebalancePlan(holdings, coins, kill) {
	const rows = holdings.map((h) => advisePosition(h, coins, kill));
	const bucket = /* @__PURE__ */ new Map();
	let rotateUsd = 0;
	let holdUsd = 0;
	let sellUsd = 0;
	for (const row of rows) {
		const size = holdings.find((h) => h.symbol.toUpperCase() === row.symbol)?.sizeUsd ?? 0;
		if (row.action === "HOLD") {
			holdUsd += size;
			continue;
		}
		if (row.action === "SELL" || !row.targetSymbol) {
			sellUsd += size;
			continue;
		}
		rotateUsd += size;
		const prev = bucket.get(row.targetSymbol);
		const coin = findCoin(coins, row.targetSymbol);
		if (prev) prev.usd += size;
		else bucket.set(row.targetSymbol, {
			symbol: row.targetSymbol,
			name: row.targetName ?? row.targetSymbol,
			score: coin?.score ?? 0,
			usd: size,
			reason: sentence("برگشت به هسته بعد از ابطال کمپین. مقصد، آلتِ رتبهٔ بعد نیست.", "Back to the core after the campaign was invalidated. The destination is not the next-ranked alt.")
		});
	}
	const destinations = [...bucket.values()].sort((a, b) => b.usd - a.usd);
	const mode = bookMode(kill);
	let note = sentence("پایش همین مرورگر است و سفارش نمی‌فرستد. خروج فقط با ابطال قفل‌شده، شکست ساختار هفتگی جفت، یا کلید قطع.", "This watch lives in this browser and sends no order. An exit happens only on the locked invalidation, a weekly pair-structure break, or the kill switch.");
	if (mode === "cash") note = sentence("کلید قطع روشن است. آلت و بیت‌کوین هر دو به تتر پیشنهاد می‌شوند.", "The kill switch is on. Both alts and Bitcoin are flagged for tether.");
	else if (rotateUsd > 0) note = sentence("کمپینِ باطل‌شده به هستهٔ بیت‌کوین برمی‌گردد. امتیاز پایین‌تر چرخش نمی‌سازد.", "An invalidated campaign returns to the Bitcoin core. A lower score does not rotate the book.");
	return {
		rows,
		destinations,
		rotateUsd,
		holdUsd,
		sellUsd,
		note
	};
}
/** An alt has to beat Bitcoin by this much over the lookback before it counts. */
var ROTATION_MARGIN = .05;
var DAY = 864e5;
var RECENT_FROM = Date.UTC(2023, 0, 1);
/**
* Bitcoin flat or down → tether.
* Bitcoin rising, and at least two liquid alts ahead by the margin → the leader.
* Bitcoin rising alone → Bitcoin.
*/
function rotationTarget(input) {
	const btcName = input.names.get("BTC") ?? "Bitcoin";
	if (input.btcReturn == null || !(input.btcReturn > 0)) return {
		sleeve: "cash",
		symbol: null,
		name: null
	};
	const ahead = input.alts.filter((row) => row.return30 > (input.btcReturn ?? 0) + ROTATION_MARGIN).sort((a, b) => b.return30 - a.return30);
	if (ahead.length >= 2) {
		const lead = ahead[0];
		return {
			sleeve: "alt",
			symbol: lead.symbol,
			name: input.names.get(lead.symbol) ?? lead.symbol
		};
	}
	return {
		sleeve: "btc",
		symbol: "BTC",
		name: btcName
	};
}
function sameBook(a, b) {
	return a.sleeve === b.sleeve && a.symbol === b.symbol;
}
function bookWeights(book) {
	if (book.sleeve === "cash" || !book.symbol) return /* @__PURE__ */ new Map([["USDT", 1]]);
	return /* @__PURE__ */ new Map([[book.symbol, 1]]);
}
function rotationReason(input) {
	const btcPct = input.btcReturn == null ? "—" : signedPct(input.btcReturn);
	if (input.book.sleeve === "cash") return msg(`بیت‌کوین در 30 روز رشد نکرده (${btcPct}). تا وقتی خودش بالا نرود، نه بیت‌کوین می‌خریم و نه آلت. دفتر در تتر است.`, `Bitcoin is not up over 30 days (${btcPct}). Until it is rising, buy neither Bitcoin nor an alt. The book is in tether.`);
	if (input.book.sleeve === "btc") return msg(`بیت‌کوین در 30 روز مثبت است (${btcPct})، ولی ${input.breadth} آلتِ نقد حداقل ۵ واحد درصد از آن جلو نیستند. خرید، خود بیت‌کوین است.`, `Bitcoin is positive over 30 days (${btcPct}), but ${input.breadth} liquid alts are not at least 5 percentage points ahead. The buy is Bitcoin itself.`);
	const leadPct = input.leaderReturn == null ? "—" : signedPct(input.leaderReturn);
	return msg(`بیت‌کوین رشد کرده (${btcPct}) و آلت‌ها بیشتر. ${input.book.symbol} با ${leadPct} در 30 روز جلو است و ${input.breadth} آلت از بیت‌کوین جلوترند. کل دفتر روی ${input.book.symbol} است. جابه‌جایی فقط بعد از 3 بستهٔ روزانهٔ هم‌جهت.`, `Bitcoin is rising (${btcPct}) and alts are rising more. ${input.book.symbol} leads at ${leadPct} over 30 days, with ${input.breadth} alts ahead of Bitcoin. The whole book is ${input.book.symbol}. Capital moves only after 3 daily closes agree.`);
}
function buildClock(series) {
	const close = /* @__PURE__ */ new Map();
	const quote = /* @__PURE__ */ new Map();
	const names = /* @__PURE__ */ new Map();
	for (const row of series) {
		const closes = /* @__PURE__ */ new Map();
		const quotes = /* @__PURE__ */ new Map();
		for (const bar of row.bars) {
			if (!(bar.c > 0) || !Number.isFinite(bar.t)) continue;
			const day = Math.floor(bar.t / DAY);
			closes.set(day, bar.c);
			quotes.set(day, Number.isFinite(bar.q) && bar.q > 0 ? bar.q : 0);
		}
		if (closes.size === 0) continue;
		close.set(row.symbol, closes);
		quote.set(row.symbol, quotes);
		names.set(row.symbol, row.name);
	}
	const btc = close.get("BTC");
	if (!btc || btc.size < 38) return null;
	const calendar = [...btc.keys()].sort((a, b) => a - b);
	return {
		calendar,
		index: new Map(calendar.map((day, i) => [day, i])),
		close,
		quote,
		names
	};
}
function closeAt(clock, symbol, day) {
	const value = clock.close.get(symbol)?.get(day);
	return value != null && value > 0 ? value : null;
}
function windowReturn(clock, symbol, day) {
	const i = clock.index.get(day);
	if (i == null || i < 30) return null;
	const prevDay = clock.calendar[i - 30];
	if (prevDay == null) return null;
	for (let k = i - 30; k <= i; k++) {
		const d = clock.calendar[k];
		if (d == null || closeAt(clock, symbol, d) == null) return null;
	}
	const now = closeAt(clock, symbol, day);
	const prev = closeAt(clock, symbol, prevDay);
	if (!now || !prev) return null;
	return now / prev - 1;
}
function medianQuote(clock, symbol, day) {
	const i = clock.index.get(day);
	if (i == null || i < 30) return 0;
	const values = [];
	for (let k = i - 30 + 1; k <= i; k++) {
		const d = clock.calendar[k];
		if (d == null) continue;
		const q = clock.quote.get(symbol)?.get(d);
		if (q != null) values.push(q);
	}
	if (values.length < 24) return 0;
	values.sort((a, b) => a - b);
	return values[Math.floor(values.length / 2)] ?? 0;
}
function rawBook(clock, day) {
	const btcReturn = windowReturn(clock, "BTC", day);
	const alts = [];
	for (const symbol of clock.close.keys()) {
		if (symbol === "BTC") continue;
		if (medianQuote(clock, symbol, day) < 2e6) continue;
		const ret = windowReturn(clock, symbol, day);
		if (ret == null) continue;
		alts.push({
			symbol,
			return30: ret
		});
	}
	const ahead = alts.filter((row) => btcReturn != null && row.return30 > btcReturn + .05).sort((a, b) => b.return30 - a.return30);
	return {
		book: rotationTarget({
			btcReturn,
			alts,
			names: clock.names
		}),
		btcReturn,
		breadth: ahead.length,
		leaderReturn: ahead[0]?.return30 ?? null
	};
}
function freshConfirm() {
	return {
		held: {
			sleeve: "cash",
			symbol: null,
			name: null
		},
		pending: null,
		pendingN: 0
	};
}
function pushConfirm(state, raw) {
	if (sameBook(raw, state.held)) {
		state.pending = null;
		state.pendingN = 0;
		return state.held;
	}
	if (state.pending && sameBook(state.pending, raw)) {
		state.pendingN += 1;
		if (state.pendingN >= 3) {
			state.held = raw;
			state.pending = null;
			state.pendingN = 0;
		}
		return state.held;
	}
	state.pending = raw;
	state.pendingN = 1;
	return state.held;
}
function timingBook(btcReturn, btcName) {
	if (btcReturn != null && btcReturn > 0) return {
		sleeve: "btc",
		symbol: "BTC",
		name: btcName
	};
	return {
		sleeve: "cash",
		symbol: null,
		name: null
	};
}
/** Walk the daily book. A switch waits for three agreeing closes. No lookahead. */
function replayRotation(series) {
	const clock = buildClock(series);
	if (!clock) return null;
	const model = freshConfirm();
	const timing = freshConfirm();
	let heldW = bookWeights(model.held);
	let heldRule = bookWeights(timing.held);
	let equity = 1;
	let btcEquity = 1;
	let ruleEquity = 1;
	let peak = 1;
	let btcPeak = 1;
	let rulePeak = 1;
	let maxDrawdown = 0;
	let btcMaxDrawdown = 0;
	let ruleMaxDrawdown = 0;
	let trades = 0;
	let winners = 0;
	let tradedDays = 0;
	let recentDays = 0;
	let recentEquity = 1;
	let recentBtc = 1;
	const sleeveDays = {
		btc: 0,
		alt: 0,
		cash: 0
	};
	const curve = [];
	const heldDays = /* @__PURE__ */ new Map();
	let lastRaw = rawBook(clock, clock.calendar[30] ?? clock.calendar[0]);
	const btcName = clock.names.get("BTC") ?? "Bitcoin";
	let fromMs = 0;
	for (let i = 0; i < clock.calendar.length - 1; i++) {
		const day = clock.calendar[i];
		const next = clock.calendar[i + 1];
		if ((clock.index.get(day) ?? 0) < 30) continue;
		if (next - day > 3) continue;
		const raw = rawBook(clock, day);
		lastRaw = raw;
		const before = model.held;
		const book = pushConfirm(model, raw.book);
		const rule = pushConfirm(timing, timingBook(raw.btcReturn, btcName));
		const weights = bookWeights(book);
		const ruleW = bookWeights(rule);
		const modelRet = legReturn(clock, weights, day, next);
		const ruleRet = legReturn(clock, ruleW, day, next);
		const b0 = closeAt(clock, "BTC", day);
		const b1 = closeAt(clock, "BTC", next);
		if (modelRet == null || ruleRet == null || !b0 || !b1) {
			model.held = before;
			continue;
		}
		const modelTurn = turnover(heldW, weights);
		const ruleTurn = turnover(heldRule, ruleW);
		const net = (1 + modelRet) * (1 - modelTurn * 15 / 1e4) - 1;
		const ruleNet = (1 + ruleRet) * (1 - ruleTurn * 15 / 1e4) - 1;
		const bret = b1 / b0 - 1;
		if (modelTurn > 1e-8) trades += 1;
		equity *= 1 + net;
		btcEquity *= 1 + bret;
		ruleEquity *= 1 + ruleNet;
		peak = Math.max(peak, equity);
		maxDrawdown = Math.min(maxDrawdown, equity / peak - 1);
		btcPeak = Math.max(btcPeak, btcEquity);
		btcMaxDrawdown = Math.min(btcMaxDrawdown, btcEquity / btcPeak - 1);
		rulePeak = Math.max(rulePeak, ruleEquity);
		ruleMaxDrawdown = Math.min(ruleMaxDrawdown, ruleEquity / rulePeak - 1);
		if (net > 0) winners += 1;
		tradedDays += 1;
		if (fromMs === 0) fromMs = day * DAY;
		if (day * DAY >= RECENT_FROM) {
			recentDays += 1;
			recentEquity *= 1 + net;
			recentBtc *= 1 + bret;
		}
		sleeveDays[book.sleeve] += 1;
		for (const [symbol, weight] of weights) {
			if (!(weight > 0) || symbol === "USDT") continue;
			const bucket = heldDays.get(symbol) ?? {
				periods: 0,
				equity: 1
			};
			const p0 = closeAt(clock, symbol, day);
			const p1 = closeAt(clock, symbol, next);
			if (p0 && p1) bucket.equity *= p1 / p0;
			bucket.periods += 1;
			heldDays.set(symbol, bucket);
		}
		heldW = weights;
		heldRule = ruleW;
		curve.push({
			t: next * DAY,
			equity,
			btc: btcEquity,
			rule: ruleEquity
		});
	}
	if (tradedDays === 0 || curve.length === 0) return null;
	const lastDay = clock.calendar[clock.calendar.length - 1];
	const priceSymbol = model.held.symbol ?? "BTC";
	return {
		from: new Date(fromMs).toISOString(),
		to: (/* @__PURE__ */ new Date(lastDay * DAY)).toISOString(),
		days: clock.calendar.length,
		tradedDays,
		trades,
		winners,
		equity,
		btcEquity,
		ruleEquity,
		maxDrawdown,
		btcMaxDrawdown,
		ruleMaxDrawdown,
		recentDays,
		recentReturn: recentEquity - 1,
		recentBtcReturn: recentBtc - 1,
		sleeveDays,
		curve,
		holdings: [...heldDays.entries()].map(([symbol, row]) => ({
			symbol,
			periods: row.periods,
			returnPct: row.equity - 1
		})).sort((a, b) => b.periods - a.periods),
		final: {
			book: model.held,
			reason: rotationReason({
				book: model.held,
				btcReturn: lastRaw.btcReturn,
				breadth: lastRaw.breadth,
				leaderReturn: model.held.sleeve === "alt" ? lastRaw.leaderReturn : null
			}),
			priceUsd: closeAt(clock, priceSymbol, lastDay),
			btcReturn: lastRaw.btcReturn,
			breadth: lastRaw.breadth,
			leader: lastRaw.book.sleeve === "alt" ? lastRaw.book.symbol : null,
			leaderReturn: lastRaw.leaderReturn
		}
	};
}
function legReturn(clock, weights, day, next) {
	let ret = 0;
	for (const [symbol, weight] of weights) {
		if (!(weight > 0) || symbol === "USDT") continue;
		const p0 = closeAt(clock, symbol, day);
		const p1 = closeAt(clock, symbol, next);
		if (!p0 || !p1) return null;
		ret += weight * (p1 / p0 - 1);
	}
	return ret;
}
function turnover(prev, next) {
	let distance = 0;
	for (const key of /* @__PURE__ */ new Set([...prev.keys(), ...next.keys()])) distance += Math.abs((next.get(key) ?? 0) - (prev.get(key) ?? 0));
	return distance / 2;
}
function signedPct(value) {
	const v = value * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}%`;
}
//#endregion
export { replayRotation as i, buildRebalancePlan as n, campaignExit as r, ROTATION_MARGIN as t };
