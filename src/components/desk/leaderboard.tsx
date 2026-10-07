import type { CoinRow } from "@/lib/crypto/types";
import { btcPriceLabel } from "@/lib/crypto/explain";
import { formatPct, formatScore, formatUsd } from "./format";

export function Leaderboard({ rows, picked }: { rows: CoinRow[]; picked: string }) {
  return (
    <section className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-base font-medium text-fg">رتبه‌بندی مدل</h3>
          <p className="mt-1 text-xs text-subtle">
            امتیاز نهایی همان وزن‌های پنج‌فاکتوری است. ستون BTC یعنی بازده ۷ روزه روی جفت بیت‌کوین.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-4 py-2 text-start font-medium">#</th>
              <th className="px-4 py-2 text-start font-medium">ارز</th>
              <th className="px-4 py-2 text-start font-medium">امتیاز</th>
              <th className="px-4 py-2 text-start font-medium">۷ر vs BTC</th>
              <th className="px-4 py-2 text-start font-medium">۳۰ر vs BTC</th>
              <th className="px-4 py-2 text-start font-medium">RSI</th>
              <th className="px-4 py-2 text-start font-medium">قیمت BTC</th>
              <th className="px-4 py-2 text-start font-medium">حجم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const active = row.symbol === picked;
              const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
              return (
                <tr
                  key={row.id}
                  className={
                    active
                      ? "border-t border-border bg-elevated"
                      : "border-t border-border"
                  }
                >
                  <td className="num px-4 py-3 text-subtle">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-fg">{row.name}</span>
                      <span className="num text-xs text-subtle">{row.symbol}</span>
                    </div>
                  </td>
                  <td className="num px-4 py-3 text-fg">{formatScore(row.score)}</td>
                  <td className={`num px-4 py-3 ${rsTone}`}>{formatPct(row.rs7d)}</td>
                  <td className="num px-4 py-3 text-muted">
                    {row.rs30d == null ? "—" : formatPct(row.rs30d)}
                  </td>
                  <td className="num px-4 py-3 text-muted">
                    {row.rsi14 == null ? "—" : row.rsi14.toFixed(0)}
                  </td>
                  <td className="num px-4 py-3 text-muted">{btcPriceLabel(row.priceBtc)}</td>
                  <td className="num px-4 py-3 text-muted">${formatUsd(row.volume24h)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
