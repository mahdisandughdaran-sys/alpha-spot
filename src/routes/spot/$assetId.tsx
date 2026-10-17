import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinMark } from "@/components/desk/coin-mark";
import { LocaleSwitch } from "@/components/desk/locale-switch";
import { SpotLevelRuler, SpotPlanChart } from "@/components/desk/spot-plan-chart";
import { formatPct, formatUntil, timeAgoFa } from "@/components/desk/format";
import { loadSpotBoard, loadSpotDesk, type SpotBoard, type SpotBoardRow } from "@/lib/crypto/spot-desk";
import { formatSpotUsd, type SpotPlan } from "@/lib/crypto/spot-plan";
import { lockSpotPlan } from "@/lib/crypto/spot-lock";
import { useI18n } from "@/lib/i18n/locale";

const BOARD_TTL_MS = 2 * 60 * 1000;

let clientBoard: SpotBoard | null = null;
let clientAt = 0;

export const Route = createFileRoute("/spot/$assetId")({
  component: SpotDeskPage,
  head: () => ({
    meta: [{ title: "میز بیت‌کوین · ۲۰ ارز اول · آلفا اسپات" }],
  }),
});

type Filter = "all" | "buy" | "cash" | "exit";

function SpotDeskPage() {
  const { assetId } = Route.useParams();
  const { tr, locale } = useI18n();
  const load = useServerFn(loadSpotBoard);
  const reloadOne = useServerFn(loadSpotDesk);
  const detailRef = useRef<HTMLElement | null>(null);
  const [board, setBoard] = useState<SpotBoard | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [activeId, setActiveId] = useState(assetId);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    setActiveId(assetId);
  }, [assetId]);

  useEffect(() => {
    let stop = false;
    if (clientBoard && Date.now() - clientAt < BOARD_TTL_MS) {
      setBoard(clientBoard);
      setStatus("ready");
      return;
    }
    setStatus("loading");
    setError(null);
    void load({ data: { force: false } })
      .then((next) => {
        if (stop) return;
        clientBoard = next;
        clientAt = Date.now();
        setBoard(next);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (stop) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "تحلیل ۲۰ ارز انجام نشد.");
      });
    return () => {
      stop = true;
    };
    // The server function identity is stable for this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rows = useMemo(
    () => (board?.rows ?? []).map((row) => ({ ...row, plan: lockSpotPlan(row.plan) })),
    [board],
  );
  const active = rows.find((row) => row.assetId === activeId) ?? rows.find((row) => row.assetId === "btc") ?? rows[0] ?? null;
  const visible = rows.filter((row) => {
    if (filter === "buy") return row.plan.windows.some((item) => item.action === "buy");
    if (filter === "exit") return row.plan.action === "exit";
    if (filter === "cash") return row.plan.windows.every((item) => item.action === "cash") && row.plan.action !== "exit";
    return true;
  });
  const buys = rows.filter((row) => row.plan.windows.some((item) => item.action === "buy")).length;
  const sits = rows.filter((row) => row.plan.windows.every((item) => item.action === "cash") && row.plan.action !== "exit").length;
  const exits = rows.filter((row) => row.plan.action === "exit").length;
  const missing = status === "ready" && assetId !== "btc" && !rows.some((row) => row.assetId === assetId);

  const choose = (id: string) => {
    setActiveId(id);
    detailRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const refreshBoard = () => {
    setRefreshing(true);
    setError(null);
    void load({ data: { force: true } })
      .then((next) => {
        clientBoard = next;
        clientAt = Date.now();
        setBoard(next);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        setStatus("error");
        setError(err instanceof Error ? err.message : "تحلیل ۲۰ ارز انجام نشد.");
      })
      .finally(() => setRefreshing(false));
  };

  const refreshOne = (id: string) => {
    setRefreshing(true);
    void reloadOne({ data: { assetId: id } })
      .then((desk) => {
        setBoard((prev) => {
          if (!prev) return prev;
          const next: SpotBoard = {
            ...prev,
            fetchedAt: desk.fetchedAt,
            rows: prev.rows.map((row) => (row.assetId === id ? { ...row, plan: desk.plan } : row)),
          };
          clientBoard = next;
          clientAt = Date.now();
          return next;
        });
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "به‌روزرسانی این ارز انجام نشد.");
      })
      .finally(() => setRefreshing(false));
  };

  return (
    <main className="desk-grid min-h-dvh">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
            <Link to="/" className="inline-flex h-11 items-center gap-2 text-muted hover:text-fg">
              {locale === "en" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              {tr("میز اصلی", "Main desk")}
            </Link>
            <LocaleSwitch />
          </div>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="max-w-3xl">
              <p className="num text-xs tracking-widest text-subtle">ALPHA SPOT · BTC DESK</p>
              <h1 className="mt-2 text-4xl font-medium tracking-tight text-fg md:text-5xl">
                {tr("میز بیت‌کوین", "Bitcoin desk")}
              </h1>
              <p className="mt-3 text-base leading-relaxed text-muted">
                {tr(
                  "برای هر ارز سه حکم جدا ساخته می‌شود: یک روز، یک هفته، یک ماه. اگر آن بازه وقت خرید اسپات نباشد، جواب این است که هیچ ارزی نخری. حکم هفته و ماه تا پایان اعتبار عوض نمی‌شود.",
                  "Each coin gets three calls: one day, one week, one month. If that window is not a spot buy, the answer is to buy no coin. The week and month calls do not change before they expire.",
                )}
              </p>
            </div>
            <Button variant="outline" className="h-11 shrink-0" onClick={refreshBoard} disabled={status === "loading" || refreshing}>
              {refreshing ? <LoaderCircle className="size-4 animate-spin" /> : null}
              {tr("تحلیل دوباره", "Run again")}
            </Button>
          </div>
        </header>

        {status === "loading" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="flex items-center gap-2 text-sm text-fg">
              <LoaderCircle className="size-4 animate-spin" />
              {tr("کندل روزانهٔ ۲۰ ارز اول", "Daily candles for the top 20")}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
            </div>
            <p className="mt-3 text-xs text-subtle">
              {tr(
                "هر ارز با همان موتور بیت‌کوین سنجیده می‌شود: ناحیه خرید، فروش بالایی، فروش پایینی.",
                "Each coin uses the Bitcoin engine: a buy zone, an upside sell, and a downside sell.",
              )}
            </p>
          </section>
        ) : null}

        {status === "error" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-down">{tr("تحلیل ۲۰ ارز کامل نشد", "The top-20 plan did not finish")}</p>
            <p className="mt-2 text-sm text-muted">{error ? tr(error) : null}</p>
            <Button className="mt-4" onClick={refreshBoard}>
              {tr("تلاش دوباره", "Try again")}
            </Button>
          </section>
        ) : null}

        {status === "ready" && board && active ? (
          <>
            <section className="flex min-w-0 flex-col gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <FilterChip on={filter === "all"} label={tr(`همه ${rows.length}`, `All ${rows.length}`)} onClick={() => setFilter("all")} />
                <FilterChip on={filter === "buy"} label={tr(`بخر ${buys}`, `Buy ${buys}`)} onClick={() => setFilter("buy")} />
                <FilterChip on={filter === "cash"} label={tr(`نخر ${sits}`, `Buy none ${sits}`)} onClick={() => setFilter("cash")} />
                <FilterChip on={filter === "exit"} label={tr(`بفروش ${exits}`, `Sell ${exits}`)} onClick={() => setFilter("exit")} />
              </div>
              <p className="text-xs text-subtle">
                {board.source === "live"
                  ? tr(
                      `رتبه زنده از ${board.feed} · کندل روزانه بایننس · ${timeAgoFa(board.fetchedAt)}`,
                      `Live rank from ${board.feed} · Binance daily candles · ${timeAgoFa(board.fetchedAt)}`,
                    )
                  : tr(
                      `فهرست ذخیره، چون رتبه زنده نرسید · ${timeAgoFa(board.fetchedAt)}`,
                      `Saved list, because the live rank did not arrive · ${timeAgoFa(board.fetchedAt)}`,
                    )}
                {rows.length < 20
                  ? tr(
                      ` · ${rows.length} ارز کندل کامل داشتند`,
                      ` · ${rows.length} coins had a complete candle history`,
                    )
                  : null}
              </p>
              {missing ? (
                <p className="text-sm text-muted">
                  {tr(
                    "این نماد الان بین ۲۰ تای اول نیست. تحلیل بیت‌کوین نشان داده می‌شود.",
                    "That ticker is not in the current top 20. Bitcoin is on screen instead.",
                  )}
                </p>
              ) : null}
              {error ? <p className="text-sm text-down">{tr(error)}</p> : null}
              <BoardTable rows={visible} activeId={active.assetId} onPick={choose} />
            </section>

            <section ref={detailRef} className="flex scroll-mt-6 flex-col gap-3">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="num text-xs text-subtle">
                    {String(active.rank).padStart(2, "0")}
                    {active.marketRank != null ? ` · ${tr("بازار", "Mkt")} ${active.marketRank}` : ""}
                  </p>
                  <h2 className="mt-1 text-2xl font-medium tracking-tight text-fg">
                    {tr(active.plan.nameFa, active.plan.nameEn)}
                  </h2>
                </div>
                <CoinMark symbol={active.plan.symbol} name={tr(active.plan.nameFa, active.plan.nameEn)} />
              </div>
              <PlanBody
                plan={active.plan}
                fetchedAt={board.fetchedAt}
                refreshing={refreshing}
                onReload={() => refreshOne(active.assetId)}
              />
            </section>
          </>
        ) : null}

        <footer className="border-t border-border pt-4 text-xs leading-relaxed text-subtle">
          {tr(
            "این صفحه توصیه سرمایه‌گذاری نیست. سطح‌ها از کندل روزانه عمومی ساخته می‌شوند و می‌توانند اشتباه کنند. مسئولیت معامله با شماست.",
            "This page is not investment advice. Levels come from public daily candles and can be wrong. The trade is yours.",
          )}
        </footer>
      </div>
    </main>
  );
}

function FilterChip({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        on
          ? "inline-flex h-11 items-center rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
          : "inline-flex h-11 items-center rounded-lg bg-surface px-3 text-sm text-muted shadow-[var(--shadow-border)] hover:text-fg"
      }
    >
      {label}
    </button>
  );
}

function BoardTable({
  rows,
  activeId,
  onPick,
}: {
  rows: SpotBoardRow[];
  activeId: string;
  onPick: (id: string) => void;
}) {
  const { tr } = useI18n();
  if (rows.length === 0) {
    return (
      <p className="rounded-xl bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]">
        {tr("در این فیلتر ارزی نیست.", "Nothing in this filter.")}
      </p>
    );
  }
  return (
    <div className="max-w-full overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
      <table className="w-full min-w-[720px] text-start text-sm">
        <thead className="text-xs text-subtle">
          <tr className="border-b border-border">
            <th className="px-3 py-3 font-normal">{tr("رتبه", "Rank")}</th>
            <th className="px-3 py-3 font-normal">{tr("ارز", "Coin")}</th>
            <th className="px-3 py-3 font-normal">{tr("وضعیت", "Call")}</th>
            <th className="px-3 py-3 font-normal">{tr("قیمت", "Price")}</th>
            <th className="px-3 py-3 font-normal">{tr("بخر از", "Buy from")}</th>
            <th className="px-3 py-3 font-normal">{tr("فروش بالا", "Sell up")}</th>
            <th className="px-3 py-3 font-normal">{tr("فروش پایین", "Sell down")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const on = row.assetId === activeId;
            return (
              <tr
                key={row.assetId}
                tabIndex={0}
                onClick={() => onPick(row.assetId)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onPick(row.assetId);
                  }
                }}
                className={on ? "cursor-pointer bg-elevated" : "cursor-pointer hover:bg-elevated"}
              >
                <td className="num px-3 py-2 text-subtle">{String(row.rank).padStart(2, "0")}</td>
                <td className="px-3 py-2">
                  <span className="flex h-11 items-center gap-2 text-fg">
                    <span className="num">{row.plan.symbol}</span>
                    <span className="text-muted">{tr(row.plan.nameFa, row.plan.nameEn)}</span>
                  </span>
                </td>
                <td className={`px-3 py-2 ${callTone(row.plan)}`}>{callText(row.plan, tr)}</td>
                <td className="num px-3 py-2 text-fg">{formatSpotUsd(row.plan.price)}</td>
                <td className="num px-3 py-2 text-up">{formatSpotUsd(row.plan.entry)}</td>
                <td className="num px-3 py-2 text-warn">{formatSpotUsd(row.plan.takeProfit)}</td>
                <td className="num px-3 py-2 text-down">{formatSpotUsd(row.plan.invalidation)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function windowUntil(fetchedAt: string | null, validForMs: number): string {
  const base = fetchedAt ? Date.parse(fetchedAt) : Date.now();
  const start = Number.isFinite(base) ? base : Date.now();
  return new Date(start + validForMs).toISOString();
}

function callText(plan: SpotPlan, tr: (fa: string, en?: string) => string): string {
  if (plan.action === "exit" && plan.windows.every((item) => item.action === "cash")) {
    return tr("بفروش و نخر", "Sell, do not buy");
  }
  const open = plan.windows.filter((item) => item.action === "buy");
  if (!open.length) return tr("هیچ ارزی نخر", "Do not buy any coin");
  const longest = open[open.length - 1]!;
  return tr(`بخر · ${longest.titleFa}`, `Buy · ${longest.titleEn}`);
}

function callTone(plan: SpotPlan): string {
  if (plan.windows.some((item) => item.action === "buy")) return "text-up";
  if (plan.action === "exit") return "text-down";
  return "text-warn";
}

function PlanBody({
  plan,
  fetchedAt,
  refreshing,
  onReload,
}: {
  plan: SpotPlan;
  fetchedAt: string | null;
  refreshing: boolean;
  onReload: () => void;
}) {
  const { tr } = useI18n();
  const sitting = plan.windows.every((item) => item.action === "cash");
  const actionClass = sitting ? "text-warn" : "text-up";
  const size =
    plan.size === "full"
      ? tr("اندازه کامل", "Full size")
      : plan.size === "half"
        ? tr("نصف اندازه", "Half size")
        : tr("بدون ورود تازه", "No new entry");
  const confidence =
    plan.confidence === "high"
      ? tr("اعتماد بالا", "High confidence")
      : plan.confidence === "medium"
        ? tr("اعتماد متوسط", "Medium confidence")
        : tr("اعتماد پایین", "Low confidence");

  return (
    <div className="flex flex-col gap-4">
      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={`text-3xl font-medium tracking-tight ${actionClass}`}>{tr(plan.orderFa, plan.orderEn)}</p>
            {plan.headlineFa !== plan.orderFa ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{tr(plan.headlineFa, plan.headlineEn)}</p>
            ) : null}
            <div className="mt-4 grid gap-2 md:grid-cols-3">
              {plan.windows.map((item) => (
                <div key={item.horizon} className="rounded-lg bg-bg px-3 py-3">
                  <p className="text-xs text-subtle">{tr(item.titleFa, item.titleEn)}</p>
                  <p className={`mt-1 text-sm font-medium ${item.action === "buy" ? "text-up" : "text-warn"}`}>
                    {item.action === "buy" ? tr("بخر", "Buy") : tr("هیچ ارزی نخر", "Do not buy any coin")}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">{tr(item.noteFa, item.noteEn)}</p>
                  <p className="mt-2 text-xs text-subtle">
                    {tr("معتبر تا", "Valid until")}{" "}
                    <span className="num text-fg">{formatUntil(windowUntil(fetchedAt, item.validForMs))}</span>
                  </p>
                </div>
              ))}
            </div>
            {plan.holdFa ? <p className="mt-3 text-xs leading-relaxed text-warn">{tr(plan.holdFa, plan.holdEn ?? undefined)}</p> : null}
          </div>
          <div className="text-end">
            <p className="num text-2xl text-fg">{formatSpotUsd(plan.price)}</p>
            <p className="mt-1 text-xs text-subtle">
              {plan.pair}
              {fetchedAt ? ` · ${timeAgoFa(fetchedAt)}` : ""}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
          <span className="rounded-md bg-elevated px-2 py-1">{size}</span>
          <span className="rounded-md bg-elevated px-2 py-1">{confidence}</span>
          <span className="rounded-md bg-elevated px-2 py-1">
            {plan.regime === "bull"
              ? tr("روند روزانه صعودی", "Daily uptrend")
              : plan.regime === "bear"
                ? tr("روند روزانه نزولی", "Daily downtrend")
                : tr("روند روزانه رنج", "Daily range")}
          </span>
        </div>
      </section>

      <section className="grid gap-3 md:grid-cols-3">
        <LevelCard
          k={
            sitting
              ? tr("ناحیه تماشا، نه دستور خرید", "Watch zone, not a buy order")
              : tr("از این قیمت بخر", "Buy from this price")
          }
          value={formatSpotUsd(plan.entry)}
          detail={tr(plan.buyFa, plan.buyEn)}
          tone="text-up"
        />
        <LevelCard
          k={tr("اگر بالا رد شد بفروش", "Sell if it crosses up")}
          value={formatSpotUsd(plan.takeProfit)}
          detail={tr(plan.sellUpFa, plan.sellUpEn)}
          tone="text-warn"
        />
        <LevelCard
          k={tr("اگر پایین رد شد بفروش", "Sell if it crosses down")}
          value={formatSpotUsd(plan.invalidation)}
          detail={tr(plan.sellDownFa, plan.sellDownEn)}
          tone="text-down"
        />
      </section>

      <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5">
        <div className="mb-3 flex flex-wrap items-end justify-between gap-2">
          <div>
            <h3 className="text-sm text-fg">{tr("نمودار روزانه و بهترین ورود", "Daily chart and the best entry")}</h3>
            <p className="mt-1 text-xs text-subtle">
              {tr(
                "نوار سبز ناحیه خرید است. خط سبز بهترین نقطه است. نقطه روی نمودار آخرین باری است که قیمت همان سطح را لمس کرده.",
                "The green band is the buy zone. The solid green line is the best entry. The dot is the last time price traded that level.",
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onReload} disabled={refreshing} className="h-11">
            {tr("به‌روزرسانی", "Refresh")}
          </Button>
        </div>
        <SpotPlanChart plan={plan} />
        <div className="mt-4">
          <SpotLevelRuler plan={plan} />
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Stat k="RSI ۱۴" v={plan.rsi == null ? "—" : plan.rsi.toFixed(0)} />
        <Stat k={tr("نوسان روزانه", "Daily range")} v={`${(plan.atrPct * 100).toFixed(1)}%`} />
        <Stat
          k={tr("فاصله تا میانگین ۲۰۰", "Distance to the 200-day")}
          v={plan.emaDist == null ? "—" : formatPct(plan.emaDist)}
        />
        <Stat k={tr("۷ روز", "7 days")} v={plan.change7d == null ? "—" : formatPct(plan.change7d)} />
        <Stat k={tr("۳۰ روز", "30 days")} v={plan.change30d == null ? "—" : formatPct(plan.change30d)} />
        <Stat k={tr("هم‌پوشانی ورود", "Entry overlap")} v={String(plan.confluence)} />
      </section>

      <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
        <h3 className="text-sm text-fg">{tr("چرا این سطح‌ها", "Why these levels")}</h3>
        <ul className="mt-3 flex flex-col gap-2">
          {plan.notes.map((note) => (
            <li key={note.fa} className="text-sm leading-relaxed text-muted">
              {tr(note.fa, note.en)}
            </li>
          ))}
        </ul>
        <p className="mt-4 text-xs text-subtle">
          {tr(
            `ناحیه خرید از ${formatSpotUsd(plan.buyFrom)} تا ${formatSpotUsd(plan.buyTo)}. بالاتر از سقف ناحیه نخر.`,
            `Buy zone ${formatSpotUsd(plan.buyFrom)} to ${formatSpotUsd(plan.buyTo)}. Do not chase above the top of the zone.`,
          )}
        </p>
      </section>
    </div>
  );
}

function LevelCard({
  k,
  value,
  detail,
  tone,
}: {
  k: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <article className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{k}</p>
      <p className={`num mt-2 text-2xl ${tone}`}>{value}</p>
      <p className="mt-3 text-xs leading-relaxed text-muted">{detail}</p>
    </article>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-xs text-subtle">{k}</p>
      <p className="num mt-1 text-lg text-fg">{v}</p>
    </div>
  );
}
