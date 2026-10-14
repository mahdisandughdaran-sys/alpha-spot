import { useI18n } from "@/lib/i18n/locale";

export function LocaleSwitch() {
  const { locale, setLocale, tr } = useI18n();
  return (
    <div
      className="inline-flex h-11 items-center rounded-full bg-surface p-1 shadow-[var(--shadow-border)]"
      role="group"
      aria-label={tr("زبان", "Language")}
    >
      <button
        type="button"
        onClick={() => setLocale("fa")}
        aria-pressed={locale === "fa"}
        className={
          locale === "fa"
            ? "h-9 rounded-full bg-elevated px-3 text-xs text-fg"
            : "h-9 rounded-full px-3 text-xs text-muted hover:text-fg"
        }
      >
        فا
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        aria-pressed={locale === "en"}
        className={
          locale === "en"
            ? "num h-9 rounded-full bg-elevated px-3 text-xs text-fg"
            : "num h-9 rounded-full px-3 text-xs text-muted hover:text-fg"
        }
      >
        EN
      </button>
    </div>
  );
}
