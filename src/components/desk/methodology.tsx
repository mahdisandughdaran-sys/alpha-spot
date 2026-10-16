import { useI18n } from "@/lib/i18n/locale";

const FACTORS = [
  {
    w: "۲۲٪",
    t: "قدرت نسبی به بیت‌کوین",
    d: "بازده ۷، ۱۴ و ۳۰ روزه روی جفت BTC، نه تتر. اگر آلت دلاری سبز باشد ولی از بیت عقب بماند، امتیاز نمی‌گیرد.",
  },
  {
    w: "۱۶٪",
    t: "توکنومیکس · MC/FDV",
    d: "اگر نسبت ارزش بازار به ارزش رقیق‌شده زیر ۰٫۵ باشد، آزادسازی توکن فشار فروش می‌سازد. اولویت با MC/FDV بالای ۰٫۷ است. جدا از این نسبت، کلیف ۳۰ روز آینده اگر از ۳٪ عرضه بگذرد ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌کند.",
  },
  {
    w: "۱۶٪",
    t: "موقعیت ورود",
    d: "RSI روزانه و فاصله از اوج ۳۰ روزه. اشباع خرید و خرید سقف امتیاز از دست می‌دهند؛ اصلاح ۶ تا ۱۸ درصدی سالم پاداش می‌گیرد.",
  },
  {
    w: "۱۶٪",
    t: "روند کلان",
    d: "EMA ۲۰۰ روزانه، ساختار هفتگی (CHoCH/BOS)، میانگین ۱۰ روزه جفت BTC و تأیید حجم / OBV.",
  },
  {
    w: "۱۴٪",
    t: "نقدشوندگی اسپات",
    d: "حجم ۲۴ ساعته، گردش نسبت به مارکت‌کپ (هدف بالای ۲٪)، و وجود جفت BTC واقعی روی بایننس.",
  },
  {
    w: "۱۰٪",
    t: "بازده به ریسک",
    d: "بازده جفت BTC تقسیم بر نوسان، حداکثر افت ۳۰ روزه، و بتا. جهش بدون کنترل نوسان امتیاز نمی‌گیرد.",
  },
  {
    w: "۶٪",
    t: "روایت و ارزش‌افزایی",
    d: "ترند فعال (AI، RWA، DePIN، L2، سولانا) به‌علاوه مکانیزم واقعی: استیک، سوزاندن، بازخرید یا تقسیم درآمد — نه فقط توکن حاکمیتی.",
  },
];

const FACTORS_EN = [
  {
    w: "22%",
    t: "Relative strength vs Bitcoin",
    d: "7, 14, and 30-day returns on the BTC pair, not USDT. A green USD chart that still lags Bitcoin does not score.",
  },
  {
    w: "16%",
    t: "Tokenomics · MC/FDV",
    d: "If market cap over fully diluted value is under 0.5, unlocks create sell pressure. Preference is MC/FDV above 0.7. Separately, a cliff in the next 30 days above 3% of supply deducts 15 to 20 points from the total score.",
  },
  {
    w: "16%",
    t: "Entry location",
    d: "Daily RSI and distance from the 30-day high. Overbought and buying the high lose points; a healthy 6–18% pullback is paid.",
  },
  {
    w: "16%",
    t: "Macro trend",
    d: "Daily 200 EMA, weekly structure (CHoCH/BOS), the 10-day BTC-pair average, and volume / OBV confirmation.",
  },
  {
    w: "14%",
    t: "Spot liquidity",
    d: "24-hour volume, turnover versus market cap (target above 2%), and a real BTC pair on Binance.",
  },
  {
    w: "10%",
    t: "Return versus risk",
    d: "BTC-pair return divided by volatility, 30-day max drawdown, and beta. A spike with uncontrolled volatility does not score.",
  },
  {
    w: "6%",
    t: "Narrative and value accrual",
    d: "An active trend (AI, RWA, DePIN, L2, Solana) plus a real mechanism: staking, burn, buyback, or revenue share — not a governance token alone.",
  },
];

export function Methodology() {
  const { tr } = useI18n();
  return (
    <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6">
      <h3 className="text-base font-medium text-fg">{tr("منطق مدل — بدون جعبه سیاه", "Model logic — no black box")}</h3>
      <p className="mt-2 max-w-3xl text-sm leading-relaxed text-muted">
        {tr(
          "سؤال این نیست «کدام ارز امروز سبز است». سؤال این است: اگر بخواهید الان اسپات بخرید و معیارتان بیت‌کوین باشد، کدام دارایی از نظر قدرت نسبی، توکنومیکس، نقطه ورود، روند کلان و نقدشوندگی منطقی‌تر است. استیبل‌کوین، رپد و مشتق استیک حذف می‌شوند. اگر آلت‌ها جمعاً از بیت‌کوین عقب باشند، خود بیت‌کوین می‌تواند برنده باشد.",
          "The question is not “which coin is green today.” It is: if you are buying spot now and Bitcoin is the benchmark, which name is more logical on relative strength, tokenomics, entry, macro trend, and liquidity. Stables, wrapped assets, and staked derivatives are removed. If alts as a group lag Bitcoin, Bitcoin itself can win.",
        )}
      </p>
      <ol className="mt-6 grid gap-4 md:grid-cols-2">
        {FACTORS.map((f, i) => (
          <li key={f.t} className="rounded-md bg-elevated p-4">
            <p className="text-xs text-subtle">{tr(`وزن ${f.w}`, `Weight ${FACTORS_EN[i]!.w}`)}</p>
            <p className="mt-1 text-sm text-fg">{tr(f.t, FACTORS_EN[i]!.t)}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{tr(f.d, FACTORS_EN[i]!.d)}</p>
          </li>
        ))}
      </ol>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <Layer
          t={tr("کلید قطع بیت‌کوین", "Bitcoin kill-switch")}
          d={tr(
            "زیر EMA ۲۰۰ روزانه یا ساختار هفتگی شدیداً نزولی (افت ۴ هفته بیش از ۸٪ یا شکست کف ۸ هفته) حجم را نصف می‌کند. هر دو با هم، خرید اسپات را معلق و وزن را به BTC برمی‌گرداند.",
            "Below the daily 200 EMA, or a severely bearish weekly structure (a 4-week drop over 8% or a break of the 8-week low), cuts size in half. Both together suspend spot buys and return the weight to BTC.",
          )}
        />
        <Layer
          t={tr("جریمه کلیف آنلاک", "Unlock cliff penalty")}
          d={tr(
            "آزادسازی ۳۰ روز آینده اگر از ۳٪ عرضه کل بگذرد، ۱۵، ۱۸ یا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌گیرد. بازه ۱۴ تا ۳۰ روز جدا نشان داده می‌شود.",
            "An unlock over the next 30 days that exceeds 3% of total supply deducts 15, 18, or 20 points and takes the High Dilution Risk tag. The 14-to-30-day window is shown separately.",
          )}
        />
        <Layer
          t={tr("خروج و چرخش", "Exit and rotation")}
          d={tr(
            "شکست حمایت هفتگی ALT/BTC یا افت امتیاز به زیر ۶۰، سیگنال چرخش به بهترین گزینه واجد شرایط (امتیاز بالای ۶۸، بدون رقیق‌سازی) یا بیت‌کوین است.",
            "A break of weekly ALT/BTC support, or a score under 60, signals a rotation into the best qualified name (score above 68, no dilution) or into Bitcoin.",
          )}
        />
        <Layer
          t={tr("دفتر سفارش، فاندینگ و سود باز", "Book, funding, and open interest")}
          d={tr(
            "خرید ۱۰هزار دلاری روی دفتر بایننس سنجیده می‌شود. اسلیپیج بالای ۳۵ نقطه پایه یا عمق کم، خرید را معلق می‌کند. فاندینگ سالانه بالای ۳۰٪ حجم را نصف می‌کند. برای آلت خرد، جهش سود باز بالای ۲۵٪ یا نسبت لانگ/شورت بالای ۲٫۳ هم حجم را نصف می‌کند.",
            "A $10k buy is walked on the Binance book. Slippage above 35 basis points, or a thin book, suspends the buy. Annualized funding above 30% cuts size in half. On a small-cap alt, an open-interest jump above 25% or a long/short ratio above 2.3 also cuts size in half.",
          )}
        />
        <Layer
          t={tr("همگرایی جریان و لیکوییدیشن", "Flow and liquidation confluence")}
          d={tr(
            "جریان حجم از خرید تیکر اسپات است. نقشه لیکوییدیشن خوشه‌های اهرم ۵ تا ۱۰۰ را فقط اگر هنوز سویپ نشده باشند نشان می‌دهد. خرید داخل دیوار لانگ یا روی پامپ توخالی ممنوع است. حجم پوزیشن = (سرمایه × ریسک٪) / حدضرر٪ و حداکثر ضرر = سرمایه × ریسک.",
            "Volume flow is spot taker buy volume. The liquidation map shows 5x–100x clusters only if they have not been swept. Buying into a long wall or a hollow pump is blocked. Position size = (capital × risk%) / stop% and max loss = capital × risk.",
          )}
        />
      </div>
      <p className="mt-5 text-xs leading-relaxed text-subtle">
        {tr(
          "کندل، دفتر و مشتقات در دیتابیس کش می‌شوند تا محدودیت API داده را ناقص نکند. بک‌تست، مسیر هفتگی حدود سه سال گذشته را با همین امتیاز حساب می‌کند. تب وب‌هوک سیگنال را به تلگرام یا ربات خودتان می‌فرستد. تب صرافی سفارش اسپات را مستقیم روی والکس، بایننس یا بای‌بیت ثبت می‌کند و کلید را روی سرور نگه نمی‌دارد. داده از CoinPaprika، کندل و دفتر بایننس، فاندینگ و سود باز OKX، و تقویم CoinMarketCap است. این ابزار توصیه مالی یا تضمین سود نیست. تب فرصت‌ها مسیر دیگری است: ارزهایی که الان شرایط ورود ندارند، فقط اگر حمایت آزمون‌شده و سطح ابطال عددی داشته باشند به فهرست انتظار می‌روند. افت قیمت به‌تنهایی آنجا امتیاز نمی‌گیرد.",
          "Candles, the book, and derivatives are cached in the database so an API limit does not leave the tape incomplete. The backtest runs the weekly path of about the last three years on this same score. The webhook tab sends the signal to Telegram or your own bot. The venue tab places a spot order directly on Wallex, Binance, or Bybit and does not keep the key on the server. Data comes from CoinPaprika, Binance candles and book, OKX funding and open interest, and the CoinMarketCap calendar. This tool is not financial advice and does not promise a profit. The setups tab is a different path: names that do not qualify for entry now go on the watchlist only if they have tested support and a numeric invalidation. A lower price by itself does not score there.",
        )}
      </p>
    </section>
  );
}

function Layer({ t, d }: { t: string; d: string }) {
  const { tr } = useI18n();
  return (
    <div className="rounded-md bg-bg p-4 shadow-[var(--shadow-border)]">
      <p className="text-sm text-fg">{tr(t)}</p>
      <p className="mt-2 text-xs leading-relaxed text-muted">{tr(d)}</p>
    </div>
  );
}
