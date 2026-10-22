import {
  altSeasonCopy,
  altSeasonIndex,
  bookHeat,
  exchangeNetflow,
  flowBiasOf,
  mvrvZone,
  nuplFromMvrv,
  nuplZone,
  onchainScore,
  returnOver,
  scoreCoin,
  soprProxy,
  whaleThreshold,
  type Candle,
  type CoinMath,
  type FlowBias,
  type HeatBin,
  type Zone,
} from "./intel-math.ts";

const VISION = "https://data-api.binance.vision/api/v3";
const CM = "https://community-api.coinmetrics.io/v4/timeseries/asset-metrics";
const PAPRIKA = "https://api.coinpaprika.com/v1/global";
const FNG = "https://api.alternative.me/fng/?limit=1";
const CHAINS = "https://api.llama.fi/v2/chains";
const GECKO =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=80&page=1&sparkline=false";

const TTL_MS = 90_000;

export type WhalePrint = {
  symbol: string;
  side: "buy" | "sell";
  usd: number;
  price: number;
  time: number;
  kind: "print" | "minute";
};

export type RadarCoin = CoinMath & {
  symbol: string;
  nameFa: string;
  nameEn: string;
  mcFdv: number | null;
  tvlUsd: number | null;
  githubCommits14d: number | null;
  whaleNetUsd: number;
  heat: HeatBin[];
  heatMid: number | null;
};

export type SpotIntel = {
  generatedAt: string;
  sources: string[];
  mvrv: number | null;
  mvrvZone: Zone;
  nupl: number | null;
  nuplZone: Zone;
  flowIn7d: number | null;
  flowOut7d: number | null;
  netflow7d: number | null;
  flowBias: FlowBias;
  soprProxy: number | null;
  soprMeasured: number | null;
  fearGreed: number | null;
  dominance: number | null;
  altSeason: number;
  altSeasonFa: string;
  altSeasonEn: string;
  marketFa: string;
  marketEn: string;
  coins: RadarCoin[];
  whales: WhalePrint[];
  leadSymbol: string;
  leadFa: string;
  leadEn: string;
  partial: string | null;
};

const UNIVERSE: Array<{ symbol: string; nameEn: string; nameFa: string; pair: string; repo: string | null; chain: string | null }> = [
  { symbol: "BTC", nameEn: "Bitcoin", nameFa: "بیت‌کوین", pair: "BTCUSDT", repo: "bitcoin/bitcoin", chain: "Bitcoin" },
  { symbol: "ETH", nameEn: "Ethereum", nameFa: "اتریوم", pair: "ETHUSDT", repo: "ethereum/go-ethereum", chain: "Ethereum" },
  { symbol: "SOL", nameEn: "Solana", nameFa: "سولانا", pair: "SOLUSDT", repo: "anza-xyz/agave", chain: "Solana" },
  { symbol: "BNB", nameEn: "BNB", nameFa: "بی‌ان‌بی", pair: "BNBUSDT", repo: "bnb-chain/bsc", chain: "BSC" },
  { symbol: "XRP", nameEn: "XRP", nameFa: "ریپل", pair: "XRPUSDT", repo: "XRPLF/rippled", chain: null },
  { symbol: "ADA", nameEn: "Cardano", nameFa: "کاردانو", pair: "ADAUSDT", repo: "IntersectMBO/cardano-node", chain: "Cardano" },
  { symbol: "DOGE", nameEn: "Dogecoin", nameFa: "دوج‌کوین", pair: "DOGEUSDT", repo: "dogecoin/dogecoin", chain: "Dogecoin" },
  { symbol: "AVAX", nameEn: "Avalanche", nameFa: "آوالانچ", pair: "AVAXUSDT", repo: "ava-labs/avalanchego", chain: "Avalanche" },
  { symbol: "LINK", nameEn: "Chainlink", nameFa: "چین‌لینک", pair: "LINKUSDT", repo: "smartcontractkit/chainlink", chain: null },
  { symbol: "TON", nameEn: "Toncoin", nameFa: "تون", pair: "TONUSDT", repo: "ton-blockchain/ton", chain: "TON" },
  { symbol: "SUI", nameEn: "Sui", nameFa: "سویی", pair: "SUIUSDT", repo: "MystenLabs/sui", chain: "Sui" },
  { symbol: "NEAR", nameEn: "NEAR", nameFa: "نیر", pair: "NEARUSDT", repo: "near/nearcore", chain: "Near" },
  { symbol: "DOT", nameEn: "Polkadot", nameFa: "پولکادات", pair: "DOTUSDT", repo: "paritytech/polkadot-sdk", chain: "Polkadot" },
  { symbol: "ATOM", nameEn: "Cosmos", nameFa: "کازموس", pair: "ATOMUSDT", repo: "cosmos/gaia", chain: null },
  { symbol: "APT", nameEn: "Aptos", nameFa: "اپتوس", pair: "APTUSDT", repo: "aptos-labs/aptos-core", chain: "Aptos" },
  { symbol: "INJ", nameEn: "Injective", nameFa: "اینجکتیو", pair: "INJUSDT", repo: "InjectiveLabs/injective-core", chain: "Injective" },
];

const WHALE_SYMBOLS = new Set(["BTC", "ETH", "SOL", "BNB", "XRP", "LINK"]);

let memory: { at: number; value: SpotIntel } | null = null;

async function fetchJson<T>(url: string, ms = 12000, headers?: Record<string, string>): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      headers: { Accept: "application/json", "User-Agent": "AlphaSpot/2", ...headers },
    });
    if (!res.ok) throw new Error(String(res.status));
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function pool<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function worker() {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      const item = items[index];
      if (item === undefined) return;
      out[index] = await fn(item);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => worker()));
  return out;
}

type CmRow = {
  time?: string;
  CapMVRVCur?: string;
  FlowInExUSD?: string;
  FlowOutExUSD?: string;
  SOPR?: string;
};

async function loadOnchain(): Promise<{
  mvrv: number | null;
  flowIn7d: number | null;
  flowOut7d: number | null;
  soprMeasured: number | null;
}> {
  const empty = { mvrv: null, flowIn7d: null, flowOut7d: null, soprMeasured: null };
  try {
    const url = `${CM}?assets=btc&metrics=CapMVRVCur,FlowInExUSD,FlowOutExUSD&frequency=1d&page_size=8`;
    const body = await fetchJson<{ data?: CmRow[] }>(url, 14000);
    const rows = body.data ?? [];
    if (!rows.length) return empty;
    const last = rows[rows.length - 1];
    const mvrv = num(last?.CapMVRVCur);
    const week = rows.slice(-7);
    const flowIn7d = sum(week.map((row) => num(row.FlowInExUSD)));
    const flowOut7d = sum(week.map((row) => num(row.FlowOutExUSD)));
    return { mvrv, flowIn7d, flowOut7d, soprMeasured: null };
  } catch {
    return empty;
  }
}

function num(value: string | undefined): number | null {
  if (value == null || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function sum(values: Array<number | null>): number | null {
  const ok = values.filter((v): v is number => v != null);
  if (!ok.length) return null;
  return ok.reduce((a, b) => a + b, 0);
}

async function loadKlines(pair: string): Promise<Candle[]> {
  const rows = await fetchJson<Array<[number, string, string, string, string, string, number, string, number, string]>>(
    `${VISION}/klines?symbol=${pair}&interval=1d&limit=240`,
    12000,
  );
  return rows.map((row) => ({
    t: row[0],
    o: Number(row[1]),
    h: Number(row[2]),
    l: Number(row[3]),
    c: Number(row[4]),
    v: Number(row[5]),
    tb: Number(row[9]),
  }));
}

async function loadDepth(pair: string): Promise<{ bids: Array<[number, number]>; asks: Array<[number, number]> } | null> {
  try {
    const body = await fetchJson<{ bids: Array<[string, string]>; asks: Array<[string, string]> }>(
      `${VISION}/depth?symbol=${pair}&limit=500`,
      10000,
    );
    return {
      bids: body.bids.map(([p, q]) => [Number(p), Number(q)] as [number, number]),
      asks: body.asks.map(([p, q]) => [Number(p), Number(q)] as [number, number]),
    };
  } catch {
    return null;
  }
}

async function loadWhales(symbol: string, pair: string): Promise<{ prints: WhalePrint[]; net: number; gross: number }> {
  const floor = whaleThreshold(symbol);
  const minuteFloor = symbol === "BTC" ? 4_000_000 : symbol === "ETH" ? 1_500_000 : symbol === "SOL" || symbol === "BNB" ? 700_000 : 280_000;
  const [trades, minutes] = await Promise.all([
    fetchJson<Array<{ p: string; q: string; T: number; m: boolean }>>(`${VISION}/aggTrades?symbol=${pair}&limit=1000`, 10000).catch(
      () => [] as Array<{ p: string; q: string; T: number; m: boolean }>,
    ),
    fetchJson<Array<[number, string, string, string, string, string, number, string, number, string, string]>>(
      `${VISION}/klines?symbol=${pair}&interval=1m&limit=180`,
      10000,
    ).catch(() => [] as Array<[number, string, string, string, string, string, number, string, number, string, string]>),
  ]);

  const prints: WhalePrint[] = [];
  for (const row of trades) {
    const price = Number(row.p);
    const qty = Number(row.q);
    const usd = price * qty;
    if (!(usd >= floor)) continue;
    prints.push({ symbol, side: row.m ? "sell" : "buy", usd, price, time: row.T, kind: "print" });
  }
  let net = 0;
  let gross = 0;
  for (const row of minutes) {
    const quote = Number(row[7]);
    const taker = Number(row[10]);
    if (!(quote > 0)) continue;
    net += 2 * taker - quote;
    gross += quote;
    if (quote < minuteFloor) continue;
    const share = taker / quote;
    if (share < 0.58 && share > 0.42) continue;
    prints.push({
      symbol,
      side: share >= 0.58 ? "buy" : "sell",
      usd: quote,
      price: Number(row[4]),
      time: row[0],
      kind: "minute",
    });
  }
  prints.sort((a, b) => b.usd - a.usd);
  return { prints: prints.slice(0, 6), net, gross };
}

type GeckoRow = {
  symbol: string;
  market_cap?: number | null;
  fully_diluted_valuation?: number | null;
};

async function loadFundamentals(): Promise<{
  fdv: Map<string, number>;
  tvl: Map<string, number>;
  github: Map<string, number>;
  dominance: number | null;
  fear: number | null;
}> {
  const fdv = new Map<string, number>();
  const tvl = new Map<string, number>();
  const github = new Map<string, number>();
  const [gecko, chains, global, fear] = await Promise.all([
    fetchJson<GeckoRow[]>(GECKO, 12000).catch(() => [] as GeckoRow[]),
    fetchJson<Array<{ name?: string; tvl?: number }>>(CHAINS, 12000).catch(() => []),
    fetchJson<{ bitcoin_dominance_percentage?: number }>(PAPRIKA, 10000).catch(() => ({}) as { bitcoin_dominance_percentage?: number }),
    fetchJson<{ data?: Array<{ value?: string }> }>(FNG, 8000).catch(() => ({}) as { data?: Array<{ value?: string }> }),
  ]);
  for (const row of gecko) {
    const symbol = row.symbol?.toUpperCase();
    const cap = row.market_cap ?? 0;
    const diluted = row.fully_diluted_valuation ?? 0;
    if (!symbol || !(cap > 0) || !(diluted > 0)) continue;
    fdv.set(symbol, Math.min(1.5, cap / diluted));
  }
  const byName = new Map(chains.map((chain) => [String(chain.name ?? "").toLowerCase(), chain.tvl ?? 0]));
  for (const coin of UNIVERSE) {
    if (!coin.chain) continue;
    const value = byName.get(coin.chain.toLowerCase());
    if (value != null && value > 0) tvl.set(coin.symbol, value);
  }
  const since = new Date(Date.now() - 14 * 86_400_000).toISOString();
  await pool(
    UNIVERSE.filter((coin) => coin.repo && ["BTC", "ETH", "SOL", "AVAX", "SUI", "NEAR", "APT", "LINK"].includes(coin.symbol)),
    4,
    async (coin) => {
      if (!coin.repo) return;
      try {
        const commits = await fetchJson<unknown[]>(
          `https://api.github.com/repos/${coin.repo}/commits?per_page=30&since=${encodeURIComponent(since)}`,
          4500,
          { Accept: "application/vnd.github+json" },
        );
        if (Array.isArray(commits)) github.set(coin.symbol, commits.length);
      } catch {
        /* rate limit or missing repo */
      }
    },
  );
  const fearValue = Number(fear.data?.[0]?.value);
  return {
    fdv,
    tvl,
    github,
    dominance: typeof global.bitcoin_dominance_percentage === "number" ? global.bitcoin_dominance_percentage : null,
    fear: Number.isFinite(fearValue) ? fearValue : null,
  };
}

function marketCopy(input: {
  mvrv: number | null;
  nupl: number | null;
  bias: FlowBias;
  altFa: string;
  altEn: string;
  fear: number | null;
}): { fa: string; en: string } {
  const zone =
    input.mvrv == null
      ? "رژیم آن‌چین بیت‌کوین همین حالا خوانده نشد"
      : input.mvrv < 1
        ? "بیت‌کوین در ناحیه ارزش تاریخی است"
        : input.mvrv < 2
          ? "بیت‌کوین در ناحیه انباشت قابل دفاع است، نه در سقف چرخه"
          : input.mvrv < 3.2
            ? "بیت‌کوین گرم شده؛ خرید اسپات باید پله‌ای و دور از تعقیب باشد"
            : "بیت‌کوین در ناحیه سرخوشی تاریخی است؛ انباشت تازه را کوچک کن";
  const zoneEn =
    input.mvrv == null
      ? "Bitcoin’s on-chain regime did not load"
      : input.mvrv < 1
        ? "Bitcoin is in a historical value zone"
        : input.mvrv < 2
          ? "Bitcoin is in a defensible accumulation zone, not a cycle top"
          : input.mvrv < 3.2
            ? "Bitcoin is warm; spot buys should be staged, not chased"
            : "Bitcoin is in historical euphoria; keep new accumulation small";
  const flow =
    input.bias === "outflow"
      ? "در هفت روز اخیر خروج از صرافی بیشتر از ورود بوده؛ این با نگهداری اسپات جور است."
      : input.bias === "inflow"
        ? "در هفت روز اخیر ورود به صرافی بیشتر بوده؛ فشار فروش آن‌چین را جدی بگیر."
        : input.bias === "flat"
          ? "جریان هفت‌روزه صرافی تقریباً خنثی است."
          : "جریان صرافی در این نوبت نیامد.";
  const flowEn =
    input.bias === "outflow"
      ? "Over the last seven days, more coin left exchanges than entered; that fits holding spot."
      : input.bias === "inflow"
        ? "Over the last seven days, more coin entered exchanges; respect that on-chain sell pressure."
        : input.bias === "flat"
          ? "Seven-day exchange flow is roughly flat."
          : "Exchange flow did not arrive this pass.";
  const fearFa = input.fear == null ? "" : input.fear >= 80 ? " شاخص ترس و طمع داغ است." : input.fear <= 25 ? " شاخص ترس و طمع در ترس است." : "";
  const fearEn =
    input.fear == null ? "" : input.fear >= 80 ? " The fear and greed index is hot." : input.fear <= 25 ? " The fear and greed index is in fear." : "";
  const nupl = input.nupl == null ? "" : ` NUPL ${input.nupl.toFixed(2)}.`;
  return {
    fa: `${zone}. ${flow}${fearFa}${nupl} ${input.altFa}`,
    en: `${zoneEn}. ${flowEn}${fearEn}${nupl} ${input.altEn}`,
  };
}

export async function buildSpotIntel(): Promise<SpotIntel> {
  if (memory && Date.now() - memory.at < TTL_MS) return memory.value;
  const [onchain, fundamentals, books] = await Promise.all([
    loadOnchain(),
    loadFundamentals(),
    pool(UNIVERSE, 6, async (coin) => {
      try {
        const [candles, depth, whales] = await Promise.all([
          loadKlines(coin.pair),
          loadDepth(coin.pair),
          WHALE_SYMBOLS.has(coin.symbol) ? loadWhales(coin.symbol, coin.pair) : Promise.resolve({ prints: [], net: 0, gross: 0 }),
        ]);
        return { coin, candles, depth, whales, error: null as string | null };
      } catch (error) {
        return {
          coin,
          candles: [] as Candle[],
          depth: null,
          whales: { prints: [] as WhalePrint[], net: 0, gross: 0 },
          error: error instanceof Error ? error.message : "fail",
        };
      }
    }),
  ]);

  const btcCandles = books.find((row) => row.coin.symbol === "BTC")?.candles ?? [];
  const btcRet30 = returnOver(btcCandles, 30);
  const nupl = onchain.mvrv == null ? null : nuplFromMvrv(onchain.mvrv);
  const bias = flowBiasOf(onchain.flowIn7d, onchain.flowOut7d);
  const chainScore = onchainScore(onchain.mvrv, nupl, onchain.flowIn7d, onchain.flowOut7d);
  const returns = books.map((row) => ({ symbol: row.coin.symbol, ret30: returnOver(row.candles, 30) }));
  const season = altSeasonIndex(returns, btcRet30);
  const seasonCopy = altSeasonCopy(season);
  const market = {
    onchainScore: chainScore,
    mvrv: onchain.mvrv,
    nupl,
    flowBias: bias,
    altSeason: season,
    fearGreed: fundamentals.fear,
  };

  const coins: RadarCoin[] = [];
  const whales: WhalePrint[] = [];
  let failed = 0;
  for (const row of books) {
    whales.push(...row.whales.prints);
    const math = scoreCoin({
      symbol: row.coin.symbol,
      candles: row.candles,
      mcFdv: fundamentals.fdv.get(row.coin.symbol) ?? null,
      tvlUsd: fundamentals.tvl.get(row.coin.symbol) ?? null,
      githubCommits14d: fundamentals.github.get(row.coin.symbol) ?? null,
      whaleNetUsd: row.whales.net,
      whaleGrossUsd: row.whales.gross,
      btcRet30,
      market,
    });
    if (!math) {
      failed += 1;
      continue;
    }
    const heat = row.depth ? bookHeat(row.depth.bids, row.depth.asks) : null;
    coins.push({
      ...math,
      symbol: row.coin.symbol,
      nameFa: row.coin.nameFa,
      nameEn: row.coin.nameEn,
      mcFdv: fundamentals.fdv.get(row.coin.symbol) ?? null,
      tvlUsd: fundamentals.tvl.get(row.coin.symbol) ?? null,
      githubCommits14d: fundamentals.github.get(row.coin.symbol) ?? null,
      whaleNetUsd: row.whales.net,
      heat: heat?.bins ?? [],
      heatMid: heat?.mid ?? null,
    });
  }
  coins.sort((a, b) => b.score - a.score);
  whales.sort((a, b) => b.usd - a.usd);
  const top = coins[0];
  const btc = coins.find((row) => row.symbol === "BTC") ?? top;
  let lead = top;
  if (btc && top && top.symbol !== "BTC" && season <= 30 && top.score < btc.score + 3.5) lead = btc;
  if (!lead) throw new Error("رادار اسپات به دفتر بازار وصل نشد. چند لحظه بعد دوباره تلاش کن.");
  const stance =
    lead.action === "accumulate"
      ? { fa: "انباشت پله‌ای", en: "staged accumulation" }
      : lead.action === "watch"
        ? { fa: "پایش، نه خرید فوری", en: "watch, not an immediate buy" }
        : { fa: "اجتناب", en: "avoid" };
  const leadFa = `حکم رادار: ${lead.nameFa} (${lead.symbol}) — ${stance.fa}. امتیاز ${lead.score.toFixed(0)} از ۱۰۰.`;
  const leadEn = `Radar call: ${lead.nameEn} (${lead.symbol}) — ${stance.en}. Score ${lead.score.toFixed(0)} out of 100.`;

  if (!coins.length) {
    throw new Error("رادار اسپات به دفتر بازار وصل نشد. چند لحظه بعد دوباره تلاش کن.");
  }

  const note = marketCopy({
    mvrv: onchain.mvrv,
    nupl,
    bias,
    altFa: seasonCopy.fa,
    altEn: seasonCopy.en,
    fear: fundamentals.fear,
  });

  const value: SpotIntel = {
    generatedAt: new Date().toISOString(),
    sources: [
      "CoinMetrics Community",
      "Binance Vision",
      "CoinGecko",
      "DefiLlama",
      "CoinPaprika",
      "Alternative.me",
      "GitHub",
    ],
    mvrv: onchain.mvrv,
    mvrvZone: mvrvZone(onchain.mvrv),
    nupl,
    nuplZone: nuplZone(nupl),
    flowIn7d: onchain.flowIn7d,
    flowOut7d: onchain.flowOut7d,
    netflow7d:
      onchain.flowIn7d != null && onchain.flowOut7d != null ? exchangeNetflow(onchain.flowIn7d, onchain.flowOut7d) : null,
    flowBias: bias,
    soprProxy: soprProxy(btcCandles),
    soprMeasured: onchain.soprMeasured,
    fearGreed: fundamentals.fear,
    dominance: fundamentals.dominance,
    altSeason: season,
    altSeasonFa: seasonCopy.fa,
    altSeasonEn: seasonCopy.en,
    marketFa: note.fa,
    marketEn: note.en,
    coins,
    whales: whales.slice(0, 12),
    leadSymbol: lead.symbol,
    leadFa,
    leadEn,
    partial: failed ? `${failed}` : null,
  };
  memory = { at: Date.now(), value };
  return value;
}
