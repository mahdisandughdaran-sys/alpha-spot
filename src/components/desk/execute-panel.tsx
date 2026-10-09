import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { dispatchDeskSignal } from "@/lib/crypto/ops";
import {
  loadAlerts,
  loadDeskSettings,
  loadOrders,
  planOrders,
  pushAlert,
  saveDeskSettings,
  saveOrders,
  type DeskSettings,
  type PaperOrder,
} from "@/lib/crypto/desk-client";
import type { AnalysisResult } from "@/lib/crypto/types";
import { formatUsd } from "./format";

export function ExecutePanel({ result }: { result: AnalysisResult }) {
  const send = useServerFn(dispatchDeskSignal);
  const [settings, setSettings] = useState<DeskSettings>(() => loadDeskSettings());
  const [orders, setOrders] = useState<PaperOrder[]>(() => loadOrders());
  const [alerts, setAlerts] = useState(() => loadAlerts());
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const preview = useMemo(
    () => planOrders(result.portfolio, result.top, result.books, settings.capitalUsd),
    [result, settings.capitalUsd],
  );

  function patch(partial: Partial<DeskSettings>) {
    const next = { ...settings, ...partial };
    setSettings(next);
    saveDeskSettings(next);
  }

  async function onSend(kind: "orders" | "test") {
    setBusy(true);
    setNote(null);
    const rows = kind === "test" ? [] : preview;
    const title =
      kind === "test"
        ? "آلفا اسپات · آزمایش اتصال"
        : `آلفا اسپات · سبد ${result.pick.symbol}`;
    const text =
      kind === "test"
        ? "اگر این پیام را می‌بینید، وب‌هوک یا تلگرام وصل است. سفارشی روی صرافی ثبت نشده."
        : rows
            .map(
              (row) =>
                `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")} (${(row.weight * 100).toFixed(1)}٪)`,
            )
            .join("\n");
    try {
      const res = await send({
        data: {
          title,
          text: text || title,
          kind,
          orders: rows.map((row) => ({
            symbol: row.symbol,
            side: row.side,
            notionalUsd: row.notionalUsd,
            weight: row.weight,
          })),
          webhookUrl: settings.webhookUrl,
          telegramToken: settings.telegramToken,
          telegramChat: settings.telegramChat,
        },
      });
      const status: PaperOrder["status"] =
        res.webhook === "sent" || res.telegram === "sent"
          ? "sent"
          : res.webhook === "failed" || res.telegram === "failed"
            ? "failed"
            : "paper";
      if (kind === "orders") {
        const stamped = rows.map((row) => ({ ...row, status }));
        setOrders(saveOrders([...stamped, ...orders]));
      }
      setAlerts(
        pushAlert({
          id: `${kind}:${new Date().toISOString()}`,
          at: new Date().toISOString(),
          title,
          text: res.detail,
        }),
      );
      setNote(res.detail);
    } catch (err) {
      setNote(err instanceof Error ? err.message : "ارسال انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">اجرای سیگنال</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          این دکمه سفارش را مستقیم داخل صرافی ثبت نمی‌کند و کلید API را نگه نمی‌دارد.
          سبد را کاغذی روی همین دستگاه می‌نویسد و، اگر وب‌هوک یا ربات تلگرام را داده باشید،
          همان JSON را می‌فرستد تا ربات خودتان اجرا کند.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-subtle">
          سرمایه فرضی (دلار)
          <input
            inputMode="decimal"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.capitalUsd}
            onChange={(e) => patch({ capitalUsd: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          آستانه هشدار امتیاز
          <input
            inputMode="decimal"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.scoreFloor}
            onChange={(e) => patch({ scoreFloor: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle md:col-span-2">
          وب‌هوک https (تریدینگ‌ویو، ربات شخصی، صرافی)
          <input
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            placeholder="https://"
            value={settings.webhookUrl}
            onChange={(e) => patch({ webhookUrl: e.target.value })}
            dir="ltr"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          توکن ربات تلگرام
          <input
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.telegramToken}
            onChange={(e) => patch({ telegramToken: e.target.value.trim() })}
            dir="ltr"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          شناسه چت
          <input
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.telegramChat}
            onChange={(e) => patch({ telegramChat: e.target.value.trim() })}
            dir="ltr"
            autoComplete="off"
          />
        </label>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.alertKill}
            onChange={(e) => patch({ alertKill: e.target.checked })}
          />
          هشدار کلید قطع
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.alertScore}
            onChange={(e) => patch({ alertScore: e.target.checked })}
          />
          هشدار افت امتیاز
        </label>
      </div>

      <ul className="flex flex-col gap-2">
        {preview.map((row) => (
          <li
            key={row.symbol}
            className="flex items-center justify-between rounded-md bg-elevated px-3 py-2 text-sm"
          >
            <span className="text-fg">
              {row.side} <span className="num">{row.symbol}</span>
            </span>
            <span className="num text-muted">
              ${formatUsd(row.notionalUsd)}
              {row.slippageBps != null ? ` · ${row.slippageBps.toFixed(1)} bps` : ""}
            </span>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button className="h-11" disabled={busy || preview.length === 0} onClick={() => onSend("orders")}>
          <Send className="size-4" />
          ثبت کاغذی و ارسال سیگنال
        </Button>
        <Button variant="outline" className="h-11" disabled={busy} onClick={() => onSend("test")}>
          آزمایش اتصال
        </Button>
      </div>
      {note ? <p className="text-sm text-muted">{note}</p> : null}

      <Button
        variant="ghost"
        className="h-11 self-start px-0"
        onClick={() => {
          if (typeof Notification === "undefined") return;
          void Notification.requestPermission();
        }}
      >
        اجازه اعلان مرورگر
      </Button>

      {orders.length > 0 ? (
        <div>
          <p className="text-xs text-subtle">دفتر کاغذی</p>
          <ul className="mt-2 flex flex-col gap-1">
            {orders.slice(0, 8).map((row) => (
              <li key={row.id} className="flex justify-between text-xs text-muted">
                <span className="num">
                  {row.symbol} ${formatUsd(row.notionalUsd)}
                </span>
                <span>{row.status === "sent" ? "ارسال شد" : row.status === "failed" ? "مقصد خطا داد" : "فقط کاغذی"}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {alerts.length > 0 ? (
        <div>
          <p className="text-xs text-subtle">هشدارهای اخیر</p>
          <ul className="mt-2 flex flex-col gap-2">
            {alerts.slice(0, 5).map((alert) => (
              <li key={alert.id} className="text-xs leading-relaxed text-muted">
                <span className="text-fg">{alert.title}</span>
                <span className="mt-1 block">{alert.text}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
