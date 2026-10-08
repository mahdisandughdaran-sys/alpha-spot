import { ShieldAlert, ShieldCheck } from "lucide-react";
import type { BtcKillSwitch } from "@/lib/crypto/types";
import { formatPct, formatUsd } from "./format";

export function KillSwitchBanner({ kill }: { kill: BtcKillSwitch }) {
  const tone =
    kill.status === "SUSPENDED"
      ? "bg-down-dim text-down"
      : kill.status === "HIGH_RISK"
        ? "bg-warn-dim text-warn"
        : "bg-up-dim text-up";
  const Icon = kill.status === "NORMAL" ? ShieldCheck : ShieldAlert;

  return (
    <section className={`rounded-xl p-4 shadow-[var(--shadow-border)] md:p-5 ${tone}`}>
      <div className="flex items-start gap-3">
        <Icon className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium">{kill.headline}</p>
          <p className="mt-1 text-xs leading-relaxed text-fg/80">{kill.note}</p>
          <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label="قیمت BTC" value={`$${formatUsd(kill.priceUsd)}`} />
            <Stat
              label="EMA ۲۰۰"
              value={kill.ema200 == null ? "—" : `$${formatUsd(kill.ema200)}`}
            />
            <Stat
              label="فاصله تا EMA"
              value={kill.distanceToEma == null ? "—" : formatPct(kill.distanceToEma)}
            />
            <Stat
              label="بازده ۴ هفته"
              value={kill.weeklyMomentum == null ? "—" : formatPct(kill.weeklyMomentum)}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-bg/40 px-3 py-2">
      <dt className="text-xs text-fg/70">{label}</dt>
      <dd className="num mt-1 text-sm text-fg">{value}</dd>
    </div>
  );
}
