//#region node_modules/.nitro/vite/services/ssr/assets/alpha-stack-C9qd7R3T.js
var GROUPS = [
	"trend",
	"structure",
	"location",
	"momentum",
	"flow"
];
function buildAlphaStack(candles) {
	const bars = candles.filter((bar) => Number.isFinite(bar.o) && Number.isFinite(bar.h) && Number.isFinite(bar.l) && Number.isFinite(bar.c) && bar.c > 0 && bar.h >= bar.l);
	if (bars.length < 40) return emptyStack(bars.length);
	const closes = bars.map((bar) => bar.c);
	const price = closes[closes.length - 1];
	const atr = lastAtr(bars, 14);
	const ichi = ichimoku(bars);
	const trend = supertrend(bars, 10, 3);
	const dmi = directional(bars, 14);
	const hull = hullSlope(closes, 16);
	const weekly = weeklyAlignment(closes);
	const vwap = rollingVwap(bars, 30);
	const profile = volumeProfile(bars, 70, 24);
	const bands = bollinger(closes, 20, 2);
	const kelt = keltner(bars, 20, 1.5);
	const squeeze = bands != null && kelt != null && bands.upper < kelt.upper && bands.lower > kelt.lower;
	const stoch = stochasticRsi(closes);
	const crsi = connorsRsi(closes);
	const macd = macdHist(closes);
	const divergence = rsiDivergence(closes);
	const cmf = chaikin(bars, 20);
	const obv = obvSlope(bars, 20);
	const structure = marketStructure(bars);
	const z = zScore(closes, 20);
	const er = efficiency(closes, 10);
	const rvol = relativeVolume(bars, 20);
	const ha = haStreak(bars);
	const rsi14 = rsiAt(closes, 14);
	const phase = wyckoffPhase({
		bars,
		price,
		cmf,
		dmi,
		er,
		obv,
		bands
	});
	const readings = [];
	const cloudVote = cloudPoints(ichi);
	readings.push(reading({
		key: "ichimoku",
		group: "trend",
		labelFa: "ابر ایچیموکو",
		labelEn: "Ichimoku cloud",
		value: ichi.pos == null ? "—" : ichi.pos === "above" ? "بالای ابر" : ichi.pos === "below" ? "زیر ابر" : "داخل ابر",
		valueEn: ichi.pos == null ? "—" : ichi.pos === "above" ? "Above cloud" : ichi.pos === "below" ? "Below cloud" : "Inside cloud",
		tone: toneOf(cloudVote),
		weight: 12,
		vote: cloudVote,
		detailFa: ichi.pos == null ? "تاریخچه برای ابر جابه‌جاشده ۵۲/۲۶ کافی نیست." : `قیمت ${ichi.pos === "above" ? "بالای" : ichi.pos === "below" ? "زیر" : "داخل"} ابر است، تنکان ${ichi.tk == null ? "نامشخص" : ichi.tk > 0 ? "بالای کیجون" : ichi.tk < 0 ? "زیر کیجون" : "روی کیجون"}، چیکو ${ichi.chikou == null ? "ناقص" : ichi.chikou ? "بالای قیمت ۲۶ روز قبل" : "زیر قیمت ۲۶ روز قبل"}.`,
		detailEn: ichi.pos == null ? "Not enough history for the displaced 52/26 cloud." : `Price is ${ichi.pos} the cloud, Tenkan is ${ichi.tk == null ? "unknown" : ichi.tk > 0 ? "above Kijun" : ichi.tk < 0 ? "below Kijun" : "on Kijun"}, Chikou is ${ichi.chikou == null ? "incomplete" : ichi.chikou ? "above the close 26 days ago" : "below the close 26 days ago"}.`
	}));
	readings.push(reading({
		key: "supertrend",
		group: "trend",
		labelFa: "سوپرترند",
		labelEn: "Supertrend",
		value: trend == null ? "—" : trend.dir > 0 ? "صعودی" : "نزولی",
		valueEn: trend == null ? "—" : trend.dir > 0 ? "Up" : "Down",
		tone: trend == null ? "flat" : trend.dir > 0 ? "up" : "down",
		weight: 10,
		vote: trend == null ? 0 : trend.dir > 0 ? 1 : -1,
		detailFa: trend == null ? "ATR برای سوپرترند ۱۰/۳ کامل نشد." : `خط سوپرترند ${formatPx(trend.line)} است و قیمت ${trend.dir > 0 ? "بالای" : "زیر"} آن بسته شده.`,
		detailEn: trend == null ? "ATR for Supertrend 10/3 was incomplete." : `The Supertrend line is ${formatPx(trend.line)} and price closed ${trend.dir > 0 ? "above" : "below"} it.`
	}));
	const adxVote = adxVoteOf(dmi);
	readings.push(reading({
		key: "adx",
		group: "trend",
		labelFa: "ADX و جهت",
		labelEn: "ADX and direction",
		value: dmi.adx == null ? "—" : `ADX ${dmi.adx.toFixed(0)}`,
		tone: toneOf(adxVote),
		weight: 9,
		vote: adxVote,
		detailFa: dmi.adx == null ? "ADX ۱۴ روزه کامل نشد." : `ADX ${dmi.adx.toFixed(1)}، +DI ${dmi.plus?.toFixed(1) ?? "—"}، −DI ${dmi.minus?.toFixed(1) ?? "—"}. زیر ۲۰ یعنی روند آن‌قدر قوی نیست که اندازه کامل بدهد.`,
		detailEn: dmi.adx == null ? "The 14-day ADX was incomplete." : `ADX ${dmi.adx.toFixed(1)}, +DI ${dmi.plus?.toFixed(1) ?? "—"}, −DI ${dmi.minus?.toFixed(1) ?? "—"}. Under 20, the trend is not strong enough for a full size.`
	}));
	const hullVote = hull.now == null || hull.prev == null ? 0 : hull.now > hull.prev ? 1 : hull.now < hull.prev ? -1 : 0;
	readings.push(reading({
		key: "hull",
		group: "trend",
		labelFa: "شیب هال",
		labelEn: "Hull slope",
		value: hullVote > 0 ? "بالا" : hullVote < 0 ? "پایین" : "صاف",
		valueEn: hullVote > 0 ? "Up" : hullVote < 0 ? "Down" : "Flat",
		tone: toneOf(hullVote),
		weight: 6,
		vote: hullVote,
		detailFa: "میانگین هال ۱۶ روز تأخیر کمی دارد و جهت کوتاه روند را نشان می‌دهد، نه نقطه خرید را.",
		detailEn: "The 16-day Hull average has little lag. It shows the short trend direction, not the buy price."
	}));
	readings.push(reading({
		key: "weekly",
		group: "trend",
		labelFa: "هم‌جهتی هفتگی",
		labelEn: "Weekly alignment",
		value: weekly == null ? "—" : weekly > 0 ? "بالای میانگین هفتگی" : "زیر میانگین هفتگی",
		valueEn: weekly == null ? "—" : weekly > 0 ? "Above the weekly average" : "Below the weekly average",
		tone: weekly == null ? "flat" : weekly > 0 ? "up" : "down",
		weight: 8,
		vote: weekly == null ? 0 : weekly > 0 ? 1 : -1,
		detailFa: weekly == null ? "برای میانگین ۱۰ هفته‌ای کندل کافی نیست." : "بستن روزانه آخر هر هفته با میانگین ۱۰ هفته مقایسه شد. خرید اسپات خلاف هفته اندازه کامل نمی‌گیرد.",
		detailEn: weekly == null ? "Not enough candles for a 10-week average." : "The last daily close of each week was compared with the 10-week average. A spot buy against the week does not get full size."
	}));
	const vwapVote = vwapLocation(price, vwap, atr);
	readings.push(reading({
		key: "vwap",
		group: "location",
		labelFa: "VWAP سی‌روزه",
		labelEn: "30-day VWAP",
		value: vwap == null ? "—" : formatPx(vwap.vwap),
		tone: toneOf(vwapVote),
		weight: 8,
		vote: vwapVote,
		detailFa: vwap == null ? "حجم برای VWAP کافی نبود." : `قیمت ${((price - vwap.vwap) / vwap.vwap * 100).toFixed(1)}٪ نسبت به میانگین حجمی است. ورود اسپات نزدیک VWAP یا کمی زیر آن است، نه خیلی بالاتر.`,
		detailEn: vwap == null ? "Volume was not enough for VWAP." : `Price is ${((price - vwap.vwap) / vwap.vwap * 100).toFixed(1)}% versus the volume-weighted average. A spot entry sits near VWAP or slightly under it, not far above.`
	}));
	const vaVote = valueAreaVote(price, profile);
	readings.push(reading({
		key: "profile",
		group: "location",
		labelFa: "پروفایل حجم",
		labelEn: "Volume profile",
		value: profile == null ? "—" : `POC ${formatPx(profile.poc)}`,
		tone: toneOf(vaVote),
		weight: 7,
		vote: vaVote,
		detailFa: profile == null ? "پروفایل حجم ساخته نشد." : `ناحیه ارزش ${formatPx(profile.val)} تا ${formatPx(profile.vah)} است. خرید اسپات در تخفیف یا روی POC منطقی‌تر از پریمیوم است.`,
		detailEn: profile == null ? "The volume profile was not built." : `Value area is ${formatPx(profile.val)} to ${formatPx(profile.vah)}. Spot buys make more sense at a discount or on the POC than in premium.`
	}));
	const bbVote = bandVote(bands, squeeze);
	readings.push(reading({
		key: "bands",
		group: "location",
		labelFa: "باند و فشردگی",
		labelEn: "Bands and squeeze",
		value: bands == null ? "—" : `%B ${bands.percentB.toFixed(2)}`,
		tone: toneOf(bbVote),
		weight: 7,
		vote: bbVote,
		detailFa: bands == null ? "باند بولینگر ۲۰/۲ کامل نشد." : `%B ${bands.percentB.toFixed(2)} و پهنا ${(bands.width * 100).toFixed(1)}٪. ${squeeze ? "بولینگر داخل کلتنر است: بازار فشرده است." : "فشردگی کلتنر فعال نیست."} بالای باند تعقیب است.`,
		detailEn: bands == null ? "Bollinger 20/2 was incomplete." : `%B is ${bands.percentB.toFixed(2)} and width is ${(bands.width * 100).toFixed(1)}%. ${squeeze ? "Bollinger is inside Keltner: the market is squeezed." : "The Keltner squeeze is not active."} Above the band is a chase.`
	}));
	const stochVote = stoch == null ? 0 : stoch.crossUp && stoch.k < 45 ? 1 : stoch.k > 85 ? -1 : stoch.k < 25 && stoch.rising ? 1 : 0;
	readings.push(reading({
		key: "stoch-rsi",
		group: "momentum",
		labelFa: "استوکاستیک RSI",
		labelEn: "Stochastic RSI",
		value: stoch == null ? "—" : stoch.k.toFixed(0),
		tone: toneOf(stochVote),
		weight: 7,
		vote: stochVote,
		detailFa: stoch == null ? "استوکاستیک RSI کامل نشد." : `%K ${stoch.k.toFixed(0)} و %D ${stoch.d.toFixed(0)}. برگشت از زیر ۲۰ تأیید مومنتوم است. بالای ۸۵ خرید تازه را گران می‌کند.`,
		detailEn: stoch == null ? "Stochastic RSI was incomplete." : `%K ${stoch.k.toFixed(0)} and %D ${stoch.d.toFixed(0)}. A turn up from under 20 confirms momentum. Above 85 makes a fresh buy expensive.`
	}));
	const crsiVote = crsi == null ? 0 : crsi < 25 ? 1 : crsi > 85 ? -1 : crsi < 45 ? 1 : 0;
	readings.push(reading({
		key: "connors",
		group: "momentum",
		labelFa: "RSI کانرز",
		labelEn: "Connors RSI",
		value: crsi == null ? "—" : crsi.toFixed(0),
		tone: toneOf(crsiVote === 1 && (crsi ?? 100) < 25 ? 1 : crsiVote),
		weight: 5,
		vote: crsiVote,
		detailFa: crsi == null ? "RSI کانرز به صد روز بازده نیاز دارد." : `ترکیب RSI سه‌روزه، RSI رشته روزهای هم‌جهت، و رتبه درصدی بازده: ${crsi.toFixed(0)}. زیر ۲۵ محل است، بالای ۸۵ کشیدگی.`,
		detailEn: crsi == null ? "Connors RSI needs one hundred days of returns." : `RSI(3), the streak RSI, and the percent rank of the return combine to ${crsi.toFixed(0)}. Under 25 is location. Above 85 is extension.`
	}));
	const macdVote = macd == null ? 0 : macd.hist > 0 && macd.rising ? 1 : macd.hist < 0 && !macd.rising ? -1 : macd.rising ? 1 : -1;
	readings.push(reading({
		key: "macd",
		group: "momentum",
		labelFa: "هیستوگرام مکدی",
		labelEn: "MACD histogram",
		value: macd == null ? "—" : macd.rising ? "رو به بالا" : "رو به پایین",
		valueEn: macd == null ? "—" : macd.rising ? "Rising" : "Falling",
		tone: toneOf(macdVote),
		weight: 7,
		vote: macd == null ? 0 : macdVote,
		detailFa: macd == null ? "مکدی ۱۲/۲۶/۹ کامل نشد." : `هیستوگرام ${macd.hist >= 0 ? "مثبت" : "منفی"} است و ${macd.rising ? "نسبت به دیروز بیشتر شده" : "نسبت به دیروز کمتر شده"}. برای اسپات، شیب مهم‌تر از خود تقاطع است.`,
		detailEn: macd == null ? "MACD 12/26/9 was incomplete." : `The histogram is ${macd.hist >= 0 ? "positive" : "negative"} and ${macd.rising ? "higher than yesterday" : "lower than yesterday"}. For spot, the slope matters more than the cross itself.`
	}));
	readings.push(reading({
		key: "divergence",
		group: "momentum",
		labelFa: "واگرایی RSI",
		labelEn: "RSI divergence",
		value: divergence === "bull" ? "صعودی" : divergence === "bear" ? "نزولی" : "ندارد",
		valueEn: divergence === "bull" ? "Bullish" : divergence === "bear" ? "Bearish" : "None",
		tone: divergence === "bull" ? "up" : divergence === "bear" ? "down" : "flat",
		weight: 6,
		vote: divergence === "bull" ? 1 : divergence === "bear" ? -1 : 0,
		detailFa: divergence === "bull" ? "کف قیمت پایین‌تر آمده ولی RSI بالاتر است. فروشنده ضعیف‌تر از قیمت به نظر می‌رسد." : divergence === "bear" ? "سقف قیمت بالاتر رفته ولی RSI پایین‌تر است. خرید در این سقف دیر است." : "بین دو سویینگ آخر، واگرایی قابل‌اتکایی دیده نشد.",
		detailEn: divergence === "bull" ? "Price made a lower low while RSI made a higher low. Sellers look weaker than price." : divergence === "bear" ? "Price made a higher high while RSI made a lower high. Buying this high is late." : "No reliable divergence between the last two swings."
	}));
	const cmfVote = cmf == null ? 0 : cmf > .05 ? 1 : cmf < -.05 ? -1 : 0;
	readings.push(reading({
		key: "cmf",
		group: "flow",
		labelFa: "جریان چایکین",
		labelEn: "Chaikin money flow",
		value: cmf == null ? "—" : cmf.toFixed(2),
		tone: toneOf(cmfVote),
		weight: 8,
		vote: cmfVote,
		detailFa: cmf == null ? "جریان چایکین ۲۰ روزه کامل نشد." : `CMF ${cmf.toFixed(2)}. مثبت یعنی کلوزها به سمت بالای کندل و همراه حجم بوده‌اند. این جریان اسپات است، نه فاندینگ.`,
		detailEn: cmf == null ? "20-day Chaikin money flow was incomplete." : `CMF ${cmf.toFixed(2)}. Positive means closes leaned to the top of the candle, with volume. This is spot flow, not funding.`
	}));
	const obvVote = obv == null ? 0 : obv > 0 ? 1 : obv < 0 ? -1 : 0;
	readings.push(reading({
		key: "obv",
		group: "flow",
		labelFa: "شیب OBV",
		labelEn: "OBV slope",
		value: obv == null ? "—" : obv > 0 ? "صعودی" : "نزولی",
		valueEn: obv == null ? "—" : obv > 0 ? "Rising" : "Falling",
		tone: toneOf(obvVote),
		weight: 6,
		vote: obvVote,
		detailFa: "شیب رگرسیون OBV بیست‌روزه. اگر قیمت بالا برود و OBV نیاید، خرید اسپات تأیید نشده است.",
		detailEn: "Twenty-day OBV regression slope. If price rises and OBV does not, the spot buy is not confirmed."
	}));
	const rvolVote = rvol == null ? 0 : rvol >= 1.15 && closes[closes.length - 1] >= closes[closes.length - 2] ? 1 : rvol >= 1.4 && closes[closes.length - 1] < closes[closes.length - 2] ? -1 : 0;
	readings.push(reading({
		key: "rvol",
		group: "flow",
		labelFa: "حجم نسبی",
		labelEn: "Relative volume",
		value: rvol == null ? "—" : `${rvol.toFixed(2)}×`,
		tone: toneOf(rvolVote),
		weight: 4,
		vote: rvolVote,
		detailFa: rvol == null ? "میانگین حجم ۲۰ روزه نبود." : `حجم امروز ${rvol.toFixed(2)} برابر میانگین ۲۰ روز است. حجم بالا روی کندل منفی، توزیع است نه ورود.`,
		detailEn: rvol == null ? "The 20-day volume average was missing." : `Today's volume is ${rvol.toFixed(2)} times the 20-day average. Heavy volume on a down candle is distribution, not an entry.`
	}));
	const structVote = structure.choch === "up" ? 1 : structure.choch === "down" ? -1 : structure.bias === "bull" ? 1 : structure.bias === "bear" ? -1 : 0;
	readings.push(reading({
		key: "structure",
		group: "structure",
		labelFa: "ساختار بازار",
		labelEn: "Market structure",
		value: structure.choch === "up" ? "CHOCH صعودی" : structure.choch === "down" ? "CHOCH نزولی" : structure.bias === "bull" ? "HH/HL" : structure.bias === "bear" ? "LH/LL" : "رنج",
		valueEn: structure.choch === "up" ? "Bullish CHOCH" : structure.choch === "down" ? "Bearish CHOCH" : structure.bias === "bull" ? "HH/HL" : structure.bias === "bear" ? "LH/LL" : "Range",
		tone: toneOf(structVote),
		weight: 10,
		vote: structVote,
		detailFa: structure.noteFa,
		detailEn: structure.noteEn
	}));
	const phaseVote = phase === "accumulation" || phase === "markup" ? 1 : phase === "distribution" || phase === "markdown" ? -1 : 0;
	readings.push(reading({
		key: "wyckoff",
		group: "structure",
		labelFa: "فاز وایکوف",
		labelEn: "Wyckoff phase",
		value: phaseLabel(phase).fa,
		valueEn: phaseLabel(phase).en,
		tone: toneOf(phaseVote),
		weight: 8,
		vote: phaseVote,
		detailFa: phaseNote(phase, er).fa,
		detailEn: phaseNote(phase, er).en
	}));
	const stretchVote = z == null ? 0 : z > 2 ? -1 : z < -1.4 && (trend?.dir ?? 0) >= 0 ? 1 : z > 1.4 ? -1 : 0;
	readings.push(reading({
		key: "stretch",
		group: "location",
		labelFa: "کشیدگی Z",
		labelEn: "Z-score stretch",
		value: z == null ? "—" : z.toFixed(2),
		tone: toneOf(stretchVote),
		weight: 5,
		vote: stretchVote,
		detailFa: z == null ? "Z-score بیست‌روزه کامل نشد." : `قیمت ${z.toFixed(2)} انحراف معیار از میانگین ۲۰ روز فاصله دارد. بالای ۲ تعقیب است. هیکن‌آشی ${ha > 0 ? `${ha} کندل سبز پیاپی` : ha < 0 ? `${Math.abs(ha)} کندل قرمز پیاپی` : "خنثی"}.`,
		detailEn: z == null ? "The 20-day z-score was incomplete." : `Price is ${z.toFixed(2)} standard deviations from the 20-day mean. Above 2 is a chase. Heikin-Ashi shows ${ha > 0 ? `${ha} green candles in a row` : ha < 0 ? `${Math.abs(ha)} red candles in a row` : "no streak"}.`
	}));
	const ordered = GROUPS.flatMap((group) => readings.filter((item) => item.group === group));
	const weightSum = ordered.reduce((sum, item) => sum + item.weight, 0);
	const weighted = ordered.reduce((sum, item) => sum + item.vote * item.weight, 0);
	let score = clamp(Math.round(50 + 50 * weighted / Math.max(weightSum, 1)));
	const decided = ordered.filter((item) => item.vote !== 0);
	const agreement = decided.length === 0 ? .5 : decided.filter((item) => item.vote > 0).length / decided.length;
	const chase = (rsi14 ?? 0) >= 72 && (bands?.percentB ?? 0) >= .9 && (z ?? 0) >= 1.45 || (z ?? 0) >= 2 && (bands?.percentB ?? 0) >= .98 && ha >= 5 || (crsi ?? 0) >= 90 && (bands?.percentB ?? 0) >= .9 && (z ?? 0) >= 1.45;
	const spring = phase === "accumulation" && (cmf ?? 0) >= -.02;
	let veto = null;
	if (chase) veto = "chase";
	else if (phase === "distribution" && (bands?.percentB ?? 0) > .62) veto = "distribution";
	else if (phase === "markdown" && (dmi.adx ?? 0) >= 23 && (trend?.dir ?? 1) < 0 && !spring) veto = "markdown";
	if (veto) score = Math.min(score, veto === "chase" ? 42 : 36);
	let bias = "wait";
	if (veto) bias = "avoid";
	else if (score >= 66 && agreement >= .55) bias = "buy";
	else if (score <= 40 || agreement <= .32) bias = "avoid";
	let sizeCap = "none";
	if (bias === "buy" && score >= 78 && agreement >= .68 && (phase === "markup" || phase === "accumulation") && weekly !== -1) sizeCap = "full";
	else if (bias === "buy") sizeCap = "half";
	else if (bias === "wait" && score >= 56) sizeCap = "half";
	const copy = headline({
		bias,
		score,
		veto,
		phase,
		agreement
	});
	return {
		score,
		agreement,
		bias,
		sizeCap,
		veto,
		phase,
		headlineFa: copy.fa,
		headlineEn: copy.en,
		readings: ordered
	};
}
/** Close-only tilt for the rank, where high/low are not stored. Kept small on purpose. */
function closeTrendBias(closes, volumes) {
	if (closes.length < 40) return {
		delta: 0,
		fa: "",
		en: ""
	};
	const price = closes[closes.length - 1];
	const e20 = emaLast(closes, 20);
	const e50 = emaLast(closes, 50);
	const e200 = emaLast(closes, Math.min(200, closes.length));
	const macd = macdHist(closes);
	const rsi14 = rsiAt(closes, 14);
	const bands = bollinger(closes, 20, 2);
	const obv = obvSlope(closes.map((c, i) => ({
		o: c,
		h: c,
		l: c,
		c,
		v: volumes[Math.min(i, Math.max(volumes.length - 1, 0))] ?? 0
	})), 20);
	let delta = 0;
	const fa = [];
	const en = [];
	if (e20 != null && e50 != null && e200 != null && price > e20 && e20 > e50 && e50 > e200) {
		delta += 4;
		fa.push("میانگین‌های ۲۰/۵۰/۲۰۰ روی کلوز دلاری مرتب‌اند");
		en.push("the 20/50/200 dollar-close averages are stacked");
	} else if (e200 != null && price < e200 && e50 != null && e50 < e200) {
		delta -= 4;
		fa.push("کلوز دلاری زیر میانگین ۲۰۰ است");
		en.push("the dollar close is under the 200 average");
	}
	if (macd && macd.hist > 0 && macd.rising) {
		delta += 2;
		fa.push("هیستوگرام مکدی بالا می‌آید");
		en.push("the MACD histogram is rising");
	} else if (macd && macd.hist < 0 && !macd.rising) {
		delta -= 2;
		fa.push("هیستوگرام مکدی پایین می‌آید");
		en.push("the MACD histogram is falling");
	}
	if (rsi14 != null && rsi14 >= 76) {
		delta -= 3;
		fa.push(`RSI ${rsi14.toFixed(0)} داغ است`);
		en.push(`RSI ${rsi14.toFixed(0)} is hot`);
	} else if (rsi14 != null && rsi14 <= 28) {
		delta -= 2;
		fa.push(`RSI ${rsi14.toFixed(0)} هنوز چاقوی در حال سقوط است`);
		en.push(`RSI ${rsi14.toFixed(0)} is still a falling knife`);
	}
	if (bands && bands.percentB > 1.02) {
		delta -= 2;
		fa.push("قیمت بیرون باند بالایی است");
		en.push("price is outside the upper band");
	}
	if (obv != null && obv > 0) delta += 1;
	else if (obv != null && obv < 0) delta -= 1;
	delta = Math.max(-8, Math.min(8, delta));
	if (delta === 0 || fa.length === 0) return {
		delta: 0,
		fa: "",
		en: ""
	};
	const sign = delta > 0 ? "+" : "";
	return {
		delta,
		fa: `پشته کلوز ${sign}${delta}: ${fa.join("، ")}.`,
		en: `Close stack ${sign}${delta}: ${en.join(", ")}.`
	};
}
function emptyStack(n) {
	return {
		score: 50,
		agreement: .5,
		bias: "wait",
		sizeCap: "none",
		veto: null,
		phase: "balance",
		headlineFa: `پشته اسپات با ${n} کندل ساخته نمی‌شود. حداقل چهل کندل روزانه لازم است، پس هیچ خریدی از این لایه نمی‌آید.`,
		headlineEn: `The spot stack cannot be built from ${n} candles. It needs at least forty daily bars, so this layer does not produce a buy.`,
		readings: []
	};
}
function headline(input) {
	const agree = `${Math.round(input.agreement * 100)}`;
	if (input.veto === "chase") return {
		fa: `پشته اسپات خرید را رد کرد. قیمت کش آمده است؛ RSI، باند و فاصله تا میانگین هم‌زمان داغ‌اند. امتیاز ${input.score}. این تعقیب سقف است، نه ورود اسپات.`,
		en: `The spot stack rejected the buy. Price is stretched: RSI, the bands, and distance from the mean are hot together. Score ${input.score}. This is chasing the high, not a spot entry.`
	};
	if (input.veto === "distribution") return {
		fa: `پشته اسپات خرید را رد کرد. فاز توزیع است و قیمت هنوز در نیمه بالایی ارزش معامله می‌شود. امتیاز ${input.score}.`,
		en: `The spot stack rejected the buy. The phase is distribution and price is still trading in the upper half of value. Score ${input.score}.`
	};
	if (input.veto === "markdown") return {
		fa: `پشته اسپات خرید را رد کرد. ساختار نزولی است، ADX جهت را تأیید می‌کند و سوپرترند پایین است. امتیاز ${input.score}.`,
		en: `The spot stack rejected the buy. Structure is down, ADX confirms the direction, and Supertrend is down. Score ${input.score}.`
	};
	if (input.bias === "buy") return {
		fa: `پشته اسپات موافق خرید است. روند، محل و جریان به اندازه کافی هم‌جهت‌اند. امتیاز ${input.score} از ۱۰۰، توافق رأی‌ها ${agree}٪. فاز: ${phaseLabel(input.phase).fa}.`,
		en: `The spot stack agrees with a buy. Trend, location, and flow line up enough. Score ${input.score} out of 100, vote agreement ${agree}%. Phase: ${phaseLabel(input.phase).en}.`
	};
	if (input.bias === "avoid") return {
		fa: `پشته اسپات می‌گوید نخر. رأی‌های مخالف بیشتر از موافق است. امتیاز ${input.score}. فاز: ${phaseLabel(input.phase).fa}.`,
		en: `The spot stack says do not buy. Opposing votes outnumber the agreeing ones. Score ${input.score}. Phase: ${phaseLabel(input.phase).en}.`
	};
	return {
		fa: `پشته اسپات می‌گوید صبر کن. روند الزاماً نشکسته، ولی محل ورود یا حجم هنوز خرید را تأیید نمی‌کند. امتیاز ${input.score}. فاز: ${phaseLabel(input.phase).fa}.`,
		en: `The spot stack says wait. The trend is not necessarily broken, but location or volume does not confirm a buy yet. Score ${input.score}. Phase: ${phaseLabel(input.phase).en}.`
	};
}
function phaseLabel(phase) {
	if (phase === "accumulation") return {
		fa: "انباشت",
		en: "accumulation"
	};
	if (phase === "markup") return {
		fa: "حرکت صعودی",
		en: "markup"
	};
	if (phase === "distribution") return {
		fa: "توزیع",
		en: "distribution"
	};
	if (phase === "markdown") return {
		fa: "حرکت نزولی",
		en: "markdown"
	};
	return {
		fa: "تعادل",
		en: "balance"
	};
}
function phaseNote(phase, er) {
	const eff = er == null ? "" : ` کارایی حرکت ${(er * 100).toFixed(0)}٪ است.`;
	const effEn = er == null ? "" : ` Move efficiency is ${(er * 100).toFixed(0)}%.`;
	if (phase === "accumulation") return {
		fa: `رنج به همراه جریان غیرمنفی، یا برگشت از زیر کف رنج. این‌جا خرید فقط روی خود ناحیه است، نه وسط محدوده.${eff}`,
		en: `A range with non-negative flow, or a reclaim from under the range low. Buy only on the zone itself, not in the middle.${effEn}`
	};
	if (phase === "markup") return {
		fa: `ADX جهت مثبت دارد و قیمت بالای میانگین ۵۰ روز است. پولبک به ارزش، ورود است.${eff}`,
		en: `ADX has a positive direction and price is above the 50-day average. A pullback into value is the entry.${effEn}`
	};
	if (phase === "distribution") return {
		fa: `بازار بالا مانده ولی جریان پول منفی است. این فاز برای خرید اسپات تازه مناسب نیست.${eff}`,
		en: `Price is still elevated while money flow is negative. This phase is a poor place for a fresh spot buy.${effEn}`
	};
	if (phase === "markdown") return {
		fa: `جهت نزولی غالب است. تا وقتی ساختار برنگردد، افت قیمت به‌تنهایی دلیل خرید نیست.${eff}`,
		en: `The down direction dominates. Until structure turns, a lower price is not a reason to buy.${effEn}`
	};
	return {
		fa: `جهت قاطعی بین روند و جریان پیدا نشد.${eff}`,
		en: `No decisive direction between trend and flow.${effEn}`
	};
}
function reading(input) {
	return input;
}
function toneOf(vote) {
	if (vote > 0) return "up";
	if (vote < 0) return "down";
	return "flat";
}
function cloudPoints(ichi) {
	if (ichi.pos == null) return 0;
	let pts = 0;
	if (ichi.pos === "above") pts += 1;
	else if (ichi.pos === "below") pts -= 1;
	if (ichi.tk != null) pts += ichi.tk > 0 ? 1 : ichi.tk < 0 ? -1 : 0;
	if (ichi.chikou != null) pts += ichi.chikou ? 1 : -1;
	if (pts >= 2) return 1;
	if (pts <= -2) return -1;
	return 0;
}
function adxVoteOf(dmi) {
	if (dmi.adx == null || dmi.plus == null || dmi.minus == null) return 0;
	if (dmi.adx < 18) return 0;
	if (dmi.plus > dmi.minus) return 1;
	if (dmi.minus > dmi.plus) return -1;
	return 0;
}
function vwapLocation(price, vwap, atr) {
	if (!vwap || !(vwap.vwap > 0)) return 0;
	const dist = (price - vwap.vwap) / vwap.vwap;
	const band = atr && price > 0 ? Math.max(.012, atr / price * .8) : .02;
	if (dist > band * 2.2) return -1;
	if (dist >= -band && dist <= band * 1.15) return 1;
	if (dist < -band * 2.4) return 0;
	return 0;
}
function valueAreaVote(price, profile) {
	if (!profile) return 0;
	if (price > profile.vah) return -1;
	if (price < profile.val) return 1;
	if (Math.abs(price - profile.poc) / price < .012) return 1;
	return 0;
}
function bandVote(bands, squeeze) {
	if (!bands) return 0;
	if (bands.percentB > 1) return -1;
	if (bands.percentB < 0) return 1;
	if (squeeze && bands.percentB >= .35 && bands.percentB <= .7) return 1;
	if (bands.percentB >= .25 && bands.percentB <= .62) return 1;
	return 0;
}
function wyckoffPhase(input) {
	const slice = input.bars.slice(-40);
	const hi = Math.max(...slice.map((bar) => bar.h));
	const lo = Math.min(...slice.map((bar) => bar.l));
	const narrow = (input.price > 0 ? (hi - lo) / input.price : 1) < .22 && (input.er == null || input.er < .45);
	const prior = input.bars.slice(-40, -3);
	const priorLo = prior.length ? Math.min(...prior.map((bar) => bar.l)) : lo;
	const reclaimed = input.bars.slice(-3).some((bar) => bar.l < priorLo) && input.price > priorLo;
	const flowUp = (input.cmf ?? 0) > .04 || (input.obv ?? 0) > 0;
	const flowDown = (input.cmf ?? 0) < -.05;
	const upDir = (input.dmi.adx ?? 0) >= 20 && (input.dmi.plus ?? 0) > (input.dmi.minus ?? 0);
	const downDir = (input.dmi.adx ?? 0) >= 20 && (input.dmi.minus ?? 0) > (input.dmi.plus ?? 0);
	const e50 = emaLast(input.bars.map((bar) => bar.c), 50);
	if (narrow && flowUp || reclaimed) return "accumulation";
	if (narrow && flowDown && (input.bands?.percentB ?? 0) > .55) return "distribution";
	if (upDir && e50 != null && input.price > e50) return "markup";
	if (downDir && e50 != null && input.price < e50) return "markdown";
	return "balance";
}
function ichimoku(bars) {
	const tenkan = [];
	const kijun = [];
	const spanA = [];
	const spanB = [];
	for (let i = 0; i < bars.length; i++) {
		const t = donchianMid(bars, i, 9);
		const k = donchianMid(bars, i, 26);
		tenkan.push(t);
		kijun.push(k);
		spanA.push(t != null && k != null ? (t + k) / 2 : null);
		spanB.push(donchianMid(bars, i, 52));
	}
	const i = bars.length - 1;
	const cloudAt = i - 26;
	const a = cloudAt >= 0 ? spanA[cloudAt] : null;
	const b = cloudAt >= 0 ? spanB[cloudAt] : null;
	const price = bars[i].c;
	let pos = null;
	if (a != null && b != null) pos = price > Math.max(a, b) ? "above" : price < Math.min(a, b) ? "below" : "inside";
	const tNow = tenkan[i];
	const kNow = kijun[i];
	const tk = tNow == null || kNow == null ? null : tNow > kNow ? 1 : tNow < kNow ? -1 : 0;
	const chikou = i >= 26 ? price > bars[i - 26].h : null;
	return {
		pos,
		tk,
		chikou
	};
}
function donchianMid(bars, index, length) {
	if (index + 1 < length) return null;
	let hi = -Infinity;
	let lo = Infinity;
	for (let i = index - length + 1; i <= index; i++) {
		hi = Math.max(hi, bars[i].h);
		lo = Math.min(lo, bars[i].l);
	}
	return (hi + lo) / 2;
}
function supertrend(bars, period, mult) {
	const atr = atrSeries(bars, period);
	let up = 0;
	let dn = 0;
	let dir = 1;
	let ready = false;
	for (let i = 0; i < bars.length; i++) {
		const a = atr[i];
		if (a == null) continue;
		const mid = (bars[i].h + bars[i].l) / 2;
		const basicUp = mid + mult * a;
		const basicDn = mid - mult * a;
		if (!ready) {
			up = basicUp;
			dn = basicDn;
			dir = 1;
			ready = true;
			continue;
		}
		const prevClose = bars[i - 1].c;
		const prevUp = up;
		const prevDn = dn;
		up = basicUp < prevUp || prevClose > prevUp ? basicUp : prevUp;
		dn = basicDn > prevDn || prevClose < prevDn ? basicDn : prevDn;
		if (dir === 1 && bars[i].c < dn) dir = -1;
		else if (dir === -1 && bars[i].c > up) dir = 1;
	}
	if (!ready) return null;
	return {
		dir,
		line: dir === 1 ? dn : up
	};
}
function directional(bars, period) {
	if (bars.length < period * 2 + 2) return {
		adx: null,
		plus: null,
		minus: null
	};
	const tr = [];
	const plus = [];
	const minus = [];
	for (let i = 1; i < bars.length; i++) {
		const cur = bars[i];
		const prev = bars[i - 1];
		tr.push(Math.max(cur.h - cur.l, Math.abs(cur.h - prev.c), Math.abs(cur.l - prev.c)));
		const up = cur.h - prev.h;
		const down = prev.l - cur.l;
		plus.push(up > down && up > 0 ? up : 0);
		minus.push(down > up && down > 0 ? down : 0);
	}
	let smTr = 0;
	let smPlus = 0;
	let smMinus = 0;
	for (let i = 0; i < period; i++) {
		smTr += tr[i] ?? 0;
		smPlus += plus[i] ?? 0;
		smMinus += minus[i] ?? 0;
	}
	const dx = [];
	const pushDx = () => {
		if (!(smTr > 0)) {
			dx.push(0);
			return;
		}
		const pdi = 100 * smPlus / smTr;
		const mdi = 100 * smMinus / smTr;
		const den = pdi + mdi;
		dx.push(den === 0 ? 0 : 100 * Math.abs(pdi - mdi) / den);
	};
	pushDx();
	for (let i = period; i < tr.length; i++) {
		smTr = smTr - smTr / period + (tr[i] ?? 0);
		smPlus = smPlus - smPlus / period + (plus[i] ?? 0);
		smMinus = smMinus - smMinus / period + (minus[i] ?? 0);
		pushDx();
	}
	if (dx.length < period) return {
		adx: null,
		plus: null,
		minus: null
	};
	let adx = 0;
	for (let i = 0; i < period; i++) adx += dx[i] ?? 0;
	adx /= period;
	for (let i = period; i < dx.length; i++) adx = (adx * (period - 1) + (dx[i] ?? 0)) / period;
	const pdi = smTr > 0 ? 100 * smPlus / smTr : null;
	const mdi = smTr > 0 ? 100 * smMinus / smTr : null;
	return {
		adx,
		plus: pdi,
		minus: mdi
	};
}
function atrSeries(bars, period) {
	const trs = [];
	for (let i = 0; i < bars.length; i++) {
		const bar = bars[i];
		const prev = i > 0 ? bars[i - 1].c : bar.c;
		trs.push(Math.max(bar.h - bar.l, Math.abs(bar.h - prev), Math.abs(bar.l - prev)));
	}
	return wilder(trs, period);
}
function lastAtr(bars, period) {
	const series = atrSeries(bars, period);
	const last = series[series.length - 1];
	return last == null ? null : last;
}
function wilder(values, period) {
	const out = Array(values.length).fill(null);
	if (values.length < period) return out;
	let prev = 0;
	for (let i = 0; i < period; i++) prev += values[i] ?? 0;
	prev /= period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = (prev * (period - 1) + (values[i] ?? 0)) / period;
		out[i] = prev;
	}
	return out;
}
function emaSeries(values, period) {
	const out = Array(values.length).fill(null);
	if (values.length < period || period < 1) return out;
	const k = 2 / (period + 1);
	let prev = 0;
	for (let i = 0; i < period; i++) prev += values[i] ?? 0;
	prev /= period;
	out[period - 1] = prev;
	for (let i = period; i < values.length; i++) {
		prev = ((values[i] ?? 0) - prev) * k + prev;
		out[i] = prev;
	}
	return out;
}
function emaLast(values, period) {
	if (values.length < period) return null;
	const series = emaSeries(values, period);
	return series[series.length - 1] ?? null;
}
function rsiSeries(values, period) {
	const out = Array(values.length).fill(null);
	if (values.length < period + 1) return out;
	let gain = 0;
	let loss = 0;
	for (let i = 1; i <= period; i++) {
		const diff = (values[i] ?? 0) - (values[i - 1] ?? 0);
		if (diff >= 0) gain += diff;
		else loss -= diff;
	}
	gain /= period;
	loss /= period;
	out[period] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
	for (let i = period + 1; i < values.length; i++) {
		const diff = (values[i] ?? 0) - (values[i - 1] ?? 0);
		gain = (gain * (period - 1) + Math.max(diff, 0)) / period;
		loss = (loss * (period - 1) + Math.max(-diff, 0)) / period;
		out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
	}
	return out;
}
function rsiAt(values, period) {
	const series = rsiSeries(values, period);
	return series[series.length - 1] ?? null;
}
function macdHist(closes) {
	if (closes.length < 40) return null;
	const fast = emaSeries(closes, 12);
	const slow = emaSeries(closes, 26);
	const macd = [];
	for (let i = 0; i < closes.length; i++) {
		if (fast[i] == null || slow[i] == null) continue;
		macd.push(fast[i] - slow[i]);
	}
	if (macd.length < 12) return null;
	const signal = emaSeries(macd, 9);
	const last = signal.length - 1;
	const prev = last - 1;
	if (signal[last] == null || signal[prev] == null) return null;
	const hist = macd[last] - signal[last];
	return {
		hist,
		rising: hist > macd[prev] - signal[prev]
	};
}
function stochasticRsi(closes) {
	const rsi = rsiSeries(closes, 14);
	const raw = [];
	for (let i = 0; i < rsi.length; i++) {
		if (i < 27 || rsi[i] == null) continue;
		let hi = -Infinity;
		let lo = Infinity;
		let ok = true;
		for (let k = i - 13; k <= i; k++) {
			if (rsi[k] == null) {
				ok = false;
				break;
			}
			hi = Math.max(hi, rsi[k]);
			lo = Math.min(lo, rsi[k]);
		}
		if (!ok || !Number.isFinite(hi) || hi === -Infinity) continue;
		raw.push(hi === lo ? 50 : (rsi[i] - lo) / (hi - lo) * 100);
	}
	if (raw.length < 8) return null;
	const kNow = mean(raw.slice(-3));
	const kPrev = mean(raw.slice(-4, -1));
	const kSeries = [];
	for (let i = 2; i < raw.length; i++) kSeries.push(mean(raw.slice(i - 2, i + 1)));
	const dNow = mean(kSeries.slice(-3));
	const dPrev = kSeries.length >= 4 ? mean(kSeries.slice(-4, -1)) : dNow;
	return {
		k: kNow,
		d: dNow,
		rising: kNow > kPrev,
		crossUp: kPrev <= dPrev && kNow > dNow && kNow < 55
	};
}
function connorsRsi(closes) {
	if (closes.length < 110) return null;
	const rsi3 = rsiAt(closes, 3);
	const rsiStreak = rsiAt(streakSeries(closes), 2);
	const rank = percentRank(closes, 100);
	if (rsi3 == null || rsiStreak == null || rank == null) return null;
	return (rsi3 + rsiStreak + rank) / 3;
}
function streakSeries(closes) {
	const out = [0];
	let streak = 0;
	for (let i = 1; i < closes.length; i++) {
		if (closes[i] > closes[i - 1]) streak = streak >= 0 ? streak + 1 : 1;
		else if (closes[i] < closes[i - 1]) streak = streak <= 0 ? streak - 1 : -1;
		else streak = 0;
		out.push(streak);
	}
	return out;
}
function percentRank(closes, look) {
	if (closes.length < look + 1) return null;
	const last = closes[closes.length - 1] / closes[closes.length - 2] - 1;
	let le = 0;
	for (let i = closes.length - look; i < closes.length; i++) {
		const prev = closes[i - 1];
		if (!prev) continue;
		if (closes[i] / prev - 1 <= last) le += 1;
	}
	return le / look * 100;
}
function bollinger(closes, period, mult) {
	if (closes.length < period) return null;
	const slice = closes.slice(-period);
	const mid = mean(slice);
	const dev = Math.sqrt(slice.reduce((sum, value) => sum + (value - mid) ** 2, 0) / period);
	const upper = mid + mult * dev;
	const lower = mid - mult * dev;
	const price = closes[closes.length - 1];
	const span = upper - lower;
	if (!(span > 0) || !(mid > 0)) return null;
	return {
		percentB: (price - lower) / span,
		width: span / mid,
		upper,
		lower
	};
}
function keltner(bars, period, mult) {
	const mid = emaLast(bars.map((bar) => bar.c), period);
	const atr = lastAtr(bars, period);
	if (mid == null || atr == null) return null;
	return {
		upper: mid + mult * atr,
		lower: mid - mult * atr
	};
}
function chaikin(bars, period) {
	if (bars.length < period) return null;
	const slice = bars.slice(-period);
	let flow = 0;
	let vol = 0;
	for (const bar of slice) {
		const span = bar.h - bar.l;
		const mfm = span > 0 ? (bar.c - bar.l - (bar.h - bar.c)) / span : 0;
		const v = Number.isFinite(bar.v) ? Math.max(bar.v, 0) : 0;
		flow += mfm * v;
		vol += v;
	}
	if (!(vol > 0)) return null;
	return flow / vol;
}
function obvSlope(bars, period) {
	if (bars.length < period + 2) return null;
	let acc = 0;
	const series = [0];
	for (let i = 1; i < bars.length; i++) {
		if (bars[i].c > bars[i - 1].c) acc += bars[i].v || 0;
		else if (bars[i].c < bars[i - 1].c) acc -= bars[i].v || 0;
		series.push(acc);
	}
	const slope = linregSlope(series.slice(-period));
	if (slope == null) return null;
	return Math.sign(slope);
}
function rollingVwap(bars, period) {
	if (bars.length < period) return null;
	const slice = bars.slice(-period);
	let pv = 0;
	let vol = 0;
	for (const bar of slice) {
		const v = Number.isFinite(bar.v) ? Math.max(bar.v, 0) : 0;
		pv += (bar.h + bar.l + bar.c) / 3 * v;
		vol += v;
	}
	if (!(vol > 0)) return null;
	return { vwap: pv / vol };
}
function volumeProfile(bars, look, bins) {
	const slice = bars.slice(-look);
	if (slice.length < 20) return null;
	let lo = Infinity;
	let hi = -Infinity;
	for (const bar of slice) {
		lo = Math.min(lo, bar.l);
		hi = Math.max(hi, bar.h);
	}
	if (!(hi > lo)) return null;
	const width = (hi - lo) / bins;
	const vol = Array.from({ length: bins }, () => 0);
	for (const bar of slice) {
		const typical = (bar.h + bar.l + bar.c) / 3;
		let index = Math.floor((typical - lo) / width);
		if (index < 0) index = 0;
		if (index >= bins) index = bins - 1;
		vol[index] = (vol[index] ?? 0) + Math.max(bar.v || 0, 0);
	}
	let poc = 0;
	for (let i = 1; i < bins; i++) if ((vol[i] ?? 0) > (vol[poc] ?? 0)) poc = i;
	const total = vol.reduce((sum, value) => sum + value, 0);
	if (!(total > 0)) return null;
	let acc = vol[poc] ?? 0;
	let left = poc;
	let right = poc;
	while (acc < total * .7 && (left > 0 || right < bins - 1)) {
		const leftVol = left > 0 ? vol[left - 1] ?? 0 : -1;
		if ((right < bins - 1 ? vol[right + 1] ?? 0 : -1) >= leftVol) {
			right += 1;
			acc += vol[right] ?? 0;
		} else {
			left -= 1;
			acc += vol[left] ?? 0;
		}
	}
	return {
		poc: lo + (poc + .5) * width,
		val: lo + left * width,
		vah: lo + (right + 1) * width
	};
}
function marketStructure(bars) {
	const start = Math.max(3, bars.length - 90);
	const highs = [];
	const lows = [];
	for (let i = start; i < bars.length - 3; i++) {
		if (isPivot(bars, i, 3, "high")) highs.push({
			i,
			p: bars[i].h
		});
		if (isPivot(bars, i, 3, "low")) lows.push({
			i,
			p: bars[i].l
		});
	}
	const coarse = coarseSwings(bars);
	const h1 = highs[highs.length - 2] ?? coarse.highs[coarse.highs.length - 2];
	const h2 = highs[highs.length - 1] ?? coarse.highs[coarse.highs.length - 1];
	const l1 = lows[lows.length - 2] ?? coarse.lows[coarse.lows.length - 2];
	const l2 = lows[lows.length - 1] ?? coarse.lows[coarse.lows.length - 1];
	if (!h1 || !h2 || !l1 || !l2) return {
		bias: "range",
		choch: null,
		noteFa: "سویینگ کافی برای ساختار بازار پیدا نشد.",
		noteEn: "Not enough swings to read market structure."
	};
	const hh = h2.p > h1.p;
	const hl = l2.p > l1.p;
	const bias = hh && hl ? "bull" : !hh && !hl ? "bear" : "range";
	const price = bars[bars.length - 1].c;
	let choch = null;
	if (bias !== "bull" && price > h2.p) choch = "up";
	else if (bias !== "bear" && price < l2.p) choch = "down";
	return {
		bias,
		choch,
		noteFa: choch === "up" ? "قیمت سقف سویینگ آخر را بسته و ساختار قبلی را شکسته. این تغییر رفتار است، به شرط حجم." : choch === "down" ? "قیمت کف سویینگ آخر را از دست داده. تا پس‌گرفتن همان کف، خرید اسپات تازه نیست." : bias === "bull" ? "سقف و کف آخر هر دو بالاترند. روند ساختاری هنوز صعودی است." : bias === "bear" ? "سقف و کف آخر هر دو پایین‌ترند. ساختار روزانه نزولی است." : "سقف و کف هم‌جهت نیستند. ساختار رنج است.",
		noteEn: choch === "up" ? "Price closed through the last swing high and broke the prior structure. That is a change of character, if volume agrees." : choch === "down" ? "Price lost the last swing low. Until that low is reclaimed, this is not a fresh spot buy." : bias === "bull" ? "The last high and the last low are both higher. Structural trend is still up." : bias === "bear" ? "The last high and the last low are both lower. Daily structure is down." : "Highs and lows do not agree. Structure is a range."
	};
}
function coarseSwings(bars) {
	const highs = [];
	const lows = [];
	const chunk = 6;
	const from = Math.max(0, bars.length - 84);
	for (let start = from; start + chunk <= bars.length - 2; start += chunk) {
		let hi = -Infinity;
		let lo = Infinity;
		let hiI = start;
		let loI = start;
		for (let i = start; i < start + chunk; i++) {
			if (bars[i].h >= hi) {
				hi = bars[i].h;
				hiI = i;
			}
			if (bars[i].l <= lo) {
				lo = bars[i].l;
				loI = i;
			}
		}
		highs.push({
			i: hiI,
			p: hi
		});
		lows.push({
			i: loI,
			p: lo
		});
	}
	return {
		highs,
		lows
	};
}
function isPivot(bars, index, wing, side) {
	const price = side === "high" ? bars[index].h : bars[index].l;
	for (let j = index - wing; j <= index + wing; j++) {
		if (j === index) continue;
		const other = side === "high" ? bars[j].h : bars[j].l;
		if (side === "high" ? other >= price : other <= price) return false;
	}
	return true;
}
function rsiDivergence(closes) {
	const rsi = rsiSeries(closes, 14);
	const start = Math.max(16, closes.length - 50);
	const lows = [];
	const highs = [];
	for (let i = start; i < closes.length - 3; i++) {
		if (rsi[i] == null) continue;
		if (pivotValue(closes, i, 3, "low")) lows.push(i);
		if (pivotValue(closes, i, 3, "high")) highs.push(i);
	}
	const l1 = lows[lows.length - 2];
	const l2 = lows[lows.length - 1];
	if (l1 != null && l2 != null && rsi[l1] != null && rsi[l2] != null) {
		if (closes[l2] < closes[l1] * .995 && rsi[l2] > rsi[l1] + 2) return "bull";
	}
	const h1 = highs[highs.length - 2];
	const h2 = highs[highs.length - 1];
	if (h1 != null && h2 != null && rsi[h1] != null && rsi[h2] != null) {
		if (closes[h2] > closes[h1] * 1.005 && rsi[h2] < rsi[h1] - 2) return "bear";
	}
	return null;
}
function pivotValue(values, index, wing, side) {
	const price = values[index];
	for (let j = index - wing; j <= index + wing; j++) {
		if (j === index) continue;
		const other = values[j];
		if (side === "high" ? other >= price : other <= price) return false;
	}
	return true;
}
function zScore(closes, period) {
	if (closes.length < period) return null;
	const slice = closes.slice(-period);
	const mid = mean(slice);
	const dev = Math.sqrt(slice.reduce((sum, value) => sum + (value - mid) ** 2, 0) / period);
	if (!(dev > 0)) return 0;
	return (closes[closes.length - 1] - mid) / dev;
}
function efficiency(closes, period) {
	if (closes.length <= period) return null;
	const change = Math.abs(closes[closes.length - 1] - closes[closes.length - 1 - period]);
	let noise = 0;
	for (let i = closes.length - period; i < closes.length; i++) noise += Math.abs(closes[i] - closes[i - 1]);
	if (noise === 0) return 0;
	return change / noise;
}
function relativeVolume(bars, period) {
	if (bars.length < period + 1) return null;
	const avg = mean(bars.slice(-period - 1, -1).map((bar) => Math.max(bar.v || 0, 0)));
	if (!(avg > 0)) return null;
	return Math.max(bars[bars.length - 1].v || 0, 0) / avg;
}
function haStreak(bars) {
	let open = (bars[0].o + bars[0].c) / 2;
	let streak = 0;
	let up = true;
	for (const bar of bars) {
		const close = (bar.o + bar.h + bar.l + bar.c) / 4;
		const green = close >= open;
		if (streak === 0 || green === up) streak += 1;
		else streak = 1;
		up = green;
		open = (open + close) / 2;
	}
	return up ? streak : -streak;
}
function weeklyAlignment(closes) {
	const weekly = [];
	for (let end = 7; end <= closes.length; end += 7) weekly.push(closes[end - 1]);
	if (closes.length % 7 !== 0) weekly.push(closes[closes.length - 1]);
	if (weekly.length < 12) return null;
	const avg = emaLast(weekly, 10);
	if (avg == null) return null;
	return weekly[weekly.length - 1] >= avg ? 1 : -1;
}
function hullSlope(closes, period) {
	const half = Math.max(2, Math.round(period / 2));
	const root = Math.max(2, Math.round(Math.sqrt(period)));
	const fast = wmaSeries(closes, half);
	const slow = wmaSeries(closes, period);
	const raw = [];
	for (let i = 0; i < closes.length; i++) {
		if (fast[i] == null || slow[i] == null) continue;
		raw.push(2 * fast[i] - slow[i]);
	}
	if (raw.length < root + 4) return {
		now: null,
		prev: null
	};
	return {
		now: wma(raw, root),
		prev: wma(raw.slice(0, -3), root)
	};
}
function wma(values, period) {
	if (values.length < period) return null;
	let num = 0;
	let den = 0;
	const slice = values.slice(-period);
	for (let i = 0; i < period; i++) {
		const weight = i + 1;
		num += slice[i] * weight;
		den += weight;
	}
	return den === 0 ? null : num / den;
}
function wmaSeries(values, period) {
	const out = Array(values.length).fill(null);
	if (period < 1) return out;
	for (let i = period - 1; i < values.length; i++) {
		let num = 0;
		let den = 0;
		for (let k = 0; k < period; k++) {
			const weight = k + 1;
			num += values[i - period + 1 + k] * weight;
			den += weight;
		}
		out[i] = num / den;
	}
	return out;
}
function linregSlope(values) {
	const slice = values.filter((value) => Number.isFinite(value));
	const n = slice.length;
	if (n < 5) return null;
	let sumX = 0;
	let sumY = 0;
	let sumXY = 0;
	let sumXX = 0;
	for (let i = 0; i < n; i++) {
		sumX += i;
		sumY += slice[i];
		sumXY += i * slice[i];
		sumXX += i * i;
	}
	const den = n * sumXX - sumX * sumX;
	if (den === 0) return null;
	return (n * sumXY - sumX * sumY) / den;
}
function mean(values) {
	if (values.length === 0) return 0;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function clamp(n, min = 0, max = 100) {
	return Math.min(max, Math.max(min, n));
}
function formatPx(n) {
	if (!Number.isFinite(n)) return "—";
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
	if (n >= 1) return n.toFixed(2);
	return n.toPrecision(3);
}
//#endregion
export { closeTrendBias as n, buildAlphaStack as t };
