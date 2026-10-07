import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Activity, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Leaderboard } from "@/components/desk/leaderboard";
import { Methodology } from "@/components/desk/methodology";
import { PickPanel } from "@/components/desk/pick-panel";
import { runSpotAnalysis } from "@/lib/crypto/analyze";
import type { AnalysisResult } from "@/lib/crypto/types";

export const Route = createFileRoute("/")({ component: Home });

const STAGES = [
  "گرفتن رتبه و حجم صد ارز برتر",
  "ساخت قیمت بر حسب جفت بیت‌کوین",
  "محاسبه RSI، اصلاح و بازده به ریسک",
  "وزن‌دهی فاکتورها و انتخاب نهایی",
];

function Home() {
  const run = useServerFn(runSpotAnalysis);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [stage, setStage] = useState(0);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<"pick" | "table" | "method">("pick");

  async function onAnalyze() {
    setStatus("loading");
    setError(null);
    setStage(0);
    setTab("pick");
    const timer = window.setInterval(() => {
      setStage((s) => Math.min(s + 1, STAGES.length - 1));
    }, 900);
    try {
      const data = await run();
      setResult(data);
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
    return `${result.universeSize} ارز از صد تای اول بازار — استیبل و رپد حذف شده`;
  }, [result]);

  return (
    <main className="desk-grid min-h-dvh">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col gap-6">
          <div className="flex items-center gap-2 text-xs text-subtle">
            <Activity className="size-3.5" />
            میز اسپات · معیار جفت بیت‌کوین
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-medium tracking-tight text-fg md:text-5xl">
                آلفا اسپات
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted">
                یک دکمه، صد ارز اول بازار. قبل از دلار، هر دارایی روی جفت بیت‌کوین
                سنجیده می‌شود تا بهترین خرید اسپات — یا خود بیت‌کوین — مشخص شود.
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
              داده زنده گرفته می‌شود؛ معمولاً چند ثانیه طول می‌کشد.
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
            <nav className="flex gap-1 rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]">
              {(
                [
                  ["pick", "انتخاب"],
                  ["table", "رتبه‌ها"],
                  ["method", "روش"],
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setTab(id)}
                  className={
                    tab === id
                      ? "h-10 flex-1 rounded-md bg-elevated text-sm text-fg"
                      : "h-10 flex-1 rounded-md text-sm text-muted hover:text-fg"
                  }
                >
                  {label}
                </button>
              ))}
            </nav>
            {tab === "pick" ? <PickPanel result={result} /> : null}
            {tab === "table" ? (
              <Leaderboard rows={result.top} picked={result.pick.symbol} />
            ) : null}
            {tab === "method" ? <Methodology /> : null}
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
      <ul className="grid gap-3 md:grid-cols-3">
        <IdleCard
          k="۰۱"
          t="جفت BTC"
          d="بازده هر ارز نسبت به بیت‌کوین محاسبه می‌شود. سبزِ دلاری اگر از BTC عقب باشد، امتیاز نمی‌گیرد."
        />
        <IdleCard
          k="۰۲"
          t="نخریدن سقف"
          d="RSI و فاصله از اوج ۳۰ روزه جلوِ خرید هیجانی را می‌گیرند. قدرت نسبیِ داغ بدون نقطه ورود خوب، برنده نیست."
        />
        <IdleCard
          k="۰۳"
          t="بیت، اگر آلت ضعیف باشد"
          d="در فصل بیت‌کوین مدل اجازه می‌دهد خود BTC بهترین خرید اسپات باشد. تعصب روی آلت ندارد."
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
