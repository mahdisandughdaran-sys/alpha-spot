import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import {
  Area,
  AreaChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { OpportunityBacktestReport } from "@/lib/crypto/opportunity-backtest";
import { runOpportunityBacktest } from "@/lib/crypto/ops";
import { loadOppAlerts, type OpportunityAlert } from "@/lib/crypto/opportunity-alerts";
import type {
  Opportunity,
  OpportunityBoard,
  OpportunityRisk,
  OpportunityStatus,
} from "@/lib/crypto/opportunity";
import { formatPct, formatScore, formatUsd } from "./format";

type Filter = "active" | "now" | "watch" | "near" | "invalid" | "unconfirmed" | "all";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "active", label: "فعال" },
  { id: "now", label: "قابل بررسی" },
  { id: "watch", label: "تحت نظر" },
  { id: "near", label: "نزدیک محدوده" },
  { id: "invalid", label: "نامعتبر" },
  { id: "unconfirmed", label: "تأییدنشده" },
  { id: "all", label: "همه" },
];

export function OpportunityPanel({ board }: { board: OpportunityBoard }) {
  const runBt = useServerFn(runOpportunityBacktest);
  const [filter, setFilter] = useState<Filter>("active");
  const [risk, setRisk] = useState<"all" | OpportunityRisk>("all");
  const [liquidOnly, setLiquidOnly] = useState(false);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const [alerts, setAlerts] = useState<OpportunityAlert[]>([]);
  const [report, setReport] = useState<OpportunityBacktestReport | null>(null);
  const [btStatus, setBtStatus] = useState<"idle" | "loading" | "error">("idle");
  const [btError, setBtError] = useState<string | null>(null);

  useEffect(() => {
    setAlerts(loadOppAlerts());
  }, [board.generatedAt]);

  const rows = useMemo(() => {
    const needle = query.trim().toUpperCase();
    return board.items.filter((row) => {
      if (!matchFilter(filter, row.status)) return false;
      if (risk !== "all" && row.risk !== risk) return false;
      if (liquidOnly && row.volume24h < 8_000_000) return false;
      if (!needle) return true;
      return row.symbol.includes(needle) || row.name.toUpperCase().includes(needle);
    });
  }, [board.items, filter, liquidOnly, query, risk]);

  async function onBacktest() {
    setBtStatus("loading");
    setBtError(null);
    try {
      setReport(await runBt());
      setBtStatus("idle");
    } catch (err) {
      setBtStatus("error");
      setBtError(err instanceof Error ? err.message : "بک‌تست فرصت انجام نشد.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h2 className="text-base font-medium text-fg">فرصت‌های شرطی</h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{board.note}</p>
        <p className="mt-2 text-xs text-subtle">
          {board.scanned} ارز بررسی شد · {board.withData} سری قابل استفاده ·{" "}
          {board.actionable.length} قابل بررسی · {board.watch.length} در انتظار ·{" "}
          {board.near.length} نزدیک محدوده
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          <Pile title="الان ارزش بررسی دارد" rows={board.actionable} />
          <Pile title="تحت نظر برای بعد" rows={board.watch} />
          <Pile title="نزدیک محدوده" rows={board.near} />
        </div>
      </section>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
        <div className="flex flex-col gap-3">
          <div className="flex gap-1 overflow-x-auto">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={
                  filter === item.id
                    ? "h-10 shrink-0 rounded-md bg-elevated px-3 text-sm text-fg"
                    : "h-10 shrink-0 rounded-md px-3 text-sm text-muted"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="grid gap-2 sm:grid-cols-[1fr_auto_auto]">
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="نماد یا نام"
              className="h-11 rounded-md bg-elevated px-3 text-sm text-fg outline-none"
            />
            <select
              value={risk}
              onChange={(event) => setRisk(event.target.value as "all" | OpportunityRisk)}
              className="h-11 rounded-md bg-elevated px-3 text-sm text-fg"
            >
              <option value="all">هر ریسک</option>
              <option value="low">ریسک پایین</option>
              <option value="medium">ریسک متوسط</option>
              <option value="high">ریسک بالا</option>
            </select>
            <button
              type="button"
              onClick={() => setLiquidOnly((v) => !v)}
              className={
                liquidOnly
                  ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg"
                  : "h-11 rounded-md px-3 text-sm text-muted"
              }
            >
              فقط نقدشونده
            </button>
          </div>
        </div>
        <ul className="mt-4 flex flex-col gap-2">
          {rows.slice(0, 30).map((row) => (
            <li key={row.symbol} className="rounded-lg bg-elevated">
              <button
                type="button"
                onClick={() => setOpen((current) => (current === row.symbol ? null : row.symbol))}
                className="flex w-full flex-col gap-2 px-3 py-3 text-right sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm text-fg">
                    {row.symbol} <span className="text-muted">{row.name}</span>
                  </p>
                  <p className="mt-1 text-xs text-subtle">
                    {row.statusLabel} · ریسک {riskLabel(row.risk)} · اطمینان {confidenceLabel(row.confidence)}
                  </p>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted">
                  <span className="num">{formatUsd(row.priceUsd)}</span>
                  <span className="num">
                    {row.distancePct == null ? "—" : formatPct(row.distancePct)}
                  </span>
                  <span className="num text-fg">{formatScore(row.score)}</span>
                </div>
              </button>
              {open === row.symbol ? <Detail row={row} /> : null}
            </li>
          ))}
          {rows.length === 0 ? (
            <li className="px-2 py-6 text-sm text-muted">در این فیلتر موردی نیست.</li>
          ) : null}
        </ul>
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-sm text-fg">ارزیابی گذشته فرصت‌ها</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              فقط معامله‌هایی شمرده می‌شوند که بعد از تأیید کندل وارد شده‌اند. کارمزد و لغزش داخل عدد است.
              این نتیجه تضمین آینده نیست.
            </p>
          </div>
          <button
            type="button"
            onClick={onBacktest}
            disabled={btStatus === "loading"}
            className="h-11 shrink-0 rounded-md bg-elevated px-4 text-sm text-fg"
          >
            {btStatus === "loading" ? "در حال ارزیابی" : "بک‌تست فرصت"}
          </button>
        </div>
        {btError ? <p className="mt-3 text-sm text-down">{btError}</p> : null}
        {report ? <BacktestReportView report={report} /> : null}
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-sm text-fg">تاریخچه هشدار فرصت</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {alerts.length === 0 ? (
            <li className="text-xs text-muted">هنوز هشدار فرصتی ثبت نشده است.</li>
          ) : (
            alerts.slice(0, 12).map((alert) => (
              <li key={alert.id} className="rounded-md bg-elevated px-3 py-3">
                <p className="text-sm text-fg">{alert.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted">{alert.text}</p>
              </li>
            ))
          )}
        </ul>
      </section>
    </div>
  );
}

function matchFilter(filter: Filter, status: OpportunityStatus): boolean {
  if (filter === "all") return true;
  if (filter === "active") {
    return status === "actionable" || status === "confirmed" || status === "in-zone" || status === "approaching" || status === "watching";
  }
  if (filter === "now") return status === "actionable" || status === "confirmed";
  if (filter === "watch") return status === "watching";
  if (filter === "near") return status === "approaching" || status === "in-zone";
  if (filter === "invalid") return status === "invalidated" || status === "passed";
  return status === "unconfirmed";
}

function Pile({ title, rows }: { title: string; rows: Opportunity[] }) {
  const top = rows.slice(0, 3);
  return (
    <div className="rounded-md bg-elevated p-3">
      <p className="text-xs text-subtle">{title}</p>
      {top.length === 0 ? (
        <p className="mt-2 text-sm text-muted">موردی نیست</p>
      ) : (
        <ul className="mt-2 flex flex-col gap-2">
          {top.map((row) => (
            <li key={row.symbol} className="flex items-baseline justify-between gap-2">
              <span className="text-sm text-fg">{row.symbol}</span>
              <span className="num text-xs text-muted">{formatScore(row.score)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Detail({ row }: { row: Opportunity }) {
  return (
    <div className="border-t border-border px-3 py-4">
      <p className="text-sm leading-relaxed text-muted">{row.summary}</p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">{row.confidenceNote}</p>
      <div className="mt-4">
        <ZoneChart row={row} />
      </div>
      {row.zone ? (
        <dl className="mt-4 grid gap-2 text-xs sm:grid-cols-3">
          <Stat k="محدوده" v={`${fmt(row.zone.low)} – ${fmt(row.zone.high)}`} />
          <Stat k="ابطال" v={fmt(row.zone.invalidation)} />
          <Stat k="نسبت سود به زیان" v={row.rewardRisk == null ? "—" : row.rewardRisk.toFixed(2)} />
        </dl>
      ) : null}
      <p className="mt-4 text-xs text-subtle">چرا این محدوده</p>
      <p className="mt-1 text-sm text-muted">{row.zone?.reason ?? "محدوده معتبری ساخته نشد."}</p>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <RuleList title="شرط تأیید" rows={row.confirmRules} />
        <RuleList title="شرط ابطال" rows={row.invalidateRules} />
      </div>
      <ul className="mt-4 grid gap-2 md:grid-cols-2">
        {row.scenarios.map((scene) => (
          <li key={scene.key} className="rounded-md bg-bg px-3 py-3">
            <p className="text-sm text-fg">
              {scene.title} · {sceneState(scene.state)}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{scene.detail}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <ReasonList title="چه چیزی رتبه را بالا برد" rows={row.helps} empty="عامل برجسته‌ای بالای ۷۰ نیست." />
        <ReasonList title="چه چیزی رتبه را پایین آورد" rows={row.hurts} empty="عامل ضعیفی زیر ۴۵ نیست." />
      </div>
      <ul className="mt-4 flex flex-col gap-3">
        {row.parts.map((part) => (
          <li key={part.key}>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-sm text-fg">{part.label}</p>
              <span className="num text-xs text-muted">
                وزن {(part.weight * 100).toFixed(0)}٪ · {formatScore(part.score)}
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-bg">
              <div className="h-full rounded-full bg-accent" style={{ width: `${Math.max(4, part.score)}%` }} />
            </div>
            <p className="mt-1 text-xs leading-relaxed text-muted">{part.note}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ZoneChart({ row }: { row: Opportunity }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (row.path.length < 5) return <p className="text-xs text-muted">نمودار کافی نیست.</p>;
  if (!ready) return <div className="h-52 rounded-md bg-bg" />;
  const data = row.path.map((point) => ({ t: point.t, c: point.c }));
  const prices = data.map((point) => point.c);
  const extra = [row.zone?.low, row.zone?.high, row.zone?.invalidation].filter(
    (n): n is number => typeof n === "number",
  );
  const min = Math.min(...prices, ...extra);
  const max = Math.max(...prices, ...extra);
  const pad = (max - min) * 0.08 || max * 0.02;
  return (
    <div className="h-52 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 12, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[min - pad, max + pad]}
            width={48}
            tick={{ fill: "var(--color-subtle)", fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          {row.zone ? (
            <ReferenceArea y1={row.zone.low} y2={row.zone.high} fill="var(--color-warn)" fillOpacity={0.18} />
          ) : null}
          {row.zone ? (
            <ReferenceLine y={row.zone.invalidation} stroke="var(--color-down)" strokeDasharray="4 4" />
          ) : null}
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
            }}
            formatter={(value) => [fmt(Number(value)), row.symbol]}
          />
          <Area type="monotone" dataKey="c" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.12} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function BacktestReportView({ report }: { report: OpportunityBacktestReport }) {
  return (
    <div className="mt-4 flex flex-col gap-3">
      <p className="text-sm text-fg">{report.note}</p>
      <p className="text-xs text-subtle">
        {report.from} تا {report.to} · {report.symbols} نماد · {report.days} روز · {report.trades} معامله
      </p>
      <dl className="grid gap-2 sm:grid-cols-4">
        <Stat k="نرخ برد" v={report.winRate == null ? "—" : formatPct(report.winRate, 0)} />
        <Stat k="میانگین R" v={report.avgR == null ? "—" : report.avgR.toFixed(2)} />
        <Stat k="بازده فرضی" v={report.totalReturn == null ? "—" : formatPct(report.totalReturn)} />
        <Stat k="بیشترین افت" v={report.maxDrawdown == null ? "—" : formatPct(report.maxDrawdown)} />
      </dl>
      <p className="text-xs leading-relaxed text-muted">{report.holdout.note}</p>
      <div className="grid gap-2 md:grid-cols-3">
        {report.baselines.map((row) => (
          <div key={row.name} className="rounded-md bg-elevated p-3">
            <p className="text-sm text-fg">{row.name}</p>
            <p className="mt-1 text-xs text-muted">
              {row.trades} معامله · برد {row.winRate == null ? "—" : formatPct(row.winRate, 0)} · بازده{" "}
              {row.totalReturn == null ? "—" : formatPct(row.totalReturn)}
            </p>
          </div>
        ))}
      </div>
      <ul className="flex flex-col gap-1">
        {report.byRegime.map((row) => (
          <li key={row.regime} className="text-xs text-muted">
            رژیم {regimeLabel(row.regime)}: {row.trades} معامله، برد{" "}
            {row.winRate == null ? "—" : formatPct(row.winRate, 0)}
          </li>
        ))}
      </ul>
      <ul className="flex flex-col gap-1">
        {report.assumptions.map((line) => (
          <li key={line} className="text-xs leading-relaxed text-subtle">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RuleList({ title, rows }: { title: string; rows: string[] }) {
  return (
    <div>
      <p className="text-xs text-subtle">{title}</p>
      <ul className="mt-1 flex flex-col gap-1">
        {rows.map((line) => (
          <li key={line} className="text-xs leading-relaxed text-muted">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ReasonList({ title, rows, empty }: { title: string; rows: string[]; empty: string }) {
  return (
    <div className="rounded-md bg-bg p-3">
      <p className="text-xs text-subtle">{title}</p>
      {rows.length === 0 ? <p className="mt-1 text-xs text-muted">{empty}</p> : null}
      <ul className="mt-1 flex flex-col gap-1">
        {rows.map((line) => (
          <li key={line} className="text-xs leading-relaxed text-muted">
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-bg px-3 py-2">
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className="num mt-1 text-sm text-fg">{v}</dd>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(4);
}

function riskLabel(risk: OpportunityRisk): string {
  if (risk === "low") return "پایین";
  if (risk === "high") return "بالا";
  return "متوسط";
}

function confidenceLabel(level: Opportunity["confidence"]): string {
  if (level === "high") return "بالا";
  if (level === "medium") return "متوسط";
  if (level === "low") return "پایین";
  return "اعلام‌نشده";
}

function sceneState(state: Opportunity["scenarios"][number]["state"]): string {
  if (state === "met") return "برقرار";
  if (state === "active") return "در جریان";
  if (state === "failed") return "نقض شده";
  if (state === "waiting") return "منتظر";
  return "موضوعیت ندارد";
}

function regimeLabel(regime: "bull" | "bear" | "range"): string {
  if (regime === "bull") return "صعودی";
  if (regime === "bear") return "نزولی";
  return "خنثی";
}
