import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadDeskSettings, planOrders, saveOrders, loadOrders, type PaperOrder } from "@/lib/crypto/desk-client";
import { dispatchDeskSignal } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";
import { formatUsd } from "./format";

export function SignalButton({ result }: { result: AnalysisResult }) {
  const send = useServerFn(dispatchDeskSignal);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const settings = loadDeskSettings();
  const preview = planOrders(result.portfolio, result.top, result.books, settings.capitalUsd);
  const total = preview.reduce((sum, row) => sum + row.notionalUsd, 0);

  async function onClick() {
    setBusy(true);
    setNote(null);
    const title = `آلفا اسپات · سبد ${result.pick.symbol}`;
    const text = preview
      .map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")}`)
      .join("\n");
    try {
      const res = await send({
        data: {
          title,
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
      setNote(err instanceof Error ? err.message : "ارسال انجام نشد.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <p className="text-sm text-fg">ارسال همین سبد</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">
        با سرمایه فرضی <span className="num">${formatUsd(settings.capitalUsd)}</span> حدود{" "}
        <span className="num">${formatUsd(total)}</span> سفارش کاغذی ساخته می‌شود. اگر در تب اجرا
        وب‌هوک یا تلگرام را گذاشته باشید، همان سیگنال هم می‌رود. کلید صرافی اینجا ذخیره نمی‌شود.
      </p>
      <Button className="mt-4 h-11" disabled={busy || preview.length === 0} onClick={onClick}>
        <Send className="size-4" />
        ثبت و ارسال سیگنال
      </Button>
      {note ? <p className="mt-3 text-xs text-muted">{note}</p> : null}
    </div>
  );
}
