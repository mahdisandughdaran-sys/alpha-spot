import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { Horizon } from "@/lib/crypto/lens";
import { savePrefs, type DeskPrefs } from "@/lib/crypto/prefs";
import { VENUE_LABEL, VENUES, type VenueId } from "@/lib/crypto/venues";
import { useI18n } from "@/lib/i18n/locale";

export function PrefsGate({ onSave }: { onSave: (prefs: DeskPrefs) => void }) {
  const { tr } = useI18n();
  const [venue, setVenue] = useState<VenueId | null>(null);
  const [horizon, setHorizon] = useState<Horizon | null>(null);

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7">
      <h2 className="text-xl font-medium tracking-tight text-fg md:text-2xl">
        {tr("کجا می‌خرید، و برای چه مدتی؟", "Where do you buy, and for how long?")}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        {tr(
          "تحلیل بعد از این دو جواب شروع می‌شود. فقط همین‌جا روی دستگاه شما می‌ماند. کلید صرافی پرسیده نمی‌شود.",
          "The ranking starts after these two answers. They stay on this device only. No exchange key is asked.",
        )}
      </p>
      <p className="mt-6 text-xs text-subtle">{tr("صرافی", "Exchange")}</p>
      <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
        {VENUES.map((id) => {
          const on = venue === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setVenue(id)}
              className={
                on
                  ? "h-12 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                  : "h-12 rounded-md bg-bg px-3 text-sm text-muted shadow-[var(--shadow-border)]"
              }
            >
              {tr(VENUE_LABEL[id])}
            </button>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-subtle">{tr("اعتبار حکم", "How long the call lasts")}</p>
      <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {(
          [
            ["day", tr("یک روز", "One day"), tr("فردا می‌تواند عوض شود", "May change tomorrow")],
            ["week", tr("یک هفته", "One week"), tr("تا هفت روز قفل است", "Locked for seven days")],
            ["month", tr("یک ماه", "One month"), tr("تا سی روز قفل است", "Locked for thirty days")],
          ] as const
        ).map(([id, label, hint]) => {
          const on = horizon === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setHorizon(id)}
              className={
                on
                  ? "flex h-16 flex-col items-center justify-center rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                  : "flex h-16 flex-col items-center justify-center rounded-md bg-bg px-3 text-sm text-muted shadow-[var(--shadow-border)]"
              }
            >
              <span>{label}</span>
              <span className="mt-0.5 text-xs text-subtle">{hint}</span>
            </button>
          );
        })}
      </div>
      <Button
        size="lg"
        className="mt-6 h-12"
        disabled={!venue || !horizon}
        onClick={() => {
          if (!venue || !horizon) return;
          const next = { venue, horizon };
          savePrefs(next);
          onSave(next);
        }}
      >
        {tr("ادامه و تحلیل", "Continue and rank")}
      </Button>
    </section>
  );
}
