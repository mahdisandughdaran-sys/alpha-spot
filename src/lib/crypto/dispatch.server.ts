export type DeskOrder = {
  symbol: string;
  side: "BUY" | "SELL";
  notionalUsd: number;
  weight: number;
};

export type DispatchInput = {
  title: string;
  text: string;
  kind: "orders" | "alert" | "test";
  orders: DeskOrder[];
  webhookUrl?: string;
  telegramToken?: string;
  telegramChat?: string;
};

export type DispatchResult = {
  webhook: "sent" | "skipped" | "failed";
  telegram: "sent" | "skipped" | "failed";
  detail: string;
};

const TOKEN = /^\d{6,12}:[A-Za-z0-9_-]{20,}$/;

function httpsUrl(raw: string | undefined): URL | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  let url: URL;
  try {
    url = new URL(trimmed);
  } catch {
    return null;
  }
  if (url.protocol !== "https:") return null;
  if (url.username || url.password) return null;
  const host = url.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".local") ||
    host.endsWith(".internal") ||
    host === "0.0.0.0"
  ) {
    return null;
  }
  if (host === "127.0.0.1" || host === "::1") return null;
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(host)) return null;
  return url;
}

function clip(text: string, max: number): string {
  const clean = text.replace(/\u0000/g, "").trim();
  return clean.length > max ? `${clean.slice(0, max - 1)}…` : clean;
}

export async function sendDeskSignal(input: DispatchInput): Promise<DispatchResult> {
  const title = clip(input.title, 120);
  const text = clip(input.text, 1400);
  const orders = (input.orders ?? []).slice(0, 12).map((o) => ({
    symbol: clip(o.symbol, 16).toUpperCase(),
    side: o.side === "SELL" ? "SELL" : "BUY",
    notionalUsd: Math.max(0, Math.min(1_000_000_000, Number(o.notionalUsd) || 0)),
    weight: Math.max(0, Math.min(1, Number(o.weight) || 0)),
  }));
  const payload = {
    source: "alpha-spot",
    kind: input.kind,
    title,
    text,
    orders,
    sentAt: new Date().toISOString(),
  };

  let webhook: DispatchResult["webhook"] = "skipped";
  let telegram: DispatchResult["telegram"] = "skipped";
  const notes: string[] = [];

  const hook = httpsUrl(input.webhookUrl);
  if (input.webhookUrl && input.webhookUrl.trim() && !hook) {
    webhook = "failed";
    notes.push("آدرس وب‌هوک باید https عمومی باشد.");
  } else if (hook) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(hook, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      clearTimeout(timer);
      webhook = res.ok ? "sent" : "failed";
      if (!res.ok) notes.push(`وب‌هوک پاسخ ${res.status} داد.`);
    } catch {
      webhook = "failed";
      notes.push("وب‌هوک در دسترس نبود.");
    }
  }

  const token = input.telegramToken?.trim() ?? "";
  const chat = input.telegramChat?.trim() ?? "";
  if ((token || chat) && (!TOKEN.test(token) || !chat || chat.length > 64)) {
    telegram = "failed";
    notes.push("توکن ربات یا شناسه چت تلگرام معتبر نیست. توکن ذخیره نمی‌شود.");
  } else if (token && chat) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 8000);
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        signal: ctrl.signal,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chat,
          text: `${title}\n${text}`.slice(0, 3900),
          disable_web_page_preview: true,
        }),
      });
      clearTimeout(timer);
      telegram = res.ok ? "sent" : "failed";
      if (!res.ok) notes.push("تلگرام پیام را نپذیرفت.");
    } catch {
      telegram = "failed";
      notes.push("تلگرام در دسترس نبود.");
    }
  }

  if (notes.length === 0) {
    if (webhook === "sent" || telegram === "sent") notes.push("سیگنال فرستاده شد.");
    else notes.push("مقصدی وصل نبود؛ فقط روی همین دستگاه ثبت شد.");
  }

  return { webhook, telegram, detail: notes.join(" ") };
}
