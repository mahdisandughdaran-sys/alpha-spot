import type { AnalysisResult } from "@/lib/crypto/types";
import { SignalButton } from "./signal-button";
import { formatScore } from "./format";

export function PortfolioPanel({ result }: { result: AnalysisResult }) {
  const sleeves = result.portfolio;
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">پرتفوی پیشنهادی اسپات</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          حتی با بهترین تحلیل، تمرکز کل سرمایه روی یک آلت‌کوین ریسک بالایی دارد.
          مدل پایه ۵۵٪ هسته، ۳۰٪ لارج‌کپ و ۱۵٪ میدکپ است. اگر کلید قطع فعال باشد
          وزن آلت صفر می‌شود؛ در ریسک بالا حجم آلت‌ها نصف و مابه‌التفاوت به بیت‌کوین می‌رود.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {sleeves.map((sleeve) => (
          <article
            key={sleeve.key}
            className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]"
          >
            <p className="num text-xs text-subtle">{sleeve.targetPct}٪</p>
            <h4 className="mt-1 text-sm text-fg">{sleeve.title}</h4>
            <p className="mt-2 text-xs leading-relaxed text-muted">{sleeve.note}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {sleeve.legs.length === 0 ? (
                <li className="text-xs text-subtle">در این آستین گزینه واجد شرایط نبود.</li>
              ) : (
                sleeve.legs.map((leg) => (
                  <li key={leg.symbol} className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-fg">{leg.name}</p>
                      <p className="num text-xs text-subtle">
                        {leg.symbol} · #{leg.rank}
                      </p>
                      <p className="mt-1 text-xs text-muted">{leg.reason}</p>
                    </div>
                    <div className="text-end">
                      <p className="num text-sm text-fg">
                        {(leg.weight * 100).toFixed(1)}٪
                      </p>
                      <p className="num text-xs text-subtle">{formatScore(leg.score)}</p>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </article>
        ))}
      </div>
      <SignalButton result={result} />
    </section>
  );
}
