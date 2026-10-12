import { ShieldAlert } from "lucide-react";
import type { AnalysisResult } from "@/lib/crypto/types";
import { findBestBuyPoint } from "@/lib/crypto/buy-point";
import {
  btcPriceLabel,
  confidenceTitle,
  dominanceTitle,
  regimeTitle,
} from "@/lib/crypto/explain";
import { Badge } from "@/components/ui/badge";
import { BtcPairChart } from "./btc-chart";
import { ChecklistCard } from "./checklist-card";
import { CoinMark } from "./coin-mark";
import { FactorBars } from "./factor-bars";
import { FlashValue } from "./flash-value";
import { formatPct, formatPctPoints, formatScore, formatUsd, timeAgoFa } from "./format";
import { RiskBreakdown } from "./risk-breakdown";

function toneFor(n: number): "up" | "down" | "neutral" {
  if (n > 0.001) return "up";
  if (n < -0.001) return "down";
  return "neutral";
}

export function PickPanel({
  result,
  live,
}: {
  result: AnalysisResult;
  live?: Record<string, number>;
}) {
  const { pick, runnerUp } = result;
  const confTone =
    result.confidence === "high" ? "up" : result.confidence === "low" ? "down" : "neutral";
  const coverage =
    result.klinesTried > 0
      ? Math.round((result.klinesOk / result.universeSize) * 100)
      : 0;
  const chartMode = pick.symbol === "BTC" ? "usd" : "pair";
  const usdPath = pick.spotIndex;
  const chartSeries =
    pick.symbol === "BTC" && usdPath && usdPath.length >= 5 ? usdPath : pick.pairSeries;
  const buy = findBestBuyPoint(chartSeries);
  const livePrice = live?.[pick.symbol] ?? pick.priceUsd;

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
                <p className="text-xs tracking-wide text-subtle">
                  {result.spotBuys === "suspended"
                    ? "خرید اسپات معلق است · پناهگاه"
                    : result.spotBuys === "reduced"
                      ? "بهترین خرید با نصف حجم"
                      : "بهترین خرید اسپات الان"}
                </p>
        <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <CoinMark symbol={pick.symbol} name={pick.name} rank={pick.rank} size="lg" />
          <div className="text-start md:text-end">
            <p className="text-xs text-subtle">امتیاز اسپات</p>
            <FlashValue
              id={`score:${pick.symbol}`}
              value={pick.score}
              format={formatScore}
              className="text-4xl font-medium tracking-tight text-fg"
            />
          </div>
        </div>

        {pick.narrativeTagsFa[0] ? (
          <p className="mt-4 text-xs text-subtle">{pick.narrativeTagsFa[0]}</p>
        ) : null}
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="قیمت دلار" value={`$${formatUsd(livePrice)}`} liveId={`px:${pick.symbol}`} liveValue={livePrice} />
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
        {result.books.find((book) => book.symbol === pick.symbol) ? (
          <p className="mt-3 max-w-3xl text-xs leading-relaxed text-subtle">
            {result.books.find((book) => book.symbol === pick.symbol)?.note}
          </p>
        ) : null}
      </section>

      <RiskBreakdown row={pick} />

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
              گزینه دوم: {runnerUp.name}{" "}
              <span className="num text-fg">{runnerUp.symbol}</span>
              {" · "}امتیاز <span className="num">{formatScore(runnerUp.score)}</span>
              {" · "}۷ روز vs BTC {formatPct(runnerUp.rs7d)}
            </p>
          ) : null}
        </section>

        <section className="min-w-0 overflow-hidden rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-medium text-fg">
                {chartMode === "usd" ? "قیمت دلاری بیت‌کوین · ۳۰ روز" : `جفت ${pick.symbol}/BTC · ۳۰ روز`}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-subtle">
                {chartMode === "usd"
                  ? "۱۰۰ = شروع بازه. علامت BUY بهترین اصلاح این مسیر است."
                  : "۱۰۰ = شروع بازه. بالای ۱۰۰ یعنی از بیت‌کوین جلو افتاده. BUY بهترین نقطه خرید همین ارز است."}
              </p>
            </div>
            <span className="num shrink-0 rounded-sm bg-fg px-2 py-1 text-xs text-bg">
              {pick.symbol}
            </span>
          </div>
          <div className="mt-4">
            <BtcPairChart data={chartSeries} symbol={pick.symbol} buy={buy} mode={chartMode} />
          </div>
          {buy ? (
            <div className="mt-4 rounded-md bg-elevated px-3 py-3">
              <p className="text-sm text-fg">
                {buy.flat
                  ? "نقطه خرید متمایزی نیست"
                  : buy.nearNow
                    ? "الان نزدیک بهترین نقطه خرید است"
                    : "بهترین نقطه خرید این بازه"}
              </p>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {buy.flat ? (
                  "نوسان ۳۰ روزه آن‌قدر کم است که کف قابل‌دفاعی شکل نگرفته."
                ) : (
                  <>
                    روز <span className="num text-fg">{buy.day}</span>
                    {" · "}شاخص <span className="num text-fg">{buy.value.toFixed(1)}</span>
                    {" · "}
                    <span className="num">{buy.pullbackPct.toFixed(1)}٪</span> زیر اوج پیش از آن
                    {buy.recovered ? "، و بعدش قیمت برگشته" : "، هنوز برگشت محکم ندیده"}. از آن کف تا امروز{" "}
                    <span className={`num ${buy.sincePct >= 0 ? "text-up" : "text-down"}`}>
                      {buy.sincePct >= 0 ? "+" : ""}
                      {buy.sincePct.toFixed(1)}٪
                    </span>
                    .
                  </>
                )}
              </p>
            </div>
          ) : (
            <p className="mt-4 text-xs text-subtle">سری قیمت برای علامت‌گذاری نقطه خرید کافی نبود.</p>
          )}
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
  liveId,
  liveValue,
}: {
  label: string;
  value: string;
  tone?: "up" | "down" | "neutral";
  liveId?: string;
  liveValue?: number;
}) {
  const color =
    tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg";
  return (
    <div className="rounded-md bg-elevated px-3 py-3">
      <dt className="text-xs text-subtle">{label}</dt>
      <dd className={`mt-1 text-sm md:text-base ${color}`}>
        {liveId != null && liveValue != null ? (
          <FlashValue id={liveId} value={liveValue} format={(n) => `$${formatUsd(n)}`} className={color} />
        ) : (
          <span className="num">{value}</span>
        )}
      </dd>
    </div>
  );
}
