import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AlertStrip } from "@/components/desk/alert-strip";
import { GithubStar } from "@/components/desk/github-star";
import { HistoryPanel } from "@/components/desk/history-panel";
import { KillSwitchBanner } from "@/components/desk/kill-switch-banner";
import { Leaderboard } from "@/components/desk/leaderboard";
import { LiveBadge } from "@/components/desk/live-badge";
import { LocaleSwitch } from "@/components/desk/locale-switch";
import { Methodology } from "@/components/desk/methodology";
import { MonitorPanel } from "@/components/desk/monitor-panel";
import { PickPanel } from "@/components/desk/pick-panel";
import { PortfolioPanel } from "@/components/desk/portfolio-panel";
import { CoinMark } from "@/components/desk/coin-mark";
import { FlashValue } from "@/components/desk/flash-value";
import { QuickFilters } from "@/components/desk/quick-filters";
import { UnlocksPanel } from "@/components/desk/unlocks-panel";
import { BacktestPanel } from "@/components/desk/backtest-panel";
import { DepthPanel } from "@/components/desk/depth-panel";
import { ExecutePanel } from "@/components/desk/execute-panel";
import { VenuePanel } from "@/components/desk/venue-panel";
import { OpportunityPanel } from "@/components/desk/opportunity-panel";
import { ConfluencePanel } from "@/components/desk/confluence-panel";
import { runSpotAnalysis } from "@/lib/crypto/analyze";
import {
  hasSeen,
  loadDeskSettings,
  markSeen,
  pushAlert,
} from "@/lib/crypto/desk-client";
import {
  loadHistory,
  loadWatch,
  saveRun,
  toggleWatch,
  type RunSummary,
} from "@/lib/crypto/history";
import { checkDeskPulse, checkOpportunityQuotes, dispatchDeskSignal } from "@/lib/crypto/ops";
import {
  alertsFromQuotes,
  alertsFromScan,
  loadOppAlerts,
  loadOppSnapshot,
  saveOppAlerts,
  saveOppSnapshot,
} from "@/lib/crypto/opportunity-alerts";
import type { AnalysisResult } from "@/lib/crypto/types";
import { applyDeskFilter, type DeskFilter } from "@/lib/crypto/risk-view";
import { formatUsd } from "@/components/desk/format";
import { plain, msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";

export const Route = createFileRoute("/")({ component: Home });

type Tab = "pick" | "flow" | "opportunity" | "table" | "unlocks" | "portfolio" | "monitor" | "backtest" | "depth" | "execute" | "venue" | "method" | "history";

function Home() {
  const { tr, locale } = useI18n();
  const run = useServerFn(runSpotAnalysis);
  const pulse = useServerFn(checkDeskPulse);
  const quotes = useServerFn(checkOpportunityQuotes);
  const sendAlert = useServerFn(dispatchDeskSignal);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pick");
  const [history, setHistory] = useState<RunSummary[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);
  const [live, setLive] = useState<Record<string, number>>({});
  const [sync, setSync] = useState<"connecting" | "live" | "delayed">("connecting");
  const [lens, setLens] = useState<DeskFilter>("all");
  const [flowOnly, setFlowOnly] = useState(false);

  const stages = [
    tr("گرفتن رتبه، عرضه و حجم صد ارز برتر", "Fetching rank, supply, and volume for the top 100"),
    tr("ساخت جفت بیت‌کوین، EMA ۲۰۰ و ساختار هفتگی", "Building the Bitcoin pair, the 200 EMA, and weekly structure"),
    tr("محدوده حمایت، تأیید و ابطال برای فهرست انتظار", "Support, confirmation, and invalidation for the watchlist"),
    tr("کلید قطع بیت‌کوین، آنلاک، دفتر سفارش، سود باز و فاندینگ", "Bitcoin kill-switch, unlocks, order book, open interest, and funding"),
    tr("امتیاز، تعلیق سیگنال و پرتفوی", "Score, signal suspension, and the portfolio"),
  ];

  useEffect(() => {
    setHistory(loadHistory());
    setWatched(loadWatch());
  }, []);

  const quoteSymbols = useMemo(() => {
    const base = ["BTC", "ETH", "SOL", "BNB", "XRP", "TON", "LINK", "AVAX", "SUI", "NEAR"];
    if (!result) return base;
    return [...new Set([result.pick.symbol, ...result.top.slice(0, 24).map((row) => row.symbol), ...base])];
  }, [result]);

  useEffect(() => {
    let stop = false;
    async function tick() {
      try {
        const rows = await quotes({ data: { symbols: quoteSymbols } });
        if (stop) return;
        if (!rows.length) {
          setSync((prev) => (prev === "live" ? "delayed" : prev === "connecting" ? "delayed" : prev));
          return;
        }
        setLive((prev) => {
          const next = { ...prev };
          for (const row of rows) next[row.symbol] = row.price;
          return next;
        });
        setSync("live");
      } catch {
        if (!stop) setSync("delayed");
      }
    }
    void tick();
    const id = window.setInterval(tick, 12_000);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [quoteSymbols, quotes]);

  useEffect(() => {
    if (!result) return;
    const settings = loadDeskSettings();
    const day = new Date().toISOString().slice(0, 10);
    const jobs: { id: string; title: string; text: string }[] = [];
    if (settings.alertKill && result.killSwitch.status !== "NORMAL") {
      jobs.push({
        id: `kill:${result.killSwitch.status}:${day}`,
        title: result.killSwitch.headline,
        text: result.killSwitch.note,
      });
    }
    if (settings.alertScore && result.pick.score < settings.scoreFloor) {
      jobs.push({
        id: `score:${result.pick.symbol}:${day}`,
        title: msg(
          `امتیاز ${result.pick.symbol} زیر ${settings.scoreFloor}`,
          `${result.pick.symbol} score is under ${settings.scoreFloor}`,
        ),
        text: msg(
          `امتیاز فعلی ${result.pick.score.toFixed(1)} است.`,
          `Current score is ${result.pick.score.toFixed(1)}.`,
        ),
      });
    }
    for (const symbol of watched) {
      const row = result.top.find((item) => item.symbol === symbol);
      if (row && row.score < settings.scoreFloor) {
        jobs.push({
          id: `watch:${symbol}:${day}`,
          title: msg(`${symbol} در دیده‌بان زیر آستانه است`, `${symbol} on the watchlist is under the floor`),
          text: msg(`امتیاز ${row.score.toFixed(1)}.`, `Score ${row.score.toFixed(1)}.`),
        });
      }
    }
    let cancelled = false;
    void (async () => {
      for (const job of jobs) {
        if (cancelled || hasSeen(job.id)) continue;
        markSeen(job.id);
        pushAlert({ id: job.id, at: new Date().toISOString(), title: job.title, text: job.text });
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(tr(job.title), { body: tr(job.text) });
        }
        if (settings.webhookUrl || settings.telegramToken) {
          try {
            await sendAlert({
              data: {
                title: plain(job.title),
                text: plain(job.text),
                kind: "alert",
                orders: [],
                webhookUrl: settings.webhookUrl,
                telegramToken: settings.telegramToken,
                telegramChat: settings.telegramChat,
              },
            });
          } catch {
            /* مقصد هشدار اختیاری است */
          }
        }
        if (!cancelled) setFlash(job.title);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [result, sendAlert, watched]);

  useEffect(() => {
    if (!result?.opportunities) return;
    const prev = loadOppSnapshot();
    const fresh = alertsFromScan(prev, result.opportunities.items, result.generatedAt);
    saveOppSnapshot(result.opportunities.items);
    if (fresh.length === 0) return;
    let cancelled = false;
    void (async () => {
      const settings = loadDeskSettings();
      let stored = loadOppAlerts();
      for (const alert of fresh) {
        if (cancelled || hasSeen(alert.id)) continue;
        markSeen(alert.id);
        stored = [alert, ...stored.filter((row) => row.id !== alert.id)].slice(0, 40);
        pushAlert({ id: alert.id, at: alert.at, title: alert.title, text: alert.text });
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          new Notification(tr(alert.title), { body: tr(alert.text) });
        }
        if (settings.webhookUrl || settings.telegramToken) {
          try {
            await sendAlert({
              data: {
                title: plain(alert.title),
                text: plain(alert.text),
                kind: "alert",
                orders: [],
                webhookUrl: settings.webhookUrl,
                telegramToken: settings.telegramToken,
                telegramChat: settings.telegramChat,
              },
            });
          } catch {
            /* مقصد هشدار اختیاری است */
          }
        }
        if (!cancelled) setFlash(alert.title);
      }
      if (!cancelled) saveOppAlerts(stored);
    })();
    return () => {
      cancelled = true;
    };
  }, [result, sendAlert]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void (async () => {
        const settings = loadDeskSettings();
        if (!settings.alertKill) return;
        try {
          const beat = await pulse();
          if (beat.status === "NORMAL") return;
          const day = new Date().toISOString().slice(0, 10);
          const key = `pulse:${beat.status}:${day}`;
          if (hasSeen(key)) return;
          markSeen(key);
          pushAlert({ id: key, at: beat.at, title: beat.headline, text: beat.note });
          if (settings.webhookUrl || settings.telegramToken) {
            await sendAlert({
              data: {
                title: plain(beat.headline),
                text: plain(beat.note),
                kind: "alert",
                orders: [],
                webhookUrl: settings.webhookUrl,
                telegramToken: settings.telegramToken,
                telegramChat: settings.telegramChat,
              },
            });
          }
          setFlash(beat.headline);
        } catch {
          /* پالس سبک است؛ خطای شبکه سکوت می‌ماند */
        }
      })();
    }, 180_000);
    return () => window.clearInterval(id);
  }, [pulse, sendAlert]);

  useEffect(() => {
    const id = window.setInterval(() => {
      void (async () => {
        const snap = loadOppSnapshot();
        if (snap.length === 0) return;
        try {
          const live = await quotes({ data: { symbols: snap.map((row) => row.symbol) } });
          const found = alertsFromQuotes(snap, live, new Date().toISOString());
          const settings = loadDeskSettings();
          let stored = loadOppAlerts();
          for (const alert of found) {
            if (hasSeen(alert.id)) continue;
            markSeen(alert.id);
            stored = [alert, ...stored.filter((row) => row.id !== alert.id)].slice(0, 40);
            pushAlert({ id: alert.id, at: alert.at, title: alert.title, text: alert.text });
            if (settings.webhookUrl || settings.telegramToken) {
              await sendAlert({
                data: {
                  title: plain(alert.title),
                  text: plain(alert.text),
                  kind: "alert",
                  orders: [],
                  webhookUrl: settings.webhookUrl,
                  telegramToken: settings.telegramToken,
                  telegramChat: settings.telegramChat,
                },
              });
            }
            setFlash(alert.title);
          }
          saveOppAlerts(stored);
        } catch {
          /* قیمت لحظه‌ای اختیاری است */
        }
      })();
    }, 180_000);
    return () => window.clearInterval(id);
  }, [quotes, sendAlert]);

  async function onAnalyze() {
    setStatus("loading");
    setError(null);
    setStage(0);
    setTab("pick");
    const timer = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, stages.length - 1));
    }, 1100);
    try {
      const data = await run();
      setResult(data);
      setHistory(saveRun(data));
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : msg("تحلیل انجام نشد. دوباره تلاش کنید.", "The analysis did not finish. Try again."));
    } finally {
      window.clearInterval(timer);
    }
  }

  const headerMeta = useMemo(() => {
    if (!result) return null;
    const cacheFa =
      result.dataCache === "live" ? "داده زنده" : result.dataCache === "memory" ? "از حافظه" : "از کش ذخیره‌شده";
    const cacheEn =
      result.dataCache === "live" ? "live data" : result.dataCache === "memory" ? "from memory" : "from stored cache";
    return tr(
      `${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل · ${cacheFa} · کش سرور ${result.cacheKlines ?? 0} کندل`,
      `${result.universeSize} of the top 100 — stables and wrapped assets removed · ${result.klinesOk} complete candles · ${cacheEn} · server cache ${result.cacheKlines ?? 0} candles`,
    );
  }, [result, tr, locale]);

  return (
    <main className="desk-grid min-h-dvh">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
            <div className="flex items-center gap-2">
              <Activity className="size-3.5" />
              <span className="num tracking-widest">ALPHA SPOT</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <LocaleSwitch />
              <GithubStar />
              <LiveBadge state={sync} />
            </div>
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-medium tracking-tight text-fg md:text-5xl">
                {tr("آلفا اسپات", "Alpha Spot")}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {tr(
                  "هر ارز با نمادش دیده می‌شود. مدل صد دارایی اول را در برابر بیت‌کوین می‌سنجد، و میز همگرایی جریان حجم، نقشه لیکوییدیشن و حجم مجاز خرید را روی همان نماد حساب می‌کند.",
                  "Every asset is shown with its ticker. The model ranks the top 100 against Bitcoin, and the desk scores volume confluence, the liquidation map, and a buy size on that same ticker.",
                )}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  setFlowOnly(true);
                  setTab("flow");
                }}
                className="h-12 min-w-44"
              >
                {tr("همگرایی حجم", "Volume confluence")}
              </Button>
              <Button
                size="lg"
                onClick={onAnalyze}
                disabled={status === "loading"}
                className="h-12 min-w-52"
              >
              {status === "loading" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  {tr("در حال تحلیل", "Analyzing")}
                </>
              ) : result ? (
                tr("تحلیل دوباره", "Run again")
              ) : (
                tr("تحلیل ۱۰۰ ارز برتر", "Rank the top 100")
              )}
            </Button>
            </div>
          </div>
          {headerMeta ? <p className="text-xs text-subtle">{headerMeta}</p> : null}
          {flash ? <p className="text-sm text-warn">{tr(flash)}</p> : null}
        </header>

        {status === "idle" && flowOnly ? (
          <div className="flex flex-col gap-4">
            <button type="button" onClick={() => setFlowOnly(false)} className="self-start text-sm text-muted">
              {tr("بازگشت به معرفی میز", "Back to the desk intro")}
            </button>
            <ConfluencePanel defaultSymbol="BTC" />
          </div>
        ) : null}

        {status === "idle" && !flowOnly ? <IdleState live={live} /> : null}

        {status === "loading" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-fg">{stages[stage]}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
            </div>
            <p className="mt-3 text-xs text-subtle">
              {tr(
                "کندل ۲۰۰ روزه برای EMA و ساختار هفتگی گرفته می‌شود؛ کمی بیشتر از قبل طول می‌کشد.",
                "200 daily candles are pulled for the EMA and weekly structure, so this takes a little longer.",
              )}
            </p>
          </section>
        ) : null}

        {status === "error" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-down">{tr("تحلیل کامل نشد", "The analysis did not finish")}</p>
            <p className="mt-2 text-sm text-muted">{error ? tr(error) : null}</p>
            <Button className="mt-4" onClick={onAnalyze}>
              {tr("تلاش دوباره", "Try again")}
            </Button>
          </section>
        ) : null}

        {status === "done" && result ? (
          <>
            <KillSwitchBanner kill={result.killSwitch} />
            <AlertStrip rows={result.top} kill={result.killSwitch} />
            <QuickFilters
              value={lens}
              onChange={(next) => {
                setLens(next);
                setTab("table");
              }}
            />
            <SymbolTape rows={result.top} picked={result.pick.symbol} live={live} />
            <nav className="flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]">
              {(
                [
                  ["pick", tr("انتخاب", "Pick")],
                  ["flow", tr("همگرایی", "Confluence")],
                  ["opportunity", tr("فرصت‌ها", "Setups")],
                  ["table", tr("رتبه‌ها", "Ranks")],
                  ["unlocks", tr("آنلاک", "Unlocks")],
                  ["portfolio", tr("پرتفوی", "Portfolio")],
                  ["monitor", tr("پایش سبد", "Book watch")],
                  ["backtest", tr("بک‌تست", "Backtest")],
                  ["depth", tr("عمق", "Depth")],
                  ["execute", tr("وب‌هوک", "Webhook")],
                  ["venue", tr("صرافی", "Venue")],
                  ["method", tr("روش", "Method")],
                  ["history", tr("سابقه", "History")],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={
                    tab === id
                      ? "h-11 min-w-20 flex-1 rounded-md bg-elevated px-3 text-sm text-fg"
                      : "h-11 min-w-20 flex-1 rounded-md px-3 text-sm text-muted hover:text-fg"
                  }
                >
                  {label}
                </button>
              ))}
            </nav>
            {tab === "pick" ? <PickPanel result={result} live={live} /> : null}
            {tab === "flow" ? <ConfluencePanel key={result.pick.symbol} defaultSymbol={result.pick.symbol} /> : null}
            {tab === "opportunity" ? <OpportunityPanel board={result.opportunities} /> : null}
            {tab === "table" ? (
              <Leaderboard
                rows={applyDeskFilter(result.top, lens)}
                picked={result.pick.symbol}
                watched={watched}
                onToggleWatch={(symbol) => setWatched(toggleWatch(symbol))}
                live={live}
                filter={lens}
              />
            ) : null}
            {tab === "unlocks" ? (
              <UnlocksPanel
                rows={result.top}
                source={result.unlockSource}
                matched={result.unlockMatched}
              />
            ) : null}
            {tab === "portfolio" ? <PortfolioPanel result={result} /> : null}
            {tab === "monitor" ? <MonitorPanel result={result} /> : null}
            {tab === "backtest" ? <BacktestPanel /> : null}
            {tab === "depth" ? <DepthPanel books={result.books} /> : null}
            {tab === "execute" ? <ExecutePanel result={result} /> : null}
            {tab === "venue" ? <VenuePanel result={result} /> : null}
            {tab === "method" ? <Methodology /> : null}
            {tab === "history" ? <HistoryPanel runs={history} /> : null}
          </>
        ) : null}

        <footer className="border-t border-border pt-4 text-xs leading-relaxed text-subtle">
          {tr(
            "آلفا اسپات توصیه سرمایه‌گذاری نیست. مدل روی دادهٔ عمومی بازار کار می‌کند و می‌تواند اشتباه کند. مسئولیت معامله با شماست.",
            "Alpha Spot is not investment advice. The model reads public market data and can be wrong. The trade is yours.",
          )}
        </footer>
      </div>
    </main>
  );
}

function IdleState({ live }: { live: Record<string, number> }) {
  const { tr, locale } = useI18n();
  return (
    <div className="flex flex-col gap-6">
      <section className="rounded-xl bg-surface p-5">
        <p className="text-xs text-subtle">
          {tr("نمادهایی که میز در برابر بیت‌کوین می‌سنجد · قیمت لحظه‌ای", "Tickers the desk scores against Bitcoin · live price")}
        </p>
        <ul className="mt-4 flex gap-2 overflow-x-auto pb-1">
          {MAJORS.map(([symbol, fa, en]) => (
            <li key={symbol} className="min-w-40 shrink-0 rounded-lg bg-elevated px-3 py-3">
              <CoinMark symbol={symbol} name={locale === "en" ? en : fa} size="sm" />
              <p className="mt-2 text-xs text-subtle">
                {live[symbol] != null ? (
                  <FlashValue id={`idle:${symbol}`} value={live[symbol]} format={(n) => `$${formatUsd(n)}`} className="text-fg" />
                ) : (
                  <span className="num">—</span>
                )}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <ul className="grid gap-3 sm:grid-cols-2">
        <IdleCard
          k="01"
          t={tr("جفت BTC", "BTC pair")}
          d={tr(
            "بازده هر ارز نسبت به بیت‌کوین محاسبه می‌شود. سبزِ دلاری اگر از BTC عقب باشد، امتیاز نمی‌گیرد.",
            "Returns are measured against Bitcoin. A green USD chart that still lags BTC does not score.",
          )}
        />
        <IdleCard
          k="02"
          t="MC / FDV"
          d={tr(
            "اگر کمتر از نیمی از توکن‌ها در گردش باشد، آزادسازی فشار فروش می‌سازد. اولویت با نسبت بالای ۰٫۷ است.",
            "If less than half the tokens are circulating, unlocks create sell pressure. Ratios above 0.7 rank higher.",
          )}
        />
        <IdleCard
          k="03"
          t={tr("روند کلان، نه سقف", "Macro trend, not the high")}
          d={tr(
            "EMA ۲۰۰، ساختار هفتگی و RSI جلوِ خرید هیجانی را می‌گیرند. قدرت نسبی داغ بدون نقطه ورود، برنده نیست.",
            "The 200 EMA, weekly structure, and RSI block chase buys. Hot relative strength without an entry is not the winner.",
          )}
        />
        <IdleCard
          k="04"
          t={tr("سه لایه ریسک", "Three risk layers")}
          d={tr(
            "کلید قطع BTC، جریمه آنلاک بالای ۳٪ عرضه، و پایش خروج اگر ALT/BTC بشکند یا امتیاز زیر ۶۰ بیاید.",
            "A BTC kill-switch, a penalty when unlocks exceed 3% of supply, and an exit watch if ALT/BTC breaks or the score falls under 60.",
          )}
        />
      </ul>
      <Methodology />
    </div>
  );
}

function SymbolTape({
  rows,
  picked,
  live,
}: {
  rows: AnalysisResult["top"];
  picked: string;
  live: Record<string, number>;
}) {
  const { tr } = useI18n();
  return (
    <section>
      <p className="text-xs text-subtle">{tr("ده ارز اول مدل، هر کدام با نماد", "The model’s top ten, each with its ticker")}</p>
      <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {rows.slice(0, 10).map((row, i) => {
          const on = row.symbol === picked;
          const price = live[row.symbol] ?? row.priceUsd;
          return (
            <li
              key={row.id}
              className={
                on
                  ? "min-w-48 shrink-0 rounded-lg bg-elevated px-3 py-3"
                  : "min-w-48 shrink-0 rounded-lg bg-surface px-3 py-3"
              }
            >
              <div className="mb-2 flex items-center justify-between text-xs text-subtle">
                <span className="num">{i + 1}</span>
                {on ? <span className="text-fg">{tr("انتخاب", "Pick")}</span> : <span>{tr("رتبه", "Rank")}</span>}
              </div>
              <CoinMark symbol={row.symbol} name={row.name} size="sm" />
              <p className="mt-2">
                <FlashValue id={`tape:${row.symbol}`} value={price} format={(n) => `$${formatUsd(n)}`} className="text-sm text-fg" />
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

const MAJORS: [string, string, string][] = [
  ["BTC", "بیت‌کوین", "Bitcoin"],
  ["ETH", "اتریوم", "Ethereum"],
  ["SOL", "سولانا", "Solana"],
  ["BNB", "بی‌ان‌بی", "BNB"],
  ["XRP", "ریپل", "XRP"],
  ["TON", "تون", "Toncoin"],
  ["LINK", "چین‌لینک", "Chainlink"],
  ["AVAX", "آوالانچ", "Avalanche"],
  ["SUI", "سویی", "Sui"],
  ["NEAR", "نیر", "NEAR"],
];

function IdleCard({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <li className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="num text-xs text-subtle">{k}</p>
      <p className="mt-2 text-sm text-fg">{t}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{d}</p>
    </li>
  );
}
