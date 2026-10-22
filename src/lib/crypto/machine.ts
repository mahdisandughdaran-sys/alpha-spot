import { buildAtrPlan } from "./spot-analytics.ts";
import type { AnalysisResult } from "./types.ts";
import type { Opportunity, PriceZone } from "./opportunity.ts";

export type MachineStance = "buy" | "park" | "flat";
export type RungKey = "touch" | "mid" | "deep";
export type SessionQuality = "prime" | "local" | "thin" | "weekend";

export type SessionRead = {
  quality: SessionQuality;
  tehran: string;
  london: string;
  newYork: string;
  labelFa: string;
  labelEn: string;
  adviceFa: string;
  adviceEn: string;
};

export type MachineRung = {
  key: RungKey;
  price: number;
  weight: number;
  notionalUsd: number;
  qty: number;
  /** Negative when the limit sits under the live price. */
  distancePct: number;
};

export type MachineTicket = {
  stance: MachineStance;
  sleeve: "satellite" | "core" | "cash";
  symbol: string;
  name: string;
  rank: number;
  score: number;
  livePrice: number;
  zoneLow: number;
  zoneHigh: number;
  invalidation: number;
  target: number;
  stopPct: number;
  rewardRisk: number | null;
  capitalUsd: number;
  riskPct: number;
  notionalUsd: number;
  coinQty: number;
  capped: boolean;
  rungs: MachineRung[];
  avgEntry: number | null;
  riskUsd: number;
  session: SessionRead;
  headlineFa: string;
  headlineEn: string;
  orderFa: string;
  orderEn: string;
  asideFa: string | null;
  asideEn: string | null;
  zoneSourceFa: string;
  zoneSourceEn: string;
};

export type MachineFocus = {
  hint: "buy" | "stay" | "wait" | "cash";
  holdsCore: boolean;
  symbol: string;
  name: string;
  rank: number;
  score: number;
  price: number;
  volatility30d: number | null;
  distFrom30dHighPct: number | null;
  rsi14: number | null;
  zone: PriceZone | null;
  targetUsd: number | null;
  invalidationUsd: number | null;
  bookWeight: number | null;
  sizeMultiplier: number;
  sleeve: "satellite" | "core" | "cash";
  asideFa: string | null;
  asideEn: string | null;
};

const SATELLITE_CAP = 0.32;
const CORE_ADD_CAP = 0.4;
const WEIGHTS: Record<RungKey, number> = { touch: 0.25, mid: 0.35, deep: 0.4 };

export function readSession(now = new Date()): SessionRead {
  const tehranH = hourIn(now, "Asia/Tehran");
  const londonH = hourIn(now, "Europe/London");
  const nyH = hourIn(now, "America/New_York");
  const utcDay = now.getUTCDay();
  const weekend = utcDay === 0 || utcDay === 6;
  const londonOpen = londonH >= 8 && londonH < 16;
  const nyOpen = nyH >= 8 && nyH < 17;
  const tehranDesk = tehranH >= 11 && tehranH < 24;
  let quality: SessionQuality = "thin";
  if (weekend) quality = "weekend";
  else if (londonOpen && nyOpen) quality = "prime";
  else if (londonOpen || nyOpen || tehranDesk) quality = "local";

  const label: Record<SessionQuality, [string, string]> = {
    prime: ["همپوشانی لندن و نیویورک", "London–New York overlap"],
    local: ["یکی از میزها باز است", "One major desk is open"],
    thin: ["نقدینگی نازک", "Thin liquidity"],
    weekend: ["آخر هفته", "Weekend tape"],
  };
  const advice: Record<SessionQuality, [string, string]> = {
    prime: [
      "بهترین ساعت برای لیمیت. اسپرد معمولاً تنگ‌تر است.",
      "Best hour for limits. Spreads are usually tighter.",
    ],
    local: [
      "لیمیت بنویس. اگر فقط تهران بیدار است، روی آلت کم‌عمق مارکت نزن.",
      "Use a limit. If only Tehran is awake, do not market a thin alt.",
    ],
    thin: [
      "دفتر سفارش خلوت است. حجم را کوچک‌تر و فقط لیمیت بگذار.",
      "The book is quiet. Size down and use a limit only.",
    ],
    weekend: [
      "میز سهام بسته است. اسپات باز است، ولی اسپرد می‌تواند گشاد شود.",
      "Equity desks are shut. Spot is open, but spreads can widen.",
    ],
  };
  return {
    quality,
    tehran: clockIn(now, "Asia/Tehran"),
    london: clockIn(now, "Europe/London"),
    newYork: clockIn(now, "America/New_York"),
    labelFa: label[quality][0],
    labelEn: label[quality][1],
    adviceFa: advice[quality][0],
    adviceEn: advice[quality][1],
  };
}

export function focusFromResult(
  result: AnalysisResult,
  live: Record<string, number> | undefined,
  holdsCore: boolean,
): MachineFocus {
  const verdict = result.verdict;
  const waiting = bestWaiting(result);
  if (verdict.kind === "cash" || result.killSwitch.sizeMultiplier === 0) {
    return {
      hint: "cash",
      holdsCore,
      symbol: "USDT",
      name: "Tether",
      rank: 0,
      score: 0,
      price: 1,
      volatility30d: null,
      distFrom30dHighPct: null,
      rsi14: null,
      zone: null,
      targetUsd: null,
      invalidationUsd: null,
      bookWeight: null,
      sizeMultiplier: 0,
      sleeve: "cash",
      asideFa: result.killSwitch.note,
      asideEn: null,
    };
  }

  if (verdict.kind === "buy" && verdict.symbol) {
    const row = coin(result, verdict.symbol);
    const opp = oppFor(result, verdict.symbol);
    return rowFocus(result, row, live, {
      hint: "buy",
      holdsCore,
      zone: opp?.zone ?? null,
      targetUsd: opp?.targetUsd ?? null,
      invalidationUsd: verdict.invalidationUsd,
      bookWeight: satelliteWeight(result, verdict.symbol),
      sleeve: "satellite",
      asideFa: holdsCore
        ? "هسته بیت‌کوین دست نمی‌خورد. این بلیت فقط قمر است."
        : "این بلیت فقط قمر است. بقیه سرمایه هسته است، نه یک خرید دوم همین امروز.",
      asideEn: holdsCore
        ? "The Bitcoin core stays put. This ticket is only the satellite."
        : "This ticket is only the satellite. The rest of the capital is the core, not a second buy today.",
    });
  }

  if (verdict.kind === "wait" && waiting) {
    const row = coin(result, waiting.symbol);
    return rowFocus(result, row, live, {
      hint: "wait",
      holdsCore,
      zone: waiting.zone,
      targetUsd: waiting.targetUsd,
      invalidationUsd: waiting.zone?.invalidation ?? null,
      bookWeight: null,
      sleeve: "satellite",
      asideFa: "هسته بیت‌کوین دست نمی‌خورد. این لیمیت‌ها فقط وقتی زنده‌اند که قیمت به ناحیه برسد.",
      asideEn: "The Bitcoin core stays put. These limits go live only when price reaches the zone.",
    });
  }

  const btc = coin(result, "BTC");
  return rowFocus(result, btc, live, {
    hint: "stay",
    holdsCore,
    zone: null,
    targetUsd: null,
    invalidationUsd: null,
    bookWeight: null,
    sleeve: "core",
    asideFa: waiting
      ? `${waiting.symbol} هنوز قمر نیست. ${waiting.summary}`
      : "قمری که چهار دروازه را رد کرده باشد روی میز نیست.",
    asideEn: waiting
      ? `${waiting.symbol} is not a satellite yet. ${waiting.summary}`
      : "No name on the desk has cleared the four satellite gates.",
  });
}

export function buildMachineTicket(
  focus: MachineFocus,
  capitalUsd: number,
  riskPct: number,
  now = new Date(),
): MachineTicket {
  const session = readSession(now);
  const capital = Number.isFinite(capitalUsd) && capitalUsd > 0 ? capitalUsd : 0;
  const risk = clamp(riskPct, 0.25, 2);
  const blank = (partial: Partial<MachineTicket> & Pick<MachineTicket, "stance" | "headlineFa" | "headlineEn" | "orderFa" | "orderEn">): MachineTicket => ({
    sleeve: focus.sleeve,
    symbol: focus.symbol,
    name: focus.name,
    rank: focus.rank,
    score: focus.score,
    livePrice: focus.price,
    zoneLow: focus.price,
    zoneHigh: focus.price,
    invalidation: focus.price,
    target: focus.price,
    stopPct: 0,
    rewardRisk: null,
    capitalUsd: capital,
    riskPct: risk,
    notionalUsd: 0,
    coinQty: 0,
    capped: false,
    rungs: [],
    avgEntry: null,
    riskUsd: 0,
    session,
    asideFa: focus.asideFa,
    asideEn: focus.asideEn,
    zoneSourceFa: "",
    zoneSourceEn: "",
    ...partial,
  });

  if (focus.hint === "cash" || focus.sizeMultiplier === 0 || focus.symbol === "USDT") {
    return blank({
      stance: "flat",
      headlineFa: "هیچ‌چیز نخر",
      headlineEn: "Buy nothing",
      orderFa: "کلید قطع روشن است. سرمایه در تتر می‌ماند. نه پله، نه مارکت، نه قمر.",
      orderEn: "The kill switch is on. Capital stays in tether. No ladder, no market, no satellite.",
      zoneSourceFa: "کلید قطع",
      zoneSourceEn: "Kill switch",
    });
  }

  if (focus.hint === "stay" && focus.holdsCore) {
    return blank({
      stance: "flat",
      sleeve: "core",
      headlineFa: "به هسته دست نزن",
      headlineEn: "Do not touch the core",
      orderFa: "بیت‌کوین را داری و مدل قمر باز نکرده. خرید تازه امروز صفر است.",
      orderEn: "You already hold Bitcoin and the model has not opened a satellite. New buying today is zero.",
      zoneSourceFa: "حکم نگه داشتن هسته",
      zoneSourceEn: "Core-hold call",
    });
  }

  const zone = resolveZone(focus);
  if (focus.price <= zone.invalidation) {
    return blank({
      stance: "flat",
      zoneLow: zone.low,
      zoneHigh: zone.high,
      invalidation: zone.invalidation,
      target: zone.target,
      headlineFa: "زیر ابطال",
      headlineEn: "Under invalidation",
      orderFa: `${focus.symbol} زیر قیمت ابطال است. سفارش جدید ننویس.`,
      orderEn: `${focus.symbol} is under invalidation. Do not write a new order.`,
      zoneSourceFa: zone.sourceFa,
      zoneSourceEn: zone.sourceEn,
    });
  }

  const brokeZone = focus.price < zone.low * 0.997;
  if (brokeZone) {
    return blank({
      stance: "park",
      zoneLow: zone.low,
      zoneHigh: zone.high,
      invalidation: zone.invalidation,
      target: zone.target,
      headlineFa: "ناحیه رد شد",
      headlineEn: "The zone was lost",
      orderFa: "قیمت از کف ناحیه گذشته و هنوز ابطال نشده. تا برگشت به ناحیه سفارشی نگذار.",
      orderEn: "Price lost the bottom of the zone and has not invalidated. Place nothing until it returns.",
      zoneSourceFa: zone.sourceFa,
      zoneSourceEn: zone.sourceEn,
    });
  }

  const inZone = focus.price <= zone.high * 1.003;
  const stance: MachineStance = focus.hint === "wait" || !inZone ? "park" : "buy";
  const draft = [
    { key: "touch" as const, price: nice(Math.min(zone.high, focus.price)), weight: WEIGHTS.touch },
    { key: "mid" as const, price: nice(Math.min((zone.high + zone.low) / 2, focus.price)), weight: WEIGHTS.mid },
    { key: "deep" as const, price: nice(Math.min(zone.low, focus.price)), weight: WEIGHTS.deep },
  ].filter((rung) => rung.price > zone.invalidation);

  const merged = mergeRungs(draft);
  const avg = weighted(merged);
  const stopPct = avg > zone.invalidation ? (avg - zone.invalidation) / avg : 0;
  let notional = 0;
  let capped = false;
  if (stopPct >= 0.012 && capital > 0 && focus.sizeMultiplier > 0) {
    let weight = (risk / 100) / stopPct;
    const cap = focus.sleeve === "core" ? CORE_ADD_CAP : SATELLITE_CAP;
    if (focus.bookWeight != null && focus.bookWeight > 0) {
      weight = Math.min(weight, focus.bookWeight * (risk / 1));
    }
    if (weight > cap) {
      weight = cap;
      capped = true;
    }
    notional = Math.round(capital * weight * focus.sizeMultiplier);
  } else {
    capped = true;
  }

  const rungs: MachineRung[] = merged.map((rung) => {
    const notionalUsd = Math.round(notional * rung.weight);
    return {
      key: rung.key,
      price: rung.price,
      weight: rung.weight,
      notionalUsd,
      qty: rung.price > 0 ? notionalUsd / rung.price : 0,
      distancePct: focus.price > 0 ? (rung.price - focus.price) / focus.price : 0,
    };
  });
  const coinQty = rungs.reduce((sum, rung) => sum + rung.qty, 0);
  const rewardRisk = avg > zone.invalidation && zone.target > avg ? (zone.target - avg) / (avg - zone.invalidation) : null;
  const riskUsd = Math.round(notional * stopPct);

  const parked = stance === "park";
  const headlineFa = parked
    ? focus.hint === "wait"
      ? "لیمیت را پارک کن"
      : "مارکت نزن، لیمیت بگذار"
    : focus.sleeve === "core"
      ? "هسته را پله‌ای بساز"
      : "قمر را پله‌ای بخر";
  const headlineEn = parked
    ? focus.hint === "wait"
      ? "Park the limits"
      : "Do not market it — leave limits"
    : focus.sleeve === "core"
      ? "Build the core in rungs"
      : "Buy the satellite in rungs";

  const orderFa = parked
    ? `${focus.symbol} را مارکت نخر. سه لیمیت داخل ناحیه بنویس. پلهٔ عمیق‌تر حجم بیشتری دارد. تا پر شدن، به بازنده اضافه نکن.`
    : `${focus.symbol} داخل ناحیه است. سه لیمیت، نه یک سفارش. اگر پله‌ای پر شد و قیمت به ابطال رسید، همان پله بسته می‌شود.`;
  const orderEn = parked
    ? `Do not market-buy ${focus.symbol}. Write three limits inside the zone. The deeper rung is larger. Do not add to a loser before a fill.`
    : `${focus.symbol} is inside the zone. Three limits, not one order. A filled rung closes if price tags invalidation.`;

  return {
    stance,
    sleeve: focus.sleeve,
    symbol: focus.symbol,
    name: focus.name,
    rank: focus.rank,
    score: focus.score,
    livePrice: focus.price,
    zoneLow: zone.low,
    zoneHigh: zone.high,
    invalidation: zone.invalidation,
    target: zone.target,
    stopPct,
    rewardRisk,
    capitalUsd: capital,
    riskPct: risk,
    notionalUsd: notional,
    coinQty,
    capped,
    rungs,
    avgEntry: avg > 0 ? avg : null,
    riskUsd,
    session,
    headlineFa,
    headlineEn,
    orderFa,
    orderEn,
    asideFa: focus.asideFa,
    asideEn: focus.asideEn,
    zoneSourceFa: zone.sourceFa,
    zoneSourceEn: zone.sourceEn,
  };
}

export function ticketText(ticket: MachineTicket, locale: "fa" | "en", tomanPerUsd: number | null): string {
  const en = locale === "en";
  const money = (usd: number) => {
    const base = `$${Math.round(usd).toLocaleString("en-US")}`;
    if (tomanPerUsd == null || !(tomanPerUsd > 0)) return base;
    const toman = Math.round((usd * tomanPerUsd) / 1000) * 1000;
    return en ? `${base} (${toman.toLocaleString("en-US")} toman)` : `${base} (${toman.toLocaleString("en-US")} تومان)`;
  };
  const lines = [
    en ? "Alpha Spot · spot ticket" : "آلفا اسپات · بلیت اسپات",
    `${ticket.symbol} · ${en ? ticket.headlineEn : ticket.headlineFa}`,
    en ? ticket.orderEn : ticket.orderFa,
    "",
    `${en ? "Live" : "لحظه"} $${formatPx(ticket.livePrice)}`,
    `${en ? "Zone" : "ناحیه"} $${formatPx(ticket.zoneLow)} – $${formatPx(ticket.zoneHigh)}`,
    `${en ? "Invalidation" : "ابطال"} $${formatPx(ticket.invalidation)}`,
    `${en ? "Target" : "هدف"} $${formatPx(ticket.target)}`,
    `${en ? "New buy" : "خرید تازه"} ${money(ticket.notionalUsd)} · ${en ? "risk" : "ریسک"} ${ticket.riskPct}% ≈ ${money(ticket.riskUsd)}`,
  ];
  if (ticket.avgEntry != null) {
    lines.push(`${en ? "Average if all fill" : "میانگین اگر هر سه پر شود"} $${formatPx(ticket.avgEntry)}`);
  }
  lines.push("");
  for (const rung of ticket.rungs) {
    const name = en
      ? rung.key === "touch"
        ? "Touch"
        : rung.key === "mid"
          ? "Mid"
          : "Deep"
      : rung.key === "touch"
        ? "لمس"
        : rung.key === "mid"
          ? "میانه"
          : "عمیق";
    lines.push(`${name}  $${formatPx(rung.price)}  ${money(rung.notionalUsd)}  ${rung.qty.toFixed(rung.qty >= 1 ? 4 : 6)} ${ticket.symbol}`);
  }
  lines.push("");
  lines.push(`${en ? ticket.session.labelEn : ticket.session.labelFa} · Tehran ${ticket.session.tehran} · London ${ticket.session.london} · NY ${ticket.session.newYork}`);
  lines.push(en ? "Not investment advice. No order is sent to an exchange." : "توصیه سرمایه‌گذاری نیست. سفارشی به صرافی فرستاده نمی‌شود.");
  return lines.join("\n");
}

function rowFocus(
  result: AnalysisResult,
  row: AnalysisResult["pick"],
  live: Record<string, number> | undefined,
  extra: Omit<MachineFocus, "symbol" | "name" | "rank" | "score" | "price" | "volatility30d" | "distFrom30dHighPct" | "rsi14" | "sizeMultiplier">,
): MachineFocus {
  const quoted = live?.[row.symbol];
  return {
    ...extra,
    symbol: row.symbol,
    name: row.name,
    rank: row.rank,
    score: row.score,
    price: quoted && quoted > 0 ? quoted : row.priceUsd,
    volatility30d: row.volatility30d,
    distFrom30dHighPct: row.distFrom30dHighPct,
    rsi14: row.rsi14,
    sizeMultiplier: result.killSwitch.sizeMultiplier > 0 ? result.killSwitch.sizeMultiplier : 0,
  };
}

function coin(result: AnalysisResult, symbol: string): AnalysisResult["pick"] {
  return result.top.find((row) => row.symbol === symbol) ?? result.pick;
}

function oppFor(result: AnalysisResult, symbol: string): Opportunity | null {
  return result.opportunities?.items?.find((item) => item.symbol === symbol) ?? null;
}

function bestWaiting(result: AnalysisResult): Opportunity | null {
  const rank: Record<string, number> = {
    "in-zone": 0,
    confirmed: 1,
    actionable: 2,
    approaching: 3,
    watching: 4,
  };
  const items = (result.opportunities?.items ?? []).filter((item) => item.symbol !== "BTC" && item.zone);
  items.sort((a, b) => (rank[a.status] ?? 9) - (rank[b.status] ?? 9) || b.score - a.score);
  return items[0] ?? null;
}

function satelliteWeight(result: AnalysisResult, symbol: string): number | null {
  const row = result.portfolio
    .flatMap((sleeve) => sleeve.legs)
    .find((leg) => leg.symbol === symbol);
  return row && row.weight > 0 ? row.weight : null;
}

function resolveZone(focus: MachineFocus): {
  low: number;
  high: number;
  invalidation: number;
  target: number;
  sourceFa: string;
  sourceEn: string;
} {
  const price = focus.price;
  const plan = buildAtrPlan({
    price,
    volatility30d: focus.volatility30d,
    sizeMultiplier: 1,
  });
  const atrStop = plan?.stop ?? price * 0.92;
  const atrTarget = plan?.target ?? price * 1.08;
  let low: number;
  let high: number;
  let invalidation: number;
  let target: number;
  let sourceFa: string;
  let sourceEn: string;

  if (
    focus.zone &&
    focus.zone.high > focus.zone.low &&
    focus.zone.low > 0 &&
    focus.zone.invalidation > 0 &&
    focus.zone.invalidation < focus.zone.low
  ) {
    low = focus.zone.low;
    high = focus.zone.high;
    invalidation =
      focus.invalidationUsd != null && focus.invalidationUsd > 0 && focus.invalidationUsd < low
        ? focus.invalidationUsd
        : focus.zone.invalidation;
    target = focus.targetUsd != null && focus.targetUsd > high ? focus.targetUsd : Math.max(atrTarget, high * 1.04);
    sourceFa = "ناحیه از سقف و کف‌های تأییدشده";
    sourceEn = "Zone from confirmed swing shelves";
  } else {
    const nearHigh =
      (focus.distFrom30dHighPct != null && focus.distFrom30dHighPct > -0.04) ||
      (focus.rsi14 != null && focus.rsi14 >= 72);
    invalidation =
      focus.invalidationUsd != null && focus.invalidationUsd > 0 && focus.invalidationUsd < price * 0.995
        ? focus.invalidationUsd
        : atrStop;
    target = focus.targetUsd != null && focus.targetUsd > price * 1.01 ? focus.targetUsd : atrTarget;
    const span = Math.max(price - invalidation, price * 0.03);
    if (focus.hint === "buy" && !nearHigh) {
      high = price;
      low = Math.max(invalidation * 1.012, price - span * 0.42);
    } else {
      high = price * (1 - Math.min(0.015, (plan?.atrPct ?? 0.03) * 0.4));
      low = Math.max(invalidation * 1.012, price - span * 0.62);
    }
    sourceFa = nearHigh ? "قیمت نزدیک سقف است؛ ناحیه زیر بازار نشسته" : "ناحیه از نوسان روزانه و ابطال مدل";
    sourceEn = nearHigh
      ? "Price is near the high, so the zone sits under the market"
      : "Zone from daily volatility and the model invalidation";
  }

  if (!(high > 0)) high = price;
  if (!(low > 0) || low >= high) low = high * 0.985;
  if (!(invalidation > 0) || invalidation >= low) invalidation = low * 0.97;
  if (!(target > price)) target = price * (1 + Math.max(plan?.targetPct ?? 0.06, 0.04));
  return {
    low: nice(low),
    high: nice(high),
    invalidation: nice(invalidation),
    target: nice(target),
    sourceFa,
    sourceEn,
  };
}

function mergeRungs(rows: { key: RungKey; price: number; weight: number }[]): { key: RungKey; price: number; weight: number }[] {
  const out: { key: RungKey; price: number; weight: number }[] = [];
  for (const row of rows) {
    const prev = out[out.length - 1];
    if (prev && Math.abs(prev.price - row.price) / row.price < 0.004) {
      prev.weight += row.weight;
      continue;
    }
    out.push({ ...row });
  }
  const sum = out.reduce((s, row) => s + row.weight, 0) || 1;
  return out.map((row) => ({ ...row, weight: row.weight / sum }));
}

function weighted(rows: { price: number; weight: number }[]): number {
  const sum = rows.reduce((s, row) => s + row.weight, 0);
  if (!(sum > 0)) return 0;
  return rows.reduce((s, row) => s + row.price * row.weight, 0) / sum;
}

function nice(n: number): number {
  if (!(n > 0) || !Number.isFinite(n)) return 0;
  const digits = n >= 1000 ? 2 : n >= 1 ? 4 : 6;
  const f = 10 ** digits;
  return Math.round(n * f) / f;
}

function formatPx(n: number): string {
  if (!(n > 0)) return "—";
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(4);
}

function clamp(n: number, lo: number, hi: number): number {
  if (!Number.isFinite(n)) return 1;
  return Math.min(hi, Math.max(lo, n));
}

function hourIn(now: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  return Number(parts.find((part) => part.type === "hour")?.value ?? "0");
}

function clockIn(now: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(now);
}
