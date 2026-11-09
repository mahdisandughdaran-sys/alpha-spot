import type { AlphaStack, StackGroup, StackReading } from "@/lib/crypto/alpha-stack";
import { useI18n } from "@/lib/i18n/locale";

const GROUP_FA: Record<StackGroup, string> = {
  trend: "روند",
  structure: "ساختار",
  location: "محل ورود",
  momentum: "مومنتوم",
  flow: "جریان حجم",
};

const GROUP_EN: Record<StackGroup, string> = {
  trend: "Trend",
  structure: "Structure",
  location: "Location",
  momentum: "Momentum",
  flow: "Volume flow",
};

export function AlphaStackPanel({
  stack,
  symbol,
  price,
}: {
  stack: AlphaStack;
  symbol?: string;
  price?: string | null;
}) {
  const { tr } = useI18n();
  const bias =
    stack.bias === "buy"
      ? { fa: "بخر", en: "Buy", tone: "text-up" }
      : stack.bias === "avoid"
        ? { fa: "نخر", en: "Do not buy", tone: "text-down" }
        : { fa: "صبر کن", en: "Wait", tone: "text-warn" };
  const groups = (["trend", "structure", "location", "momentum", "flow"] as const).filter((group) =>
    stack.readings.some((item) => item.group === group),
  );

  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <p className="text-xs tracking-widest text-subtle">ALPHA STACK</p>
          <h3 className="mt-1 text-base font-medium text-fg">
            {tr("پشته اندیکاتور خرید اسپات", "Spot-buy indicator stack")}
            {symbol ? <span className="num text-muted"> · {symbol}</span> : null}
          </h3>
          <p className={`mt-2 text-2xl font-medium tracking-tight ${bias.tone}`}>{tr(bias.fa, bias.en)}</p>
          <p className="mt-2 text-sm leading-relaxed text-muted">{tr(stack.headlineFa, stack.headlineEn)}</p>
        </div>
        <div className="min-w-36 text-end">
          {price ? <p className="num text-xl text-fg">{price}</p> : null}
          <p className="num text-3xl text-fg">{stack.score}</p>
          <p className="text-xs text-subtle">{tr("امتیاز کیفیت ورود", "Entry quality")}</p>
        </div>
      </div>

      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-bg">
        <div
          className={`h-full rounded-full ${stack.bias === "buy" ? "bg-up" : stack.bias === "avoid" ? "bg-down" : "bg-warn"}`}
          style={{ width: `${Math.max(4, Math.min(100, stack.score))}%` }}
        />
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
        <span className="rounded-md bg-elevated px-2 py-1">
          {tr("توافق", "Agreement")} <span className="num text-fg">{Math.round(stack.agreement * 100)}%</span>
        </span>
        <span className="rounded-md bg-elevated px-2 py-1">
          {tr("اندازه مجاز", "Size cap")}{" "}
          <span className="text-fg">
            {stack.sizeCap === "full"
              ? tr("کامل", "Full")
              : stack.sizeCap === "half"
                ? tr("نصف", "Half")
                : tr("صفر", "None")}
          </span>
        </span>
        <span className="rounded-md bg-elevated px-2 py-1">
          {tr("وتو", "Veto")}{" "}
          <span className="text-fg">
            {stack.veto == null
              ? tr("ندارد", "None")
              : stack.veto === "chase"
                ? tr("تعقیب سقف", "Chase")
                : stack.veto === "distribution"
                  ? tr("توزیع", "Distribution")
                  : tr("نزول", "Markdown")}
          </span>
        </span>
      </div>

      {groups.length === 0 ? (
        <p className="mt-4 text-sm text-muted">
          {tr("کندل کافی برای خواندن اندیکاتورها نرسیده.", "Not enough candles to read the indicators.")}
        </p>
      ) : (
        <div className="mt-5 flex flex-col gap-5">
          {groups.map((group) => (
            <div key={group}>
              <p className="text-xs text-subtle">{tr(GROUP_FA[group], GROUP_EN[group])}</p>
              <ul className="mt-2 grid gap-2 md:grid-cols-2">
                {stack.readings
                  .filter((item) => item.group === group)
                  .map((item) => (
                    <Reading key={item.key} item={item} />
                  ))}
              </ul>
            </div>
          ))}
        </div>
      )}
      <p className="mt-4 text-xs leading-relaxed text-subtle">
        {tr(
          "این لایه دستور میز را عوض می‌کند: تعقیب سقف، توزیع، یا نزول تأییدشده خرید را می‌بندد. ایچیموکو، سوپرترند، ADX، VWAP، پروفایل حجم، فشردگی بولینگر/کلتنر، استوکاستیک RSI، RSI کانرز، مکدی، واگرایی، CMF، OBV و ساختار سویینگ روی کندل روزانه حساب می‌شوند. توصیه مالی نیست.",
          "This layer can change the desk order: a chase, distribution, or a confirmed markdown closes the buy. Ichimoku, Supertrend, ADX, VWAP, volume profile, the Bollinger/Keltner squeeze, Stochastic RSI, Connors RSI, MACD, divergence, CMF, OBV, and swing structure are calculated on the daily candle. Not financial advice.",
        )}
      </p>
    </section>
  );
}

function Reading({ item }: { item: StackReading }) {
  const { tr } = useI18n();
  const tone = item.tone === "up" ? "text-up" : item.tone === "down" ? "text-down" : "text-muted";
  const mark = item.vote > 0 ? "+" : item.vote < 0 ? "−" : "·";
  return (
    <li className="rounded-lg bg-bg px-3 py-3">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-sm text-fg">{tr(item.labelFa, item.labelEn)}</p>
        <p className={`num text-sm ${tone}`}>
          {mark} {tr(item.value, item.valueEn ?? item.value)}
        </p>
      </div>
      <p className="mt-1 text-xs leading-relaxed text-muted">{tr(item.detailFa, item.detailEn)}</p>
    </li>
  );
}
