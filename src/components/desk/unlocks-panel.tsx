import { useMemo, useState } from "react";
import type { CoinRow } from "@/lib/crypto/types";
import { unlockExplain } from "@/lib/crypto/risk-view";
import { useI18n } from "@/lib/i18n/locale";
import type { Locale } from "@/lib/i18n/lex";
import { CoinMark } from "./coin-mark";
import { ExplainTip } from "./explain-tip";
import { formatUsd } from "./format";

type Filter = "all" | "penalty" | "cliff";

function whenLabel(
  row: CoinRow,
  tr: (fa: string, en?: string) => string,
  locale: Locale,
): string {
  if (!row.unlockDate) return "—";
  const date = new Date(`${row.unlockDate}T00:00:00Z`).toLocaleDateString(locale === "en" ? "en-US" : "fa-IR", {
    month: "short",
    day: "numeric",
  });
  if (row.unlockDays == null) return date;
  return `${date} · ${row.unlockDays} ${tr("روز", "days")}`;
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
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
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
          <h3 className="text-base font-medium text-fg">{tr("آزادسازی پیشِ رو", "Unlocks ahead")}</h3>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-subtle">
            {tr(
              "کلیف‌های ۱۴ تا ۳۰ روز و مجموع آزادسازی ۳۰ روز آینده روی صد ارز اول. اگر بیش از ۳٪ عرضه در این پنجره باشد، ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌خورد. منبع:",
              "Cliffs 14 to 30 days out, and total unlocks over the next 30 days, across the top one hundred coins. If more than 3% of supply falls in this window, 15 to 20 points come off the score and it is tagged High Dilution Risk. Source:",
            )}{" "}
            {source === "coinmarketcap"
              ? tr(
                  "تقویم عمومی CoinMarketCap (همان استاندارد کلیف/خطی DefiLlama؛ endpoint انتشار DefiLlama الان پولی است).",
                  "CoinMarketCap’s public calendar (the same cliff/linear standard as DefiLlama; the DefiLlama unlock endpoint is paid right now).",
                )
              : tr("تقویم الان در دسترس نیست.", "The calendar is not available right now.")}{" "}
            <span className="num">{matched}</span> {tr("نماد برنامه فعال داشتند.", "symbols had an active schedule.")}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <Mini k={tr("ارز", "Coins")} v={String(alts.length)} />
          <Mini k={tr("جریمه", "Penalty")} v={String(penalized)} />
          <Mini k={tr("کلیف", "Cliff")} v={String(cliffs)} />
        </div>
        <div className="flex gap-1 rounded-lg bg-elevated p-1">
          {(
            [
              ["all", "همه", "All"],
              ["penalty", "جریمه‌شده", "Penalized"],
              ["cliff", "کلیف‌مانند", "Cliff-like"],
            ] as const
          ).map(([id, label, en]) => (
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
              {tr(label, en)}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[680px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-4 py-2 text-start font-medium">{tr("ارز", "Coin")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("آنلاک بعدی", "Next unlock")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("٪ عرضه ۳۰روز", "30-day supply %")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("کلیف", "Cliff")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("جریمه", "Penalty")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("حجم", "Volume")}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr className="border-t border-border">
                <td colSpan={6} className="px-4 py-6 text-sm text-muted">
                  {tr("در این فیلتر رویدادی نیست.", "Nothing in this filter.")}
                </td>
              </tr>
            ) : (
              visible.map((row) => (
                <tr key={row.id} className="border-t border-border">
                  <td className="px-4 py-3">
                    <CoinMark symbol={row.symbol} name={row.name} rank={row.rank} size="sm" />
                  </td>
                  <td className="px-4 py-3 text-muted">{whenLabel(row, tr, locale)}</td>
                  <td className="num px-4 py-3 text-fg">
                    {row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(2)}${pct}`}
                  </td>
                  <td className="px-4 py-3 text-muted">{row.unlockCliff ? tr("بله", "Yes") : tr("خیر", "No")}</td>
                  <td className="px-4 py-3">
                    <ExplainTip
                      title={tr(`جریمه آنلاک ${row.symbol}`, `Unlock penalty ${row.symbol}`)}
                      body={unlockExplain(row)}
                    >
                      {row.highDilution ? (
                        <span className="inline-flex rounded-full bg-down-dim px-2 py-1 text-xs text-down">
                          High Dilution · <span className="num ms-1">-{row.unlockPenalty}</span>
                        </span>
                      ) : (
                        <span className="text-xs text-subtle">
                          {row.unlockPenalty > 0
                            ? tr(`جریمه ${row.unlockPenalty}`, `Penalty ${row.unlockPenalty}`)
                            : tr("بدون جریمه", "No penalty")}
                        </span>
                      )}
                    </ExplainTip>
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
  const { tr } = useI18n();
  return (
    <div className="rounded-md bg-elevated px-3 py-2">
      <p className="text-xs text-subtle">{tr(k)}</p>
      <p className="num mt-1 text-sm text-fg">{v}</p>
    </div>
  );
}
