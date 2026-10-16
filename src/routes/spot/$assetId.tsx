import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CoinMark } from "@/components/desk/coin-mark";
import { LocaleSwitch } from "@/components/desk/locale-switch";
import { SpotLevelRuler, SpotPlanChart } from "@/components/desk/spot-plan-chart";
import { formatPct, timeAgoFa } from "@/components/desk/format";
import { getSpotAsset, SPOT_ASSETS } from "@/lib/crypto/spot-assets";
import { loadSpotDesk } from "@/lib/crypto/spot-desk";
import { formatSpotUsd, type SpotPlan } from "@/lib/crypto/spot-plan";
import { useI18n } from "@/lib/i18n/locale";

export const Route = createFileRoute("/spot/$assetId")({
  component: SpotDeskPage,
  head: ({ params }) => ({
    meta: [
      {
        title:
          params.assetId === "btc"
            ? "بیت‌کوین و اتریوم · آلفا اسپات"
            : params.assetId === "eth"
              ? "اتریوم · آلفا اسپات"
              : "میز اسپات · آلفا اسپات",
      },
    ],
  }),
});

function SpotDeskPage() {
  const { assetId } = Route.useParams();
  const asset = getSpotAsset(assetId);
  const { tr, locale } = useI18n();
  const load = useServerFn(loadSpotDesk);
  const [plan, setPlan] = useState<SpotPlan | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error" | "soon" | "missing">("loading");
  const [error, setError] = useState<string | null>(null);
  const [ethPlan, setEthPlan] = useState<SpotPlan | null>(null);
  const [ethFetchedAt, setEthFetchedAt] = useState<string | null>(null);
  const [ethStatus, setEthStatus] = useState<"loading" | "ready" | "error">("loading");
  const [ethError, setEthError] = useState<string | null>(null);
  const paired = asset?.id === "btc";

  useEffect(() => {
    let stop = false;
    if (!asset) {
      setStatus("missing");
      setPlan(null);
      return;
    }
    if (!asset.enabled) {
      setStatus("soon");
      setPlan(null);
      return;
    }
    setStatus("loading");
    setError(null);
    void load({ data: { assetId: asset.id } })
      .then((desk) => {
        if (stop) return;
        setPlan(desk.plan);
        setFetchedAt(desk.fetchedAt);
        setStatus("ready");
      })
      .catch((err: unknown) => {
        if (stop) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
      });
    return () => {
      stop = true;
    };
    // Refetch only when the asset changes. The server function identity is stable enough.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asset?.id, asset?.enabled]);

  useEffect(() => {
    if (!paired) return;
    let stop = false;
    setEthStatus("loading");
    setEthError(null);
    void load({ data: { assetId: "eth" } })
      .then((desk) => {
        if (stop) return;
        setEthPlan(desk.plan);
        setEthFetchedAt(desk.fetchedAt);
        setEthStatus("ready");
      })
      .catch((err: unknown) => {
        if (stop) return;
        setEthStatus("error");
        setEthError(err instanceof Error ? err.message : "تحلیل اتریوم انجام نشد.");
      });
    return () => {
      stop = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paired]);

  return (
    <main className="desk-grid min-h-dvh">
      <div className={`mx-auto flex w-full flex-col gap-6 px-4 py-8 md:px-6 md:py-12 ${paired ? "max-w-7xl" : "max-w-5xl"}`}>
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-subtle">
            <Link to="/" className="inline-flex h-11 items-center gap-2 text-muted hover:text-fg">
              {locale === "en" ? <ArrowLeft className="size-4" /> : <ArrowRight className="size-4" />}
              {tr("میز اصلی", "Main desk")}
            </Link>
            <LocaleSwitch />
          </div>
          <div className="max-w-3xl">
            <p className="num text-xs tracking-widest text-subtle">ALPHA SPOT</p>
            <h1 className="mt-2 text-4xl font-medium tracking-tight text-fg md:text-5xl">
              {paired
                ? tr("بیت‌کوین و اتریوم", "Bitcoin and Ethereum")
                : asset
                  ? tr(asset.nameFa, asset.nameEn)
                  : tr("ارز ناشناس", "Unknown asset")}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {paired
                ? tr(
                    "همان میز بیت‌کوین، و تحلیل اتریوم کنارش. برای هر کدام یک نقطه خرید، یک قیمت که اگر بالا رد شد بفروشی، و یک قیمت که اگر پایین رد شد خارج شوی.",
                    "The same Bitcoin desk, with Ethereum beside it. Each has one buy, one price that means sell if it crosses up, and one price that means sell if it crosses down.",
                  )
                : tr(
                    "یک نقطه برای خرید اسپات، یک قیمت که اگر بالا رد شد بفروشی، و یک قیمت که اگر پایین رد شد خارج شوی.",
                    "One spot buy, one price that means sell if it crosses up, and one price that means sell if it crosses down.",
                  )}
            </p>
          </div>
          <AssetRail activeId={asset?.id ?? ""} />
        </header>

        {status === "missing" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-fg">{tr("این نماد در فهرست اسپات نیست.", "This ticker is not on the spot list.")}</p>
            <Button asChild className="mt-4">
              <Link to="/spot/$assetId" params={{ assetId: "btc" }}>
                {tr("برگشت به بیت‌کوین", "Back to Bitcoin")}
              </Link>
            </Button>
          </section>
        ) : null}

        {status === "soon" && asset ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <CoinMark symbol={asset.symbol} name={tr(asset.nameFa, asset.nameEn)} />
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {tr(
                "جای این ارز همین‌جاست، ولی هنوز روشن نشده. موتور، نمودار و دو حد خرید و فروش همان بیت‌کوین است؛ با فعال شدن نماد، همین صفحه برایش پر می‌شود.",
                "This slot is reserved, not live yet. The engine, the chart, and the buy and sell levels are the same ones Bitcoin uses. Turning the ticker on fills this page.",
              )}
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/spot/$assetId" params={{ assetId: "btc" }}>
                {tr("تحلیل بیت‌کوین", "Open Bitcoin")}
              </Link>
            </Button>
          </section>
        ) : null}

        {status === "loading" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="flex items-center gap-2 text-sm text-fg">
              <LoaderCircle className="size-4 animate-spin" />
              {tr("کندل روزانه و ناحیه‌های ورود و خروج", "Daily candles and the entry and exit zones")}
            </p>
            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
              <div className="shimmer h-full w-2/3 rounded-full bg-accent/40" />
            </div>
          </section>
        ) : null}

        {status === "error" ? (
          <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
            <p className="text-sm text-down">{tr("تحلیل اسپات کامل نشد", "The spot plan did not finish")}</p>
            <p className="mt-2 text-sm text-muted">{error ? tr(error) : null}</p>
            <Button
              className="mt-4"
              onClick={() => {
                if (!asset) return;
                setStatus("loading");
                void load({ data: { assetId: asset.id } })
                  .then((desk) => {
                    setPlan(desk.plan);
                    setFetchedAt(desk.fetchedAt);
                    setStatus("ready");
                  })
                  .catch((err: unknown) => {
                    setStatus("error");
                    setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
                  });
              }}
            >
              {tr("تلاش دوباره", "Try again")}
            </Button>
          </section>
        ) : null}

        {status === "ready" && plan && paired ? (
          <div className="grid items-start gap-8 xl:grid-cols-2">
            <section className="flex min-w-0 flex-col gap-3">
              <h2 className="text-lg font-medium text-fg">{tr("تحلیل بیت‌کوین", "Bitcoin analysis")}</h2>
              <PlanBody
                plan={plan}
                fetchedAt={fetchedAt}
                onReload={() => {
                  if (!asset) return;
                  setStatus("loading");
                  void load({ data: { assetId: asset.id } })
                    .then((desk) => {
                      setPlan(desk.plan);
                      setFetchedAt(desk.fetchedAt);
                      setStatus("ready");
                    })
                    .catch((err: unknown) => {
                      setStatus("error");
                      setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
                    });
                }}
              />
            </section>
            <section className="flex min-w-0 flex-col gap-3">
              <h2 className="text-lg font-medium text-fg">{tr("تحلیل اتریوم", "Ethereum analysis")}</h2>
              {ethStatus === "loading" ? (
                <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
                  <p className="flex items-center gap-2 text-sm text-fg">
                    <LoaderCircle className="size-4 animate-spin" />
                    {tr("کندل روزانه اتریوم", "Ethereum daily candles")}
                  </p>
                </section>
              ) : null}
              {ethStatus === "error" ? (
                <section className="rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]">
                  <p className="text-sm text-down">{tr("تحلیل اتریوم کامل نشد", "The Ethereum plan did not finish")}</p>
                  <p className="mt-2 text-sm text-muted">{ethError ? tr(ethError) : null}</p>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setEthStatus("loading");
                      void load({ data: { assetId: "eth" } })
                        .then((desk) => {
                          setEthPlan(desk.plan);
                          setEthFetchedAt(desk.fetchedAt);
                          setEthStatus("ready");
                        })
                        .catch((err: unknown) => {
                          setEthStatus("error");
                          setEthError(err instanceof Error ? err.message : "تحلیل اتریوم انجام نشد.");
                        });
                    }}
                  >
                    {tr("تلاش دوباره", "Try again")}
                  </Button>
                </section>
              ) : null}
              {ethStatus === "ready" && ethPlan ? (
                <PlanBody
                  plan={ethPlan}
                  fetchedAt={ethFetchedAt}
                  onReload={() => {
                    setEthStatus("loading");
                    void load({ data: { assetId: "eth" } })
                      .then((desk) => {
                        setEthPlan(desk.plan);
                        setEthFetchedAt(desk.fetchedAt);
                        setEthStatus("ready");
                      })
                      .catch((err: unknown) => {
                        setEthStatus("error");
                        setEthError(err instanceof Error ? err.message : "تحلیل اتریوم انجام نشد.");
                      });
                  }}
                />
              ) : null}
            </section>
          </div>
        ) : null}

        {status === "ready" && plan && !paired ? (
          <PlanBody plan={plan} fetchedAt={fetchedAt} onReload={() => {
            if (!asset) return;
            setStatus("loading");
            void load({ data: { assetId: asset.id } })
              .then((desk) => {
                setPlan(desk.plan);
                setFetchedAt(desk.fetchedAt);
                setStatus("ready");
              })
              .catch((err: unknown) => {
                setStatus("error");
                setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
              });
          }} />
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

function AssetRail({ activeId }: { activeId: string }) {
  const { tr } = useI18n();
  return (
    <ul className="flex gap-2 overflow-x-auto pb-1">
      {SPOT_ASSETS.map((item) => {
        const on = item.id === activeId;
        return (
          <li key={item.id} className="shrink-0">
            <Link
              to="/spot/$assetId"
              params={{ assetId: item.id }}
              className={
                on
                  ? "flex h-11 items-center gap-2 rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
                  : "flex h-11 items-center gap-2 rounded-lg bg-surface px-3 text-sm text-muted shadow-[var(--shadow-border)] hover:text-fg"
              }
            >
              <span className="num">{item.symbol}</span>
              <span>{tr(item.nameFa, item.nameEn)}</span>
              {item.enabled ? null : (
                <span className="text-xs text-subtle">{tr("به‌زودی", "Soon")}</span>
              )}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function PlanBody({
  plan,
  fetchedAt,
  onReload,
}: {
  plan: SpotPlan;
  fetchedAt: string | null;
  onReload: () => void;
}) {
  const { tr } = useI18n();
  const action =
    plan.action === "buy"
      ? tr("بخر", "Buy")
      : plan.action === "exit"
        ? tr("بفروش", "Sell")
        : tr("صبر کن", "Wait");
  const actionTone =
    plan.action === "buy" ? "text-up" : plan.action === "exit" ? "text-down" : "text-warn";
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
            <p className={`text-3xl font-medium tracking-tight ${actionTone}`}>{action}</p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{tr(plan.headlineFa, plan.headlineEn)}</p>
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
          k={tr("از این قیمت بخر", "Buy from this price")}
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
            <h2 className="text-sm text-fg">{tr("نمودار روزانه و بهترین ورود", "Daily chart and the best entry")}</h2>
            <p className="mt-1 text-xs text-subtle">
              {tr(
                "نوار سبز ناحیه خرید است. خط سبز بهترین نقطه است. نقطه روی نمودار آخرین باری است که قیمت همان سطح را لمس کرده.",
                "The green band is the buy zone. The solid green line is the best entry. The dot is the last time price traded that level.",
              )}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={onReload} className="h-11">
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
        <h2 className="text-sm text-fg">{tr("چرا این سطح‌ها", "Why these levels")}</h2>
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
