//#region node_modules/.nitro/vite/services/ssr/assets/kill-switch-Cnn3GgHf.js
var _0002_market_cache_default = "-- Public market-data cache. Rows are unowned (no user data, no secrets).\ncreate table if not exists market_cache (\n  cache_key text primary key,\n  payload text not null,\n  fetched_at timestamptz not null default now()\n);\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_market_cache.sql": _0002_market_cache_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var chain = Promise.resolve();
function enqueue(fn) {
	const run = chain.then(fn, fn);
	chain = run.then(() => void 0, () => void 0);
	return run;
}
function stamp(value) {
	if (value instanceof Date) return value.getTime();
	const t = new Date(String(value)).getTime();
	return Number.isFinite(t) ? t : 0;
}
async function readCache(key, maxAgeSec) {
	const row = await readCacheRow(key);
	if (!row) return null;
	if (Date.now() - row.at > maxAgeSec * 1e3) return null;
	return row.payload;
}
async function readCacheRow(key) {
	return enqueue(async () => {
		try {
			const row = (await (await getSql())`
        select payload, fetched_at from market_cache where cache_key = ${key}
      `)[0];
			if (!row) return null;
			return {
				payload: row.payload,
				at: stamp(row.fetched_at)
			};
		} catch {
			return null;
		}
	});
}
async function readCachePrefix(prefix) {
	return enqueue(async () => {
		const out = /* @__PURE__ */ new Map();
		try {
			const rows = await (await getSql())`
        select cache_key, payload, fetched_at
        from market_cache
        where cache_key like ${`${prefix}%`}
      `;
			for (const row of rows) out.set(row.cache_key, {
				payload: row.payload,
				at: stamp(row.fetched_at)
			});
		} catch {}
		return out;
	});
}
async function writeCache(key, payload) {
	return enqueue(async () => {
		try {
			await (await getSql())`
        insert into market_cache (cache_key, payload, fetched_at)
        values (${key}, ${payload}, now())
        on conflict (cache_key) do update
          set payload = excluded.payload,
              fetched_at = now()
      `;
		} catch {}
	});
}
async function cacheHealth() {
	return enqueue(async () => {
		try {
			const row = (await (await getSql())`
        select count(*) as rows,
               sum(case when cache_key like 'k:220:%' then 1 else 0 end) as klines
        from market_cache
      `)[0];
			return {
				rows: Number(row?.rows ?? 0) || 0,
				klines: Number(row?.klines ?? 0) || 0
			};
		} catch {
			return {
				rows: 0,
				klines: 0
			};
		}
	});
}
function clamp(n, min = 0, max = 100) {
	return Math.min(max, Math.max(min, n));
}
function vsBtc(coinPct, btcPct) {
	const c = 1 + coinPct / 100;
	const b = 1 + btcPct / 100;
	if (b === 0) return 0;
	return c / b - 1;
}
function mean(xs) {
	if (xs.length === 0) return 0;
	return xs.reduce((a, b) => a + b, 0) / xs.length;
}
function stdev(xs) {
	if (xs.length < 2) return 0;
	const m = mean(xs);
	const v = xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1);
	return Math.sqrt(v);
}
function dailyReturns(closes) {
	const out = [];
	for (let i = 1; i < closes.length; i++) {
		const prev = closes[i - 1];
		const cur = closes[i];
		if (prev && prev !== 0 && Number.isFinite(cur)) out.push(cur / prev - 1);
	}
	return out;
}
function maxDrawdown(closes) {
	if (closes.length < 2) return 0;
	let peak = closes[0] ?? 0;
	let dd = 0;
	for (const p of closes) {
		if (p > peak) peak = p;
		if (peak > 0) dd = Math.min(dd, p / peak - 1);
	}
	return dd;
}
function rsi(closes, period = 14) {
	if (closes.length < period + 1) return null;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		if (d >= 0) gain += d;
		else loss -= d;
	}
	gain /= period;
	loss /= period;
	for (let i = period + 1; i < closes.length; i++) {
		const d = (closes[i] ?? 0) - (closes[i - 1] ?? 0);
		const g = Math.max(d, 0);
		const l = Math.max(-d, 0);
		gain = (gain * (period - 1) + g) / period;
		loss = (loss * (period - 1) + l) / period;
	}
	if (loss === 0) return 100;
	return 100 - 100 / (1 + gain / loss);
}
function sma(closes, period) {
	if (closes.length < period) return null;
	return mean(closes.slice(-period));
}
function ema(closes, period) {
	if (closes.length < period) return null;
	const k = 2 / (period + 1);
	let prev = 0;
	for (let i = 0; i < period; i++) prev += closes[i] ?? 0;
	prev /= period;
	for (let i = period; i < closes.length; i++) prev = ((closes[i] ?? 0) - prev) * k + prev;
	return prev;
}
function percentileRank(value, all) {
	if (all.length <= 1) return 50;
	let less = 0;
	let equal = 0;
	for (const x of all) if (x < value) less += 1;
	else if (x === value) equal += 1;
	return (less + equal * .5) / all.length * 100;
}
function tanhScore(x, scale, center = 50) {
	return clamp(center + 50 * Math.tanh(x / scale));
}
function lookback(closes, days) {
	if (closes.length < days + 1) return null;
	const last = closes[closes.length - 1];
	const prev = closes[closes.length - 1 - days];
	if (last == null || prev == null || prev === 0) return null;
	return last / prev - 1;
}
function distFromHigh(closes) {
	if (closes.length < 3) return null;
	const last = closes[closes.length - 1];
	if (last == null || last === 0) return null;
	return last / Math.max(...closes) - 1;
}
function weeklyFromDaily(closes) {
	const out = [];
	for (let end = closes.length; end >= 1; end -= 7) {
		const bar = closes[end - 1];
		if (bar != null) out.unshift(bar);
	}
	return out;
}
function weeklySupportBroken(closes) {
	const w = weeklyFromDaily(closes);
	if (w.length < 8) return false;
	const last = w[w.length - 1];
	if (last == null) return false;
	const prior = w.slice(-9, -1);
	if (prior.length < 4) return false;
	return last < Math.min(...prior);
}
function detectWeeklyStructure(closes) {
	const w = weeklyFromDaily(closes);
	if (w.length < 8) return "range";
	const window = w.slice(-12);
	const last = window[window.length - 1];
	const prior = window.slice(0, -1);
	const priorHigh = Math.max(...prior);
	const priorLow = Math.min(...prior);
	const split = Math.max(2, window.length - 4);
	const older = window.slice(0, split);
	const recent = window.slice(split);
	const olderHigh = Math.max(...older);
	const olderLow = Math.min(...older);
	const recentHigh = Math.max(...recent);
	const recentLow = Math.min(...recent);
	if (last > priorHigh) return "bull";
	if (last < priorLow) return "bear";
	if (recentHigh >= olderHigh && recentLow >= olderLow) return "bull";
	if (recentHigh <= olderHigh && recentLow <= olderLow) return "bear";
	return "range";
}
function obvSeries(closes, volumes) {
	const n = Math.min(closes.length, volumes.length);
	const out = [];
	let acc = 0;
	if (n === 0) return out;
	out.push(0);
	for (let i = 1; i < n; i++) {
		if (closes[i] > closes[i - 1]) acc += volumes[i] ?? 0;
		else if (closes[i] < closes[i - 1]) acc -= volumes[i] ?? 0;
		out.push(acc);
	}
	return out;
}
function obvIsRising(closes, volumes) {
	const s = obvSeries(closes, volumes);
	if (s.length < 15) return null;
	return s[s.length - 1] >= mean(s.slice(-10));
}
function classifyMacroRisk(belowEma, severeWeekly) {
	if (belowEma && severeWeekly) return "SUSPENDED";
	if (belowEma || severeWeekly) return "HIGH_RISK";
	return "NORMAL";
}
function spotBuysFor(status) {
	if (status === "SUSPENDED") return "suspended";
	if (status === "HIGH_RISK") return "reduced";
	return "open";
}
function isSevereWeekly(input) {
	if (input.weeklyStructure !== "bear") return false;
	return input.weeklyMomentum != null && input.weeklyMomentum <= -.08 || input.weeklySupportBroken;
}
function pct(x) {
	const v = x * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(1)}٪`;
}
function evaluateKillSwitch(input) {
	const ema200 = ema(input.closes, 200);
	const aboveEma200 = ema200 == null || !Number.isFinite(input.priceUsd) ? null : input.priceUsd >= ema200;
	const distanceToEma = ema200 && ema200 !== 0 && Number.isFinite(input.priceUsd) ? input.priceUsd / ema200 - 1 : null;
	const weeklyStructure = input.closes.length >= 56 ? detectWeeklyStructure(input.closes) : null;
	const weeklyMomentum = lookback(input.closes, 28);
	const supportBroken = weeklySupportBroken(input.closes);
	const severeWeekly = isSevereWeekly({
		weeklyStructure,
		weeklyMomentum,
		weeklySupportBroken: supportBroken
	});
	if (aboveEma200 == null && weeklyStructure == null) return {
		status: "NORMAL",
		active: false,
		aboveEma200: null,
		ema200: null,
		priceUsd: input.priceUsd,
		distanceToEma: null,
		weeklyStructure: null,
		weeklyMomentum,
		severeWeekly: false,
		weeklySupportBroken: false,
		sizeMultiplier: 1,
		spotBuys: "open",
		headline: "فیلتر کلان در دسترس نیست",
		note: "کندل روزانه بیت‌کوین برای EMA ۲۰۰ و ساختار هفتگی کافی نبود؛ کلید قطع اجرا نشد و سیگنال‌ها بدون این فیلتر مانده‌اند."
	};
	const status = classifyMacroRisk(aboveEma200 === false, severeWeekly);
	const spotBuys = spotBuysFor(status);
	const sizeMultiplier = status === "SUSPENDED" ? 0 : status === "HIGH_RISK" ? .5 : 1;
	const emaBit = aboveEma200 == null ? "EMA ۲۰۰ محاسبه نشد" : aboveEma200 ? `قیمت بالای EMA ۲۰۰ است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}` : `قیمت زیر EMA ۲۰۰ روزانه است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}`;
	const weekBit = severeWeekly ? `ساختار هفتگی شدیداً نزولی است${weeklyMomentum == null ? "" : `؛ بازده ۴ هفته ${pct(weeklyMomentum)}`}` : weeklyStructure === "bear" ? "ساختار هفتگی نزولی است ولی هنوز به آستانه شدید (افت ۴ هفته‌ای بیش از ۸٪ یا شکست کف ۸ هفته) نرسیده" : weeklyStructure === "bull" ? "ساختار هفتگی صعودی است" : "ساختار هفتگی خنثی یا نامشخص است";
	let headline = "ریسک کلان نرمال";
	let note = `${emaBit}. ${weekBit}. خرید اسپات با حجم کامل مدل مجاز است.`;
	if (status === "SUSPENDED") {
		headline = "کلید قطع اضطراری فعال";
		note = `${emaBit}. ${weekBit}. هر دو شرط برقرار است؛ سیگنال خرید اسپات آلت‌کوین معلق شد و وزن پیشنهادی به بیت‌کوین برمی‌گردد.`;
	} else if (status === "HIGH_RISK") {
		headline = "ریسک کلان بالا · حجم نصف";
		note = `${emaBit}. ${weekBit}. کلید احتیاط فعال است و حجم پیشنهادی پوزیشن‌های اسپات ۵۰٪ کاهش یافت.`;
	}
	return {
		status,
		active: status !== "NORMAL",
		aboveEma200,
		ema200,
		priceUsd: input.priceUsd,
		distanceToEma,
		weeklyStructure,
		weeklyMomentum,
		severeWeekly,
		weeklySupportBroken: supportBroken,
		sizeMultiplier,
		spotBuys,
		headline,
		note
	};
}
//#endregion
export { tanhScore as _, distFromHigh as a, writeCache as b, lookback as c, percentileRank as d, readCache as f, stdev as g, sma as h, detectWeeklyStructure as i, maxDrawdown as l, rsi as m, clamp as n, ema as o, readCachePrefix as p, dailyReturns as r, evaluateKillSwitch as s, cacheHealth as t, obvIsRising as u, vsBtc as v, weeklySupportBroken as y };
