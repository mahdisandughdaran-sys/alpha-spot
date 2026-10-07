# آلفا اسپات — Project Proposal and Roadmap

Date: 6 October 2026
Source archive: `grok-workspace-3.zip` (2.3 MB, 345 files)
Local checkout: `~/alpha-spot`

## 1. Goal

Give a Persian-speaking spot trader one auditable answer: among the top 100 coins, which asset is the better **spot** buy **relative to Bitcoin** right now — including the possibility that the answer is Bitcoin.

The product rejects two common shortcuts:

- ranking coins by USD percent change (a coin can be green in dollars and still lag BTC)
- treating every alt as a candidate (stables, wrapped assets, and liquid-staking derivatives are not spot alternatives to BTC)

The desk states its weights, shows the runner-up, and prints caution lines. It is explicitly not a recommendation or a profit guarantee.

## 2. What already exists

### Product surface

Single route, `/`, right-to-left, dark theme (Vazirmatn + IBM Plex Mono).

| State | Behavior |
| --- | --- |
| Idle | Three rules plus the methodology card |
| Loading | Four staged status lines while the server function runs |
| Error | Persian message and a retry button |
| Done | Tabs: انتخاب, رتبه‌ها, روش |

The pick panel shows regime (Bitcoin season / alt rotation / neutral), BTC dominance, confidence, USD and BTC prices, 7-day and 30-day relative strength, reasons, cautions, a 30-day BTC-pair index chart (100 = start of window), and the five factor bars.

The leaderboard shows the top 12 scored rows. The method tab restates the weights.

Browser QA shipped with the archive: desktop 1280×800 and mobile 390×844 both returned HTTP 200, the title «آلفا اسپات», no horizontal overflow, and an empty console. A recorded run picked Ethena (ENA) at 80.7 with Bitcoin dominance 56.4% and a neutral regime.

### Scoring model

Implemented in `src/lib/crypto/`. Weights sum to 1.00:

| Factor | Weight | What it measures |
| --- | --- | --- |
| Relative strength vs BTC | 26% | Capped 7 / 14 / 30 day pair returns, blended, then mixed with a percentile rank |
| Entry | 24% | Daily RSI and distance from the 30-day high. Buying the high and RSI above 70 lose points |
| Trend quality | 18% | Above the 10-day pair SMA, 7-day and 30-day alignment, volume confirmation |
| Spot liquidity | 16% | 24h USD volume, turnover vs market cap, real Binance BTC pair |
| Return / risk | 16% | Pair return divided by volatility, 30-day max drawdown, beta |

Regime adjustment: in a Bitcoin season, BTC gets +6 and lagging alts lose 3. If the best alt beats BTC by less than 3.5 points during Bitcoin season, BTC wins. Extended pumps (7-day relative strength above 18% and still near the 30-day high) are ineligible. Volume under $8M is ineligible.

Universe: CoinPaprika top 100 by rank, stables and pegged/wrapped names removed (`exclusions.ts`). Daily candles from Binance (`BTCUSDT` plus each coin’s `*USDT`), aligned by open time, then divided to form the BTC pair. Results cache in process memory for two minutes.

### Technology

| Layer | Choice |
| --- | --- |
| UI | React 19, TanStack Router / Start, Tailwind CSS 4, Radix slot, Recharts, Lucide |
| Server | TanStack Start server function `runSpotAnalysis` (POST), Vite 8, Nitro (Vercel preset, build only) |
| Data | Public HTTP only. No API keys |
| Auth / DB | Scaffold present (`better-auth`, PGLite, Kysely). Flags in `.grok/app-env.json` are off (`VITE_AUTH_ENABLED=false`, `deploy.database=false`). The desk does not call them |
| Language | TypeScript, Persian copy, RTL document |
| Deploy contract | Vercel (`vercel.json` installs production deps only). Dev bind is `0.0.0.0:8080` |

### What was adjusted for local and Termux use

- Package name is `alpha-spot`. `npm start` and `npm run dev` both serve `0.0.0.0:8080`.
- `startup.sh` no longer assumes `/workspace`. It starts from its own directory and logs to `.dev-server.log`.
- Vazirmatn and IBM Plex Mono are vendored under `public/fonts/`. The page no longer depends on Google Fonts.
- `.gitignore`, `.npmrc`, `.nvmrc` (Node 20), and this report were added.
- Playwright’s browser download is documented as skipped. The desk does not need Chromium.

## 3. Constraints

- CoinPaprika and Binance must be reachable. A blocked network fails the whole analysis; there is no offline snapshot.
- The in-memory cache is per process and lasts two minutes. A restart always refetches.
- About a hundred daily kline requests run with concurrency 14. A slow or rate-limited Binance call drops that coin’s 30-day series; the model then scores it with less depth and a −4 penalty.
- Symbol mapping to Binance is a small hand list (`IOTA`, `RENDER`, `POL`, `TON`, `FET`, `UNI`, `HYPE`). Unknown tickers fall back to the raw symbol.
- RSI uses the classic Wilder smoothing on the **BTC-pair** closes, not the USD chart.
- No accounts, watchlists, alerts, or saved history.
- The archive’s `AGENTS.md` and `.grok/` tree are the original Grok App Builder sandbox contract. They are not required to run the desk.

## 4. Roadmap

### Near term — make the answer trustworthy

1. Unit tests for `math.ts`, `scoring.ts`, and `exclusions.ts` (RSI, drawdown, regime thresholds, stablecoin filter, winner tie-break).
2. A fixture mode: replay a saved CoinPaprika + Binance payload so the UI can be checked without the network.
3. Surface partial failure: how many of the universe actually received 30-day candles, instead of hiding missing klines inside a factor note.
4. Expand the Binance symbol map and log unmapped bases.

### Mid term — a desk a person can reuse

5. Persist the last N runs in the browser (`localStorage`): pick, score, regime, timestamp. Still no accounts.
6. Let the user pin a watchlist and rescore only those names plus BTC.
7. Add a second horizon toggle (spot swing vs shorter 7-day) without hiding the weights.
8. Persian error page. The crash screen in `error-component.tsx` is still English.

### Later — only if the model stays honest

9. Optional sign-in and saved runs, using the scaffold already in `src/lib/auth` and `src/lib/db`. Do this only when a person asks to keep results across devices.
10. Paper-trade log: record the pick’s BTC-pair return 7 and 30 days later, so the weights can be judged. Do not auto-trade.
11. Alert when regime flips or the pick changes by more than a set score gap.

Out of scope until the scoring tests exist: leverage, futures, copy-trading, and any claim of expected return.

## 5. Success check

A local run is successful when `npm run dev` serves the idle desk on port 8080, **تحلیل ۱۰۰ ارز برتر** returns a pick with a score, a runner-up, and either a 30-day chart or an explicit “series incomplete” line, and the footer disclaimer is visible on a phone-width layout.
