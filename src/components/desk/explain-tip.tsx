import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

export function ExplainTip({
  title,
  body,
  children,
  className,
}: {
  title: string;
  body: string;
  children?: ReactNode;
  className?: string;
}) {
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);
  const [box, setBox] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pinned = useRef(false);
  const tipId = useId();

  function place() {
    const node = buttonRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const width = 288;
    let left = rect.left;
    if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
    if (left < 12) left = 12;
    const top = Math.min(rect.bottom + 8, window.innerHeight - 12);
    setBox({ top, left });
  }

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    function onScroll() {
      setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, [open]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className={cn(
          "inline-flex items-center gap-1 rounded-md text-start text-inherit hover:text-fg",
          className,
        )}
        aria-expanded={open}
        aria-describedby={open ? tipId : undefined}
        onClick={() => {
          place();
          setOpen((value) => {
            pinned.current = !value;
            return !value;
          });
        }}
        onMouseEnter={() => {
          place();
          setOpen(true);
        }}
        onMouseLeave={() => {
          if (!pinned.current) setOpen(false);
        }}
        onFocus={() => {
          place();
          setOpen(true);
        }}
        onBlur={() => setOpen(false)}
      >
        {children}
        <Info className="size-3.5 shrink-0 text-subtle" aria-hidden />
      </button>
      {open && box
        ? createPortal(
            <span
              id={tipId}
              role="tooltip"
              style={{ top: box.top, left: box.left }}
              className="glass-pop fixed z-50 w-72 rounded-lg p-3 text-start"
            >
              <span className="block text-xs font-medium text-fg">{tr(title)}</span>
              <span className="mt-1 block text-xs leading-relaxed text-muted">{tr(body)}</span>
            </span>,
            document.body,
          )
        : null}
    </>
  );
}
