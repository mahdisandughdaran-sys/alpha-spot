import type { AnalysisResult, CoinRow, Confidence, Regime } from "./types";

function pct(x: number, digits = 1): string {
  const v = x * 100;
  const sign = v > 0 ? "+" : "";
  return `${sign}${v.toFixed(digits)}٪`;
}

function usd(n: number): string {
  if (n >= 1000) {
    return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
  }
  if (n >= 1) return n.toFixed(4);
  return n.toPrecision(4);
}

export function btcPriceLabel(priceBtc: number): string {
  if (priceBtc >= 0.01) return `${priceBtc.toFixed(5)} BTC`;
  if (priceBtc >= 0.0001) return `${priceBtc.toFixed(6)} BTC`;
  const sats = priceBtc * 1e8;
  if (sats >= 1) return `${sats.toFixed(sats >= 100 ? 0 : 1)} sats`;
  return `${priceBtc.toExponential(2)} BTC`;
}

export function confidenceOf(
  pick: CoinRow,
  runnerUp: CoinRow | null,
  hasDepth: boolean,
): { confidence: Confidence; note: string } {
  const gap = runnerUp ? pick.score - runnerUp.score : 10;
  const rsiOk = pick.rsi14 == null || (pick.rsi14 >= 32 && pick.rsi14 <= 68);
  const liquid = pick.volume24h >= 20_000_000;
  const aligned = pick.factors.filter((f) => f.score >= 60).length >= 4;

  if (pick.score >= 72 && gap >= 4 && hasDepth && rsiOk && liquid && aligned) {
    return {
      confidence: "high",
      note: "فاکتورها هم‌جهت‌اند، دادهٔ ۳۰ روزه کامل است و فاصله با گزینه دوم معنادار است.",
    };
  }
  if (pick.score >= 60 && (hasDepth || gap >= 3)) {
    return {
      confidence: "medium",
      note: "سیگنال قابل اتکاست ولی یا فاصله با بقیه کم است یا یکی از فاکتورها کامل هم‌خوان نیست.",
    };
  }
  return {
    confidence: "low",
    note: "بازار مخلوط است؛ این بهترین گزینهٔ نسبی است نه یک موقعیت ایده‌آل.",
  };
}

export function explainPick(
  pick: CoinRow,
  runnerUp: CoinRow | null,
  regime: Regime,
  regimeNote: string,
  btcPct7d: number,
): { reasons: string[]; caution: string[] } {
  const reasons: string[] = [];
  const caution: string[] = [];

  reasons.push(regimeNote);

  if (pick.symbol === "BTC") {
    reasons.push(
      `در ۷ روز گذشته بیت‌کوین ${pct(btcPct7d)} روی دلار بوده و آلت‌های رقیب نتوانسته‌اند هزینه فرصت بیت را جبران کنند.`,
    );
    reasons.push(
      "برای خرید اسپات، نقدشوندگی بیت‌کوین بی‌رقیب است و ریسک انتخاب آلتِ عقب‌افتاده را حذف می‌کند.",
    );
  } else {
    reasons.push(
      `${pick.name} در ۷ روز ${pct(pick.rs7d)} نسبت به بیت‌کوین ${pick.rs7d >= 0 ? "قوی‌تر" : "ضعیف‌تر"} بوده` +
        (pick.rs30d != null ? ` و در افق ۳۰ روز ${pct(pick.rs30d)}.` : "."),
    );
    reasons.push(
      `قیمت دلاری ${usd(pick.priceUsd)} دلار معادل ${btcPriceLabel(pick.priceBtc)} است — تصمیم روی همین جفت گرفته شد، نه فقط نمودار تتر.`,
    );
  }

  const entry = pick.factors.find((f) => f.key === "entry");
  const rs = pick.factors.find((f) => f.key === "rs");
  const liq = pick.factors.find((f) => f.key === "liquidity");
  const risk = pick.factors.find((f) => f.key === "risk");
  const trend = pick.factors.find((f) => f.key === "trend");
  if (entry) reasons.push(entry.note);
  if (rs && pick.symbol !== "BTC") reasons.push(rs.note);
  if (liq) reasons.push(liq.note);
  if (trend) reasons.push(trend.note);

  if (pick.rsi14 != null && pick.rsi14 > 68) {
    caution.push("RSI بالاست؛ اگر وارد می‌شوید حجم را بشکنید یا منتظر اصلاح کوتاه بمانید.");
  }
  if (pick.rsi14 != null && pick.rsi14 < 32 && pick.rs7d < 0) {
    caution.push("هنوز در ضعف نسبی است؛ این انتخابِ «کم‌بدتر» است نه برگشت قطعی.");
  }
  if (pick.athDrawdownPct != null && pick.athDrawdownPct < -70) {
    caution.push("از اوج تاریخی خیلی فاصله دارد؛ ممکن است ارزش به‌دام‌افتاده باشد نه فرصت.");
  }
  if (!pick.hasKlines) {
    caution.push("کندل ۳۰ روزه جفت BTC برای این ارز کامل نبود؛ افق بلندتر با قطعیت کمتر است.");
  }
  if (runnerUp && runnerUp.score > pick.score - 4) {
    caution.push(
      `فاصله با ${runnerUp.symbol} فقط ${(pick.score - runnerUp.score).toFixed(1)} امتیاز است — بازار یک برندهٔ بی‌چون‌وچرا ندارد.`,
    );
  }
  if (regime === "btc" && pick.symbol !== "BTC") {
    caution.push("رژیم کلی هنوز به نفع بیت‌کوین است؛ آلت باید دلیل مشخص داشته باشد که دارد.");
  }
  if (risk && risk.score < 45) {
    caution.push("بازده به ریسک این گزینه ضعیف‌تر از ظاهر قدرت نسبی‌اش است.");
  }

  return { reasons: reasons.slice(0, 6), caution: caution.slice(0, 4) };
}

export function regimeTitle(regime: Regime): string {
  if (regime === "btc") return "فصل بیت‌کوین";
  if (regime === "alt") return "چرخش به آلت";
  return "بازار خنثی";
}

export function confidenceTitle(c: Confidence): string {
  if (c === "high") return "اعتماد بالا";
  if (c === "medium") return "اعتماد متوسط";
  return "اعتماد محتاط";
}

export function sortFactors(row: CoinRow): AnalysisResult["pick"]["factors"] {
  return [...row.factors].sort((a, b) => b.weight - a.weight);
}
