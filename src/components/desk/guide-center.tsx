import { useState } from "react";
import { BookOpen } from "lucide-react";
import type { AnalysisResult } from "@/lib/crypto/types";
import { buildAtrPlan, type FlowState } from "@/lib/crypto/spot-analytics";
import { formatPct, formatUsd } from "./format";

const CHAPTERS = [
  {
    id: "macro",
    short: "فیلتر بیت‌کوین",
    title: "فیلتر کلان بیت‌کوین",
    body: "قبل از خرید آلت، ساختار خود بیت‌کوین خوانده می‌شود: فاصله تا میانگین ۲۰۰ روزه، سقف و کف هفتگی، شکست حمایت، بازده ۷ و ۳۰ روز، و جهت دامیننس. حاصل یک امتیاز ریسک از صفر تا ۱۰۰ است، جدا از کلید قطع.",
    rule: "اگر امتیاز ریسک ۷۰ یا بالاتر باشد، سیستم هشدار کاهش حجم می‌دهد و اندازه پیشنهادی آلت را نصف می‌کند. بالای ۸۵ معمولاً با کلید قطع همزمان می‌شود و خرید اسپات معلق است.",
    advice: "عدد بالای ۷۰ یعنی الان وقت شکار آلت در اصلاح سنگین بازار نیست. یا بیرون بمانید، یا حجم را نصف کنید و حد ضرر ATR را همان روز بنویسید.",
  },
  {
    id: "unlock",
    short: "آنلاک",
    title: "جریمه کلیف آنلاک",
    body: "تقویم ۳۰ روز آینده روی عرضه کل سنجیده می‌شود. منبع زنده، تقویم عمومی CoinMarketCap است. API انتشار DefiLlama الان اشتراک پولی می‌خواهد، پس همان قاعده کلیف اینجا با دادهٔ در دسترس اجرا می‌شود و منبع روی صفحه نوشته می‌شود.",
    rule: "بیش از ۳٪ عرضه در ۳۰ روز، ۱۵ امتیاز از نمره کل کم می‌کند و برچسب High Dilution می‌گیرد. بیش از ۵٪ هجده امتیاز، و بیش از ۸٪ بیست امتیاز. کلیف و High Dilution از خرید حذف می‌شوند.",
    advice: "آنلاک به‌تنهایی فروش نیست، ولی اگر همین توکن انتخاب مدل شد، حجم را کم کنید. اگر High Dilution باشد و آلت تمیزتری نزدیک امتیازش باشد، مدل همان تمیزتر را برمی‌دارد.",
  },
  {
    id: "depth",
    short: "عمق بازار",
    title: "نقدشوندگی و عمق دفتر",
    body: "امتیاز نقدشوندگی از حجم ۲۴ ساعته، گردش نسبت به مارکت‌کپ و وجود جفت واقعی بیت‌کوین می‌آید. بعد از رتبه‌بندی، دفتر سفارش بایننس برای یک خرید نمونه سنجیده می‌شود: لغزش، عمق دوطرفه، فاندینگ و سود باز.",
    rule: "خرید فقط جایی پیشنهاد می‌شود که حجم ۲۴ ساعته کافی باشد. لغزش سنگین یا دفتر نازک، سیگنال را معلق می‌کند. گردش زیر ۲٪ مارکت‌کپ یعنی خروج ممکن است گران تمام شود.",
    advice: "اگر تب عمق برای نماد انتخابی لغزش بالا نشان داد، حتی با امتیاز خوب وارد نشوید. قیمت لمس شده، تأیید ورود نیست.",
  },
  {
    id: "rebalance",
    short: "چرخش سبد",
    title: "موتور چرخش و خروج",
    body: "سبد سه آستین دارد: هسته بیت‌کوین، بزرگ‌ها، و میان‌رده‌های تمیز. در پایش سبد، هر دارایی که حمایت هفتگی جفت بیت‌کوین را بشکند، امتیازش زیر ۶۰ بیاید، یا برچسب رقیق‌سازی بگیرد، کاندید چرخش است.",
    rule: "مقصد چرخش باید امتیاز بالای ۶۸ داشته باشد، High Dilution نباشد، و اگر کلید قطع فعال است وزن به بیت‌کوین برمی‌گردد.",
    advice: "چرخش یعنی تعویض به دارایی بهتر مدل، نه فروش هیجانی همه چیز. اگر مقصدی واجد شرایط نباشد، خود بیت‌کوین مقصد است.",
  },
  {
    id: "inflation",
    short: "تورم عرضه",
    title: "جریمه FDV نسبت به مارکت‌کپ",
    body: "MC/FDV می‌گوید چند درصد عرضه در گردش است. وارونه‌اش، FDV تقسیم بر مارکت‌کپ، نشان می‌دهد بازار کاملاً رقیق‌شده چند برابر ارزش امروز است. این جدا از جریمه آنلاک ۳۰ روز است: یکی ساختار عرضه است، یکی رویداد نزدیک.",
    rule: "اگر این نسبت از ۵ بگذرد، ۸ امتیاز کم می‌شود. از ۸ به بالا ۱۲ امتیاز، و از ۱۲ به بالا ۱۶ امتیاز. بیت‌کوین و اتریوم از این جریمه معاف‌اند.",
    advice: "نسبت بالای ۵ یعنی بخش بزرگی از توکن هنوز بیرون نیامده. حتی اگر نمودار قشنگ باشد، آن را اسپات بلندمدت فرض نکنید مگر آنلاک ۳۰ روز هم تمیز باشد.",
  },
  {
    id: "flow",
    short: "انباشت",
    title: "فشار انباشت و توزیع",
    body: "شاخص ۱۴ روزه، حجم روزهای سبز را در برابر حجم روزهای قرمز می‌سنجد. این دفتر سفارش نهنگ‌های نام‌دار نیست؛ جریان واقعی قیمت و حجم همین کندل‌هاست. مثبت یعنی انباشت، منفی یعنی توزیع.",
    rule: "انباشت فقط وقتی امتیاز اضافه می‌کند که قیمت دست‌کم ۶٪ از اوج ۳۰ روزه فاصله داشته باشد. توزیع نزدیک سقف، ۶ امتیاز کم می‌کند. توزیع در بقیه جاها ۲ امتیاز.",
    advice: "کف ساختن وقتی معنی دارد که حجم روزهای مثبت بیشتر شده باشد. افت تنها، انباشت نیست. اگر شاخص توزیع است، حتی انتخاب مدل را با حجم کوچک‌تر اجرا کنید.",
  },
  {
    id: "sector",
    short: "مومنتوم بخش",
    title: "نمره مومنتوم فرابخشی",
    body: "ارزها به بخش‌هایی مثل دیفای، هوش مصنوعی، لایه یک، لایه دو، دارایی واقعی و DePIN تقسیم می‌شوند. بازده ۷ روزه هر بخش با حجم ۲۴ ساعته وزن می‌گیرد. بیت‌کوین از میانگین حذف می‌شود تا لایه یک را به‌تنهایی قورت ندهد.",
    rule: "بخش پیشتاز، اگر دست‌کم دو عضو داشته باشد و نمره‌اش از ۶۴ بگذرد، ۴ امتیاز به اعضای غیرسقفش اضافه می‌کند. بخش سرد، با نمره ۳۲ یا کمتر، ۳ امتیاز کم می‌کند. ارزی که خودش در سقف است این پاداش را نمی‌گیرد.",
    advice: "ببینید نقدینگی این هفته در کدام حوزه است، بعد داخل همان حوزه به‌دنبال نقطه ورود بگردید. عضو ضعیف یک بخش داغ، بهتر از سقف یک بخش سرد نیست.",
  },
  {
    id: "atr",
    short: "حد ضرر",
    title: "حد ضرر پویا بر اساس ATR",
    body: "به‌جای یک درصد ثابت، فاصله حد ضرر از نوسان روزانه همان ارز می‌آید. ATR اینجا تقریب بسته‌شدن به بسته‌شدن است: انحراف روزانه ضربدر ۱٫۲۵. حد ضرر ۲٫۲ برابر ATR پایین‌تر است و هدف ۳٫۴ برابر ATR بالاتر.",
    rule: "همان فاصله حد ضرر، فاصله تریلینگ است. اگر فیلتر کلان یا کلید قطع حجم را کم کرده باشد، اندازه پوزیشن با همان ضریب کوچک می‌شود. نسبت پاداش به ریسک این قالب حدود ۱٫۵ است.",
    advice: "حد را روی نمودار جابه‌جا نکنید تا «جا شود». اگر ATR آن‌قدر پهن است که ضرر احتمالی از ریسک مجاز شما بزرگ‌تر است، حجم را کم کنید، نه فاصله حد را.",
  },
] as const;

type ChapterId = (typeof CHAPTERS)[number]["id"];

export function GuideCenter({ result }: { result?: AnalysisResult | null }) {
  const [id, setId] = useState<ChapterId>("macro");
  const chapter = CHAPTERS.find((item) => item.id === id) ?? CHAPTERS[0];

  return (
    <section className="rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-6">
      <div className="flex items-start gap-3">
        <BookOpen className="mt-0.5 size-5 shrink-0 text-accent" strokeWidth={1.75} />
        <div>
          <p className="text-xs text-subtle">مرکز راهنما</p>
          <h2 className="mt-1 text-xl font-medium text-fg">دفترچه میز و موتور خرید اسپات</h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
            هر مولفه یک آستانه عددی دارد. اگر تحلیل را اجرا کرده باشید، وضعیت همین لحظه زیر همان قاعده می‌آید.
            این دفترچه توصیه خرید نیست؛ توضیح همان عددی است که میز نشان می‌دهد.
          </p>
        </div>
      </div>

      <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
        {CHAPTERS.map((item) => {
          const on = item.id === id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setId(item.id)}
              className={
                on
                  ? "h-11 shrink-0 rounded-md bg-elevated px-3 text-sm text-fg"
                  : "h-11 shrink-0 rounded-md px-3 text-sm text-muted hover:text-fg"
              }
            >
              {item.short}
            </button>
          );
        })}
      </div>

      <article className="mt-4 rounded-lg bg-elevated p-4 md:p-5">
        <h3 className="text-base font-medium text-fg">{chapter.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-muted">{chapter.body}</p>
        <p className="mt-3 text-sm leading-relaxed text-fg">{chapter.rule}</p>
        <p className="mt-3 text-sm leading-relaxed text-subtle">{chapter.advice}</p>
        <Live id={chapter.id} result={result ?? null} />
      </article>
    </section>
  );
}

function Live({ id, result }: { id: ChapterId; result: AnalysisResult | null }) {
  if (!result) {
    return (
      <p className="mt-4 rounded-md bg-bg px-3 py-3 text-xs leading-relaxed text-subtle">
        وضعیت زنده بعد از «تحلیل ۱۰۰ ارز برتر» اینجا می‌نشیند.
      </p>
    );
  }

  const pick = result.pick;
  const book = result.books.find((row) => row.symbol === pick.symbol);
  const leader = result.sectors?.[0];
  const macro = result.macroRisk;
  const cut = Math.min(pick.sizeMultiplier, macro?.sizeMultiplier ?? pick.sizeMultiplier);
  const plan = buildAtrPlan({
    price: pick.priceUsd,
    volatility30d: pick.volatility30d,
    sizeMultiplier: cut,
  });

  let text = "";
  if (id === "macro") {
    text = macro
      ? `${macro.headline}. ${macro.advice}`
      : "ریسک کلان در این اجرا جداگانه ننشست.";
  } else if (id === "unlock") {
    text =
      pick.unlockPct30d == null
        ? "برای نماد انتخابی، برنامه آزادسازی ثبت نشده یا تقویم در دسترس نبود."
        : `${pick.symbol}: آزادسازی ۳۰ روز ${pick.unlockPct30d.toFixed(2)}٪، جریمه ${pick.unlockPenalty} امتیاز.`;
  } else if (id === "depth") {
    text = book?.note ?? "دفتر این نماد در این اجرا سنجیده نشد. تب عمق را برای بقیه ببینید.";
  } else if (id === "rebalance") {
    const legs = result.portfolio.flatMap((sleeve) => sleeve.legs.map((leg) => leg.symbol));
    text = legs.length
      ? `آستین‌های فعلی: ${legs.join("، ")}. وزن هسته با رژیم و کلید قطع عوض می‌شود.`
      : "سبد این اجرا خالی برگشت.";
  } else if (id === "inflation") {
    text =
      pick.fdvToMcap == null
        ? "سقف عرضه این نماد در داده نبود، پس جریمه تورم اعمال نشد."
        : `${pick.symbol}: FDV ${pick.fdvToMcap.toFixed(1)} برابر مارکت‌کپ است و جریمه ${pick.inflationPenalty ?? 0} امتیاز دارد.`;
  } else if (id === "flow") {
    text =
      pick.accumulationScore == null
        ? "کندل کافی برای شاخص انباشت این نماد نبود."
        : `${pick.symbol}: شاخص ${pick.accumulationScore.toFixed(0)} (${flowLabel(pick.accumulationState)}).`;
  } else if (id === "sector") {
    text = leader
      ? `بخش پیشتاز ${leader.label} با نمره ${leader.score.toFixed(0)} است. ${leader.note}`
      : "بخش قابل‌سنجشی در این مجموعه نبود.";
  } else if (plan) {
    text = `برای ${pick.symbol}: حد ${formatUsd(plan.stop)} دلار، هدف ${formatUsd(plan.target)} دلار، دنباله‌رو ${formatPct(plan.trailPct)}. حجم پیشنهادی ${Math.round(plan.sizeMultiplier * 100)}٪ اندازه عادی.`;
  }

  return <p className="mt-4 rounded-md bg-bg px-3 py-3 text-sm leading-relaxed text-fg">{text}</p>;
}

function flowLabel(state: FlowState | null | undefined): string {
  if (state === "accumulation") return "انباشت";
  if (state === "distribution") return "توزیع";
  if (state === "neutral") return "خنثی";
  return "نامشخص";
}
