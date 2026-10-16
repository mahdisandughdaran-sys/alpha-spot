import { detectWeeklyStructure, ema, rsi } from "./math.ts";

export type SpotCandle = {
  t: number;
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
};

export type SpotRegime = "bull" | "bear" | "range";
export type SpotAction = "buy" | "wait" | "exit";
export type SpotSize = "full" | "half" | "none";
export type SpotConfidence = "high" | "medium" | "low";

export type SpotChartPoint = {
  t: number;
  time: number;
  c: number;
  h: number;
  l: number;
};

export type SpotPlan = {
  symbol: string;
  nameFa: string;
  nameEn: string;
  pair: string;
  price: number;
  regime: SpotRegime;
  weekly: SpotRegime;
  action: SpotAction;
  size: SpotSize;
  confidence: SpotConfidence;
  rsi: number | null;
  atr: number;
  atrPct: number;
  ema20: number | null;
  ema50: number | null;
  ema200: number | null;
  emaDist: number | null;
  entry: number;
  buyFrom: number;
  buyTo: number;
  takeProfit: number;
  invalidation: number;
  distToEntry: number;
  change7d: number | null;
  change30d: number | null;
  confluence: number;
  touchIndex: number | null;
  headlineFa: string;
  headlineEn: string;
  buyFa: string;
  buyEn: string;
  sellUpFa: string;
  sellUpEn: string;
  sellDownFa: string;
  sellDownEn: string;
  notes: { fa: string; en: string }[];
  chart: SpotChartPoint[];
};

export type SpotAssetRef = {
  symbol: string;
  nameFa: string;
  nameEn: string;
  pair: string;
};

type Candidate = { price: number; score: number; tag: string };

const TAG_FA: Record<string, string> = {
  fib38: "فیبوناچی ۳۸٪",
  fib50: "فیبوناچی ۵۰٪",
  fib62: "فیبوناچی ۶۲٪",
  ema20: "میانگین ۲۰ روز",
  ema50: "میانگین ۵۰ روز",
  ema200: "میانگین ۲۰۰ روز",
  pivot: "حمایت سوینگ",
  recentLow: "کف ۳۰ روز",
};

const TAG_EN: Record<string, string> = {
  fib38: "the 38% Fibonacci",
  fib50: "the 50% Fibonacci",
  fib62: "the 62% Fibonacci",
  ema20: "the 20-day average",
  ema50: "the 50-day average",
  ema200: "the 200-day average",
  pivot: "a swing shelf",
  recentLow: "the 30-day low",
};

export function formatSpotUsd(n: number): string {
  if (!(n > 0) || !Number.isFinite(n)) return "—";
  if (n >= 20000) return `$${Math.round(n).toLocaleString("en-US")}`;
  if (n >= 1000) return `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
  if (n >= 1) return `$${n.toFixed(n >= 100 ? 2 : 4)}`;
  return `$${n.toPrecision(4)}`;
}

/** Best spot entry, upside sell, and downside sell for one USDT pair. */
export function buildSpotPlan(candles: SpotCandle[], asset: SpotAssetRef): SpotPlan {
  if (candles.length < 40) throw new Error("کندل روزانه کافی نیست.");
  const closes = candles.map((bar) => bar.c);
  const price = closes[closes.length - 1] ?? 0;
  if (!(price > 0)) throw new Error("قیمت نامعتبر است.");

  const atr = averageTrueRange(candles, 14);
  const atrPct = atr / price;
  const ema20 = ema(closes, 20);
  const ema50 = ema(closes, 50);
  const ema200 = ema(closes, 200);
  const rsi14 = rsi(closes, 14);
  const weekly = detectWeeklyStructure(closes);
  const regime = dailyRegime(price, ema50, ema200);
  const emaDist = ema200 && ema200 > 0 ? price / ema200 - 1 : null;

  const look = candles.slice(-100);
  let hiI = 0;
  let loI = 0;
  for (let i = 0; i < look.length; i++) {
    if (look[i]!.h >= look[hiI]!.h) hiI = i;
    if (look[i]!.l <= look[loI]!.l) loI = i;
  }
  const swingHigh = look[hiI]!.h;
  const swingLow = look[loI]!.l;
  const span = Math.max(swingHigh - swingLow, 0);
  const rally = loI < hiI && span > price * 0.03;

  const pivotLows = cluster(
    pivots(candles, "low", 4).filter((point) => point.i >= candles.length - 170),
    Math.max(atr * 0.55, price * 0.006),
  );
  const pivotHighs = cluster(
    pivots(candles, "high", 4).filter((point) => point.i >= candles.length - 170),
    Math.max(atr * 0.55, price * 0.006),
  );

  const candidates: Candidate[] = [];
  const add = (level: number | null, score: number, tag: string) => {
    if (level == null || !(level > 0)) return;
    if (level > price * 1.012) return;
    candidates.push({ price: level, score: score + locationScore(level, price, regime), tag });
  };

  if (rally) {
    add(swingHigh - 0.382 * span, regime === "bull" ? 26 : 10, "fib38");
    add(swingHigh - 0.5 * span, regime === "bear" ? 12 : 28, "fib50");
    add(swingHigh - 0.618 * span, regime === "bull" ? 14 : 30, "fib62");
  }
  add(ema20, regime === "bull" ? 10 : 4, "ema20");
  add(ema50, regime === "bear" ? 8 : 18, "ema50");
  add(ema200, regime === "bull" ? 6 : 24, "ema200");
  for (const shelf of pivotLows) {
    add(shelf.price, 12 + Math.min(shelf.touches, 3) * 8, "pivot");
  }
  const month = candles.slice(-30);
  const recentLow = Math.min(...month.map((bar) => bar.l));
  if (recentLow <= price * 1.004) add(recentLow, 24, "recentLow");
  if (candidates.length === 0) add(price * (regime === "bear" ? 0.94 : 0.985), 8, "fallback");

  candidates.sort(
    (a, b) => b.score - a.score || Math.abs(price - a.price) - Math.abs(price - b.price),
  );
  const best = candidates[0] ?? { price: price * 0.98, score: 0, tag: "fallback" };
  const near = candidates.filter((item) => Math.abs(item.price - best.price) <= Math.max(atr * 0.5, price * 0.008));
  const tags = [...new Set(near.map((item) => item.tag).filter((tag) => tag !== "fallback"))];

  const pad = Math.max(atr * 0.38, best.price * 0.0045);
  let entry = nice(best.price, price);
  let buyFrom = nice(entry - pad, price);
  let buyTo = nice(entry + pad * 0.72, price);

  const monthLow = Math.min(...candles.slice(-30).map((bar) => bar.l));
  const bufferedShelf = Math.min(monthLow, buyFrom) - atr * 0.35;
  let invalidation = monthLow > entry ? buyFrom - Math.max(atr * 0.9, entry * 0.015) : bufferedShelf;
  const farStop = entry - Math.max(atr * 1.7, entry * 0.045);
  if (entry - invalidation > entry * 0.1) invalidation = Math.max(invalidation, farStop);
  invalidation = nice(invalidation, price);

  const resistances = pivotHighs.map((shelf) => shelf.price);
  const hi60 = Math.max(...candles.slice(-60).map((bar) => bar.h));
  if (hi60 > price) resistances.push(hi60);
  if (swingHigh > price) resistances.push(swingHigh);
  if (!rally && span > 0) {
    resistances.push(swingLow + 0.382 * span, swingLow + 0.5 * span);
  }
  const above = resistances
    .filter((level) => level > price * 1.006)
    .sort((a, b) => a - b);
  const sized = above.find((level) => (level - price) / price >= 0.008);
  let takeProfit = sized ?? price + Math.max(atr * 1.8, price * 0.03);
  takeProfit = nice(takeProfit, price);

  if (buyFrom > entry) buyFrom = entry;
  if (buyTo < entry) buyTo = entry;
  if (!(invalidation < buyFrom)) invalidation = nice(buyFrom * 0.985, price);
  if (!(invalidation < buyFrom)) invalidation = buyFrom - Math.max(atr * 0.4, price * 0.005);
  if (!(takeProfit > price)) takeProfit = nice(price + Math.max(atr * 1.5, price * 0.02), price);
  if (!(takeProfit > buyTo)) takeProfit = nice(Math.max(takeProfit, buyTo + atr), price);

  const inZone = price >= buyFrom && price <= buyTo * 1.002;
  const broken = price < invalidation;
  let action: SpotAction;
  if (broken) action = "exit";
  else if (inZone && regime !== "bear") action = "buy";
  else if (inZone && regime === "bear" && rsi14 != null && rsi14 < 32) action = "buy";
  else action = "wait";

  let size: SpotSize = "half";
  if (action === "exit" || (action === "wait" && regime === "bear")) size = "none";
  else if (action === "buy" && regime === "bull" && (rsi14 == null || rsi14 < 68) && weekly !== "bear") size = "full";
  else size = "half";
  if (regime === "bear" && action === "buy") size = "half";

  let confidence: SpotConfidence = "low";
  if (tags.length >= 3 && regime !== "bear" && candles.length >= 180) confidence = "high";
  else if (tags.length >= 2 || (tags.length >= 1 && regime === "bull" && !broken)) confidence = "medium";
  if (weekly === "bear" && regime === "bull" && confidence === "high") confidence = "medium";

  const chart = candles.slice(-140).map((bar, t) => ({
    t,
    time: bar.t,
    c: bar.c,
    h: bar.h,
    l: bar.l,
  }));
  let touchIndex: number | null = null;
  for (let i = chart.length - 1; i >= 0; i--) {
    const bar = chart[i]!;
    if (bar.l <= entry && bar.h >= entry) {
      touchIndex = bar.t;
      break;
    }
  }

  const change7d = changeOver(closes, 7);
  const change30d = changeOver(closes, 30);
  const distToEntry = entry > 0 ? price / entry - 1 : 0;
  const copy = sentences({
    asset,
    action,
    regime,
    price,
    entry,
    buyFrom,
    buyTo,
    takeProfit,
    invalidation,
    rsi14,
    weekly,
    tags,
    distToEntry,
    emaDist,
    monthLow,
  });

  return {
    symbol: asset.symbol,
    nameFa: asset.nameFa,
    nameEn: asset.nameEn,
    pair: asset.pair,
    price,
    regime,
    weekly,
    action,
    size,
    confidence,
    rsi: rsi14,
    atr,
    atrPct,
    ema20,
    ema50,
    ema200,
    emaDist,
    entry,
    buyFrom,
    buyTo,
    takeProfit,
    invalidation,
    distToEntry,
    change7d,
    change30d,
    confluence: tags.length,
    touchIndex,
    chart,
    ...copy,
  };
}

function sentences(input: {
  asset: SpotAssetRef;
  action: SpotAction;
  regime: SpotRegime;
  price: number;
  entry: number;
  buyFrom: number;
  buyTo: number;
  takeProfit: number;
  invalidation: number;
  rsi14: number | null;
  weekly: SpotRegime;
  tags: string[];
  distToEntry: number;
  emaDist: number | null;
  monthLow: number;
}): Pick<
  SpotPlan,
  "headlineFa" | "headlineEn" | "buyFa" | "buyEn" | "sellUpFa" | "sellUpEn" | "sellDownFa" | "sellDownEn" | "notes"
> {
  const entry = formatSpotUsd(input.entry);
  const from = formatSpotUsd(input.buyFrom);
  const to = formatSpotUsd(input.buyTo);
  const up = formatSpotUsd(input.takeProfit);
  const down = formatSpotUsd(input.invalidation);
  const name = input.asset.nameFa;
  const nameEn = input.asset.nameEn;

  const headlineFa =
    input.action === "buy"
      ? `${name} داخل ناحیه خرید است. بهترین نقطه ورود ${entry} است.`
      : input.action === "exit"
        ? `${name} از حد خروج پایین‌تر رفته. اگر پوزیشن اسپات داری بفروش و خرید تازه را متوقف کن.`
        : `بهترین ورود اسپات ${name} روی ${entry} است. تا وقتی قیمت به این ناحیه نرسیده، تعقیب نکن.`;
  const headlineEn =
    input.action === "buy"
      ? `${nameEn} is inside the buy zone. The best entry is ${entry}.`
      : input.action === "exit"
        ? `${nameEn} is through the exit. Sell a spot position you still hold, and do not open a new one.`
        : `The best ${nameEn} spot entry is ${entry}. Do not chase until price comes back to that zone.`;

  const buyFa =
    input.action === "exit"
      ? `خرید تازه نکن. ناحیه ${from} تا ${to} فقط اگر قیمت برگردد و همان‌جا بماند دوباره معتبر است. بهترین نقطه ${entry}.`
      : `از ${from} تا ${to} بخر. بهترین نقطه ورود ${entry} است${
          input.distToEntry > 0.012
            ? `؛ قیمت الان ${(input.distToEntry * 100).toFixed(1)}٪ بالاتر است`
            : input.distToEntry < -0.004
              ? " و قیمت همین حالا به آن رسیده یا از آن گذشته"
              : " و قیمت کنار همین نقطه است"
        }.`;
  const buyEn =
    input.action === "exit"
      ? `Do not buy yet. ${from} to ${to} counts again only if price reclaims it. Best entry ${entry}.`
      : `Buy from ${from} to ${to}. The best entry is ${entry}${
          input.distToEntry > 0.012
            ? `; spot is ${(input.distToEntry * 100).toFixed(1)}% above it`
            : input.distToEntry < -0.004
              ? ", and price is already there or through it"
              : ", and price is sitting on it"
        }.`;

  const sellUpFa = `اگر قیمت از ${up} بالا رد شد و بالای آن بسته شد، بخشی از اسپات را بفروش.`;
  const sellUpEn = `If price crosses ${up} and closes above it, sell part of the spot position.`;
  const sellDownFa =
    input.action === "exit"
      ? `حد فروش ${down} است و قیمت از آن پایین رفته. ماندن زیر این سطح یعنی سناریو باطل شده.`
      : `اگر قیمت از ${down} پایین رد شد، سناریو باطل است و اسپات را بفروش.`;
  const sellDownEn =
    input.action === "exit"
      ? `The sell level is ${down}, and price is already through it. Staying under that level invalidates the setup.`
      : `If price crosses under ${down}, the setup is invalid and the spot position should be sold.`;

  const regimeFa =
    input.regime === "bull"
      ? "روند روزانه صعودی است؛ قیمت بالای میانگین ۲۰۰ روز مانده."
      : input.regime === "bear"
        ? "روند روزانه نزولی است. خرید اسپات فقط دفاعی و کوچک است، نه یک ورود کامل."
        : "روند روزانه رنج است. وسط محدوده خرید نیست؛ فقط نزدیک حمایت.";
  const regimeEn =
    input.regime === "bull"
      ? "The daily trend is up; price is still above the 200-day average."
      : input.regime === "bear"
        ? "The daily trend is down. A spot buy here is defensive and small, not a full entry."
        : "The daily trend is a range. Do not buy the middle; only near support.";

  const rsiFa =
    input.rsi14 == null
      ? "RSI ۱۴ روزه کامل نشد."
      : input.rsi14 >= 70
        ? `RSI روی ${input.rsi14.toFixed(0)} داغ است. خرید در این ارتفاع گران است.`
        : input.rsi14 <= 35
          ? `RSI روی ${input.rsi14.toFixed(0)} سرد است. اگر روی حمایت باشد، فروشنده خسته به نظر می‌رسد.`
          : `RSI روی ${input.rsi14.toFixed(0)} خنثی است.`;
  const rsiEn =
    input.rsi14 == null
      ? "The 14-day RSI was incomplete."
      : input.rsi14 >= 70
        ? `RSI at ${input.rsi14.toFixed(0)} is hot. Buying this high is expensive.`
        : input.rsi14 <= 35
          ? `RSI at ${input.rsi14.toFixed(0)} is cold. On a shelf, sellers look tired.`
          : `RSI at ${input.rsi14.toFixed(0)} is neutral.`;

  const joinedFa = input.tags.map((tag) => TAG_FA[tag] ?? tag).slice(0, 3);
  const joinedEn = input.tags.map((tag) => TAG_EN[tag] ?? tag).slice(0, 3);
  const confFa =
    joinedFa.length >= 2
      ? `ورود با ${joinedFa.join("، ")} هم‌پوشان است.`
      : joinedFa.length === 1
        ? `ورود بیشتر روی ${joinedFa[0]} تکیه دارد.`
        : "هم‌پوشانی قوی بین حمایت‌ها پیدا نشد؛ به همین خاطر اندازه را کوچک بگیر.";
  const confEn =
    joinedEn.length >= 2
      ? `The entry lines up with ${joinedEn.join(", ")}.`
      : joinedEn.length === 1
        ? `The entry leans mostly on ${joinedEn[0]}.`
        : "No strong overlap between shelves, so keep the size small.";

  const notes = [
    { fa: regimeFa, en: regimeEn },
    { fa: rsiFa, en: rsiEn },
    { fa: confFa, en: confEn },
  ];
  if (input.weekly === "bear" && input.regime !== "bear") {
    notes.push({
      fa: "ساختار هفتگی هنوز نزولی است. حتی اگر ورود روزانه خوب باشد، اندازه را نصف کن.",
      en: "Weekly structure is still down. Even with a decent daily entry, cut the size in half.",
    });
  }
  if (input.monthLow > 0 && Math.abs(input.invalidation - input.monthLow) / input.monthLow < 0.02) {
    notes.push({
      fa: "حد فروش پایین کمی زیر کف ۳۰ روز نشسته تا یک سایه کوتاه آن را باطل نکند.",
      en: "The downside sell sits just under the 30-day low, so a short wick does not invalidate it.",
    });
  }
  if (input.emaDist != null && input.emaDist > 0.18 && input.regime === "bull") {
    notes.push({
      fa: "فاصله تا میانگین ۲۰۰ روز زیاد است. برگشت به ورود محتمل‌تر از ادامه مستقیم است.",
      en: "Price is stretched above the 200-day average. A return to the entry is more likely than a straight continuation.",
    });
  }

  return {
    headlineFa,
    headlineEn,
    buyFa,
    buyEn,
    sellUpFa,
    sellUpEn,
    sellDownFa,
    sellDownEn,
    notes: notes.slice(0, 5),
  };
}

function dailyRegime(price: number, ema50: number | null, ema200: number | null): SpotRegime {
  if (ema200 == null || !(ema200 > 0)) return "range";
  if (price > ema200 && (ema50 == null || ema50 >= ema200 * 0.995)) return "bull";
  if (price < ema200 && (ema50 == null || ema50 <= ema200 * 1.005)) return "bear";
  return "range";
}

function locationScore(level: number, price: number, regime: SpotRegime): number {
  const dist = (price - level) / price;
  const sweet = regime === "bull" ? 0.04 : regime === "range" ? 0.07 : 0.1;
  const width = regime === "bear" ? 0.075 : 0.042;
  const gauss = Math.exp(-((dist - sweet) ** 2) / (2 * width * width));
  let score = 18 + gauss * 42;
  if (dist < -0.004) score -= 36;
  if (dist > 0.2) score -= 28;
  if (dist >= -0.002 && dist <= 0.012 && regime === "bull") score += 8;
  return score;
}

function changeOver(closes: number[], days: number): number | null {
  if (closes.length <= days) return null;
  const prev = closes[closes.length - 1 - days];
  const last = closes[closes.length - 1];
  if (prev == null || last == null || !(prev > 0)) return null;
  return last / prev - 1;
}

function nice(n: number, ref: number): number {
  if (!Number.isFinite(n) || !(n > 0)) return n;
  const step = ref >= 20000 ? 10 : ref >= 1000 ? 1 : ref >= 100 ? 0.1 : ref >= 1 ? 0.01 : ref * 0.001;
  return Math.round(n / step) * step;
}

function averageTrueRange(candles: SpotCandle[], period: number): number {
  const trs: number[] = [];
  for (let i = 0; i < candles.length; i++) {
    const bar = candles[i]!;
    const prev = i > 0 ? candles[i - 1]!.c : bar.c;
    trs.push(Math.max(bar.h - bar.l, Math.abs(bar.h - prev), Math.abs(bar.l - prev)));
  }
  if (trs.length < period) {
    const sum = trs.reduce((acc, value) => acc + value, 0);
    return sum / Math.max(trs.length, 1);
  }
  let value = 0;
  for (let i = 0; i < period; i++) value += trs[i] ?? 0;
  value /= period;
  for (let i = period; i < trs.length; i++) value = (value * (period - 1) + (trs[i] ?? 0)) / period;
  return value;
}

function pivots(candles: SpotCandle[], side: "high" | "low", wing: number): { i: number; p: number }[] {
  const out: { i: number; p: number }[] = [];
  for (let i = wing; i < candles.length - wing; i++) {
    const price = side === "high" ? candles[i]!.h : candles[i]!.l;
    let ok = true;
    for (let j = i - wing; j <= i + wing; j++) {
      if (j === i) continue;
      const other = side === "high" ? candles[j]!.h : candles[j]!.l;
      if (side === "high" ? other >= price : other <= price) {
        ok = false;
        break;
      }
    }
    if (ok) out.push({ i, p: price });
  }
  return out;
}

function cluster(
  points: { i: number; p: number }[],
  tolerance: number,
): { price: number; touches: number }[] {
  const sorted = [...points].sort((a, b) => a.p - b.p);
  const groups: { sum: number; touches: number; price: number }[] = [];
  for (const point of sorted) {
    const last = groups[groups.length - 1];
    if (last && Math.abs(point.p - last.price) <= tolerance) {
      last.sum += point.p;
      last.touches += 1;
      last.price = last.sum / last.touches;
    } else {
      groups.push({ sum: point.p, touches: 1, price: point.p });
    }
  }
  return groups;
}
