import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { msg } from "@/lib/i18n/lex";
import { useI18n } from "@/lib/i18n/locale";
import { runProfitMachine } from "@/lib/crypto/ops";
import {
  ROTATION_BREADTH,
  ROTATION_CONFIRM,
  ROTATION_COST_BPS,
  ROTATION_LOOKBACK,
  ROTATION_MARGIN,
  type RotationReplay,
  type RotationSleeve,
} from "@/lib/crypto/rotation";
import { CoinMark } from "./coin-mark";
import { formatPct, formatUsd } from "./format";

const START_USD = 1000;

function usd(value: number): string {
  return `$${Math.abs(value).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function ProfitMachine() {
  const { tr, locale } = useI18n();
  const run = useServerFn(runProfitMachine);
  const [status, setStatus] = useState<"loading" | "done" | "error">("loading");
  const [report, setReport] = useState<RotationReplay | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onRun() {
    setStatus("loading");
    setError(null);
    try {
      const data = await run();
      setReport(data);
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setReport(null);
      setError(err instanceof Error ? err.message : msg("بک‌تست ماشین انجام نشد.", "The machine backtest did not finish."));
    }
  }

  useEffect(() => {
    void onRun();
    // The book is public market history. Load it once when the desk opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sleeve = report?.final.book.sleeve ?? null;
  const symbol = sleeve === "cash" ? "USDT" : (report?.final.book.symbol ?? "BTC");
  const name =
    sleeve === "cash" ? tr("تتر", "Tether") : (report?.final.book.name ?? symbol);
  const edge = report ? report.equity - report.btcEquity : 0;
  const multiple = report && report.btcEquity > 0 ? report.equity / report.btcEquity : null;

  return (
    <section className="flex min-w-0 flex-col gap-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest text-subtle">PROFIT MACHINE</p>
          <h2 className="mt-1 text-2xl font-medium tracking-tight text-fg">{tr("ماشین سود", "Profit machine")}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tr(
              `سه قانون، بدون حدس. اگر بیت‌کوین در ${ROTATION_LOOKBACK} روز بالا برود و آلت‌های نقد از آن جلو نباشند، خرید بیت‌کوین است. اگر بیت‌کوین رشد نکند، خرید استیبل است. اگر دست‌کم ${ROTATION_BREADTH} آلت حداقل ${Math.round(ROTATION_MARGIN * 100)} واحد درصد بهتر رشد کنند، خرید آلت پیشرو است.`,
              `Three rules, no guess. If Bitcoin is up over ${ROTATION_LOOKBACK} days and liquid alts are not ahead, buy Bitcoin. If Bitcoin is not rising, buy the stablecoin. If at least ${ROTATION_BREADTH} alts lead by ${Math.round(ROTATION_MARGIN * 100)} percentage points, buy the leading alt.`,
            )}
          </p>
        </div>
        <Button className="h-11 shrink-0" variant="outline" onClick={() => void onRun()} disabled={status === "loading"}>
          {status === "loading" ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              {tr("خواندن تاریخ از ۲۰۲۲", "Reading history from 2022")}
            </>
          ) : (
            tr("محاسبه دوباره", "Run again")
          )}
        </Button>
      </div>

      {status === "error" && error ? (
        <p className="text-sm text-down">{tr(error)}</p>
      ) : null}

      {status === "loading" && !report ? (
        <div className="rounded-lg bg-elevated px-4 py-6">
          <p className="text-sm text-fg">{tr("کندل روزانه بیت‌کوین و آلت‌های نقد در حال چیده شدن است.", "Daily Bitcoin and liquid-alt candles are lining up.")}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface">
            <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
          </div>
        </div>
      ) : null}

      {report && status !== "error" ? (
        <>
          <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="rounded-lg bg-elevated p-4">
              <p className="text-xs text-subtle">{tr("پیشنهاد الان", "Call right now")}</p>
              <div className="mt-3">
                <CoinMark symbol={symbol} name={name} size="lg" />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{tr(report.final.reason)}</p>
              <p className="mt-2 text-xs text-subtle">
                {tr("بیت‌کوین ۳۰روزه", "Bitcoin, 30 days")}{" "}
                <span className="num text-fg">
                  {report.final.btcReturn == null ? "—" : formatPct(report.final.btcReturn)}
                </span>
                {report.final.priceUsd != null && sleeve !== "cash" ? (
                  <>
                    {" · "}
                    <span className="num text-fg">${formatUsd(report.final.priceUsd)}</span>
                  </>
                ) : null}
              </p>
            </div>
            <ul className="grid gap-2">
              <Rule
                active={sleeve === "btc"}
                title={tr("بیت‌کوین بهتر از همه", "Bitcoin leads")}
                body={tr("بیت‌کوین بالا است و آلت‌ها از آن جلو نیستند.", "Bitcoin is rising and alts are not ahead of it.")}
              />
              <Rule
                active={sleeve === "cash"}
                title={tr("بازار ریزشی · استیبل", "Falling tape · stablecoin")}
                body={tr("بیت‌کوین در این پنجره رشد نکرده. دفتر در تتر می‌ماند.", "Bitcoin did not rise in this window. The book stays in tether.")}
              />
              <Rule
                active={sleeve === "alt"}
                title={tr("رشد آلت بیشتر است", "Alts are growing more")}
                body={tr("چند آلت نقد از بیت‌کوین جلوترند. کل دفتر روی پیشرو است.", "Several liquid alts lead Bitcoin. The whole book is the leader.")}
              />
            </ul>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Wealth
              label={tr("اگر با ماشین می‌خریدی", "If you bought with the machine")}
              dollars={START_USD * report.equity}
              sub={formatPct(report.equity - 1)}
              tone={edge >= 0 ? "up" : "down"}
            />
            <Wealth
              label={tr("اگر فقط بیت‌کوین می‌خریدی", "If you only held Bitcoin")}
              dollars={START_USD * report.btcEquity}
              sub={formatPct(report.btcEquity - 1)}
              tone="flat"
            />
            <Wealth
              label={tr("اختلاف با هولد بیت‌کوین", "Gap versus holding Bitcoin")}
              dollars={START_USD * edge}
              signed
              sub={
                multiple == null
                  ? "—"
                  : edge >= 0
                    ? tr(`${multiple.toFixed(2)} برابر هولد`, `${multiple.toFixed(2)}× the hold`)
                    : tr(`${multiple.toFixed(2)} برابر هولد`, `${multiple.toFixed(2)}× the hold`)
              }
              tone={edge >= 0 ? "up" : "down"}
            />
          </div>

          <p className="text-sm leading-relaxed text-fg">
            {edge >= 0
              ? tr(
                  `اگر از اول این نمونه ${START_USD.toLocaleString("en-US")} دلار با ماشین خریده می‌شد، الان حدود ${usd(START_USD * report.equity)} دلار بود. هولد بیت‌کوین همان پول را به ${usd(START_USD * report.btcEquity)} دلار می‌رساند. ماشین ${multiple == null ? "—" : multiple.toFixed(1)} برابر هولد تمام کرده.`,
                  `If ${START_USD.toLocaleString("en-US")} dollars had followed the machine from the start of this sample, it would be about ${usd(START_USD * report.equity)} dollars now. Holding Bitcoin turns the same money into ${usd(START_USD * report.btcEquity)} dollars. The machine finished ${multiple == null ? "—" : multiple.toFixed(1)}× the hold.`,
                )
              : tr(
                  `اگر از اول این نمونه ${START_USD.toLocaleString("en-US")} دلار با ماشین خریده می‌شد، الان حدود ${usd(START_USD * report.equity)} دلار بود، کمتر از هولد بیت‌کوین که به ${usd(START_USD * report.btcEquity)} دلار می‌رسد. عدد ساخته نشده و هزینه جابه‌جایی داخلش است.`,
                  `If ${START_USD.toLocaleString("en-US")} dollars had followed the machine from the start of this sample, it would be about ${usd(START_USD * report.equity)} dollars now, behind holding Bitcoin at ${usd(START_USD * report.btcEquity)} dollars. The number is not fitted, and switch costs are inside it.`,
                )}
          </p>

          {report.curve.length > 2 ? (
            <div className="h-56 w-full rounded-lg bg-elevated p-3" dir="ltr">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={report.curve} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                  <XAxis dataKey="t" hide />
                  <YAxis
                    width={42}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#6e6e77", fontSize: 10, fontFamily: "IBM Plex Mono" }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#121214",
                      border: "1px solid rgb(241 242 244 / 0.12)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "#f1f2f4",
                    }}
                    labelFormatter={(value) => {
                      const n = typeof value === "number" ? value : Number(value);
                      if (!Number.isFinite(n)) return "";
                      return new Date(n).toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR", {
                        year: "numeric",
                        month: "short",
                        timeZone: "UTC",
                      });
                    }}
                    formatter={(value, name) => {
                      const n = typeof value === "number" ? value : Number(value);
                      const label =
                        name === "equity"
                          ? tr("ماشین", "Machine")
                          : name === "btc"
                            ? tr("هولد بیت‌کوین", "Bitcoin hold")
                            : tr("فقط زمان‌بندی بیت‌کوین", "Bitcoin timing only");
                      return [`${((n - 1) * 100).toFixed(0)}%`, label];
                    }}
                  />
                  <Line type="monotone" dataKey="equity" stroke="#3ee0a2" dot={false} strokeWidth={1.8} />
                  <Line type="monotone" dataKey="btc" stroke="#9a9aa3" dot={false} strokeWidth={1.2} />
                  <Line type="monotone" dataKey="rule" stroke="#f0b429" dot={false} strokeWidth={1.2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3 text-xs text-subtle">
            <Legend swatch="bg-up" label={tr("ماشین", "Machine")} />
            <Legend swatch="bg-muted" label={tr("هولد بیت‌کوین", "Bitcoin hold")} />
            <Legend swatch="bg-warn" label={tr("فقط زمان‌بندی بیت‌کوین", "Bitcoin timing only")} />
          </div>

          <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Stat label={tr("افت ماشین", "Machine drop")} value={formatPct(report.maxDrawdown)} />
            <Stat label={tr("افت هولد", "Hold drop")} value={formatPct(report.btcMaxDrawdown)} />
            <Stat label={tr("جابه‌جایی", "Switches")} value={String(report.trades)} />
            <Stat
              label={tr("از ۲۰۲۳", "Since 2023")}
              value={`${formatPct(report.recentReturn, 0)} / ${formatPct(report.recentBtcReturn, 0)}`}
            />
          </dl>

          <SleeveBar days={report.sleeveDays} total={report.tradedDays} />

          <ul className="flex flex-wrap gap-2">
            {report.holdings.slice(0, 6).map((row) => (
              <li key={row.symbol} className="rounded-full bg-elevated px-3 py-1 text-xs text-muted">
                <span className="num text-fg">{row.symbol}</span>
                <span className="num ms-2">
                  {row.periods} {tr("روز", "days")}
                </span>
                <span className="num ms-2">{formatPct(row.returnPct, 0)}</span>
              </li>
            ))}
          </ul>

          <ul className="flex flex-col gap-1 text-xs leading-relaxed text-subtle">
            <li>
              {tr(
                `نمونه از ${stamp(report.from, locale)} تا ${stamp(report.to, locale)}. نگاه به گذشته نیست: تصمیم هر روز فقط با ${ROTATION_LOOKBACK} روز قبل بسته می‌شود و ${ROTATION_CONFIRM} روز باید هم‌جهت بماند.`,
                `Sample from ${stamp(report.from, locale)} to ${stamp(report.to, locale)}. No lookahead: each day uses only the prior ${ROTATION_LOOKBACK} days, and the book waits ${ROTATION_CONFIRM} agreeing closes.`,
              )}
            </li>
            <li>
              {tr(
                `هزینه هر جابه‌جایی کامل ${ROTATION_COST_BPS} واحد در ده هزار است. استیبل بازده صفر دارد. خط زرد فقط بیت‌کوین را در روزهای صعودی نگه می‌دارد و در ریزش به تتر می‌رود، بدون آلت.`,
                `A full switch costs ${ROTATION_COST_BPS} basis points. The stablecoin earns zero. The amber line holds Bitcoin only on rising days and sits in tether when it is not, with no alt.`,
              )}
            </li>
            <li>
              {tr(
                "دفتر فقط آلت‌های نقدی است که هنوز روی بایننس معامله می‌شوند. ارزی که از فهرست حذف شده در این مسیر نیست. این مقایسه توصیه خرید نیست و گذشته سود آینده را تضمین نمی‌کند.",
                "The book is only liquid alts that still trade on Binance. A coin that left the list is not in this path. This comparison is not a buy recommendation, and the past does not guarantee a future profit.",
              )}
            </li>
          </ul>
        </>
      ) : null}
    </section>
  );
}

function Rule({ active, title, body }: { active: boolean; title: string; body: string }) {
  return (
    <li className={active ? "rounded-lg bg-fg px-3 py-3 text-bg" : "rounded-lg bg-elevated px-3 py-3"}>
      <p className="text-sm">{title}</p>
      <p className={active ? "mt-1 text-xs text-bg/70" : "mt-1 text-xs text-subtle"}>{body}</p>
    </li>
  );
}

function Wealth({
  label,
  dollars,
  sub,
  signed,
  tone,
}: {
  label: string;
  dollars: number;
  sub: string;
  signed?: boolean;
  tone: "up" | "down" | "flat";
}) {
  const toneClass = tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg";
  const abs = Math.abs(dollars);
  const body = abs.toLocaleString("en-US", { maximumFractionDigits: 0 });
  const text = signed ? `${dollars > 0 ? "+" : dollars < 0 ? "−" : ""}$${body}` : `$${body}`;
  return (
    <div className="rounded-lg bg-elevated px-3 py-3">
      <p className="text-xs text-subtle">{label}</p>
      <p className={`num mt-2 text-2xl ${toneClass}`}>{text}</p>
      <p className="num mt-1 text-xs text-muted">{sub}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-elevated px-3 py-3">
      <p className="text-xs text-subtle">{label}</p>
      <p className="num mt-1 text-sm text-fg">{value}</p>
    </div>
  );
}

function Legend({ swatch, label }: { swatch: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`size-2 rounded-full ${swatch}`} />
      {label}
    </span>
  );
}

function SleeveBar({
  days,
  total,
}: {
  days: Record<RotationSleeve, number>;
  total: number;
}) {
  const { tr } = useI18n();
  const safe = total > 0 ? total : 1;
  const parts: { key: RotationSleeve; label: string; className: string }[] = [
    { key: "btc", label: tr("بیت‌کوین", "Bitcoin"), className: "bg-fg" },
    { key: "alt", label: tr("آلت", "Alt"), className: "bg-up" },
    { key: "cash", label: tr("استیبل", "Stable"), className: "bg-warn" },
  ];
  return (
    <div>
      <div className="flex h-2 overflow-hidden rounded-full bg-elevated">
        {parts.map((part) => (
          <span
            key={part.key}
            className={part.className}
            style={{ width: `${(days[part.key] / safe) * 100}%` }}
          />
        ))}
      </div>
      <ul className="mt-2 flex flex-wrap gap-3 text-xs text-subtle">
        {parts.map((part) => (
          <li key={part.key}>
            {part.label} <span className="num text-fg">{Math.round((days[part.key] / safe) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function stamp(iso: string, locale: "fa" | "en"): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso.slice(0, 10);
  return d.toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}
