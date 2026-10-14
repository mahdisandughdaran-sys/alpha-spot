import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";
import { runSpotBacktest } from "@/lib/crypto/ops";
import type { BacktestReport } from "@/lib/crypto/backtest";
import { formatPct } from "./format";

export function BacktestPanel() {
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
  const run = useServerFn(runSpotBacktest);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [report, setReport] = useState<BacktestReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  async function onRun() {
    setStatus("loading");
    setError(null);
    setReady(false);
    try {
      const data = await run();
      setReport(data);
      setStatus(data.weeks > 0 ? "done" : "error");
      if (data.weeks === 0) setError(data.note);
      else setReady(true);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : msg("بک‌تست انجام نشد.", "The backtest did not finish."));
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-fg">{tr("بک‌تست سه ساله", "Three-year backtest")}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {tr(
              "اگر هر هفته با همین مدل اسپات بین بیت‌کوین و آلت‌های نقدشونده جابه‌جا می‌شدید، بازده و وین‌ریت مسیر تاریخی چه بود. این آینده را تضمین نمی‌کند.",
              "If you had rotated each week, with this same spot model, between Bitcoin and liquid alts, this is what the historical return and win rate would have been. It does not guarantee the future.",
            )}
          </p>
        </div>
        <Button className="h-11 shrink-0" onClick={onRun} disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {tr("در حال خواندن تاریخ", "Reading history")}
            </>
          ) : (
            tr("اجرای بک‌تست", "Run backtest")
          )}
        </Button>
      </div>

      {status === "error" && error ? <p className="text-sm text-down">{tr(error)}</p> : null}

      {status === "done" && report && report.weeks > 0 ? (
        <>
          <p className="text-sm leading-relaxed text-muted">{tr(report.note)}</p>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label={tr("بازده مدل", "Model return")} value={formatPct(report.totalReturn)} />
            <Stat label={tr("بازده بیت‌کوین", "Bitcoin return")} value={formatPct(report.btcReturn)} />
            <Stat label={tr("وین‌ریت هفته‌ها", "Weekly win rate")} value={formatPct(report.winRate, 0)} />
            <Stat label={tr("بیشترین افت", "Largest drop")} value={formatPct(report.maxDrawdown)} />
            <Stat label={tr("هفته‌ها", "Weeks")} value={String(report.weeks)} />
            <Stat label={tr("جابه‌جایی", "Rotations")} value={String(report.trades)} />
            <Stat label={tr("افت BTC", "BTC drop")} value={formatPct(report.btcMaxDrawdown)} />
            <Stat label={tr("روز داده", "Days of data")} value={String(report.days)} />
          </dl>
          {ready && report.curve.length > 2 ? (
            <div className="h-56 w-full rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.curve} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="t" hide />
                  <YAxis
                    width={42}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6e6e77", fontSize: 10, fontFamily: "IBM Plex Mono" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#121214",
                      border: "1px solid rgb(241 242 244 / 0.12)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#f1f2f4",
                    }}
                    formatter={(value, name) => {
                      const n = typeof value === "number" ? value : Number(value);
                      const label = name === "equity" ? tr("مدل", "Model") : tr("بیت‌کوین", "Bitcoin");
                      return [`${((n - 1) * 100).toFixed(1)}${pct}`, label];
                    }}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#f1f2f4" dot={false} strokeWidth={1.6} />
                  <Line type="monotone" dataKey="btc" stroke="#6e6e77" dot={false} strokeWidth={1.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}
          <ul className="flex flex-wrap gap-2">
            {report.holdings.slice(0, 6).map((row) => (
              <li key={row.symbol} className="rounded-full bg-elevated px-3 py-1 text-xs text-muted">
                <span className="num text-fg">{row.symbol}</span>
                <span className="num ms-2">
                  {row.periods} {tr("هفته", "weeks")}
                </span>
                <span className="num ms-2">{formatPct(row.returnPct, 0)}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {report.assumptions.map((line) => (
              <li key={line} className="text-xs leading-relaxed text-subtle">
                {tr(line)}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  const { tr } = useI18n();
  return (
    <div className="rounded-md bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{tr(label)}</p>
      <p className="num mt-1 text-sm text-fg">{value}</p>
    </div>
  );
}
