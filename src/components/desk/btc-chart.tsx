import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BuyPoint } from "@/lib/crypto/buy-point";
import type { PairPoint } from "@/lib/crypto/types";

export function BtcPairChart({
  data,
  symbol,
  buy,
  mode,
}: {
  data: PairPoint[];
  symbol: string;
  buy: BuyPoint | null;
  mode: "pair" | "usd";
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (data.length < 3) {
    return <p className="text-sm text-muted">سری ۳۰ روزه این ارز کامل نبود.</p>;
  }

  if (!ready) {
    return <div className="h-64 w-full rounded-md bg-elevated" />;
  }

  const marked = buy && !buy.flat ? buy : null;
  const unit = mode === "usd" ? `${symbol} دلار، شاخص ۱۰۰` : `${symbol}/BTC، شاخص ۱۰۰`;

  return (
    <div className="h-64 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 28, right: 16, left: 0, bottom: 12 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            domain={[(min: number) => min - 8, (max: number) => max + 6]}
            width={42}
            tick={{ fill: "var(--color-subtle)", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={100} stroke="var(--color-subtle)" strokeDasharray="3 4" strokeOpacity={0.45} />
          {marked ? (
            <ReferenceLine
              y={marked.value}
              stroke="var(--color-up)"
              strokeDasharray="4 4"
              strokeOpacity={0.85}
            />
          ) : null}
          <Tooltip
            contentStyle={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              borderRadius: 8,
              fontSize: 12,
              color: "var(--color-fg)",
            }}
            formatter={(value, _name, item) => {
              const n = typeof value === "number" ? value : Number(value);
              const day = Number(item?.payload?.t);
              const tag = marked && day === marked.index ? " · نقطه خرید" : "";
              return [`${n.toFixed(2)}${tag}`, unit];
            }}
            labelFormatter={(label) => `روز ${Number(label) + 1}`}
          />
          <Area
            type="monotone"
            dataKey="v"
            stroke="var(--color-fg)"
            strokeWidth={1.75}
            fill="var(--color-fg)"
            fillOpacity={0.06}
            isAnimationActive={false}
            dot={(props) => {
              const { cx, cy, payload } = props as {
                cx?: number;
                cy?: number;
                payload?: PairPoint;
              };
              if (cx == null || cy == null || !marked || payload?.t !== marked.index) {
                return <g key={`plain-${payload?.t ?? cx}`} />;
              }
              return (
                <g key={`buy-${payload.t}`}>
                  <circle cx={cx} cy={cy} r={16} fill="var(--color-up)" opacity={0.2} />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5.5}
                    fill="var(--color-up)"
                    stroke="var(--color-bg)"
                    strokeWidth={2}
                  />
                  <text
                    x={cx}
                    y={cy - 14}
                    textAnchor="middle"
                    fill="var(--color-up)"
                    fontSize={11}
                    fontFamily="IBM Plex Mono"
                  >
                    BUY
                  </text>
                </g>
              );
            }}
            activeDot={{ r: 3, fill: "var(--color-fg)" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
