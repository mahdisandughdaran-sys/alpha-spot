import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryPanel } from "@/components/desk/history-panel";
import { KillSwitchBanner } from "@/components/desk/kill-switch-banner";
import { Leaderboard } from "@/components/desk/leaderboard";
import { Methodology } from "@/components/desk/methodology";
import { MonitorPanel } from "@/components/desk/monitor-panel";
import { PickPanel } from "@/components/desk/pick-panel";
import { PortfolioPanel } from "@/components/desk/portfolio-panel";
import { UnlocksPanel } from "@/components/desk/unlocks-panel";
import { BacktestPanel } from "@/components/desk/backtest-panel";
import { ExecutePanel } from "@/components/desk/execute-panel";
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
import { checkDeskPulse, dispatchDeskSignal } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";

export const Route = createFileRoute("/")({ component: Home });

const STAGES = [
  "گرفتن رتبه، عرضه و حجم صد ارز برتر",
  "ساخت جفت بیت‌کوین، EMA ۲۰۰ و ساختار هفتگی",
  "کلید قطع بیت‌کوین، آنلاک، دفتر سفارش و فاندینگ",
  "امتیاز، تعلیق سیگنال و پرتفوی",
];

type Tab = "pick" | "table" | "unlocks" | "portfolio" | "monitor" | "backtest" | "execute" | "method" | "history";

function Home() {
  const run = useServerFn(runSpotAnalysis);
  const pulse = useServerFn(checkDeskPulse);
  const sendAlert = useServerFn(dispatchDeskSignal);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pick");
  const [history, setHistory] = useState<RunSummary[]>([]);
  const [watched, setWatched] = useState<string[]>([]);
  const [flash, setFlash] = useState<string | null>(null);

  useEffect(() => {
    setHistory(loadHistory());
    setWatched(loadWatch());
  }, []);

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
        title: `امتیاز ${result.pick.symbol} زیر ${settings.scoreFloor}`,
        text: `امتیاز فعلی ${result.pick.score.toFixed(1)} است.`,
      });
    }
    for (const symbol of watched) {
      const row = result.top.find((item) => item.symbol === symbol);
      if (row && row.score < settings.scoreFloor) {
        jobs.push({
          id: `watch:${symbol}:${day}`,
          title: `${symbol} در دیده‌بان زیر آستانه است`,
          text: `امتیاز ${row.score.toFixed(1)}.`,
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
          new Notification(job.title, { body: job.text });
        }
        if (settings.webhookUrl || settings.telegramToken) {
          try {
            await sendAlert({
              data: {
                title: job.title,
                text: job.text,
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
                title: beat.headline,
                text: beat.note,
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

  async function onAnalyze() {
    setStatus("loading");
    setError(null);
    setStage(0);
    setTab("pick");
    const timer = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 1100);
    try {
      const data = await run();
      setResult(data);
      setHistory(saveRun(data));
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "تحلیل انجام نشد. دوباره تلاش کنید.");
    } finally {
      window.clearInterval(timer);
    }
  }

  const headerMeta = useMemo(() => {
    if (!result) return null;
    return `${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل · ${
      result.dataCache === "live" ? "داده زنده" : result.dataCache === "memory" ? "از حافظه" : "از کش ذخیره‌شده"
    }`;
  }, [result]);

  return (
    <main className="desk-grid min-h-dvh">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs text-subtle">
            <Activity className="size-3.5" />
            میز اسپات · جفت بیت‌کوین · توکنومیکس
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-medium tracking-tight text-fg md:text-5xl">
                آلفا اسپات
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted">
                صد ارز اول روی جفت بیت‌کوین، نسبت MC/FDV و سه لایه ریسک سازمانی
                سنجیده می‌شوند: کلید قطع بیت‌کوین، جریمه کلیف آنلاک، و قوانین خروج
                و چرخش سبد.
              </p>
            </div>
            <Button
              size="lg"
              onClick={onAnalyze}
              disabled={status === "loading"}
              className="h-12 min-w-52 shrink-0"
            >
              {status === "loading" ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  در حال تحلیل
                </>
              ) : result ? (
                "تحلیل دوباره"
              ) : (
                "تحلیل ۱۰۰ ارز برتر"
              )}
            </Button>
          </div>
          {headerMeta ? <p className="text-xs text-subtle">{headerMeta}</p> : null}
          {flash ? <p className="text-sm text-warn">{flash}</p> : null}
        </header>

        {status === "idle" ? <IdleState /> : null}

        {status === "loading" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-fg">{STAGES[stage]}</p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
            </div>
            <p className="mt-3 text-xs text-subtle">
              کندل ۲۰۰ روزه برای EMA و ساختار هفتگی گرفته می‌شود؛ کمی بیشتر از قبل طول می‌کشد.
            </p>
          </section>
        ) : null}

        {status === "error" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-down">تحلیل کامل نشد</p>
            <p className="mt-2 text-sm text-muted">{error}</p>
            <Button className="mt-4" onClick={onAnalyze}>
              تلاش دوباره
            </Button>
          </section>
        ) : null}

        {status === "done" && result ? (
          <>
            <KillSwitchBanner kill={result.killSwitch} />
            <nav className="flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]">
              {(
                [
                  ["pick", "انتخاب"],
                  ["table", "رتبه‌ها"],
                  ["unlocks", "آنلاک"],
                  ["portfolio", "پرتفوی"],
                  ["monitor", "پایش سبد"],
                  ["backtest", "بک‌تست"],
                  ["execute", "اجرا"],
                  ["method", "روش"],
                  ["history", "سابقه"],
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
            {tab === "pick" ? <PickPanel result={result} /> : null}
            {tab === "table" ? (
              <Leaderboard
                rows={result.top}
                picked={result.pick.symbol}
                watched={watched}
                onToggleWatch={(symbol) => setWatched(toggleWatch(symbol))}
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
            {tab === "execute" ? <ExecutePanel result={result} /> : null}
            {tab === "method" ? <Methodology /> : null}
            {tab === "history" ? <HistoryPanel runs={history} /> : null}
          </>
        ) : null}

        <footer className="border-t border-border pt-4 text-xs leading-relaxed text-subtle">
          آلفا اسپات توصیه سرمایه‌گذاری نیست. مدل روی دادهٔ عمومی بازار کار می‌کند و
          می‌تواند اشتباه کند. مسئولیت معامله با شماست.
        </footer>
      </div>
    </main>
  );
}

function IdleState() {
  return (
    <div className="flex flex-col gap-6">
      <ul className="grid gap-3 sm:grid-cols-2">
        <IdleCard
          k="۰۱"
          t="جفت BTC"
          d="بازده هر ارز نسبت به بیت‌کوین محاسبه می‌شود. سبزِ دلاری اگر از BTC عقب باشد، امتیاز نمی‌گیرد."
        />
        <IdleCard
          k="۰۲"
          t="MC / FDV"
          d="اگر کمتر از نیمی از توکن‌ها در گردش باشد، آزادسازی فشار فروش می‌سازد. اولویت با نسبت بالای ۰٫۷ است."
        />
        <IdleCard
          k="۰۳"
          t="روند کلان، نه سقف"
          d="EMA ۲۰۰، ساختار هفتگی و RSI جلوِ خرید هیجانی را می‌گیرند. قدرت نسبی داغ بدون نقطه ورود، برنده نیست."
        />
        <IdleCard
          k="۰۴"
          t="سه لایه ریسک"
          d="کلید قطع BTC، جریمه آنلاک بالای ۳٪ عرضه، و پایش خروج اگر ALT/BTC بشکند یا امتیاز زیر ۶۰ بیاید."
        />
      </ul>
      <Methodology />
    </div>
  );
}

function IdleCard({ k, t, d }: { k: string; t: string; d: string }) {
  return (
    <li className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="num text-xs text-subtle">{k}</p>
      <p className="mt-2 text-sm text-fg">{t}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{d}</p>
    </li>
  );
}
