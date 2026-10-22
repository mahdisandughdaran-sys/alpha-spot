import { useEffect, useMemo, useState } from "react";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import type { CoinRow } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";

export type DeckJump = "machine" | "map" | "table" | "opportunity" | "portfolio" | "backtest";

export function CommandDeck({
  rows,
  picked,
  onJump,
  onArm,
}: {
  rows: CoinRow[];
  picked: string;
  onJump: (tab: DeckJump) => void;
  onArm: (symbol: string) => void;
}) {
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      const target = event.target as HTMLElement | null;
      const typing = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((value) => !value);
        return;
      }
      if (!typing && event.key === "/" && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setOpen(true);
      }
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const coins = useMemo(() => rows.slice(0, 80), [rows]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-11 items-center gap-2 rounded-md bg-elevated px-3 text-sm text-muted shadow-[var(--shadow-border)]"
      >
        <Search className="size-4" />
        <span>{tr("جستجو", "Search")}</span>
        <span className="num text-xs text-subtle">/</span>
      </button>
      {open ? (
        <div className="fixed inset-0 z-40 flex items-start justify-center px-4 pt-[12vh]">
          <button type="button" aria-label={tr("بستن", "Close")} className="absolute inset-0 bg-bg/70" onClick={() => setOpen(false)} />
          <Command
            label={tr("جستجوی میز", "Desk search")}
            className="glass-pop relative z-10 flex w-full max-w-lg flex-col overflow-hidden rounded-xl"
          >
            <Command.Input
              autoFocus
              placeholder={tr("نام، نماد، یا بخش میز", "Name, ticker, or a desk section")}
              className="h-12 border-b border-border bg-transparent px-4 text-sm text-fg outline-none placeholder:text-subtle"
            />
            <Command.List className="max-h-80 overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-sm text-muted">{tr("چیزی پیدا نشد.", "Nothing matched.")}</Command.Empty>
              <Command.Group heading={tr("میز", "Desk")} className="text-xs text-subtle">
                <JumpItem label={tr("بلیت خرید", "Buy ticket")} onSelect={() => { onJump("machine"); setOpen(false); }} />
                <JumpItem label={tr("نقشه بازار", "Market map")} onSelect={() => { onJump("map"); setOpen(false); }} />
                <JumpItem label={tr("رتبه‌ها", "Ranks")} onSelect={() => { onJump("table"); setOpen(false); }} />
                <JumpItem label={tr("فرصت‌ها", "Setups")} onSelect={() => { onJump("opportunity"); setOpen(false); }} />
                <JumpItem label={tr("پرتفوی", "Portfolio")} onSelect={() => { onJump("portfolio"); setOpen(false); }} />
                <JumpItem label={tr("بک‌تست", "Backtest")} onSelect={() => { onJump("backtest"); setOpen(false); }} />
              </Command.Group>
              {coins.length > 0 ? (
                <Command.Group heading={tr("مسلح کردن بلیت", "Arm a ticket")} className="text-xs text-subtle">
                  {coins.map((row) => (
                    <Command.Item
                      key={row.symbol}
                      value={`${row.symbol} ${row.name}`}
                      onSelect={() => {
                        onArm(row.symbol);
                        setOpen(false);
                      }}
                      className="flex h-11 cursor-pointer items-center justify-between rounded-md px-3 text-sm text-fg aria-selected:bg-elevated"
                    >
                      <span>
                        <span className="num">{row.symbol}</span>
                        <span className="text-muted"> · {row.name}</span>
                      </span>
                      <span className="num text-xs text-subtle">
                        {row.symbol === picked ? tr("انتخاب", "Pick") : Math.round(row.score)}
                      </span>
                    </Command.Item>
                  ))}
                </Command.Group>
              ) : null}
            </Command.List>
          </Command>
        </div>
      ) : null}
    </>
  );
}

function JumpItem({ label, onSelect }: { label: string; onSelect: () => void }) {
  return (
    <Command.Item
      value={label}
      onSelect={onSelect}
      className="flex h-11 cursor-pointer items-center rounded-md px-3 text-sm text-fg aria-selected:bg-elevated"
    >
      {label}
    </Command.Item>
  );
}
