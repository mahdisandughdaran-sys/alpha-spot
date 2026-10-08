import { Star } from "lucide-react";
import type { CoinRow } from "@/lib/crypto/types";
import { btcPriceLabel } from "@/lib/crypto/explain";
import { formatPct, formatScore, formatUsd } from "./format";

export function Leaderboard({
  rows,
  picked,
  watched,
  onToggleWatch,
}: {
  rows: CoinRow[];
  picked: string;
  watched: string[];
  onToggleWatch: (symbol: string) => void;
}) {
  return (
    <section className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-base font-medium text-fg">رتبه‌بندی مدل</h3>
          <p className="mt-1 text-xs text-subtle">
            امتیاز نهایی بعد از جریمه آنلاک است. سیگنال خرید با کلید قطع بیت‌کوین
            ممکن است معلق یا نصف‌حجم شود.
          </p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[920px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-3 py-2 text-start font-medium" />
              <th className="px-4 py-2 text-start font-medium">#</th>
              <th className="px-4 py-2 text-start font-medium">ارز</th>
              <th className="px-4 py-2 text-start font-medium">امتیاز</th>
              <th className="px-4 py-2 text-start font-medium">۷ر vs BTC</th>
              <th className="px-4 py-2 text-start font-medium">MC/FDV</th>
              <th className="px-4 py-2 text-start font-medium">آنلاک ۳۰ر</th>
              <th className="px-4 py-2 text-start font-medium">سیگنال</th>
              <th className="px-4 py-2 text-start font-medium">EMA۲۰۰</th>
              <th className="px-4 py-2 text-start font-medium">RSI</th>
              <th className="px-4 py-2 text-start font-medium">قیمت BTC</th>
              <th className="px-4 py-2 text-start font-medium">حجم</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const active = row.symbol === picked;
              const starred = watched.includes(row.symbol);
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
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={() => onToggleWatch(row.symbol)}
                      className="flex size-9 items-center justify-center rounded-md text-subtle hover:bg-elevated hover:text-fg"
                      aria-label={starred ? "حذف از واچ‌لیست" : "افزودن به واچ‌لیست"}
                    >
                      <Star
                        className="size-4"
                        fill={starred ? "currentColor" : "none"}
                      />
                    </button>
                  </td>
                  <td className="num px-4 py-3 text-subtle">{i + 1}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-fg">{row.name}</span>
                      <span className="num text-xs text-subtle">
                        {row.symbol}
                        {row.narrativeTagsFa[0] ? ` · ${row.narrativeTagsFa[0]}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="num px-4 py-3 text-fg">{formatScore(row.score)}</td>
                  <td className={`num px-4 py-3 ${rsTone}`}>{formatPct(row.rs7d)}</td>
                  <td className="num px-4 py-3 text-muted">
                    {row.mcFdv == null ? "—" : `${(row.mcFdv * 100).toFixed(0)}٪`}
                  </td>
                  <td className="px-4 py-3">
                    {row.highDilution ? (
                      <span className="text-xs text-down">
                        High Dilution
                        <span className="num ms-1">-{row.unlockPenalty}</span>
                      </span>
                    ) : (
                      <span className="num text-xs text-muted">
                        {row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(1)}٪`}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-muted">
                    {row.buySignal === "suspended"
                      ? "معلق"
                      : row.buySignal === "reduced"
                        ? "حجم ۵۰٪"
                        : "باز"}
                  </td>
                  <td className="px-4 py-3 text-muted">
                    {row.aboveEma200 === true
                      ? "بالا"
                      : row.aboveEma200 === false
                        ? "پایین"
                        : "—"}
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
