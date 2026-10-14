import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";
import { loadDeskSettings, planOrders, saveOrders, loadOrders, type PaperOrder } from "@/lib/crypto/desk-client";
import { dispatchDeskSignal } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";
import { formatUsd } from "./format";

export function SignalButton({ result }: { result: AnalysisResult }) {
  const { tr } = useI18n();
  const send = useServerFn(dispatchDeskSignal);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const settings = loadDeskSettings();
  const preview = planOrders(result.portfolio, result.top, result.books, settings.capitalUsd);
  const total = preview.reduce((sum, row) => sum + row.notionalUsd, 0);

  async function onClick() {
    setBusy(true);
    setNote(null);
    const title = msg(`آلفا اسپات · سبد ${result.pick.symbol}`, `Alpha Spot · ${result.pick.symbol} basket`);
    const text = preview
      .map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")}`)
      .join("\n");
    try {
      const res = await send({
        data: {
          title: tr(title),
          text,
          kind: "orders",
          orders: preview.map((row) => ({
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
      saveOrders([...preview.map((row) => ({ ...row, status })), ...loadOrders()]);
      setNote(res.detail);
    } catch (err) {
      setNote(err instanceof Error ? err.message : msg("ارسال انجام نشد.", "The send did not go through."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="text-sm text-fg">{tr("ارسال همین سبد", "Send this basket")}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        {tr("با سرمایه فرضی", "With a paper capital of")}{" "}
        <span className="num">${formatUsd(settings.capitalUsd)}</span>{" "}
        {tr("حدود", "about")}{" "}
        <span className="num">${formatUsd(total)}</span>{" "}
        {tr(
          "سفارش کاغذی ساخته می‌شود. اگر در تب اجرا وب‌هوک یا تلگرام را گذاشته باشید، همان سیگنال هم می‌رود. کلید صرافی اینجا ذخیره نمی‌شود.",
          "of paper orders are built. If you added a webhook or Telegram on the Execute tab, that same signal is sent. Exchange keys are not stored here.",
        )}
      </p>
      <Button className="mt-4 h-11" disabled={busy || preview.length === 0} onClick={onClick}>
        <Send className="size-4" />
        {tr("ثبت و ارسال سیگنال", "Save and send the signal")}
      </Button>
      {note ? <p className="mt-3 text-xs text-muted">{tr(note)}</p> : null}
    </div>
  );
}
