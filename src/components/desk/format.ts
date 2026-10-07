export function formatUsd(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1000) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(4);
}

export function formatPct(ratio: number, digits = 1): string {
  const v = ratio * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}٪`;
}

export function formatPctPoints(pctPoints: number, digits = 1): string {
  const sign = pctPoints > 0 ? "+" : "";
  return `${sign}${pctPoints.toFixed(digits)}٪`;
}

export function formatScore(n: number): string {
  return n.toFixed(1);
}

export function timeAgoFa(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fa-IR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
