import type { RunSummary } from "@/lib/crypto/history";
import { formatPct, formatScore } from "./format";

export function HistoryPanel({ runs }: { runs: RunSummary[] }) {
  if (runs.length === 0) {
    return (
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-base font-medium text-fg">سابقه تحلیل‌ها</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          بعد از هر تحلیل، انتخاب و رژیم در همین مرورگر ذخیره می‌شود تا بتوانید
          تغییر برنده را ببینید. حساب کاربری لازم نیست.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="p-5">
        <h3 className="text-base font-medium text-fg">سابقه تحلیل‌ها</h3>
        <p className="mt-1 text-xs text-subtle">
          تا ۱۲ اجرای اخیر روی این دستگاه. برای قضاوت وزن‌ها، برنده را با ۷ روز بعد مقایسه کنید.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-4 py-2 text-start font-medium">زمان</th>
              <th className="px-4 py-2 text-start font-medium">انتخاب</th>
              <th className="px-4 py-2 text-start font-medium">امتیاز</th>
              <th className="px-4 py-2 text-start font-medium">رژیم</th>
              <th className="px-4 py-2 text-start font-medium">دامیننس</th>
              <th className="px-4 py-2 text-start font-medium">۷ر vs BTC</th>
              <th className="px-4 py-2 text-start font-medium">دوم</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.at} className="border-t border-border">
                <td className="num px-4 py-3 text-subtle">
                  {new Date(run.at).toLocaleString("fa-IR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-fg">{run.name}</span>
                    <span className="num text-xs text-subtle">{run.pick}</span>
                  </div>
                </td>
                <td className="num px-4 py-3 text-fg">{formatScore(run.score)}</td>
                <td className="px-4 py-3 text-muted">
                  {run.regime === "btc"
                    ? "بیت‌کوین"
                    : run.regime === "alt"
                      ? "آلت"
                      : "خنثی"}
                </td>
                <td className="num px-4 py-3 text-muted">
                  {run.dominance.toFixed(1)}٪
                </td>
                <td className="num px-4 py-3 text-muted">{formatPct(run.rs7d)}</td>
                <td className="num px-4 py-3 text-subtle">{run.runnerUp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
