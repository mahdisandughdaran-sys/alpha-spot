import { Bitcoin, ShieldAlert, ArrowUpRight } from "lucide-react";
import type { AnalysisResult } from "@/lib/crypto/types";
import {
  btcPriceLabel,
  confidenceTitle,
  dominanceTitle,
  regimeTitle,
} from "@/lib/crypto/explain";
import { Badge } from "@/components/ui/badge";
import { BtcPairChart } from "./btc-chart";
import { ChecklistCard } from "./checklist-card";
import { FactorBars } from "./factor-bars";
import { formatPct, formatPctPoints, formatScore, formatUsd, timeAgoFa } from "./format";

function toneFor(n: number): "up" | "down" | "neutral" {
  if (n > 0.001) return "up";
  if (n < -0.001) return "down";
  return "neutral";
}

export function PickPanel({ result }: { result: AnalysisResult }) {
  const { pick, runnerUp } = result;
  const confTone =
    result.confidence === "high" ? "up" : result.confidence === "low" ? "down" : "neutral";
  const coverage =
    result.klinesTried > 0
      ? Math.round((result.klinesOk / result.universeSize) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        <Badge>{regimeTitle(result.regime)}</Badge>
        <Badge>
          دامیننس BTC
          <span className="num ms-1">{result.btcDominance.toFixed(1)}٪</span>
        </Badge>
        <Badge
          tone={
            result.dominanceBias === "falling"
              ? "up"
              : result.dominanceBias === "rising"
                ? "down"
                : "neutral"
          }
        >
          {dominanceTitle(result.dominanceBias)}
        </Badge>
        <Badge tone={confTone}>{confidenceTitle(result.confidence)}</Badge>
        <span className="text-xs text-subtle">
          به‌روز {timeAgoFa(result.generatedAt)} · {result.sources.join(" + ")} · کندل{" "}
          <span className="num">{coverage}٪</span>
        </span>
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7">
        <p className="text-xs tracking-wide text-subtle">بهترین خرید اسپات الان</p>
        <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              {pick.symbol === "BTC" ? (
                <Bitcoin className="size-8 text-accent" strokeWidth={1.5} />
              ) : (
                <ArrowUpRight className="size-8 text-accent" strokeWidth={1.5} />
              )}
              <div>
                <h2 className="text-3xl font-medium tracking-tight text-fg md:text-4xl">
                  {pick.name}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  <span className="num">{pick.symbol}</span>
                  <span className="mx-2 text-subtle">·</span>
                  رتبه بازار
                  <span className="num ms-1">#{pick.rank}</span>
                  {pick.narrativeTagsFa[0] ? (
                    <>
                      <span className="mx-2 text-subtle">·</span>
                      {pick.narrativeTagsFa[0]}
                    </>
                  ) : null}
                </p>
              </div>
            </div>
          </div>
          <div className="text-start md:text-end">
            <p className="text-xs text-subtle">امتیاز اسپات</p>
            <p className="num text-4xl font-medium tracking-tight text-fg">
              {formatScore(pick.score)}
            </p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="قیمت دلار" value={`$${formatUsd(pick.priceUsd)}`} />
          <Stat label="قیمت به بیت‌کوین" value={btcPriceLabel(pick.priceBtc)} />
          <Stat
            label="۷ روز vs BTC"
            value={formatPct(pick.rs7d)}
            tone={toneFor(pick.rs7d)}
          />
          <Stat
            label="۳۰ روز vs BTC"
            value={pick.rs30d == null ? "—" : formatPct(pick.rs30d)}
            tone={pick.rs30d == null ? "neutral" : toneFor(pick.rs30d)}
          />
          <Stat
            label="MC / FDV"
            value={pick.mcFdv == null ? "—" : `${(pick.mcFdv * 100).toFixed(0)}٪`}
            tone={
              pick.mcFdv == null
                ? "neutral"
                : pick.mcFdv >= 0.7
                  ? "up"
                  : pick.mcFdv < 0.5
                    ? "down"
                    : "neutral"
            }
          />
          <Stat
            label="EMA ۲۰۰"
            value={
              pick.aboveEma200 === true
                ? "بالا"
                : pick.aboveEma200 === false
                  ? "پایین"
                  : "—"
            }
            tone={
              pick.aboveEma200 === true
                ? "up"
                : pick.aboveEma200 === false
                  ? "down"
                  : "neutral"
            }
          />
          <Stat
            label="ساختار هفتگی"
            value={
              pick.weeklyStructure === "bull"
                ? "صعودی"
                : pick.weeklyStructure === "bear"
                  ? "نزولی"
                  : pick.weeklyStructure === "range"
                    ? "رنج"
                    : "—"
            }
          />
          <Stat
            label="گردش ۲۴س"
            value={`${(pick.turnover * 100).toFixed(2)}٪`}
            tone={pick.turnover >= 0.02 ? "up" : "neutral"}
          />
        </dl>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-muted">
          {result.confidenceNote}
        </p>
      </section>

      <ChecklistCard items={result.checklist} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="min-w-0 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
          <h3 className="text-base font-medium text-fg">چرا این، و نه بقیه</h3>
          <ol className="mt-4 flex flex-col gap-3">
            {result.reasons.map((r) => (
              <li key={r} className="flex gap-3 text-sm leading-relaxed text-muted">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" />
                <span>{r}</span>
              </li>
            ))}
          </ol>
          {result.caution.length > 0 ? (
            <div className="mt-5 rounded-md bg-elevated p-4">
              <p className="flex items-center gap-2 text-sm text-fg">
                <ShieldAlert className="size-4 text-warn" />
                نکته‌های احتیاط
              </p>
              <ul className="mt-2 flex flex-col gap-2">
                {result.caution.map((c) => (
                  <li key={c} className="text-sm leading-relaxed text-muted">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {runnerUp ? (
            <p className="mt-4 text-xs text-subtle">
              گزینه دوم: {runnerUp.name} ({runnerUp.symbol}) با امتیاز{" "}
              <span className="num">{formatScore(runnerUp.score)}</span>
              {" · "}۷ روز vs BTC {formatPct(runnerUp.rs7d)}
            </p>
          ) : null}
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
          <h3 className="text-base font-medium text-fg">شاخص جفت بیت‌کوین · ۳۰ روز</h3>
          <p className="mt-1 text-xs text-subtle">
            ۱۰۰ = شروع بازه. خط چین، سطح شروع است. بالای ۱۰۰ یعنی نسبت به BTC جلو افتاده.
          </p>
          <div className="mt-4">
            <BtcPairChart data={pick.pairSeries} symbol={pick.symbol} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
            <p className="text-muted">
              RSI ۱۴روزه:{" "}
              <span className="num text-fg">
                {pick.rsi14 == null ? "—" : pick.rsi14.toFixed(0)}
              </span>
            </p>
            <p className="text-muted">
              ۷ روز دلار:{" "}
              <span className="num text-fg">{formatPctPoints(pick.pct7d)}</span>
            </p>
          </div>
        </section>
      </div>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <h3 className="text-base font-medium text-fg">تجزیه امتیاز</h3>
        <p className="mt-1 text-xs text-subtle">
          هفت فاکتور از ۰ تا ۱۰۰. وزن‌ها ثابت‌اند تا مدل قابل‌حسابرسی باشد.
        </p>
        <div className="mt-5">
          <FactorBars factors={pick.factors} />
        </div>
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
}) {
  const color =
    tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg";
  return (
    <div className="rounded-md bg-elevated px-3 py-3">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className={`num mt-1 text-sm md:text-base ${color}`}>{value}</dd>
    </div>
  );
}
