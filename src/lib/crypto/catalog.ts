import { msg } from "@/lib/i18n/lex";
import type { Accrual } from "./types.ts";

export type AssetMeta = {
  tags: string[];
  tagsFa: string[];
  accrual: Accrual;
  note: string;
};

export const HOT_NARRATIVES = new Set(["AI", "RWA", "DePIN", "L2", "Solana"]);

const META: Record<string, AssetMeta> = {
  BTC: { tags: ["L1"], tagsFa: ["لایه یک", "ذخیره ارزش"], accrual: "store-of-value", note: msg("سقف عرضه ثابت؛ ذخیره ارزش شبکه.", "Fixed supply cap; the network's store of value.") },
  ETH: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "burn", note: msg("سوزاندن کارمزد و استیکینگ؛ ارزش واقعی برای هولدر.", "Fee burns and staking; real value for the holder.") },
  SOL: { tags: ["L1", "Solana"], tagsFa: ["لایه یک", "سولانا"], accrual: "staking", note: msg("استیکینگ بومی سولانا.", "Native Solana staking.") },
  BNB: { tags: ["L1"], tagsFa: ["لایه یک", "صرافی"], accrual: "burn", note: msg("سوزاندن دوره‌ای عرضه.", "Periodic supply burns.") },
  XRP: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "none", note: msg("توکن شبکه پرداخت؛ ارزش‌افزایی مستقیم ضعیف.", "Payments-network token; weak direct value accrual.") },
  ADA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ بدون قفل اجباری.", "Staking with no forced lockup.") },
  DOGE: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("عرضه تورمی و بدون ارزش‌افزایی پروتکل.", "Inflationary supply and no protocol value accrual.") },
  TRX: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ و کارمزد شبکه.", "Staking and network fees.") },
  TON: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ تون.", "TON staking.") },
  AVAX: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ آوالانچ.", "Avalanche staking.") },
  LINK: { tags: ["oracle", "RWA"], tagsFa: ["اوراکل", "RWA"], accrual: "staking", note: msg("استیکینگ چین‌لینک و روایت RWA.", "Chainlink staking and the RWA narrative.") },
  SUI: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ سویی.", "Sui staking.") },
  SHIB: { tags: ["meme"], tagsFa: ["میم"], accrual: "burn", note: msg("سوزاندن داوطلبانه؛ کاربرد مالی ضعیف.", "Voluntary burns; weak financial use.") },
  DOT: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ پولکادات.", "Polkadot staking.") },
  BCH: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "store-of-value", note: msg("فورک بیت‌کوین؛ سقف عرضه مشخص.", "Bitcoin fork; a defined supply cap.") },
  NEAR: { tags: ["L1", "AI"], tagsFa: ["لایه یک", "هوش مصنوعی"], accrual: "staking", note: msg("استیکینگ و روایت AI.", "Staking and the AI narrative.") },
  LEO: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "burn", note: msg("توکن صرافی با سوزاندن.", "Exchange token with a burn.") },
  LTC: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "store-of-value", note: msg("سقف عرضه مشخص.", "Defined supply cap.") },
  DAI: { tags: ["stable"], tagsFa: ["استیبل"], accrual: "none", note: msg("استیبل‌کوین.", "Stablecoin.") },
  UNI: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: msg("عمدتاً حاکمیتی؛ تقسیم کارمزد محدود.", "Mostly governance; limited fee sharing.") },
  PEPE: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم‌کوین بدون ارزش‌افزایی.", "Meme coin with no value accrual.") },
  ICP: { tags: ["L1", "AI"], tagsFa: ["لایه یک", "هوش مصنوعی"], accrual: "burn", note: msg("سوزاندن چرخه‌ها.", "Cycle burns.") },
  TAO: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "staking", note: msg("استیکینگ ساب‌نت‌های AI.", "Staking of AI subnets.") },
  APT: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ آپتوس.", "Aptos staking.") },
  POL: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "staking", note: msg("استیکینگ پالیگان.", "Polygon staking.") },
  MATIC: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "staking", note: msg("استیکینگ پالیگان.", "Polygon staking.") },
  ETC: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: msg("کاربرد مالی محدود.", "Limited financial utility.") },
  XLM: { tags: ["payments"], tagsFa: ["پرداخت"], accrual: "none", note: msg("شبکه پرداخت.", "Payments network.") },
  HBAR: { tags: ["L1", "RWA", "enterprise"], tagsFa: ["لایه یک", "RWA"], accrual: "staking", note: msg("روایت سازمانی و RWA.", "Enterprise and RWA narrative.") },
  OKB: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "burn", note: msg("توکن صرافی.", "Exchange token.") },
  CRO: { tags: ["exchange"], tagsFa: ["صرافی"], accrual: "none", note: msg("توکن اکوسیستم صرافی.", "Exchange-ecosystem token.") },
  FIL: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: msg("پاداش ذخیره‌سازی غیرمتمرکز.", "Decentralized storage rewards.") },
  ATOM: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ کاسموس.", "Cosmos staking.") },
  RENDER: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "burn", note: msg("کارمزد رندر و سوزاندن.", "Render fees and burns.") },
  RNDR: { tags: ["AI", "DePIN"], tagsFa: ["هوش مصنوعی", "DePIN"], accrual: "burn", note: msg("کارمزد رندر و سوزاندن.", "Render fees and burns.") },
  FET: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: msg("روایت AI و استیکینگ.", "AI narrative and staking.") },
  ASI: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: msg("اتحاد هوش مصنوعی.", "Artificial-intelligence alliance.") },
  ARB: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: msg("حاکمیت آربیتروم.", "Arbitrum governance.") },
  OP: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: msg("حاکمیت آپتیمیسم.", "Optimism governance.") },
  IMX: { tags: ["L2", "gaming"], tagsFa: ["لایه دو", "گیمینگ"], accrual: "burn", note: msg("سوزاندن کارمزد.", "Fee burn.") },
  INJ: { tags: ["L1", "defi"], tagsFa: ["لایه یک", "دیفای"], accrual: "burn", note: msg("سوزاندن حراجی.", "Auction burn.") },
  STX: { tags: ["L2", "BTC"], tagsFa: ["لایه دو", "بیت‌کوین"], accrual: "staking", note: msg("Stacking روی بیت‌کوین.", "Stacking on Bitcoin.") },
  TIA: { tags: ["modular", "L1"], tagsFa: ["ماژولار"], accrual: "staking", note: msg("استیکینگ سلستیا.", "Celestia staking.") },
  SEI: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ سِی.", "Sei staking.") },
  S: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ سونیک.", "Sonic staking.") },
  WLD: { tags: ["AI"], tagsFa: ["هوش مصنوعی", "هویت"], accrual: "none", note: msg("توکن هویت؛ تورم عرضه بالا.", "Identity token; high supply inflation.") },
  ONDO: { tags: ["RWA"], tagsFa: ["RWA"], accrual: "real-yield", note: msg("بازده دارایی واقعی.", "Real-asset yield.") },
  AAVE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("کارمزد پروتکل و استیکینگ ایمنی.", "Protocol fees and safety-module staking.") },
  MKR: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("سوزاندن/بازخرید از درآمد.", "Burn or buyback from revenue.") },
  SKY: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("بازخرید از درآمد پروتکل.", "Buybacks from protocol revenue.") },
  ENA: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("درآمد استیبل‌کوین ترکیبی.", "Synthetic-stablecoin revenue.") },
  PENDLE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("کارمزد معاملات بازده.", "Yield-trading fees.") },
  JUP: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "burn", note: msg("بازخرید از کارمزد.", "Buybacks funded by fees.") },
  JTO: { tags: ["Solana", "DePIN"], tagsFa: ["سولانا", "DePIN"], accrual: "staking", note: msg("استیکینگ جیتو.", "Jito staking.") },
  PYTH: { tags: ["oracle", "Solana"], tagsFa: ["اوراکل", "سولانا"], accrual: "staking", note: msg("استیکینگ داده قیمت.", "Price-feed staking.") },
  WIF: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "none", note: msg("میم سولانا.", "Solana meme.") },
  BONK: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "burn", note: msg("میم با سوزاندن محدود.", "Meme with limited burns.") },
  PENGU: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم‌کوین.", "Meme coin.") },
  FLOKI: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم‌کوین.", "Meme coin.") },
  GRT: { tags: ["AI", "data"], tagsFa: ["داده", "هوش مصنوعی"], accrual: "staking", note: msg("استیکینگ ایندکس.", "Indexer staking.") },
  AR: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "none", note: msg("ذخیره دائمی؛ ارزش‌افزایی غیرمستقیم.", "Permanent storage; indirect value accrual.") },
  HNT: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: msg("پاداش پوشش بی‌سیم.", "Wireless-coverage rewards.") },
  AKT: { tags: ["DePIN"], tagsFa: ["DePIN"], accrual: "staking", note: msg("بازار محاسبات ابری.", "Cloud-compute market.") },
  RUNE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: msg("سوزاندن در استخرها.", "Burns inside the pools.") },
  CRV: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("کارمزد استخر برای لاک‌کنندگان.", "Pool fees for lockers.") },
  LDO: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: msg("حاکمیت لیدو.", "Lido governance.") },
  ENS: { tags: ["identity"], tagsFa: ["هویت"], accrual: "real-yield", note: msg("درآمد ثبت دامنه.", "Domain-registration revenue.") },
  QNT: { tags: ["enterprise"], tagsFa: ["سازمانی"], accrual: "none", note: msg("لایسنس سازمانی.", "Enterprise license.") },
  ALGO: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("پاداش مشارکت.", "Participation rewards.") },
  VET: { tags: ["enterprise"], tagsFa: ["سازمانی"], accrual: "none", note: msg("توکن گاز جدا دارد.", "It has a separate gas token.") },
  EOS: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ منابع.", "Resource staking.") },
  XMR: { tags: ["privacy"], tagsFa: ["حریم خصوصی"], accrual: "none", note: msg("پول خصوصی؛ بدون ارزش‌افزایی قراردادی.", "Private money; no contractual value accrual.") },
  KAS: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: msg("PoW؛ بدون مکانیزم بازخرید.", "Proof of work; no buyback mechanism.") },
  FTM: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ فانتوم.", "Fantom staking.") },
  SAND: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "none", note: msg("گیمینگ؛ تورم عرضه.", "Gaming; inflationary supply.") },
  MANA: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "burn", note: msg("سوزاندن زمین.", "Land burns.") },
  AXS: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "staking", note: msg("استیکینگ بازی.", "Game staking.") },
  GALA: { tags: ["gaming"], tagsFa: ["گیمینگ"], accrual: "none", note: msg("گیمینگ تورمی.", "Inflationary gaming token.") },
  APE: { tags: ["gaming", "nft"], tagsFa: ["گیمینگ"], accrual: "staking", note: msg("استیکینگ اکوسیستم.", "Ecosystem staking.") },
  STRK: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: msg("حاکمیت استارک‌نت.", "Starknet governance.") },
  ZK: { tags: ["L2"], tagsFa: ["لایه دو"], accrual: "governance", note: msg("حاکمیت zkSync.", "zkSync governance.") },
  TUSD: { tags: ["stable"], tagsFa: ["استیبل"], accrual: "none", note: msg("استیبل.", "Stablecoin.") },
  CAKE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: msg("سوزاندن کارمزد.", "Fee burn.") },
  COMP: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "governance", note: msg("حاکمیت کامپاند.", "Compound governance.") },
  SNX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("کارمزد معاملات برای استیکرها.", "Trading fees for stakers.") },
  DYDX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("کارمزد معاملات.", "Trading fees.") },
  GMX: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "real-yield", note: msg("تقسیم کارمزد.", "Fee share.") },
  VIRTUAL: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "none", note: msg("روایت ایجنت AI.", "AI-agent narrative.") },
  KAITO: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "none", note: msg("روایت AI.", "AI narrative.") },
  W: { tags: ["Solana"], tagsFa: ["سولانا"], accrual: "none", note: msg("توکن بریج ورم‌هول.", "Wormhole bridge token.") },
  JASMY: { tags: ["data"], tagsFa: ["داده"], accrual: "none", note: msg("داده شخصی.", "Personal-data token.") },
  IOTA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "none", note: msg("لجر بدون کارمزد.", "Feeless ledger.") },
  HYPE: { tags: ["defi"], tagsFa: ["دیفای"], accrual: "burn", note: msg("سوزاندن از کارمزد پرپ.", "Burns funded by perp fees.") },
  BERA: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("استیکینگ برچین.", "Berachain staking.") },
  TRUMP: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم سیاسی.", "Political meme.") },
  MELANIA: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم سیاسی.", "Political meme.") },
  SPX: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم.", "Meme.") },
  MOG: { tags: ["meme"], tagsFa: ["میم"], accrual: "none", note: msg("میم.", "Meme.") },
  POPCAT: { tags: ["meme", "Solana"], tagsFa: ["میم", "سولانا"], accrual: "none", note: msg("میم سولانا.", "Solana meme.") },
  GOAT: { tags: ["meme", "AI"], tagsFa: ["میم", "هوش مصنوعی"], accrual: "none", note: msg("میم AI.", "AI meme.") },
  TAO2: { tags: ["AI"], tagsFa: ["هوش مصنوعی"], accrual: "staking", note: msg("AI.", "AI.") },
  OM: { tags: ["RWA"], tagsFa: ["RWA"], accrual: "staking", note: msg("روایت RWA.", "RWA narrative.") },
  MOVE: { tags: ["L1"], tagsFa: ["لایه یک"], accrual: "staking", note: msg("لایه یک موفمنت.", "Movement layer one.") },
  SSV: { tags: ["staking"], tagsFa: ["استیکینگ"], accrual: "staking", note: msg("زیرساخت استیکینگ.", "Staking infrastructure.") },
  EIGEN: { tags: ["restaking"], tagsFa: ["ری‌استیک"], accrual: "staking", note: msg("ری‌استیکینگ.", "Restaking.") },
  ETHFI: { tags: ["restaking"], tagsFa: ["ری‌استیک"], accrual: "real-yield", note: msg("درآمد ری‌استیک.", "Restaking revenue.") },
  RAY: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "burn", note: msg("کارمزد دکس سولانا.", "Solana DEX fees.") },
  ORCA: { tags: ["Solana", "defi"], tagsFa: ["سولانا", "دیفای"], accrual: "real-yield", note: msg("کارمزد دکس.", "DEX fees.") },
  WETH: { tags: ["wrapped"], tagsFa: ["رپد"], accrual: "none", note: msg("رپد.", "Wrapped asset.") },
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
    note: msg("در کاتالوگ روایت نبود؛ امتیاز خنثی.", "Not in the narrative catalog; the score stays neutral."),
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
