import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HistoryPanel } from "@/components/desk/history-panel";
import { Leaderboard } from "@/components/desk/leaderboard";
import { Methodology } from "@/components/desk/methodology";
import { PickPanel } from "@/components/desk/pick-panel";
import { PortfolioPanel } from "@/components/desk/portfolio-panel";
import { runSpotAnalysis } from "@/lib/crypto/analyze";
import {
  loadHistory,
  loadWatch,
  saveRun,
  toggleWatch,
  type RunSummary,
} from "@/lib/crypto/history";
import type { AnalysisResult } from "@/lib/crypto/types";

export const Route = createFileRoute("/")({ component: Home });

const STAGES = [
  "گرفتن رتبه، عرضه و حجم صد ارز برتر",
  "ساخت جفت بیت‌کوین و کندل ۲۰۰ روزه",
  "MC/FDV، EMA ۲۰۰، ساختار هفتگی و OBV",
  "وزن‌دهی فاکتورها، چک‌لیست و پرتفوی",
];

type Tab = "pick" | "table" | "portfolio" | "method" | "history";

function Home() {
  const run = useServerFn(runSpotAnalysis);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("pick");
  const [history, setHistory] = useState<RunSummary[]>([]);
  const [watched, setWatched] = useState<string[]>([]);

  useEffect(() => {
    setHistory(loadHistory());
    setWatched(loadWatch());
  }, []);

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
    return `${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل`;
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
                یک دکمه، صد ارز اول بازار. هر دارایی روی جفت بیت‌کوین، نسبت
                MC/FDV، روند هفتگی و نقدشوندگی سنجیده می‌شود تا بهترین خرید اسپات
                — یا خود بیت‌کوین — مشخص شود.
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
            <nav className="flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]">
              {(
                [
                  ["pick", "انتخاب"],
                  ["table", "رتبه‌ها"],
                  ["portfolio", "پرتفوی"],
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
            {tab === "portfolio" ? (
              <PortfolioPanel sleeves={result.portfolio} />
            ) : null}
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
          t="هسته پرتفوی"
          d="۵۵٪ بیت‌کوین و اتریوم، ۳۰٪ لارج‌کپ، ۱۵٪ میدکپ. اگر آلت‌ها ضعیف باشند خود بیت برنده است."
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
