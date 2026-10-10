import { getSql } from "@/lib/db";

type Cached = { payload: string; at: number };

let chain: Promise<void> = Promise.resolve();

function enqueue<T>(fn: () => Promise<T>): Promise<T> {
  const run = chain.then(fn, fn);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function stamp(value: unknown): number {
  if (value instanceof Date) return value.getTime();
  const t = new Date(String(value)).getTime();
  return Number.isFinite(t) ? t : 0;
}

export async function readCache(key: string, maxAgeSec: number): Promise<string | null> {
  const row = await readCacheRow(key);
  if (!row) return null;
  if (Date.now() - row.at > maxAgeSec * 1000) return null;
  return row.payload;
}

export async function readCacheRow(key: string): Promise<Cached | null> {
  return enqueue(async () => {
    try {
      const sql = await getSql();
      const rows = await sql<{ payload: string; fetched_at: unknown }>`
        select payload, fetched_at from market_cache where cache_key = ${key}
      `;
      const row = rows[0];
      if (!row) return null;
      return { payload: row.payload, at: stamp(row.fetched_at) };
    } catch {
      return null;
    }
  });
}

export async function readCachePrefix(prefix: string): Promise<Map<string, Cached>> {
  return enqueue(async () => {
    const out = new Map<string, Cached>();
    try {
      const sql = await getSql();
      const rows = await sql<{ cache_key: string; payload: string; fetched_at: unknown }>`
        select cache_key, payload, fetched_at
        from market_cache
        where cache_key like ${`${prefix}%`}
      `;
      for (const row of rows) {
        out.set(row.cache_key, { payload: row.payload, at: stamp(row.fetched_at) });
      }
    } catch {
      /* cache is best-effort */
    }
    return out;
  });
}

export async function writeCache(key: string, payload: string): Promise<void> {
  return enqueue(async () => {
    try {
      const sql = await getSql();
      await sql`
        insert into market_cache (cache_key, payload, fetched_at)
        values (${key}, ${payload}, now())
        on conflict (cache_key) do update
          set payload = excluded.payload,
              fetched_at = now()
      `;
    } catch {
      /* cache is best-effort */
    }
  });
}

export async function cacheHealth(): Promise<{ rows: number; klines: number }> {
  return enqueue(async () => {
    try {
      const sql = await getSql();
      const rows = await sql<{ rows: unknown; klines: unknown }>`
        select count(*) as rows,
               sum(case when cache_key like 'k:220:%' then 1 else 0 end) as klines
        from market_cache
      `;
      const row = rows[0];
      return {
        rows: Number(row?.rows ?? 0) || 0,
        klines: Number(row?.klines ?? 0) || 0,
      };
    } catch {
      return { rows: 0, klines: 0 };
    }
  });
}
