import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";
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
  const { tr, locale } = useI18n();
  const pct = locale === "en" ? "%" : "٪";
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
        ? msg("آلفا اسپات · آزمایش اتصال", "Alpha Spot · connection test")
        : msg(`آلفا اسپات · سبد ${result.pick.symbol}`, `Alpha Spot · ${result.pick.symbol} basket`);
    const text =
      kind === "test"
        ? msg(
            "اگر این پیام را می‌بینید، وب‌هوک یا تلگرام وصل است. سفارشی روی صرافی ثبت نشده.",
            "If you can read this, the webhook or Telegram is connected. No order was placed on an exchange.",
          )
        : rows
            .map(
              (row) =>
                `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")} (${(row.weight * 100).toFixed(1)}${pct})`,
            )
            .join("\n");
    try {
      const res = await send({
        data: {
          title: tr(title),
          text: tr(text || title),
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
      setNote(err instanceof Error ? err.message : msg("ارسال انجام نشد.", "The send did not go through."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">{tr("اجرای سیگنال", "Execute the signal")}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          {tr(
            "این تب سفارش را داخل صرافی ثبت نمی‌کند. سبد را کاغذی روی همین دستگاه می‌نویسد و، اگر وب‌هوک یا ربات تلگرام را داده باشید، همان JSON را می‌فرستد. ثبت مستقیم در تب صرافی است.",
            "This tab does not place an order on the exchange. It writes the basket as paper on this device and, if you provided a webhook or a Telegram bot, sends that same JSON. Direct placement is on the exchange tab.",
          )}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("سرمایه فرضی (دلار)", "Paper capital (USD)")}
          <input
            inputMode="decimal"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.capitalUsd}
            onChange={(e) => patch({ capitalUsd: Math.max(0, Number(e.target.value) || 0) })}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("آستانه هشدار امتیاز", "Score alert threshold")}
          <input
            inputMode="decimal"
            className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.scoreFloor}
            onChange={(e) => patch({ scoreFloor: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })}
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle md:col-span-2">
          {tr("وب‌هوک https (تریدینگ‌ویو، ربات شخصی، صرافی)", "https webhook (TradingView, personal bot, exchange)")}
          <input
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            placeholder="https://"
            value={settings.webhookUrl}
            onChange={(e) => patch({ webhookUrl: e.target.value })}
            dir="ltr"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("توکن ربات تلگرام", "Telegram bot token")}
          <input
            className="h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
            value={settings.telegramToken}
            onChange={(e) => patch({ telegramToken: e.target.value.trim() })}
            dir="ltr"
            autoComplete="off"
          />
        </label>
        <label className="flex flex-col gap-2 text-xs text-subtle">
          {tr("شناسه چت", "Chat id")}
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
          {tr("هشدار کلید قطع", "Kill-switch alert")}
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={settings.alertScore}
            onChange={(e) => patch({ alertScore: e.target.checked })}
          />
          {tr("هشدار افت امتیاز", "Score-drop alert")}
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
          {tr("ثبت کاغذی و ارسال سیگنال", "Save paper and send the signal")}
        </Button>
        <Button variant="outline" className="h-11" disabled={busy} onClick={() => onSend("test")}>
          {tr("آزمایش اتصال", "Test connection")}
        </Button>
      </div>
      {note ? <p className="text-sm text-muted">{tr(note)}</p> : null}

      <Button
        variant="ghost"
        className="h-11 self-start px-0"
        onClick={() => {
          if (typeof Notification === "undefined") return;
          void Notification.requestPermission();
        }}
      >
        {tr("اجازه اعلان مرورگر", "Allow browser notifications")}
      </Button>

      {orders.length > 0 ? (
        <div>
          <p className="text-xs text-subtle">{tr("دفتر کاغذی", "Paper blotter")}</p>
          <ul className="mt-2 flex flex-col gap-1">
            {orders.slice(0, 8).map((row) => (
              <li key={row.id} className="flex justify-between text-xs text-muted">
                <span className="num">
                  {row.symbol} ${formatUsd(row.notionalUsd)}
                </span>
                <span>
                  {row.status === "sent"
                    ? tr("ارسال شد", "Sent")
                    : row.status === "failed"
                      ? tr("مقصد خطا داد", "Destination failed")
                      : tr("فقط کاغذی", "Paper only")}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {alerts.length > 0 ? (
        <div>
          <p className="text-xs text-subtle">{tr("هشدارهای اخیر", "Recent alerts")}</p>
          <ul className="mt-2 flex flex-col gap-2">
            {alerts.slice(0, 5).map((alert) => (
              <li key={alert.id} className="text-xs leading-relaxed text-muted">
                <span className="text-fg">{tr(alert.title)}</span>
                <span className="mt-1 block">{tr(alert.text)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
