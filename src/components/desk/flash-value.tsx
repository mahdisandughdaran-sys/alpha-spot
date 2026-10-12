import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const seen = new Map<string, number>();

export function FlashValue({
  id,
  value,
  format,
  className,
}: {
  id: string;
  value: number;
  format: (value: number) => string;
  className?: string;
}) {
  const [dir, setDir] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    const prev = seen.get(id);
    seen.set(id, value);
    if (prev == null) return;
    const base = Math.max(Math.abs(prev), 1e-9);
    if (Math.abs(value - prev) / base < 0.00005) return;
    setDir(value > prev ? "up" : "down");
    const timer = window.setTimeout(() => setDir(null), 900);
    return () => window.clearTimeout(timer);
  }, [id, value]);

  return (
    <span className={cn("num rounded-sm px-1", dir === "up" && "flash-up", dir === "down" && "flash-down", className)}>
      {format(value)}
    </span>
  );
}
