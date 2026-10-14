import type { WeightCuts } from "@/lib/crypto/lens";
import {
  type RegimeBucket,
  type StoredSuggestion,
} from "@/lib/crypto/report-card";
import type { FactorKey } from "@/lib/crypto/types";
import { verdictSentence } from "@/lib/crypto/verdict";
import { useI18n } from "@/lib/i18n/locale";

const FACTOR_NAME: Record<FactorKey, [string, string]> = {
  rs: ["قدرت نسبی", "relative strength"],
  tokenomics: ["توکنومیکس", "tokenomics"],
  entry: ["ورود", "entry"],
  trend: ["روند", "trend"],
  liquidity: ["نقدشوندگی", "liquidity"],
  risk: ["ریسک", "risk"],
  narrative: ["روایت", "narrative"],
};

const REGIME_NAME: Record<RegimeBucket["regime"], [string, string]> = {
  btc: ["فصل بیت‌کوین", "Bitcoin season"],
  alt: ["فصل آلت", "Alt season"],
  neutral: ["خنثی", "Neutral"],
};

function cell(excess: number | null, n: number, pending: string): string {
  if (!n || excess == null) return pending;
  const pct = excess * 100;
  const sign = pct > 0 ? "+" : "";
  return `${sign}${pct.toFixed(1)}٪ · ${n}`;
}

export function ReportCard({
  rows,
  buckets,
  cuts,
  lagged,
  weak,
}: {
  rows: StoredSuggestion[];
  buckets: RegimeBucket[];
  cuts: WeightCuts;
  lagged: boolean;
  weak: FactorKey | null;
}) {
  const { tr, locale } = useI18n();
  const pending = tr("هنوز نرسیده", "Not due yet");
  const cutsOn = (Object.keys(cuts) as FactorKey[]).filter((key) => {
    const value = cuts[key];
    return typeof value === "number" && value < 0.999;
  });

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <h3 className="text-base font-medium text-fg">
        {tr("کارنامه در برابر بیت‌کوین", "Record against Bitcoin")}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        {tr(
          "هر جمله ذخیره می‌شود. بعد از ۷ و ۳۰ روز، بازده خالص بعد از کارمزد با بیت‌کوین مقایسه می‌شود؛ جدا برای فصل بیت‌کوین، آلت و خنثی. اگر عقب باشد، وزن همان عامل در تحلیل بعدی کمتر می‌شود.",
          "Each sentence is stored. After 7 and 30 days, the net return after fees is compared with Bitcoin, separately for Bitcoin season, alt season, and neutral. If it lagged, that factor weighs less on the next ranking.",
        )}
      </p>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[28rem] text-start text-sm">
          <thead>
            <tr className="text-xs text-subtle">
              <th className="px-2 py-2 font-medium">{tr("فصل", "Season")}</th>
              <th className="px-2 py-2 font-medium">{tr("۷ روز", "7 days")}</th>
              <th className="px-2 py-2 font-medium">{tr("۳۰ روز", "30 days")}</th>
            </tr>
          </thead>
          <tbody>
            {buckets.map((bucket) => (
              <tr key={bucket.regime} className="border-t border-border">
                <td className="px-2 py-3 text-fg">{tr(REGIME_NAME[bucket.regime][0], REGIME_NAME[bucket.regime][1])}</td>
                <td className="num px-2 py-3 text-muted">{cell(bucket.excess7, bucket.n7, pending)}</td>
                <td className="num px-2 py-3 text-muted">{cell(bucket.excess30, bucket.n30, pending)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {lagged && weak ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {tr(
            `از بیت‌کوین عقب ماند. وزن ${FACTOR_NAME[weak][0]} کم شد و در عدسی همین تحلیل اعمال می‌شود.`,
            `It lagged Bitcoin. The ${FACTOR_NAME[weak][1]} weight was cut and is applied in this lens.`,
          )}
        </p>
      ) : null}
      {cutsOn.length ? (
        <ul className="mt-3 flex flex-col gap-1">
          {cutsOn.map((key) => (
            <li key={key} className="text-xs text-subtle">
              {tr(FACTOR_NAME[key][0], FACTOR_NAME[key][1])}
              {" · "}
              <span className="num">{((cuts[key] ?? 1) * 100).toFixed(0)}٪</span>
              {tr(" وزن پایه", " of base weight")}
            </li>
          ))}
        </ul>
      ) : null}
      {rows.length ? (
        <ul className="mt-4 flex flex-col gap-2">
          {rows.slice(0, 4).map((row) => (
            <li key={row.id} className="text-xs leading-relaxed text-subtle">
              <span className="num">
                {new Date(row.at).toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR")}
              </span>
              {" · "}
              <span className="text-fg">{tr(verdictSentence(row.kind))}</span>
              {" · "}
              <span className="num">{row.symbol}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-xs text-subtle">
          {tr("هنوز جمله‌ای ذخیره نشده.", "No sentence has been stored yet.")}
        </p>
      )}
    </section>
  );
}
