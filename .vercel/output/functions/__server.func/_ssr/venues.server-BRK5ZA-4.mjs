import { a as nobitexSignPayload, c as redact, i as describePlan, r as bybitSignPayload, s as planVenueOrder } from "./venues-BFan2-LH.mjs";
import { createHmac, createPrivateKey, sign } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/venues.server-BRK5ZA-4.js
var HOST = {
	nobitex: "apiv2.nobitex.ir",
	wallex: "api.wallex.ir",
	ompfinex: "api.ompfinex.com",
	binance: "api.binance.com",
	bybit: "api.bybit.com"
};
var lastPrivateAt = 0;
function assertHost(host) {
	if (!Object.values(HOST).includes(host)) throw new Error("میزبان مجاز نیست.");
}
async function request(host, path, init) {
	assertHost(host);
	const ctrl = new AbortController();
	const timer = setTimeout(() => ctrl.abort(), 8e3);
	try {
		const res = await fetch(`https://${host}${path}`, {
			method: init.method,
			redirect: "error",
			signal: ctrl.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "AlphaSpot/1.4",
				...init.body ? { "Content-Type": "application/json" } : {},
				...init.headers
			},
			body: init.body
		});
		const text = (await res.text()).slice(0, 8e3);
		let json = null;
		try {
			json = JSON.parse(text);
		} catch {
			json = null;
		}
		return {
			status: res.status,
			json,
			text
		};
	} catch (err) {
		const aborted = err instanceof Error && err.name === "AbortError";
		throw new Error(aborted ? "صرافی در زمان مقرر جواب نداد." : "ارتباط با صرافی برقرار نشد.");
	} finally {
		clearTimeout(timer);
	}
}
function throttle() {
	const wait = 1200 - (Date.now() - lastPrivateAt);
	if (wait > 0) return new Promise((resolve) => setTimeout(resolve, wait));
	return Promise.resolve();
}
async function privateCall(host, path, init) {
	await throttle();
	lastPrivateAt = Date.now();
	return request(host, path, init);
}
function signEd25519(privateKeyB64Url, message) {
	const seed = Buffer.from(privateKeyB64Url.trim(), "base64url");
	if (seed.length !== 32) throw new Error("کلید خصوصی نوبیتکس باید ۳۲ بایت باشد.");
	const pkcs8 = Buffer.concat([Buffer.from("302e020100300506032b657004220420", "hex"), seed]);
	const key = createPrivateKey({
		key: pkcs8,
		format: "der",
		type: "pkcs8"
	});
	return sign(null, Buffer.from(message), key).toString("base64url");
}
function hmac(secret, payload) {
	return createHmac("sha256", secret).update(payload).digest("hex");
}
function secretsOf(input) {
	return [input.key, input.secret].filter((part) => part && part.trim().length >= 6);
}
function fail(input, detail, planned = "") {
	return {
		ok: false,
		action: input.action,
		detail: redact(detail, secretsOf(input)),
		balances: [],
		orderId: null,
		planned
	};
}
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function pullBalances(payload) {
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	const push = (asset, amount) => {
		if (typeof asset !== "string") return;
		const n = Number(amount);
		if (!Number.isFinite(n) || n <= 0) return;
		const name = asset.toUpperCase().replace(/[^A-Z0-9]/g, "");
		if (name.length < 2 || name.length > 12) return;
		const id = `${name}:${n}`;
		if (seen.has(id)) return;
		seen.add(id);
		out.push({
			asset: name,
			amount: String(amount)
		});
	};
	const fromRow = (row) => {
		push(row.currency ?? row.asset ?? row.coin, row.balance ?? row.available ?? row.free ?? row.value ?? row.walletBalance ?? row.amount);
	};
	const visit = (value, depth) => {
		if (value == null || depth > 6) return;
		if (Array.isArray(value)) {
			for (const item of value) visit(item, depth + 1);
			return;
		}
		const row = asRecord(value);
		if (!row) return;
		fromRow(row);
		for (const key of [
			"balances",
			"wallets",
			"coins",
			"coin",
			"list",
			"result",
			"data"
		]) if (row[key] && typeof row[key] === "object") visit(row[key], depth + 1);
		for (const [key, val] of Object.entries(row)) {
			if (!/^[A-Za-z0-9]{2,10}$/.test(key)) continue;
			const inner = asRecord(val);
			if (!inner) continue;
			const amount = inner.value ?? inner.balance ?? inner.available ?? inner.free ?? inner.walletBalance;
			if (amount != null && inner.currency == null && inner.asset == null) push(key, amount);
		}
	};
	visit(payload, 0);
	return out.slice(0, 8);
}
function digId(value, depth = 0) {
	if (!value || depth > 5) return null;
	const row = asRecord(value);
	if (!row) return null;
	const direct = row.orderId ?? row.order_id ?? row.id ?? row.clientOrderId ?? row.orderLinkId;
	if (typeof direct === "string" || typeof direct === "number") return String(direct);
	for (const key of [
		"order",
		"result",
		"data"
	]) {
		const found = digId(row[key], depth + 1);
		if (found) return found;
	}
	return null;
}
function accepted(res) {
	if (res.status < 200 || res.status >= 300) return false;
	const row = asRecord(res.json);
	if (!row) return true;
	if (row.success === false || row.status === "failed" || row.status === "error") return false;
	if (typeof row.retCode === "number" && row.retCode !== 0) return false;
	if (typeof row.code === "number" && row.code !== 0 && row.code !== 200) return false;
	if (typeof row.code === "string" && row.code !== "0" && row.code !== "200") return false;
	return true;
}
function nobitexHeaders(input, method, path, body) {
	if (!input.secret.trim()) return { Authorization: `Token ${input.key.trim()}` };
	const timestamp = String(Math.floor(Date.now() / 1e3));
	const payload = nobitexSignPayload(timestamp, method, path, body);
	return {
		"Nobitex-Key": input.key.trim(),
		"Nobitex-Timestamp": timestamp,
		"Nobitex-Signature": signEd25519(input.secret, payload)
	};
}
async function probeNobitex(input) {
	const path = "/users/wallets/list";
	const body = "{}";
	const res = await privateCall(HOST.nobitex, path, {
		method: "POST",
		headers: nobitexHeaders(input, "POST", path, body),
		body
	});
	if (!accepted(res)) return fail(input, `نوبیتکس موجودی را نداد. ${res.text}`);
	return {
		ok: true,
		action: "probe",
		detail: "اتصال نوبیتکس برقرار شد. کلید روی سرور ذخیره نشد.",
		balances: pullBalances(res.json),
		orderId: null,
		planned: ""
	};
}
async function probeWallex(input) {
	const res = await privateCall(HOST.wallex, "/v1/account/balances", {
		method: "GET",
		headers: { "x-api-key": input.key.trim() }
	});
	if (!accepted(res)) return fail(input, `والکس موجودی را نداد. ${res.text}`);
	return {
		ok: true,
		action: "probe",
		detail: "اتصال والکس برقرار شد. کلید روی سرور ذخیره نشد.",
		balances: pullBalances(res.json),
		orderId: null,
		planned: ""
	};
}
async function probeBearer(input, host, paths, label) {
	let last = "پاسخی نیامد.";
	for (const path of paths) {
		const res = await privateCall(host, path, {
			method: "GET",
			headers: { Authorization: `Bearer ${input.key.trim()}` }
		});
		last = res.text;
		if (accepted(res)) return {
			ok: true,
			action: "probe",
			detail: `اتصال ${label} برقرار شد. کلید روی سرور ذخیره نشد.`,
			balances: pullBalances(res.json),
			orderId: null,
			planned: ""
		};
		if (res.status !== 404) break;
	}
	return fail(input, `${label} موجودی را نداد. ${last}`);
}
async function probeBinance(input) {
	const query = `timestamp=${Date.now()}&recvWindow=5000`;
	const signature = hmac(input.secret.trim(), query);
	const res = await privateCall(HOST.binance, `/api/v3/account?${query}&signature=${signature}`, {
		method: "GET",
		headers: { "X-MBX-APIKEY": input.key.trim() }
	});
	if (!accepted(res)) return fail(input, `بایننس موجودی را نداد. ${res.text}`);
	return {
		ok: true,
		action: "probe",
		detail: "اتصال بایننس برقرار شد. کلید روی سرور ذخیره نشد.",
		balances: pullBalances(res.json),
		orderId: null,
		planned: ""
	};
}
async function probeBybit(input) {
	const timestamp = String(Date.now());
	const recv = "5000";
	const query = "accountType=UNIFIED";
	const payload = bybitSignPayload(timestamp, input.key.trim(), recv, query);
	const res = await privateCall(HOST.bybit, `/v5/account/wallet-balance?${query}`, {
		method: "GET",
		headers: {
			"X-BAPI-API-KEY": input.key.trim(),
			"X-BAPI-TIMESTAMP": timestamp,
			"X-BAPI-RECV-WINDOW": recv,
			"X-BAPI-SIGN": hmac(input.secret.trim(), payload)
		}
	});
	if (!accepted(res)) return fail(input, `بای‌بیت موجودی را نداد. ${res.text}`);
	return {
		ok: true,
		action: "probe",
		detail: "اتصال بای‌بیت برقرار شد. کلید روی سرور ذخیره نشد.",
		balances: pullBalances(res.json),
		orderId: null,
		planned: ""
	};
}
async function placeSigned(input) {
	const plan = planVenueOrder(input);
	const planned = describePlan(plan);
	if (input.venue === "nobitex" && plan.body) {
		const body = JSON.stringify(plan.body);
		const res = await privateCall(HOST.nobitex, plan.path, {
			method: "POST",
			headers: nobitexHeaders(input, "POST", plan.path, body),
			body
		});
		if (!accepted(res)) return fail(input, `نوبیتکس سفارش را نپذیرفت. ${res.text}`, planned);
		return placed(input, "سفارش نوبیتکس ثبت شد.", digId(res.json), planned);
	}
	if (input.venue === "wallex" && plan.body) {
		const res = await privateCall(HOST.wallex, plan.path, {
			method: "POST",
			headers: { "x-api-key": input.key.trim() },
			body: JSON.stringify(plan.body)
		});
		if (!accepted(res)) return fail(input, `والکس سفارش را نپذیرفت. ${res.text}`, planned);
		return placed(input, "سفارش والکس ثبت شد.", digId(res.json), planned);
	}
	if (input.venue === "ompfinex" && plan.body) return placeOmp(input, plan.body, planned);
	if (input.venue === "binance" && plan.query) {
		const timestamp = Date.now();
		const query = `${plan.query}&recvWindow=5000&timestamp=${timestamp}`;
		const signature = hmac(input.secret.trim(), query);
		const res = await privateCall(HOST.binance, `${plan.path}?${query}&signature=${signature}`, {
			method: "POST",
			headers: { "X-MBX-APIKEY": input.key.trim() }
		});
		if (!accepted(res)) return fail(input, `بایننس سفارش را نپذیرفت. ${res.text}`, planned);
		return placed(input, "سفارش بایننس ثبت شد.", digId(res.json), planned);
	}
	if (input.venue === "bybit" && plan.body) {
		const body = JSON.stringify(plan.body);
		const timestamp = String(Date.now());
		const recv = "5000";
		const payload = bybitSignPayload(timestamp, input.key.trim(), recv, body);
		const res = await privateCall(HOST.bybit, plan.path, {
			method: "POST",
			headers: {
				"X-BAPI-API-KEY": input.key.trim(),
				"X-BAPI-TIMESTAMP": timestamp,
				"X-BAPI-RECV-WINDOW": recv,
				"X-BAPI-SIGN": hmac(input.secret.trim(), payload)
			},
			body
		});
		if (!accepted(res)) return fail(input, `بای‌بیت سفارش را نپذیرفت. ${res.text}`, planned);
		return placed(input, "سفارش بای‌بیت ثبت شد.", digId(res.json), planned);
	}
	return fail(input, "سفارش ساخته نشد.", planned);
}
async function placeOmp(input, draft, planned) {
	const headers = { Authorization: `Bearer ${input.key.trim()}` };
	let body = draft;
	const marketId = findMarketId((await privateCall(HOST.ompfinex, "/v1/market", {
		method: "GET",
		headers
	})).json, String(draft.market ?? ""));
	if (marketId) body = {
		...draft,
		market_id: marketId
	};
	const paths = ["/v1/order", "/v1/user/order"];
	let last = "پاسخی نیامد.";
	for (const path of paths) {
		const res = await privateCall(HOST.ompfinex, path, {
			method: "POST",
			headers,
			body: JSON.stringify(body)
		});
		last = res.text;
		if (accepted(res)) return placed(input, "سفارش اوام‌پی فینکس ثبت شد.", digId(res.json), planned);
		if (res.status !== 404) break;
	}
	return fail(input, `اوام‌پی فینکس سفارش را نپذیرفت. ${last}`, planned);
}
function findMarketId(payload, want) {
	const needle = want.toUpperCase().replace(/[^A-Z0-9]/g, "");
	if (!needle) return null;
	let found = null;
	const visit = (value, depth) => {
		if (found != null || !value || depth > 7) return;
		if (Array.isArray(value)) {
			for (const row of value) visit(row, depth + 1);
			return;
		}
		const row = asRecord(value);
		if (!row) return;
		const sym = String(row.symbol ?? row.market ?? row.name ?? row.pair ?? "").toUpperCase().replace(/[^A-Z0-9]/g, "");
		const id = row.id ?? row.market_id ?? row.marketId;
		if (sym === needle && (typeof id === "string" || typeof id === "number")) {
			found = id;
			return;
		}
		for (const val of Object.values(row)) if (val && typeof val === "object") visit(val, depth + 1);
	};
	visit(payload, 0);
	return found;
}
function placed(input, detail, orderId, planned) {
	return {
		ok: true,
		action: "place",
		detail: orderId ? `${detail} شناسه ${orderId}.` : detail,
		balances: [],
		orderId,
		planned
	};
}
function requireKey(input) {
	if (input.key.trim().length < 8) throw new Error("کلید API را وارد کنید. روی سرور ذخیره نمی‌شود.");
	if ((input.venue === "binance" || input.venue === "bybit") && input.secret.trim().length < 8) throw new Error("کلید مخفی این صرافی لازم است.");
}
async function executeVenue(input) {
	if (input.action === "preview") {
		const plan = planVenueOrder(input);
		return {
			ok: true,
			action: "preview",
			detail: "پیش‌نمایش است. هیچ سفارشی به صرافی نرفت.",
			balances: [],
			orderId: null,
			planned: describePlan(plan)
		};
	}
	try {
		requireKey(input);
	} catch (err) {
		return fail(input, err instanceof Error ? err.message : "کلید ناقص است.");
	}
	if (input.action === "place" && input.confirm.trim().toUpperCase() !== input.symbol.trim().toUpperCase()) return fail(input, "برای ثبت واقعی باید خود نماد را در کادر تأیید بنویسید.");
	try {
		if (input.action === "probe") {
			if (input.venue === "nobitex") return await probeNobitex(input);
			if (input.venue === "wallex") return await probeWallex(input);
			if (input.venue === "ompfinex") return await probeBearer(input, HOST.ompfinex, [
				"/v1/user/wallet",
				"/v1/wallet",
				"/v1/user"
			], "اوام‌پی فینکس");
			if (input.venue === "binance") return await probeBinance(input);
			return await probeBybit(input);
		}
		return await placeSigned(input);
	} catch (err) {
		return fail(input, err instanceof Error ? err.message : "اجرای صرافی انجام نشد.");
	}
}
//#endregion
export { executeVenue };
