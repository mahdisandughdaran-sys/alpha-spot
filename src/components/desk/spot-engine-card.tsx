import type { AnalysisResult } from "@/lib/crypto/types";
import { buildAtrPlan } from "@/lib/crypto/spot-analytics";
import { ExplainTip } from "./explain-tip";
import { formatPct, formatUsd } from "./format";
import { useI18n } from "@/lib/i18n/locale";

const FLOW_LABEL = {
  accumulation: "انباشت",
  distribution: "توزیع",
  neutral: "خنثی",
} as const;

export function SpotEngineCard({
  result,
  price,
}: {
  result: AnalysisResult;
  price: number;
}) {
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
  const pick = result.pick;
  const macro = result.macroRisk;
  const cut = Math.min(pick.sizeMultiplier, macro?.sizeMultiplier ?? pick.sizeMultiplier);
  const plan = buildAtrPlan({
    price,
    volatility30d: pick.volatility30d,
    sizeMultiplier: cut,
  });
  const leader = result.sectors?.[0];
  const flow = pick.accumulationState ? FLOW_LABEL[pick.accumulationState] : "—";

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-fg">{tr("موتور خرید اسپات", "Spot buy engine")}</h3>
          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-subtle">
            {tr(
              "این چهار عدد بعد از امتیاز اصلی اعمال می‌شوند: تورم عرضه، جریان ۱۴ روزه، بخش پیشتاز، و حد ضرر بر اساس نوسان.",
              "These four numbers are applied after the main score: supply dilution, 14-day flow, the leading sector, and a volatility stop.",
            )}
          </p>
        </div>
        <p
          className={
            macro?.level === "severe"
              ? "text-sm text-down"
              : macro?.level === "elevated"
                ? "text-sm text-warn"
                : "text-sm text-up"
          }
        >
          {macro?.headline ?? "ریسک کلان جدا نیامد"}
        </p>
      </div>

      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        <Metric
          label="FDV / مارکت‌کپ"
          value={pick.fdvToMcap == null ? "—" : `${pick.fdvToMcap.toFixed(1)}×`}
          hint={
            (pick.inflationPenalty ?? 0) > 0
              ? `جریمه ${pick.inflationPenalty} امتیاز، چون نسبت از ۵ گذشته است.`
              : "زیر آستانه ۵ برابر است و جریمه تورم ندارد."
          }
          tip="اگر ارزش کاملاً رقیق‌شده بیش از پنج برابر مارکت‌کپ امروز باشد، بخش بزرگی از عرضه هنوز قفل است."
        />
        <Metric
          label="انباشت ۱۴ روزه"
          value={
            pick.accumulationScore == null ? "—" : `${flow} ${pick.accumulationScore.toFixed(0)}`
          }
          hint={
            pick.accumulationState === "distribution"
              ? "حجم روزهای منفی سنگین‌تر بوده است."
              : pick.accumulationState === "accumulation"
                ? "حجم روزهای مثبت سنگین‌تر بوده است."
                : "جریان جهت قاطعی نداشته، یا کندل کافی نبوده است."
          }
          tip="شاخص از حجم روزهای سبز در برابر روزهای قرمز ساخته می‌شود. انباشت نزدیک سقف پاداش نمی‌گیرد."
        />
        <Metric
          label="بخش این نماد"
          value={pick.sectorLabel ?? "—"}
          hint={
            pick.sectorMomentum == null
              ? "نمره بخش در این اجرا نبود."
              : `نمره بخش ${pick.sectorMomentum.toFixed(0)}${
                  leader ? ` · پیشتاز بازار: ${leader.label}` : ""
                }${(pick.sectorBoost ?? 0) !== 0 ? ` · اثر روی نمره ${pick.sectorBoost! > 0 ? "+" : ""}${pick.sectorBoost}` : ""}`
          }
          tip="نمره بخش از بازده هفت‌روزه وزنی با حجم می‌آید. پاداش فقط به بخش پیشتاز و فقط دور از سقف داده می‌شود."
        />
        <Metric
          label="حد ضرر ATR"
          value={plan ? `$${formatUsd(plan.stop)}` : "—"}
          hint={
            plan
              ? `هدف $${formatUsd(plan.target)} · فاصله دنباله‌رو ${formatPct(plan.trailPct)} · حجم ${Math.round(plan.sizeMultiplier * 100)}٪`
              : "قیمت برای ساخت حد کافی نبود."
          }
          tip={plan?.note ?? "حد ضرر ۲٫۲ برابر ATR تقریبی زیر قیمت است و با همان فاصله دنبال می‌شود."}
        />
      </dl>
      {macro && macro.level !== "calm" ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">{macro.advice}</p>
      ) : null}
    </section>
  );
}

function Metric({
  label,
  value,
  hint,
  tip,
}: {
  label: string;
  value: string;
  hint: string;
  tip: string;
}) {
  return (
    <div className="rounded-lg bg-elevated p-4">
      <dt className="flex items-center gap-2 text-xs text-subtle">
        <ExplainTip title={label} body={tip}>
          {label}
        </ExplainTip>
      </dt>
      <dd className="num mt-2 text-lg text-fg">{value}</dd>
      <p className="mt-2 text-xs leading-relaxed text-muted">{hint}</p>
    </div>
  );
}
