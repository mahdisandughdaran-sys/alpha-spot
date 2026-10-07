export type FactorKey = "rs" | "trend" | "entry" | "liquidity" | "risk";

export type FactorScore = {
  key: FactorKey;
  label: string;
  score: number;
  weight: number;
  note: string;
};

export type PairPoint = {
  t: number;
  v: number;
};

export type CoinRow = {
  id: string;
  symbol: string;
  name: string;
  rank: number;
  priceUsd: number;
  priceBtc: number;
  marketCap: number;
  volume24h: number;
  volumeChange24h: number;
  beta: number | null;
  athDrawdownPct: number | null;
  pct1h: number;
  pct6h: number;
  pct12h: number;
  pct24h: number;
  pct7d: number;
  rs24h: number;
  rs7d: number;
  rs14d: number | null;
  rs30d: number | null;
  rsi14: number | null;
  volatility30d: number | null;
  maxDrawdown30d: number | null;
  distFrom30dHighPct: number | null;
  aboveSma: boolean | null;
  hasBtcPair: boolean;
  hasKlines: boolean;
  pairSeries: PairPoint[];
  turnover: number;
  score: number;
  factors: FactorScore[];
};

export type Regime = "btc" | "alt" | "neutral";
export type Confidence = "high" | "medium" | "low";

export type AnalysisResult = {
  generatedAt: string;
  sources: string[];
  btcDominance: number;
  btcPriceUsd: number;
  btcPct7d: number;
  regime: Regime;
  regimeNote: string;
  universeSize: number;
  scannedCount: number;
  pick: CoinRow;
  runnerUp: CoinRow | null;
  top: CoinRow[];
  reasons: string[];
  caution: string[];
  confidence: Confidence;
  confidenceNote: string;
};
