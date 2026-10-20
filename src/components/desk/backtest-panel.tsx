import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Bar,
  BarChart,
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
    <section className="flex min-w-0 flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-fg">{tr("بک‌تست سه ساله", "Three-year backtest")}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {tr(
              "مسیر آزمایشی قمر را مثل میز زنده نگه می‌دارد: تا ابطالِ قفل‌شده در روز ورود، شکست ساختار هفتگی جفت، یا کلید قطع. خاموش شدن دروازهٔ همان هفته خروج نیست. گرم‌شدن ۲۲۰ روز است و سقوط مه و ژوئن ۲۰۲۲ داخل معامله نیست. این عدد اجازهٔ خرید آلت نیست.",
              "The measured path holds a satellite the way the live desk does: until the invalidation locked on the entry day, a weekly pair-structure break, or the kill switch. The gate turning off that week is not an exit. Warmup is 220 days, so the May and June 2022 crash is not in the traded path. This number is not permission to buy an alt.",
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
          <MonthlyReturns report={report} />
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

function monthLabel(key: string, locale: "fa" | "en"): string {
  const [year, month] = key.split("-");
  const y = Number(year);
  const m = Number(month);
  if (!y || !m) return key;
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function MonthlyReturns({ report }: { report: BacktestReport }) {
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
  if (report.months.length === 0) return null;
  const rows = report.months.map((row) => ({
    ...row,
    label: monthLabel(row.key, locale),
    gap: row.model - row.btc,
  }));
  const sample =
    report.monthSample === "full"
      ? tr(
          `میانگین روی ${report.monthCount} ماه کامل است. ماه ناقص در جدول می‌ماند ولی داخل میانگین نیست.`,
          `The average uses ${report.monthCount} complete months. Partial months stay in the table but are outside the average.`,
        )
      : tr(
          `هنوز سه ماه کامل نیست؛ میانگین روی هر ${report.monthCount} ماه موجود است، از جمله ماه ناقص.`,
          `There are not yet three complete months. The average uses all ${report.monthCount} months on record, including partial ones.`,
        );

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h4 className="text-sm font-medium text-fg">{tr("بازده ماهانه مدل", "Monthly model return")}</h4>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-subtle">{sample}</p>
      </div>
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat label={tr("میانگین ماهانه", "Average month")} value={formatPct(report.avgMonthly)} />
        <Stat label={tr("ماهانه مرکب", "Compounded month")} value={formatPct(report.compoundMonthly)} />
        <Stat label={tr("میانه ماه", "Median month")} value={formatPct(report.medianMonthly)} />
        <Stat label={tr("بهترین ماه", "Best month")} value={formatPct(report.bestMonth)} />
        <Stat label={tr("بدترین ماه", "Worst month")} value={formatPct(report.worstMonth)} />
        <Stat
          label={tr("ماه‌های مثبت", "Positive months")}
          value={`${report.positiveMonths}/${report.monthCount}`}
        />
        <Stat
          label={tr("جلوتر از BTC", "Ahead of BTC")}
          value={`${report.monthsAhead}/${report.monthCount}`}
        />
        <Stat label={tr("ماه در مسیر", "Months on the path")} value={String(report.months.length)} />
      </dl>
      <div className="h-56 w-full rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]" dir="ltr">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <XAxis dataKey="label" hide />
            <YAxis
              width={42}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6e6e77", fontSize: 10, fontFamily: "IBM Plex Mono" }}
              tickFormatter={(value: number) => `${(value * 100).toFixed(0)}`}
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
                const label = name === "model" ? tr("مدل", "Model") : tr("بیت‌کوین", "Bitcoin");
                return [`${(n * 100).toFixed(1)}${pct}`, label];
              }}
              labelFormatter={(label) => String(label)}
            />
            <Bar dataKey="model" fill="#f1f2f4" radius={[2, 2, 0, 0]} />
            <Bar dataKey="btc" fill="#6e6e77" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-subtle">
        {tr("ستون روشن مدل است و ستون تیره همان ماه بیت‌کوین. واحد محور، درصد است.", "The light bar is the model. The dark bar is Bitcoin that same month. The axis is percent.")}
      </p>
      <div className="max-h-80 overflow-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
        <table className="w-full min-w-[28rem] text-sm">
          <thead className="sticky top-0 bg-elevated text-xs text-subtle">
            <tr>
              <th className="px-3 py-3 text-start font-medium">{tr("ماه", "Month")}</th>
              <th className="px-3 py-3 text-end font-medium">{tr("مدل", "Model")}</th>
              <th className="px-3 py-3 text-end font-medium">{tr("بیت‌کوین", "Bitcoin")}</th>
              <th className="px-3 py-3 text-end font-medium">{tr("اختلاف", "Gap")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-t border-border">
                <td className="px-3 py-3 text-fg">
                  {row.label}
                  {row.partial ? <span className="ms-2 text-xs text-subtle">{tr("ناقص", "partial")}</span> : null}
                  <span className="num ms-2 text-xs text-subtle">
                    {row.weeks} {tr("هفته", "wk")}
                  </span>
                </td>
                <td className={`num px-3 py-3 text-end ${row.model >= 0 ? "text-up" : "text-down"}`}>
                  {formatPct(row.model)}
                </td>
                <td className={`num px-3 py-3 text-end ${row.btc >= 0 ? "text-up" : "text-down"}`}>
                  {formatPct(row.btc)}
                </td>
                <td className={`num px-3 py-3 text-end ${row.gap >= 0 ? "text-up" : "text-down"}`}>
                  {formatPct(row.gap)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
