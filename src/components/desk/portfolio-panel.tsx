import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { useI18n } from "@/lib/i18n/locale";
import type { AnalysisResult } from "@/lib/crypto/types";
import { SignalButton } from "./signal-button";
import { CoinMark } from "./coin-mark";
import { formatScore } from "./format";

const SLICE = ["var(--color-accent)", "var(--color-up)", "var(--color-warn)"];

export function PortfolioPanel({ result }: { result: AnalysisResult }) {
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
  const sleeves = result.portfolio;
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const chart = sleeves.map((sleeve) => ({
    name: tr(sleeve.title),
    value: sleeve.targetPct,
    note: tr(sleeve.note),
  }));

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">{tr("پرتفوی پیشنهادی اسپات", "Suggested spot portfolio")}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          {tr(
            "حتی با بهترین تحلیل، تمرکز کل سرمایه روی یک آلت‌کوین ریسک بالایی دارد. مدل پایه ۵۵٪ هسته، ۳۰٪ لارج‌کپ و ۱۵٪ میدکپ است. اگر کلید قطع فعال باشد وزن آلت صفر می‌شود؛ در ریسک بالا حجم آلت‌ها نصف و مابه‌التفاوت به بیت‌کوین می‌رود.",
            "Even with the best read, putting the whole book in one alt is a high risk. The base model is 55% core, 30% large-cap, and 15% mid-cap. If the kill-switch is on, alt weight goes to zero; in high risk, alt size is halved and the difference moves to Bitcoin.",
          )}
        </p>
      </div>
      <div className="grid gap-4 lg:grid-cols-[16rem_1fr]">
        <div className="h-56 rounded-xl bg-surface p-3">
          {ready ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={chart} dataKey="value" nameKey="name" innerRadius={48} outerRadius={78} paddingAngle={3} stroke="none">
                  {chart.map((slice, index) => (
                    <Cell key={slice.name} fill={SLICE[index % SLICE.length]} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const row = payload[0]?.payload as { name: string; value: number; note: string };
                    return (
                      <div className="glass-pop max-w-xs rounded-lg px-3 py-2">
                        <p className="text-xs text-fg">
                          {tr(row.name)}
                          <span className="num ms-2">
                            {row.value}
                            {pct}
                          </span>
                        </p>
                        <p className="mt-1 text-xs leading-relaxed text-muted">{tr(row.note)}</p>
                      </div>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : null}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {sleeves.map((sleeve, index) => (
            <article key={sleeve.key} className="rounded-xl bg-surface p-5">
              <p className="num text-xs" style={{ color: SLICE[index % SLICE.length] }}>
                {sleeve.targetPct}
                {pct}
              </p>
              <h4 className="mt-1 text-sm text-fg">{tr(sleeve.title)}</h4>
              <p className="mt-2 text-xs leading-relaxed text-muted">{tr(sleeve.note)}</p>
              <ul className="mt-4 flex flex-col gap-3">
                {sleeve.legs.length === 0 ? (
                  <li className="text-xs text-subtle">
                    {tr("در این آستین گزینه واجد شرایط نبود.", "No name in this sleeve qualified.")}
                  </li>
                ) : (
                  sleeve.legs.map((leg) => (
                    <li key={leg.symbol} className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CoinMark symbol={leg.symbol} name={leg.name} rank={leg.rank} size="sm" />
                        <p className="mt-2 text-xs text-muted">{tr(leg.reason)}</p>
                      </div>
                      <div className="text-end">
                        <p className="num text-sm text-fg">
                          {(leg.weight * 100).toFixed(1)}
                          {pct}
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
      </div>
      <SignalButton result={result} />
    </section>
  );
}
