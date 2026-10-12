import { useEffect, useState } from "react";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { CoinRow } from "@/lib/crypto/types";
import { riskViewOfRow, type RiskSlice, type RiskTone, type RiskView } from "@/lib/crypto/risk-view";
import { ExplainTip } from "./explain-tip";

const TONE_CLASS: Record<RiskTone, string> = {
  low: "text-up risk-glow-low",
  mid: "text-warn",
  high: "text-down risk-glow-high",
};

const BAR_COLOR: Record<RiskTone, string> = {
  low: "var(--color-up)",
  mid: "var(--color-warn)",
  high: "var(--color-down)",
};

function toneOf(value: number): RiskTone {
  if (value < 35) return "low";
  if (value < 65) return "mid";
  return "high";
}

export function RiskBreakdown({ row }: { row: CoinRow }) {
  const view = riskViewOfRow(row);
  return (
    <section className="rounded-xl bg-surface p-5 md:p-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h3 className="text-base font-medium text-fg">تجزیه فشار ریسک</h3>
          <p className="mt-1 max-w-xl text-xs leading-relaxed text-subtle">
            به‌جای یک عدد کلی، سه فشار جدا دیده می‌شود. روی هر عنوان بزنید تا فرمول همان نوار باز شود.
          </p>
        </div>
        <ExplainTip title={`${view.toneLabel} · ${view.composite}`} body={view.headline}>
          <span className={`num text-3xl font-medium ${TONE_CLASS[view.tone]}`}>{view.composite}</span>
        </ExplainTip>
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <SliceList view={view} />
        <RiskChart slices={view.slices} />
      </div>
    </section>
  );
}

export function RiskMeter({ row }: { row: CoinRow }) {
  const view = riskViewOfRow(row);
  return (
    <div className="flex min-w-36 flex-col gap-1.5">
      <ExplainTip title={`فشار ریسک ${row.symbol}`} body={view.headline} className="text-xs">
        <span className={`num ${TONE_CLASS[view.tone]}`}>{view.composite}</span>
        <span className="text-subtle">{view.toneLabel}</span>
      </ExplainTip>
      {view.slices.map((slice) => (
        <div key={slice.key} className="flex items-center gap-2">
          <span className="w-14 shrink-0 text-xs text-subtle">{slice.short}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-elevated">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${Math.max(4, slice.value)}%`,
                background: BAR_COLOR[toneOf(slice.value)],
              }}
            />
          </span>
          <span className="num w-8 text-end text-xs text-muted">{slice.value}</span>
        </div>
      ))}
    </div>
  );
}

function SliceList({ view }: { view: RiskView }) {
  return (
    <ul className="flex flex-col gap-4">
      {view.slices.map((slice) => {
        const tone = toneOf(slice.value);
        return (
          <li key={slice.key}>
            <div className="flex items-baseline justify-between gap-3">
              <ExplainTip title={slice.label} body={`${slice.formula} ${slice.detail}`}>
                <span className="text-sm text-fg">{slice.label}</span>
              </ExplainTip>
              <span className={`num text-sm ${TONE_CLASS[tone]}`}>{slice.value}٪</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div
                className="h-full rounded-full transition-[width] duration-500 ease-out"
                style={{ width: `${Math.max(4, slice.value)}%`, background: BAR_COLOR[tone] }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function RiskChart({ slices }: { slices: RiskSlice[] }) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-44 rounded-md bg-elevated" />;
  return (
    <div className="h-44 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={slices} layout="vertical" margin={{ top: 4, right: 12, left: 8, bottom: 0 }}>
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis
            type="category"
            dataKey="short"
            width={88}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--color-muted)", fontSize: 12, fontFamily: "Vazirmatn" }}
          />
          <Tooltip
            cursor={{ fill: "rgb(241 242 244 / 0.05)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const slice = payload[0]?.payload as RiskSlice | undefined;
              if (!slice) return null;
              return (
                <div className="glass-pop max-w-xs rounded-lg px-3 py-2">
                  <p className="text-xs text-fg">
                    {slice.label}
                    <span className="num ms-2">{slice.value}٪</span>
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{slice.detail}</p>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={6} isAnimationActive={false} barSize={14}>
            {slices.map((slice) => (
              <Cell key={slice.key} fill={BAR_COLOR[toneOf(slice.value)]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
