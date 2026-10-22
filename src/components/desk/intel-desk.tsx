import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Area, AreaChart, Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPct, formatUsd } from "@/components/desk/format";
import { loadSpotIntel, type RadarCoin, type SpotIntel } from "@/lib/crypto/intel";
import { compactUsd, type Zone } from "@/lib/crypto/intel-math";
import { useI18n } from "@/lib/i18n/locale";

const ZONES: Record<Zone, [string, string]> = {
  capitulation: ["تسلیم", "Capitulation"],
  value: ["ارزش", "Value"],
  optimism: ["خوش‌بینی", "Optimism"],
  belief: ["باور", "Belief"],
  euphoria: ["سرخوشی", "Euphoria"],
  unknown: ["نامعلوم", "Unknown"],
};

export function IntelDesk() {
  const { tr, locale } = useI18n();
  const load = useServerFn(loadSpotIntel);
  const [board, setBoard] = useState<SpotIntel | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [symbol, setSymbol] = useState<string | null>(null);
  const [chartReady, setChartReady] = useState(false);

  async function refresh() {
    setStatus("loading");
    setError(null);
    try {
      const next = await load();
      setBoard(next);
      setSymbol((prev) => (prev && next.coins.some((coin) => coin.symbol === prev) ? prev : (next.coins[0]?.symbol ?? null)));
      setStatus("ready");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : tr("رادار جواب نداد.", "The radar did not answer."));
    }
  }

  useEffect(() => {
    setChartReady(true);
    void refresh();
    // First paint only. Refresh stays on the button.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const coin = useMemo(
    () => board?.coins.find((row) => row.symbol === symbol) ?? board?.coins[0] ?? null,
    [board, symbol],
  );
  const divergences = board?.coins.filter((row) => row.divergence.kind !== "none") ?? [];

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs tracking-widest text-subtle">SPOT BUY RADAR</p>
          <h2 className="mt-1 text-2xl text-fg">{tr("رادار خرید اسپات", "Spot buy radar")}</h2>
        </div>
        <Button type="button" variant="outline" onClick={() => void refresh()} disabled={status === "loading"} className="h-11">
          {status === "loading" ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          {tr("به‌روزرسانی لایه‌ها", "Refresh the layers")}
        </Button>
      </div>

      {status === "loading" && !board ? (
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="text-sm text-fg">{tr("در حال خواندن آن‌چین، دفتر سفارش و کندل‌ها", "Reading on-chain, the book, and candles")}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div className="shimmer h-full w-1/2 rounded-full bg-accent/50" />
          </div>
        </div>
      ) : null}

      {status === "error" && !board ? (
        <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="text-sm text-down">{tr("رادار کامل نشد", "The radar did not finish")}</p>
          <p className="mt-2 text-sm text-muted">{error}</p>
        </div>
      ) : null}

      {board && coin ? (
        <>
          <p className="text-sm leading-relaxed text-muted">{locale === "en" ? board.marketEn : board.marketFa}</p>
          <div className="rounded-xl bg-elevated px-4 py-4 shadow-[var(--shadow-border)]">
            <p className="text-xs text-subtle">{tr("خروجی قابل اجرا", "Actionable call")}</p>
            <p className="mt-1 text-lg text-fg">{locale === "en" ? board.leadEn : board.leadFa}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
            <Metric
              k="MVRV"
              v={board.mvrv == null ? "—" : board.mvrv.toFixed(2)}
              s={tr(...ZONES[board.mvrvZone])}
              d={tr("ارزش بازار نسبت به ارزش تحقق‌یافته. زیر ۱ تاریخی ارزان است؛ بالای ۳٫۲ سرخوشی.", "Market value over realized value. Under 1 is historically cheap; over 3.2 is euphoria.")}
            />
            <Metric
              k="NUPL"
              v={board.nupl == null ? "—" : board.nupl.toFixed(2)}
              s={tr(...ZONES[board.nuplZone])}
              d={tr("از روی MVRV ساخته می‌شود: ۱ منهای یک‌تقسیم‌بر MVRV. سود تحقق‌نیافتهٔ شبکه.", "Derived from MVRV: 1 minus 1/MVRV. The network’s unrealized profit.")}
            />
            <Metric
              k={tr("جریان ۷روز", "7d netflow")}
              v={board.netflow7d == null ? "—" : compactUsd(board.netflow7d)}
              s={
                board.flowBias === "outflow"
                  ? tr("خروج", "Outflow")
                  : board.flowBias === "inflow"
                    ? tr("ورود", "Inflow")
                    : board.flowBias === "flat"
                      ? tr("خنثی", "Flat")
                      : "—"
              }
              d={tr("ورود منهای خروج صرافی از CoinMetrics. عدد منفی یعنی کوین از صرافی خارج شده.", "Exchange inflow minus outflow from CoinMetrics. Negative means coin left exchanges.")}
            />
            <Metric
              k={tr("پروکسی سود", "Profit proxy")}
              v={board.soprProxy == null ? "—" : board.soprProxy.toFixed(3)}
              s={board.soprProxy == null ? "—" : board.soprProxy > 1.02 ? tr("در سود", "In profit") : board.soprProxy < 0.98 ? tr("در زیان", "Underwater") : tr("ریست", "Reset")}
              d={tr("قیمت بیت‌کوین تقسیم بر VWAP هفت‌روزه. این SOPR دفترکل نیست؛ فید رایگان SOPR خام ندارد.", "Bitcoin price divided by the 7-day VWAP. This is not ledger SOPR; the free feed has no raw SOPR.")}
            />
            <Metric
              k={tr("دامیننس", "Dominance")}
              v={board.dominance == null ? "—" : `${board.dominance.toFixed(1)}%`}
              s="BTC"
              d={tr("سهم بیت‌کوین از کل ارزش بازار.", "Bitcoin’s share of total market cap.")}
            />
            <Metric
              k={tr("فصل آلت", "Alt season")}
              v={String(board.altSeason)}
              s={board.altSeason >= 75 ? tr("آلت", "Alts") : board.altSeason <= 25 ? "BTC" : tr("خنثی", "Neutral")}
              d={locale === "en" ? board.altSeasonEn : board.altSeasonFa}
            />
            <Metric
              k={tr("ترس/طمع", "Fear/greed")}
              v={board.fearGreed == null ? "—" : String(Math.round(board.fearGreed))}
              s={board.fearGreed == null ? "—" : board.fearGreed >= 75 ? tr("طمع", "Greed") : board.fearGreed <= 30 ? tr("ترس", "Fear") : tr("میانه", "Mid")}
              d={tr("شاخص Alternative.me. طمع داغ، امتیاز انباشت را کمی کم می‌کند.", "The Alternative.me index. Hot greed trims the accumulation score slightly.")}
            />
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <header className="mb-3 flex items-baseline justify-between gap-3">
                <h3 className="text-sm text-fg">{tr("رادار خرید", "Buy radar")}</h3>
                <p className="text-xs text-subtle">{tr("امتیاز ۰ تا ۱۰۰", "Score 0 to 100")}</p>
              </header>
              <ul className="flex flex-col">
                {board.coins.map((row) => (
                  <li key={row.symbol}>
                    <button
                      type="button"
                      onClick={() => setSymbol(row.symbol)}
                      className={
                        row.symbol === coin.symbol
                          ? "flex min-h-11 w-full items-center gap-3 rounded-lg bg-elevated px-3 py-2 text-start"
                          : "flex min-h-11 w-full items-center gap-3 rounded-lg px-3 py-2 text-start hover:bg-elevated"
                      }
                    >
                      <span className="num w-12 shrink-0 text-sm text-fg">{row.symbol}</span>
                      <span className="min-w-0 flex-1 truncate text-xs text-muted">{locale === "en" ? row.nameEn : row.nameFa}</span>
                      <ActionChip action={row.action} />
                      <span className="num w-12 text-end text-sm text-fg">{row.score.toFixed(1)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="text-xs text-subtle">{tr("امتیاز انباشت هوشمند", "Smart accumulation score")}</p>
              <div className="mt-2 flex items-end justify-between gap-3">
                <div>
                  <p className="num text-5xl tracking-tight text-fg">{coin.score.toFixed(0)}</p>
                  <p className="mt-1 text-sm text-fg">
                    {coin.symbol}
                    <span className="text-muted"> · ${formatUsd(coin.price)}</span>
                  </p>
                </div>
                <ActionChip action={coin.action} large />
              </div>
              <ul className="mt-4 flex flex-col gap-2">
                {(locale === "en" ? coin.reasonsEn : coin.reasonsFa).map((line) => (
                  <li key={line} className="text-xs leading-relaxed text-muted">
                    {line}
                  </li>
                ))}
              </ul>
              <ul className="mt-5 flex flex-col gap-3">
                {coin.factors.map((factor) => (
                  <li key={factor.key}>
                    <div className="flex items-baseline justify-between gap-3 text-xs">
                      <span className="text-muted">{locale === "en" ? factor.labelEn : factor.labelFa}</span>
                      <span className="num text-fg">{factor.score.toFixed(0)}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.max(4, Math.min(100, factor.score))}%`,
                          background: factor.score >= 70 ? "var(--color-up)" : factor.score >= 45 ? "var(--color-warn)" : "var(--color-down)",
                        }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="mt-5 grid grid-cols-2 gap-3 text-xs">
                <Fact k="MC/FDV" v={coin.mcFdv == null ? "—" : coin.mcFdv.toFixed(2)} />
                <Fact k="TVL" v={coin.tvlUsd == null ? "—" : compactUsd(coin.tvlUsd)} />
                <Fact k={tr("کامیت ۱۴روز", "14d commits")} v={coin.githubCommits14d == null ? "—" : coin.githubCommits14d >= 30 ? "30+" : String(coin.githubCommits14d)} />
                <Fact k="RSI" v={coin.rsi14 == null ? "—" : coin.rsi14.toFixed(0)} />
                <Fact k="CVD" v={tr(coin.cvdBias === "buy" ? "خرید" : coin.cvdBias === "sell" ? "فروش" : "خنثی", coin.cvdBias)} />
                <Fact
                  k="POC"
                  v={coin.pocDistancePct == null ? "—" : formatPct(coin.pocDistancePct / 100)}
                />
              </dl>
            </article>
          </div>

          <div className="grid items-start gap-4 lg:grid-cols-2">
            <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <h3 className="text-sm text-fg">{tr("ردگیر نهنگ دفتر معاملات", "Tape whale tracker")}</h3>
              <p className="mt-1 text-xs leading-relaxed text-subtle">
                {tr(
                  "پرینت تکی بالای آستانه، یا دقیقه‌ای که حجمش غیرعادی یک‌طرفه بوده. کیف‌پول نام‌دار آن‌چین نیست.",
                  "A single print above the floor, or a minute with unusually one-sided volume. Not a named on-chain wallet.",
                )}
              </p>
              {board.whales.length ? (
                <ul className="mt-3 flex flex-col">
                  {board.whales.map((print) => (
                    <li key={`${print.kind}-${print.symbol}-${print.time}-${print.usd}`} className="flex min-h-11 flex-wrap items-center gap-x-3 gap-y-1 border-t border-border py-2 text-sm first:border-t-0">
                      <span className="num w-12 text-fg">{print.symbol}</span>
                      <span className={print.side === "buy" ? "text-up" : "text-down"}>
                        {print.side === "buy" ? tr("خرید", "Buy") : tr("فروش", "Sell")}
                      </span>
                      <span className="text-xs text-subtle">{print.kind === "print" ? tr("پرینت", "Print") : tr("دقیقه سنگین", "Heavy minute")}</span>
                      <span className="num ms-auto text-fg">{compactUsd(print.usd)}</span>
                      <span className="num text-xs text-subtle">${formatUsd(print.price)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{tr("در این نمونه پرینت بالای آستانه نبود.", "No print cleared the threshold in this sample.")}</p>
              )}
            </article>

            <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
              <h3 className="text-sm text-fg">{tr("موتور واگرایی", "Divergence engine")}</h3>
              <p className="mt-1 text-xs leading-relaxed text-subtle">
                {tr(
                  "کف یا سقف RSI در برابر قیمت، روی روزانه و هفتگی. فقط واگرایی تازه فهرست می‌شود.",
                  "RSI swings against price, on the daily and the weekly. Only a fresh divergence is listed.",
                )}
              </p>
              {divergences.length ? (
                <ul className="mt-3 flex flex-col gap-2">
                  {divergences.map((row) => (
                    <li key={row.symbol}>
                      <button type="button" onClick={() => setSymbol(row.symbol)} className="flex min-h-11 w-full items-start gap-3 rounded-lg px-2 py-2 text-start hover:bg-elevated">
                        <span className="num w-12 shrink-0 pt-0.5 text-sm text-fg">{row.symbol}</span>
                        <span className="text-xs leading-relaxed text-muted">
                          <span className={row.divergence.kind === "bullish" ? "text-up" : "text-down"}>
                            {row.divergence.kind === "bullish" ? tr("صعودی", "Bullish") : tr("نزولی", "Bearish")}
                            {row.divergence.tf ? ` · ${row.divergence.tf}` : ""}
                          </span>
                          <span className="mt-0.5 block">{locale === "en" ? row.divergence.noteEn : row.divergence.noteFa}</span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-muted">{tr("واگرایی تازه‌ای در این جهان پیدا نشد.", "No fresh divergence in this universe.")}</p>
              )}
            </article>
          </div>

          <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-sm text-fg">
                {tr("نقدینگی و دلتای حجم", "Liquidity and volume delta")} · {coin.symbol}
              </h3>
              <p className="text-xs text-subtle">
                {tr("دیوارهای ۱٫۲٪ اطراف قیمت، به‌علاوه CVD سی روز از حجم خریدار مهاجم.", "Walls within 1.2% of price, plus 30-day CVD from aggressive buy volume.")}
              </p>
            </div>
            {chartReady ? (
              <div className="mt-3 grid gap-4 lg:grid-cols-2" dir="ltr">
                <div className="h-48">
                  {coin.heat.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={coin.heat.map((bin) => ({ p: bin.price, bid: Math.round(bin.bidUsd), ask: Math.round(bin.askUsd) }))}>
                        <XAxis dataKey="p" tick={{ fill: "var(--color-subtle)", fontSize: 10 }} tickFormatter={(v: number) => formatUsd(v)} interval={3} />
                        <Tooltip
                          contentStyle={{ background: "var(--color-elevated)", border: "none", borderRadius: 8, fontSize: 12 }}
                          formatter={(value: number, name: string) => [compactUsd(Number(value)), name === "bid" ? "Bid" : "Ask"]}
                          labelFormatter={(label: number) => `$${formatUsd(Number(label))}`}
                        />
                        <Bar dataKey="bid" fill="var(--color-up)" radius={2} />
                        <Bar dataKey="ask" fill="var(--color-down)" radius={2} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-sm text-muted">{tr("دفتر سفارش این نماد نیامد.", "The order book for this symbol did not arrive.")}</p>
                  )}
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={coin.cvdPath.map((v, i) => ({ i, v }))}>
                      <XAxis dataKey="i" hide />
                      <Tooltip
                        contentStyle={{ background: "var(--color-elevated)", border: "none", borderRadius: 8, fontSize: 12 }}
                        formatter={(value: number) => [Number(value).toFixed(2), "CVD"]}
                        labelFormatter={() => "CVD"}
                      />
                      <Area type="monotone" dataKey="v" stroke="var(--color-fg)" fill="var(--color-up-dim)" strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="mt-3 h-48 rounded-lg bg-elevated" />
            )}
          </article>

          <p className="text-xs leading-relaxed text-subtle">
            {tr(
              "سطح ذخیرهٔ صرافی در فید رایگان نیست؛ جریان ورود و خروج هست. پروکسی سود، SOPR دفترکل نیست. نهنگ یعنی پرینت بزرگ، نه کیف سرد نام‌دار.",
              "Exchange reserve stock is not on the free feed; inflow and outflow are. The profit proxy is not ledger SOPR. A whale here is a large print, not a named cold wallet.",
            )}
            {board.partial ? ` · ${tr(`${board.partial} نماد کندل کامل نداشت.`, `${board.partial} symbols lacked a full candle set.`)}` : ""}
            {" · "}
            {board.sources.join(" · ")}
          </p>
        </>
      ) : null}
    </section>
  );
}

function Metric({ k, v, s, d }: { k: string; v: string; s: string; d: string }) {
  return (
    <div className="rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{k}</p>
      <p className="num mt-1 text-lg text-fg">{v}</p>
      <p className="mt-0.5 text-xs text-muted">{s}</p>
      <p className="mt-2 text-xs leading-relaxed text-subtle">{d}</p>
    </div>
  );
}

function Fact({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-elevated px-3 py-2">
      <dt className="text-subtle">{k}</dt>
      <dd className="num mt-0.5 text-sm text-fg">{v}</dd>
    </div>
  );
}

function ActionChip({ action, large }: { action: RadarCoin["action"]; large?: boolean }) {
  const { tr } = useI18n();
  const label =
    action === "accumulate" ? tr("انباشت", "Accumulate") : action === "watch" ? tr("پایش", "Watch") : tr("اجتناب", "Avoid");
  const tone =
    action === "accumulate" ? "bg-up-dim text-up" : action === "watch" ? "bg-warn-dim text-warn" : "bg-down-dim text-down";
  return <span className={`rounded-md px-2 py-1 text-xs ${tone} ${large ? "px-3 py-2 text-sm" : ""}`}>{label}</span>;
}
