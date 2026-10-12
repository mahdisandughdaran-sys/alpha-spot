import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { LoaderCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { readConfluence } from "@/lib/crypto/confluence-call";
import { sizePosition, type ConfluenceReport, type Decision, type FlowLabel } from "@/lib/crypto/confluence";
import { loadDeskSettings, saveDeskSettings } from "@/lib/crypto/desk-client";
import { formatUsd } from "./format";

const COINS = ["BTC", "ETH", "SOL", "BNB", "XRP", "TON", "DOGE", "LINK", "AVAX", "SUI"];
const RISK_KEY = "alpha-spot-confluence-v1";

const FLOW_LABEL: Record<FlowLabel, string> = {
  institutional: "خرید نهادی",
  absorption: "جذب فروش",
  fake_pump: "پامپ توخالی",
  distribution: "توزیع",
  balanced: "متعادل",
};

const DECISION_LABEL: Record<Decision, string> = {
  BUY: "خرید",
  WAIT: "صبر",
  AVOID: "اجتناب",
};

function loadRisk(): number {
  try {
    const raw = localStorage.getItem(RISK_KEY);
    const n = raw ? Number(JSON.parse(raw).riskPct) : 2;
    return Number.isFinite(n) && n > 0 ? n : 2;
  } catch {
    return 2;
  }
}

function tone(decision: Decision): string {
  if (decision === "BUY") return "bg-up-dim text-up";
  if (decision === "WAIT") return "bg-warn-dim text-warn";
  return "bg-down-dim text-down";
}

export function ConfluencePanel({ defaultSymbol }: { defaultSymbol: string }) {
  const load = useServerFn(readConfluence);
  const [symbol, setSymbol] = useState(defaultSymbol);
  const [draft, setDraft] = useState(defaultSymbol);
  const [report, setReport] = useState<ConfluenceReport | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [capital, setCapital] = useState(10_000);
  const [riskPct, setRiskPct] = useState(2);
  const [stopPct, setStopPct] = useState(2.5);
  const [stopLocked, setStopLocked] = useState(false);
  const [chartReady, setChartReady] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    setCapital(loadDeskSettings().capitalUsd);
    setRiskPct(loadRisk());
    setChartReady(true);
  }, []);

  useEffect(() => {
    let stop = false;
    async function run() {
      setBusy(true);
      setError(null);
      try {
        const row = await load({ data: { symbol } });
        if (stop) return;
        setReport(row);
        setStopLocked(false);
        setStopPct(Number((row.judgement.stopPct * 100).toFixed(2)));
      } catch (err) {
        if (!stop) {
          setReport(null);
          setError(err instanceof Error ? err.message : "داده جریان خوانده نشد.");
        }
      } finally {
        if (!stop) setBusy(false);
      }
    }
    void run();
    return () => {
      stop = true;
    };
  }, [symbol, load, nonce]);

  const sized = useMemo(
    () => sizePosition(capital, riskPct / 100, stopPct / 100),
    [capital, riskPct, stopPct],
  );

  const verdict = report?.judgement;
  const allowed =
    verdict && verdict.decision !== "AVOID" && verdict.entryPrice != null ? sized.positionUsd : 0;
  const entryText =
    verdict?.entryPrice != null && verdict.decision !== "AVOID" ? `$${formatUsd(verdict.entryPrice)}` : "ندارد";
  const styleText =
    verdict?.entryStyle === "market"
      ? "بازار، روی قیمت فعلی"
      : verdict?.entryStyle === "limit_sweep"
        ? "لیمیت زیر خوشه لیکوییدیشن"
        : "بدون سفارش";

  function setCapitalUsd(value: number) {
    const next = Math.max(0, value);
    setCapital(next);
    saveDeskSettings({ ...loadDeskSettings(), capitalUsd: next });
  }

  function setRisk(value: number) {
    const next = Math.min(20, Math.max(0, value));
    setRiskPct(next);
    localStorage.setItem(RISK_KEY, JSON.stringify({ riskPct: next }));
  }

  function applySymbol(raw: string) {
    const next = raw.trim().toUpperCase();
    if (!/^[A-Z0-9]{2,12}$/.test(next)) {
      setError("نماد را با حروف انگلیسی وارد کنید.");
      return;
    }
    setError(null);
    setDraft(next);
    setSymbol(next);
  }

  const flow = report?.flow;
  const buyShare = flow && flow.buy24h + flow.sell24h > 0 ? flow.buy24h / (flow.buy24h + flow.sell24h) : 0.5;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <h3 className="text-base font-medium text-fg">همگرایی خرید اسپات</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            جریان حجم، نقشه لیکوییدیشن و اندازه پوزیشن با هم خوانده می‌شوند. خروجی یک جمله است:
            نقطه ورود و دلاری که فرمول ریسک اجازه می‌دهد.
          </p>
        </div>
        <Button variant="outline" onClick={() => setNonce((n) => n + 1)} disabled={busy}>
          {busy ? <LoaderCircle className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          خواندن دوباره
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {COINS.map((coin) => (
          <button
            key={coin}
            type="button"
            onClick={() => applySymbol(coin)}
            className={
              coin === symbol
                ? "num h-11 shrink-0 rounded-md bg-elevated px-4 text-sm text-fg"
                : "num h-11 shrink-0 rounded-md bg-surface px-4 text-sm text-muted"
            }
          >
            {coin}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          applySymbol(draft);
        }}
      >
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value.toUpperCase())}
          className="num h-11 min-w-0 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
          dir="ltr"
          aria-label="نماد"
          placeholder="BTC"
        />
        <Button type="submit" variant="outline" className="shrink-0">
          نماد
        </Button>
      </form>

      {busy && !report ? (
        <div className="rounded-xl bg-surface p-6">
          <p className="text-sm text-fg">کندل اسپات، تیکر خریدار و خوشه‌های لیکوییدیشن خوانده می‌شود.</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
          </div>
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl bg-surface p-5">
          <p className="text-sm text-down">{error}</p>
        </div>
      ) : null}

      {report && flow && verdict ? (
        <>
          <div className={`rounded-xl p-5 ${tone(verdict.decision)}`}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="num text-xs tracking-widest">{verdict.decision}</p>
              <p className="num text-sm">{report.pair}</p>
            </div>
            <p className="mt-3 text-lg font-medium leading-relaxed text-fg">
              بهترین نقطه ورود: <span className="num">{entryText}</span>
              {" | "}
              حجم مجاز خرید: <span className="num">${formatUsd(allowed)}</span>
            </p>
            <p className="mt-2 text-sm text-fg">
              {DECISION_LABEL[verdict.decision]} · {styleText}
              {report.price ? (
                <>
                  {" "}
                  · قیمت <span className="num">${formatUsd(report.price)}</span>
                </>
              ) : null}
            </p>
          </div>

          <article className="rounded-xl bg-surface p-5">
            <header className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="num text-xs text-subtle">۰۱</p>
                <h4 className="mt-1 text-sm text-fg">جریان حجم</h4>
              </div>
              <p className={`rounded-md px-3 py-1 text-xs ${flow.label === "fake_pump" || flow.label === "distribution" ? "bg-down-dim text-down" : flow.label === "balanced" ? "bg-elevated text-muted" : "bg-up-dim text-up"}`}>
                {FLOW_LABEL[flow.label]}
              </p>
            </header>
            <p className="mt-3 text-sm leading-relaxed text-muted">{verdict.reasons[0]}</p>
            <div className="mt-4 flex h-3 overflow-hidden rounded-full bg-down" dir="ltr">
              <div className="h-full bg-up" style={{ width: `${buyShare * 100}%` }} />
            </div>
            <div className="mt-2 flex justify-between text-xs text-subtle">
              <span>
                خریدار ۲۴س <span className="num text-up">{(buyShare * 100).toFixed(1)}٪</span>
              </span>
              <span>
                فروشنده <span className="num text-down">{((1 - buyShare) * 100).toFixed(1)}٪</span>
              </span>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat k="خرید ۴س" v={`${(flow.buyRatio4h * 100).toFixed(1)}٪`} />
              <Stat k="خرید ۲۴س" v={`${(flow.buyRatio24h * 100).toFixed(1)}٪`} />
              <Stat k="بازده ۴س" v={`${flow.ret4h >= 0 ? "+" : ""}${(flow.ret4h * 100).toFixed(2)}٪`} />
              <Stat k="شتاب حجم" v={flow.volumeAccel.toFixed(2)} />
            </dl>
            <div className="mt-4 h-28 w-full" dir="ltr">
              {chartReady ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={flow.points.map((point, index) => ({ i: index, delta: point.delta }))}>
                    <XAxis dataKey="i" hide />
                    <Tooltip
                      cursor={{ fill: "var(--color-elevated)" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const n = Number(payload[0]?.value);
                        if (!Number.isFinite(n)) return null;
                        return (
                          <div className="glass-pop rounded-lg px-3 py-2">
                            <p className="text-xs text-subtle">دلتای ساعتی</p>
                            <p className={`num text-sm ${n >= 0 ? "text-up" : "text-down"}`}>{n.toFixed(2)}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="delta" radius={2}>
                      {flow.points.map((point) => (
                        <Cell key={point.t} fill={point.delta >= 0 ? "var(--color-up)" : "var(--color-down)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full rounded-md bg-elevated" />
              )}
            </div>
          </article>

          <article className="rounded-xl bg-surface p-5">
            <header className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <p className="num text-xs text-subtle">۰۲</p>
                <h4 className="mt-1 text-sm text-fg">نقشه لیکوییدیشن</h4>
              </div>
              <p className="text-xs text-subtle">
                {report.candleSource === "futures" ? "کندل فیوچرز" : "کندل اسپات، فیوچرز در دسترس نبود"}
              </p>
            </header>
            <p className={`mt-3 rounded-md px-3 py-3 text-sm leading-relaxed ${verdict.insideWall ? "bg-down-dim text-down" : verdict.sweepZone ? "bg-warn-dim text-warn" : "bg-elevated text-fg"}`}>
              {verdict.alert}
            </p>
            <dl className="mt-4 grid grid-cols-3 gap-3">
              <Stat
                k="فاندینگ ۸س"
                v={report.funding8h == null ? "—" : `${(report.funding8h * 100).toFixed(4)}٪`}
              />
              <Stat
                k="سود باز"
                v={report.openInterestUsd == null ? "—" : `$${formatUsd(report.openInterestUsd)}`}
              />
              <Stat k="لانگ/شورت" v={report.longShortRatio == null ? "—" : report.longShortRatio.toFixed(2)} />
            </dl>
            <div className="mt-4 flex max-h-80 flex-col gap-1 overflow-y-auto" dir="ltr">
              <Heatmap price={report.price} bins={report.map.bins} />
            </div>
            <ul className="mt-4 grid gap-2 md:grid-cols-2">
              {report.map.clusters.slice(0, 4).map((cluster) => (
                <li key={`${cluster.side}-${cluster.price}`} className="rounded-md bg-elevated px-3 py-3 text-xs text-muted">
                  <span className={cluster.side === "long" ? "text-down" : "text-up"}>
                    {cluster.side === "long" ? "لانگ" : "شورت"}
                  </span>
                  {" "}
                  <span className="num text-fg">${formatUsd(cluster.price)}</span>
                  {" · "}
                  <span className="num">{(cluster.distance * 100).toFixed(2)}٪</span>
                  {" · حرارت "}
                  <span className="num">{cluster.heat.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-xl bg-surface p-5">
            <p className="num text-xs text-subtle">۰۳</p>
            <h4 className="mt-1 text-sm text-fg">حجم پوزیشن و توصیه</h4>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              حجم ($) = (سرمایه × ریسک٪) / حدضرر٪. حداکثر ضرر همان سرمایه ضربدر ریسک است، مستقل از حدضرر.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <Field
                label="سرمایه ($)"
                value={capital}
                onChange={setCapitalUsd}
              />
              <Field label="ریسک هر معامله (٪)" value={riskPct} onChange={setRisk} />
              <Field
                label="حد ضرر (٪)"
                value={stopPct}
                onChange={(value) => {
                  setStopLocked(true);
                  setStopPct(Math.min(50, Math.max(0, value)));
                }}
              />
            </div>
            {stopLocked ? (
              <button
                type="button"
                className="mt-2 text-xs text-muted"
                onClick={() => {
                  setStopLocked(false);
                  setStopPct(Number((verdict.stopPct * 100).toFixed(2)));
                }}
              >
                بازگشت حد ضرر به سطح مدل ({(verdict.stopPct * 100).toFixed(2)}٪)
              </button>
            ) : (
              <p className="mt-2 text-xs text-subtle">
                حد ضرر اولیه زیر خوشه لانگ است و بین ۱٫۵٪ تا ۸٪ بسته شده. می‌توانید عوضش کنید.
              </p>
            )}
            <dl className="mt-4 grid grid-cols-2 gap-3">
              <Stat k="حجم محاسبه‌شده" v={`$${formatUsd(sized.positionUsd)}`} />
              <Stat k="حداکثر ضرر" v={`$${formatUsd(sized.maxLossUsd)}`} />
              <Stat
                k="تعداد تقریبی"
                v={
                  verdict.entryPrice && sized.positionUsd > 0
                    ? (sized.positionUsd / verdict.entryPrice).toPrecision(4)
                    : "—"
                }
              />
              <Stat k="حد ضرر قیمتی" v={verdict.stopPrice ? `$${formatUsd(verdict.stopPrice)}` : "—"} />
            </dl>
            {verdict.decision === "AVOID" ? (
              <p className="mt-3 text-sm text-down">
                توصیه اجتناب است، پس حجم مجاز خرید صفر است. عدد بالا فقط خروجی فرمول است اگر خودتان خلاف سیگنال وارد شوید.
              </p>
            ) : null}
            {verdict.decision !== "AVOID" && sized.positionUsd > capital && capital > 0 ? (
              <p className="mt-3 text-sm text-warn">
                فرمول ${formatUsd(sized.positionUsd)} را می‌دهد که از سرمایه نقد بزرگ‌تر است. اسپات اهرم ندارد؛ سقف اجرایی ${formatUsd(capital)} است.
              </p>
            ) : null}
            <ul className="mt-4 flex flex-col gap-2">
              {verdict.reasons.slice(1).map((reason) => (
                <li key={reason} className="rounded-md bg-elevated px-3 py-3 text-sm leading-relaxed text-muted">
                  {reason}
                </li>
              ))}
            </ul>
          </article>

          <p className="text-xs leading-relaxed text-subtle">
            جریان حجم از حجم خرید تیکر کندل اسپات بایننس است؛ همان فشار خرید و فروشی که Volume Flow در Cryptometer نشان می‌دهد.
            نقشه، خوشه تخمینی است: اهرم ۵ تا ۱۰۰ روی پروفایل حجم، فقط سطوحی که هنوز سویپ نشده‌اند، با وزن فاندینگ و نسبت لانگ/شورت.
            دیوار اختصاصی Coinglass بدون کلید API جایگزین نشده. این توصیه سرمایه‌گذاری نیست.
          </p>
        </>
      ) : null}
    </section>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-md bg-elevated px-3 py-3">
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className="num mt-1 text-sm text-fg">{v}</dd>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  const [text, setText] = useState(String(value));
  useEffect(() => {
    if (Number(text) !== value) setText(String(value));
  }, [value, text]);

  return (
    <label className="flex flex-col gap-2 text-xs text-subtle">
      {label}
      <input
        inputMode="decimal"
        className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
        value={text}
        onChange={(event) => {
          const raw = event.target.value;
          setText(raw);
          const n = Number(raw);
          if (raw.trim() !== "" && Number.isFinite(n)) onChange(n);
        }}
      />
    </label>
  );
}

function Heatmap({
  price,
  bins,
}: {
  price: number;
  bins: ConfluenceReport["map"]["bins"];
}) {
  const rows = [...bins].sort((a, b) => b.price - a.price);
  const near = rows.filter((bin) => Math.abs(bin.price - price) / price < 0.08 || bin.longHeat > 0.2 || bin.shortHeat > 0.2);
  const shown = (near.length >= 8 ? near : rows).slice(0, 28);
  let marked = false;
  return (
    <>
      {shown.map((bin) => {
        const mark = !marked && bin.price <= price;
        if (mark) marked = true;
        const long = Math.round(bin.longHeat * 100);
        const short = Math.round(bin.shortHeat * 100);
        return (
          <div key={bin.price}>
            {mark ? (
              <div className="my-1 flex items-center gap-2 text-xs text-fg">
                <span className="num">${formatUsd(price)}</span>
                <span className="h-px flex-1 bg-accent" />
                <span>قیمت</span>
              </div>
            ) : null}
            <div className="grid grid-cols-[88px_1fr_1fr] items-center gap-2">
              <span className="num text-xs text-subtle">${formatUsd(bin.price)}</span>
              <div className="h-2 overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full bg-down" style={{ width: `${long}%` }} />
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-elevated">
                <div className="h-full rounded-full bg-up" style={{ width: `${short}%` }} />
              </div>
            </div>
          </div>
        );
      })}
      <div className="mt-2 flex justify-between text-xs text-subtle">
        <span className="text-down">حرارت لانگ، زیر قیمت</span>
        <span className="text-up">حرارت شورت، بالای قیمت</span>
      </div>
    </>
  );
}
