import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { loadDeskSettings, saveDeskSettings } from "@/lib/crypto/desk-client";
import {
  CASH_EVENT,
  HELD_EVENT,
  closeHeld,
  loadHeld,
  readCashConfirmed,
  readIranVenue,
  recordHeld,
  writeCashConfirmed,
  writeIranVenue,
  type HeldSpot,
} from "@/lib/crypto/held-spot";
import { buildMachineTicket, focusFromResult } from "@/lib/crypto/machine";
import { loadUsdtRate } from "@/lib/crypto/ops";
import { buildSpotOrder, IRAN_VENUES, TARGET_FRACTION, type IranVenue, type SpotOrder } from "@/lib/crypto/spot-order";
import { armWatchAlerts, syncWatchStore } from "@/lib/crypto/spot-watch-client";
import type { AnalysisResult } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";
import { formatUsd } from "./format";

const CORE_KEY = "alpha-spot-holds-core";
const RISK_KEY = "alpha-spot-risk-pct";
const RISKS = [0.5, 1, 1.5, 2] as const;

export function OrderCard({
  result,
  live,
}: {
  result: AnalysisResult;
  live: Record<string, number>;
}) {
  const { tr } = useI18n();
  const rateFn = useServerFn(loadUsdtRate);
  const [capitalText, setCapitalText] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [riskPct, setRiskPct] = useState(1);
  const [holdsCore, setHoldsCore] = useState(false);
  const [venue, setVenue] = useState<IranVenue>("nobitex");
  const [toman, setToman] = useState<number | null>(null);
  const [held, setHeld] = useState<HeldSpot[]>([]);
  const [armed, setArmed] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const settings = loadDeskSettings();
    const cashOn = readCashConfirmed();
    setConfirmed(cashOn);
    setCapitalText(cashOn && settings.capitalUsd > 0 ? String(settings.capitalUsd) : "");
    setRiskPct(readRisk());
    setHoldsCore(readFlag(CORE_KEY));
    setVenue(readIranVenue());
    setHeld(loadHeld());
    setReady(true);
    let stop = false;
    void rateFn()
      .then((rate) => {
        if (!stop) setToman(rate.toman);
      })
      .catch(() => {
        if (!stop) setToman(null);
      });
    const onHeld = () => setHeld(loadHeld());
    const onCash = () => {
      const settings = loadDeskSettings();
      const cashOn = readCashConfirmed();
      setConfirmed(cashOn);
      setCapitalText(cashOn && settings.capitalUsd > 0 ? String(settings.capitalUsd) : "");
    };
    window.addEventListener(HELD_EVENT, onHeld);
    window.addEventListener(CASH_EVENT, onCash);
    return () => {
      stop = true;
      window.removeEventListener(HELD_EVENT, onHeld);
      window.removeEventListener(CASH_EVENT, onCash);
    };
  }, [rateFn]);

  const capital = confirmed ? Number(capitalText) || 0 : 0;

  const order = useMemo(() => {
    const focus = focusFromResult(result, live, holdsCore);
    const ticket = buildMachineTicket(focus, capital, riskPct);
    const book = result.books.find((row) => row.symbol === ticket.symbol);
    return buildSpotOrder({
      ticket,
      slippageBps: book?.slippageBps ?? null,
      bookGate: book?.gate ?? null,
      capitalConfirmed: confirmed && capital > 0,
      tomanPerUsdt: toman,
      venue,
    });
  }, [result, live, holdsCore, capital, riskPct, confirmed, toman, venue]);

  function commitCash(raw: string) {
    const next = Number(raw);
    if (!(next > 0)) {
      setConfirmed(false);
      writeCashConfirmed(false);
      saveDeskSettings({ ...loadDeskSettings(), capitalUsd: 0 });
      window.dispatchEvent(new Event(CASH_EVENT));
      return;
    }
    setCapitalText(String(next));
    setConfirmed(true);
    writeCashConfirmed(true);
    saveDeskSettings({ ...loadDeskSettings(), capitalUsd: next });
    window.dispatchEvent(new Event(CASH_EVENT));
  }

  function commitRisk(next: number) {
    setRiskPct(next);
    try {
      localStorage.setItem(RISK_KEY, String(next));
    } catch {
      /* private mode */
    }
  }

  function commitCore(next: boolean) {
    setHoldsCore(next);
    try {
      localStorage.setItem(CORE_KEY, next ? "1" : "0");
    } catch {
      /* private mode */
    }
  }

  function commitVenue(next: IranVenue) {
    setVenue(next);
    writeIranVenue(next);
  }

  async function onRecord(sheet: SpotOrder) {
    if (!sheet.limitPrice || !(sheet.qty > 0) || !sheet.invalidation || !sheet.target) return;
    const row = recordHeld({
      symbol: sheet.symbol,
      name: sheet.name,
      entryUsd: sheet.limitPrice,
      qty: sheet.qty,
      invalidationUsd: sheet.invalidation,
      targetUsd: sheet.target,
      targetFraction: TARGET_FRACTION,
      venue,
      tomanPerUsdt: toman,
    });
    const perm = await armWatchAlerts();
    await syncWatchStore(loadHeld());
    setHeld(loadHeld());
    setArmed(
      perm === "granted"
        ? tr(
            `${row.symbol} ثبت شد. هشدار روشن است؛ اگر کروم بسته نباشد، حتی بدون این صفحه هم چک می‌شود. تلگرام را در اجرای سفارش وصل کن تا با سایت بسته هم برسد.`,
            `${row.symbol} is on the book. Alerts are on. Chrome can check while this tab is closed if the browser stays open. Connect Telegram under Execute so it still arrives when the site is shut.`,
          )
        : tr(
            `${row.symbol} ثبت شد. اجازه اعلان داده نشد. تلگرام را در اجرای سفارش وصل کن، وگرنه هشدار فقط وقتی همین صفحه باز است می‌رسد.`,
            `${row.symbol} is on the book. Notification permission was denied. Connect Telegram under Execute, or the alert only fires while this page is open.`,
          ),
    );
  }

  const tone =
    order.stance === "buy" ? "text-up bg-up-dim" : order.stance === "wait" ? "text-warn bg-warn-dim" : "text-down bg-down-dim";
  const leg = order.path?.one && !order.path.one.belowMin ? order.path.one : order.path?.two;
  const open = held.filter((row) => !row.closed);
  const priceOf = (symbol: string, fallback: number) => live[symbol] && live[symbol] > 0 ? live[symbol]! : fallback;

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-xl">
          <p className="text-xs text-subtle">{tr("تنها سفارش", "The only order")}</p>
          <h2 className="mt-1 text-3xl font-medium tracking-tight text-fg">{tr(order.headlineFa, order.headlineEn)}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">{ready ? tr(order.whyFa, order.whyEn) : null}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-sm ${tone}`}>{tr(order.headlineFa, order.headlineEn)}</span>
      </div>

      <div className="mt-5 flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-xs text-subtle">
          {tr("نقد واقعی (دلار)", "Real cash (USD)")}
          <input
            inputMode="decimal"
            value={capitalText}
            placeholder={tr("مثلاً ۸۰۰", "e.g. 800")}
            onChange={(event) => setCapitalText(event.target.value)}
            onBlur={() => commitCash(capitalText)}
            className="num h-11 w-36 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-subtle">
          {tr("ریسک", "Risk")}
          <select
            value={riskPct}
            onChange={(event) => commitRisk(Number(event.target.value))}
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          >
            {RISKS.map((value) => (
              <option key={value} value={value}>
                {value}%
              </option>
            ))}
          </select>
        </label>
        <div className="flex h-11 items-center gap-1 rounded-md bg-elevated p-1 shadow-[var(--shadow-border)]">
          {(["nobitex", "wallex"] as const).map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => commitVenue(id)}
              className={`rounded px-3 py-1.5 text-xs ${venue === id ? "bg-surface text-fg" : "text-muted"}`}
            >
              {tr(IRAN_VENUES[id].labelFa, IRAN_VENUES[id].labelEn)}
            </button>
          ))}
        </div>
        <label className="flex h-11 items-center gap-2 text-xs text-muted">
          <input type="checkbox" checked={holdsCore} onChange={(event) => commitCore(event.target.checked)} />
          {tr("بیت‌کوین را دارم", "I already hold Bitcoin")}
        </label>
      </div>

      {order.limitPrice && order.qty > 0 ? (
        <dl className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat k={tr("لیمیت", "Limit")} v={`$${formatUsd(order.limitPrice)}`} />
          <Stat k={tr("تعداد سکه", "Coin qty")} v={formatQty(order.qty)} />
          <Stat k={tr("ابطال", "Invalidation")} v={order.invalidation ? `$${formatUsd(order.invalidation)}` : "—"} />
          <Stat k={tr("هدف", "Target")} v={order.target ? `$${formatUsd(order.target)}` : "—"} />
        </dl>
      ) : null}

      {order.fill ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {tr(order.fill.noteFa, order.fill.noteEn)}{" "}
          <span className="num text-fg">
            {tr("تیکر", "Ticker")} ${formatUsd(order.fill.ticker)}
            {" · "}
            {tr("مارکت حدود", "Market about")} ${formatUsd(order.fill.marketFill)}
          </span>
        </p>
      ) : null}

      {order.path && leg ? (
        <div className="mt-4 rounded-lg bg-elevated px-4 py-3 text-sm leading-relaxed text-muted">
          <p>{tr(order.path.noteFa, order.path.noteEn)}</p>
          <p className="num mt-2 text-fg">
            {formatToman(leg.tomanIn)} {tr("تومان", "toman")}
            {" → "}
            {leg.usdtAfter.toFixed(2)} {tr("تتر", "USDT")}
            {" → "}
            {formatQty(leg.coinQty)} {order.symbol}
          </p>
          <p className="mt-1 text-xs">
            {tr("کارمزد همین مسیر", "Fee on this path")} {formatToman(leg.feeToman)} {tr("تومان", "toman")}
            {order.fullNotionalUsd > order.notionalUsd
              ? ` · ${tr("اگر هر سه پله پر شود", "If all three rungs fill")} $${formatUsd(order.fullNotionalUsd)}`
              : ""}
          </p>
          {toman ? (
            <p className="mt-1 text-xs">
              {tr("تتر", "Tether")} {formatToman(toman)} {tr("تومان", "toman")}
            </p>
          ) : (
            <p className="mt-1 text-xs">{tr("نرخ تومان الان نیامد؛ مسیر تومانی خالی ماند.", "The toman rate did not arrive, so the toman path is blank.")}</p>
          )}
        </div>
      ) : null}

      {order.exit ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {tr(order.exit.noteFa, order.exit.noteEn)}{" "}
          <span className="num text-fg">
            {formatQty(order.exit.takeQty)} @ ${formatUsd(order.exit.takePrice)}
            {" · "}
            {formatQty(order.exit.restQty)} @ ${formatUsd(order.exit.stopPrice)}
          </span>
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="button"
          disabled={!confirmed || !(capital > 0) || order.stance === "dont" || !(order.qty > 0)}
          onClick={() => void onRecord(order)}
        >
          {tr("پر شد، نگهش دار", "It filled — keep it")}
        </Button>
        <p className="text-xs text-subtle">
          {tr(
            "سفارشی به صرافی فرستاده نمی‌شود. ثبت، همین کارت را تا هدف و ابطال زنده نگه می‌دارد.",
            "No order is sent to an exchange. Recording keeps this card alive until the target and the invalidation.",
          )}
        </p>
      </div>
      {armed ? <p className="mt-3 text-sm text-fg">{armed}</p> : null}

      {open.length > 0 ? (
        <ul className="mt-6 flex flex-col gap-3">
          {open.map((row) => {
            const px = priceOf(row.symbol, row.entryUsd);
            const pnl = row.entryUsd > 0 ? px / row.entryUsd - 1 : 0;
            return (
              <li key={row.symbol} className="rounded-lg bg-elevated px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-fg">
                      {row.name} <span className="num text-subtle">{row.symbol}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {row.targetSold
                        ? tr("یک‌سوم فروخته شد. بقیه تا ابطال.", "One third is sold. The rest waits for invalidation.")
                        : tr("یک‌سوم در هدف، بقیه در ابطال.", "One third at the target, the rest at invalidation.")}
                    </p>
                  </div>
                  <p className={`num text-sm ${pnl >= 0 ? "text-up" : "text-down"}`}>
                    {pnl >= 0 ? "+" : ""}
                    {(pnl * 100).toFixed(1)}%
                  </p>
                </div>
                <p className="num mt-2 text-xs text-subtle">
                  {formatQty(row.qty)} · ${formatUsd(row.entryUsd)} · {tr("ابطال", "stop")} ${formatUsd(row.invalidationUsd)} · {tr("هدف", "target")} ${formatUsd(row.targetUsd)}
                </p>
                <button
                  type="button"
                  className="mt-2 text-xs text-muted"
                  onClick={() => closeHeld(row.symbol, "manual")}
                >
                  {tr("از میز بردار", "Take it off the desk")}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-lg bg-elevated px-3 py-2">
      <p className="text-xs text-subtle">{k}</p>
      <p className="num mt-1 text-sm text-fg">{v}</p>
    </div>
  );
}

function formatQty(n: number): string {
  if (!(n > 0)) return "0";
  if (n >= 1) return n.toLocaleString("en-US", { maximumFractionDigits: 4 });
  return n.toPrecision(4);
}

function formatToman(n: number): string {
  if (!(n > 0)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

function readRisk(): number {
  try {
    const raw = Number(localStorage.getItem(RISK_KEY));
    return RISKS.includes(raw as (typeof RISKS)[number]) ? raw : 1;
  } catch {
    return 1;
  }
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
