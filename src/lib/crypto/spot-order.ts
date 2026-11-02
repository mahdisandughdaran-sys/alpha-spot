import type { BookGate } from "./types.ts";
import type { MachineTicket, SessionQuality } from "./machine.ts";

/** Base tier, not the user's volume discount. Nobitex IRT 0.25% / USDT taker 0.13%. Wallex IRT 0.35% / USDT taker 0.20%. */
export const IRAN_VENUES = {
  nobitex: {
    id: "nobitex" as const,
    labelFa: "نوبیتکس",
    labelEn: "Nobitex",
    irtTaker: 0.0025,
    usdtTaker: 0.0013,
    minToman: 50_000,
  },
  wallex: {
    id: "wallex" as const,
    labelFa: "والکس",
    labelEn: "Wallex",
    irtTaker: 0.0035,
    usdtTaker: 0.002,
    minToman: 100_000,
  },
};

export type IranVenue = keyof typeof IRAN_VENUES;

/** Names that usually have a toman pair. If the venue does not list it, use the two-leg path. */
const DIRECT_IRT = new Set([
  "BTC",
  "ETH",
  "SOL",
  "XRP",
  "DOGE",
  "TON",
  "TRX",
  "BNB",
  "ADA",
  "SHIB",
  "AVAX",
  "DOT",
  "LINK",
  "LTC",
  "BCH",
  "NEAR",
  "SUI",
  "UNI",
  "AAVE",
  "XLM",
  "FIL",
  "APT",
  "ATOM",
]);

const ASSUMED_SLIP_BPS = 8;
const MARKET_SLIP_BPS = 12;
const MIN_USDT_LEG = 5;
/** One third off at the target. The rest is a stop, not a second target. */
export const TARGET_FRACTION = 1 / 3;

export type SpotStance = "buy" | "wait" | "dont";

export type IranLeg = {
  legs: 1 | 2;
  tomanIn: number;
  usdtAfter: number;
  coinQty: number;
  feeToman: number;
  belowMin: boolean;
};

export type IranPath = {
  venue: IranVenue;
  minToman: number;
  two: IranLeg;
  one: IranLeg | null;
  directListed: boolean;
  noteFa: string;
  noteEn: string;
};

export type FillRead = {
  ticker: number;
  limit: number;
  slippageBps: number;
  slippageAssumed: boolean;
  marketOk: boolean;
  marketFill: number;
  noteFa: string;
  noteEn: string;
};

export type ExitPlan = {
  takeQty: number;
  takePrice: number;
  restQty: number;
  stopPrice: number;
  noteFa: string;
  noteEn: string;
};

export type SpotOrder = {
  stance: SpotStance;
  headlineFa: string;
  headlineEn: string;
  whyFa: string;
  whyEn: string;
  symbol: string;
  name: string;
  limitPrice: number | null;
  qty: number;
  notionalUsd: number;
  fullNotionalUsd: number;
  invalidation: number | null;
  target: number | null;
  path: IranPath | null;
  fill: FillRead | null;
  exit: ExitPlan | null;
};

export function isIranVenue(value: string): value is IranVenue {
  return value === "nobitex" || value === "wallex";
}

export function planIranPath(
  venue: IranVenue,
  symbol: string,
  notionalUsd: number,
  limit: number,
  tomanPerUsdt: number,
): IranPath | null {
  const spec = IRAN_VENUES[venue];
  if (!(notionalUsd > 0) || !(limit > 0) || !(tomanPerUsdt > 0)) return null;
  const tomanIn = notionalUsd * tomanPerUsdt;
  const two = leg(tomanIn, tomanPerUsdt, limit, spec.irtTaker, spec.usdtTaker, spec.minToman);
  const directListed = DIRECT_IRT.has(symbol);
  const one = directListed ? leg(tomanIn, tomanPerUsdt, limit, spec.irtTaker, 0, spec.minToman) : null;
  const noteFa = directListed
    ? `${spec.labelFa}: اگر جفت تومان دارد یک معامله با کارمزد پله پایه ${(spec.irtTaker * 100).toFixed(2)}٪. اگر ندارد، تومان به تتر و بعد تتر به سکه.`
    : `${spec.labelFa}: این نماد در جفت‌های تومانی رایج نیست. اول تومان به تتر (${(spec.irtTaker * 100).toFixed(2)}٪)، بعد تتر به سکه (${(spec.usdtTaker * 100).toFixed(2)}٪). پلهٔ پایه است، نه تخفیف حجم تو.`;
  const noteEn = directListed
    ? `${spec.labelEn}: one toman trade at the base fee of ${(spec.irtTaker * 100).toFixed(2)}% if the pair exists. Otherwise toman to tether, then tether to the coin.`
    : `${spec.labelEn}: not in the common toman pairs. Toman to tether (${(spec.irtTaker * 100).toFixed(2)}%), then tether to the coin (${(spec.usdtTaker * 100).toFixed(2)}%). Base tier, not your volume discount.`;
  return { venue, minToman: spec.minToman, two, one, directListed, noteFa, noteEn };
}

function leg(
  tomanIn: number,
  tomanPerUsdt: number,
  limit: number,
  irtFee: number,
  usdtFee: number,
  minToman: number,
): IranLeg {
  const afterIrt = tomanIn * (1 - irtFee);
  const usdtAfterIrt = afterIrt / tomanPerUsdt;
  const usdtAfter = usdtAfterIrt * (1 - usdtFee);
  const coinQty = usdtAfter / limit;
  const feeToman = tomanIn - usdtAfter * tomanPerUsdt;
  const belowMin = tomanIn < minToman || (usdtFee > 0 && usdtAfter < MIN_USDT_LEG);
  return {
    legs: usdtFee > 0 ? 2 : 1,
    tomanIn,
    usdtAfter,
    coinQty,
    feeToman,
    belowMin,
  };
}

export function buildSpotOrder(input: {
  ticket: MachineTicket;
  slippageBps: number | null;
  bookGate: BookGate | null;
  capitalConfirmed: boolean;
  tomanPerUsdt: number | null;
  venue: IranVenue;
}): SpotOrder {
  const ticket = input.ticket;
  const rung = ticket.rungs.find((row) => row.key === "mid") ?? ticket.rungs[0] ?? null;
  const base = {
    symbol: ticket.symbol,
    name: ticket.name,
    limitPrice: rung?.price ?? null,
    qty: rung?.qty ?? 0,
    notionalUsd: rung?.notionalUsd ?? 0,
    fullNotionalUsd: ticket.notionalUsd,
    invalidation: ticket.rungs.length ? ticket.invalidation : null,
    target: ticket.rungs.length ? ticket.target : null,
    path: null as IranPath | null,
    fill: null as FillRead | null,
    exit: null as ExitPlan | null,
  };

  if (ticket.stance === "flat" || ticket.symbol === "USDT") {
    return {
      ...base,
      stance: "dont",
      headlineFa: "نخر",
      headlineEn: "Do not buy",
      whyFa: ticket.orderFa,
      whyEn: ticket.orderEn,
    };
  }

  if (!rung || !(rung.price > 0) || !(rung.qty > 0)) {
    return {
      ...base,
      stance: "dont",
      headlineFa: "نخر",
      headlineEn: "Do not buy",
      whyFa: "اندازهٔ سفارش صفر است. یا نقد نیست، یا فاصله تا ابطال برای یک خرید اسپات کافی نیست.",
      whyEn: "The order size is zero. Either there is no cash, or the distance to invalidation is too tight for a spot buy.",
    };
  }

  const path =
    input.tomanPerUsdt != null
      ? planIranPath(input.venue, ticket.symbol, rung.notionalUsd, rung.price, input.tomanPerUsdt)
      : null;
  const use = path?.one && !path.one.belowMin ? path.one : path?.two ?? null;
  const qty = use && use.coinQty > 0 ? use.coinQty : rung.qty;
  const fill = readFill(ticket, rung.price, input.slippageBps, input.bookGate, path);
  const exit = exitPlan(qty, ticket.target, ticket.invalidation);

  let stance: SpotStance = ticket.stance === "buy" ? "buy" : "wait";
  let whyFa = ticket.orderFa;
  let whyEn = ticket.orderEn;

  if (!input.capitalConfirmed) {
    stance = "wait";
    whyFa = "نقد واقعی نوشته نشده. ده هزار دلار پیش‌فرض سفارش نیست.";
    whyEn = "Real cash is not entered. The old ten-thousand-dollar default is not an order.";
  } else if (use?.belowMin) {
    stance = "wait";
    whyFa = `بعد از کارمزد پله پایه، مبلغ به حداقل ${IRAN_VENUES[input.venue].labelFa} نمی‌رسد.`;
    whyEn = `After the base-tier fee, the amount is under the ${IRAN_VENUES[input.venue].labelEn} minimum.`;
  } else if (stance === "buy") {
    whyFa = fill?.marketOk
      ? `${ticket.symbol} را لیمیت بنویس. مارکت هم از نظر اسپرد ممکن است، ولی لازم نیست.`
      : `${ticket.symbol} را فقط لیمیت بنویس. مارکت نزن.`;
    whyEn = fill?.marketOk
      ? `Write a limit for ${ticket.symbol}. A market order is possible on spread, but it is not required.`
      : `Write only a limit for ${ticket.symbol}. Do not send a market order.`;
  }

  const headline =
    stance === "buy"
      ? ["بخر", "Buy"]
      : stance === "wait"
        ? ["صبر کن", "Wait"]
        : ["نخر", "Do not buy"];

  return {
    ...base,
    stance,
    headlineFa: headline[0]!,
    headlineEn: headline[1]!,
    whyFa,
    whyEn,
    qty,
    path,
    fill,
    exit,
  };
}

function readFill(
  ticket: MachineTicket,
  limit: number,
  slippageBps: number | null,
  bookGate: BookGate | null,
  path: IranPath | null,
): FillRead {
  const assumed = slippageBps == null || !Number.isFinite(slippageBps);
  const slip = assumed ? ASSUMED_SLIP_BPS : Math.max(0, slippageBps);
  const fee = path?.one && !path.one.belowMin ? IRAN_VENUES[path.venue].irtTaker : path ? IRAN_VENUES[path.venue].usdtTaker : 0.0013;
  const marketFill = (ticket.livePrice * (1 + slip / 10_000)) / (1 - fee);
  const thinSession = sessionIsThin(ticket.session.quality);
  const thinBook = bookGate === "thin";
  const marketOk = !assumed && slip <= MARKET_SLIP_BPS && !thinBook && !thinSession;
  let noteFa: string;
  let noteEn: string;
  if (assumed) {
    noteFa = "اسپرد این نماد در دفتر نیامد. ۸ نقطه پایه فرض شد. مارکت نزن.";
    noteEn = "This name had no book spread. Eight basis points were assumed. Do not send a market order.";
  } else if (thinBook) {
    noteFa = `دفتر نازک است و لغزش حدود ${slip.toFixed(0)} نقطه پایه است. مارکت نزن.`;
    noteEn = `The book is thin and slippage is about ${slip.toFixed(0)} basis points. Do not send a market order.`;
  } else if (thinSession) {
    noteFa = "ساعت نقدینگی نازک است. حتی اگر اسپرد الان کم باشد، مارکت نزن.";
    noteEn = "Liquidity is thin at this hour. Do not send a market order even if the spread looks tight.";
  } else if (!marketOk) {
    noteFa = `لغزش حدود ${slip.toFixed(0)} نقطه پایه است. فقط لیمیت.`;
    noteEn = `Slippage is about ${slip.toFixed(0)} basis points. Limit only.`;
  } else {
    noteFa = `لغزش دفتر حدود ${slip.toFixed(0)} نقطه پایه است. لیمیت بنویس؛ مارکت فقط اگر عجله داری.`;
    noteEn = `Book slippage is about ${slip.toFixed(0)} basis points. Write a limit; market only if you are in a hurry.`;
  }
  return {
    ticker: ticket.livePrice,
    limit,
    slippageBps: slip,
    slippageAssumed: assumed,
    marketOk,
    marketFill,
    noteFa,
    noteEn,
  };
}

function sessionIsThin(quality: SessionQuality): boolean {
  return quality === "thin" || quality === "weekend";
}

export function exitPlan(qty: number, target: number, stop: number): ExitPlan | null {
  if (!(qty > 0) || !(target > 0) || !(stop > 0) || !(target > stop)) return null;
  const takeQty = qty * TARGET_FRACTION;
  const restQty = qty - takeQty;
  return {
    takeQty,
    takePrice: target,
    restQty,
    stopPrice: stop,
    noteFa: "یک‌سوم را در هدف لیمیت بفروش. دو سوم می‌ماند تا ابطال، شکست ساختار هفتگی، یا کلید قطع بیت‌کوین. پلهٔ سود دوم وجود ندارد.",
    noteEn: "Sell one third at the target with a limit. Two thirds stay until invalidation, a weekly structure break, or the Bitcoin kill switch. There is no second profit rung.",
  };
}
