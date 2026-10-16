/**
 * Spot desks share one page and one plan engine.
 * To add a coin later: copy a row and set enabled: true.
 * The pair must be a Binance USDT symbol. No new route is required.
 */
export type SpotAsset = {
  id: string;
  symbol: string;
  nameFa: string;
  nameEn: string;
  pair: string;
  enabled: boolean;
};

export const SPOT_ASSETS: SpotAsset[] = [
  {
    id: "btc",
    symbol: "BTC",
    nameFa: "بیت‌کوین",
    nameEn: "Bitcoin",
    pair: "BTCUSDT",
    enabled: true,
  },
  {
    id: "eth",
    symbol: "ETH",
    nameFa: "اتریوم",
    nameEn: "Ethereum",
    pair: "ETHUSDT",
    enabled: false,
  },
  {
    id: "sol",
    symbol: "SOL",
    nameFa: "سولانا",
    nameEn: "Solana",
    pair: "SOLUSDT",
    enabled: false,
  },
  {
    id: "bnb",
    symbol: "BNB",
    nameFa: "بی‌ان‌بی",
    nameEn: "BNB",
    pair: "BNBUSDT",
    enabled: false,
  },
  {
    id: "xrp",
    symbol: "XRP",
    nameFa: "ریپل",
    nameEn: "XRP",
    pair: "XRPUSDT",
    enabled: false,
  },
  {
    id: "ton",
    symbol: "TON",
    nameFa: "تون",
    nameEn: "Toncoin",
    pair: "TONUSDT",
    enabled: false,
  },
];

export function getSpotAsset(id: string): SpotAsset | null {
  const key = id.trim().toLowerCase();
  return SPOT_ASSETS.find((asset) => asset.id === key) ?? null;
}
