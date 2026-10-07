import { Check, Minus, X } from "lucide-react";
import type { CheckItem } from "@/lib/crypto/types";
import { checklistPassCount } from "@/lib/crypto/checklist";

export function ChecklistCard({ items }: { items: CheckItem[] }) {
  const { pass, fail, unknown } = checklistPassCount(items);
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="text-base font-medium text-fg">چک‌لیست ورود اسپات</h3>
          <p className="mt-1 text-xs text-subtle">
            پنج قاعده ثابت. سبز یعنی شرط برقرار است، نه اینکه معامله تضمین شده باشد.
          </p>
        </div>
        <p className="num text-xs text-muted">
          {pass} از {items.length}
          {unknown ? ` · ${unknown} نامشخص` : ""}
          {fail ? ` · ${fail} رد` : ""}
        </p>
      </div>
      <ul className="mt-5 flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.key}
            className="flex gap-3 rounded-md bg-elevated p-3"
          >
            <StatusIcon ok={item.ok} />
            <div className="min-w-0">
              <p className="text-sm text-fg">{item.label}</p>
              <p className="mt-0.5 text-xs text-subtle">{item.desired}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StatusIcon({ ok }: { ok: boolean | null }) {
  if (ok === true) {
    return (
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-up-dim text-up">
        <Check className="size-3.5" />
      </span>
    );
  }
  if (ok === false) {
    return (
      <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-down-dim text-down">
        <X className="size-3.5" />
      </span>
    );
  }
  return (
    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated text-subtle shadow-[var(--shadow-border)]">
      <Minus className="size-3.5" />
    </span>
  );
}
