import type { DeskFilter } from "@/lib/crypto/risk-view";

const FILTERS: { id: DeskFilter; label: string }[] = [
  { id: "all", label: "رتبه مدل" },
  { id: "unlock", label: "بیشترین ریسک آنلاک" },
  { id: "rebalance", label: "بهترین فرصت‌های Rebalance" },
  { id: "btc-cycle", label: "سیکل‌های کم‌ریسک بیت‌کوین" },
];

export function QuickFilters({
  value,
  onChange,
}: {
  value: DeskFilter;
  onChange: (next: DeskFilter) => void;
}) {
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
            {filter.label}
          </button>
        );
      })}
    </div>
  );
}
