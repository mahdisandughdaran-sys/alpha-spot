const STABLES = new Set([
  "USDT",
  "USDC",
  "DAI",
  "FDUSD",
  "USDE",
  "TUSD",
  "USDP",
  "PYUSD",
  "BUSD",
  "USDS",
  "USD1",
  "USDD",
  "FRAX",
  "GUSD",
  "LUSD",
  "RLUSD",
  "EURC",
  "EURT",
  "AEUR",
  "USDG",
  "USDF",
  "USD0",
  "GHO",
  "CRVUSD",
  "GUSD",
  "SUSD",
  "USDBC",
  "USDC.E",
  "SUSDS",
  "SUSDE",
  "SYRUPUSDC",
]);

const PEGGED = new Set([
  "WBTC",
  "WETH",
  "STETH",
  "WSTETH",
  "WEETH",
  "WBETH",
  "CBETH",
  "RETH",
  "CBBTC",
  "TBTC",
  "LBTC",
  "LSETH",
  "RSETH",
  "METH",
  "WBNB",
  "WBT",
  "JITOSOL",
  "JUPSOL",
  "MSOL",
  "BNSOL",
  "KHYPE",
]);

const NAME_HINTS = [
  "wrapped",
  "staked",
  "liquid stak",
  "bridged",
  "pegged",
  "usd coin",
  "trueusd",
  "tether",
];

export function isNonSpotCandidate(symbol: string, name: string): boolean {
  const sym = symbol.toUpperCase();
  if (STABLES.has(sym) || PEGGED.has(sym)) return true;
  if (sym.startsWith("USD") || sym.endsWith("USD")) return true;
  const lower = name.toLowerCase();
  return NAME_HINTS.some((h) => lower.includes(h));
}

export const BINANCE_SYMBOL: Record<string, string> = {
  IOTA: "IOTA",
  MIOTA: "IOTA",
  RENDER: "RENDER",
  RNDR: "RENDER",
  POL: "POL",
  MATIC: "POL",
  TON: "TON",
  FET: "FET",
  UNI: "UNI",
  HYPE: "HYPE",
};
