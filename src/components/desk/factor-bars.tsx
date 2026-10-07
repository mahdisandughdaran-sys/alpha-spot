import type { FactorScore } from "@/lib/crypto/types";
import { formatScore } from "./format";

export function FactorBars({ factors }: { factors: FactorScore[] }) {
  const ordered = [...factors].sort((a, b) => b.weight - a.weight);
  return (
    <ul className="flex flex-col gap-4">
      {ordered.map((f) => (
        <li key={f.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-sm text-fg">{f.label}</p>
              <p className="mt-0.5 text-xs text-subtle">
                وزن {(f.weight * 100).toFixed(0)}٪
              </p>
            </div>
            <span className="num text-sm text-fg">{formatScore(f.score)}</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
              style={{ width: `${Math.max(4, Math.min(100, f.score))}%` }}
            />
          </div>
          <p className="text-xs leading-relaxed text-muted">{f.note}</p>
        </li>
      ))}
    </ul>
  );
}
