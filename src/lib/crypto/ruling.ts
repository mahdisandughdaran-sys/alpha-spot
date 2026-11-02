import { splitBi } from "@/lib/i18n/lex";
import type { MachineTicket } from "./machine.ts";
import type { SpotPlan, SpotWindow } from "./spot-plan.ts";
import type { AnalysisResult, HorizonCall, VerdictKind } from "./types.ts";

export type RulingSide = "buy" | "pass";

export type RulingLine = {
  fa: string;
  en?: string;
};

export type Ruling = {
  side: RulingSide;
  subjectFa: string;
  subjectEn: string;
  whyBuy: RulingLine[];
  whyPass: RulingLine[];
};

function asLine(value: string): RulingLine {
  const parts = splitBi(value);
  return parts.en ? { fa: parts.fa, en: parts.en } : { fa: parts.fa };
}

function pushUnique(bucket: RulingLine[], line: RulingLine, cap: number) {
  if (bucket.length >= cap) return;
  if (!line.fa.trim()) return;
  if (bucket.some((row) => row.fa === line.fa)) return;
  bucket.push(line);
}

/** One vocabulary for every desk: buy, or do not buy. */
export function kindStamp(kind: VerdictKind): { side: RulingSide; fa: string; en: string } {
  if (kind === "buy") return { side: "buy", fa: "بخر · آلت", en: "Buy · the alt" };
  if (kind === "stay") return { side: "buy", fa: "بخر · بیت‌کوین", en: "Buy · Bitcoin" };
  if (kind === "wait") return { side: "buy", fa: "بخر · فقط بیت‌کوین", en: "Buy · Bitcoin only" };
  return { side: "pass", fa: "نخر · هیچ ارزی", en: "Do not buy · no coin" };
}

function deskSide(result: AnalysisResult): RulingSide {
  const plan = result.plan;
  if (plan) {
    if (plan.phase === "crash" || plan.phase === "defend" || plan.stance === "cash") return "pass";
    return "buy";
  }
  return result.verdict.kind === "cash" ? "pass" : "buy";
}

function deskSubject(result: AnalysisResult, side: RulingSide): { fa: string; en: string } {
  const plan = result.plan;
  const verdict = result.verdict;
  if (side === "buy" && plan?.stance === "alt" && plan.names.length > 0) {
    return {
      fa: plan.names.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}٪`).join(" · "),
      en: plan.names.map((row) => `${row.symbol} ${Math.round(row.weight * 100)}%`).join(" · "),
    };
  }
  if (side === "buy") {
    const waiting = verdict.kind === "wait" && verdict.symbol && verdict.symbol !== "BTC" ? verdict.symbol : null;
    if (waiting) {
      return {
        fa: `فقط بیت‌کوین · ${waiting} را هنوز نخر`,
        en: `Bitcoin only · do not buy ${waiting} yet`,
      };
    }
    return { fa: "بیت‌کوین", en: "Bitcoin" };
  }
  if (plan?.phase === "defend") {
    return {
      fa: "آلت نخر · بیشترِ پول نقد می‌ماند",
      en: "Do not buy an alt · most of the money stays in cash",
    };
  }
  return { fa: "هیچ ارزی", en: "No coin" };
}

/**
 * The desk's single call. Cash and a damaged Bitcoin trend are "do not buy".
 * A healthy book is "buy", and the subject says whether that buy is Bitcoin or an alt.
 */
export function buildDeskRuling(result: AnalysisResult): Ruling {
  const side = deskSide(result);
  const subject = deskSubject(result, side);
  const whyBuy: RulingLine[] = [];
  const whyPass: RulingLine[] = [];
  const reason = asLine(result.verdict.reason);
  pushUnique(side === "buy" ? whyBuy : whyPass, reason, 3);

  if (result.plan?.flip) {
    pushUnique(side === "buy" ? whyPass : whyBuy, asLine(result.plan.flip), 3);
  }

  if (result.killSwitch.spotBuys !== "open") {
    pushUnique(whyPass, asLine(result.killSwitch.note || result.killSwitch.headline), 3);
  }

  for (const item of result.reasons) pushUnique(whyBuy, asLine(item), 3);
  for (const item of result.caution) pushUnique(whyPass, asLine(item), 3);

  if (whyBuy.length === 0) {
    pushUnique(
      whyBuy,
      {
        fa: "بخر فقط وقتی روند بیت‌کوین سالم است و، اگر آلت است، همان نام هم ساختار سالم دارد و هم داخل ناحیه ورود است.",
        en: "Buy only when Bitcoin’s trend is healthy and, for an alt, that name also has a healthy structure and trades inside its entry zone.",
      },
      3,
    );
  }
  if (whyPass.length === 0) {
    pushUnique(
      whyPass,
      {
        fa: "نخر اگر قیمت از حد ابطال رد شود، یا اگر فقط به‌خاطر یک کندل سبز وارد می‌شوی.",
        en: "Do not buy if price crosses invalidation, or if you are entering only because of one green candle.",
      },
      3,
    );
  }

  return { side, ...subject, whyBuy, whyPass };
}

export function buildCallRuling(call: HorizonCall): Ruling {
  const side: RulingSide = call.kind === "cash" ? "pass" : "buy";
  const waiting = call.kind === "wait" && call.symbol && call.symbol !== "BTC" ? call.symbol : null;
  const subject =
    call.kind === "buy" && call.symbol
      ? { fa: `${call.symbol}${call.name ? ` · ${call.name}` : ""}`, en: `${call.symbol}${call.name ? ` · ${call.name}` : ""}` }
      : call.kind === "cash"
        ? { fa: "هیچ ارزی", en: "No coin" }
        : waiting
          ? { fa: `فقط بیت‌کوین · ${waiting} را هنوز نخر`, en: `Bitcoin only · do not buy ${waiting} yet` }
          : { fa: "بیت‌کوین", en: "Bitcoin" };

  const whyBuy: RulingLine[] = [];
  const whyPass: RulingLine[] = [];
  const reason = asLine(call.reason);
  pushUnique(side === "buy" ? whyBuy : whyPass, reason, 3);
  if (call.dissent) pushUnique(side === "buy" ? whyPass : whyBuy, asLine(call.dissent), 3);

  if (whyBuy.length === 0) {
    pushUnique(
      whyBuy,
      {
        fa: "بخر وقتی همین افق یک نام با ساختار سالم و نقطه ورود بدهد. تا آن وقت این ستون برنده نیست.",
        en: "Buy when this same horizon names a coin with a healthy structure and an entry. Until then this column does not win.",
      },
      3,
    );
  }
  if (whyPass.length === 0) {
    pushUnique(
      whyPass,
      waiting
        ? {
            fa: `${waiting} را نخر تا داخل محدوده بیاید. لمس قیمت به‌تنهایی تأیید نیست.`,
            en: `Do not buy ${waiting} until it trades inside the zone. Touching the price is not confirmation.`,
          }
        : {
            fa: "نخر اگر قیمت از حد ابطال رد شود، یا اگر این افق هنوز به پایان نرسیده و نوار لحظه‌ای چیز دیگری می‌گوید.",
            en: "Do not buy if price crosses invalidation, or if this horizon has not expired and the live tape says something else.",
          },
      3,
    );
  }

  return { side, subjectFa: subject.fa, subjectEn: subject.en, whyBuy, whyPass };
}

function windowLines(plan: SpotPlan, window: SpotWindow): { buy: RulingLine; pass: RulingLine } {
  const hot = plan.rsi != null && plan.rsi >= 68;
  if (window.action === "buy") {
    const buy: RulingLine =
      window.horizon === "month"
        ? {
            fa: "بخر برای یک ماه: روند روزانه و هفتگی هر دو صعودی است، قیمت در ناحیه است و اعتماد مدل پایین نیست. تا سی روز عوض نمی‌شود، مگر قیمت از حد پایین رد شود.",
            en: "Buy for a month: daily and weekly trends are both up, price is in the zone, and confidence is not low. It holds for thirty days unless price crosses the lower level.",
          }
        : window.horizon === "week"
          ? {
              fa: "بخر برای یک هفته: قیمت در ناحیه است، روند روزانه نزولی نیست، RSI داغ نیست و ساختار هفتگی خراب نیست. ماه می‌تواند هنوز بسته باشد.",
              en: "Buy for a week: price is in the zone, the daily trend is not down, RSI is not hot, and weekly structure is intact. The month can still be closed.",
            }
          : {
              fa: "بخر فقط برای یک روز: قیمت در ناحیه است و روند روزانه و RSI مانع نیستند. فردا این حرف می‌تواند عوض شود.",
              en: "Buy for one day only: price is in the zone, and the daily trend and RSI are not blocking it. Tomorrow this can change.",
            };
    return {
      buy,
      pass: {
        fa: "نخر اگر قیمت از حد پایین رد شود یا بالاتر از سقف ناحیه دنبالش بروی. یک کندل سبز دلیل خرید نیست.",
        en: "Do not buy if price crosses the lower level, or if you chase above the top of the zone. One green candle is not a reason.",
      },
    };
  }

  let pass: RulingLine;
  if (plan.action === "exit") {
    pass = {
      fa: "نخر. قیمت از حد پایین رد شده. ورود تازه بسته است و اگر این ارز را داری باید خارج شوی.",
      en: "Do not buy. Price crossed the lower level. A new entry is closed, and if you hold this coin you should be out.",
    };
  } else if (plan.action !== "buy") {
    pass = {
      fa: "نخر. قیمت داخل ناحیه خرید نیست. ارزان‌تر شدن به‌تنهایی دستور خرید نمی‌سازد.",
      en: "Do not buy. Price is not inside the buy zone. A lower price by itself is not an order.",
    };
  } else if (plan.regime === "bear") {
    pass = {
      fa: "نخر. روند روزانه نزولی است. حتی داخل ناحیه، این افق خرید اسپات را باز نمی‌کند.",
      en: "Do not buy. The daily trend is down. Even inside the zone, this horizon does not open a spot buy.",
    };
  } else if (hot && plan.rsi != null) {
    pass = {
      fa: `نخر. RSI حدود ${Math.round(plan.rsi)} است. این افق خرید هیجانی سقف را قبول نمی‌کند.`,
      en: `Do not buy. RSI is about ${Math.round(plan.rsi)}. This horizon does not chase a hot reading.`,
    };
  } else if (window.horizon !== "day" && plan.weekly === "bear") {
    pass = {
      fa: "نخر برای این افق. ساختار هفتگی نزولی است. روز می‌تواند باز باشد و هفته و ماه بسته بمانند.",
      en: "Do not buy for this horizon. Weekly structure is bearish. The day can be open while the week and month stay shut.",
    };
  } else if (window.horizon === "month" && plan.regime !== "bull") {
    pass = {
      fa: "نخر برای یک ماه. روند روزانه هنوز صعودی کامل نیست. ماه فقط وقتی هر دو روند صعودی باشند باز می‌شود.",
      en: "Do not buy for a month. The daily trend is not a full uptrend. The month opens only when both trends are up.",
    };
  } else if (window.horizon === "month" && plan.weekly !== "bull") {
    pass = {
      fa: "نخر برای یک ماه. ساختار هفتگی صعودی نیست. هفته می‌تواند باز باشد و ماه بسته بماند.",
      en: "Do not buy for a month. Weekly structure is not bullish. The week can be open while the month stays shut.",
    };
  } else if (window.horizon === "month" && plan.confidence === "low") {
    pass = {
      fa: "نخر برای یک ماه. اعتماد مدل پایین است و برای قفل کردن سی روز کافی نیست.",
      en: "Do not buy for a month. Model confidence is low, which is not enough to lock thirty days.",
    };
  } else {
    pass = {
      fa: "نخر. شرط این افق کامل نشده است.",
      en: "Do not buy. This horizon’s conditions are not all met.",
    };
  }

  return {
    buy: {
      fa: "بخر این افق را فقط اگر قیمت داخل ناحیه بماند، روند روزانه نزولی نباشد، RSI داغ نباشد و برای هفته و ماه ساختار هفتگی هم سالم باشد.",
      en: "Buy this horizon only if price stays in the zone, the daily trend is not down, RSI is not hot, and — for the week and month — weekly structure is healthy too.",
    },
    pass,
  };
}

export function rulingFromWindow(plan: SpotPlan, window: SpotWindow): Ruling {
  const lines = windowLines(plan, window);
  const buying = window.action === "buy";
  return {
    side: buying ? "buy" : "pass",
    subjectFa: `${plan.symbol} · ${window.titleFa}`,
    subjectEn: `${plan.symbol} · ${window.titleEn}`,
    whyBuy: [lines.buy],
    whyPass: [lines.pass],
  };
}

export function rulingFromPlan(plan: SpotPlan): Ruling {
  const open = plan.windows.filter((window) => window.action === "buy");
  const shut = plan.windows.filter((window) => window.action !== "buy");
  const buying = open.length > 0;
  const whyBuy: RulingLine[] = [];
  const whyPass: RulingLine[] = [];
  for (const window of open.length ? open : plan.windows.slice(0, 1)) {
    pushUnique(whyBuy, windowLines(plan, window).buy, 3);
  }
  for (const window of shut.length ? shut : plan.windows.slice(0, 1)) {
    pushUnique(whyPass, windowLines(plan, window).pass, 3);
  }
  const subjectFa = buying
    ? `${plan.nameFa} · ${open.map((window) => window.titleFa).join("، ")}`
    : plan.action === "exit"
      ? `${plan.nameFa} · اگر داری بفروش`
      : plan.nameFa;
  const subjectEn = buying
    ? `${plan.nameEn} · ${open.map((window) => window.titleEn).join(", ")}`
    : plan.action === "exit"
      ? `${plan.nameEn} · sell if you hold it`
      : plan.nameEn;
  return {
    side: buying ? "buy" : "pass",
    subjectFa,
    subjectEn,
    whyBuy,
    whyPass,
  };
}

export function rulingFromTicket(ticket: MachineTicket): Ruling {
  const buying = ticket.stance === "buy";
  const order = { fa: ticket.orderFa, en: ticket.orderEn };
  const whyBuy: RulingLine[] = [];
  const whyPass: RulingLine[] = [];
  if (buying) pushUnique(whyBuy, order, 3);
  else pushUnique(whyPass, order, 3);
  if (ticket.asideFa) {
    pushUnique(buying ? whyPass : whyBuy, { fa: ticket.asideFa, en: ticket.asideEn ?? undefined }, 3);
  }
  if (ticket.session.quality === "thin" || ticket.session.quality === "weekend") {
    pushUnique(whyPass, { fa: ticket.session.adviceFa, en: ticket.session.adviceEn }, 3);
  }
  if (whyBuy.length === 0) {
    pushUnique(
      whyBuy,
      ticket.stance === "park"
        ? {
            fa: "بخر فقط با لیمیت داخل ناحیه، وقتی قیمت به همان پله‌ها برسد. تا آن وقت بازار نخر.",
            en: "Buy only with a limit inside the zone, once price reaches those rungs. Do not buy the market before that.",
          }
        : {
            fa: "بخر وقتی مانع برداشته شود و قیمت دوباره بالای ابطال و داخل ناحیه باشد.",
            en: "Buy when the block is gone and price is back above invalidation and inside the zone.",
          },
      3,
    );
  }
  if (whyPass.length === 0) {
    pushUnique(
      whyPass,
      {
        fa: "نخر با سفارش بازار. اگر قیمت به ابطال برسد، همان پله‌ای که پر شده بسته می‌شود.",
        en: "Do not buy with a market order. If price tags invalidation, the filled rung closes.",
      },
      3,
    );
  }
  const subjectFa = ticket.symbol === "USDT" ? "هیچ ارزی" : `${ticket.symbol} · ${ticket.name}`;
  const subjectEn = ticket.symbol === "USDT" ? "No coin" : `${ticket.symbol} · ${ticket.name}`;
  return { side: buying ? "buy" : "pass", subjectFa, subjectEn, whyBuy, whyPass };
}

export function rulingFromRotation(input: {
  sleeve: "alt" | "btc" | "cash";
  symbol: string;
  name: string;
  reason: string;
}): Ruling {
  const reason = asLine(input.reason);
  if (input.sleeve === "alt") {
    return {
      side: "buy",
      subjectFa: `${input.symbol} · آلت پیشرو`,
      subjectEn: `${input.symbol} · leading alt`,
      whyBuy: [
        reason,
        {
          fa: "بخر چون بیت‌کوین در این پنجره بالا است و دست‌کم دو آلت نقد مشخصاً از آن جلوترند. وزن روی پیشرو است، نه روی همه آلت‌ها.",
          en: "Buy because Bitcoin is up in this window and at least two liquid alts are clearly ahead of it. Weight sits on the leader, not on every alt.",
        },
      ],
      whyPass: [
        {
          fa: "نخر اگر آن آلت‌ها دیگر از بیت‌کوین جلو نباشند، یا اگر خود بیت‌کوین در این پنجره منفی شود. آن وقت قانون به بیت‌کوین یا تتر برمی‌گردد.",
          en: "Do not buy if those alts are no longer ahead of Bitcoin, or if Bitcoin itself is down in this window. The rule then goes back to Bitcoin or tether.",
        },
      ],
    };
  }
  if (input.sleeve === "btc") {
    return {
      side: "buy",
      subjectFa: "بیت‌کوین",
      subjectEn: "Bitcoin",
      whyBuy: [reason],
      whyPass: [
        {
          fa: "آلت نخر تا وقتی دست‌کم دو آلت نقد، پنج واحد درصد از بیت‌کوین جلو نیفتاده‌اند.",
          en: "Do not buy an alt until at least two liquid alts lead Bitcoin by five percentage points.",
        },
        {
          fa: "هیچ ارزی نخر اگر بیت‌کوین در همین پنجره رشد نکند. آن وقت قانون، تتر است.",
          en: "Do not buy any coin if Bitcoin is not rising in this same window. The rule is then tether.",
        },
      ],
    };
  }
  return {
    side: "pass",
    subjectFa: "هیچ ارزی · تتر",
    subjectEn: "No coin · tether",
    whyPass: [reason],
    whyBuy: [
      {
        fa: "بخر بیت‌کوین را فقط اگر همین پنجره دوباره مثبت شود و آلت‌ها هنوز از آن جلو نیفتاده باشند.",
        en: "Buy Bitcoin only if this same window turns positive again and alts are not yet ahead of it.",
      },
    ],
  };
}

export function rulingFromConfluence(input: {
  symbol: string;
  decision: "BUY" | "WAIT" | "AVOID";
  reasons: string[];
  alert: string;
}): Ruling {
  const buying = input.decision === "BUY";
  const whyBuy: RulingLine[] = [];
  const whyPass: RulingLine[] = [];
  const alert = asLine(input.alert);
  for (const reason of input.reasons) pushUnique(buying ? whyBuy : whyPass, asLine(reason), 3);
  pushUnique(whyPass, alert, 3);
  if (!buying) {
    pushUnique(
      whyBuy,
      input.decision === "WAIT"
        ? {
            fa: `بخر ${input.symbol} را فقط با لیمیت، اگر جریان خریدار بماند و قیمت از دیوار لانگ فاصله بگیرد. بازار نخر.`,
            en: `Buy ${input.symbol} only with a limit, if taker flow stays bid and price is clear of the long wall. Do not buy the market.`,
          }
        : {
            fa: `بخر ${input.symbol} را فقط اگر جریان از پامپ توخالی یا دیوار لانگ خارج شود. تا آن وقت حجم خرید صفر است.`,
            en: `Buy ${input.symbol} only after flow leaves a hollow pump or the long wall. Until then the allowed size is zero.`,
          },
      3,
    );
  } else if (whyPass.length < 2) {
    pushUnique(
      whyPass,
      {
        fa: "نخر اگر قیمت وارد دیوار لانگ شود یا جریان به پامپ توخالی بچرخد. آن وقت همین نماد از خرید خارج می‌شود.",
        en: "Do not buy if price steps into the long wall or flow turns into a hollow pump. That same symbol then leaves the buy.",
      },
      3,
    );
  }
  if (whyBuy.length === 0) {
    pushUnique(
      whyBuy,
      {
        fa: "بخر فقط وقتی خریدار تیکر و نقشه لیکوییدیشن یک چیز را بگویند.",
        en: "Buy only when taker flow and the liquidation map say the same thing.",
      },
      3,
    );
  }
  return {
    side: buying ? "buy" : "pass",
    subjectFa: input.symbol,
    subjectEn: input.symbol,
    whyBuy,
    whyPass,
  };
}

export function rulingsAgree(a: Ruling, b: Ruling): boolean {
  return a.side === b.side;
}
