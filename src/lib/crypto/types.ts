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

export type KillSwitchStatus = "NORMAL" | "HIGH_RISK" | "SUSPENDED";

export type BuySignal = "open" | "reduced" | "suspended";

export type BtcKillSwitch = {
  status: KillSwitchStatus;
  active: boolean;
  aboveEma200: boolean | null;
  ema200: number | null;
  priceUsd: number;
  distanceToEma: number | null;
  weeklyStructure: WeeklyStructure | null;
  weeklyMomentum: number | null;
  severeWeekly: boolean;
  weeklySupportBroken: boolean;
  sizeMultiplier: number;
  spotBuys: BuySignal;
  headline: string;
  note: string;
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
  pairWeekly: WeeklyStructure | null;
  pairSupportBroken: boolean;
  unlockPenalty: number;
  highDilution: boolean;
  unlockPct30d: number | null;
  unlockDate: string | null;
  unlockDays: number | null;
  unlockCliff: boolean;
  buySignal: BuySignal;
  sizeMultiplier: number;
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
  killSwitch: BtcKillSwitch;
  spotBuys: BuySignal;
  unlockSource: "coinmarketcap" | "unavailable";
  unlockMatched: number;
  pick: CoinRow;
  runnerUp: CoinRow | null;
  top: CoinRow[];
  reasons: string[];
  caution: string[];
  confidence: Confidence;
  confidenceNote: string;
  checklist: CheckItem[];
  portfolio: Sleeve[];
  books: BookCheck[];
  dataCache: DataCache;
  cacheRows: number;
  cacheKlines: number;
};

export type CoinDraft = Omit<
  CoinRow,
  | "score"
  | "factors"
  | "unlockPenalty"
  | "highDilution"
  | "unlockPct30d"
  | "unlockDate"
  | "unlockDays"
  | "unlockCliff"
  | "buySignal"
  | "sizeMultiplier"
> & {
  pairCloses: number[];
  usdCloses: number[];
  usdVolumes: number[];
};

export type RawUnlockEvent = {
  time: string;
  amount: number;
  allocationName: string;
};

export type UnlockAssessment = {
  penalty: number;
  highDilution: boolean;
  pct30d: number | null;
  nextDate: string | null;
  nextDays: number | null;
  cliff: boolean;
  note: string;
};

export type BookGate = "pass" | "thin" | "crowded" | "levered" | "unknown";

export type BookCheck = {
  symbol: string;
  notionalUsd: number;
  slippageBps: number | null;
  depthUsd: number | null;
  filledPct: number | null;
  funding8h: number | null;
  fundingAnnual: number | null;
  openInterestUsd: number | null;
  oiChange24h: number | null;
  longShortRatio: number | null;
  smallCap: boolean;
  gate: BookGate;
  note: string;
};

export type DataCache = "live" | "memory" | "stored";

export type DeskAction = "HOLD" | "SELL" | "REBALANCE";

export type HoldingInput = {
  symbol: string;
  entryUsd: number;
  sizeUsd: number;
};

export type PositionAdvice = {
  symbol: string;
  name: string;
  score: number | null;
  priceUsd: number | null;
  pnlPct: number | null;
  action: DeskAction;
  reason: string;
  targetSymbol: string | null;
  targetName: string | null;
  suggestedSizeUsd: number;
  pairSupportBroken: boolean;
  pairWeekly: WeeklyStructure | null;
  highDilution: boolean;
};

export type RebalanceDestination = {
  symbol: string;
  name: string;
  score: number;
  usd: number;
  reason: string;
};

export type RebalancePlan = {
  rows: PositionAdvice[];
  destinations: RebalanceDestination[];
  rotateUsd: number;
  holdUsd: number;
  sellUsd: number;
  note: string;
};
