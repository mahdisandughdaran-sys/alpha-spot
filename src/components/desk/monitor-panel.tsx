import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { buildRebalancePlan } from "@/lib/crypto/rebalance";
import type { AnalysisResult, DeskAction, HoldingInput } from "@/lib/crypto/types";
import { formatPct, formatScore, formatUsd } from "./format";

const KEY = "alpha-spot-book-v1";

function loadBook(): HoldingInput[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HoldingInput[];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (row) =>
        row &&
        typeof row.symbol === "string" &&
        typeof row.entryUsd === "number" &&
        typeof row.sizeUsd === "number",
    );
  } catch {
    return [];
  }
}

function saveBook(rows: HoldingInput[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
  } catch {
    /* quota */
  }
}

const ACTION_FA: Record<DeskAction, string> = {
  HOLD: "نگهداری",
  SELL: "خروج",
  REBALANCE: "چرخش",
};

export function MonitorPanel({ result }: { result: AnalysisResult }) {
  const [book, setBook] = useState<HoldingInput[]>([]);
  const [symbol, setSymbol] = useState("ETH");
  const [entry, setEntry] = useState("");
  const [size, setSize] = useState("");

  useEffect(() => {
    setBook(loadBook());
  }, []);

  const options = useMemo(
    () => [...result.top].sort((a, b) => a.rank - b.rank),
    [result.top],
  );

  useEffect(() => {
    if (options.length > 0 && !options.some((row) => row.symbol === symbol)) {
      setSymbol(options[0]?.symbol ?? "BTC");
    }
  }, [options, symbol]);
  const plan = useMemo(
    () => buildRebalancePlan(book, result.top, result.killSwitch),
    [book, result],
  );

  function addPosition() {
    const entryUsd = Number(entry);
    const sizeUsd = Number(size);
    const sym = symbol.toUpperCase();
    if (!sym || !(entryUsd > 0) || !(sizeUsd > 0)) return;
    const next = [
      ...book.filter((row) => row.symbol.toUpperCase() !== sym),
      { symbol: sym, entryUsd, sizeUsd },
    ];
    setBook(next);
    saveBook(next);
    setEntry("");
    setSize("");
  }

  function remove(sym: string) {
    const next = book.filter((row) => row.symbol !== sym);
    setBook(next);
    saveBook(next);
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">پایش سبد و چرخش</h3>
        <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted">
          پوزیشن‌های اسپات خودتان را وارد کنید. اگر حمایت هفتگی ALT/BTC بشکند یا
          امتیاز زیر ۶۰ بیاید، سیگنال خروج و چرخش به برترین گزینه واجد شرایط
          صادر می‌شود. با کلید قطع، مقصد چرخش بیت‌کوین است.
        </p>
        <p className="mt-2 text-xs text-subtle">{plan.note}</p>
      </div>

      <form
        className="grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:grid-cols-4"
        onSubmit={(event) => {
          event.preventDefault();
          addPosition();
        }}
      >
        <label className="flex flex-col gap-1 text-xs text-subtle">
          نماد
          <select
            value={symbol}
            onChange={(event) => setSymbol(event.target.value)}
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          >
            {options.map((row) => (
              <option key={row.id} value={row.symbol}>
                {row.symbol} · {row.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs text-subtle">
          قیمت ورود (دلار)
          <input
            inputMode="decimal"
            value={entry}
            onChange={(event) => setEntry(event.target.value)}
            placeholder="100"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-subtle">
          اندازه (دلار)
          <input
            inputMode="decimal"
            value={size}
            onChange={(event) => setSize(event.target.value)}
            placeholder="1000"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          />
        </label>
        <div className="flex items-end">
          <Button type="submit" className="w-full">
            افزودن پوزیشن
          </Button>
        </div>
      </form>

      <div className="grid grid-cols-3 gap-2">
        <Mini k="نگهداری پیشنهادی" v={`$${formatUsd(plan.holdUsd)}`} />
        <Mini k="آماده چرخش" v={`$${formatUsd(plan.rotateUsd)}`} />
        <Mini k="خروج نقد" v={`$${formatUsd(plan.sellUsd)}`} />
      </div>

      {plan.destinations.length > 0 ? (
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <p className="text-sm text-fg">مقصد چرخش</p>
          <ul className="mt-3 flex flex-col gap-2">
            {plan.destinations.map((dest) => (
              <li key={dest.symbol} className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-fg">
                    {dest.name} <span className="num text-subtle">{dest.symbol}</span>
                  </p>
                  <p className="text-xs text-muted">{dest.reason}</p>
                </div>
                <div className="text-end">
                  <p className="num text-sm text-fg">${formatUsd(dest.usd)}</p>
                  <p className="num text-xs text-subtle">{formatScore(dest.score)}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {plan.rows.length === 0 ? (
        <p className="rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]">
          هنوز پوزیشنی ثبت نشده. یک نماد از صد ارز اول، قیمت ورود و اندازه دلاری
          را اضافه کنید تا Hold / Sell / Rebalance زنده شود.
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {plan.rows.map((row) => {
            const tone =
              row.action === "HOLD"
                ? "text-up bg-up-dim"
                : row.action === "SELL"
                  ? "text-down bg-down-dim"
                  : "text-warn bg-warn-dim";
            return (
              <li
                key={row.symbol}
                className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-fg">{row.name}</p>
                    <p className="num text-xs text-subtle">{row.symbol}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs ${tone}`}>
                    {ACTION_FA[row.action]}
                    {row.action === "REBALANCE" && row.targetSymbol
                      ? ` → ${row.targetSymbol}`
                      : ""}
                  </span>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4">
                  <Field k="امتیاز" v={row.score == null ? "—" : formatScore(row.score)} />
                  <Field
                    k="بازدهی"
                    v={row.pnlPct == null ? "—" : formatPct(row.pnlPct)}
                  />
                  <Field
                    k="ALT/BTC هفتگی"
                    v={
                      row.symbol === "BTC"
                        ? "معیار"
                        : row.pairSupportBroken
                          ? "شکست حمایت"
                          : row.pairWeekly === "bull"
                            ? "صعودی"
                            : row.pairWeekly === "bear"
                              ? "نزولی"
                              : "خنثی / نامشخص"
                    }
                  />
                  <Field k="حجم پیشنهادی" v={`$${formatUsd(row.suggestedSizeUsd)}`} />
                </dl>
                <p className="mt-3 text-xs leading-relaxed text-muted">{row.reason}</p>
                <button
                  type="button"
                  onClick={() => remove(row.symbol)}
                  className="mt-3 h-11 text-xs text-subtle hover:text-fg"
                >
                  حذف از سبد
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Mini({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{k}</p>
      <p className="num mt-1 text-sm text-fg">{v}</p>
    </div>
  );
}

function Field({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <dt className="text-subtle">{k}</dt>
      <dd className="num mt-1 text-fg">{v}</dd>
    </div>
  );
}
