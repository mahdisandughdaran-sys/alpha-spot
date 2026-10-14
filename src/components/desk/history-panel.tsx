import type { RunSummary } from "@/lib/crypto/history";
import { useI18n } from "@/lib/i18n/locale";
import { formatPct, formatScore } from "./format";

export function HistoryPanel({ runs }: { runs: RunSummary[] }) {
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
  if (runs.length === 0) {
    return (
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-base font-medium text-fg">{tr("سابقه تحلیل‌ها", "Analysis history")}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {tr(
            "بعد از هر تحلیل، انتخاب و رژیم در همین مرورگر ذخیره می‌شود تا بتوانید تغییر برنده را ببینید. حساب کاربری لازم نیست.",
            "After each run, the pick and the regime are stored in this browser so you can see when the winner changes. No account is required.",
          )}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <div className="p-5">
        <h3 className="text-base font-medium text-fg">{tr("سابقه تحلیل‌ها", "Analysis history")}</h3>
        <p className="mt-1 text-xs text-subtle">
          {tr(
            "تا ۱۲ اجرای اخیر روی این دستگاه. برای قضاوت وزن‌ها، برنده را با ۷ روز بعد مقایسه کنید.",
            "Up to 12 recent runs on this device. To judge the weights, compare the winner with the following 7 days.",
          )}
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-t border-border text-xs text-subtle">
              <th className="px-4 py-2 text-start font-medium">{tr("زمان", "Time")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("انتخاب", "Pick")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("امتیاز", "Score")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("رژیم", "Regime")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("دامیننس", "Dominance")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("۷ر vs BTC", "7d vs BTC")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("کلید قطع", "Kill-switch")}</th>
              <th className="px-4 py-2 text-start font-medium">{tr("دوم", "Runner-up")}</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((run) => (
              <tr key={run.at} className="border-t border-border">
                <td className="num px-4 py-3 text-subtle">
                  {new Date(run.at).toLocaleString(locale === "en" ? "en-US" : "fa-IR", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-col">
                    <span className="text-fg">{tr(run.name)}</span>
                    <span className="num text-xs text-subtle">{run.pick}</span>
                  </div>
                </td>
                <td className="num px-4 py-3 text-fg">{formatScore(run.score)}</td>
                <td className="px-4 py-3 text-muted">
                  {run.regime === "btc"
                    ? tr("بیت‌کوین", "Bitcoin")
                    : run.regime === "alt"
                      ? tr("آلت", "Alt")
                      : tr("خنثی", "Neutral")}
                </td>
                <td className="num px-4 py-3 text-muted">
                  {run.dominance.toFixed(1)}
                  {pct}
                </td>
                <td className="num px-4 py-3 text-muted">{formatPct(run.rs7d)}</td>
                <td className="px-4 py-3 text-muted">
                  {run.killStatus === "SUSPENDED"
                    ? tr("معلق", "Suspended")
                    : run.killStatus === "HIGH_RISK"
                      ? tr("حجم نصف", "Half size")
                      : run.killStatus === "NORMAL"
                        ? tr("نرمال", "Normal")
                        : "—"}
                </td>
                <td className="num px-4 py-3 text-subtle">{run.runnerUp ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
