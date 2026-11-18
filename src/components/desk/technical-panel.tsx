import { useEffect, useId, useRef, useState, type PointerEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { LoaderCircle } from "lucide-react";
import { formatPct } from "@/components/desk/format";
import { useI18n } from "@/lib/i18n/locale";
import { msg } from "@/lib/i18n/lex";
import { loadTechnical } from "@/lib/crypto/ta-call";
import { formatPx, normalizeSymbol, type ChartBar, type ChartMark, type IntervalId, type TaRead } from "@/lib/crypto/ta";

const QUICK = ["BTC", "ETH", "SOL", "BNB", "XRP", "DOGE", "AVAX", "LINK", "TON"] as const;

const INTERVALS: { id: IntervalId; fa: string; en: string }[] = [
  { id: "4h", fa: "چهارساعته", en: "4 hours" },
  { id: "1d", fa: "روزانه", en: "Daily" },
  { id: "1w", fa: "هفتگی", en: "Weekly" },
];

export function TechnicalPanel({ defaultSymbol = "BTC" }: { defaultSymbol?: string }) {
  const { tr, locale } = useI18n();
  const run = useServerFn(loadTechnical);
  const [symbol, setSymbol] = useState(() => normalizeSymbol(defaultSymbol) ?? "BTC");
  const [draft, setDraft] = useState(symbol);
  const [interval, setIntervalId] = useState<IntervalId>("1d");
  const [read, setRead] = useState<TaRead | null>(null);
  const [phase, setPhase] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const next = normalizeSymbol(defaultSymbol) ?? "BTC";
    setSymbol(next);
  }, [defaultSymbol]);

  useEffect(() => {
    setDraft(symbol);
  }, [symbol]);

  useEffect(() => {
    let stop = false;
    setPhase("loading");
    setError(null);
    void run({ data: { symbol, interval } })
      .then((next) => {
        if (stop) return;
        setRead(next);
        setPhase("ready");
        setActive(null);
      })
      .catch((err: unknown) => {
        if (stop) return;
        setPhase("error");
        setError(err instanceof Error ? err.message : msg("خواندن نمودار انجام نشد.", "The chart could not be read."));
      });
    return () => {
      stop = true;
    };
  }, [symbol, interval, run]);

  const tone =
    read?.bias === "bull" ? "text-up bg-up-dim" : read?.bias === "bear" ? "text-down bg-down-dim" : "text-muted bg-elevated";

  return (
    <section id="technical" className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-lg text-fg">{tr("تحلیل تکنیکال", "Technical read")}</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
            {tr(
              "متن از روی همین شکل است. روی هر بند بزن تا همان خط پررنگ شود. این بخش دستور خرید نمی‌دهد.",
              "The text is read off this chart. Tap a note to emphasize that line. This section does not give an order.",
            )}
          </p>
        </div>
        {read ? (
          <p className={`rounded-md px-3 py-2 text-sm ${tone}`}>{tr(read.biasFa, read.biasEn)}</p>
        ) : null}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex gap-1 overflow-x-auto">
          {QUICK.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setSymbol(item)}
              className={
                symbol === item
                  ? "num h-11 shrink-0 rounded-md bg-elevated px-3 text-sm text-fg"
                  : "num h-11 shrink-0 rounded-md px-3 text-sm text-muted"
              }
            >
              {item}
            </button>
          ))}
        </div>
        <form
          className="flex flex-col gap-2 sm:flex-row"
          onSubmit={(event) => {
            event.preventDefault();
            const next = normalizeSymbol(draft);
            if (!next) {
              setPhase("error");
              setError(msg("نماد نامعتبر است.", "That symbol is not valid."));
              return;
            }
            setSymbol(next);
          }}
        >
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value.toUpperCase())}
            aria-label={tr("نماد", "Symbol")}
            className="num h-11 min-w-0 flex-1 rounded-md bg-bg px-3 text-sm text-fg outline-none"
            placeholder="BTC"
          />
          <button type="submit" className="h-11 rounded-md bg-accent px-4 text-sm text-accent-fg">
            {tr("نمایش نمودار", "Show chart")}
          </button>
          <div className="flex gap-1">
            {INTERVALS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIntervalId(item.id)}
                className={
                  interval === item.id
                    ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg"
                    : "h-11 rounded-md px-3 text-sm text-muted"
                }
              >
                {tr(item.fa, item.en)}
              </button>
            ))}
          </div>
        </form>
      </div>

      {phase === "loading" ? (
        <div className="mt-4 flex h-72 items-center justify-center rounded-lg bg-bg">
          <p className="flex items-center gap-2 text-sm text-muted">
            <LoaderCircle className="size-4 animate-spin" />
            {tr("کندل‌ها از بایننس می‌آیند", "Loading candles from Binance")}
          </p>
        </div>
      ) : null}

      {phase === "error" ? (
        <p className="mt-4 text-sm text-down">{error ? tr(error) : tr("خواندن نمودار انجام نشد.", "The chart could not be read.")}</p>
      ) : null}

      {phase === "ready" && read ? (
        <figure className="mt-4 flex flex-col gap-4">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-sm text-muted">
              <span className="num text-fg">{read.symbol}</span>
              {" · "}
              {tr(
                INTERVALS.find((item) => item.id === read.interval)?.fa ?? "",
                INTERVALS.find((item) => item.id === read.interval)?.en ?? "",
              )}
              {read.live ? tr(" · کندل آخر هنوز باز است", " · the last candle is still open") : ""}
            </p>
            <p className="num text-xl text-fg">
              {formatPx(read.lastPrice)}{" "}
              <span className={read.changePct >= 0 ? "text-sm text-up" : "text-sm text-down"}>{formatPct(read.changePct)}</span>
            </p>
          </div>
          <p className="text-sm leading-relaxed text-muted">{tr(read.summaryFa, read.summaryEn)}</p>
          <ChartFigure read={read} active={active} locale={locale} />
          <Legend read={read} />
          <div className="grid gap-2">
            {read.steps.slice(0, 3).map((step) => (
              <button
                key={step.n}
                type="button"
                onClick={() => setActive((cur) => (cur === step.n ? null : step.n))}
                className={
                  active === step.n
                    ? "rounded-lg bg-elevated px-4 py-3 text-start shadow-[var(--shadow-border)]"
                    : "rounded-lg px-4 py-3 text-start hover:bg-elevated"
                }
              >
                <p className="text-sm text-fg">
                  <span className="num me-2 text-subtle">{step.n}</span>
                  {tr(step.titleFa, step.titleEn)}
                </p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{tr(step.bodyFa, step.bodyEn)}</p>
              </button>
            ))}
          </div>
          {read.steps[3] ? (
            <p className={`text-sm leading-relaxed ${active === 4 ? "text-fg" : "text-muted"}`}>
              <button type="button" className="text-start" onClick={() => setActive((cur) => (cur === 4 ? null : 4))}>
                <span className="num me-2 text-subtle">4</span>
                {tr(read.steps[3].bodyFa, read.steps[3].bodyEn)}
              </button>
            </p>
          ) : null}
          {read.steps[4] ? (
            <p className={`text-sm leading-relaxed ${active === 5 ? "text-fg" : "text-muted"}`}>
              <button type="button" className="text-start" onClick={() => setActive((cur) => (cur === 5 ? null : 5))}>
                <span className="num me-2 text-subtle">5</span>
                {tr(read.steps[4].bodyFa, read.steps[4].bodyEn)}
              </button>
            </p>
          ) : null}
          {read.votes.length ? (
            <div className="flex flex-wrap gap-2">
              {read.votes.map((vote) => (
                <span
                  key={vote.id}
                  className={
                    vote.bias === "bull"
                      ? "rounded-md bg-up-dim px-2 py-1 text-xs text-up"
                      : vote.bias === "bear"
                        ? "rounded-md bg-down-dim px-2 py-1 text-xs text-down"
                        : "rounded-md bg-elevated px-2 py-1 text-xs text-muted"
                  }
                >
                  {tr(vote.nameFa, vote.nameEn)}
                  {" · "}
                  {vote.bias === "bull" ? tr("صعودی", "Bull") : vote.bias === "bear" ? tr("نزولی", "Bear") : tr("خنثی", "Flat")}
                </span>
              ))}
            </div>
          ) : null}
          <details className="text-sm text-muted">
            <summary className="cursor-pointer text-fg">{tr("این خط‌ها از کجا آمده‌اند", "Where these lines come from")}</summary>
            <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 leading-relaxed">
              <li>
                {tr(
                  "ساختار: چارلز داو. روند یعنی سقف بالاتر با کف بالاتر، یا سقف پایین‌تر با کف پایین‌تر. سقف و کف فقط وقتی تأیید می‌شوند که دو کندل دو طرفشان از آن‌ها عبور نکرده باشد.",
                  "Structure: Charles Dow. A trend is a higher high with a higher low, or a lower high with a lower low. A swing counts only when two candles on each side failed to exceed it.",
                )}
              </li>
              <li>
                {tr(
                  "میانگین ساده ۵۰ و ۲۰۰، فیلتر رژیم است. Brock، Lakonishok و LeBaron در Journal of Finance سال ۱۹۹۲ قوانین میانگین ساده را آزمودند. اینجا فقط جای قیمت نسبت به خط را می‌گوید.",
                  "The 50 and 200 simple averages are a regime filter. Brock, Lakonishok, and LeBaron tested simple average rules in the Journal of Finance, 1992. Here they only say where price sits against the line.",
                )}
              </li>
              <li>
                {tr(
                  "RSI و ATR و ADX از وایلدر است، کتاب New Concepts in Technical Trading Systems، ۱۹۷۸، با دورهٔ ۱۴ خودش. ADX را از ۲۵ به بالا روند می‌گیریم. ADX جهت نمی‌دهد؛ DI جهت را می‌گوید.",
                  "RSI, ATR, and ADX are Wilder's, from New Concepts in Technical Trading Systems, 1978, using his period of 14. ADX counts as a trend from 25 up. ADX does not point; DI does.",
                )}
              </li>
              <li>
                {tr(
                  "مکدی مال جرالد اپل است: ۱۲، ۲۶ و سیگنال ۹. هیستوگرام، فاصلهٔ خط مکدی از سیگنال است.",
                  "MACD is Gerald Appel's: 12, 26, and a 9 signal. The histogram is the gap between the MACD line and the signal.",
                )}
              </li>
              <li>
                {tr(
                  "باند بولینگر مال جان بولینگر است: میانگین ۲۰ و دو انحراف معیار. %B جای قیمت داخل نوار است. تنگ شدن نوار جهت نیست.",
                  "Bollinger Bands are John Bollinger's: a 20 average and two standard deviations. %B is where price sits inside the band. A narrow band is not a direction.",
                )}
              </li>
              <li>
                {tr(
                  "OBV مال جو گرانویل است، ۱۹۶۳. فقط وقتی با جهت ده کندل اخیر همراه باشد رأی می‌دهد.",
                  "OBV is Joe Granville's, 1963. It votes only when it agrees with the last ten candles.",
                )}
              </li>
              <li>
                {tr(
                  "پیوت فرمول کف معامله‌گران است: (سقف + کف + بسته) تقسیم بر ۳. فقط اگر نزدیک قیمت باشد روی شکل می‌آید.",
                  "The pivot is the floor-trader formula: (high + low + close) / 3. It is drawn only when it sits near price.",
                )}
              </li>
            </ul>
          </details>
          <figcaption className="text-xs leading-relaxed text-subtle">
            {tr(
              "کندل عمومی بایننس، جفت تتر. اگر کندل آخر باز باشد در محاسبه هست و با بسته شدن کمی جابه‌جا می‌شود. توصیه سرمایه‌گذاری نیست.",
              "Public Binance candles, USDT pair. If the last candle is still open it is included and will shift a little when it closes. Not investment advice.",
            )}
          </figcaption>
        </figure>
      ) : null}
    </section>
  );
}

function Legend({ read }: { read: TaRead }) {
  const { tr } = useI18n();
  const support = read.marks.find((mark) => mark.id === "support");
  const resistance = read.marks.find((mark) => mark.id === "resistance");
  const pivot = read.marks.find((mark) => mark.id === "pivot");
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
      {read.sma200 != null ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-accent" />
          {tr("میانگین ۲۰۰", "200 SMA")} <span className="num text-fg">{formatPx(read.sma200)}</span>
        </span>
      ) : null}
      {read.sma50 != null ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-0.5 w-6 bg-warn" />
          {tr("میانگین ۵۰", "50 SMA")} <span className="num text-fg">{formatPx(read.sma50)}</span>
        </span>
      ) : null}
      {support ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-6 border-t border-dashed border-up" />
          {tr("حمایت", "Support")} <span className="num text-fg">{formatPx(support.price)}</span>
        </span>
      ) : null}
      {resistance ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-6 border-t border-dashed border-down" />
          {tr("مقاومت", "Resistance")} <span className="num text-fg">{formatPx(resistance.price)}</span>
        </span>
      ) : null}
      <span className="inline-flex items-center gap-2">
        <span className="h-3 w-6 rounded-sm bg-elevated" />
        {tr("باند بولینگر", "Bollinger")}
      </span>
      {read.atr != null ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-3 w-0.5 bg-warn" />
          ATR <span className="num text-fg">{formatPx(read.atr)}</span>
        </span>
      ) : null}
      {pivot ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-0 w-6 border-t border-dashed border-subtle" />
          {tr("پیوت", "Pivot")} <span className="num text-fg">{formatPx(pivot.price)}</span>
        </span>
      ) : null}
    </div>
  );
}

function ChartFigure({ read, active, locale }: { read: TaRead; active: number | null; locale: "fa" | "en" }) {
  const { tr } = useI18n();
  const host = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(640);
  const [hover, setHover] = useState<number | null>(null);
  const labelId = useId();

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const apply = () => setWidth(Math.max(280, Math.floor(el.clientWidth)));
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const bars = read.bars;
  const padL = 8;
  const padR = width < 420 ? 52 : 64;
  const padT = 16;
  const priceH = 220;
  const rsiH = 68;
  const macdH = 60;
  const gap = 22;
  const height = padT + priceH + gap + rsiH + gap + macdH + 8;
  const plotW = Math.max(40, width - padL - padR);
  const n = bars.length || 1;
  const x = (i: number) => padL + ((i + 0.5) * plotW) / n;

  let min = Infinity;
  let max = -Infinity;
  for (const bar of bars) {
    min = Math.min(min, bar.low);
    max = Math.max(max, bar.high);
    if (bar.upper != null) max = Math.max(max, bar.upper);
    if (bar.lower != null) min = Math.min(min, bar.lower);
    if (bar.sma50 != null) {
      min = Math.min(min, bar.sma50);
      max = Math.max(max, bar.sma50);
    }
    if (bar.sma200 != null) {
      min = Math.min(min, bar.sma200);
      max = Math.max(max, bar.sma200);
    }
  }
  for (const mark of read.marks) {
    min = Math.min(min, mark.price);
    max = Math.max(max, mark.price);
  }
  const last = bars[bars.length - 1];
  if (last && read.atr) {
    min = Math.min(min, last.close - read.atr);
    max = Math.max(max, last.close + read.atr * 0.25);
  }
  if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
    min = (last?.close ?? 1) * 0.98;
    max = (last?.close ?? 1) * 1.02;
  }
  const pad = (max - min) * 0.06;
  min -= pad;
  max += pad;
  const y = (price: number) => padT + ((max - price) / (max - min)) * priceH;
  const yRsi = (value: number) => padT + priceH + gap + ((100 - value) / 100) * rsiH;
  const macdVals = bars.map((bar) => bar.macd).filter((value): value is number => value != null);
  const macdMax = Math.max(0.000001, ...macdVals.map((value) => Math.abs(value)));
  const macdTop = padT + priceH + gap + rsiH + gap;
  const yMacd = (value: number) => macdTop + ((macdMax - value) / (2 * macdMax)) * macdH;

  const dim = (kind: number) => (active == null || active === kind ? 1 : 0.22);
  const candleW = Math.max(1.5, (plotW / n) * 0.62);
  const hovered = hover != null ? bars[hover] : null;
  const dateLabel = hovered
    ? new Date(hovered.t).toLocaleString(locale === "en" ? "en-GB" : "fa-IR", {
        month: "short",
        day: "numeric",
        hour: read.interval === "4h" ? "2-digit" : undefined,
        minute: read.interval === "4h" ? "2-digit" : undefined,
        timeZone: "Asia/Tehran",
      })
    : "";

  const band = bandPath(bars, x, y);
  const avg50 = linePath(bars, (bar) => bar.sma50, x, y);
  const avg200 = linePath(bars, (bar) => bar.sma200, x, y);
  const rsiPath = linePath(bars, (bar) => bar.rsi, x, yRsi);

  function onMove(event: PointerEvent<SVGSVGElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const local = event.clientX - rect.left;
    const i = Math.round(((local - padL) / plotW) * n - 0.5);
    if (i < 0 || i >= bars.length) setHover(null);
    else setHover(i);
  }

  return (
    <div ref={host} className="min-w-0" dir="ltr">
      <p id={labelId} className="num mb-2 min-h-5 text-xs text-subtle">
        {hovered ? (
          <>
            {dateLabel} · O {formatPx(hovered.open)} · H {formatPx(hovered.high)} · L {formatPx(hovered.low)} · C{" "}
            {formatPx(hovered.close)}
            {hovered.rsi != null ? ` · RSI ${hovered.rsi.toFixed(0)}` : ""}
          </>
        ) : (
          tr("روی نمودار بکش تا همان کندل خوانده شود", "Drag across the chart to read that candle")
        )}
      </p>
      <svg
        width={width}
        height={height}
        role="img"
        aria-labelledby={labelId}
        className="max-w-full touch-pan-y"
        onPointerMove={onMove}
        onPointerLeave={() => setHover(null)}
      >
        <Band d={band} opacity={dim(3)} />
        {bars.map((bar, i) => (
          <Candle key={bar.t} bar={bar} x={x(i)} y={y} width={candleW} hot={hover === i} />
        ))}
        {avg200 ? <path d={avg200} fill="none" stroke="var(--color-accent)" strokeWidth={active === 1 ? 2.4 : 1.4} opacity={dim(1)} /> : null}
        {avg50 ? <path d={avg50} fill="none" stroke="var(--color-warn)" strokeWidth={active === 1 ? 2.4 : 1.4} opacity={dim(1)} /> : null}
        {read.marks.map((mark) => (
          <MarkLine key={mark.id} mark={mark} y={y(mark.price)} width={padL + plotW} opacity={markOpacity(mark.id, active)} />
        ))}
        {last && read.atr ? (
          <line
            x1={x(bars.length - 1) + candleW * 0.8}
            x2={x(bars.length - 1) + candleW * 0.8}
            y1={y(last.close)}
            y2={y(last.close - read.atr)}
            stroke="var(--color-warn)"
            strokeWidth={active === 3 ? 3 : 1.5}
            opacity={dim(3)}
          />
        ) : null}
        {hover != null ? <line x1={x(hover)} x2={x(hover)} y1={padT} y2={padT + priceH} stroke="var(--color-border-strong)" /> : null}
        <Axis min={min} max={max} y={y} x={padL + plotW + 8} />
        <text x={padL} y={padT + priceH + 14} fill="var(--color-subtle)" fontSize="11" fontFamily="IBM Plex Mono">
          RSI 14
        </text>
        {[30, 50, 70].map((level) => (
          <line
            key={level}
            x1={padL}
            x2={padL + plotW}
            y1={yRsi(level)}
            y2={yRsi(level)}
            stroke="var(--color-border)"
            strokeDasharray={level === 50 ? "0" : "3 3"}
            opacity={dim(4)}
          />
        ))}
        {rsiPath ? <path d={rsiPath} fill="none" stroke="var(--color-accent)" strokeWidth={1.6} opacity={dim(4)} /> : null}
        <text x={padL} y={macdTop - 6} fill="var(--color-subtle)" fontSize="11" fontFamily="IBM Plex Mono">
          MACD
        </text>
        <line x1={padL} x2={padL + plotW} y1={yMacd(0)} y2={yMacd(0)} stroke="var(--color-border)" opacity={dim(5)} />
        {bars.map((bar, i) =>
          bar.macd == null ? null : (
            <rect
              key={`m-${bar.t}`}
              x={x(i) - candleW / 2}
              y={Math.min(yMacd(0), yMacd(bar.macd))}
              width={candleW}
              height={Math.max(1, Math.abs(yMacd(bar.macd) - yMacd(0)))}
              fill={bar.macd >= 0 ? "var(--color-up)" : "var(--color-down)"}
              opacity={dim(5)}
            />
          ),
        )}
      </svg>
    </div>
  );
}

function markOpacity(id: string, active: number | null): number {
  if (active == null) return 1;
  if (active === 1) return id === "sma50" || id === "sma200" ? 1 : 0.2;
  if (active === 2) return id === "support" || id === "resistance" || id === "pivot" ? 1 : 0.2;
  if (active === 3) return 0.35;
  return 0.45;
}

function Axis({ min, max, y, x }: { min: number; max: number; y: (price: number) => number; x: number }) {
  const ticks = [max, (max + min) / 2, min];
  return (
    <>
      {ticks.map((tick) => (
        <text key={tick} x={x} y={y(tick) + 4} fill="var(--color-subtle)" fontSize="11" fontFamily="IBM Plex Mono">
          {formatPx(tick)}
        </text>
      ))}
    </>
  );
}

function Band({ d, opacity }: { d: string; opacity: number }) {
  if (!d) return null;
  return <path d={d} fill="var(--color-fg)" opacity={0.06 * opacity} />;
}

function Candle({
  bar,
  x,
  y,
  width,
  hot,
}: {
  bar: ChartBar;
  x: number;
  y: (price: number) => number;
  width: number;
  hot: boolean;
}) {
  const up = bar.close >= bar.open;
  const color = up ? "var(--color-up)" : "var(--color-down)";
  const top = y(Math.max(bar.open, bar.close));
  const bot = y(Math.min(bar.open, bar.close));
  return (
    <g opacity={hot ? 1 : 0.92}>
      <line x1={x} x2={x} y1={y(bar.high)} y2={y(bar.low)} stroke={color} strokeWidth={hot ? 1.6 : 1} />
      <rect x={x - width / 2} y={top} width={width} height={Math.max(1, bot - top)} fill={color} />
    </g>
  );
}

function MarkLine({ mark, y, width, opacity }: { mark: ChartMark; y: number; width: number; opacity: number }) {
  const stroke =
    mark.tone === "warn"
      ? "var(--color-warn)"
      : mark.tone === "up"
        ? "var(--color-up)"
        : mark.tone === "down"
          ? "var(--color-down)"
          : mark.tone === "subtle"
            ? "var(--color-subtle)"
            : "var(--color-accent)";
  return (
    <line
      x1={8}
      x2={width}
      y1={y}
      y2={y}
      stroke={stroke}
      strokeDasharray={mark.dash ? "4 4" : undefined}
      strokeWidth={1.25}
      opacity={opacity}
    />
  );
}

function linePath(
  bars: ChartBar[],
  pick: (bar: ChartBar) => number | null,
  x: (i: number) => number,
  y: (price: number) => number,
): string {
  let d = "";
  bars.forEach((bar, i) => {
    const value = pick(bar);
    if (value == null || !Number.isFinite(value)) return;
    d += `${d ? "L" : "M"}${x(i).toFixed(1)},${y(value).toFixed(1)}`;
  });
  return d;
}

function bandPath(bars: ChartBar[], x: (i: number) => number, y: (price: number) => number): string {
  const upper: string[] = [];
  const lower: string[] = [];
  bars.forEach((bar, i) => {
    if (bar.upper == null || bar.lower == null) return;
    upper.push(`${x(i).toFixed(1)},${y(bar.upper).toFixed(1)}`);
    lower.push(`${x(i).toFixed(1)},${y(bar.lower).toFixed(1)}`);
  });
  if (upper.length < 2) return "";
  return `M${upper.join("L")}L${lower.reverse().join("L")}Z`;
}
