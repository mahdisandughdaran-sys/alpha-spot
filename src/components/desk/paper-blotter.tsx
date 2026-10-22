import { useState } from "react";
import { closeFill, openPnl, rMultiple, realizedPnl, saveBlotter, summarizeBook, type PaperFill } from "@/lib/crypto/blotter";
import { useI18n } from "@/lib/i18n/locale";
import { formatUsd } from "./format";

export function PaperBlotter({
  rows,
  live,
  onChange,
}: {
  rows: PaperFill[];
  live: Record<string, number>;
  onChange: (rows: PaperFill[]) => void;
}) {
  const { tr } = useI18n();
  const summary = summarizeBook(rows, (symbol) => live[symbol] ?? null);
  const open = rows.filter((row) => row.status === "open");
  const closed = rows.filter((row) => row.status === "closed").slice(0, 6);

  return (
    <section id="paper-book" className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-subtle">{tr("دفتر کاغذی", "Paper blotter")}</p>
          <h2 className="mt-1 text-lg text-fg">{tr("پر شدن بلیت، همین‌جا زنده می‌ماند.", "A filled ticket stays alive here.")}</h2>
        </div>
        <dl className="flex gap-4 text-sm">
          <div>
            <dt className="text-xs text-subtle">{tr("باز", "Open")}</dt>
            <dd className="num text-fg">{summary.open}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">{tr("شناور", "Open PnL")}</dt>
            <dd className={pnlClass(summary.unrealized)}>{money(summary.unrealized)}</dd>
          </div>
          <div>
            <dt className="text-xs text-subtle">{tr("بسته‌شده", "Realized")}</dt>
            <dd className={pnlClass(summary.realized)}>{money(summary.realized)}</dd>
          </div>
        </dl>
      </div>
      {summary.missing > 0 ? (
        <p className="mt-2 text-xs text-warn">{tr("قیمت بعضی از بلیت‌های باز هنوز نیامده.", "A live price is still missing for some open tickets.")}</p>
      ) : null}
      {rows.length === 0 ? (
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {tr(
            "روی بلیت، پله‌هایی که در صرافی گذاشتی را علامت بزن و در دفتر ثبت کن. از اینجا به بعد سود، ضرر و فاصله تا ابطال با قیمت لحظه حساب می‌شود. سفارشی فرستاده نمی‌شود.",
            "On the ticket, mark the rungs you actually placed and book them. From then on, profit, loss, and distance to invalidation follow the live price. Nothing is sent to an exchange.",
          )}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {open.map((row) => (
            <OpenRow
              key={row.id}
              row={row}
              price={live[row.symbol] ?? null}
              onClose={(price) => onChange(saveBlotter(closeFill(rows, row.id, price, new Date().toISOString())))}
            />
          ))}
          {closed.map((row) => {
            const pnl = realizedPnl(row);
            return (
              <li key={row.id} className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg bg-elevated px-3 py-3 text-sm">
                <span className="text-muted">
                  <span className="num text-fg">{row.symbol}</span>
                  {" · "}
                  {tr("بسته", "Closed")}
                  {row.closePrice ? <span className="num"> ${formatUsd(row.closePrice)}</span> : null}
                </span>
                <span className={pnlClass(pnl ?? 0)}>{pnl == null ? "—" : money(pnl)}</span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function OpenRow({
  row,
  price,
  onClose,
}: {
  row: PaperFill;
  price: number | null;
  onClose: (price: number) => void;
}) {
  const { tr } = useI18n();
  const [draft, setDraft] = useState(price && price > 0 ? String(price) : "");
  const pnl = openPnl(row, price);
  const r = rMultiple(pnl, row.riskUsd);
  const breached = price != null && price > 0 && price <= row.invalidation;
  const closeAt = Number(draft);

  return (
    <li className="rounded-lg bg-elevated px-3 py-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm text-fg">
            <span className="num">{row.symbol}</span>
            {row.name ? ` · ${row.name}` : ""}
          </p>
          <p className="mt-1 text-xs text-subtle">
            {tr("میانگین", "Average")} <span className="num text-fg">${formatUsd(row.avgEntry)}</span>
            {" · "}
            <span className="num">{row.qty.toFixed(row.qty >= 1 ? 4 : 6)}</span>
            {" · "}
            {tr("ابطال", "Invalidation")} <span className="num">${formatUsd(row.invalidation)}</span>
          </p>
        </div>
        <div className="text-end">
          <p className={pnlClass(pnl ?? 0)}>{pnl == null ? "—" : money(pnl)}</p>
          <p className="num text-xs text-subtle">{r == null ? "—" : `${r.toFixed(2)} R`}</p>
        </div>
      </div>
      {breached ? (
        <p className="mt-2 text-xs text-down">{tr("قیمت به ابطال رسیده. بلیت می‌گوید همین پله را ببند.", "Price tagged invalidation. The ticket says close this fill.")}</p>
      ) : null}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          inputMode="decimal"
          aria-label={tr("قیمت بستن", "Close price")}
          className="num h-11 w-36 rounded-md bg-surface px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button
          type="button"
          disabled={!(closeAt > 0)}
          onClick={() => onClose(closeAt)}
          className="h-11 rounded-md bg-surface px-4 text-sm text-fg shadow-[var(--shadow-border)] disabled:opacity-40"
        >
          {tr("بستن در دفتر", "Close in the blotter")}
        </button>
        {price && price > 0 ? (
          <button type="button" onClick={() => onClose(price)} className="h-11 rounded-md px-3 text-sm text-muted">
            {tr("روی لحظه", "At the live price")}
          </button>
        ) : null}
      </div>
    </li>
  );
}

function money(n: number): string {
  const sign = n > 0 ? "+" : n < 0 ? "−" : "";
  return `${sign}$${formatUsd(Math.abs(n))}`;
}

function pnlClass(n: number): string {
  if (n > 0) return "num text-sm text-up";
  if (n < 0) return "num text-sm text-down";
  return "num text-sm text-fg";
}
