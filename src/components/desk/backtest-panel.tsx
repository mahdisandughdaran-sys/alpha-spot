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
import { runSpotBacktest } from "@/lib/crypto/ops";
import type { BacktestReport } from "@/lib/crypto/backtest";
import { formatPct } from "./format";

export function BacktestPanel() {
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
      setError(err instanceof Error ? err.message : "بک‌تست انجام نشد.");
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-fg">بک‌تست سه ساله</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            اگر هر هفته با همین مدل اسپات بین بیت‌کوین و آلت‌های نقدشونده جابه‌جا می‌شدید،
            بازده و وین‌ریت مسیر تاریخی چه بود. این آینده را تضمین نمی‌کند.
          </p>
        </div>
        <Button className="h-11 shrink-0" onClick={onRun} disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              در حال خواندن تاریخ
            </>
          ) : (
            "اجرای بک‌تست"
          )}
        </Button>
      </div>

      {status === "error" ? <p className="text-sm text-down">{error}</p> : null}

      {status === "done" && report && report.weeks > 0 ? (
        <>
          <p className="text-sm leading-relaxed text-muted">{report.note}</p>
          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="بازده مدل" value={formatPct(report.totalReturn)} />
            <Stat label="بازده بیت‌کوین" value={formatPct(report.btcReturn)} />
            <Stat label="وین‌ریت هفته‌ها" value={formatPct(report.winRate, 0)} />
            <Stat label="بیشترین افت" value={formatPct(report.maxDrawdown)} />
            <Stat label="هفته‌ها" value={String(report.weeks)} />
            <Stat label="جابه‌جایی" value={String(report.trades)} />
            <Stat label="افت BTC" value={formatPct(report.btcMaxDrawdown)} />
            <Stat label="روز داده" value={String(report.days)} />
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
                      const label = name === "equity" ? "مدل" : "بیت‌کوین";
                      return [`${((n - 1) * 100).toFixed(1)}٪`, label];
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
                <span className="num ms-2">{row.periods} هفته</span>
                <span className="num ms-2">{formatPct(row.returnPct, 0)}</span>
              </li>
            ))}
          </ul>
          <ul className="flex flex-col gap-2">
            {report.assumptions.map((line) => (
              <li key={line} className="text-xs leading-relaxed text-subtle">
                {line}
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{label}</p>
      <p className="num mt-1 text-sm text-fg">{value}</p>
    </div>
  );
}
