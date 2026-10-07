import type { CoinRow, Regime, Sleeve, SleeveLeg } from "./types.ts";

function splitByScore(rows: CoinRow[], totalWeight: number, maxN: number): SleeveLeg[] {
  const picks = rows.slice(0, maxN);
  if (picks.length === 0) return [];
  const scores = picks.map((r) => Math.max(r.score, 1));
  const sum = scores.reduce((a, b) => a + b, 0);
  return picks.map((r, i) => ({
    symbol: r.symbol,
    name: r.name,
    rank: r.rank,
    weight: totalWeight * ((scores[i] ?? 1) / sum),
    score: r.score,
    reason:
      r.rank <= 50
        ? "لارج‌کپ با امتیاز مدل بالا"
        : r.narrativeTagsFa[0]
          ? `میدکپ · ${r.narrativeTagsFa[0]}`
          : "میدکپ با پتانسیل بالاتر",
  }));
}

export function buildPortfolio(ranked: CoinRow[], regime: Regime): Sleeve[] {
  const btc = ranked.find((r) => r.symbol === "BTC");
  const eth = ranked.find((r) => r.symbol === "ETH");

  const corePct = 0.55;
  const btcShare =
    regime === "btc" ? 0.4 : regime === "alt" ? 0.3 : 0.35;
  const ethShare = corePct - btcShare;

  const coreLegs: SleeveLeg[] = [];
  if (btc) {
    coreLegs.push({
      symbol: btc.symbol,
      name: btc.name,
      rank: btc.rank,
      weight: eth ? btcShare : corePct,
      score: btc.score,
      reason: "هسته پایدار پرتفوی اسپات",
    });
  }
  if (eth) {
    coreLegs.push({
      symbol: eth.symbol,
      name: eth.name,
      rank: eth.rank,
      weight: btc ? ethShare : corePct,
      score: eth.score,
      reason: "لایه یک با ارزش‌افزایی واقعی",
    });
  }

  const used = new Set(coreLegs.map((l) => l.symbol));
  const liquid = ranked.filter(
    (r) => !used.has(r.symbol) && r.volume24h >= 8_000_000,
  );
  const large = liquid.filter((r) => r.rank >= 3 && r.rank <= 50);
  const mid = liquid.filter((r) => r.rank >= 51 && r.rank <= 100);

  const largeLegs = splitByScore(large, 0.3, 4);
  const midLegs = splitByScore(mid, 0.15, 3);

  const coreNote =
    regime === "btc"
      ? "رژیم بیت‌کوین: وزن هسته بیشتر روی BTC است."
      : regime === "alt"
        ? "چرخش آلت: ETH داخل هسته وزن بیشتری می‌گیرد."
        : "بازار خنثی: هسته بین BTC و ETH تقسیم می‌شود.";

  return [
    {
      key: "core",
      title: "هسته · بیت‌کوین و اتریوم",
      targetPct: 55,
      note: coreNote,
      legs: coreLegs,
    },
    {
      key: "large",
      title: "لارج‌کپ · رتبه ۲۰ تا ۵۰",
      targetPct: 30,
      note: "آلت‌های نقدشونده با MC/FDV و روند قابل دفاع.",
      legs: largeLegs,
    },
    {
      key: "mid",
      title: "میدکپ · رتبه ۵۰ تا ۱۰۰",
      targetPct: 15,
      note: "آستین هایپ و روایت روز؛ حجم کوچک‌تر، ریسک بالاتر.",
      legs: midLegs,
    },
  ];
}

export function sleeveTotal(sleeves: Sleeve[]): number {
  return sleeves.reduce(
    (s, sl) => s + sl.legs.reduce((a, l) => a + l.weight, 0),
    0,
  );
}
