import { candidateBases } from "./exclusions.ts";

export const VENUES = ["nobitex", "wallex", "ompfinex", "binance", "bybit"] as const;
export type VenueId = (typeof VENUES)[number];
export type QuoteCcy = "USDT" | "IRT";
export type VenueAction = "probe" | "preview" | "place";
export type VenueSide = "BUY" | "SELL";

export const VENUE_LABEL: Record<VenueId, string> = {
  nobitex: "نوبیتکس",
  wallex: "والکس",
  ompfinex: "اوام‌پی فینکس",
  binance: "بایننس",
  bybit: "بای‌بیت",
};

export type VenueCall = {
  action: VenueAction;
  venue: VenueId;
  key: string;
  secret: string;
  symbol: string;
  side: VenueSide;
  notionalUsd: number;
  priceUsd: number;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  confirm: string;
};

export type PlannedOrder = {
  venue: VenueId;
  summary: string;
  method: "POST";
  path: string;
  body: Record<string, unknown> | null;
  query: string | null;
  baseQty: number;
};

export type VenueBalance = { asset: string; amount: string };

export type VenueResult = {
  ok: boolean;
  action: VenueAction;
  detail: string;
  balances: VenueBalance[];
  orderId: string | null;
  planned: string;
};

const MAX_NOTIONAL = 50_000;

export function isVenue(value: string): value is VenueId {
  return (VENUES as readonly string[]).includes(value);
}

export function money(n: number, digits: number): string {
  if (!Number.isFinite(n) || n <= 0) return "0";
  const fixed = n.toFixed(digits);
  return fixed.replace(/\.0+$/, "").replace(/(\.\d*?)0+$/, "$1");
}

export function clientId(now = Date.now()): string {
  return `as${now.toString(36)}`.replace(/[^a-z0-9]/g, "").slice(0, 20);
}

export function venueBase(venue: VenueId, symbol: string): string {
  const upper = symbol.toUpperCase();
  if (venue === "binance" || venue === "bybit") return candidateBases(upper)[0] ?? upper;
  return upper;
}

export function guardPrice(side: VenueSide, price: number): number {
  return side === "BUY" ? price * 1.012 : price * 0.988;
}

export function quotePrice(input: {
  priceUsd: number;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  rial: boolean;
}): number {
  if (input.quote === "USDT") return input.priceUsd;
  const toman = input.priceUsd * input.tomanPerUsdt;
  return input.rial ? toman * 10 : toman;
}

export function assertSized(input: {
  symbol: string;
  notionalUsd: number;
  priceUsd: number;
  quote: QuoteCcy;
  tomanPerUsdt: number;
  venue: VenueId;
}): { symbol: string; qty: number; notional: number } {
  const symbol = input.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!/^[A-Z0-9]{2,15}$/.test(symbol)) throw new Error("نماد نامعتبر است.");
  if (!(input.priceUsd > 0)) throw new Error("قیمت دلار این نماد در تحلیل نیست.");
  const notional = Number(input.notionalUsd);
  if (!(notional >= 5) || notional > MAX_NOTIONAL) {
    throw new Error("حجم هر سفارش باید بین ۵ و ۵۰٬۰۰۰ دلار باشد.");
  }
  if (
    input.quote === "IRT" &&
    (input.venue === "binance" || input.venue === "bybit")
  ) {
    throw new Error("بایننس و بای‌بیت در این میز فقط بازار تتر را مستقیم ثبت می‌کنند.");
  }
  if (input.quote === "IRT" && !(input.tomanPerUsdt >= 1_000 && input.tomanPerUsdt <= 10_000_000)) {
    throw new Error("نرخ تتر به تومان را وارد کنید.");
  }
  const qty = Math.floor((notional / input.priceUsd) * 1e6) / 1e6;
  if (!(qty > 0)) throw new Error("حجم پایه صفر شد.");
  return { symbol, qty, notional };
}

export function planVenueOrder(
  input: VenueCall,
  now = Date.now(),
): PlannedOrder {
  const sized = assertSized(input);
  const base = venueBase(input.venue, sized.symbol);
  const id = clientId(now);
  const side = input.side === "SELL" ? "SELL" : "BUY";
  const qty = money(sized.qty, 6);

  if (input.venue === "nobitex") {
    const rial = input.quote === "IRT";
    const price = money(
      guardPrice(side, quotePrice({ priceUsd: input.priceUsd, quote: input.quote, tomanPerUsdt: input.tomanPerUsdt, rial })),
      rial ? 0 : 6,
    );
    const body = {
      type: side.toLowerCase(),
      execution: "market",
      srcCurrency: base.toLowerCase(),
      dstCurrency: rial ? "rls" : "usdt",
      amount: qty,
      price,
      clientOrderId: id,
    };
    return {
      venue: input.venue,
      summary: `نوبیتکس ${side === "BUY" ? "خرید" : "فروش"} مارکت ${qty} ${base} با سقف قیمت ${price} ${rial ? "ریال" : "تتر"}`,
      method: "POST",
      path: "/market/orders/add",
      body,
      query: null,
      baseQty: sized.qty,
    };
  }

  if (input.venue === "wallex") {
    const tmn = input.quote === "IRT";
    const price = money(
      guardPrice(side, quotePrice({ priceUsd: input.priceUsd, quote: input.quote, tomanPerUsdt: input.tomanPerUsdt, rial: false })),
      tmn ? 0 : 6,
    );
    const body = {
      symbol: `${base}${tmn ? "TMN" : "USDT"}`,
      side,
      type: "MARKET",
      quantity: qty,
      price,
      client_id: id,
    };
    return {
      venue: input.venue,
      summary: `والکس ${side} مارکت ${qty} ${body.symbol} با قیمت محافظ ${price}`,
      method: "POST",
      path: "/v1/account/orders",
      body,
      query: null,
      baseQty: sized.qty,
    };
  }

  if (input.venue === "ompfinex") {
    const irr = input.quote === "IRT";
    const body = {
      market: `${base}${irr ? "IRR" : "USDT"}`,
      side: side.toLowerCase(),
      type: "market",
      amount: qty,
    };
    return {
      venue: input.venue,
      summary: `اوام‌پی فینکس ${side === "BUY" ? "خرید" : "فروش"} مارکت ${qty} ${body.market}`,
      method: "POST",
      path: "/v1/order",
      body,
      query: null,
      baseQty: sized.qty,
    };
  }

  if (input.venue === "binance") {
    const params = new URLSearchParams({
      symbol: `${base}USDT`,
      side,
      type: "MARKET",
      newClientOrderId: id,
    });
    if (side === "BUY") params.set("quoteOrderQty", money(sized.notional, 2));
    else params.set("quantity", qty);
    return {
      venue: input.venue,
      summary:
        side === "BUY"
          ? `بایننس خرید مارکت ${money(sized.notional, 2)} تتر ${base}`
          : `بایننس فروش مارکت ${qty} ${base}`,
      method: "POST",
      path: "/api/v3/order",
      body: null,
      query: params.toString(),
      baseQty: sized.qty,
    };
  }

  const body = {
    category: "spot",
    symbol: `${base}USDT`,
    side: side === "BUY" ? "Buy" : "Sell",
    orderType: "Market",
    qty: side === "BUY" ? money(sized.notional, 2) : qty,
    marketUnit: side === "BUY" ? "quoteCoin" : "baseCoin",
    orderLinkId: id,
  };
  return {
    venue: input.venue,
    summary:
      side === "BUY"
        ? `بای‌بیت خرید مارکت ${body.qty} تتر ${base}`
        : `بای‌بیت فروش مارکت ${qty} ${base}`,
    method: "POST",
    path: "/v5/order/create",
    body,
    query: null,
    baseQty: sized.qty,
  };
}

export function bybitSignPayload(timestamp: string, apiKey: string, recvWindow: string, body: string): string {
  return `${timestamp}${apiKey}${recvWindow}${body}`;
}

export function nobitexSignPayload(timestamp: string, method: string, path: string, body: string): string {
  return `${timestamp}${method.toUpperCase()}${path}${body}`;
}

export function redact(text: string, secrets: string[]): string {
  let out = text.replace(/\s+/g, " ").slice(0, 320);
  for (const secret of secrets) {
    const clean = secret.trim();
    if (clean.length >= 6) out = out.split(clean).join("•••");
  }
  return out;
}

export function normalizeVenueCall(input: VenueCall): VenueCall {
  if (!input || typeof input !== "object") throw new Error("درخواست خالی است.");
  if (!isVenue(String(input.venue))) throw new Error("صرافی نامعتبر است.");
  if (input.action !== "probe" && input.action !== "preview" && input.action !== "place") {
    throw new Error("عملیات نامعتبر است.");
  }
  return {
    action: input.action,
    venue: input.venue,
    key: String(input.key ?? "").slice(0, 400),
    secret: String(input.secret ?? "").slice(0, 400),
    symbol: String(input.symbol ?? "").slice(0, 20),
    side: input.side === "SELL" ? "SELL" : "BUY",
    notionalUsd: Number(input.notionalUsd) || 0,
    priceUsd: Number(input.priceUsd) || 0,
    quote: input.quote === "IRT" ? "IRT" : "USDT",
    tomanPerUsdt: Number(input.tomanPerUsdt) || 0,
    confirm: String(input.confirm ?? "").slice(0, 20),
  };
}

export function describePlan(plan: PlannedOrder): string {
  const wire = plan.body ? JSON.stringify(plan.body) : plan.query ?? "";
  return `${plan.summary}\n${plan.method} ${plan.path}\n${wire}`;
}
