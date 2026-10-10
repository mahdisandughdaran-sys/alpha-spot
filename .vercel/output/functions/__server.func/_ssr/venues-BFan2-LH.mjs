import { t as candidateBases } from "./exclusions-CgnBvqEr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/venues-BFan2-LH.js
var VENUES = [
	"nobitex",
	"wallex",
	"ompfinex",
	"binance",
	"bybit"
];
var VENUE_LABEL = {
	nobitex: "نوبیتکس",
	wallex: "والکس",
	ompfinex: "اوام‌پی فینکس",
	binance: "بایننس",
	bybit: "بای‌بیت"
};
var MAX_NOTIONAL = 5e4;
function isVenue(value) {
	return VENUES.includes(value);
}
function money(n, digits) {
	if (!Number.isFinite(n) || n <= 0) return "0";
	return n.toFixed(digits).replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}
function clientId(now = Date.now()) {
	return `as${now.toString(36)}`.replace(/[^a-z0-9]/g, "").slice(0, 20);
}
function venueBase(venue, symbol) {
	const upper = symbol.toUpperCase();
	if (venue === "binance" || venue === "bybit") return candidateBases(upper)[0] ?? upper;
	return upper;
}
function guardPrice(side, price) {
	return side === "BUY" ? price * 1.012 : price * .988;
}
function quotePrice(input) {
	if (input.quote === "USDT") return input.priceUsd;
	const toman = input.priceUsd * input.tomanPerUsdt;
	return input.rial ? toman * 10 : toman;
}
function assertSized(input) {
	const symbol = input.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (!/^[A-Z0-9]{2,15}$/.test(symbol)) throw new Error("نماد نامعتبر است.");
	if (!(input.priceUsd > 0)) throw new Error("قیمت دلار این نماد در تحلیل نیست.");
	const notional = Number(input.notionalUsd);
	if (!(notional >= 5) || notional > MAX_NOTIONAL) throw new Error("حجم هر سفارش باید بین ۵ و ۵۰٬۰۰۰ دلار باشد.");
	if (input.quote === "IRT" && (input.venue === "binance" || input.venue === "bybit")) throw new Error("بایننس و بای‌بیت در این میز فقط بازار تتر را مستقیم ثبت می‌کنند.");
	if (input.quote === "IRT" && !(input.tomanPerUsdt >= 1e3 && input.tomanPerUsdt <= 1e7)) throw new Error("نرخ تتر به تومان را وارد کنید.");
	const qty = Math.floor(notional / input.priceUsd * 1e6) / 1e6;
	if (!(qty > 0)) throw new Error("حجم پایه صفر شد.");
	return {
		symbol,
		qty,
		notional
	};
}
function planVenueOrder(input, now = Date.now()) {
	const sized = assertSized(input);
	const base = venueBase(input.venue, sized.symbol);
	const id = clientId(now);
	const side = input.side === "SELL" ? "SELL" : "BUY";
	const qty = money(sized.qty, 6);
	if (input.venue === "nobitex") {
		const rial = input.quote === "IRT";
		const price = money(guardPrice(side, quotePrice({
			priceUsd: input.priceUsd,
			quote: input.quote,
			tomanPerUsdt: input.tomanPerUsdt,
			rial
		})), rial ? 0 : 6);
		const body = {
			type: side.toLowerCase(),
			execution: "market",
			srcCurrency: base.toLowerCase(),
			dstCurrency: rial ? "rls" : "usdt",
			amount: qty,
			price,
			clientOrderId: id
		};
		return {
			venue: input.venue,
			summary: `نوبیتکس ${side === "BUY" ? "خرید" : "فروش"} مارکت ${qty} ${base} با سقف قیمت ${price} ${rial ? "ریال" : "تتر"}`,
			method: "POST",
			path: "/market/orders/add",
			body,
			query: null,
			baseQty: sized.qty
		};
	}
	if (input.venue === "wallex") {
		const tmn = input.quote === "IRT";
		const price = money(guardPrice(side, quotePrice({
			priceUsd: input.priceUsd,
			quote: input.quote,
			tomanPerUsdt: input.tomanPerUsdt,
			rial: false
		})), tmn ? 0 : 6);
		const body = {
			symbol: `${base}${tmn ? "TMN" : "USDT"}`,
			side,
			type: "MARKET",
			quantity: qty,
			price,
			client_id: id
		};
		return {
			venue: input.venue,
			summary: `والکس ${side} مارکت ${qty} ${body.symbol} با قیمت محافظ ${price}`,
			method: "POST",
			path: "/v1/account/orders",
			body,
			query: null,
			baseQty: sized.qty
		};
	}
	if (input.venue === "ompfinex") {
		const body = {
			market: `${base}${input.quote === "IRT" ? "IRR" : "USDT"}`,
			side: side.toLowerCase(),
			type: "market",
			amount: qty
		};
		return {
			venue: input.venue,
			summary: `اوام‌پی فینکس ${side === "BUY" ? "خرید" : "فروش"} مارکت ${qty} ${body.market}`,
			method: "POST",
			path: "/v1/order",
			body,
			query: null,
			baseQty: sized.qty
		};
	}
	if (input.venue === "binance") {
		const params = new URLSearchParams({
			symbol: `${base}USDT`,
			side,
			type: "MARKET",
			newClientOrderId: id
		});
		if (side === "BUY") params.set("quoteOrderQty", money(sized.notional, 2));
		else params.set("quantity", qty);
		return {
			venue: input.venue,
			summary: side === "BUY" ? `بایننس خرید مارکت ${money(sized.notional, 2)} تتر ${base}` : `بایننس فروش مارکت ${qty} ${base}`,
			method: "POST",
			path: "/api/v3/order",
			body: null,
			query: params.toString(),
			baseQty: sized.qty
		};
	}
	const body = {
		category: "spot",
		symbol: `${base}USDT`,
		side: side === "BUY" ? "Buy" : "Sell",
		orderType: "Market",
		qty: side === "BUY" ? money(sized.notional, 2) : qty,
		marketUnit: side === "BUY" ? "quoteCoin" : "baseCoin",
		orderLinkId: id
	};
	return {
		venue: input.venue,
		summary: side === "BUY" ? `بای‌بیت خرید مارکت ${body.qty} تتر ${base}` : `بای‌بیت فروش مارکت ${qty} ${base}`,
		method: "POST",
		path: "/v5/order/create",
		body,
		query: null,
		baseQty: sized.qty
	};
}
function bybitSignPayload(timestamp, apiKey, recvWindow, body) {
	return `${timestamp}${apiKey}${recvWindow}${body}`;
}
function nobitexSignPayload(timestamp, method, path, body) {
	return `${timestamp}${method.toUpperCase()}${path}${body}`;
}
function redact(text, secrets) {
	let out = text.replace(/\s+/g, " ").slice(0, 320);
	for (const secret of secrets) {
		const clean = secret.trim();
		if (clean.length >= 6) out = out.split(clean).join("•••");
	}
	return out;
}
function normalizeVenueCall(input) {
	if (!input || typeof input !== "object") throw new Error("درخواست خالی است.");
	if (!isVenue(String(input.venue))) throw new Error("صرافی نامعتبر است.");
	if (input.action !== "probe" && input.action !== "preview" && input.action !== "place") throw new Error("عملیات نامعتبر است.");
	return {
		action: input.action,
		venue: input.venue,
		key: String(input.key ?? "").slice(0, 400),
		secret: String(input.secret ?? "").slice(0, 400),
		symbol: String(input.symbol ?? "").slice(0, 20),
		side: input.side === "SELL" ? "SELL" : "BUY",
		notionalUsd: Number(input.notionalUsd) || 0,
		priceUsd: Number(input.priceUsd) || 0,
		quote: input.quote === "IRT" ? "IRT" : "USDT",
		tomanPerUsdt: Number(input.tomanPerUsdt) || 0,
		confirm: String(input.confirm ?? "").slice(0, 20)
	};
}
function describePlan(plan) {
	const wire = plan.body ? JSON.stringify(plan.body) : plan.query ?? "";
	return `${plan.summary}\n${plan.method} ${plan.path}\n${wire}`;
}
//#endregion
export { nobitexSignPayload as a, redact as c, describePlan as i, VENUE_LABEL as n, normalizeVenueCall as o, bybitSignPayload as r, planVenueOrder as s, VENUES as t };
