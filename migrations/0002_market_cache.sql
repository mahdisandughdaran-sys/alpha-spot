-- Public market-data cache. Rows are unowned (no user data, no secrets).
create table if not exists market_cache (
  cache_key text primary key,
  payload text not null,
  fetched_at timestamptz not null default now()
);
