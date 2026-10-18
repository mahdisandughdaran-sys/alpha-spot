/**
 * The Bitcoin desk analyses the top one hundred spot coins with one engine.
 * SPOT_ASSETS is the offline fallback when the live market-cap list is down.
 * A live pass can replace this order; every row stays on a Binance USDT pair.
 */
import { candidateBases, isNonSpotCandidate } from "./exclusions.ts";

export type SpotAsset = {
  id: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  pair: string;
  enabled: boolean;
};

export type RankSeed = {
  symbol: string;
  name: string;
  rank: number;
};

export type PickedSpot = SpotAsset & {
  marketRank: number | null;
};

export const TOP_SPOT = 100;

const NAME_FA: Record<string, string> = {
  BTC: "بیت‌کوین",
  ETH: "اتریوم",
  BNB: "بی‌ان‌بی",
  XRP: "ریپل",
  SOL: "سولانا",
  TRX: "ترون",
  ZEC: "زی‌کش",
  HYPE: "هایپرلیکویید",
  GRAM: "گرام",
  DOGE: "دوج‌کوین",
  XMR: "مونرو",
  LINK: "چین‌لینک",
  ADA: "کاردانو",
  XLM: "استلار",
  NEAR: "نیر",
  BCH: "بیت‌کوین کش",
  LTC: "لایت‌کوین",
  AVAX: "آوالانچ",
  SUI: "سویی",
  TON: "تون",
  DOT: "پولکادات",
  UNI: "یونی‌سواپ",
  AAVE: "آوه",
  TAO: "بیت‌تنسر",
  SHIB: "شیبا",
  PEPE: "پپه",
  APT: "آپتوس",
  ATOM: "کاسموس",
  FIL: "فایل‌کوین",
  ICP: "اینترنت کامپیوتر",
  OP: "آپتیمیسم",
  ARB: "آربیتروم",
  INJ: "اینجکتیو",
  TIA: "سلستیا",
  SEI: "سِی",
  RENDER: "رندر",
  FET: "فچ",
  ONDO: "اوندو",
  WLD: "ورلدکوین",
  ENA: "اتنا",
  S: "سونیک",
  POL: "پالیگان",
  ETC: "اتریوم کلاسیک",
  HBAR: "هدرا",
  STX: "استکس",
  IMX: "ایمیوتبل",
  GRT: "گراف",
  JUP: "ژوپیتر",
  BONK: "بانک",
  WIF: "داگ‌ویف‌هت",
  LDO: "لیدو",
  QNT: "کوانت",
  RUNE: "تورچین",
  VET: "وی‌چین",
  ALGO: "الگورند",
  KAS: "کاسپا",
  CRO: "کرونوس",
  OKB: "اوکی‌بی",
  MNT: "منتل",
  LEO: "لئو",
  DASH: "دش",
  MKR: "میکر",
  SKY: "اسکای",
  PENDLE: "پندل",
  JTO: "جیتو",
  PYTH: "پایت",
  PENGU: "پنگو",
  FLOKI: "فلوکی",
  AR: "آرویو",
  CRV: "کرو",
  ENS: "اتریوم نیم‌سرویس",
  STRK: "استارک‌نت",
  CAKE: "پنکیک‌سواپ",
  DYDX: "دی‌وای‌دی‌ایکس",
  VIRTUAL: "ویرچوال",
  AERO: "آئرودروم",
  KAIA: "کایا",
  BGB: "بیت‌گت",
  PI: "پای نتورک",
  MORPHO: "مورفو",
  XDC: "اکس‌دی‌سی",
  ASTER: "آستر",
  SAND: "سندباکس",
  MANA: "دیسنترالند",
  AXS: "اکسی اینفینیتی",
  GALA: "گالا",
  APE: "ایپ‌کوین",
  CHZ: "چیلیز",
  THETA: "تتا",
  EGLD: "مولتی‌ورس‌ایکس",
  FLOW: "فلو",
  XTZ: "تزوس",
  NEO: "نئو",
  COMP: "کامپاند",
  SNX: "سینتتیکس",
  SUSHI: "سوشی‌سواپ",
  "1INCH": "وان‌اینچ",
  BAT: "بت",
  ZRX: "زیرو اکس",
  YFI: "یرن فایننس",
  MINA: "مینا",
  KAVA: "کاوا",
  CFX: "کانفلاکس",
  GMX: "جی‌ام‌اکس",
  BLUR: "بلر",
  RPL: "راکت‌پول",
  WOO: "وو",
  GMT: "استپن",
  MASK: "مسک نتورک",
  API3: "ای‌پی‌آی۳",
  SKL: "اسکل",
  JASMY: "جاسمی",
  NOT: "نات‌کوین",
  TWT: "تراست ولت",
};

const extraNames = new Map<string, { nameFa: string; nameEn: string }>();

export function spotNameFa(symbol: string, fallback?: string): string {
  return NAME_FA[symbol.toUpperCase()] ?? extraNames.get(symbol.toLowerCase())?.nameFa ?? fallback ?? symbol.toUpperCase();
}

export function rememberSpotNames(assets: Pick<SpotAsset, "id" | "nameFa" | "nameEn">[]): void {
  for (const asset of assets) {
    extraNames.set(asset.id, { nameFa: asset.nameFa, nameEn: asset.nameEn });
  }
}

function row(symbol: string, nameEn: string): SpotAsset {
  return {
    id: symbol.toLowerCase(),
    symbol,
    nameFa: spotNameFa(symbol, nameEn),
    nameEn,
    pair: `${symbol}USDT`,
    enabled: true,
  };
}

/** Liquid Binance USDT names used when the live cap list does not arrive. Order starts with a recent non-stable top twenty, then the next liquid names. */
export const SPOT_ASSETS: SpotAsset[] = [
  row("BTC", "Bitcoin"),
  row("ETH", "Ethereum"),
  row("BNB", "BNB"),
  row("XRP", "XRP"),
  row("SOL", "Solana"),
  row("TRX", "TRON"),
  row("ZEC", "Zcash"),
  row("HYPE", "Hyperliquid"),
  row("DOGE", "Dogecoin"),
  row("XMR", "Monero"),
  row("LINK", "Chainlink"),
  row("ADA", "Cardano"),
  row("XLM", "Stellar"),
  row("NEAR", "NEAR Protocol"),
  row("BCH", "Bitcoin Cash"),
  row("LTC", "Litecoin"),
  row("AVAX", "Avalanche"),
  row("SUI", "Sui"),
  row("TON", "Toncoin"),
  row("DOT", "Polkadot"),
  row("UNI", "Uniswap"),
  row("AAVE", "Aave"),
  row("TAO", "Bittensor"),
  row("SHIB", "Shiba Inu"),
  row("PEPE", "Pepe"),
  row("APT", "Aptos"),
  row("ATOM", "Cosmos"),
  row("FIL", "Filecoin"),
  row("ICP", "Internet Computer"),
  row("OP", "Optimism"),
  row("ARB", "Arbitrum"),
  row("INJ", "Injective"),
  row("TIA", "Celestia"),
  row("SEI", "Sei"),
  row("RENDER", "Render"),
  row("FET", "Artificial Superintelligence"),
  row("ONDO", "Ondo"),
  row("WLD", "Worldcoin"),
  row("ENA", "Ethena"),
  row("S", "Sonic"),
  row("POL", "Polygon"),
  row("ETC", "Ethereum Classic"),
  row("HBAR", "Hedera"),
  row("STX", "Stacks"),
  row("IMX", "Immutable"),
  row("GRT", "The Graph"),
  row("JUP", "Jupiter"),
  row("BONK", "Bonk"),
  row("WIF", "dogwifhat"),
  row("LDO", "Lido"),
  row("QNT", "Quant"),
  row("RUNE", "THORChain"),
  row("VET", "VeChain"),
  row("ALGO", "Algorand"),
  row("DASH", "Dash"),
  row("MKR", "Maker"),
  row("PENDLE", "Pendle"),
  row("JTO", "Jito"),
  row("PYTH", "Pyth Network"),
  row("FLOKI", "FLOKI"),
  row("AR", "Arweave"),
  row("CRV", "Curve"),
  row("ENS", "Ethereum Name Service"),
  row("STRK", "Starknet"),
  row("CAKE", "PancakeSwap"),
  row("DYDX", "dYdX"),
  row("VIRTUAL", "Virtuals Protocol"),
  row("MORPHO", "Morpho"),
  row("SAND", "The Sandbox"),
  row("MANA", "Decentraland"),
  row("AXS", "Axie Infinity"),
  row("GALA", "Gala"),
  row("APE", "ApeCoin"),
  row("CHZ", "Chiliz"),
  row("THETA", "Theta Network"),
  row("EGLD", "MultiversX"),
  row("FLOW", "Flow"),
  row("XTZ", "Tezos"),
  row("NEO", "Neo"),
  row("COMP", "Compound"),
  row("SNX", "Synthetix"),
  row("SUSHI", "SushiSwap"),
  row("1INCH", "1inch"),
  row("BAT", "Basic Attention Token"),
  row("ZRX", "0x"),
  row("YFI", "yearn.finance"),
  row("MINA", "Mina"),
  row("KAVA", "Kava"),
  row("CFX", "Conflux"),
  row("GMX", "GMX"),
  row("BLUR", "Blur"),
  row("RPL", "Rocket Pool"),
  row("WOO", "WOO"),
  row("GMT", "STEPN"),
  row("MASK", "Mask Network"),
  row("API3", "API3"),
  row("SKL", "SKALE"),
  row("JASMY", "JasmyCoin"),
  row("NOT", "Notcoin"),
  row("TWT", "Trust Wallet Token"),
];

export function getSpotAsset(id: string): SpotAsset | null {
  const key = id.trim().toLowerCase();
  return SPOT_ASSETS.find((asset) => asset.id === key) ?? null;
}

export function resolveSpotAsset(id: string): SpotAsset | null {
  const known = getSpotAsset(id);
  if (known) return known.enabled ? known : null;
  const remembered = extraNames.get(id.trim().toLowerCase());
  const symbol = id.trim().toUpperCase();
  if (!/^[A-Z0-9]{1,15}$/.test(symbol)) return null;
  if (isNonSpotCandidate(symbol, remembered?.nameEn ?? symbol)) return null;
  return {
    id: symbol.toLowerCase(),
    symbol,
    nameFa: remembered?.nameFa ?? spotNameFa(symbol),
    nameEn: remembered?.nameEn ?? symbol,
    pair: `${symbol}USDT`,
    enabled: true,
  };
}

/** First `limit` non-stable names that actually trade as a Binance USDT pair, in market-cap order. */
export function pickTopSpot(ranked: RankSeed[], usdtBases: Set<string> | null, limit = TOP_SPOT): PickedSpot[] {
  const listed = usdtBases && usdtBases.size > 0 ? usdtBases : null;
  const sorted = [...ranked].filter((item) => item.rank > 0 && item.symbol).sort((a, b) => a.rank - b.rank);
  const out: PickedSpot[] = [];
  const seen = new Set<string>();

  const push = (asset: SpotAsset, marketRank: number | null) => {
    if (seen.has(asset.symbol) || !asset.enabled) return;
    if (listed && !listed.has(asset.symbol)) return;
    seen.add(asset.symbol);
    out.push({ ...asset, marketRank });
  };

  for (const item of sorted) {
    const symbol = item.symbol.toUpperCase();
    const name = item.name || symbol;
    if (isNonSpotCandidate(symbol, name)) continue;
    const base = candidateBases(symbol, listed ?? undefined).find((candidate) => (listed ? listed.has(candidate) : true));
    if (!base) continue;
    push(
      {
        id: base.toLowerCase(),
        symbol: base,
        nameFa: spotNameFa(base, name),
        nameEn: name,
        pair: `${base}USDT`,
        enabled: true,
      },
      item.rank,
    );
    if (out.length >= limit) return out;
  }

  for (const asset of SPOT_ASSETS) {
    push(asset, null);
    if (out.length >= limit) break;
  }
  return out;
}
