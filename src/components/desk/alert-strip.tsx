import { useEffect, useMemo, useState } from "react";
import { TriangleAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale";
import { deskAlerts } from "@/lib/crypto/risk-view";
import type { BtcKillSwitch, CoinRow } from "@/lib/crypto/types";

export function AlertStrip({ rows, kill }: { rows: CoinRow[]; kill: BtcKillSwitch }) {
  const { tr } = useI18n();
  const items = useMemo(() => deskAlerts(rows, kill), [rows, kill]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [items]);

  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % items.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [items]);

  if (items.length === 0) return null;
  const item = items[index % items.length];
  const tone = item.tone === "high" ? "text-down" : item.tone === "mid" ? "text-warn" : "text-up";

  return (
    <div role="status" className="rounded-xl bg-surface px-4 py-3">
      <div className="flex items-start gap-3">
        <TriangleAlert className={`mt-0.5 size-4 shrink-0 ${tone}`} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-subtle">{tr("هشدار زنده بازار", "Live market alert")}</p>
          <p className="mt-1 text-sm leading-relaxed text-fg">{tr(item.text)}</p>
        </div>
        {items.length > 1 ? (
          <span className="num text-xs text-subtle">
            {(index % items.length) + 1}/{items.length}
          </span>
        ) : null}
      </div>
    </div>
  );
}
