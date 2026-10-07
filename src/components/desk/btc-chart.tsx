import { useEffect, useState } from "react";
import {
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PairPoint } from "@/lib/crypto/types";

export function BtcPairChart({ data, symbol }: { data: PairPoint[]; symbol: string }) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setReady(true);
  }, []);

  if (data.length < 3) {
    return (
      <p className="text-sm text-muted">
        سری ۳۰ روزه جفت بیت‌کوین برای این ارز کامل نبود.
      </p>
    );
  }

  if (!ready) {
    return <div className="h-48 w-full rounded-md bg-elevated" />;
  }

  return (
    <div className="h-48 w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: 4, bottom: 4 }}>
          <XAxis dataKey="t" hide />
          <YAxis
            domain={["auto", "auto"]}
            width={36}
            tick={{ fill: "#6e6e77", fontSize: 10, fontFamily: "IBM Plex Mono" }}
            axisLine={false}
            tickLine={false}
          />
          <ReferenceLine y={100} stroke="#6e6e77" strokeDasharray="3 4" strokeOpacity={0.5} />
          <Tooltip
            contentStyle={{
              background: "#121214",
              border: "1px solid rgb(241 242 244 / 0.12)",
              borderRadius: 8,
              fontSize: 12,
              color: "#f1f2f4",
            }}
            formatter={(value) => {
              const n = typeof value === "number" ? value : Number(value);
              return [`${n.toFixed(2)}`, `${symbol}/BTC (شاخص ۱۰۰)`];
            }}
            labelFormatter={(label) => `روز ${Number(label) + 1}`}
          />
          <Line
            type="monotone"
            dataKey="v"
            stroke="#d2d7de"
            strokeWidth={1.6}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
