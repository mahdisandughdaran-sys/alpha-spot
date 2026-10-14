import { useI18n } from "@/lib/i18n/locale";
import type { DeskFilter } from "@/lib/crypto/risk-view";

const FILTERS: { id: DeskFilter; label: string; en: string }[] = [
  { id: "all", label: "رتبه مدل", en: "Model rank" },
  { id: "unlock", label: "بیشترین ریسک آنلاک", en: "Highest unlock risk" },
  { id: "rebalance", label: "بهترین فرصت‌های Rebalance", en: "Best rebalance setups" },
  { id: "btc-cycle", label: "سیکل‌های کم‌ریسک بیت‌کوین", en: "Lower-risk Bitcoin cycles" },
];

export function QuickFilters({
  value,
  onChange,
}: {
  value: DeskFilter;
  onChange: (next: DeskFilter) => void;
}) {
  const { tr } = useI18n();
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {FILTERS.map((filter) => {
        const on = filter.id === value;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={
              on
                ? "h-11 shrink-0 rounded-full bg-accent px-4 text-sm text-accent-fg"
                : "h-11 shrink-0 rounded-full bg-surface px-4 text-sm text-muted hover:text-fg"
            }
          >
            {tr(filter.label, filter.en)}
          </button>
        );
      })}
    </div>
  );
}
