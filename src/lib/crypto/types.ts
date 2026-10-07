export type FactorKey =
  | "rs"
  | "trend"
  | "entry"
  | "liquidity"
  | "risk"
  | "tokenomics"
  | "narrative";

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

export type Accrual =
  | "store-of-value"
  | "burn"
  | "staking"
  | "real-yield"
  | "governance"
  | "none";

export type WeeklyStructure = "bull" | "bear" | "range";

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
  pct30d: number | null;
  rs24h: number;
  rs7d: number;
  rs14d: number | null;
  rs30d: number | null;
  rsi14: number | null;
  volatility30d: number | null;
  maxDrawdown30d: number | null;
  distFrom30dHighPct: number | null;
  aboveSma: boolean | null;
  aboveEma200: boolean | null;
  weeklyStructure: WeeklyStructure | null;
  obvRising: boolean | null;
  hasBtcPair: boolean;
  hasKlines: boolean;
  klineDays: number;
  pairSeries: PairPoint[];
  turnover: number;
  circulatingSupply: number | null;
  maxSupply: number | null;
  mcFdv: number | null;
  narrativeTags: string[];
  narrativeTagsFa: string[];
  accrual: Accrual;
  accrualNote: string;
  score: number;
  factors: FactorScore[];
};

export type Regime = "btc" | "alt" | "neutral";
export type Confidence = "high" | "medium" | "low";
export type DominanceBias = "rising" | "falling" | "resistance" | "neutral";

export type CheckItem = {
  key: string;
  label: string;
  desired: string;
  ok: boolean | null;
  detail: string;
};

export type SleeveLeg = {
  symbol: string;
  name: string;
  rank: number;
  weight: number;
  score: number;
  reason: string;
};

export type Sleeve = {
  key: "core" | "large" | "mid";
  title: string;
  targetPct: number;
  note: string;
  legs: SleeveLeg[];
};

export type AnalysisResult = {
  generatedAt: string;
  sources: string[];
  btcDominance: number;
  btcPriceUsd: number;
  btcPct7d: number;
  btcPct30d: number | null;
  regime: Regime;
  regimeNote: string;
  dominanceBias: DominanceBias;
  dominanceNote: string;
  universeSize: number;
  scannedCount: number;
  klinesOk: number;
  klinesTried: number;
  pick: CoinRow;
  runnerUp: CoinRow | null;
  top: CoinRow[];
  reasons: string[];
  caution: string[];
  confidence: Confidence;
  confidenceNote: string;
  checklist: CheckItem[];
  portfolio: Sleeve[];
};

export type CoinDraft = Omit<CoinRow, "score" | "factors"> & {
  pairCloses: number[];
  usdCloses: number[];
  usdVolumes: number[];
};
