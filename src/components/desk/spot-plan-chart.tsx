import { useEffect, useState } from "react";
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
import { useI18n } from "@/lib/i18n/locale";
import { formatSpotUsd, type SpotPlan } from "@/lib/crypto/spot-plan";

export function SpotPlanChart({ plan }: { plan: SpotPlan }) {
  const { tr } = useI18n();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) return <div className="h-72 w-full rounded-md bg-elevated" />;

  const lows = plan.chart.map((point) => point.l);
  const highs = plan.chart.map((point) => point.h);
  const extra = [plan.entry, plan.buyFrom, plan.buyTo, plan.takeProfit, plan.invalidation, plan.price];
  const min = Math.min(...lows, ...extra);
  const max = Math.max(...highs, ...extra);
  const pad = (max - min) * 0.06 || plan.price * 0.02;

  return (
    <div className="h-72 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={plan.chart} margin={{ top: 16, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[min - pad, max + pad]}
            width={68}
            tick={{ fill: "var(--color-subtle)", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            tickFormatter={(value: number) => formatSpotUsd(value).replace("$", "")}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceArea y1={plan.buyFrom} y2={plan.buyTo} fill="var(--color-up)" fillOpacity={0.14} />
          <ReferenceLine y={plan.invalidation} stroke="var(--color-down)" strokeDasharray="4 4" />
          <ReferenceLine y={plan.takeProfit} stroke="var(--color-warn)" strokeDasharray="4 4" />
          <ReferenceLine y={plan.entry} stroke="var(--color-up)" strokeWidth={1.75} />
          <Tooltip
            cursor={{ stroke: "var(--color-border-strong)" }}
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const point = payload[0]?.payload as SpotPlan["chart"][number] | undefined;
              if (!point) return null;
              const when = new Date(point.time);
              const stamp = Number.isNaN(when.getTime())
                ? ""
                : when.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
              const onEntry = plan.touchIndex != null && point.t === plan.touchIndex;
              return (
                <div className="glass-pop rounded-lg px-3 py-2">
                  <p className="text-xs text-subtle">{stamp}</p>
                  <p className="num mt-1 text-sm text-fg">{formatSpotUsd(point.c)}</p>
                  {onEntry ? (
                    <p className="mt-1 text-xs text-up">{tr("لمس بهترین ورود", "Touched the best entry")}</p>
                  ) : null}
                </div>
              );
            }}
          />
          <Area
            type="monotone"
            dataKey="c"
            stroke="var(--color-fg)"
            strokeWidth={1.75}
            fill="var(--color-fg)"
            fillOpacity={0.06}
            isAnimationActive={false}
            dot={(props) => {
              const { cx, cy, payload } = props as {
                cx?: number;
                cy?: number;
                payload?: SpotPlan["chart"][number];
              };
              if (cx == null || cy == null || plan.touchIndex == null || payload?.t !== plan.touchIndex) {
                return <g key={`plain-${payload?.t ?? cx}`} />;
              }
              return (
                <g key={`entry-${payload.t}`}>
                  <circle cx={cx} cy={cy} r={16} fill="var(--color-up)" opacity={0.22} />
                  <circle cx={cx} cy={cy} r={5.5} fill="var(--color-up)" stroke="var(--color-bg)" strokeWidth={2} />
                </g>
              );
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SpotLevelRuler({ plan }: { plan: SpotPlan }) {
  const { tr } = useI18n();
  const min = Math.min(plan.invalidation, plan.price, plan.entry, plan.buyFrom);
  const max = Math.max(plan.takeProfit, plan.price, plan.entry, plan.buyTo);
  const span = max - min || 1;
  const at = (value: number) => Math.min(100, Math.max(0, ((value - min) / span) * 100));
  const left = at(plan.buyFrom);
  const right = at(plan.buyTo);

  return (
    <div>
      <div className="relative h-10" dir="ltr">
        <div className="absolute inset-x-0 top-4 h-1.5 rounded-full bg-elevated" />
        <div
          className="absolute top-4 h-1.5 rounded-full bg-up-dim"
          style={{ left: `${left}%`, width: `${Math.max(right - left, 1.2)}%` }}
        />
        <RulerDot at={at(plan.invalidation)} tone="bg-down" />
        <RulerDot at={at(plan.entry)} tone="bg-up" />
        <RulerDot at={at(plan.price)} tone="bg-fg" />
        <RulerDot at={at(plan.takeProfit)} tone="bg-warn" />
      </div>
      <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <Legend tone="bg-up" label={tr("بهترین ورود", "Best entry")} />
        <Legend tone="bg-fg" label={tr("قیمت الان", "Price now")} />
        <Legend tone="bg-warn" label={tr("فروش اگر بالا رد شد", "Sell if it crosses up")} />
        <Legend tone="bg-down" label={tr("فروش اگر پایین رد شد", "Sell if it crosses down")} />
      </ul>
    </div>
  );
}

function RulerDot({ at, tone }: { at: number; tone: string }) {
  return (
    <span
      className={`absolute top-3 size-3.5 rounded-full ${tone} shadow-[var(--shadow-border)]`}
      style={{ left: `${at}%`, transform: "translateX(-50%)" }}
    />
  );
}

function Legend({ tone, label }: { tone: string; label: string }) {
  return (
    <li className="flex items-center gap-2">
      <span className={`size-2 rounded-full ${tone}`} />
      <span>{label}</span>
    </li>
  );
}
