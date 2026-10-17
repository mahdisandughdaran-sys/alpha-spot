import { formatUntil } from "@/components/desk/format";
import { verdictSentence } from "@/lib/crypto/verdict";
import type { HorizonCall } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";

const TITLES = {
  day: ["یک روز", "One day"],
  week: ["یک هفته", "One week"],
  month: ["یک ماه", "One month"],
} as const;

export function ValidityBoard({
  calls,
  active,
}: {
  calls: HorizonCall[];
  active: HorizonCall["horizon"];
}) {
  const { tr } = useI18n();
  if (!calls.length) return null;
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h2 className="text-sm font-medium text-fg">{tr("اعتبار هر حکم", "How long each call lasts")}</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-subtle">
          {tr(
            "حکم روز فردا می‌تواند عوض شود. حکم هفته و ماه تا پایان ساعت اعتبار سر جایشان می‌مانند، حتی اگر تحلیل لحظه‌ای چیز دیگری بگوید. اگر وقت خرید اسپات نباشد، جواب این است: هیچ ارزی نخر.",
            "The day call may change tomorrow. The week and month calls stay put until they expire, even if the live tape disagrees. When it is not time to buy spot, the answer is: do not buy any coin.",
          )}
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {calls.map((call) => {
          const on = call.horizon === active;
          const title = TITLES[call.horizon];
          return (
            <article
              key={call.horizon}
              className={
                on
                  ? "rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)]"
                  : "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              }
            >
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-subtle">{tr(title[0], title[1])}</p>
                {on ? <p className="text-xs text-fg">{tr("افق انتخاب‌شده", "Selected horizon")}</p> : null}
              </div>
              <p className={`mt-2 text-xl font-medium tracking-tight ${call.kind === "buy" ? "text-up" : "text-warn"}`}>
                {tr(verdictSentence(call.kind))}
              </p>
              {call.kind === "buy" && call.symbol ? (
                <p className="mt-1 text-sm text-fg">
                  <span className="num">{call.symbol}</span>
                  {call.name ? ` · ${call.name}` : ""}
                </p>
              ) : (
                <p className="mt-1 text-sm text-muted">{tr("نقد بمان. هیچ ارزی نخر.", "Stay in cash. Do not buy any coin.")}</p>
              )}
              <p className="mt-3 text-xs leading-relaxed text-muted">{tr(call.reason)}</p>
              <p className="mt-3 text-xs text-subtle">
                {tr("معتبر تا", "Valid until")} <span className="num text-fg">{formatUntil(call.validUntil)}</span>
                {call.held ? tr(" · قفل است", " · locked") : null}
              </p>
              {call.dissent ? <p className="mt-2 text-xs leading-relaxed text-warn">{tr(call.dissent)}</p> : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
