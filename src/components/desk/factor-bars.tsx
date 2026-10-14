import type { FactorScore } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";
import { formatScore } from "./format";
import { ExplainTip } from "./explain-tip";

function barColor(score: number): string {
  if (score >= 70) return "var(--color-up)";
  if (score >= 45) return "var(--color-warn)";
  return "var(--color-down)";
}

export function FactorBars({ factors }: { factors: FactorScore[] }) {
  const { tr } = useI18n();
  const ordered = [...factors].sort((a, b) => b.weight - a.weight);
  return (
    <ul className="flex flex-col gap-4">
      {ordered.map((f) => (
        <li key={f.key} className="flex flex-col gap-2">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="text-sm text-fg">{tr(f.label)}</p>
              <p className="mt-0.5 text-xs text-subtle">
                {tr(
                  `وزن ${(f.weight * 100).toFixed(0)}٪ از امتیاز اسپات`,
                  `Weight ${(f.weight * 100).toFixed(0)}% of the spot score`,
                )}
              </p>
            </div>
            <ExplainTip
              title={tr(f.label)}
              body={`${tr(f.note)} ${tr(
                `وزن این فاکتور ${(f.weight * 100).toFixed(0)}٪ است و نمره بالاتر بهتر است.`,
                `This factor weighs ${(f.weight * 100).toFixed(0)}% and a higher score is better.`,
              )}`}
            >
              <span className="num text-sm text-fg">{formatScore(f.score)}</span>
            </ExplainTip>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-elevated">
            <div
              className="h-full rounded-full transition-[width] duration-500 ease-out"
              style={{
                width: `${Math.max(4, Math.min(100, f.score))}%`,
                background: barColor(f.score),
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
