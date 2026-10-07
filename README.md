# آلفا اسپات (Alpha Spot)

Persian, right-to-left spot desk. One button ranks the top 100 crypto assets **against Bitcoin**, then names a single spot buy — or Bitcoin itself when alts are weak.

This is a TanStack Start + React 19 app. Auth and the database are **off**. Live quotes come from CoinPaprika and Binance public APIs. Nothing is stored on the server.

## What you need

- Node.js 20 or newer (`node -v`)
- npm 10 or newer
- Outbound HTTPS to `api.coinpaprika.com` and `data-api.binance.vision`

On Termux:

```sh
pkg install nodejs
```

## Unpack

If you still have the archive:

```sh
mkdir -p ~/alpha-spot
unzip -o /storage/emulated/0/Download/grok-workspace-3.zip -d ~/alpha-spot
cd ~/alpha-spot
```

The copy already prepared on this machine is `~/alpha-spot`.

## Install and run

Skip the Playwright browser download. The desk does not use it, and Chromium is not available in Termux.

```sh
cd ~/alpha-spot
export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1
npm install
npm run dev
```

`npm start` is the same command.

The dev server listens on **all interfaces**, port **8080**:

- this device: <http://127.0.0.1:8080>
- another device on the same Wi-Fi: `http://<phone-ip>:8080`

Find the phone address with:

```sh
ip -4 addr show wlan0 | awk '/inet / {print $2}'
```

Leave the terminal open. Stop the server with Ctrl+C.

### Background start

```sh
cd ~/alpha-spot
sh startup.sh
tail -f .dev-server.log
```

`startup.sh` exits immediately if port 8080 is already answering.

## Use the desk

1. Open the URL above. The idle screen explains the three rules: BTC pair, do not buy the high, Bitcoin can win.
2. Tap **تحلیل ۱۰۰ ارز برتر**.
3. Wait a few seconds. The server pulls the top ranks, builds each coin’s BTC-pair series, and scores five factors.
4. Read **انتخاب** (the pick, reasons, 30-day BTC-pair chart, factor bars).
5. Open **رتبه‌ها** for the top 12 scores, or **روش** for the weights.
6. Tap **تحلیل دوباره** to refresh. Results are cached for two minutes.

This is not investment advice.

## Other scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Dev server on `0.0.0.0:8080` |
| `npm run build` | Production build. Skips Postgres when `DATABASE_URL` is unset |
| `npm run preview` | Serve the build on `127.0.0.1:8081` |
| `npm run typecheck` | TypeScript, no emit |
| `npm test` | Script and auth-gate unit tests |
| `npm run lint` | ESLint |

`DATABASE_URL` is optional. Leave it unset for local use.

## Layout

```text
src/routes/index.tsx          desk UI (idle, loading, pick / ranks / method)
src/components/desk/          pick card, chart, factor bars, leaderboard
src/lib/crypto/               fetch, scoring, exclusions, Persian explanations
public/fonts/                 Vazirmatn + IBM Plex Mono (no Google Fonts)
startup.sh                    portable restart helper
```

Auth, Better Auth, and PGLite stay in `src/lib` for the original scaffold. This app does not import them on the request path.
