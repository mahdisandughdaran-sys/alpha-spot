import { Star } from "lucide-react";
import type { CoinRow } from "@/lib/crypto/types";
import { btcPriceLabel } from "@/lib/crypto/explain";
import type { DeskFilter } from "@/lib/crypto/risk-view";
import { CoinMark } from "./coin-mark";
import { FlashValue } from "./flash-value";
import { formatPct, formatScore, formatUsd } from "./format";
import { RiskMeter } from "./risk-breakdown";

const EMPTY: Record<DeskFilter, string> = {
  all: "رتبه‌ای برای نمایش نیست.",
  unlock: "در این نمونه آزادسازی قابل‌سنجش نیست.",
  rebalance: "مقصد چرخشی با امتیاز بالای ۶۸، بدون رقیق‌سازی و با سیگنال باز پیدا نشد.",
  "btc-cycle": "سیکل آرام بیت‌کوین — روند غیرنزولی، بتای کنترل‌شده و فشار ریسک زیر ۵۰ — در این اسکن خالی است.",
};

export function Leaderboard({
  rows,
  picked,
  watched,
  onToggleWatch,
  live,
  filter,
}: {
  rows: CoinRow[];
  picked: string;
  watched: string[];
  onToggleWatch: (symbol: string) => void;
  live: Record<string, number>;
  filter: DeskFilter;
}) {
  return (
    <section className="rounded-xl bg-surface">
      <div className="flex items-end justify-between gap-3 p-5">
        <div>
          <h3 className="text-base font-medium text-fg">رتبه‌بندی مدل</h3>
          <p className="mt-1 text-xs text-subtle">
            قیمت دلار با تیکر زنده چشمک می‌زند. فشار ریسک جدا از امتیاز اسپات است و با لمس نوارها باز می‌شود.
          </p>
        </div>
      </div>
      {rows.length === 0 ? (
        <p className="px-5 pb-6 text-sm text-muted">{EMPTY[filter]}</p>
      ) : (
        <>
          <div className="flex flex-col gap-2 px-3 pb-3 md:hidden">
            {rows.map((row, i) => {
              const active = row.symbol === picked;
              const starred = watched.includes(row.symbol);
              const price = live[row.symbol] ?? row.priceUsd;
              const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
              return (
                <article
                  key={row.id}
                  className={
                    active
                      ? "rounded-lg bg-elevated p-3"
                      : "rounded-lg bg-bg/40 p-3"
                  }
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-start gap-2">
                      <span className="num pt-2 text-xs text-subtle">{i + 1}</span>
                      <CoinMark symbol={row.symbol} name={row.name} rank={row.rank} size="sm" />
                    </div>
                    <button
                      type="button"
                      onClick={() => onToggleWatch(row.symbol)}
                      className="flex size-11 items-center justify-center rounded-md text-subtle"
                      aria-label={starred ? "حذف از واچ‌لیست" : "افزودن به واچ‌لیست"}
                    >
                      <Star className="size-4" fill={starred ? "currentColor" : "none"} />
                    </button>
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <dt className="text-subtle">امتیاز</dt>
                      <dd className="mt-1">
                        <FlashValue id={`score:${row.symbol}`} value={row.score} format={formatScore} className="text-fg" />
                      </dd>
                    </div>
                    <div>
                      <dt className="text-subtle">۷ر vs BTC</dt>
                      <dd className={`num mt-1 ${rsTone}`}>{formatPct(row.rs7d)}</dd>
                    </div>
                    <div>
                      <dt className="text-subtle">قیمت</dt>
                      <dd className="mt-1">
                        <FlashValue id={`px:${row.symbol}`} value={price} format={(n) => `$${formatUsd(n)}`} className="text-fg" />
                      </dd>
                    </div>
                  </dl>
                  <div className="mt-3">
                    <RiskMeter row={row} />
                  </div>
                </article>
              );
            })}
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[1080px] text-sm">
              <thead>
                <tr className="border-t border-border text-xs text-subtle">
                  <th className="px-3 py-2 text-start font-medium" />
                  <th className="px-4 py-2 text-start font-medium">#</th>
                  <th className="px-4 py-2 text-start font-medium">ارز</th>
                  <th className="px-4 py-2 text-start font-medium">امتیاز</th>
                  <th className="px-4 py-2 text-start font-medium">فشار ریسک</th>
                  <th className="px-4 py-2 text-start font-medium">۷ر vs BTC</th>
                  <th className="px-4 py-2 text-start font-medium">MC/FDV</th>
                  <th className="px-4 py-2 text-start font-medium">آنلاک ۳۰ر</th>
                  <th className="px-4 py-2 text-start font-medium">سیگنال</th>
                  <th className="px-4 py-2 text-start font-medium">قیمت</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const active = row.symbol === picked;
                  const starred = watched.includes(row.symbol);
                  const price = live[row.symbol] ?? row.priceUsd;
                  const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
                  return (
                    <tr key={row.id} className={active ? "border-t border-border bg-elevated" : "border-t border-border"}>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => onToggleWatch(row.symbol)}
                          className="flex size-9 items-center justify-center rounded-md text-subtle hover:text-fg"
                          aria-label={starred ? "حذف از واچ‌لیست" : "افزودن به واچ‌لیست"}
                        >
                          <Star className="size-4" fill={starred ? "currentColor" : "none"} />
                        </button>
                      </td>
                      <td className="num px-4 py-3 text-subtle">{i + 1}</td>
                      <td className="px-4 py-3">
                        <CoinMark symbol={row.symbol} name={row.name} rank={row.rank} size="sm" />
                      </td>
                      <td className="px-4 py-3">
                        <FlashValue id={`score:${row.symbol}`} value={row.score} format={formatScore} className="text-fg" />
                      </td>
                      <td className="px-4 py-3">
                        <RiskMeter row={row} />
                      </td>
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
                        {row.buySignal === "suspended" ? "معلق" : row.buySignal === "reduced" ? "حجم ۵۰٪" : "باز"}
                      </td>
                      <td className="px-4 py-3">
                        <FlashValue id={`px:${row.symbol}`} value={price} format={(n) => `$${formatUsd(n)}`} className="text-fg" />
                        <p className="num text-xs text-subtle">{btcPriceLabel(row.priceBtc)}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
