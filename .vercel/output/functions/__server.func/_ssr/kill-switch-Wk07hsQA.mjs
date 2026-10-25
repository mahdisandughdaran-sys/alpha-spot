import { i as msg } from "./lex-BMsOT1Y7.mjs";
import { _ as weeklySupportBroken, a as ema, o as lookback, r as detectWeeklyStructure } from "./math-B3CMdRol.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kill-switch-Wk07hsQA.js
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
function classifyMacroRisk(belowEma, severeWeekly) {
	if (belowEma && severeWeekly) return "SUSPENDED";
	if (belowEma || severeWeekly) return "HIGH_RISK";
	return "NORMAL";
}
function spotBuysFor(status) {
	if (status === "SUSPENDED") return "suspended";
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
	const sizeMultiplier = status === "SUSPENDED" ? 0 : 1;
	const emaBit = aboveEma200 == null ? "EMA ۲۰۰ محاسبه نشد" : aboveEma200 ? `قیمت بالای EMA ۲۰۰ است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}` : `قیمت زیر EMA ۲۰۰ روزانه است${distanceToEma == null ? "" : ` (${pct(distanceToEma)})`}`;
	const weekBit = severeWeekly ? `ساختار هفتگی شدیداً نزولی است${weeklyMomentum == null ? "" : `؛ بازده ۴ هفته ${pct(weeklyMomentum)}`}` : weeklyStructure === "bear" ? "ساختار هفتگی نزولی است ولی هنوز به آستانه شدید (افت ۴ هفته‌ای بیش از ۸٪ یا شکست کف ۸ هفته) نرسیده" : weeklyStructure === "bull" ? "ساختار هفتگی صعودی است" : "ساختار هفتگی خنثی یا نامشخص است";
	let headline = msg("روند بیت‌کوین سالم است", "Bitcoin’s trend is intact");
	let note = msg(`${emaBit}. ${weekBit}. هسته بیت‌کوین است. نقد فقط وقتی هر دو شرط با هم بشکنند.`, `${emaBit}. ${weekBit}. The core is Bitcoin. Cash is only when both conditions break together.`);
	if (status === "SUSPENDED") {
		headline = msg("کلید قطع · دفتر در تتر", "Kill switch · the book is in tether");
		note = msg(`${emaBit}. ${weekBit}. هر دو شرط برقرار است. آلت صفر است و بیت‌کوین هم به تتر می‌رود. این تنها جایی است که «هیچ‌چیز نخر» درست است.`, `${emaBit}. ${weekBit}. Both conditions are on. Alts are zero and Bitcoin goes to tether too. This is the only place “buy nothing” is right.`);
	} else if (status === "HIGH_RISK") {
		headline = msg("هسته را نگه دار · قمر بسته", "Hold the core · satellite closed");
		note = msg(`${emaBit}. ${weekBit}. فقط یکی از دو شرط خراب است. این نقد شدن نیست و حجم هسته نصف نمی‌شود. قمر تازه باز نمی‌شود.`, `${emaBit}. ${weekBit}. Only one of the two conditions is broken. This is not cash and the core is not cut in half. A new satellite does not open.`);
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
export { writeCache as a, readCachePrefix as i, evaluateKillSwitch as n, readCache as r, cacheHealth as t };
