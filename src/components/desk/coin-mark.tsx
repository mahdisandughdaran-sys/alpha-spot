import { useState } from "react";
import { useI18n } from "@/lib/i18n/locale";

const BOX = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
} as const;

export function CoinMark({
  symbol,
  name,
  rank,
  size = "md",
}: {
  symbol: string;
  name: string;
  rank?: number;
  size?: "sm" | "md" | "lg";
}) {
  const { tr } = useI18n();
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const ticker = symbol.toLowerCase();
  const src =
    stage === 0
      ? `https://assets.coincap.io/assets/icons/${ticker}@2x.png`
      : stage === 1
        ? `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@0.18.1/32/color/${ticker}.png`
        : null;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <span
        className={`grid ${BOX[size]} shrink-0 place-items-center overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]`}
      >
        {src ? (
          <img
            src={src}
            alt=""
            width={56}
            height={56}
            className="size-full object-cover"
            onError={() => setStage((current) => (current === 0 ? 1 : 2))}
          />
        ) : (
          <span className="num text-xs text-fg">{symbol.slice(0, 3)}</span>
        )}
      </span>
      <div className="min-w-0">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span
            className={
              size === "lg"
                ? "truncate text-3xl font-medium tracking-tight text-fg md:text-4xl"
                : "truncate text-sm text-fg"
            }
          >
            {tr(name)}
          </span>
          <span className="num inline-flex h-6 shrink-0 items-center rounded-sm bg-fg px-1.5 text-xs font-medium text-bg">
            {symbol}
          </span>
        </div>
        {rank != null ? (
          <p className="mt-0.5 text-xs text-subtle">
            {tr("رتبه بازار", "Market rank")} <span className="num">#{rank}</span>
          </p>
        ) : null}
      </div>
    </div>
  );
}
