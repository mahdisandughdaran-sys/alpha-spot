import { useI18n } from "@/lib/i18n/locale";

export function LiveBadge({ state }: { state: "connecting" | "live" | "delayed" }) {
  const { tr } = useI18n();
  const label =
    state === "live"
      ? tr("داده زنده بازار - همگام", "Live Market Data - Synced")
      : state === "delayed"
        ? tr("داده زنده بازار - با تأخیر", "Live Market Data - Delayed")
        : tr("داده زنده بازار - در حال همگام‌سازی", "Live Market Data - Syncing");
  const dot =
    state === "live" ? "live-dot" : state === "delayed" ? "live-dot live-dot-warn" : "live-dot live-dot-wait";
  return (
    <p className="inline-flex h-9 items-center gap-2 rounded-full bg-surface px-3 text-xs text-fg">
      <span className={dot} aria-hidden />
      <span className="num tracking-wide">{label}</span>
    </p>
  );
}
