import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n/locale";

const ROWS = [
  {
    qFa: "سؤال",
    qEn: "Question",
    btcFa: "برای این ارز، امروز، این هفته یا این ماه بخرم، یا هیچ ارزی نخرم؟",
    btcEn: "For this coin, do I buy today, this week, or this month — or buy nothing?",
    otherFa: "اگر فقط یک نام در برابر بیت‌کوین بردارم، کدام است؟",
    otherEn: "If I take one name against Bitcoin, which one is it?",
  },
  {
    qFa: "خروجی",
    qEn: "Output",
    btcFa: "تا پنجاه ارز. هر کدام سه حکم جدا: یک روز، یک هفته، یک ماه.",
    btcEn: "Up to fifty coins. Each one gets three separate calls: a day, a week, a month.",
    otherFa: "یک برنده. اگر آلت‌ها ضعیف باشند، خود بیت‌کوین برنده است.",
    otherEn: "One winner. If the alts are weak, Bitcoin itself wins.",
  },
  {
    qFa: "سنجش",
    qEn: "Measure",
    btcFa: "کندل روزانه همان ارز: ناحیه خرید، فروش بالایی، فروش پایینی.",
    btcEn: "That coin’s own daily candles: a buy zone, an upside sell, a downside sell.",
    otherFa: "امتیاز روی جفت بیت‌کوین: قدرت نسبی، روند، ورود، نقدشوندگی، ریسک.",
    otherEn: "A score on the Bitcoin pair: relative strength, trend, entry, liquidity, risk.",
  },
  {
    qFa: "اگر ضعیف باشد",
    qEn: "If it is weak",
    btcFa: "برای همان افق می‌گوید هیچ ارزی نخر. فهرست پاک نمی‌شود.",
    btcEn: "For that horizon it says buy no coin. The list stays.",
    otherFa: "آلت از انتخاب حذف می‌شود و بیت‌کوین می‌ماند.",
    otherEn: "The alt is dropped from the pick and Bitcoin stays.",
  },
  {
    qFa: "ثبات",
    qEn: "How long it holds",
    btcFa: "حکم هفته و ماه تا پایان اعتبار عوض نمی‌شود.",
    btcEn: "The week and month calls do not change before they expire.",
    otherFa: "تحلیل دوباره امتیاز لحظه‌ای را عوض می‌کند.",
    otherEn: "Running the analysis again replaces the live score.",
  },
] as const;

const OTHERS = [
  {
    tFa: "انتخاب",
    tEn: "Pick",
    dFa: "یک نام بین صد ارز برتر، نسبت به بیت‌کوین. برنامه خرید سه افق برای هر سکه نیست.",
    dEn: "One name among the top 100, versus Bitcoin. Not a three-horizon buy plan for every coin.",
  },
  {
    tFa: "رتبه‌ها",
    tEn: "Ranks",
    dFa: "جدول همان امتیاز انتخاب. حکم خرید یا فروش هر سکه را جدا نمی‌دهد.",
    dEn: "The same pick score, as a table. It does not issue a buy or sell for each coin.",
  },
  {
    tFa: "فرصت‌ها",
    tEn: "Setups",
    dFa: "ارزهایی که هنوز نباید خرید. فقط ناحیه، تأیید و ابطال. افت قیمت به‌تنهایی امتیاز نیست.",
    dEn: "Names you should not buy yet. Only a zone, a confirmation, and an invalidation. A lower price alone does not score.",
  },
  {
    tFa: "همگرایی",
    tEn: "Confluence",
    dFa: "جریان حجم و تأیید ورود. نه رتبه، نه سه حکم میز بیت‌کوین.",
    dEn: "Volume flow and entry confirmation. Not the rank, and not the Bitcoin desk’s three calls.",
  },
  {
    tFa: "کلان",
    tEn: "Macro",
    dFa: "ساعت تهران و نیویورک و تقویم خبر. زمینه است، سیگنال سکه نیست.",
    dEn: "Tehran and New York hours, plus the news calendar. Context, not a coin signal.",
  },
  {
    tFa: "آنلاک",
    tEn: "Unlocks",
    dFa: "فشار عرضه توکن. به میز بیت‌کوین وصل نیست و خودش دستور خرید نمی‌سازد.",
    dEn: "Token supply pressure. It is not wired into the Bitcoin desk and does not place a buy by itself.",
  },
  {
    tFa: "پرتفوی و پایش",
    tEn: "Portfolio and watch",
    dFa: "اندازه و خروج همان انتخاب میز اصلی. برد پنجاه ارز میز بیت‌کوین نیست.",
    dEn: "Size and exit for the main desk’s pick. Not the Bitcoin desk’s board of fifty.",
  },
  {
    tFa: "بک‌تست",
    tEn: "Backtest",
    dFa: "گذشته هفتگی مدل انتخاب، با بازده هر ماه. حکم‌های قفل‌شده میز بیت‌کوین را حساب نمی‌کند.",
    dEn: "The weekly past of the pick model, with each month’s return. It does not score the Bitcoin desk’s locked calls.",
  },
  {
    tFa: "عمق، وب‌هوک، صرافی",
    tEn: "Depth, webhook, venue",
    dFa: "دفتر سفارش و فرستادن همان سیگنال انتخاب. جایگزین میز بیت‌کوین نیستند.",
    dEn: "The order book and delivery of that same pick. They do not replace the Bitcoin desk.",
  },
  {
    tFa: "روش و سابقه",
    tEn: "Method and history",
    dFa: "وزن‌های مدل و تحلیل‌های قبلی میز اصلی. سطح خرید هر ارز را نشان نمی‌دهند.",
    dEn: "The model’s weights and earlier runs of the main desk. They do not show each coin’s buy level.",
  },
] as const;

export function DeskCompare({ here = "home" }: { here?: "home" | "btc" }) {
  const { tr } = useI18n();
  return (
    <section className="min-w-0 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <p className="num text-xs tracking-widest text-subtle">TWO DESKS</p>
      <h2 className="mt-2 text-xl font-medium tracking-tight text-fg md:text-2xl">
        {tr("فرق میز بیت‌کوین با بقیه بخش‌ها", "How the Bitcoin desk differs from the rest")}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
        {tr(
          "دو جواب جدا هستند. میز بیت‌کوین نمی‌گوید کدام آلت از بیت‌کوین قوی‌تر است. میز اصلی هم برای هر ارز یک برنامه خرید و فروش سه افق نمی‌سازد. یکی را جای دیگری نگذارید.",
          "These are two different answers. The Bitcoin desk does not say which alt is stronger than Bitcoin. The main desk does not build a three-horizon buy and sell plan for every coin. Do not swap one for the other.",
        )}
      </p>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <article className="rounded-lg bg-bg p-4">
          <p className="text-xs text-subtle">{tr("مسیر جدا", "Separate path")}</p>
          <h3 className="mt-1 text-base font-medium text-fg">{tr("میز بیت‌کوین", "Bitcoin desk")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tr(
              "پنجاه ارز اول، بدون استیبل و رپد. بیت‌کوین همیشه اول فهرست است. هر ردیف سطح ورود، فروش بالایی و فروش پایینی خودش را دارد.",
              "The top fifty, with stables and wrapped assets left out. Bitcoin is always first on the list. Each row has its own entry, upside sell, and downside sell.",
            )}
          </p>
          {here === "home" ? (
            <Link to="/spot/$assetId" params={{ assetId: "btc" }} className="mt-3 inline-flex h-11 items-center text-sm text-fg">
              {tr("باز کردن میز بیت‌کوین", "Open the Bitcoin desk")}
            </Link>
          ) : (
            <p className="mt-3 text-xs text-subtle">{tr("شما الان روی همین میز هستید.", "You are on this desk now.")}</p>
          )}
        </article>
        <article className="rounded-lg bg-bg p-4">
          <p className="text-xs text-subtle">{tr("همین صفحه، تب‌ها", "This page, the tabs")}</p>
          <h3 className="mt-1 text-base font-medium text-fg">{tr("میز اصلی", "Main desk")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {tr(
              "صد ارز برتر را روی جفت بیت‌کوین امتیاز می‌دهد و یک نام برمی‌گرداند. بقیه تب‌ها همان انتخاب را توضیح، اندازه، یا اجرا می‌کنند. هیچ‌کدام فهرست سه حکم میز بیت‌کوین نیستند.",
              "It scores the top 100 on the Bitcoin pair and returns one name. The other tabs explain, size, or place that same pick. None of them is the Bitcoin desk’s list of three calls.",
            )}
          </p>
          {here === "btc" ? (
            <Link to="/" className="mt-3 inline-flex h-11 items-center text-sm text-fg">
              {tr("بازگشت به میز اصلی", "Back to the main desk")}
            </Link>
          ) : (
            <p className="mt-3 text-xs text-subtle">{tr("انتخاب، بعد از تعیین صرافی و افق ساخته می‌شود.", "The pick is built after you set the exchange and the horizon.")}</p>
          )}
        </article>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-sm">
          <thead>
            <tr className="text-xs text-subtle">
              <th className="px-3 py-2 text-start font-medium">{tr("مقایسه", "Compare")}</th>
              <th className="px-3 py-2 text-start font-medium">{tr("میز بیت‌کوین", "Bitcoin desk")}</th>
              <th className="px-3 py-2 text-start font-medium">{tr("بقیه بخش‌ها", "The other sections")}</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.qEn} className="border-t border-border align-top">
                <th className="px-3 py-3 text-start text-xs font-medium text-subtle">{tr(row.qFa, row.qEn)}</th>
                <td className="px-3 py-3 leading-relaxed text-fg">{tr(row.btcFa, row.btcEn)}</td>
                <td className="px-3 py-3 leading-relaxed text-muted">{tr(row.otherFa, row.otherEn)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h3 className="mt-6 text-sm font-medium text-fg">{tr("بقیه بخش‌ها، هر کدام چه کار می‌کنند", "What each other section does")}</h3>
      <ul className="mt-3 grid gap-2 sm:grid-cols-2">
        {OTHERS.map((item) => (
          <li key={item.tEn} className="rounded-lg bg-bg px-3 py-3">
            <p className="text-sm text-fg">{tr(item.tFa, item.tEn)}</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">{tr(item.dFa, item.dEn)}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
