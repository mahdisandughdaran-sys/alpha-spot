import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";
import { runVenue } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";
import { loadVault, saveVault, type VenueVault } from "@/lib/crypto/vault";
import { VENUE_LABEL, VENUES, type VenueAction, type VenueId, type VenueResult } from "@/lib/crypto/venues";

const inputClass =
  "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none";

const VENUE_EN: Record<VenueId, string> = {
  nobitex: "Nobitex",
  wallex: "Wallex",
  ompfinex: "OMPFinex",
  binance: "Binance",
  bybit: "Bybit",
};

export function VenuePanel({ result }: { result: AnalysisResult }) {
  const { tr } = useI18n();
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
        detail: err instanceof Error ? err.message : msg("درخواست انجام نشد.", "The request did not go through."),
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
          {tr("ثبت مستقیم روی صرافی", "Place directly on the exchange")}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          {tr(
            "کلید فقط در همین مرورگر می‌ماند و با هر درخواست فرستاده می‌شود؛ در دیتابیس نوشته نمی‌شود و در پاسخ برنمی‌گردد. پیش‌نمایش هیچ سفارشی نمی‌فرستد. ثبت واقعی پول جابه‌جا می‌کند و سقف هر سفارش ۵۰هزار دلار است.",
            "The key stays in this browser and is sent with each request; it is not written to the database and is not returned in the response. Preview sends no order. A live order moves money, and each order is capped at $50,000.",
          )}
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
            {tr(VENUE_LABEL[id], VENUE_EN[id])}
          </button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {vault.venue === "nobitex" ? tr("توکن یا کلید عمومی", "Token or public key") : tr("کلید API", "API key")}
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
            {vault.venue === "nobitex"
              ? tr("کلید خصوصی Ed25519 (اگر توکن قدیمی دارید خالی بگذارید)", "Ed25519 private key (leave empty if you still have a legacy token)")
              : tr("کلید مخفی", "Secret key")}
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
            {tr("حجم به دلار", "Size in dollars")}
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
            {tr("حجم به دلار", "Size in dollars")}
            <input
              inputMode="decimal"
              className={inputClass}
              value={vault.notionalUsd}
              onChange={(e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })}
            />
          </label>
        ) : null}
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("نماد", "Symbol")}
          <input
            className={inputClass}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("بازار تسویه", "Settlement market")}
          <select
            className={inputClass}
            value={vault.quote}
            onChange={(e) => patch({ quote: e.target.value === "IRT" ? "IRT" : "USDT" })}
          >
            <option value="USDT">{tr("تتر", "Tether")}</option>
            <option value="IRT">{tr("تومان / ریال", "Toman / rial")}</option>
          </select>
        </label>
        {vault.quote === "IRT" ? (
          <label className="flex flex-col gap-2 text-xs text-subtle">
            {tr("نرخ هر تتر به تومان", "Toman rate per tether")}
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
        {row ? (
          <>
            {tr(row.name)}
            {" · "}
            <span className="num">{row.priceUsd.toLocaleString("en-US")}</span> {tr("دلار", "USD")}
            {" · "}
            {tr("امتیاز", "Score")} <span className="num">{row.score.toFixed(1)}</span>
          </>
        ) : (
          tr(
            "این نماد در جدول همین تحلیل نیست؛ قیمت دلار برای تبدیل حجم لازم است.",
            "This symbol is not in the current analysis table; a dollar price is required to convert size.",
          )
        )}
        {buysSuspended
          ? tr(" کلید قطع بیت‌کوین خرید زنده را بسته است.", " The Bitcoin kill-switch has closed live buys.")
          : ""}
      </p>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled={busy !== null} onClick={() => go("probe")}>
          {busy === "probe" ? tr("در حال اتصال", "Connecting") : tr("آزمایش موجودی", "Test balances")}
        </Button>
        <Button type="button" variant="outline" disabled={busy !== null || !row} onClick={() => go("preview")}>
          {busy === "preview" ? tr("در حال ساخت", "Building") : tr("پیش‌نمایش سفارش", "Preview order")}
        </Button>
        <button
          type="button"
          onClick={() => setSide(side === "BUY" ? "SELL" : "BUY")}
          className="h-11 rounded-md bg-elevated px-3 text-sm text-fg"
        >
          {side === "BUY" ? tr("خرید", "Buy") : tr("فروش", "Sell")}
        </button>
      </div>

      <label className="flex flex-col gap-2 text-xs text-subtle">
        {tr("برای ثبت واقعی، نماد را دوباره بنویسید", "To place a live order, type the symbol again")}
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
        {busy === "place" ? tr("در حال ثبت", "Placing") : tr("ثبت سفارش واقعی", "Place live order")}
      </Button>

      {res ? (
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className={res.ok ? "text-sm text-up" : "text-sm text-down"}>{tr(res.detail)}</p>
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
