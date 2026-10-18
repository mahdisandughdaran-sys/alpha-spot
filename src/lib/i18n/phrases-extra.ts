/** Labels and sentences that used to fall through to broken transliteration. */
export const EXTRA_PHRASES: [string, string][] = [
  ["بهترین نقطه ورود", "Best entry"],
  ["بهترین نقطه خرید", "Best buy"],
  ["بهترین نقطه", "Best entry"],
  ["نقشه لیکوییدیشن", "Liquidation map"],
  ["جریان حجم", "Volume flow"],
  ["حجم مجاز خرید", "Allowed buy size"],
  ["حجم پوزیشن و توصیه", "Position size and guidance"],
  ["دلتای ساعتی", "Hourly delta"],
  ["خریدار ۲۴س", "24h buyer"],
  ["زیرو اکس", "0x"],
  ["یرن فایننس", "yearn.finance"],
  ["اکسی اینفینیتی", "Axie Infinity"],
  ["مسک نتورک", "Mask Network"],
  ["تراست ولت", "Trust Wallet"],
  ["ای‌پی‌آی۳", "API3"],
  [
    "کندل اسپات، تیکر خریدار و خوشه‌های لیکوییدیشن خوانده می‌شود.",
    "Reading the spot candles, taker buy, and liquidation clusters.",
  ],
  [
    "جریان حجم، نقشه لیکوییدیشن و اندازه پوزیشن با هم خوانده می‌شوند. خروجی یک جمله است:",
    "Volume flow, the liquidation map, and position size are read together. The output is one sentence:",
  ],
  [
    "حجم ($) = (سرمایه × ریسک٪) / حدضرر٪. حداکثر ضرر همان سرمایه ضربدر ریسک است، مستقل از حدضرر.",
    "Size ($) = (capital × risk%) / stop%. Max loss is capital times risk, and it does not depend on the stop distance.",
  ],
  [
    "حد ضرر اولیه زیر خوشه لانگ است و بین ۱٫۵٪ تا ۸٪ بسته شده. می‌توانید عوضش کنید.",
    "The initial stop sits under the long cluster and is clamped between 1.5% and 8%. You can change it.",
  ],
  [
    "توصیه اجتناب است، پس حجم مجاز خرید صفر است. عدد بالا فقط خروجی فرمول است اگر خودتان خلاف سیگنال وارد شوید.",
    "The call is avoid, so the allowed buy size is zero. The figure above is only the formula, if you enter against the signal.",
  ],
  [
    "جریان حجم از حجم خرید تیکر کندل اسپات بایننس است؛ همان فشار خرید و فروشی که Volume Flow در Cryptometer نشان می‌دهد.",
    "Volume flow is Binance spot taker-buy volume — the same buy and sell pressure Cryptometer calls Volume Flow.",
  ],
  [
    "نقشه، خوشه تخمینی است: اهرم ۵ تا ۱۰۰ روی پروفایل حجم، فقط سطوحی که هنوز سویپ نشده‌اند، با وزن فاندینگ و نسبت لانگ/شورت.",
    "The map is an estimated cluster: 5x to 100x on the volume profile, only levels not yet swept, weighted by funding and the long/short ratio.",
  ],
  [
    "دیوار اختصاصی Coinglass بدون کلید API جایگزین نشده. این توصیه سرمایه‌گذاری نیست.",
    "A proprietary Coinglass wall is not replaced without an API key. This is not investment advice.",
  ],
  [
    "بسته شدن روزانه نباید زیر کف محدوده باشد.",
    "The daily close must not finish under the zone low.",
  ],
  [
    "یا RSI از زیر ۳۸ برگشته و بالاتر از سه کندل قبل است، یا هیستوگرام MACD از منفی به مثبت چرخیده است.",
    "Either RSI has turned up from below 38 and is higher than three candles ago, or the MACD histogram has flipped from negative to positive.",
  ],
  [
    "کندل نزولی با حجم غیرعادی (z بالای ۱٫۲) تأیید را باطل می‌کند.",
    "A down candle with unusual volume (z above 1.2) cancels the confirmation.",
  ],
  [
    "یا دو بسته شدن پیاپی زیر کف محدوده.",
    "Or two consecutive closes under the zone low.",
  ],
  ["رسیدن قیمت به این باند خرید نیست.", "Price reaching this band is not a buy."],
  ["سفارش بایننس ثبت شد.", "The Binance order was placed."],
  ["سفارش بای‌بیت ثبت شد.", "The Bybit order was placed."],
  [
    "اسکنر فرصت اجرا نشد؛ رتبه‌بندی فعلی میز دست نخورده است.",
    "The setup scanner did not run. The desk’s current ranking is unchanged.",
  ],
  [
    "اسکنر فرصت به خطا خورد و نتیجه آن کنار گذاشته شد. انتخاب اصلی میز همچنان معتبر است.",
    "The setup scanner hit an error and its result was set aside. The desk’s primary pick is still valid.",
  ],
  [
    " و قیمت همین حالا به آن رسیده یا از آن گذشته",
    " and price has already reached it or moved through it",
  ],
  [" و قیمت کنار همین نقطه است", " and price is sitting on this level"],
  ["موتور خرید اسپات", "Spot buy engine"],
  [
    "این چهار عدد بعد از امتیاز اصلی اعمال می‌شوند: تورم عرضه، جریان ۱۴ روزه، بخش پیشتاز، و حد ضرر بر اساس نوسان.",
    "These four numbers are applied after the main score: supply dilution, 14-day flow, the leading sector, and a volatility stop.",
  ],
  ["مرکز راهنما", "Guide"],
  ["دفترچه میز و موتور خرید اسپات", "Desk guide and the spot buy engine"],
  [
    "هر مولفه یک آستانه عددی دارد. اگر تحلیل را اجرا کرده باشید، وضعیت همین لحظه زیر همان قاعده می‌آید.",
    "Each piece has a numeric threshold. After you run an analysis, the live state is shown under that rule.",
  ],
  [
    "این دفترچه توصیه خرید نیست؛ توضیح همان عددی است که میز نشان می‌دهد.",
    "This guide is not a buy recommendation. It explains the number the desk is showing.",
  ],
  ["وضعیت زنده بعد از «تحلیل ۱۰۰ ارز برتر» اینجا می‌نشیند.", "The live state lands here after “Rank the top 100”."],
  ["بازگشت حد ضرر به سطح مدل", "Reset the stop to the model level"],
  ["میانگین ماه‌های کامل مدل", "Average of the model’s complete months"],
  ["میانگین ماه‌های مدل", "Average of the model’s months"],
  [" لغزش دارد", " of slippage"],
  [" امتیاز و ", " points and "],
  ["باز کردن میز بیت‌کوین", "Open the Bitcoin desk"],
  ["حرارت لانگ، زیر قیمت", "Long heat, below price"],
  ["حرارت شورت، بالای قیمت", "Short heat, above price"],
  ["همگرایی خرید اسپات", "Spot buy confluence"],
  ["بازار، روی قیمت فعلی", "Market, at the current price"],
  ["بدون سفارش", "No order"],
];
