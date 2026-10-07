import type { Accrual } from "./types.ts";

export type AssetMeta = {
  tags: string[];
  tagsFa: string[];
  accrual: Accrual;
  note: string;
};

export const HOT_NARRATIVES = new Set(["AI", "RWA", "DePIN", "L2", "Solana"]);

const META: Record<string, AssetMeta> = {
  BTC: { tags: ["L1"], tagsFa: ["لایه یک", "ذخیره ارزش"], accrual: "store-of-value", note: "سقف عرضه ثابت؛ ذخیره ارزش شبکه." },
  ETH: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "burn", note: "سوزاندن کارمزد و استیکینگ؛ ارزش واقعی برای هولدر." },
  SOL: { tags: ["L1", "Solana"], tagsFa: ["لایه یک", "سولانا"], accrual: "staking", note: "استیکینگ بومی سولانا." },
  BNB: { tags: ["L1"], tagsFa: ["لایه یک", "صرافی"], accrual: "burn", note: "سوزاندن دوره‌ای عرضه." },
  XRP: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "none", note: "توکن شبکه پرداخت؛ ارزش‌افزایی مستقیم ضعیف." },
  ADA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ بدون قفل اجباری." },
  DOGE: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "عرضه تورمی و بدون ارزش‌افزایی پروتکل." },
  TRX: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ و کارمزد شبکه." },
  TON: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ تون." },
  AVAX: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ آوالانچ." },
  LINK: { tags: ["oracle", "RWA"], tagsFa: ["اوراکل", "RWA"], accrual: "staking", note: "استیکینگ چین‌لینک و روایت RWA." },
  SUI: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ سویی." },
  SHIB: { tags: ["meme"], tagsFa: ["میم"], accrual: "burn", note: "سوزاندن داوطلبانه؛ کاربرد مالی ضعیف." },
  DOT: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ پولکادات." },
  BCH: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "store-of-value", note: "فورک بیت‌کوین؛ سقف عرضه مشخص." },
  NEAR: { tags: ["L1", "AI"], tagsFa: ["لایه یک", "هوش مصنوعی"], accrual: "staking", note: "استیکینگ و روایت AI." },
  LEO: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "burn", note: "توکن صرافی با سوزاندن." },
  LTC: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "store-of-value", note: "سقف عرضه مشخص." },
  DAI: { tags: ["stable"], tagsFa: ["استیبل"], accrual: "none", note: "استیبل‌کوین." },
  UNI: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: "عمدتاً حاکمیتی؛ تقسیم کارمزد محدود." },
  PEPE: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم‌کوین بدون ارزش‌افزایی." },
  ICP: { tags: ["L1", "AI"], tagsFa: ["لایه یک", "هوش مصنوعی"], accrual: "burn", note: "سوزاندن چرخه‌ها." },
  TAO: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "staking", note: "استیکینگ ساب‌نت‌های AI." },
  APT: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ آپتوس." },
  POL: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "staking", note: "استیکینگ پالیگان." },
  MATIC: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "staking", note: "استیکینگ پالیگان." },
  ETC: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: "کاربرد مالی محدود." },
  XLM: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "none", note: "شبکه پرداخت." },
  HBAR: { tags: ["L1", "RWA", "enterprise"], tagsFa: ["لایه یک", "RWA"], accrual: "staking", note: "روایت سازمانی و RWA." },
  OKB: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "burn", note: "توکن صرافی." },
  CRO: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "none", note: "توکن اکوسیستم صرافی." },
  FIL: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: "پاداش ذخیره‌سازی غیرمتمرکز." },
  ATOM: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ کاسموس." },
  RENDER: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "burn", note: "کارمزد رندر و سوزاندن." },
  RNDR: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "burn", note: "کارمزد رندر و سوزاندن." },
  FET: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: "روایت AI و استیکینگ." },
  ASI: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: "اتحاد هوش مصنوعی." },
  ARB: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: "حاکمیت آربیتروم." },
  OP: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: "حاکمیت آپتیمیسم." },
  IMX: { tags: ["L2", "gaming"], tagsFa: ["لایه دو", "گیمینگ"], accrual: "burn", note: "سوزاندن کارمزد." },
  INJ: { tags: ["L1", "defi"], tagsFa: ["لایه یک", "دیفای"], accrual: "burn", note: "سوزاندن حراجی." },
  STX: { tags: ["L2", "BTC"], tagsFa: ["لایه دو", "بیت‌کوین"], accrual: "staking", note: "Stacking روی بیت‌کوین." },
  TIA: { tags: ["modular", "L1"], tagsFa: ["ماژولار"], accrual: "staking", note: "استیکینگ سلستیا." },
  SEI: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ سِی." },
  S: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ سونیک." },
  WLD: { tags: ["AI"], tagsFa: ["هوش مصنوعی", "هویت"], accrual: "none", note: "توکن هویت؛ تورم عرضه بالا." },
  ONDO: { tags: ["RWA"], tagsFa: ["RWA"], accrual: "real-yield", note: "بازده دارایی واقعی." },
  AAVE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "کارمزد پروتکل و استیکینگ ایمنی." },
  MKR: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "سوزاندن/بازخرید از درآمد." },
  SKY: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "بازخرید از درآمد پروتکل." },
  ENA: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "درآمد استیبل‌کوین ترکیبی." },
  PENDLE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "کارمزد معاملات بازده." },
  JUP: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "burn", note: "بازخرید از کارمزد." },
  JTO: { tags: ["Solana", "DePIN"], tagsFa: ["سولانا", "DePIN"], accrual: "staking", note: "استیکینگ جیتو." },
  PYTH: { tags: ["oracle", "Solana"], tagsFa: ["اوراکل", "سولانا"], accrual: "staking", note: "استیکینگ داده قیمت." },
  WIF: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "none", note: "میم سولانا." },
  BONK: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "burn", note: "میم با سوزاندن محدود." },
  PENGU: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم‌کوین." },
  FLOKI: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم‌کوین." },
  GRT: { tags: ["AI", "data"], tagsFa: ["داده", "هوش مصنوعی"], accrual: "staking", note: "استیکینگ ایندکس." },
  AR: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "none", note: "ذخیره دائمی؛ ارزش‌افزایی غیرمستقیم." },
  HNT: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: "پاداش پوشش بی‌سیم." },
  AKT: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: "بازار محاسبات ابری." },
  RUNE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: "سوزاندن در استخرها." },
  CRV: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "کارمزد استخر برای لاک‌کنندگان." },
  LDO: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: "حاکمیت لیدو." },
  ENS: { tags: ["identity"], tagsFa: ["هویت"], accrual: "real-yield", note: "درآمد ثبت دامنه." },
  QNT: { tags: ["enterprise"], tagsFa: ["سازمانی"], accrual: "none", note: "لایسنس سازمانی." },
  ALGO: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "پاداش مشارکت." },
  VET: { tags: ["enterprise"], tagsFa: ["سازمانی"], accrual: "none", note: "توکن گاز جدا دارد." },
  EOS: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ منابع." },
  XMR: { tags: ["privacy"], tagsFa: ["حریم خصوصی"], accrual: "none", note: "پول خصوصی؛ بدون ارزش‌افزایی قراردادی." },
  KAS: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: "PoW؛ بدون مکانیزم بازخرید." },
  FTM: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ فانتوم." },
  SAND: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "none", note: "گیمینگ؛ تورم عرضه." },
  MANA: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "burn", note: "سوزاندن زمین." },
  AXS: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "staking", note: "استیکینگ بازی." },
  GALA: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "none", note: "گیمینگ تورمی." },
  APE: { tags: ["gaming", "nft"], tagsFa: ["گیمینگ"], accrual: "staking", note: "استیکینگ اکوسیستم." },
  STRK: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: "حاکمیت استارک‌نت." },
  ZK: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: "حاکمیت zkSync." },
  TUSD: { tags: ["stable"], tagsFa: ["استیبل"], accrual: "none", note: "استیبل." },
  CAKE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: "سوزاندن کارمزد." },
  COMP: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: "حاکمیت کامپاند." },
  SNX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "کارمزد معاملات برای استیکرها." },
  DYDX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "کارمزد معاملات." },
  GMX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: "تقسیم کارمزد." },
  VIRTUAL: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "none", note: "روایت ایجنت AI." },
  KAITO: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "none", note: "روایت AI." },
  W: { tags: ["Solana"], tagsFa: ["سولانا"], accrual: "none", note: "توکن بریج ورم‌هول." },
  JASMY: { tags: ["data"], tagsFa: ["داده"], accrual: "none", note: "داده شخصی." },
  IOTA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: "لجر بدون کارمزد." },
  HYPE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: "سوزاندن از کارمزد پرپ." },
  BERA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "استیکینگ برچین." },
  TRUMP: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم سیاسی." },
  MELANIA: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم سیاسی." },
  SPX: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم." },
  MOG: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: "میم." },
  POPCAT: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "none", note: "میم سولانا." },
  GOAT: { tags: ["meme", "AI"], tagsFa: ["میم", "هوش مصنوعی"], accrual: "none", note: "میم AI." },
  TAO2: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: "AI." },
  OM: { tags: ["RWA"], tagsFa: ["RWA"], accrual: "staking", note: "روایت RWA." },
  MOVE: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: "لایه یک موفمنت." },
  SSV: { tags: ["staking"], tagsFa: ["استیکینگ"], accrual: "staking", note: "زیرساخت استیکینگ." },
  EIGEN: { tags: ["restaking"], tagsFa: ["ری‌استیک"], accrual: "staking", note: "ری‌استیکینگ." },
  ETHFI: { tags: ["restaking"], tagsFa: ["ری‌استیک"], accrual: "real-yield", note: "درآمد ری‌استیک." },
  RAY: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "burn", note: "کارمزد دکس سولانا." },
  ORCA: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "real-yield", note: "کارمزد دکس." },
  WETH: { tags: ["wrapped"], tagsFa: ["رپد"], accrual: "none", note: "رپد." },
};

const ACCRUAL_FIX: Record<string, Accrual> = {
  JUP: "burn",
};

export function lookupMeta(symbol: string): AssetMeta {
  const key = symbol.toUpperCase();
  const found = META[key];
  if (found) {
    const accrual = ACCRUAL_FIX[key] ?? found.accrual;
    return { ...found, accrual };
  }
  return {
    tags: [],
    tagsFa: [],
    accrual: "none",
    note: "در کاتالوگ روایت نبود؛ امتیاز خنثی.",
  };
}

export function isHot(tags: string[]): boolean {
  return tags.some((t) => HOT_NARRATIVES.has(t));
}

export function mcFdvRatio(
  circulating: number | null,
  maxSupply: number | null,
  price: number,
  marketCap: number,
): number | null {
  if (maxSupply && maxSupply > 0 && price > 0) {
    const fdv = price * maxSupply;
    if (fdv > 0 && marketCap > 0) return marketCap / fdv;
    if (circulating && circulating > 0) return circulating / maxSupply;
  }
  return null;
}
