import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { runVenue } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";
import { loadVault, saveVault, type VenueVault } from "@/lib/crypto/vault";
import { VENUE_LABEL, VENUES, type VenueAction, type VenueResult } from "@/lib/crypto/venues";

const inputClass =
  "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none";

export function VenuePanel({ result }: { result: AnalysisResult }) {
  const call = useServerFn(runVenue);
  const [vault, setVault] = useState<VenueVault>(() => loadVault());
  const [symbol, setSymbol] = useState(result.pick.symbol);
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState<VenueAction | null>(null);
  const [res, setRes] = useState<VenueResult | null>(null);

  const row = useMemo(() => {
    const upper = symbol.trim().toUpperCase();
    return result.top.find((item) => item.symbol === upper) ?? null;
  }, [result.top, symbol]);

  const needsSecret = vault.venue === "binance" || vault.venue === "bybit" || vault.venue === "nobitex";
  const buysSuspended = result.spotBuys === "suspended" && side === "BUY";

  function patch(partial: Partial<VenueVault>) {
    const next = { ...vault, ...partial };
    setVault(next);
    saveVault(next);
  }

  async function go(action: VenueAction) {
    setBusy(action);
    setRes(null);
    try {
      const data = await call({
        data: {
          action,
          venue: vault.venue,
          key: vault.key,
          secret: vault.secret,
          symbol: symbol.trim().toUpperCase(),
          side,
          notionalUsd: vault.notionalUsd,
          priceUsd: row?.priceUsd ?? 0,
          quote: vault.quote,
          tomanPerUsdt: vault.tomanPerUsdt,
          confirm,
        },
      });
      setRes(data);
    } catch (err) {
      setRes({
        ok: false,
        action,
        detail: err instanceof Error ? err.message : "درخواست انجام نشد.",
        balances: [],
        orderId: null,
        planned: "",
      });
    } finally {
      setBusy(null);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="flex items-center gap-2 text-base font-medium text-fg">
          <KeyRound className="size-4" />
          ثبت مستقیم روی صرافی
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          کلید فقط در همین مرورگر می‌ماند و با هر درخواست فرستاده می‌شود؛ در دیتابیس نوشته
          نمی‌شود و در پاسخ برنمی‌گردد. پیش‌نمایش هیچ سفارشی نمی‌فرستد. ثبت واقعی پول جابه‌جا
          می‌کند و سقف هر سفارش ۵۰هزار دلار است.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {VENUES.map((id) => (
          <button
            key={id}
            type="button"
            onClick={() => patch({ venue: id })}
            className={
              vault.venue === id
                ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                : "h-11 rounded-md px-3 text-sm text-muted hover:text-fg"
            }
          >
            {VENUE_LABEL[id]}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {vault.venue === "nobitex" ? "توکن یا کلید عمومی" : "کلید API"}
          <input
            type="password"
            autoComplete="off"
            className={inputClass}
            value={vault.key}
            onChange={(e) => patch({ key: e.target.value })}
          />
        </label>
        {needsSecret ? (
          <label className="flex flex-col gap-2 text-xs text-subtle">
            {vault.venue === "nobitex" ? "کلید خصوصی Ed25519 (اگر توکن قدیمی دارید خالی بگذارید)" : "کلید مخفی"}
            <input
              type="password"
              autoComplete="off"
              className={inputClass}
              value={vault.secret}
              onChange={(e) => patch({ secret: e.target.value })}
            />
          </label>
        ) : (
          <label className="flex flex-col gap-2 text-xs text-subtle">
            حجم به دلار
            <input
              inputMode="decimal"
              className={inputClass}
              value={vault.notionalUsd}
              onChange={(e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })}
            />
          </label>
        )}
        {needsSecret ? (
          <label className="flex flex-col gap-2 text-xs text-subtle">
            حجم به دلار
            <input
              inputMode="decimal"
              className={inputClass}
              value={vault.notionalUsd}
              onChange={(e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })}
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-2 text-xs text-subtle">
          نماد
          <input
            className={inputClass}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          بازار تسویه
          <select
            className={inputClass}
            value={vault.quote}
            onChange={(e) => patch({ quote: e.target.value === "IRT" ? "IRT" : "USDT" })}
          >
            <option value="USDT">تتر</option>
            <option value="IRT">تومان / ریال</option>
          </select>
        </label>
        {vault.quote === "IRT" ? (
          <label className="flex flex-col gap-2 text-xs text-subtle">
            نرخ هر تتر به تومان
            <input
              inputMode="decimal"
              className={inputClass}
              value={vault.tomanPerUsdt || ""}
              onChange={(e) => patch({ tomanPerUsdt: Math.max(0, Number(e.target.value) || 0) })}
            />
          </label>
        ) : null}
      </div>

      <p className="text-xs text-subtle">
        {row
          ? `${row.name} · ${row.priceUsd.toLocaleString("en-US")} دلار · امتیاز ${row.score.toFixed(1)}`
          : "این نماد در جدول همین تحلیل نیست؛ قیمت دلار برای تبدیل حجم لازم است."}
        {buysSuspended ? " کلید قطع بیت‌کوین خرید زنده را بسته است." : ""}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={busy !== null} onClick={() => go("probe")}>
          {busy === "probe" ? "در حال اتصال" : "آزمایش موجودی"}
        </Button>
        <Button type="button" variant="outline" disabled={busy !== null || !row} onClick={() => go("preview")}>
          {busy === "preview" ? "در حال ساخت" : "پیش‌نمایش سفارش"}
        </Button>
        <button
          type="button"
          onClick={() => setSide(side === "BUY" ? "SELL" : "BUY")}
          className="h-11 rounded-md bg-elevated px-3 text-sm text-fg"
        >
          {side === "BUY" ? "خرید" : "فروش"}
        </button>
      </div>

      <label className="flex flex-col gap-2 text-xs text-subtle">
        برای ثبت واقعی، نماد را دوباره بنویسید
        <input
          className={inputClass}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value.toUpperCase())}
          placeholder={symbol.trim().toUpperCase()}
        />
      </label>
      <Button
        type="button"
        disabled={busy !== null || !row || buysSuspended || confirm.trim().toUpperCase() !== symbol.trim().toUpperCase()}
        onClick={() => go("place")}
      >
        {busy === "place" ? "در حال ثبت" : "ثبت سفارش واقعی"}
      </Button>

      {res ? (
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className={res.ok ? "text-sm text-up" : "text-sm text-down"}>{res.detail}</p>
          {res.balances.length ? (
            <ul className="mt-3 flex flex-col gap-1 text-sm text-fg">
              {res.balances.map((row) => (
                <li key={`${row.asset}-${row.amount}`} className="num flex justify-between">
                  <span>{row.asset}</span>
                  <span>{row.amount}</span>
                </li>
              ))}
            </ul>
          ) : null}
          {res.planned ? (
            <pre className="num mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-muted">
              {res.planned}
            </pre>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
