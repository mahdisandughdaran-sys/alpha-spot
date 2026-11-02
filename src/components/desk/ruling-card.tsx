import type { Ruling, RulingLine } from "@/lib/crypto/ruling";
import { useI18n } from "@/lib/i18n/locale";

export function RulingCard({
  ruling,
  kicker,
  foot,
  compact = false,
}: {
  ruling: Ruling;
  kicker?: string;
  foot?: string;
  compact?: boolean;
}) {
  const { tr } = useI18n();
  const buying = ruling.side === "buy";
  return (
    <section className={compact ? "rounded-lg bg-bg p-3" : "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6"}>
      {kicker ? <p className="text-xs tracking-widest text-subtle">{kicker}</p> : null}
      <div className={kicker ? "mt-2" : ""}>
        <p className={compact ? "text-xs text-subtle" : "text-xs text-subtle"}>{tr("حکم", "Call")}</p>
        <p className={`font-medium tracking-tight ${compact ? "mt-1 text-2xl" : "mt-1 text-4xl md:text-5xl"} ${buying ? "text-up" : "text-warn"}`}>
          {buying ? tr("بخر", "Buy") : tr("نخر", "Do not buy")}
        </p>
        <p className={`text-fg ${compact ? "mt-1 text-sm" : "mt-2 text-base"}`}>{tr(ruling.subjectFa, ruling.subjectEn)}</p>
      </div>
      <div className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 grid gap-3 md:grid-cols-2"}>
        <ReasonColumn
          title={tr("چرا بخر", "Why buy")}
          lines={ruling.whyBuy}
          active={buying}
          tone="up"
        />
        <ReasonColumn
          title={tr("چرا نخر", "Why not")}
          lines={ruling.whyPass}
          active={!buying}
          tone="warn"
        />
      </div>
      {foot ? <p className="mt-3 text-xs leading-relaxed text-subtle">{foot}</p> : null}
    </section>
  );
}

function ReasonColumn({
  title,
  lines,
  active,
  tone,
}: {
  title: string;
  lines: RulingLine[];
  active: boolean;
  tone: "up" | "warn";
}) {
  const { tr } = useI18n();
  const mark = tone === "up" ? "text-up" : "text-warn";
  return (
    <div className={active ? "rounded-lg bg-elevated p-3" : "rounded-lg bg-bg p-3"}>
      <div className="flex items-center justify-between gap-2">
        <p className={`text-sm font-medium ${active ? mark : "text-muted"}`}>{title}</p>
        {active ? <p className={`text-xs ${mark}`}>{tr("این طرف حکم است", "This side is the call")}</p> : null}
      </div>
      <ul className="mt-2 flex flex-col gap-2">
        {lines.map((line) => (
          <li key={line.fa} className={`text-sm leading-relaxed ${active ? "text-fg" : "text-muted"}`}>
            {tr(line.fa, line.en)}
          </li>
        ))}
      </ul>
    </div>
  );
}
