export function LiveBadge({ state }: { state: "connecting" | "live" | "delayed" }) {
  const label =
    state === "live"
      ? "Live Market Data - Synced"
      : state === "delayed"
        ? "Live Market Data - Delayed"
        : "Live Market Data - Syncing";
  const dot =
    state === "live" ? "live-dot" : state === "delayed" ? "live-dot live-dot-warn" : "live-dot live-dot-wait";
  return (
    <p className="inline-flex h-9 items-center gap-2 rounded-full bg-surface px-3 text-xs text-fg">
      <span className={dot} aria-hidden />
      <span className="num tracking-wide">{label}</span>
    </p>
  );
}
