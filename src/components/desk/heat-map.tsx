import { useEffect, useMemo, useRef, useState } from "react";
import { layoutHeatmap } from "@/lib/crypto/heatmap";
import type { CoinRow } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";
import { CoinMark } from "./coin-mark";
import { FactorBars } from "./factor-bars";
import { formatUsd } from "./format";

const MAP_LIMIT = 24;

export function HeatMap({
  rows,
  live,
  picked,
  armed,
  onArm,
}: {
  rows: CoinRow[];
  live: Record<string, number>;
  picked: string;
  armed: string | null;
  onArm: (symbol: string) => void;
}) {
  const { tr } = useI18n();
  const frame = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ w: 720, h: 420 });
  const [selected, setSelected] = useState<string | null>(armed ?? (picked || null));

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const apply = () => {
      const w = el.clientWidth;
      if (w > 0) setBox({ w, h: w < 640 ? 520 : 440 });
    };
    apply();
    const obs = new ResizeObserver(apply);
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const ranked = useMemo(() => {
    const sorted = [...rows].sort((a, b) => b.volume24h - a.volume24h);
    const keep = sorted.slice(0, MAP_LIMIT);
    for (const symbol of [picked, armed ?? ""]) {
      if (!symbol || keep.some((row) => row.symbol === symbol)) continue;
      const extra = rows.find((row) => row.symbol === symbol);
      if (extra) keep.push(extra);
    }
    return keep;
  }, [rows, picked, armed]);

  const cells = useMemo(
    () =>
      layoutHeatmap(
        ranked.map((row) => ({ id: row.symbol, weight: Math.max(row.volume24h, 1) })),
        box.w,
        box.h,
      ),
    [ranked, box],
  );

  const bySymbol = useMemo(() => new Map(ranked.map((row) => [row.symbol, row])), [ranked]);
  const focus = bySymbol.get(selected ?? "") ?? ranked[0] ?? null;

  return (
    <section className="grid gap-4 lg:grid-cols-[1.4fr_0.8fr]">
      <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs text-subtle">{tr("نقشه اسپات", "Spot map")}</p>
            <h2 className="mt-1 text-lg text-fg">{tr("حجم، خانه را بزرگ می‌کند. امتیاز، رنگ را می‌سازد.", "Volume sizes the tile. Score paints it.")}</h2>
          </div>
          <p className="text-xs text-subtle">
            {tr(`${ranked.length} نام نقدتر از صد تای اول`, `${ranked.length} most liquid names from the top 100`)}
          </p>
        </div>
        <div ref={frame} className="relative mt-4 overflow-hidden rounded-lg" style={{ height: box.h }}>
          {cells.map((cell) => {
            const row = bySymbol.get(cell.id);
            if (!row) return null;
            const price = live[row.symbol] ?? row.priceUsd;
            const on = row.symbol === selected;
            const tight = cell.w < 78 || cell.h < 52;
            return (
              <button
                key={row.symbol}
                type="button"
                onClick={() => setSelected(row.symbol)}
                className="absolute overflow-hidden text-start"
                style={{
                  left: cell.x + 1.5,
                  top: cell.y + 1.5,
                  width: Math.max(cell.w - 3, 0),
                  height: Math.max(cell.h - 3, 0),
                  background: heatFill(row.score),
                  color: row.score >= 88 ? "var(--color-accent-fg)" : "var(--color-fg)",
                  boxShadow: on ? "inset 0 0 0 2px var(--color-fg)" : undefined,
                }}
              >
                <span className="flex h-full flex-col justify-between p-2">
                  <span className="num text-xs">{row.symbol}</span>
                  {tight ? null : (
                    <span className="flex flex-col">
                      <span className="num text-sm">${formatUsd(price)}</span>
                      <span className="num text-xs opacity-80">{Math.round(row.score)}</span>
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
        <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
          <span className="h-2 w-16 rounded-full" style={{ background: "linear-gradient(to right, var(--color-down), var(--color-elevated), var(--color-up))" }} />
          <span>{tr("امتیاز پایین تا بالا", "Low score to high")}</span>
          {picked ? (
            <span>
              {tr("انتخاب مدل", "Model pick")} <span className="num text-fg">{picked}</span>
            </span>
          ) : null}
        </div>
      </div>

      {focus ? (
        <aside className="flex flex-col gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
          <CoinMark symbol={focus.symbol} name={focus.name} rank={focus.rank} size="lg" />
          <dl className="grid grid-cols-2 gap-3">
            <Stat k={tr("امتیاز", "Score")} v={focus.score.toFixed(1)} />
            <Stat k={tr("قیمت", "Price")} v={`$${formatUsd(live[focus.symbol] ?? focus.priceUsd)}`} />
            <Stat k={tr("۷ روز نسبت به BTC", "7d vs BTC")} v={signedPct(focus.rs7d)} tone={focus.rs7d >= 0 ? "up" : "down"} />
            <Stat k={tr("حجم ۲۴س", "24h volume")} v={`$${compact(focus.volume24h)}`} />
          </dl>
          <FactorBars factors={focus.factors} />
          <button
            type="button"
            onClick={() => onArm(focus.symbol)}
            className="h-12 rounded-md bg-accent text-sm text-accent-fg"
          >
            {tr(`مسلح کردن بلیت ${focus.symbol}`, `Arm a ${focus.symbol} ticket`)}
          </button>
          <p className="text-xs leading-relaxed text-subtle">
            {tr(
              "مسلح کردن سفارش نمی‌فرستد. همان ماشین سه لیمیت، با ریسک و ابطال خود این نام، بلیت را عوض می‌کند.",
              "Arming does not send an order. The same three-limit machine rebuilds the ticket from this name’s risk and invalidation.",
            )}
          </p>
        </aside>
      ) : null}
    </section>
  );
}

function heatFill(score: number): string {
  const t = Math.min(100, Math.max(0, score)) / 100;
  if (t >= 0.5) {
    const mix = Math.round((t - 0.5) * 200);
    return `color-mix(in oklab, var(--color-up) ${mix}%, var(--color-elevated))`;
  }
  const mix = Math.round((0.5 - t) * 200);
  return `color-mix(in oklab, var(--color-down) ${mix}%, var(--color-elevated))`;
}

function signedPct(value: number): string {
  const points = value * 100;
  const sign = points > 0 ? "+" : "";
  return `${sign}${points.toFixed(1)}%`;
}

function compact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return Math.round(n).toString();
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "up" | "down" }) {
  const color = tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg";
  return (
    <div>
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className={`num mt-1 text-sm ${color}`}>{v}</dd>
    </div>
  );
}
