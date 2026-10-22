import { useEffect, useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { loadDeskSettings, saveDeskSettings } from "@/lib/crypto/desk-client";
import {
  buildMachineTicket,
  focusFromResult,
  readSession,
  ticketText,
  type MachineRung,
  type MachineStance,
  type SessionRead,
} from "@/lib/crypto/machine";
import { loadUsdtRate } from "@/lib/crypto/ops";
import type { AnalysisResult } from "@/lib/crypto/types";
import { useI18n } from "@/lib/i18n/locale";
import { CoinMark } from "./coin-mark";
import { formatUsd } from "./format";

const CORE_KEY = "alpha-spot-holds-core";
const RISK_KEY = "alpha-spot-risk-pct";
const RISKS = [0.5, 1, 1.5, 2] as const;

export function SessionClocks() {
  const { tr } = useI18n();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(id);
  }, []);
  const session = readSession(now);
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm text-fg">{tr(session.labelFa, session.labelEn)}</p>
        <p className="text-xs text-muted">{tr(session.adviceFa, session.adviceEn)}</p>
      </div>
      <ClockRow session={session} />
    </div>
  );
}

export function BuyMachine({
  result,
  live,
}: {
  result: AnalysisResult;
  live: Record<string, number>;
}) {
  const { tr, locale } = useI18n();
  const rateFn = useServerFn(loadUsdtRate);
  const [capital, setCapital] = useState(() => loadDeskSettings().capitalUsd);
  const [riskPct, setRiskPct] = useState(1);
  const [holdsCore, setHoldsCore] = useState(false);
  const [filled, setFilled] = useState<Record<string, boolean>>({});
  const [toman, setToman] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setRiskPct(readRisk());
    setHoldsCore(readFlag(CORE_KEY));
    setReady(true);
    let stop = false;
    void rateFn()
      .then((rate) => {
        if (!stop) setToman(rate.toman);
      })
      .catch(() => {
        if (!stop) setToman(null);
      });
    return () => {
      stop = true;
    };
  }, [rateFn]);

  const ticket = useMemo(() => {
    const focus = focusFromResult(result, live, holdsCore);
    return buildMachineTicket(focus, capital, riskPct);
  }, [result, live, holdsCore, capital, riskPct]);

  const ticketId = `${result.generatedAt}:${ticket.symbol}:${ticket.stance}`;
  useEffect(() => {
    setFilled({});
  }, [ticketId]);

  function setCapitalUsd(next: number) {
    const safe = Math.max(0, next);
    setCapital(safe);
    saveDeskSettings({ ...loadDeskSettings(), capitalUsd: safe });
  }

  function setRisk(next: number) {
    setRiskPct(next);
    try {
      localStorage.setItem(RISK_KEY, String(next));
    } catch {
      /* private mode */
    }
  }

  function setCore(next: boolean) {
    setHoldsCore(next);
    try {
      localStorage.setItem(CORE_KEY, next ? "1" : "0");
    } catch {
      /* private mode */
    }
  }

  async function onCopy() {
    const text = ticketText(ticket, locale === "en" ? "en" : "fa", toman);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  const span = Math.max(ticket.target - ticket.invalidation, 1);
  const marker = (price: number) =>
    Math.min(100, Math.max(0, ((price - ticket.invalidation) / span) * 100));
  const filledRungs = ticket.rungs.filter((rung) => filled[rung.key]);
  const filledUsd = filledRungs.reduce((sum, rung) => sum + rung.notionalUsd, 0);
  const filledQty = filledRungs.reduce((sum, rung) => sum + rung.qty, 0);
  const avgFilled = filledQty > 0 ? filledUsd / filledQty : null;

  return (
    <section className="flex flex-col gap-4">
      <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-xl">
            <p className="text-xs text-subtle">{tr("ماشین خرید اسپات", "Spot buy machine")}</p>
            <h2 className="mt-1 text-2xl font-medium tracking-tight text-fg md:text-3xl">
              {tr(ticket.headlineFa, ticket.headlineEn)}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{tr(ticket.orderFa, ticket.orderEn)}</p>
          </div>
          <StanceMark stance={ticket.stance} label={tr(stanceWord(ticket.stance)[0], stanceWord(ticket.stance)[1])} />
        </div>

        {ticket.symbol !== "USDT" ? (
          <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
            <CoinMark symbol={ticket.symbol} name={ticket.name} rank={ticket.rank || undefined} size="lg" />
            <div className="text-start md:text-end">
              <p className="text-xs text-subtle">{tr("قیمت لحظه", "Live price")}</p>
              <p className="num text-3xl text-fg">${formatUsd(ticket.livePrice)}</p>
              {toman ? (
                <p className="num text-xs text-muted">{formatToman(ticket.livePrice * toman)} {tr("تومان", "toman")}</p>
              ) : (
                <p className="text-xs text-subtle">{tr("نرخ تومان الان نیامد", "Toman rate did not arrive")}</p>
              )}
            </div>
          </div>
        ) : null}

        {ticket.stance !== "flat" ? (
          <div className="mt-6" dir="ltr">
            <div className="relative h-2 rounded-full bg-elevated">
              <div
                className="absolute inset-y-0 rounded-full bg-up/30"
                style={{
                  left: `${marker(ticket.zoneLow)}%`,
                  width: `${Math.max(marker(ticket.zoneHigh) - marker(ticket.zoneLow), 1.5)}%`,
                }}
              />
              <span
                className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg"
                style={{ left: `${marker(ticket.livePrice)}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between text-xs text-subtle">
              <span className="num text-down">${formatUsd(ticket.invalidation)}</span>
              <span>{tr(ticket.zoneSourceFa, ticket.zoneSourceEn)}</span>
              <span className="num text-up">${formatUsd(ticket.target)}</span>
            </div>
          </div>
        ) : null}

        <dl className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat k={tr("ناحیه", "Zone")} v={ticket.stance === "flat" && ticket.symbol === "USDT" ? "—" : `$${formatUsd(ticket.zoneLow)} – $${formatUsd(ticket.zoneHigh)}`} />
          <Stat k={tr("ابطال", "Invalidation")} v={ticket.symbol === "USDT" ? "—" : `$${formatUsd(ticket.invalidation)}`} />
          <Stat k={tr("خرید تازه", "New buy")} v={ticket.notionalUsd > 0 ? `$${formatUsd(ticket.notionalUsd)}` : tr("صفر", "Zero")} />
          <Stat
            k={tr("ریسک تا ابطال", "Risk to invalidation")}
            v={ticket.riskUsd > 0 ? `$${formatUsd(ticket.riskUsd)}` : "—"}
            tone={ticket.riskUsd > 0 ? "warn" : undefined}
          />
        </dl>
        {ticket.rewardRisk != null && ticket.notionalUsd > 0 ? (
          <p className="mt-3 text-xs text-subtle">
            {tr("پاداش به ریسک", "Reward to risk")}{" "}
            <span className="num text-fg">{ticket.rewardRisk.toFixed(2)}</span>
            {ticket.avgEntry ? (
              <>
                {" · "}
                {tr("میانگین اگر هر سه پر شود", "Average if all three fill")}{" "}
                <span className="num text-fg">${formatUsd(ticket.avgEntry)}</span>
              </>
            ) : null}
            {ticket.capped ? ` · ${tr("حجم به سقف مدل خورد، نه به ریسک خام", "Size hit the model cap, not the raw risk")}` : ""}
          </p>
        ) : null}
        {ticket.asideFa ? <p className="mt-3 text-sm leading-relaxed text-muted">{tr(ticket.asideFa, ticket.asideEn ?? undefined)}</p> : null}
      </div>

      <div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <label className="flex min-w-40 flex-1 flex-col gap-2 text-xs text-subtle">
              {tr("سرمایه (دلار)", "Capital (USD)")}
              <input
                inputMode="decimal"
                className="num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
                value={capital}
                onChange={(e) => setCapitalUsd(Number(e.target.value) || 0)}
              />
            </label>
            <div className="flex flex-col gap-2">
              <p className="text-xs text-subtle">{tr("ریسک هر بلیت", "Risk per ticket")}</p>
              <div className="flex gap-1">
                {RISKS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRisk(value)}
                    className={
                      riskPct === value
                        ? "num h-11 min-w-12 rounded-md bg-accent px-3 text-sm text-accent-fg"
                        : "num h-11 min-w-12 rounded-md bg-elevated px-3 text-sm text-muted"
                    }
                  >
                    {value}%
                  </button>
                ))}
              </div>
            </div>
          </div>
          {ready && ticket.sleeve !== "cash" ? (
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setCore(false)}
                className={
                  holdsCore
                    ? "h-11 flex-1 rounded-md bg-elevated px-3 text-sm text-muted"
                    : "h-11 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                }
              >
                {tr("هنوز بیت‌کوین ندارم", "I do not hold Bitcoin yet")}
              </button>
              <button
                type="button"
                onClick={() => setCore(true)}
                className={
                  holdsCore
                    ? "h-11 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                    : "h-11 flex-1 rounded-md bg-elevated px-3 text-sm text-muted"
                }
              >
                {tr("هسته را دارم", "I already hold the core")}
              </button>
            </div>
          ) : null}
          {toman ? (
            <p className="mt-3 text-xs text-subtle">
              {tr("تتر", "Tether")} <span className="num text-fg">{formatToman(toman)}</span> {tr("تومان · نوبیتکس یا والکس", "toman · Nobitex or Wallex")}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col justify-between gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
          <div>
            <p className="text-sm text-fg">{tr(ticket.session.labelFa, ticket.session.labelEn)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{tr(ticket.session.adviceFa, ticket.session.adviceEn)}</p>
          </div>
          <ClockRow session={ticket.session} />
          <Button type="button" variant="outline" onClick={() => void onCopy()}>
            {copied ? <Check /> : <Copy />}
            {copied ? tr("کپی شد", "Copied") : tr("کپی بلیت", "Copy ticket")}
          </Button>
        </div>
      </div>

      {ticket.rungs.length > 0 ? (
        <ol className="grid gap-3 md:grid-cols-3">
          {ticket.rungs.map((rung, index) => (
            <RungCard
              key={rung.key}
              rung={rung}
              index={index}
              symbol={ticket.symbol}
              toman={toman}
              on={Boolean(filled[rung.key])}
              onToggle={() => setFilled((prev) => ({ ...prev, [rung.key]: !prev[rung.key] }))}
            />
          ))}
        </ol>
      ) : null}

      {avgFilled != null ? (
        <p className="text-sm text-muted">
          {tr("پر شده روی همین دستگاه", "Marked filled on this device")}{" "}
          <span className="num text-fg">${formatUsd(filledUsd)}</span>
          {" · "}
          {tr("میانگین", "average")} <span className="num text-fg">${formatUsd(avgFilled)}</span>
          {ticket.invalidation > 0 && avgFilled > ticket.invalidation ? (
            <>
              {" · "}
              {tr("فاصله تا ابطال", "distance to invalidation")}{" "}
              <span className="num text-down">{(((avgFilled - ticket.invalidation) / avgFilled) * 100).toFixed(1)}%</span>
            </>
          ) : null}
        </p>
      ) : null}

      <p className="text-xs leading-relaxed text-subtle">
        {tr(
          "بلیت سفارش را به صرافی نمی‌فرستد. سه لیمیت است با حجم مشخص، تا عادت مارکت‌خریدن سقف از بین برود. پر شدن را خودت علامت می‌زنی.",
          "The ticket does not send an order to an exchange. It is three limits with a size, so the habit of market-buying the high dies. You mark the fills yourself.",
        )}
      </p>
    </section>
  );
}

function RungCard({
  rung,
  index,
  symbol,
  toman,
  on,
  onToggle,
}: {
  rung: MachineRung;
  index: number;
  symbol: string;
  toman: number | null;
  on: boolean;
  onToggle: () => void;
}) {
  const { tr } = useI18n();
  const name =
    rung.key === "touch" ? tr("لمس ناحیه", "Touch") : rung.key === "mid" ? tr("میانه", "Mid") : tr("کف ناحیه", "Deep");
  return (
    <li className="flex flex-col gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-center justify-between text-xs text-subtle">
        <span className="num">{index + 1}</span>
        <span>{name}</span>
      </div>
      <p className="num text-2xl text-fg">${formatUsd(rung.price)}</p>
      <p className="text-sm text-muted">
        <span className="num text-fg">${formatUsd(rung.notionalUsd)}</span>
        {toman ? <span className="num"> · {formatToman(rung.notionalUsd * toman)}</span> : null}
      </p>
      <p className="num text-xs text-subtle">
        {rung.qty.toFixed(rung.qty >= 1 ? 4 : 6)} {symbol}
        {" · "}
        {(rung.distancePct * 100).toFixed(1)}%
      </p>
      <button
        type="button"
        onClick={onToggle}
        className={
          on
            ? "h-11 rounded-md bg-up/15 text-sm text-up"
            : "h-11 rounded-md bg-elevated text-sm text-muted"
        }
      >
        {on ? tr("این پله را گذاشتم", "This rung is placed") : tr("هنوز نگذاشته‌ام", "Not placed yet")}
      </button>
    </li>
  );
}

function StanceMark({ stance, label }: { stance: MachineStance; label: string }) {
  const tone =
    stance === "buy" ? "text-up bg-up-dim" : stance === "park" ? "text-warn bg-warn-dim" : "text-down bg-down-dim";
  return <span className={`rounded-md px-3 py-2 text-sm ${tone}`}>{label}</span>;
}

function stanceWord(stance: MachineStance): [string, string] {
  if (stance === "buy") return ["خرید زنده", "Live buy"];
  if (stance === "park") return ["لیمیت پارک", "Parked limits"];
  return ["دست نگه دار", "Stand down"];
}

function ClockRow({ session }: { session: SessionRead }) {
  const { tr } = useI18n();
  const cells: [string, string][] = [
    [tr("تهران", "Tehran"), session.tehran],
    [tr("لندن", "London"), session.london],
    [tr("نیویورک", "New York"), session.newYork],
  ];
  return (
    <ul className="flex gap-2">
      {cells.map(([label, time]) => (
        <li key={label} className="min-w-16 flex-1 rounded-md bg-elevated px-2 py-2">
          <p className="text-xs text-subtle">{label}</p>
          <p className="num text-sm text-fg">{time}</p>
        </li>
      ))}
    </ul>
  );
}

function Stat({ k, v, tone }: { k: string; v: string; tone?: "warn" }) {
  return (
    <div>
      <dt className="text-xs text-subtle">{k}</dt>
      <dd className={tone === "warn" ? "num mt-1 text-sm text-warn" : "num mt-1 text-sm text-fg"}>{v}</dd>
    </div>
  );
}

function formatToman(n: number): string {
  if (!(n > 0)) return "—";
  return Math.round(n).toLocaleString("en-US");
}

function readRisk(): number {
  try {
    const n = Number(localStorage.getItem(RISK_KEY));
    if (RISKS.includes(n as (typeof RISKS)[number])) return n;
  } catch {
    /* private mode */
  }
  return 1;
}

function readFlag(key: string): boolean {
  try {
    return localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}
