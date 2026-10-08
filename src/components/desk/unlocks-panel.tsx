import { useMemo, useState } from "react";
import type { CoinRow } from "@/lib/crypto/types";
import { formatUsd } from "./format";

type Filter = "all" | "penalty" | "cliff";

function whenLabel(row: CoinRow): string {
  if (!row.unlockDate) return "—";
  const date = new Date(`${row.unlockDate}T00:00:00Z`).toLocaleDateString("fa-IR", {
    month: "short",
    day: "numeric",
  });
  return row.unlockDays == null ? date : `${date} · ${row.unlockDays} روز`;
}

export function UnlocksPanel({
  rows,
  source,
  matched,
}: {
  rows: CoinRow[];
  source: "coinmarketcap" | "unavailable";
  matched: number;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const alts = useMemo(
    () => rows.filter((r) => r.symbol !== "BTC").sort((a, b) => a.rank - b.rank),
    [rows],
  );
  const penalized = alts.filter((r) => r.highDilution).length;
  const cliffs = alts.filter((r) => r.unlockCliff).length;
  const visible = alts.filter((r) => {
    if (filter === "penalty") return r.highDilution;
    if (filter === "cliff") return r.unlockCliff;
    return true;
  });

  return (
    <section className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="flex flex-col gap-4 p-5">
        <div>
          <h3 className="text-base font-medium text-fg">آزادسازی پیشِ رو</h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-subtle">
            کلیف‌های ۱۴ تا ۳۰ روز و مجموع آزادسازی ۳۰ روز آینده روی صد ارز اول.
            اگر بیش از ۳٪ عرضه در این پنجره باشد، ۱۵ تا ۲۰ امتیاز از نمره کل کم
            می‌شود و برچسب High Dilution Risk می‌خورد. منبع:{" "}
            {source === "coinmarketcap"
              ? "تقویم عمومی CoinMarketCap (همان استاندارد کلیف/خطی DefiLlama؛ endpoint انتشار DefiLlama الان پولی است)."
              : "تقویم الان در دسترس نیست."}{" "}
            <span className="num">{matched}</span> نماد برنامه فعال داشتند.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Mini k="ارز" v={String(alts.length)} />
          <Mini k="جریمه" v={String(penalized)} />
          <Mini k="کلیف" v={String(cliffs)} />
        </div>
        <div className="flex gap-1 rounded-lg bg-elevated p-1">
          {(
            [
              ["all", "همه"],
              ["penalty", "جریمه‌شده"],
              ["cliff", "کلیف‌مانند"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={
                filter === id
                  ? "h-11 flex-1 rounded-md bg-surface px-3 text-sm text-fg"
                  : "h-11 flex-1 rounded-md px-3 text-sm text-muted"
              }
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-4 py-2 text-start font-medium">ارز</th>
              <th className="px-4 py-2 text-start font-medium">آنلاک بعدی</th>
              <th className="px-4 py-2 text-start font-medium">٪ عرضه ۳۰روز</th>
              <th className="px-4 py-2 text-start font-medium">کلیف</th>
              <th className="px-4 py-2 text-start font-medium">جریمه</th>
              <th className="px-4 py-2 text-start font-medium">حجم</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr className="border-t border-border">
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  در این فیلتر رویدادی نیست.
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <p className="text-fg">{row.name}</p>
                    <p className="num text-xs text-subtle">
                      {row.symbol} · #{row.rank}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-muted">{whenLabel(row)}</td>
                  <td className="num px-4 py-3 text-fg">
                    {row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(2)}٪`}
                  </td>
                  <td className="px-4 py-3 text-muted">{row.unlockCliff ? "بله" : "خیر"}</td>
                  <td className="px-4 py-3">
                    {row.highDilution ? (
                      <span className="inline-flex rounded-full bg-down-dim px-2 py-1 text-xs text-down">
                        High Dilution · <span className="num ms-1">-{row.unlockPenalty}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-subtle">بدون جریمه</span>
                    )}
                  </td>
                  <td className="num px-4 py-3 text-muted">${formatUsd(row.volume24h)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-elevated px-3 py-2">
      <p className="text-xs text-subtle">{k}</p>
      <p className="num mt-1 text-sm text-fg">{v}</p>
    </div>
  );
}
