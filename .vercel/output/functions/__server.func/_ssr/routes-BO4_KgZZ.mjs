import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Link, n as require_react_dom } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./ssr.mjs";
import { a as plain, i as msg } from "./lex-Cs-UGOvC.mjs";
import { _ as Activity, a as ShieldAlert, c as Newspaper, d as KeyRound, f as Info, i as ShieldCheck, l as Minus, m as CalendarOff, n as TriangleAlert, o as Send, p as Check, r as Star, s as RefreshCw, t as X, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as useI18n } from "./router-C43P1ojc.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { a as cn, c as formatPctPoints, d as formatUsd, f as timeAgoFa, i as LocaleSwitch, l as formatScore, n as CoinMark, o as createSsrRpc, p as useServerFn, r as DeskCompare, s as formatPct, t as Button, u as formatUntil } from "./desk-compare-BQ2s20px.mjs";
import { t as clamp } from "./math-s2DhiTks.mjs";
import { i as sealAnalysis } from "./validity-Cub-TWAU.mjs";
import { a as YAxis, c as Line, d as Bar, f as Pie, h as Tooltip, i as LineChart, l as ReferenceArea, m as ResponsiveContainer, n as PieChart, o as XAxis, p as Cell, r as BarChart, s as Area, t as AreaChart, u as ReferenceLine } from "../_libs/recharts+[...].mjs";
import { a as isVenue, n as VENUE_LABEL, o as normalizeVenueCall, t as VENUES } from "./venues-XIXD-v6f.mjs";
import { t as buildRebalancePlan } from "./rebalance-Drgn_Qoi.mjs";
import { i as sizePosition } from "./confluence-CiYXi4Xx.mjs";
import { c as dominanceTitle, d as sessionCalendar, f as upcomingEvents, i as checklistPassCount, o as confidenceTitle, p as verdictSentence, t as btcPriceLabel, u as regimeTitle } from "./session-calendar-DL92p9U9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BO4_KgZZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
var FACTORS$1 = [
	{
		w: "۲۲٪",
		t: "قدرت نسبی به بیت‌کوین",
		d: "بازده ۷، ۱۴ و ۳۰ روزه روی جفت BTC، نه تتر. اگر آلت دلاری سبز باشد ولی از بیت عقب بماند، امتیاز نمی‌گیرد."
	},
	{
		w: "۱۶٪",
		t: "توکنومیکس · MC/FDV",
		d: "اگر نسبت ارزش بازار به ارزش رقیق‌شده زیر ۰٫۵ باشد، آزادسازی توکن فشار فروش می‌سازد. اولویت با MC/FDV بالای ۰٫۷ است. جدا از این نسبت، کلیف ۳۰ روز آینده اگر از ۳٪ عرضه بگذرد ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌کند."
	},
	{
		w: "۱۶٪",
		t: "موقعیت ورود",
		d: "قدرت نسبی سقف‌دار روی جفت بیت‌کوین. جلو افتادن از بیت امتیاز ورود است. جهش سهموی و چاقوی در حال سقوط امتیاز از دست می‌دهند. RSI متعادل به‌تنهایی نقطه ورود نیست."
	},
	{
		w: "۱۶٪",
		t: "روند کلان",
		d: "EMA ۲۰۰ روزانه، ساختار هفتگی (CHoCH/BOS)، میانگین ۱۰ روزه جفت BTC و تأیید حجم / OBV."
	},
	{
		w: "۱۴٪",
		t: "نقدشوندگی اسپات",
		d: "حجم ۲۴ ساعته، گردش نسبت به مارکت‌کپ (هدف بالای ۲٪)، و وجود جفت BTC واقعی روی بایننس."
	},
	{
		w: "۱۰٪",
		t: "بازده به ریسک",
		d: "بازده جفت BTC تقسیم بر نوسان، حداکثر افت ۳۰ روزه، و بتا. جهش بدون کنترل نوسان امتیاز نمی‌گیرد."
	},
	{
		w: "۶٪",
		t: "روایت و ارزش‌افزایی",
		d: "ترند فعال (AI، RWA، DePIN، L2، سولانا) به‌علاوه مکانیزم واقعی: استیک، سوزاندن، بازخرید یا تقسیم درآمد — نه فقط توکن حاکمیتی."
	}
];
var FACTORS_EN = [
	{
		w: "22%",
		t: "Relative strength vs Bitcoin",
		d: "7, 14, and 30-day returns on the BTC pair, not USDT. A green USD chart that still lags Bitcoin does not score."
	},
	{
		w: "16%",
		t: "Tokenomics · MC/FDV",
		d: "If market cap over fully diluted value is under 0.5, unlocks create sell pressure. Preference is MC/FDV above 0.7. Separately, a cliff in the next 30 days above 3% of supply deducts 15 to 20 points from the total score."
	},
	{
		w: "16%",
		t: "Entry location",
		d: "Capped relative strength on the Bitcoin pair. Leading Bitcoin is the entry score. A parabolic jump and a falling knife lose points. A balanced RSI is not an entry by itself."
	},
	{
		w: "16%",
		t: "Macro trend",
		d: "Daily 200 EMA, weekly structure (CHoCH/BOS), the 10-day BTC-pair average, and volume / OBV confirmation."
	},
	{
		w: "14%",
		t: "Spot liquidity",
		d: "24-hour volume, turnover versus market cap (target above 2%), and a real BTC pair on Binance."
	},
	{
		w: "10%",
		t: "Return versus risk",
		d: "BTC-pair return divided by volatility, 30-day max drawdown, and beta. A spike with uncontrolled volatility does not score."
	},
	{
		w: "6%",
		t: "Narrative and value accrual",
		d: "An active trend (AI, RWA, DePIN, L2, Solana) plus a real mechanism: staking, burn, buyback, or revenue share — not a governance token alone."
	}
];
function Methodology() {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("منطق مدل — بدون جعبه سیاه", "Model logic — no black box")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				children: tr("سؤال این نیست «کدام ارز امروز سبز است». سؤال این است: اگر بخواهید الان اسپات بخرید و معیارتان بیت‌کوین باشد، کدام دارایی از نظر قدرت نسبی، توکنومیکس، نقطه ورود، روند کلان و نقدشوندگی منطقی‌تر است. استیبل‌کوین، رپد و مشتق استیک حذف می‌شوند. اگر آلت‌ها جمعاً از بیت‌کوین عقب باشند، خود بیت‌کوین می‌تواند برنده باشد.", "The question is not “which coin is green today.” It is: if you are buying spot now and Bitcoin is the benchmark, which name is more logical on relative strength, tokenomics, entry, macro trend, and liquidity. Stables, wrapped assets, and staked derivatives are removed. If alts as a group lag Bitcoin, Bitcoin itself can win.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 grid gap-4 md:grid-cols-2",
				children: FACTORS$1.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: tr(`وزن ${f.w}`, `Weight ${FACTORS_EN[i].w}`)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-fg",
							children: tr(f.t, FACTORS_EN[i].t)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs leading-relaxed text-muted",
							children: tr(f.d, FACTORS_EN[i].d)
						})
					]
				}, f.t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: tr("کلید قطع بیت‌کوین", "Bitcoin kill-switch"),
						d: tr("زیر EMA ۲۰۰ روزانه یا ساختار هفتگی شدیداً نزولی (افت ۴ هفته بیش از ۸٪ یا شکست کف ۸ هفته) حجم را نصف می‌کند. هر دو با هم، خرید اسپات را معلق و وزن را به BTC برمی‌گرداند.", "Below the daily 200 EMA, or a severely bearish weekly structure (a 4-week drop over 8% or a break of the 8-week low), cuts size in half. Both together suspend spot buys and return the weight to BTC.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: tr("جریمه کلیف آنلاک", "Unlock cliff penalty"),
						d: tr("آزادسازی ۳۰ روز آینده اگر از ۳٪ عرضه کل بگذرد، ۱۵، ۱۸ یا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌گیرد. بازه ۱۴ تا ۳۰ روز جدا نشان داده می‌شود.", "An unlock over the next 30 days that exceeds 3% of total supply deducts 15, 18, or 20 points and takes the High Dilution Risk tag. The 14-to-30-day window is shown separately.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: tr("خروج و چرخش", "Exit and rotation"),
						d: tr("شکست حمایت هفتگی ALT/BTC یا افت امتیاز به زیر ۶۰، سیگنال چرخش به بهترین گزینه واجد شرایط (امتیاز بالای ۶۸، بدون رقیق‌سازی) یا بیت‌کوین است.", "A break of weekly ALT/BTC support, or a score under 60, signals a rotation into the best qualified name (score above 68, no dilution) or into Bitcoin.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: tr("دفتر سفارش، فاندینگ و سود باز", "Book, funding, and open interest"),
						d: tr("خرید ۱۰هزار دلاری روی دفتر بایننس سنجیده می‌شود. اسلیپیج بالای ۳۵ نقطه پایه یا عمق کم، خرید را معلق می‌کند. فاندینگ سالانه بالای ۳۰٪ حجم را نصف می‌کند. برای آلت خرد، جهش سود باز بالای ۲۵٪ یا نسبت لانگ/شورت بالای ۲٫۳ هم حجم را نصف می‌کند.", "A $10k buy is walked on the Binance book. Slippage above 35 basis points, or a thin book, suspends the buy. Annualized funding above 30% cuts size in half. On a small-cap alt, an open-interest jump above 25% or a long/short ratio above 2.3 also cuts size in half.")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: tr("همگرایی جریان و لیکوییدیشن", "Flow and liquidation confluence"),
						d: tr("جریان حجم از خرید تیکر اسپات است. نقشه لیکوییدیشن خوشه‌های اهرم ۵ تا ۱۰۰ را فقط اگر هنوز سویپ نشده باشند نشان می‌دهد. خرید داخل دیوار لانگ یا روی پامپ توخالی ممنوع است. حجم پوزیشن = (سرمایه × ریسک٪) / حدضرر٪ و حداکثر ضرر = سرمایه × ریسک.", "Volume flow is spot taker buy volume. The liquidation map shows 5x–100x clusters only if they have not been swept. Buying into a long wall or a hollow pump is blocked. Position size = (capital × risk%) / stop% and max loss = capital × risk.")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs leading-relaxed text-subtle",
				children: tr("کندل، دفتر و مشتقات در دیتابیس کش می‌شوند تا محدودیت API داده را ناقص نکند. بک‌تست، مسیر هفتگی حدود سه سال گذشته را با همین امتیاز حساب می‌کند. تب وب‌هوک سیگنال را به تلگرام یا ربات خودتان می‌فرستد. تب صرافی سفارش اسپات را مستقیم روی بایننس یا بای‌بیت ثبت می‌کند و کلید را روی سرور نگه نمی‌دارد. داده از CoinPaprika، کندل و دفتر بایننس، فاندینگ و سود باز OKX، و تقویم CoinMarketCap است. این ابزار توصیه مالی یا تضمین سود نیست. تب فرصت‌ها مسیر دیگری است: ارزهایی که الان شرایط ورود ندارند، فقط اگر حمایت آزمون‌شده و سطح ابطال عددی داشته باشند به فهرست انتظار می‌روند. افت قیمت به‌تنهایی آنجا امتیاز نمی‌گیرد.", "Candles, the book, and derivatives are cached in the database so an API limit does not leave the tape incomplete. The backtest runs the weekly path of about the last three years on this same score. The webhook tab sends the signal to Telegram or your own bot. The venue tab places a spot order directly on Binance or Bybit and does not keep the key on the server. Data comes from CoinPaprika, Binance candles and book, OKX funding and open interest, and the CoinMarketCap calendar. This tool is not financial advice and does not promise a profit. The setups tab is a different path: names that do not qualify for entry now go on the watchlist only if they have tested support and a numeric invalidation. A lower price by itself does not score there.")
			})
		]
	});
}
function Layer({ t, d }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-fg",
			children: tr(t)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs leading-relaxed text-muted",
			children: tr(d)
		})]
	});
}
var seen = /* @__PURE__ */ new Map();
function FlashValue({ id, value, format, className }) {
	const [dir, setDir] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const prev = seen.get(id);
		seen.set(id, value);
		if (prev == null) return;
		const base = Math.max(Math.abs(prev), 1e-9);
		if (Math.abs(value - prev) / base < 5e-5) return;
		setDir(value > prev ? "up" : "down");
		const timer = window.setTimeout(() => setDir(null), 900);
		return () => window.clearTimeout(timer);
	}, [id, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("num rounded-sm px-1", dir === "up" && "flash-up", dir === "down" && "flash-down", className),
		children: format(value)
	});
}
var TONE_LABEL = {
	low: "کم‌ریسک",
	mid: "ریسک متوسط",
	high: "ریسک بالا"
};
function riskTone(value) {
	if (value < 35) return "low";
	if (value < 65) return "mid";
	return "high";
}
function roundRisk(n) {
	return Math.round(clamp(n, 0, 100));
}
function unlockExplain(row) {
	if (row.symbol === "BTC") return "بیت‌کوین برنامه آزادسازی ندارد و جریمه آنلاک نمی‌گیرد.";
	if (row.unlockPct30d == null) return "تقویم آزادسازی برای این نماد ثبت نشده، پس جریمه‌ای کسر نشده است.";
	if (row.unlockPct30d > 80) return `رقم آزادسازی ${row.unlockPct30d.toFixed(0)}٪ از عرضه گذشته است. این معمولاً خطای واحد در تقویم است، نه فروش واقعی این‌قدر بزرگ. هشدار زنده برای ارقام بالای ۸۰٪ ساخته نمی‌شود.`;
	const pct = row.unlockPct30d.toFixed(2);
	const when = row.unlockDays == null ? "" : row.unlockDays <= 2 ? ` نزدیک‌ترین رویداد تا ${row.unlockDays * 24} ساعت دیگر است.` : ` نزدیک‌ترین رویداد ${row.unlockDays} روز دیگر است.`;
	const cliff = row.unlockCliff ? " حداقل یک روز کلیف‌مانند دیده شده: بیش از ۱٪ عرضه در یک روز." : "";
	if (row.unlockPenalty > 0) return `جریمه ${row.unlockPenalty} امتیاز به‌دلیل آزادسازی ${pct}٪ از کل عرضه در ۳۰ روز آینده.${when} آستانه مدل: بیش از ۳٪ عرضه ۱۵ امتیاز، بیش از ۵٪ هجده امتیاز، و بیش از ۸٪ بیست امتیاز کم می‌کند.${cliff}`;
	return `جریمه آنلاک صفر است. آزادسازی ۳۰ روز ${pct}٪ است و زیر آستانه ۳٪ مانده.${when}${cliff}`;
}
function liquidityRisk(row) {
	const factor = row.factors.find((item) => item.key === "liquidity");
	if (factor) return roundRisk(100 - factor.score);
	let score = 55;
	if (row.turnover >= .02) score -= 25;
	else if (row.turnover < .008) score += 20;
	if (row.volume24h < 8e6) score += 15;
	if (!row.hasBtcPair) score += 10;
	return roundRisk(score);
}
function unlockPressure(row) {
	if (row.symbol === "BTC" || row.unlockPct30d == null || row.unlockPct30d > 80) return 0;
	return roundRisk(row.unlockPct30d / 8 * 100);
}
function betaExposure(row) {
	if (row.symbol === "BTC") return 15;
	if (row.beta == null) return 50;
	return roundRisk(row.beta / 2 * 100);
}
function buildRiskView(row) {
	const liquidity = liquidityRisk(row);
	const unlock = unlockPressure(row);
	const beta = betaExposure(row);
	const unlockKnown = row.symbol === "BTC" || row.unlockPct30d != null && row.unlockPct30d <= 80;
	const liqWeight = unlockKnown ? .4 : .62;
	const unlockWeight = unlockKnown ? .35 : 0;
	const betaWeight = unlockKnown ? .25 : .38;
	const composite = roundRisk(liqWeight * liquidity + unlockWeight * unlock + betaWeight * beta);
	const tone = riskTone(composite);
	const slices = [
		{
			key: "liquidity",
			label: "ریسک نقدینگی",
			short: "نقدینگی",
			value: liquidity,
			formula: "۱۰۰ منهای امتیاز نقدینگی مدل. امتیاز از حجم ۲۴ساعته، گردش نسبت به مارکت‌کپ، و جفت واقعی BTC ساخته می‌شود.",
			detail: `حجم ۲۴ساعته ${(row.volume24h / 1e6).toFixed(0)} میلیون دلار و گردش ${(row.turnover * 100).toFixed(2)}٪ مارکت‌کپ. نوار بالاتر یعنی خروج سخت‌تر است.${row.hasBtcPair ? " جفت BTC روی بایننس هست." : " جفت BTC مستقیم روی بایننس نیست."}`
		},
		{
			key: "unlock",
			label: "فشار فروش آنلاک",
			short: "آنلاک",
			value: unlock,
			formula: "حداقل ۱۰۰ و (درصد آزادسازی ۳۰ روز ÷ ۸ × ۱۰۰). هشت درصد عرضه، نوار را پر می‌کند.",
			detail: unlockExplain(row)
		},
		{
			key: "beta",
			label: "حساسیت به بیت‌کوین",
			short: "بیت‌کوین",
			value: beta,
			formula: row.symbol === "BTC" ? "خود بیت‌کوین معیار بازار است. این نوار روی ۱۵ ثابت است تا هم‌حرکتی با خودش به‌اشتباه ریسک اضافه حساب نشود." : "حداقل ۱۰۰ و (بتا ÷ ۲ × ۱۰۰). بتا ۱ یعنی هم‌حرکت با بازار و بتا ۲ نوار را پر می‌کند. این همبستگی آماری دقیق نیست؛ پروکسی بتای مدل است.",
			detail: row.symbol === "BTC" ? "بیت‌کوین پناهگاه اسپات مدل است، نه یک آلت با بتای بالا." : row.beta == null ? "بتا برای این نماد محاسبه نشد؛ نوار روی ۵۰، یعنی نامعلوم، مانده است." : `بتای فعلی ${row.beta.toFixed(2)} است. نوار ${beta}٪ یعنی حساسیت نسبی به حرکت بازار.`
		}
	];
	const mix = unlockKnown ? "۴۰٪ نقدینگی، ۳۵٪ آنلاک، ۲۵٪ حساسیت به بیت‌کوین" : "بدون تقویم آنلاک: ۶۲٪ نقدینگی و ۳۸٪ حساسیت به بیت‌کوین";
	return {
		composite,
		tone,
		toneLabel: TONE_LABEL[tone],
		headline: `فشار ریسک ${composite}. ${mix}. زیر ۳۵ کم‌ریسک، تا ۶۵ هشدار، و از ۶۵ به بالا پرریسک است. این عدد برعکس امتیاز اسپات است: اینجا بالاتر خطرناک‌تر است.`,
		slices
	};
}
function applyDeskFilter(rows, filter) {
	if (filter === "unlock") return [...rows].sort((a, b) => {
		const pressure = unlockPressure(b) - unlockPressure(a);
		if (pressure !== 0) return pressure;
		return b.unlockPenalty - a.unlockPenalty;
	});
	if (filter === "rebalance") return rows.filter((row) => row.score >= 68 && !row.highDilution && row.buySignal === "open" && row.volume24h >= 8e6 && row.rank <= 100).sort((a, b) => b.score - a.score);
	if (filter === "btc-cycle") return rows.filter((row) => {
		const calm = row.symbol === "BTC" || row.beta != null && row.beta < 1.35;
		const trendOk = row.weeklyStructure !== "bear" && (row.aboveEma200 !== false || row.symbol === "BTC");
		return calm && trendOk && row.buySignal !== "suspended" && buildRiskView(row).composite < 50;
	}).sort((a, b) => buildRiskView(a).composite - buildRiskView(b).composite);
	return rows;
}
function deskAlerts(rows, kill) {
	const items = [];
	if (kill && kill.status !== "NORMAL") items.push({
		id: `kill:${kill.status}`,
		tone: kill.status === "SUSPENDED" ? "high" : "mid",
		text: `${kill.headline} ${kill.note}`
	});
	const ranked = [...rows].sort((a, b) => (a.unlockDays ?? 99) - (b.unlockDays ?? 99));
	for (const row of ranked) {
		if (row.symbol === "BTC" || row.unlockDays == null || row.unlockPct30d == null) continue;
		if (!(row.unlockPct30d >= 1) || row.unlockPct30d > 80) continue;
		if (row.unlockDays <= 2) {
			const window = row.unlockDays <= 1 ? "۲۴ ساعت" : "۴۸ ساعت";
			items.push({
				id: `unlock:${row.symbol}:${row.unlockDays}`,
				tone: "high",
				text: `توکن ${row.symbol} تا ${window} دیگر رویداد آزادسازی دارد و ${row.unlockPct30d.toFixed(1)}٪ از عرضه در ۳۰ روز آینده خارج می‌شود.`
			});
		} else if (row.unlockPenalty > 0 && row.unlockDays <= 7) items.push({
			id: `unlock:${row.symbol}:${row.unlockDays}`,
			tone: "mid",
			text: `توکن ${row.symbol} تا ${row.unlockDays} روز دیگر آزادسازی دارد؛ ${row.unlockPct30d.toFixed(1)}٪ عرضه در ۳۰ روز و جریمه ${row.unlockPenalty} امتیاز.`
		});
	}
	return items.slice(0, 4);
}
function riskViewOfRow(row) {
	return buildRiskView(row);
}
function AlertStrip({ rows, kill }) {
	const { tr } = useI18n();
	const items = (0, import_react.useMemo)(() => deskAlerts(rows, kill), [rows, kill]);
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setIndex(0);
	}, [items]);
	(0, import_react.useEffect)(() => {
		if (items.length < 2) return;
		const timer = window.setInterval(() => {
			setIndex((value) => (value + 1) % items.length);
		}, 5e3);
		return () => window.clearInterval(timer);
	}, [items]);
	if (items.length === 0) return null;
	const item = items[index % items.length];
	const tone = item.tone === "high" ? "text-down" : item.tone === "mid" ? "text-warn" : "text-up";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		role: "status",
		className: "rounded-xl bg-surface px-4 py-3",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: `mt-0.5 size-4 shrink-0 ${tone}` }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: tr("هشدار زنده بازار", "Live market alert")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm leading-relaxed text-fg",
						children: tr(item.text)
					})]
				}),
				items.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num text-xs text-subtle",
					children: [
						index % items.length + 1,
						"/",
						items.length
					]
				}) : null
			]
		})
	});
}
var OWNER = "mahdisandughdaran-sys";
var REPO = "alpha-spot";
var PAGE = `https://github.com/${OWNER}/${REPO}`;
var API = `https://api.github.com/repos/${OWNER}/${REPO}`;
var STAR_KEY = "alpha-spot-starred";
async function readStars() {
	const res = await fetch(API, { headers: { Accept: "application/vnd.github+json" } });
	if (!res.ok) return null;
	const data = await res.json();
	return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
}
async function userHasStar(login) {
	const name = login.trim().replace(/^@/, "");
	if (!/^[A-Za-z0-9-]{1,39}$/.test(name)) return null;
	for (let page = 1; page <= 5; page += 1) {
		const res = await fetch(`${API}/stargazers?per_page=100&page=${page}`, { headers: { Accept: "application/vnd.github+json" } });
		if (!res.ok) return null;
		const rows = await res.json();
		if (!Array.isArray(rows) || rows.length === 0) return false;
		if (rows.some((row) => row.login?.toLowerCase() === name.toLowerCase())) return true;
		if (rows.length < 100) return false;
	}
	return false;
}
function GithubStar() {
	const { tr } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [count, setCount] = (0, import_react.useState)(null);
	const [baseline, setBaseline] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [login, setLogin] = (0, import_react.useState)("");
	const [hint, setHint] = (0, import_react.useState)(null);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const panelRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		try {
			setSaved(localStorage.getItem(STAR_KEY) === "1");
		} catch {}
		readStars().then((n) => {
			if (n != null) setCount(n);
		}).catch(() => void 0);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const onKey = (event) => {
			if (event.key === "Escape") setOpen(false);
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open || phase === "landed") return;
		let stop = false;
		async function pull() {
			try {
				const n = await readStars();
				if (stop || n == null) {
					if (!stop && n == null) setPhase((prev) => prev === "watching" ? "offline" : prev);
					return;
				}
				setCount(n);
				if (baseline != null && n > baseline) {
					setPhase("landed");
					setSaved(true);
					try {
						localStorage.setItem(STAR_KEY, "1");
					} catch {}
				}
			} catch {
				if (!stop) setPhase((prev) => prev === "watching" ? "offline" : prev);
			}
		}
		pull();
		const id = window.setInterval(() => void pull(), 5e3);
		const onVis = () => {
			if (document.visibilityState === "visible") pull();
		};
		document.addEventListener("visibilitychange", onVis);
		return () => {
			stop = true;
			window.clearInterval(id);
			document.removeEventListener("visibilitychange", onVis);
		};
	}, [
		open,
		baseline,
		phase
	]);
	function markLanded() {
		setPhase("landed");
		setSaved(true);
		try {
			localStorage.setItem(STAR_KEY, "1");
		} catch {}
	}
	async function openRepo() {
		const current = count ?? await readStars().catch(() => null);
		if (current != null) {
			setCount(current);
			setBaseline(current);
		}
		setPhase("watching");
		setHint(null);
		window.open(PAGE, "_blank", "noopener,noreferrer");
	}
	async function checkLogin() {
		setHint(null);
		const found = await userHasStar(login).catch(() => null);
		if (found == null) {
			setHint(tr("گیت‌هاب الان جواب نداد. چند ثانیه بعد دوباره بزن.", "GitHub did not answer. Try again in a few seconds."));
			return;
		}
		if (found) {
			markLanded();
			setHint(null);
			return;
		}
		setHint(tr("این نام هنوز بین ستاره‌دهنده‌ها نیست.", "That login is not in the stargazer list yet."));
	}
	const landed = phase === "landed" || saved;
	const label = landed ? tr("ستاره ثبت شد", "Star counted") : tr("به من ستاره دهید", "Star me on GitHub");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		type: "button",
		variant: "outline",
		className: "h-11",
		onClick: () => setOpen(true),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: landed ? "fill-warn text-warn" : "" }),
			label,
			count != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "num text-xs opacity-80",
				children: count
			}) : null
		]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 grid place-items-end bg-bg/70 p-3 sm:place-items-center",
		onClick: () => setOpen(false),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: panelRef,
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "star-title",
			className: "rise-in w-full max-w-md rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6",
			onClick: (event) => event.stopPropagation(),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: "GitHub"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						id: "star-title",
						className: "mt-1 text-xl text-fg",
						children: tr("یک ستاره برای میز", "One star for the desk")
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "num text-3xl text-fg",
						children: count ?? "—"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: tr("گیت‌هاب فقط ستاره‌ای را می‌شمارد که روی دکمهٔ خودش زده شود. مخزن را باز می‌کنیم و شمارندهٔ عمومی را نگاه می‌داریم — همان لحظه که ستاره بنشیند، اینجا سبز می‌شود.", "GitHub only counts a star pressed on its own button. We open the repo and watch the public counter — the moment your star lands, this turns green.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
					className: "mt-4 grid gap-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-elevated px-3 py-2 text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num me-2 text-xs text-subtle",
								children: "01"
							}), tr("مخزن آلفا اسپات را باز کن", "Open the Alpha Spot repo")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-elevated px-3 py-2 text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num me-2 text-xs text-subtle",
								children: "02"
							}), tr("روی Star گیت‌هاب بزن", "Press GitHub’s Star")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-lg bg-elevated px-3 py-2 text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num me-2 text-xs text-subtle",
								children: "03"
							}), phase === "landed" ? tr("ستاره نشست. ممنون.", "The star landed. Thank you.") : tr("برگرد؛ شمارنده را زنده چک می‌کنیم", "Come back — we check the counter live")]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "h-12 flex-1",
						onClick: () => void openRepo(),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: phase === "landed" ? "fill-warn text-warn" : "" }), tr("باز کردن گیت‌هاب", "Open GitHub")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						className: "h-12",
						onClick: () => setOpen(false),
						children: tr("بستن", "Close")
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-subtle",
					"aria-live": "polite",
					children: phase === "landed" ? tr("شمارنده بالا رفت. ستاره ثبت شد.", "The counter moved. Your star is in.") : phase === "watching" ? tr("در حال نگاه به شمارنده…", "Watching the counter…") : phase === "offline" ? tr("شمارنده الان از اینجا خوانده نشد. مخزن باز است؛ برگرد تا دوباره بشماریم.", "The counter could not be read from here. The repo is open; come back and we will count again.") : tr("هنوز ستاره‌ای از این نشست ثبت نشده.", "No new star from this session yet.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-col gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						checkLogin();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-subtle",
							htmlFor: "gh-login",
							children: tr("اگر قبلاً ستاره داده‌ای، نام کاربری گیت‌هاب", "If you already starred, your GitHub login")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								id: "gh-login",
								value: login,
								onChange: (event) => setLogin(event.target.value),
								autoComplete: "off",
								spellCheck: false,
								placeholder: "username",
								className: "num h-11 min-w-0 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								variant: "outline",
								className: "h-11 shrink-0",
								disabled: !login.trim(),
								children: tr("بررسی", "Check")
							})]
						}),
						hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-warn",
							children: hint
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "num mt-4 truncate text-xs text-subtle",
					children: [
						OWNER,
						"/",
						REPO
					]
				})
			]
		})
	}) : null] });
}
function HistoryPanel({ runs }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	if (runs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-medium text-fg",
			children: tr("سابقه تحلیل‌ها", "Analysis history")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted",
			children: tr("بعد از هر تحلیل، انتخاب و رژیم در همین مرورگر ذخیره می‌شود تا بتوانید تغییر برنده را ببینید. حساب کاربری لازم نیست.", "After each run, the pick and the regime are stored in this browser so you can see when the winner changes. No account is required.")
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("سابقه تحلیل‌ها", "Analysis history")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: tr("تا ۱۲ اجرای اخیر روی این دستگاه. برای قضاوت وزن‌ها، برنده را با ۷ روز بعد مقایسه کنید.", "Up to 12 recent runs on this device. To judge the weights, compare the winner with the following 7 days.")
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[560px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("زمان", "Time")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("انتخاب", "Pick")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("امتیاز", "Score")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("رژیم", "Regime")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("دامیننس", "Dominance")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("۷ر vs BTC", "7d vs BTC")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("کلید قطع", "Kill-switch")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("دوم", "Runner-up")
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: runs.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-subtle",
							children: new Date(run.at).toLocaleString(locale === "en" ? "en-US" : "fa-IR", {
								month: "short",
								day: "numeric",
								hour: "2-digit",
								minute: "2-digit"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: tr(run.name)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-xs text-subtle",
									children: run.pick
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-fg",
							children: formatScore(run.score)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: run.regime === "btc" ? tr("بیت‌کوین", "Bitcoin") : run.regime === "alt" ? tr("آلت", "Alt") : tr("خنثی", "Neutral")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "num px-4 py-3 text-muted",
							children: [run.dominance == null ? "—" : run.dominance.toFixed(1), pct]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-muted",
							children: formatPct(run.rs7d)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: run.killStatus === "SUSPENDED" ? tr("معلق", "Suspended") : run.killStatus === "HIGH_RISK" ? tr("حجم نصف", "Half size") : run.killStatus === "NORMAL" ? tr("نرمال", "Normal") : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-subtle",
							children: run.runnerUp ?? "—"
						})
					]
				}, run.at)) })]
			})
		})]
	});
}
function KillSwitchBanner({ kill }) {
	const { tr } = useI18n();
	const tone = kill.status === "SUSPENDED" ? "bg-down-dim text-down" : kill.status === "HIGH_RISK" ? "bg-warn-dim text-warn" : "bg-up-dim text-up";
	const Icon = kill.status === "NORMAL" ? ShieldCheck : ShieldAlert;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: `rounded-xl p-4 shadow-[var(--shadow-border)] md:p-5 ${tone}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
				className: "mt-0.5 size-5 shrink-0",
				strokeWidth: 1.75
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: tr(kill.headline)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-fg/80",
						children: tr(kill.note)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$4, {
								label: tr("قیمت BTC", "BTC price"),
								value: `$${formatUsd(kill.priceUsd)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$4, {
								label: tr("EMA ۲۰۰", "200 EMA"),
								value: kill.ema200 == null ? "—" : `$${formatUsd(kill.ema200)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$4, {
								label: tr("فاصله تا EMA", "Distance to EMA"),
								value: kill.distanceToEma == null ? "—" : formatPct(kill.distanceToEma)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$4, {
								label: tr("بازده ۴ هفته", "4-week return"),
								value: kill.weeklyMomentum == null ? "—" : formatPct(kill.weeklyMomentum)
							})
						]
					})
				]
			})]
		})
	});
}
function Stat$4({ label, value }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg/40 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-fg/70",
			children: tr(label)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "num mt-1 text-sm text-fg",
			children: value
		})]
	});
}
function when(value, locale) {
	const time = Date.parse(value);
	if (!Number.isFinite(time)) return "";
	return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
		month: "short",
		day: "numeric"
	}).format(time);
}
function MacroRail({ news, mode = "compact" }) {
	const { tr, locale } = useI18n();
	const day = sessionCalendar(/* @__PURE__ */ new Date());
	const events = upcomingEvents(day.newYorkYmd, mode === "full" ? 8 : 3);
	const items = news?.items.slice(0, mode === "full" ? 10 : 4) ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: day.blockSpot ? "rounded-xl bg-down-dim p-4 text-down shadow-[var(--shadow-border)] md:p-5" : "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-3",
				children: [day.blockSpot ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarOff, {
					className: "mt-0.5 size-5 shrink-0",
					strokeWidth: 1.75
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Newspaper, {
					className: "mt-0.5 size-5 shrink-0 text-muted",
					strokeWidth: 1.75
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm font-medium ${day.blockSpot ? "" : "text-fg"}`,
						children: tr(day.titleFa, day.titleEn)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `mt-1 text-xs leading-relaxed ${day.blockSpot ? "text-down/90" : "text-muted"}`,
						children: tr(day.reasonFa, day.reasonEn)
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-bg/40 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: tr("تعطیلی بعد", "Next close")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
								className: "mt-1 text-sm text-fg",
								children: day.nextClosed ? tr(day.nextClosed.nameFa, day.nextClosed.nameEn) : "—"
							}),
							day.nextClosed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num mt-1 text-xs text-subtle",
								children: day.nextClosed.ymd
							}) : null
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-bg/40 px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-xs text-muted",
							children: tr("تقویم کلان", "Macro calendar")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "mt-1 space-y-1",
							children: events.map((event) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-subtle",
										children: event.ymd.slice(5)
									}),
									" · ",
									tr(event.nameFa, event.nameEn)
								]
							}, event.ymd))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md bg-bg/40 px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-xs text-muted",
								children: tr("جلسه‌ها", "Sessions")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
								className: "mt-1 text-sm text-fg",
								children: [
									tr("تهران", "Tehran"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: day.tehranYmd
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-fg",
								children: [
									tr("نیویورک", "New York"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: day.newYorkYmd
									})
								]
							}),
							day.earlyClose ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-warn",
								children: tr(day.earlyClose.nameFa, day.earlyClose.nameEn)
							}) : null
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 border-t border-border pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-subtle",
						children: tr("اخبار مهم کریپتو", "Important crypto news")
					}),
					news == null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: tr("در حال گرفتن فید…", "Fetching the feed…")
					}) : null,
					news?.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: tr(news.note)
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-col gap-3",
						children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: item.link,
								target: "_blank",
								rel: "noreferrer",
								className: "text-sm text-fg hover:underline",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "me-2 text-xs text-subtle",
									children: tr(item.tagFa, item.tagEn)
								}), item.title]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-xs text-subtle",
								children: when(item.publishedAt, locale)
							}),
							mode === "full" && item.summary ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: item.summary
							}) : null
						] }, item.link))
					})
				]
			})
		]
	});
}
function ExplainTip({ title, body, children, className }) {
	const { tr } = useI18n();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [box, setBox] = (0, import_react.useState)(null);
	const buttonRef = (0, import_react.useRef)(null);
	const pinned = (0, import_react.useRef)(false);
	const tipId = (0, import_react.useId)();
	function place() {
		const node = buttonRef.current;
		if (!node) return;
		const rect = node.getBoundingClientRect();
		const width = 288;
		let left = rect.left;
		if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
		if (left < 12) left = 12;
		const top = Math.min(rect.bottom + 8, window.innerHeight - 12);
		setBox({
			top,
			left
		});
	}
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKey(event) {
			if (event.key === "Escape") setOpen(false);
		}
		function onScroll() {
			setOpen(false);
		}
		window.addEventListener("keydown", onKey);
		window.addEventListener("scroll", onScroll, true);
		return () => {
			window.removeEventListener("keydown", onKey);
			window.removeEventListener("scroll", onScroll, true);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		ref: buttonRef,
		type: "button",
		className: cn("inline-flex items-center gap-1 rounded-md text-start text-inherit hover:text-fg", className),
		"aria-expanded": open,
		"aria-describedby": open ? tipId : void 0,
		onClick: () => {
			place();
			setOpen((value) => {
				pinned.current = !value;
				return !value;
			});
		},
		onMouseEnter: () => {
			place();
			setOpen(true);
		},
		onMouseLeave: () => {
			if (!pinned.current) setOpen(false);
		},
		onFocus: () => {
			place();
			setOpen(true);
		},
		onBlur: () => setOpen(false),
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, {
			className: "size-3.5 shrink-0 text-subtle",
			"aria-hidden": true
		})]
	}), open && box ? (0, import_react_dom.createPortal)(/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		id: tipId,
		role: "tooltip",
		style: {
			top: box.top,
			left: box.left
		},
		className: "glass-pop fixed z-50 w-72 rounded-lg p-3 text-start",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "block text-xs font-medium text-fg",
			children: tr(title)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block text-xs leading-relaxed text-muted",
			children: tr(body)
		})]
	}), document.body) : null] });
}
var TONE_CLASS = {
	low: "text-up risk-glow-low",
	mid: "text-warn",
	high: "text-down risk-glow-high"
};
var BAR_COLOR = {
	low: "var(--color-up)",
	mid: "var(--color-warn)",
	high: "var(--color-down)"
};
function toneOf(value) {
	if (value < 35) return "low";
	if (value < 65) return "mid";
	return "high";
}
function RiskBreakdown({ row }) {
	const { tr } = useI18n();
	const view = riskViewOfRow(row);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("تجزیه فشار ریسک", "Risk pressure breakdown")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-xl text-xs leading-relaxed text-subtle",
				children: tr("به‌جای یک عدد کلی، سه فشار جدا دیده می‌شود. روی هر عنوان بزنید تا فرمول همان نوار باز شود.", "Instead of one overall number, three pressures are shown separately. Press a title to open that bar’s formula.")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainTip, {
				title: `${tr(view.toneLabel)} · ${view.composite}`,
				body: view.headline,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `num text-3xl font-medium ${TONE_CLASS[view.tone]}`,
					children: view.composite
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-5 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SliceList, { view }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskChart, { slices: view.slices })]
		})]
	});
}
function RiskMeter({ row }) {
	const { tr } = useI18n();
	const view = riskViewOfRow(row);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-36 flex-col gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(ExplainTip, {
			title: tr(`فشار ریسک ${row.symbol}`, `Risk pressure ${row.symbol}`),
			body: view.headline,
			className: "text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `num ${TONE_CLASS[view.tone]}`,
				children: view.composite
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-subtle",
				children: tr(view.toneLabel)
			})]
		}), view.slices.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-14 shrink-0 text-xs text-subtle",
					children: tr(slice.short)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "h-1.5 flex-1 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block h-full rounded-full",
						style: {
							width: `${Math.max(4, slice.value)}%`,
							background: BAR_COLOR[toneOf(slice.value)]
						}
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num w-8 text-end text-xs text-muted",
					children: slice.value
				})
			]
		}, slice.key))]
	});
}
function SliceList({ view }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-4",
		children: view.slices.map((slice) => {
			const tone = toneOf(slice.value);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainTip, {
					title: tr(slice.label),
					body: `${tr(slice.formula)} ${tr(slice.detail)}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-fg",
						children: tr(slice.label)
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `num text-sm ${TONE_CLASS[tone]}`,
					children: [slice.value, pct]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 h-1.5 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full transition-[width] duration-500 ease-out",
					style: {
						width: `${Math.max(4, slice.value)}%`,
						background: BAR_COLOR[tone]
					}
				})
			})] }, slice.key);
		})
	});
}
function RiskChart({ slices }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const rows = slices.map((slice) => ({
		...slice,
		short: tr(slice.short),
		label: tr(slice.label),
		detail: tr(slice.detail)
	}));
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-44 rounded-md bg-elevated" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-44 w-full",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data: rows,
				layout: "vertical",
				margin: {
					top: 4,
					right: 12,
					left: 8,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						type: "number",
						domain: [0, 100],
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						type: "category",
						dataKey: "short",
						width: 88,
						axisLine: false,
						tickLine: false,
						tick: {
							fill: "var(--color-muted)",
							fontSize: 12,
							fontFamily: "Vazirmatn"
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { fill: "rgb(241 242 244 / 0.05)" },
						content: ({ active, payload }) => {
							if (!active || !payload?.length) return null;
							const slice = payload[0]?.payload;
							if (!slice) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-pop max-w-xs rounded-lg px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-fg",
									children: [tr(slice.label), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-2",
										children: [slice.value, pct]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: tr(slice.detail)
								})]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "value",
						radius: 6,
						isAnimationActive: false,
						barSize: 14,
						children: rows.map((slice) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: BAR_COLOR[toneOf(slice.value)] }, slice.key))
					})
				]
			})
		})
	});
}
var EMPTY = {
	all: "رتبه‌ای برای نمایش نیست.",
	unlock: "در این نمونه آزادسازی قابل‌سنجش نیست.",
	rebalance: "مقصد چرخشی با امتیاز بالای ۶۸، بدون رقیق‌سازی و با سیگنال باز پیدا نشد.",
	"btc-cycle": "سیکل آرام بیت‌کوین — روند غیرنزولی، بتای کنترل‌شده و فشار ریسک زیر ۵۰ — در این اسکن خالی است."
};
var EMPTY_EN = {
	all: "Nothing to rank.",
	unlock: "No measurable unlock in this sample.",
	rebalance: "No rotation target scored above 68, clean of dilution, with an open signal.",
	"btc-cycle": "Quiet Bitcoin cycle — non-bearish trend, contained beta, and risk pressure under 50 — is empty in this scan."
};
function Leaderboard({ rows, picked, watched, onToggleWatch, live, filter }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-end justify-between gap-3 p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("رتبه‌بندی مدل", "Model ranks")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: tr("قیمت دلار با تیکر زنده چشمک می‌زند. فشار ریسک جدا از امتیاز اسپات است و با لمس نوارها باز می‌شود.", "The USD price flashes on the live ticker. Risk pressure is separate from the spot score and opens when you touch the bars.")
			})] })
		}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-5 pb-6 text-sm text-muted",
			children: tr(EMPTY[filter], EMPTY_EN[filter])
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2 px-3 pb-3 md:hidden",
			children: rows.map((row, i) => {
				const active = row.symbol === picked;
				const starred = watched.includes(row.symbol);
				const price = live[row.symbol] ?? row.priceUsd;
				const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: active ? "rounded-lg bg-elevated p-3" : "rounded-lg bg-bg/40 p-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex min-w-0 items-start gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num pt-2 text-xs text-subtle",
									children: i + 1
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
									symbol: row.symbol,
									name: row.name,
									rank: row.rank,
									size: "sm"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onToggleWatch(row.symbol),
								className: "flex size-11 items-center justify-center rounded-md text-subtle",
								"aria-label": starred ? tr("حذف از واچ‌لیست", "Remove from watchlist") : tr("افزودن به واچ‌لیست", "Add to watchlist"),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4",
									fill: starred ? "currentColor" : "none"
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-3 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: tr("امتیاز", "Score")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
										id: `score:${row.symbol}`,
										value: row.score,
										format: formatScore,
										className: "text-fg"
									})
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: tr("۷ر vs BTC", "7d vs BTC")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: `num mt-1 ${rsTone}`,
									children: formatPct(row.rs7d)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: tr("قیمت", "Price")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
										id: `px:${row.symbol}`,
										value: price,
										format: (n) => `$${formatUsd(n)}`,
										className: "text-fg"
									})
								})] })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskMeter, { row })
						})
					]
				}, row.id);
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-x-auto md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[1080px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-2 text-start font-medium" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "#"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("ارز", "Asset")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("امتیاز", "Score")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("فشار ریسک", "Risk pressure")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("۷ر vs BTC", "7d vs BTC")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "MC/FDV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("آنلاک ۳۰ر", "30d unlock")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("سیگنال", "Signal")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("قیمت", "Price")
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, i) => {
					const active = row.symbol === picked;
					const starred = watched.includes(row.symbol);
					const price = live[row.symbol] ?? row.priceUsd;
					const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: active ? "border-t border-border bg-elevated" : "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onToggleWatch(row.symbol),
									className: "flex size-9 items-center justify-center rounded-md text-subtle hover:text-fg",
									"aria-label": starred ? tr("حذف از واچ‌لیست", "Remove from watchlist") : tr("افزودن به واچ‌لیست", "Add to watchlist"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
										className: "size-4",
										fill: starred ? "currentColor" : "none"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-subtle",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
									symbol: row.symbol,
									name: row.name,
									rank: row.rank,
									size: "sm"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
									id: `score:${row.symbol}`,
									value: row.score,
									format: formatScore,
									className: "text-fg"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskMeter, { row })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `num px-4 py-3 ${rsTone}`,
								children: formatPct(row.rs7d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-muted",
								children: row.mcFdv == null ? "—" : `${(row.mcFdv * 100).toFixed(0)}${pct}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: row.highDilution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs text-down",
									children: ["High Dilution", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-1",
										children: ["-", row.unlockPenalty]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-xs text-muted",
									children: row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(1)}${pct}`
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted",
								children: row.buySignal === "suspended" ? tr("معلق", "Suspended") : row.buySignal === "reduced" ? tr("حجم ۵۰٪", "50% size") : tr("باز", "Open")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
									id: `px:${row.symbol}`,
									value: price,
									format: (n) => `$${formatUsd(n)}`,
									className: "text-fg"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-xs text-subtle",
									children: btcPriceLabel(row.priceBtc)
								})]
							})
						]
					}, row.id);
				}) })]
			})
		})] })]
	});
}
function LiveBadge({ state }) {
	const { tr } = useI18n();
	const label = state === "live" ? tr("داده زنده بازار - همگام", "Live Market Data - Synced") : state === "delayed" ? tr("داده زنده بازار - با تأخیر", "Live Market Data - Delayed") : tr("داده زنده بازار - در حال همگام‌سازی", "Live Market Data - Syncing");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "inline-flex h-9 items-center gap-2 rounded-full bg-surface px-3 text-xs text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: state === "live" ? "live-dot" : state === "delayed" ? "live-dot live-dot-warn" : "live-dot live-dot-wait",
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num tracking-wide",
			children: label
		})]
	});
}
var KEY$4 = "alpha-spot-prefs-v1";
function canStore$4() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadPrefs() {
	if (!canStore$4()) return null;
	try {
		const raw = localStorage.getItem(KEY$4);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (!parsed || !isVenue(parsed.venue)) return null;
		if (parsed.horizon !== "day" && parsed.horizon !== "week" && parsed.horizon !== "month") return null;
		return parsed;
	} catch {
		return null;
	}
}
function savePrefs(prefs) {
	if (!canStore$4()) return;
	try {
		localStorage.setItem(KEY$4, JSON.stringify(prefs));
	} catch {}
}
function PrefsGate({ onSave }) {
	const { tr } = useI18n();
	const [venue, setVenue] = (0, import_react.useState)(null);
	const [horizon, setHorizon] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-xl font-medium tracking-tight text-fg md:text-2xl",
				children: tr("کجا می‌خرید، و برای چه مدتی؟", "Where do you buy, and for how long?")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
				children: tr("تحلیل بعد از این دو جواب شروع می‌شود. فقط همین‌جا روی دستگاه شما می‌ماند. کلید صرافی پرسیده نمی‌شود.", "The ranking starts after these two answers. They stay on this device only. No exchange key is asked.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-subtle",
				children: tr("صرافی", "Exchange")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-2 gap-2",
				children: VENUES.map((id) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setVenue(id),
						className: venue === id ? "h-12 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "h-12 rounded-md bg-bg px-3 text-sm text-muted shadow-[var(--shadow-border)]",
						children: tr(VENUE_LABEL[id])
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs text-subtle",
				children: tr("اعتبار حکم", "How long the call lasts")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 grid grid-cols-1 gap-2 sm:grid-cols-3",
				children: [
					[
						"day",
						tr("یک روز", "One day"),
						tr("فردا می‌تواند عوض شود", "May change tomorrow")
					],
					[
						"week",
						tr("یک هفته", "One week"),
						tr("تا هفت روز قفل است", "Locked for seven days")
					],
					[
						"month",
						tr("یک ماه", "One month"),
						tr("تا سی روز قفل است", "Locked for thirty days")
					]
				].map(([id, label, hint]) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setHorizon(id),
						className: horizon === id ? "flex h-16 flex-col items-center justify-center rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "flex h-16 flex-col items-center justify-center rounded-md bg-bg px-3 text-sm text-muted shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-0.5 text-xs text-subtle",
							children: hint
						})]
					}, id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "lg",
				className: "mt-6 h-12",
				disabled: !venue || !horizon,
				onClick: () => {
					if (!venue || !horizon) return;
					const next = {
						venue,
						horizon
					};
					savePrefs(next);
					onSave(next);
				},
				children: tr("ادامه و تحلیل", "Continue and rank")
			})
		]
	});
}
var FACTOR_NAME = {
	rs: ["قدرت نسبی", "relative strength"],
	tokenomics: ["توکنومیکس", "tokenomics"],
	entry: ["ورود", "entry"],
	trend: ["روند", "trend"],
	liquidity: ["نقدشوندگی", "liquidity"],
	risk: ["ریسک", "risk"],
	narrative: ["روایت", "narrative"]
};
var REGIME_NAME = {
	btc: ["فصل بیت‌کوین", "Bitcoin season"],
	alt: ["فصل آلت", "Alt season"],
	neutral: ["خنثی", "Neutral"]
};
function cell(excess, n, pending) {
	if (!n || excess == null) return pending;
	const pct = excess * 100;
	return `${pct > 0 ? "+" : ""}${pct.toFixed(1)}٪ · ${n}`;
}
function ReportCard({ rows, buckets, cuts, lagged, weak }) {
	const { tr, locale } = useI18n();
	const pending = tr("هنوز نرسیده", "Not due yet");
	const cutsOn = Object.keys(cuts).filter((key) => {
		const value = cuts[key];
		return typeof value === "number" && value < .999;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("کارنامه در برابر بیت‌کوین", "Record against Bitcoin")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm leading-relaxed text-muted",
				children: tr("هر جمله ذخیره می‌شود. بعد از ۷ و ۳۰ روز، بازده خالص بعد از کارمزد با بیت‌کوین مقایسه می‌شود؛ جدا برای فصل بیت‌کوین، آلت و خنثی. اگر عقب باشد، وزن همان عامل در تحلیل بعدی کمتر می‌شود.", "Each sentence is stored. After 7 and 30 days, the net return after fees is compared with Bitcoin, separately for Bitcoin season, alt season, and neutral. If it lagged, that factor weighs less on the next ranking.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[28rem] text-start text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: tr("فصل", "Season")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: tr("۷ روز", "7 days")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-2 py-2 font-medium",
								children: tr("۳۰ روز", "30 days")
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: buckets.map((bucket) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-2 py-3 text-fg",
								children: tr(REGIME_NAME[bucket.regime][0], REGIME_NAME[bucket.regime][1])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-2 py-3 text-muted",
								children: cell(bucket.excess7, bucket.n7, pending)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-2 py-3 text-muted",
								children: cell(bucket.excess30, bucket.n30, pending)
							})
						]
					}, bucket.regime)) })]
				})
			}),
			lagged && weak ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm leading-relaxed text-muted",
				children: tr(`از بیت‌کوین عقب ماند. وزن ${FACTOR_NAME[weak][0]} کم شد و در عدسی همین تحلیل اعمال می‌شود.`, `It lagged Bitcoin. The ${FACTOR_NAME[weak][1]} weight was cut and is applied in this lens.`)
			}) : null,
			cutsOn.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 flex flex-col gap-1",
				children: cutsOn.map((key) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-xs text-subtle",
					children: [
						tr(FACTOR_NAME[key][0], FACTOR_NAME[key][1]),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "num",
							children: [((cuts[key] ?? 1) * 100).toFixed(0), "٪"]
						}),
						tr(" وزن پایه", " of base weight")
					]
				}, key))
			}) : null,
			rows.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 flex flex-col gap-2",
				children: rows.slice(0, 4).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-xs leading-relaxed text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: new Date(row.at).toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR")
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: tr(verdictSentence(row.kind))
						}),
						" · ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: row.symbol
						})
					]
				}, row.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-subtle",
				children: tr("هنوز جمله‌ای ذخیره نشده.", "No sentence has been stored yet.")
			})
		]
	});
}
var KEY$3 = "alpha-spot-book-v1";
function loadBook() {
	if (typeof window === "undefined") return [];
	try {
		const raw = localStorage.getItem(KEY$3);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.filter((row) => row && typeof row.symbol === "string" && typeof row.entryUsd === "number" && typeof row.sizeUsd === "number");
	} catch {
		return [];
	}
}
function saveBook(rows) {
	try {
		localStorage.setItem(KEY$3, JSON.stringify(rows));
	} catch {}
}
var ACTION_FA = {
	HOLD: "نگهداری",
	SELL: "خروج",
	REBALANCE: "چرخش"
};
var ACTION_EN = {
	HOLD: "Hold",
	SELL: "Exit",
	REBALANCE: "Rotate"
};
function MonitorPanel({ result }) {
	const { tr } = useI18n();
	const [book, setBook] = (0, import_react.useState)([]);
	const [symbol, setSymbol] = (0, import_react.useState)("ETH");
	const [entry, setEntry] = (0, import_react.useState)("");
	const [size, setSize] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		setBook(loadBook());
	}, []);
	const options = (0, import_react.useMemo)(() => [...result.top].sort((a, b) => a.rank - b.rank), [result.top]);
	(0, import_react.useEffect)(() => {
		if (options.length > 0 && !options.some((row) => row.symbol === symbol)) setSymbol(options[0]?.symbol ?? "BTC");
	}, [options, symbol]);
	const plan = (0, import_react.useMemo)(() => buildRebalancePlan(book, result.top, result.killSwitch), [book, result]);
	function addPosition() {
		const entryUsd = Number(entry);
		const sizeUsd = Number(size);
		const sym = symbol.toUpperCase();
		if (!sym || !(entryUsd > 0) || !(sizeUsd > 0)) return;
		const next = [...book.filter((row) => row.symbol.toUpperCase() !== sym), {
			symbol: sym,
			entryUsd,
			sizeUsd
		}];
		setBook(next);
		saveBook(next);
		setEntry("");
		setSize("");
	}
	function remove(sym) {
		const next = book.filter((row) => row.symbol !== sym);
		setBook(next);
		saveBook(next);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-medium text-fg",
					children: tr("پایش سبد و چرخش", "Book watch and rotation")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-3xl text-sm leading-relaxed text-muted",
					children: tr("پوزیشن‌های اسپات خودتان را وارد کنید. اگر حمایت هفتگی ALT/BTC بشکند یا امتیاز زیر ۶۰ بیاید، سیگنال خروج و چرخش به برترین گزینه واجد شرایط صادر می‌شود. با کلید قطع، مقصد چرخش بیت‌کوین است.", "Enter your own spot positions. If weekly ALT/BTC support breaks or the score falls under 60, the desk signals an exit and a rotation into the best qualified name. With the kill-switch on, the rotation target is Bitcoin.")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-subtle",
					children: tr(plan.note)
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-3 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:grid-cols-4",
				onSubmit: (event) => {
					event.preventDefault();
					addPosition();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-xs text-subtle",
						children: [tr("نماد", "Ticker"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							value: symbol,
							onChange: (event) => setSymbol(event.target.value),
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]",
							children: options.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
								value: row.symbol,
								children: [
									row.symbol,
									" · ",
									row.name
								]
							}, row.id))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-xs text-subtle",
						children: [tr("قیمت ورود (دلار)", "Entry price (USD)"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							value: entry,
							onChange: (event) => setEntry(event.target.value),
							placeholder: "100",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-xs text-subtle",
						children: [tr("اندازه (دلار)", "Size (USD)"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							value: size,
							onChange: (event) => setSize(event.target.value),
							placeholder: "1000",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "w-full",
							children: tr("افزودن پوزیشن", "Add position")
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: tr("نگهداری پیشنهادی", "Suggested hold"),
						v: `$${formatUsd(plan.holdUsd)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: tr("آماده چرخش", "Ready to rotate"),
						v: `$${formatUsd(plan.rotateUsd)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: tr("خروج نقد", "Cash exit"),
						v: `$${formatUsd(plan.sellUsd)}`
					})
				]
			}),
			plan.destinations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: tr("مقصد چرخش", "Rotation target")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2",
					children: plan.destinations.map((dest) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-fg",
							children: [
								dest.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-subtle",
									children: dest.symbol
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: tr(dest.reason)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "num text-sm text-fg",
								children: ["$", formatUsd(dest.usd)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-xs text-subtle",
								children: formatScore(dest.score)
							})]
						})]
					}, dest.symbol))
				})]
			}) : null,
			plan.rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]",
				children: tr("هنوز پوزیشنی ثبت نشده. یک نماد از صد ارز اول، قیمت ورود و اندازه دلاری را اضافه کنید تا Hold / Sell / Rebalance زنده شود.", "No position on the book yet. Add a ticker from the top 100, an entry price, and a dollar size so Hold / Sell / Rebalance goes live.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-3",
				children: plan.rows.map((row) => {
					const tone = row.action === "HOLD" ? "text-up bg-up-dim" : row.action === "SELL" ? "text-down bg-down-dim" : "text-warn bg-warn-dim";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: row.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-xs text-subtle",
									children: row.symbol
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `rounded-full px-2.5 py-1 text-xs ${tone}`,
									children: [tr(ACTION_FA[row.action], ACTION_EN[row.action]), row.action === "REBALANCE" && row.targetSymbol ? ` → ${row.targetSymbol}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
										k: tr("امتیاز", "Score"),
										v: row.score == null ? "—" : formatScore(row.score)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
										k: tr("بازدهی", "P&L"),
										v: row.pnlPct == null ? "—" : formatPct(row.pnlPct)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
										k: tr("ALT/BTC هفتگی", "Weekly ALT/BTC"),
										v: row.symbol === "BTC" ? tr("معیار", "Benchmark") : row.pairSupportBroken ? tr("شکست حمایت", "Support broken") : row.pairWeekly === "bull" ? tr("صعودی", "Bullish") : row.pairWeekly === "bear" ? tr("نزولی", "Bearish") : tr("خنثی / نامشخص", "Flat / unknown")
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
										k: tr("حجم پیشنهادی", "Suggested size"),
										v: `$${formatUsd(row.suggestedSizeUsd)}`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-muted",
								children: tr(row.reason)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => remove(row.symbol),
								className: "mt-3 h-11 text-xs text-subtle hover:text-fg",
								children: tr("حذف از سبد", "Remove from book")
							})
						]
					}, row.symbol);
				})
			})
		]
	});
}
function Mini$1({ k, v }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: tr(k)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: tr(v)
		})]
	});
}
function Field$1({ k, v }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-subtle",
		children: tr(k)
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "num mt-1 text-fg",
		children: tr(v)
	})] });
}
/** Best spot entry on an indexed series: a healthy pullback that later held. */
function findBestBuyPoint(series) {
	if (series.length < 5) return null;
	const values = series.map((point) => point.v);
	const hi = Math.max(...values);
	const lo = Math.min(...values);
	if (!(hi > 0) || !(lo > 0)) return null;
	const last = values[values.length - 1] ?? hi;
	if ((hi - lo) / hi < .008) return {
		index: values.length - 1,
		value: last,
		day: values.length,
		pullbackPct: 0,
		sincePct: 0,
		recovered: false,
		nearNow: true,
		flat: true
	};
	const candidates = /* @__PURE__ */ new Set();
	for (let i = 1; i < values.length - 1; i++) if (values[i] <= values[i - 1] && values[i] < values[i + 1]) candidates.add(i);
	const argmin = values.indexOf(lo);
	if (argmin > 0 && argmin < values.length - 1) candidates.add(argmin);
	if (candidates.size === 0) candidates.add(Math.min(values.length - 2, Math.max(1, argmin)));
	let bestI = 1;
	let bestScore = -Infinity;
	for (const i of candidates) {
		const v = values[i] ?? 0;
		const priorHigh = Math.max(...values.slice(0, i + 1));
		const pullback = priorHigh > 0 ? (priorHigh - v) / priorHigh : 0;
		const recovered = values.slice(i + 1).some((x) => x >= v * 1.025);
		let score = 8;
		if (pullback >= .08 && pullback <= .18) score = 100;
		else if (pullback > .18 && pullback <= .28) score = 74;
		else if (pullback >= .05 && pullback < .08) score = 58;
		else if (pullback > .28 && pullback <= .4) score = 36;
		else if (pullback > .4) score = 18;
		if (recovered) score += 22;
		if (i >= values.length - 2 && !recovered) score -= 28;
		score += i / (values.length - 1) * 6;
		score += Math.min(pullback, .2) * 10;
		if (score > bestScore) {
			bestScore = score;
			bestI = i;
		}
	}
	const value = values[bestI] ?? last;
	const priorHigh = Math.max(...values.slice(0, bestI + 1));
	const pullbackPct = priorHigh > 0 ? (priorHigh - value) / priorHigh * 100 : 0;
	const sincePct = value > 0 ? (last - value) / value * 100 : 0;
	const recovered = values.slice(bestI + 1).some((x) => x >= value * 1.025);
	const nearNow = value > 0 && (Math.abs(last - value) / value <= .02 || bestI >= values.length - 3 && last <= value * 1.03);
	return {
		index: bestI,
		value,
		day: bestI + 1,
		pullbackPct,
		sincePct,
		recovered,
		nearNow,
		flat: false
	};
}
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", {
	variants: { tone: {
		neutral: "bg-elevated text-muted shadow-[var(--shadow-border)]",
		up: "bg-up-dim text-up",
		down: "bg-down-dim text-down",
		accent: "bg-accent text-accent-fg"
	} },
	defaultVariants: { tone: "neutral" }
});
function Badge({ className, tone, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ tone }), className),
		...props
	});
}
function BtcPairChart({ data, symbol, buy, mode }) {
	const { tr } = useI18n();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (data.length < 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: tr("سری ۳۰ روزه این ارز کامل نبود.", "The 30-day series for this coin was incomplete.")
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 w-full rounded-md bg-elevated" });
	const marked = buy && !buy.flat ? buy : null;
	const unit = mode === "usd" ? tr(`${symbol} دلار، شاخص ۱۰۰`, `${symbol} in dollars, index 100`) : tr(`${symbol}/BTC، شاخص ۱۰۰`, `${symbol}/BTC, index 100`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 28,
					right: 16,
					left: 0,
					bottom: 12
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "t",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [(min) => min - 8, (max) => max + 6],
						width: 42,
						tick: {
							fill: "var(--color-subtle)",
							fontSize: 10,
							fontFamily: "IBM Plex Mono"
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: 100,
						stroke: "var(--color-subtle)",
						strokeDasharray: "3 4",
						strokeOpacity: .45
					}),
					marked ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: marked.value,
						stroke: "var(--color-up)",
						strokeDasharray: "4 4",
						strokeOpacity: .85
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { stroke: "var(--color-border-strong)" },
						content: ({ active, payload, label }) => {
							if (!active || !payload?.length) return null;
							const n = Number(payload[0]?.value);
							if (!Number.isFinite(n)) return null;
							const day = Number(label);
							const delta = n - 100;
							const tag = marked && day === marked.index ? tr(" · نقطه خرید", " · buy point") : "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-pop rounded-lg px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-subtle",
										children: [
											tr("روز", "Day"),
											" ",
											day + 1
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "num mt-1 text-sm text-fg",
										children: [n.toFixed(2), tag]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: `num text-xs ${delta >= 0 ? "text-up" : "text-down"}`,
										children: [
											delta >= 0 ? "+" : "",
											delta.toFixed(2),
											" ",
											tr("از شروع بازه", "from the start of the window")
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted",
										children: unit
									})
								]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "v",
						stroke: "var(--color-fg)",
						strokeWidth: 1.75,
						fill: "var(--color-fg)",
						fillOpacity: .06,
						isAnimationActive: false,
						dot: (props) => {
							const { cx, cy, payload } = props;
							if (cx == null || cy == null || !marked || payload?.t !== marked.index) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {}, `plain-${payload?.t ?? cx}`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx,
									cy,
									r: 16,
									fill: "var(--color-up)",
									opacity: .2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
									cx,
									cy,
									r: 5.5,
									fill: "var(--color-up)",
									stroke: "var(--color-bg)",
									strokeWidth: 2
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
									x: cx,
									y: cy - 14,
									textAnchor: "middle",
									fill: "var(--color-up)",
									fontSize: 11,
									fontFamily: "IBM Plex Mono",
									children: "BUY"
								})
							] }, `buy-${payload.t}`);
						},
						activeDot: {
							r: 3,
							fill: "var(--color-fg)"
						}
					})
				]
			})
		})
	});
}
function ChecklistCard({ items }) {
	const { tr } = useI18n();
	const { pass, fail, unknown } = checklistPassCount(items);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("چک‌لیست ورود اسپات", "Spot entry checklist")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: tr("پنج قاعده ثابت. سبز یعنی شرط برقرار است، نه اینکه معامله تضمین شده باشد.", "Five fixed rules. Green means the condition holds, not that the trade is guaranteed.")
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "num text-xs text-muted",
				children: [
					pass,
					" ",
					tr("از", "of"),
					" ",
					items.length,
					unknown ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" · ",
						unknown,
						" ",
						tr("نامشخص", "unknown")
					] }) : null,
					fail ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						" · ",
						fail,
						" ",
						tr("رد", "failed")
					] }) : null
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-5 flex flex-col gap-3",
			children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex gap-3 rounded-md bg-elevated p-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusIcon, { ok: item.ok }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: tr(item.label)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-subtle",
							children: tr(item.desired)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: tr(item.detail)
						})
					]
				})]
			}, item.key))
		})]
	});
}
function StatusIcon({ ok }) {
	if (ok === true) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-up-dim text-up",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" })
	});
	if (ok === false) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-down-dim text-down",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-elevated text-subtle shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
	});
}
function barColor(score) {
	if (score >= 70) return "var(--color-up)";
	if (score >= 45) return "var(--color-warn)";
	return "var(--color-down)";
}
function FactorBars({ factors }) {
	const { tr } = useI18n();
	const ordered = [...factors].sort((a, b) => b.weight - a.weight);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-4",
		children: ordered.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-baseline justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: tr(f.label)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-subtle",
					children: tr(`وزن ${(f.weight * 100).toFixed(0)}٪ از امتیاز اسپات`, `Weight ${(f.weight * 100).toFixed(0)}% of the spot score`)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainTip, {
					title: tr(f.label),
					body: `${tr(f.note)} ${tr(`وزن این فاکتور ${(f.weight * 100).toFixed(0)}٪ است و نمره بالاتر بهتر است.`, `This factor weighs ${(f.weight * 100).toFixed(0)}% and a higher score is better.`)}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-sm text-fg",
						children: formatScore(f.score)
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-1.5 overflow-hidden rounded-full bg-elevated",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full rounded-full transition-[width] duration-500 ease-out",
					style: {
						width: `${Math.max(4, Math.min(100, f.score))}%`,
						background: barColor(f.score)
					}
				})
			})]
		}, f.key))
	});
}
function toneFor(n) {
	if (n > .001) return "up";
	if (n < -.001) return "down";
	return "neutral";
}
function PickPanel({ result, live }) {
	const { pick, runnerUp, verdict } = result;
	const { tr } = useI18n();
	const focus = verdict.symbol != null ? result.top.find((row) => row.symbol === verdict.symbol) ?? pick : pick;
	const confTone = result.confidence === "high" ? "up" : result.confidence === "low" ? "down" : "neutral";
	const coverage = result.klinesTried > 0 ? Math.round(result.klinesOk / result.universeSize * 100) : 0;
	const chartMode = focus.symbol === "BTC" ? "usd" : "pair";
	const usdPath = focus.spotIndex;
	const chartSeries = focus.symbol === "BTC" && usdPath && usdPath.length >= 5 ? usdPath : focus.pairSeries;
	const buy = findBestBuyPoint(chartSeries);
	const livePrice = live?.[focus.symbol] ?? focus.priceUsd;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: regimeTitle(result.regime) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["دامیننس BTC", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num ms-1",
						children: result.btcDominance == null ? "—" : `${result.btcDominance.toFixed(1)}٪`
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: result.dominanceBias === "falling" ? "up" : result.dominanceBias === "rising" ? "down" : "neutral",
						children: dominanceTitle(result.dominanceBias)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						tone: confTone,
						children: confidenceTitle(result.confidence)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-subtle",
						children: [
							"به‌روز ",
							timeAgoFa(result.generatedAt),
							" · ",
							result.sources.join(" + "),
							" · کندل",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num",
								children: [coverage, "٪"]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-2xl font-medium tracking-tight text-fg md:text-3xl",
						children: tr(verdictSentence(verdict.kind))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted",
						children: tr(verdict.reason)
					}),
					verdict.validUntil ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							tr("این حکم معتبر است تا", "This call is valid until"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num text-fg",
								children: formatUntil(verdict.validUntil)
							})
						]
					}) : null,
					(verdict.kind === "wait" || verdict.kind === "cash") && verdict.reachUsd != null && verdict.invalidationUsd != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							tr("رسیدن", "Reach"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-fg",
								children: ["$", formatUsd(verdict.reachUsd)]
							}),
							" · ",
							tr("ابطال", "Invalidation"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-fg",
								children: ["$", formatUsd(verdict.invalidationUsd)]
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
							symbol: focus.symbol,
							name: focus.name,
							rank: focus.rank,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-start md:text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: tr("امتیاز اسپات", "Spot score")
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
								id: `score:${focus.symbol}`,
								value: focus.score,
								format: formatScore,
								className: "text-4xl font-medium tracking-tight text-fg"
							})]
						})]
					}),
					focus.narrativeTagsFa[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: focus.narrativeTagsFa[0]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "قیمت دلار",
								value: `$${formatUsd(livePrice)}`,
								liveId: `px:${focus.symbol}`,
								liveValue: livePrice
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "قیمت به بیت‌کوین",
								value: btcPriceLabel(focus.priceBtc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "۷ روز vs BTC",
								value: formatPct(focus.rs7d),
								tone: toneFor(focus.rs7d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "۳۰ روز vs BTC",
								value: focus.rs30d == null ? "—" : formatPct(focus.rs30d),
								tone: focus.rs30d == null ? "neutral" : toneFor(focus.rs30d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "MC / FDV",
								value: focus.mcFdv == null ? "—" : `${(focus.mcFdv * 100).toFixed(0)}٪`,
								tone: focus.mcFdv == null ? "neutral" : focus.mcFdv >= .7 ? "up" : focus.mcFdv < .5 ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "EMA ۲۰۰",
								value: focus.aboveEma200 === true ? "بالا" : focus.aboveEma200 === false ? "پایین" : "—",
								tone: focus.aboveEma200 === true ? "up" : focus.aboveEma200 === false ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "ساختار هفتگی",
								value: focus.weeklyStructure === "bull" ? "صعودی" : focus.weeklyStructure === "bear" ? "نزولی" : focus.weeklyStructure === "range" ? "رنج" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "گردش ۲۴س",
								value: `${(focus.turnover * 100).toFixed(2)}٪`,
								tone: focus.turnover >= .02 ? "up" : "neutral"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-3xl text-sm leading-relaxed text-muted",
						children: result.confidenceNote
					}),
					result.books.find((book) => book.symbol === focus.symbol) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-xs leading-relaxed text-subtle",
						children: result.books.find((book) => book.symbol === focus.symbol)?.note
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RiskBreakdown, { row: focus }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecklistCard, { items: result.checklist }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid min-w-0 gap-6 lg:grid-cols-[1.15fr_0.85fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-medium text-fg",
							children: "چرا این، و نه بقیه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
							className: "mt-4 flex flex-col gap-3",
							children: result.reasons.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-3 text-sm leading-relaxed text-muted",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mt-1.5 size-1.5 shrink-0 rounded-full bg-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: r })]
							}, r))
						}),
						result.caution.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 rounded-md bg-elevated p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "flex items-center gap-2 text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldAlert, { className: "size-4 text-warn" }), "نکته‌های احتیاط"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-2 flex flex-col gap-2",
								children: result.caution.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-sm leading-relaxed text-muted",
									children: c
								}, c))
							})]
						}) : null,
						runnerUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-xs text-subtle",
							children: [
								"گزینه دوم: ",
								runnerUp.name,
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-fg",
									children: runnerUp.symbol
								}),
								" · ",
								"امتیاز ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num",
									children: formatScore(runnerUp.score)
								}),
								" · ",
								"۷ روز vs BTC ",
								formatPct(runnerUp.rs7d)
							]
						}) : null
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 overflow-hidden rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "text-base font-medium text-fg",
								children: chartMode === "usd" ? "قیمت دلاری بیت‌کوین · ۳۰ روز" : `جفت ${focus.symbol}/BTC · ۳۰ روز`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-subtle",
								children: verdict.kind !== "buy" ? chartMode === "usd" ? "۱۰۰ = شروع بازه." : "۱۰۰ = شروع بازه. بالای ۱۰۰ یعنی از بیت‌کوین جلو افتاده." : chartMode === "usd" ? "۱۰۰ = شروع بازه. علامت BUY بهترین اصلاح این مسیر است." : "۱۰۰ = شروع بازه. بالای ۱۰۰ یعنی از بیت‌کوین جلو افتاده. BUY بهترین نقطه خرید همین ارز است."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num shrink-0 rounded-sm bg-fg px-2 py-1 text-xs text-bg",
								children: focus.symbol
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtcPairChart, {
								data: chartSeries,
								symbol: focus.symbol,
								buy: verdict.kind === "buy" ? buy : null,
								mode: chartMode
							})
						}),
						verdict.kind === "buy" && buy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-md bg-elevated px-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-fg",
								children: buy.flat ? "نقطه خرید متمایزی نیست" : buy.nearNow ? "الان نزدیک بهترین نقطه خرید است" : "بهترین نقطه خرید این بازه"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-muted",
								children: buy.flat ? "نوسان ۳۰ روزه آن‌قدر کم است که کف قابل‌دفاعی شکل نگرفته." : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									"روز ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: buy.day
									}),
									" · ",
									"شاخص ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: buy.value.toFixed(1)
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num",
										children: [buy.pullbackPct.toFixed(1), "٪"]
									}),
									" زیر اوج پیش از آن",
									buy.recovered ? "، و بعدش قیمت برگشته" : "، هنوز برگشت محکم ندیده",
									". از آن کف تا امروز",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `num ${buy.sincePct >= 0 ? "text-up" : "text-down"}`,
										children: [
											buy.sincePct >= 0 ? "+" : "",
											buy.sincePct.toFixed(1),
											"٪"
										]
									}),
									"."
								] })
							})]
						}) : verdict.kind === "buy" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "سری قیمت برای علامت‌گذاری نقطه خرید کافی نبود."
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"RSI ۱۴روزه:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: focus.rsi14 == null ? "—" : focus.rsi14.toFixed(0)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"۷ روز دلار:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: formatPctPoints(focus.pct7d)
									})
								]
							})]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-medium text-fg",
						children: "تجزیه امتیاز"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-subtle",
						children: "هفت فاکتور از ۰ تا ۱۰۰. وزن‌ها ثابت‌اند تا مدل قابل‌حسابرسی باشد."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBars, { factors: focus.factors })
					})
				]
			})
		]
	});
}
function Stat$3({ label, value, tone = "neutral", liveId, liveValue }) {
	const color = tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `mt-1 text-sm md:text-base ${color}`,
			children: liveId != null && liveValue != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
				id: liveId,
				value: liveValue,
				format: (n) => `$${formatUsd(n)}`,
				className: color
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "num",
				children: value
			})
		})]
	});
}
var SETTINGS = "alpha-spot-desk-v1";
var ORDERS = "alpha-spot-orders-v1";
var ALERTS = "alpha-spot-alerts-v1";
var SEEN = "alpha-spot-seen-v1";
var defaultDeskSettings = {
	capitalUsd: 1e4,
	webhookUrl: "",
	telegramToken: "",
	telegramChat: "",
	alertKill: true,
	alertScore: true,
	scoreFloor: 60
};
function canStore$3() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadDeskSettings() {
	if (!canStore$3()) return { ...defaultDeskSettings };
	try {
		const raw = localStorage.getItem(SETTINGS);
		if (!raw) return { ...defaultDeskSettings };
		const parsed = JSON.parse(raw);
		return {
			...defaultDeskSettings,
			...parsed,
			capitalUsd: Number(parsed.capitalUsd) > 0 ? Number(parsed.capitalUsd) : 1e4,
			scoreFloor: Number.isFinite(Number(parsed.scoreFloor)) ? Number(parsed.scoreFloor) : 60
		};
	} catch {
		return { ...defaultDeskSettings };
	}
}
function saveDeskSettings(next) {
	if (!canStore$3()) return;
	try {
		localStorage.setItem(SETTINGS, JSON.stringify(next));
	} catch {}
}
function planOrders(sleeves, coins, books, capitalUsd) {
	const weights = /* @__PURE__ */ new Map();
	for (const sleeve of sleeves) for (const leg of sleeve.legs) weights.set(leg.symbol, (weights.get(leg.symbol) ?? 0) + leg.weight);
	const at = (/* @__PURE__ */ new Date()).toISOString();
	const orders = [];
	for (const [symbol, weight] of weights) {
		if (weight <= 0) continue;
		const coin = coins.find((row) => row.symbol === symbol);
		const book = books.find((row) => row.symbol === symbol);
		orders.push({
			id: `${at}:${symbol}`,
			at,
			symbol,
			side: "BUY",
			notionalUsd: Math.round(capitalUsd * weight),
			weight,
			priceUsd: coin?.priceUsd ?? 0,
			slippageBps: book?.slippageBps ?? null,
			status: "paper"
		});
	}
	return orders.sort((a, b) => b.notionalUsd - a.notionalUsd);
}
function loadOrders() {
	if (!canStore$3()) return [];
	try {
		const raw = localStorage.getItem(ORDERS);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
	} catch {
		return [];
	}
}
function saveOrders(rows) {
	const next = rows.slice(0, 40);
	if (canStore$3()) try {
		localStorage.setItem(ORDERS, JSON.stringify(next));
	} catch {}
	return next;
}
function loadAlerts() {
	if (!canStore$3()) return [];
	try {
		const raw = localStorage.getItem(ALERTS);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 30) : [];
	} catch {
		return [];
	}
}
function pushAlert(alert) {
	const next = [alert, ...loadAlerts().filter((row) => row.id !== alert.id)].slice(0, 30);
	if (canStore$3()) try {
		localStorage.setItem(ALERTS, JSON.stringify(next));
	} catch {}
	return next;
}
function seenMap() {
	if (!canStore$3()) return {};
	try {
		const raw = localStorage.getItem(SEEN);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function hasSeen(id) {
	return Boolean(seenMap()[id]);
}
function markSeen(id) {
	if (!canStore$3()) return;
	const map = seenMap();
	map[id] = (/* @__PURE__ */ new Date()).toISOString();
	const entries = Object.entries(map).slice(-80);
	try {
		localStorage.setItem(SEEN, JSON.stringify(Object.fromEntries(entries)));
	} catch {}
}
var runSpotBacktest = createServerFn({ method: "POST" }).handler(createSsrRpc("b5f74dffff4b6c35ce44b7129d8d5ebb42b2ff29c152c819a7d42fa5ca8fc035"));
var runOpportunityBacktest = createServerFn({ method: "POST" }).handler(createSsrRpc("5469c7ef2b6a0c6da8b20e30389ebaa2b621913c5d8e6fe0888226964b424d35"));
var checkOpportunityQuotes = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || !Array.isArray(input.symbols)) throw new Error("نمادها نامعتبرند.");
	return { symbols: input.symbols.filter((symbol) => typeof symbol === "string" && /^[A-Z0-9]{2,15}$/.test(symbol)).slice(0, 40) };
}).handler(createSsrRpc("3d750ceb230c06ac4407a1ae107889436f44c8752c9c19bf5d7306a2a4e8cff8"));
var checkDeskPulse = createServerFn({ method: "POST" }).handler(createSsrRpc("2430eb14739b94c669f882053cb7ce0e872ee809f7eb597b1f6e667f4e495a81"));
var dispatchDeskSignal = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("پیام خالی است.");
	if (typeof input.title !== "string" || typeof input.text !== "string") throw new Error("متن سیگنال ناقص است.");
	if (!Array.isArray(input.orders)) throw new Error("سفارش‌ها نامعتبرند.");
	return input;
}).handler(createSsrRpc("d6d9cdc69038feacef9008e70b9d27c67fb1b102a7bbc2e3a99d3ce283b3fa4b"));
var loadMacroDesk = createServerFn({ method: "GET" }).handler(createSsrRpc("f697a98ee6b797ad586422b6949d2f49da1bb56769cc8f2a69c205e8d833816f"));
var runVenue = createServerFn({ method: "POST" }).validator((input) => normalizeVenueCall(input)).handler(createSsrRpc("eed7d3073443c33758c00a8a490ad465452ee6d3f46e47d1fde88dd2a65e227a"));
function SignalButton({ result }) {
	const { tr } = useI18n();
	const send = useServerFn(dispatchDeskSignal);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const settings = loadDeskSettings();
	const preview = planOrders(result.portfolio, result.top, result.books, settings.capitalUsd);
	const total = preview.reduce((sum, row) => sum + row.notionalUsd, 0);
	async function onClick() {
		setBusy(true);
		setNote(null);
		const title = msg(`آلفا اسپات · سبد ${result.pick.symbol}`, `Alpha Spot · ${result.pick.symbol} basket`);
		const text = preview.map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")}`).join("\n");
		try {
			const res = await send({ data: {
				title: tr(title),
				text,
				kind: "orders",
				orders: preview.map((row) => ({
					symbol: row.symbol,
					side: row.side,
					notionalUsd: row.notionalUsd,
					weight: row.weight
				})),
				webhookUrl: settings.webhookUrl,
				telegramToken: settings.telegramToken,
				telegramChat: settings.telegramChat
			} });
			const status = res.webhook === "sent" || res.telegram === "sent" ? "sent" : res.webhook === "failed" || res.telegram === "failed" ? "failed" : "paper";
			saveOrders([...preview.map((row) => ({
				...row,
				status
			})), ...loadOrders()]);
			setNote(res.detail);
		} catch (err) {
			setNote(err instanceof Error ? err.message : msg("ارسال انجام نشد.", "The send did not go through."));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: tr("ارسال همین سبد", "Send this basket")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: [
					tr("با سرمایه فرضی", "With a paper capital of"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: ["$", formatUsd(settings.capitalUsd)]
					}),
					" ",
					tr("حدود", "about"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: ["$", formatUsd(total)]
					}),
					" ",
					tr("سفارش کاغذی ساخته می‌شود. اگر در تب اجرا وب‌هوک یا تلگرام را گذاشته باشید، همان سیگنال هم می‌رود. کلید صرافی اینجا ذخیره نمی‌شود.", "of paper orders are built. If you added a webhook or Telegram on the Execute tab, that same signal is sent. Exchange keys are not stored here.")
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4 h-11",
				disabled: busy || preview.length === 0,
				onClick,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), tr("ثبت و ارسال سیگنال", "Save and send the signal")]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: tr(note)
			}) : null
		]
	});
}
var SLICE = [
	"var(--color-accent)",
	"var(--color-up)",
	"var(--color-warn)"
];
function PortfolioPanel({ result }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const sleeves = result.portfolio;
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	const chart = sleeves.map((sleeve) => ({
		name: tr(sleeve.title),
		value: sleeve.targetPct,
		note: tr(sleeve.note)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("پرتفوی پیشنهادی اسپات", "Suggested spot portfolio")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: tr("هسته بیت‌کوین است. قمر حداکثر دو نام و روی هم کمتر از یک‌سوم است و فقط با دروازهٔ ساختاری باز می‌شود: هسته روشن، افت دامیننس، داخل محدوده، بدون وتو. عدد بک‌تست به‌تنهایی سفارش نیست. نقد فقط وقتی کلید قطع روشن است: قیمت زیر میانگین ۲۰۰روزه و ساختار هفتگی شکسته. تعطیلی بورس دفتر را نقد نمی‌کند.", "The core is Bitcoin. A satellite is at most two names and under one third together, and it opens only through the structural gates: core on, falling dominance, inside the zone, no veto. The backtest number alone is not an order. Cash is only the kill switch: price under the 200-day average and weekly structure broken. A market holiday does not liquidate the book.")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[16rem_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 rounded-xl bg-surface p-3",
					children: ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
							data: chart,
							dataKey: "value",
							nameKey: "name",
							innerRadius: 48,
							outerRadius: 78,
							paddingAngle: 3,
							stroke: "none",
							children: chart.map((slice, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: SLICE[index % SLICE.length] }, slice.name))
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: ({ active, payload }) => {
							if (!active || !payload?.length) return null;
							const row = payload[0]?.payload;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-pop max-w-xs rounded-lg px-3 py-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-fg",
									children: [tr(row.name), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-2",
										children: [row.value, pct]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs leading-relaxed text-muted",
									children: tr(row.note)
								})]
							});
						} })] })
					}) : null
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 md:grid-cols-3",
					children: sleeves.map((sleeve, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-surface p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "num text-xs",
								style: { color: SLICE[index % SLICE.length] },
								children: [sleeve.targetPct, pct]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-1 text-sm text-fg",
								children: tr(sleeve.title)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs leading-relaxed text-muted",
								children: tr(sleeve.note)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 flex flex-col gap-3",
								children: sleeve.legs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
									className: "text-xs text-subtle",
									children: tr("در این آستین گزینه واجد شرایط نبود.", "No name in this sleeve qualified.")
								}) : sleeve.legs.map((leg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-start justify-between gap-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
											symbol: leg.symbol,
											name: leg.name,
											rank: leg.rank,
											size: "sm"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs text-muted",
											children: tr(leg.reason)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-end",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "num text-sm text-fg",
											children: [(leg.weight * 100).toFixed(1), pct]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "num text-xs text-subtle",
											children: formatScore(leg.score)
										})]
									})]
								}, leg.symbol))
							})
						]
					}, sleeve.key))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalButton, { result })
		]
	});
}
var FILTERS$1 = [
	{
		id: "all",
		label: "رتبه مدل",
		en: "Model rank"
	},
	{
		id: "unlock",
		label: "بیشترین ریسک آنلاک",
		en: "Highest unlock risk"
	},
	{
		id: "rebalance",
		label: "بهترین فرصت‌های Rebalance",
		en: "Best rebalance setups"
	},
	{
		id: "btc-cycle",
		label: "سیکل‌های کم‌ریسک بیت‌کوین",
		en: "Lower-risk Bitcoin cycles"
	}
];
function QuickFilters({ value, onChange }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: FILTERS$1.map((filter) => {
			const on = filter.id === value;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onChange(filter.id),
				className: on ? "h-11 shrink-0 rounded-full bg-accent px-4 text-sm text-accent-fg" : "h-11 shrink-0 rounded-full bg-surface px-4 text-sm text-muted hover:text-fg",
				children: tr(filter.label, filter.en)
			}, filter.id);
		})
	});
}
function whenLabel(row, tr, locale) {
	if (!row.unlockDate) return "—";
	const date = (/* @__PURE__ */ new Date(`${row.unlockDate}T00:00:00Z`)).toLocaleDateString(locale === "en" ? "en-US" : "fa-IR", {
		month: "short",
		day: "numeric"
	});
	if (row.unlockDays == null) return date;
	return `${date} · ${row.unlockDays} ${tr("روز", "days")}`;
}
function UnlocksPanel({ rows, source, matched }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const [filter, setFilter] = (0, import_react.useState)("all");
	const alts = (0, import_react.useMemo)(() => rows.filter((r) => r.symbol !== "BTC").sort((a, b) => a.rank - b.rank), [rows]);
	const penalized = alts.filter((r) => r.highDilution).length;
	const cliffs = alts.filter((r) => r.unlockCliff).length;
	const visible = alts.filter((r) => {
		if (filter === "penalty") return r.highDilution;
		if (filter === "cliff") return r.unlockCliff;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-medium text-fg",
					children: tr("آزادسازی پیشِ رو", "Unlocks ahead")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 max-w-3xl text-xs leading-relaxed text-subtle",
					children: [
						tr("کلیف‌های ۱۴ تا ۳۰ روز و مجموع آزادسازی ۳۰ روز آینده روی صد ارز اول. اگر بیش از ۳٪ عرضه در این پنجره باشد، ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌خورد. منبع:", "Cliffs 14 to 30 days out, and total unlocks over the next 30 days, across the top one hundred coins. If more than 3% of supply falls in this window, 15 to 20 points come off the score and it is tagged High Dilution Risk. Source:"),
						" ",
						source === "coinmarketcap" ? tr("تقویم عمومی CoinMarketCap (همان استاندارد کلیف/خطی DefiLlama؛ endpoint انتشار DefiLlama الان پولی است).", "CoinMarketCap’s public calendar (the same cliff/linear standard as DefiLlama; the DefiLlama unlock endpoint is paid right now).") : tr("تقویم الان در دسترس نیست.", "The calendar is not available right now."),
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: matched
						}),
						" ",
						tr("نماد برنامه فعال داشتند.", "symbols had an active schedule.")
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: tr("ارز", "Coins"),
							v: String(alts.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: tr("جریمه", "Penalty"),
							v: String(penalized)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: tr("کلیف", "Cliff"),
							v: String(cliffs)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-lg bg-elevated p-1",
					children: [
						[
							"all",
							"همه",
							"All"
						],
						[
							"penalty",
							"جریمه‌شده",
							"Penalized"
						],
						[
							"cliff",
							"کلیف‌مانند",
							"Cliff-like"
						]
					].map(([id, label, en]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: filter === id ? "h-11 flex-1 rounded-md bg-surface px-3 text-sm text-fg" : "h-11 flex-1 rounded-md px-3 text-sm text-muted",
						children: tr(label, en)
					}, id))
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[680px] text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border text-xs text-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("ارز", "Coin")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("آنلاک بعدی", "Next unlock")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("٪ عرضه ۳۰روز", "30-day supply %")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("کلیف", "Cliff")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("جریمه", "Penalty")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: tr("حجم", "Volume")
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-6 text-sm text-muted",
						children: tr("در این فیلتر رویدادی نیست.", "Nothing in this filter.")
					})
				}) : visible.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
								symbol: row.symbol,
								name: row.name,
								rank: row.rank,
								size: "sm"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: whenLabel(row, tr, locale)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-fg",
							children: row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(2)}${pct}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: row.unlockCliff ? tr("بله", "Yes") : tr("خیر", "No")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExplainTip, {
								title: tr(`جریمه آنلاک ${row.symbol}`, `Unlock penalty ${row.symbol}`),
								body: unlockExplain(row),
								children: row.highDilution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex rounded-full bg-down-dim px-2 py-1 text-xs text-down",
									children: ["High Dilution · ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-1",
										children: ["-", row.unlockPenalty]
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-subtle",
									children: row.unlockPenalty > 0 ? tr(`جریمه ${row.unlockPenalty}`, `Penalty ${row.unlockPenalty}`) : tr("بدون جریمه", "No penalty")
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "num px-4 py-3 text-muted",
							children: ["$", formatUsd(row.volume24h)]
						})
					]
				}, row.id)) })]
			})
		})]
	});
}
function Mini({ k, v }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: tr(k)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: v
		})]
	});
}
function BacktestPanel() {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const run = useServerFn(runSpotBacktest);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [report, setReport] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	async function onRun() {
		setStatus("loading");
		setError(null);
		setReady(false);
		try {
			const data = await run();
			setReport(data);
			setStatus(data.weeks > 0 ? "done" : "error");
			if (data.weeks === 0) setError(data.note);
			else setReady(true);
		} catch (err) {
			setStatus("error");
			setError(err instanceof Error ? err.message : msg("بک‌تست انجام نشد.", "The backtest did not finish."));
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex min-w-0 flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-medium text-fg",
					children: tr("بک‌تست سه ساله", "Three-year backtest")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
					children: tr("مسیر آزمایشی قمر را مثل میز زنده تا ابطال قفل‌شده، شکست ساختار هفتگی جفت، یا کلید قطع نگه می‌دارد. خودِ عدد بک‌تست سفارش نیست؛ میز فقط با دروازهٔ ساختاری قمر می‌خرد. گرم‌شدن ۲۲۰ روز است و سقوط مه و ژوئن ۲۰۲۲ داخل معامله نیست.", "The measured path holds a satellite the way the live desk does, until the locked invalidation, a weekly pair-structure break, or the kill switch. The backtest number itself is not an order; the desk buys a satellite only through the structural gates. Warmup is 220 days, so the May and June 2022 crash is not in the traded path.")
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-11 shrink-0",
					onClick: onRun,
					disabled: status === "loading",
					children: status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), tr("در حال خواندن تاریخ", "Reading history")] }) : tr("اجرای بک‌تست", "Run backtest")
				})]
			}),
			status === "error" && error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-down",
				children: tr(error)
			}) : null,
			status === "done" && report && report.weeks > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: tr(report.note)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("بازده مدل", "Model return"),
							value: formatPct(report.totalReturn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("بازده بیت‌کوین", "Bitcoin return"),
							value: formatPct(report.btcReturn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("وین‌ریت هفته‌ها", "Weekly win rate"),
							value: formatPct(report.winRate, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("بیشترین افت", "Largest drop"),
							value: formatPct(report.maxDrawdown)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("هفته‌ها", "Weeks"),
							value: String(report.weeks)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("جابه‌جایی", "Rotations"),
							value: String(report.trades)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("افت BTC", "BTC drop"),
							value: formatPct(report.btcMaxDrawdown)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
							label: tr("روز داده", "Days of data"),
							value: String(report.days)
						})
					]
				}),
				ready && report.curve.length > 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-56 w-full rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
					dir: "ltr",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
						width: "100%",
						height: "100%",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: report.curve,
							margin: {
								top: 8,
								right: 8,
								left: 0,
								bottom: 0
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "t",
									hide: true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									width: 42,
									axisLine: false,
									tickLine: false,
									tick: {
										fill: "#6e6e77",
										fontSize: 10,
										fontFamily: "IBM Plex Mono"
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
									contentStyle: {
										background: "#121214",
										border: "1px solid rgb(241 242 244 / 0.12)",
										borderRadius: 8,
										fontSize: 12,
										color: "#f1f2f4"
									},
									formatter: (value, name) => {
										const n = typeof value === "number" ? value : Number(value);
										const label = name === "equity" ? tr("مدل", "Model") : tr("بیت‌کوین", "Bitcoin");
										return [`${((n - 1) * 100).toFixed(1)}${pct}`, label];
									}
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "equity",
									stroke: "#f1f2f4",
									dot: false,
									strokeWidth: 1.6
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "btc",
									stroke: "#6e6e77",
									dot: false,
									strokeWidth: 1.2
								})
							]
						})
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthlyReturns, { report }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-wrap gap-2",
					children: report.holdings.slice(0, 6).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-full bg-elevated px-3 py-1 text-xs text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num text-fg",
								children: row.symbol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num ms-2",
								children: [
									row.periods,
									" ",
									tr("هفته", "weeks")
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num ms-2",
								children: formatPct(row.returnPct, 0)
							})
						]
					}, row.symbol))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "flex flex-col gap-2",
					children: report.assumptions.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs leading-relaxed text-subtle",
						children: tr(line)
					}, line))
				})
			] }) : null
		]
	});
}
function Stat$2({ label, value }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: tr(label)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: value
		})]
	});
}
function monthLabel(key, locale) {
	const [year, month] = key.split("-");
	const y = Number(year);
	const m = Number(month);
	if (!y || !m) return key;
	return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString(locale === "en" ? "en-GB" : "fa-IR", {
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	});
}
function MonthlyReturns({ report }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	if (report.months.length === 0) return null;
	const rows = report.months.map((row) => ({
		...row,
		label: monthLabel(row.key, locale),
		gap: row.model - row.btc
	}));
	const sample = report.monthSample === "full" ? tr(`میانگین روی ${report.monthCount} ماه کامل است. ماه ناقص در جدول می‌ماند ولی داخل میانگین نیست.`, `The average uses ${report.monthCount} complete months. Partial months stay in the table but are outside the average.`) : tr(`هنوز سه ماه کامل نیست؛ میانگین روی هر ${report.monthCount} ماه موجود است، از جمله ماه ناقص.`, `There are not yet three complete months. The average uses all ${report.monthCount} months on record, including partial ones.`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
				className: "text-sm font-medium text-fg",
				children: tr("بازده ماهانه مدل", "Monthly model return")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-xs leading-relaxed text-subtle",
				children: sample
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid grid-cols-2 gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("میانگین ماهانه", "Average month"),
						value: formatPct(report.avgMonthly)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("ماهانه مرکب", "Compounded month"),
						value: formatPct(report.compoundMonthly)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("میانه ماه", "Median month"),
						value: formatPct(report.medianMonthly)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("بهترین ماه", "Best month"),
						value: formatPct(report.bestMonth)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("بدترین ماه", "Worst month"),
						value: formatPct(report.worstMonth)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("ماه‌های مثبت", "Positive months"),
						value: `${report.positiveMonths}/${report.monthCount}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("جلوتر از BTC", "Ahead of BTC"),
						value: `${report.monthsAhead}/${report.monthCount}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
						label: tr("ماه در مسیر", "Months on the path"),
						value: String(report.months.length)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56 w-full rounded-xl bg-surface p-3 shadow-[var(--shadow-border)]",
				dir: "ltr",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: rows,
						margin: {
							top: 8,
							right: 8,
							left: 0,
							bottom: 0
						},
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "label",
								hide: true
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								width: 42,
								axisLine: false,
								tickLine: false,
								tick: {
									fill: "#6e6e77",
									fontSize: 10,
									fontFamily: "IBM Plex Mono"
								},
								tickFormatter: (value) => `${(value * 100).toFixed(0)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "#121214",
									border: "1px solid rgb(241 242 244 / 0.12)",
									borderRadius: 8,
									fontSize: 12,
									color: "#f1f2f4"
								},
								formatter: (value, name) => {
									const n = typeof value === "number" ? value : Number(value);
									const label = name === "model" ? tr("مدل", "Model") : tr("بیت‌کوین", "Bitcoin");
									return [`${(n * 100).toFixed(1)}${pct}`, label];
								},
								labelFormatter: (label) => String(label)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "model",
								fill: "#f1f2f4",
								radius: [
									2,
									2,
									0,
									0
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "btc",
								fill: "#6e6e77",
								radius: [
									2,
									2,
									0,
									0
								]
							})
						]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: tr("ستون روشن مدل است و ستون تیره همان ماه بیت‌کوین. واحد محور، درصد است.", "The light bar is the model. The dark bar is Bitcoin that same month. The axis is percent.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "max-h-80 overflow-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[28rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "sticky top-0 bg-elevated text-xs text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-start font-medium",
								children: tr("ماه", "Month")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-end font-medium",
								children: tr("مدل", "Model")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-end font-medium",
								children: tr("بیت‌کوین", "Bitcoin")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-end font-medium",
								children: tr("اختلاف", "Gap")
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3 text-fg",
								children: [
									row.label,
									row.partial ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "ms-2 text-xs text-subtle",
										children: tr("ناقص", "partial")
									}) : null,
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-2 text-xs text-subtle",
										children: [
											row.weeks,
											" ",
											tr("هفته", "wk")
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `num px-3 py-3 text-end ${row.model >= 0 ? "text-up" : "text-down"}`,
								children: formatPct(row.model)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `num px-3 py-3 text-end ${row.btc >= 0 ? "text-up" : "text-down"}`,
								children: formatPct(row.btc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `num px-3 py-3 text-end ${row.gap >= 0 ? "text-up" : "text-down"}`,
								children: formatPct(row.gap)
							})
						]
					}, row.key)) })]
				})
			})
		]
	});
}
var GATE = {
	pass: "عبور",
	thin: "نازک",
	crowded: "شلوغ",
	levered: "اهرم",
	unknown: "نامشخص"
};
var GATE_EN = {
	pass: "Pass",
	thin: "Thin",
	crowded: "Crowded",
	levered: "Levered",
	unknown: "Unknown"
};
function gateClass(gate) {
	if (gate === "pass") return "text-up";
	if (gate === "thin") return "text-down";
	if (gate === "unknown") return "text-subtle";
	return "text-warn";
}
function DepthPanel({ books }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("عمق دفتر و مشتقات", "Book depth and derivatives")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: tr("خرید ۱۰هزار دلاری روی دفتر اسپات بایننس سنجیده می‌شود. سود باز، تغییر ۲۴ساعته و نسبت لانگ به شورت از قرارداد دائمی OKX می‌آید و اگر آنجا جواب ندهد از بایننس فیوچرز. آلت خرد با سود باز داغ، حجم اسپات را نصف می‌کند؛ دفتر نازک خرید را معلق می‌کند.", "A $10,000 buy is measured on the Binance spot book. Open interest, the 24-hour change, and the long/short ratio come from the OKX perpetual, and from Binance futures if OKX does not answer. A small-cap alt with hot open interest halves the spot size; a thin book suspends the buy.")
			})] }),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]",
				children: tr("هنوز دفتر سفارشی برای این اجرا خوانده نشده.", "No order book has been read for this run yet.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-start text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("نماد", "Symbol")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("وضعیت", "Status")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("اسلیپیج", "Slippage")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("عمق ۱۰bps", "Depth 10bps")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("فاندینگ سال", "Funding / year")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("سود باز", "Open interest")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("۲۴س", "24h")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: tr("لانگ/شورت", "Long/short")
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: books.map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-3 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: book.symbol
								}), book.smallCap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "ms-2 text-xs text-subtle",
									children: tr("خرد", "Small")
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-3 py-3 ${gateClass(book.gate)}`,
								children: tr(GATE[book.gate], GATE_EN[book.gate])
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.slippageBps == null ? "—" : book.slippageBps.toFixed(1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.depthUsd == null ? "—" : formatUsd(book.depthUsd)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.fundingAnnual == null ? "—" : formatPct(book.fundingAnnual, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.openInterestUsd == null ? "—" : formatUsd(book.openInterestUsd)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.oiChange24h == null ? "—" : formatPct(book.oiChange24h, 1)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-3 py-3 text-fg",
								children: book.longShortRatio == null ? "—" : book.longShortRatio.toFixed(2)
							})
						]
					}, book.symbol)) })]
				})
			}),
			books.filter((book) => book.gate === "thin" || book.gate === "levered" || book.gate === "crowded").map((book) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs leading-relaxed text-subtle",
				children: [
					book.symbol,
					": ",
					tr(book.note)
				]
			}, `${book.symbol}-note`))
		]
	});
}
function ExecutePanel({ result }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const send = useServerFn(dispatchDeskSignal);
	const [settings, setSettings] = (0, import_react.useState)(() => loadDeskSettings());
	const [orders, setOrders] = (0, import_react.useState)(() => loadOrders());
	const [alerts, setAlerts] = (0, import_react.useState)(() => loadAlerts());
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const preview = (0, import_react.useMemo)(() => planOrders(result.portfolio, result.top, result.books, settings.capitalUsd), [result, settings.capitalUsd]);
	function patch(partial) {
		const next = {
			...settings,
			...partial
		};
		setSettings(next);
		saveDeskSettings(next);
	}
	async function onSend(kind) {
		setBusy(true);
		setNote(null);
		const rows = kind === "test" ? [] : preview;
		const title = kind === "test" ? msg("آلفا اسپات · آزمایش اتصال", "Alpha Spot · connection test") : msg(`آلفا اسپات · سبد ${result.pick.symbol}`, `Alpha Spot · ${result.pick.symbol} basket`);
		const text = kind === "test" ? msg("اگر این پیام را می‌بینید، وب‌هوک یا تلگرام وصل است. سفارشی روی صرافی ثبت نشده.", "If you can read this, the webhook or Telegram is connected. No order was placed on an exchange.") : rows.map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")} (${(row.weight * 100).toFixed(1)}${pct})`).join("\n");
		try {
			const res = await send({ data: {
				title: tr(title),
				text: tr(text || title),
				kind,
				orders: rows.map((row) => ({
					symbol: row.symbol,
					side: row.side,
					notionalUsd: row.notionalUsd,
					weight: row.weight
				})),
				webhookUrl: settings.webhookUrl,
				telegramToken: settings.telegramToken,
				telegramChat: settings.telegramChat
			} });
			const status = res.webhook === "sent" || res.telegram === "sent" ? "sent" : res.webhook === "failed" || res.telegram === "failed" ? "failed" : "paper";
			if (kind === "orders") {
				const stamped = rows.map((row) => ({
					...row,
					status
				}));
				setOrders(saveOrders([...stamped, ...orders]));
			}
			setAlerts(pushAlert({
				id: `${kind}:${(/* @__PURE__ */ new Date()).toISOString()}`,
				at: (/* @__PURE__ */ new Date()).toISOString(),
				title,
				text: res.detail
			}));
			setNote(res.detail);
		} catch (err) {
			setNote(err instanceof Error ? err.message : msg("ارسال انجام نشد.", "The send did not go through."));
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: tr("اجرای سیگنال", "Execute the signal")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: tr("این تب سفارش را داخل صرافی ثبت نمی‌کند. سبد را کاغذی روی همین دستگاه می‌نویسد و، اگر وب‌هوک یا ربات تلگرام را داده باشید، همان JSON را می‌فرستد. ثبت مستقیم در تب صرافی است.", "This tab does not place an order on the exchange. It writes the basket as paper on this device and, if you provided a webhook or a Telegram bot, sends that same JSON. Direct placement is on the exchange tab.")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("سرمایه فرضی (دلار)", "Paper capital (USD)"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.capitalUsd,
							onChange: (e) => patch({ capitalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("آستانه هشدار امتیاز", "Score alert threshold"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.scoreFloor,
							onChange: (e) => patch({ scoreFloor: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle md:col-span-2",
						children: [tr("وب‌هوک https (تریدینگ‌ویو، ربات شخصی، صرافی)", "https webhook (TradingView, personal bot, exchange)"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							placeholder: "https://",
							value: settings.webhookUrl,
							onChange: (e) => patch({ webhookUrl: e.target.value }),
							dir: "ltr"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("توکن ربات تلگرام", "Telegram bot token"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.telegramToken,
							onChange: (e) => patch({ telegramToken: e.target.value.trim() }),
							dir: "ltr",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("شناسه چت", "Chat id"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.telegramChat,
							onChange: (e) => patch({ telegramChat: e.target.value.trim() }),
							dir: "ltr",
							autoComplete: "off"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-4 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: settings.alertKill,
						onChange: (e) => patch({ alertKill: e.target.checked })
					}), tr("هشدار کلید قطع", "Kill-switch alert")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: settings.alertScore,
						onChange: (e) => patch({ alertScore: e.target.checked })
					}), tr("هشدار افت امتیاز", "Score-drop alert")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-2",
				children: preview.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-md bg-elevated px-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-fg",
						children: [
							row.side,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num",
								children: row.symbol
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num text-muted",
						children: [
							"$",
							formatUsd(row.notionalUsd),
							row.slippageBps != null ? ` · ${row.slippageBps.toFixed(1)} bps` : ""
						]
					})]
				}, row.symbol))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "h-11",
					disabled: busy || preview.length === 0,
					onClick: () => onSend("orders"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), tr("ثبت کاغذی و ارسال سیگنال", "Save paper and send the signal")]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-11",
					disabled: busy,
					onClick: () => onSend("test"),
					children: tr("آزمایش اتصال", "Test connection")
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: tr(note)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "h-11 self-start px-0",
				onClick: () => {
					if (typeof Notification === "undefined") return;
					Notification.requestPermission();
				},
				children: tr("اجازه اعلان مرورگر", "Allow browser notifications")
			}),
			orders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: tr("دفتر کاغذی", "Paper blotter")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-1",
				children: orders.slice(0, 8).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between text-xs text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: [
							row.symbol,
							" $",
							formatUsd(row.notionalUsd)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.status === "sent" ? tr("ارسال شد", "Sent") : row.status === "failed" ? tr("مقصد خطا داد", "Destination failed") : tr("فقط کاغذی", "Paper only") })]
				}, row.id))
			})] }) : null,
			alerts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: tr("هشدارهای اخیر", "Recent alerts")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: alerts.slice(0, 5).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-xs leading-relaxed text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: tr(alert.title)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block",
						children: tr(alert.text)
					})]
				}, alert.id))
			})] }) : null
		]
	});
}
var KEY$2 = "alpha-spot-venues-v1";
var emptyVault = {
	venue: "binance",
	key: "",
	secret: "",
	quote: "USDT",
	tomanPerUsdt: 0,
	notionalUsd: 100
};
function loadVault() {
	if (typeof localStorage === "undefined") return emptyVault;
	try {
		const raw = localStorage.getItem(KEY$2);
		if (!raw) return emptyVault;
		const parsed = JSON.parse(raw);
		const venue = VENUES.includes(parsed.venue) ? parsed.venue : "binance";
		return {
			...emptyVault,
			venue,
			quote: "USDT",
			key: typeof parsed.key === "string" ? parsed.key : "",
			secret: typeof parsed.secret === "string" ? parsed.secret : "",
			notionalUsd: Number(parsed.notionalUsd) || 100,
			tomanPerUsdt: Number(parsed.tomanPerUsdt) || 0
		};
	} catch {
		return emptyVault;
	}
}
function saveVault(next) {
	localStorage.setItem(KEY$2, JSON.stringify(next));
}
var inputClass = "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none";
var VENUE_EN = {
	binance: "Binance",
	bybit: "Bybit"
};
function VenuePanel({ result }) {
	const { tr } = useI18n();
	const call = useServerFn(runVenue);
	const [vault, setVault] = (0, import_react.useState)(() => loadVault());
	const [symbol, setSymbol] = (0, import_react.useState)(result.pick.symbol);
	const [side, setSide] = (0, import_react.useState)("BUY");
	const [confirm, setConfirm] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [res, setRes] = (0, import_react.useState)(null);
	const row = (0, import_react.useMemo)(() => {
		const upper = symbol.trim().toUpperCase();
		return result.top.find((item) => item.symbol === upper) ?? null;
	}, [result.top, symbol]);
	const needsSecret = vault.venue === "binance" || vault.venue === "bybit";
	const buysSuspended = result.spotBuys === "suspended" && side === "BUY";
	function patch(partial) {
		const next = {
			...vault,
			...partial
		};
		setVault(next);
		saveVault(next);
	}
	async function go(action) {
		setBusy(action);
		setRes(null);
		try {
			const data = await call({ data: {
				action,
				venue: vault.venue,
				key: vault.key,
				secret: vault.secret,
				symbol: symbol.trim().toUpperCase(),
				side,
				notionalUsd: vault.notionalUsd,
				priceUsd: row?.priceUsd ?? 0,
				quote: vault.quote,
				tomanPerUsdt: vault.tomanPerUsdt,
				confirm
			} });
			setRes(data);
		} catch (err) {
			setRes({
				ok: false,
				action,
				detail: err instanceof Error ? err.message : msg("درخواست انجام نشد.", "The request did not go through."),
				balances: [],
				orderId: null,
				planned: ""
			});
		} finally {
			setBusy(null);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "flex items-center gap-2 text-base font-medium text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" }), tr("ثبت مستقیم روی صرافی", "Place directly on the exchange")]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: tr("کلید فقط در همین مرورگر می‌ماند و با هر درخواست فرستاده می‌شود؛ در دیتابیس نوشته نمی‌شود و در پاسخ برنمی‌گردد. پیش‌نمایش هیچ سفارشی نمی‌فرستد. ثبت واقعی پول جابه‌جا می‌کند و سقف هر سفارش ۵۰هزار دلار است.", "The key stays in this browser and is sent with each request; it is not written to the database and is not returned in the response. Preview sends no order. A live order moves money, and each order is capped at $50,000.")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: VENUES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ venue: id }),
					className: vault.venue === id ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "h-11 rounded-md px-3 text-sm text-muted hover:text-fg",
					children: tr(VENUE_LABEL[id], VENUE_EN[id])
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("کلید API", "API key"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "off",
							className: inputClass,
							value: vault.key,
							onChange: (e) => patch({ key: e.target.value })
						})]
					}),
					needsSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("کلید مخفی", "Secret key"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "off",
							className: inputClass,
							value: vault.secret,
							onChange: (e) => patch({ secret: e.target.value })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("حجم به دلار", "Size in dollars"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: inputClass,
							value: vault.notionalUsd,
							onChange: (e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}),
					needsSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("حجم به دلار", "Size in dollars"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: inputClass,
							value: vault.notionalUsd,
							onChange: (e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("نماد", "Symbol"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: symbol,
							onChange: (e) => setSymbol(e.target.value.toUpperCase())
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [tr("بازار تسویه", "Settlement market"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							className: inputClass,
							value: "USDT",
							onChange: () => patch({ quote: "USDT" }),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "USDT",
								children: tr("تتر", "Tether")
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [row ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					tr(row.name),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: row.priceUsd.toLocaleString("en-US")
					}),
					" ",
					tr("دلار", "USD"),
					" · ",
					tr("امتیاز", "Score"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: row.score.toFixed(1)
					})
				] }) : tr("این نماد در جدول همین تحلیل نیست؛ قیمت دلار برای تبدیل حجم لازم است.", "This symbol is not in the current analysis table; a dollar price is required to convert size."), buysSuspended ? tr(" کلید قطع بیت‌کوین خرید زنده را بسته است.", " The Bitcoin kill-switch has closed live buys.") : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy !== null,
						onClick: () => go("probe"),
						children: busy === "probe" ? tr("در حال اتصال", "Connecting") : tr("آزمایش موجودی", "Test balances")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy !== null || !row,
						onClick: () => go("preview"),
						children: busy === "preview" ? tr("در حال ساخت", "Building") : tr("پیش‌نمایش سفارش", "Preview order")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSide(side === "BUY" ? "SELL" : "BUY"),
						className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg",
						children: side === "BUY" ? tr("خرید", "Buy") : tr("فروش", "Sell")
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-2 text-xs text-subtle",
				children: [tr("برای ثبت واقعی، نماد را دوباره بنویسید", "To place a live order, type the symbol again"), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: inputClass,
					value: confirm,
					onChange: (e) => setConfirm(e.target.value.toUpperCase()),
					placeholder: symbol.trim().toUpperCase()
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				disabled: busy !== null || !row || buysSuspended || confirm.trim().toUpperCase() !== symbol.trim().toUpperCase(),
				onClick: () => go("place"),
				children: busy === "place" ? tr("در حال ثبت", "Placing") : tr("ثبت سفارش واقعی", "Place live order")
			}),
			res ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: res.ok ? "text-sm text-up" : "text-sm text-down",
						children: tr(res.detail)
					}),
					res.balances.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-1 text-sm text-fg",
						children: res.balances.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "num flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.asset }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.amount })]
						}, `${row.asset}-${row.amount}`))
					}) : null,
					res.planned ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "num mt-3 overflow-x-auto whitespace-pre-wrap text-xs leading-relaxed text-muted",
						children: res.planned
					}) : null
				]
			}) : null
		]
	});
}
var KEY$1 = "alpha-spot-opp-alerts-v1";
var SNAP = "alpha-spot-opp-snap-v1";
function canStore$2() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function snapshotOf(items) {
	return items.filter((row) => row.zone || row.status === "actionable" || row.status === "confirmed").slice(0, 40).map((row) => ({
		symbol: row.symbol,
		name: row.name,
		status: row.status,
		score: row.score,
		zoneLow: row.zone?.low ?? null,
		zoneHigh: row.zone?.high ?? null,
		invalidation: row.zone?.invalidation ?? null,
		priceUsd: row.priceUsd,
		volumeZNote: row.parts.some((part) => part.key === "volume" && part.score <= 30)
	}));
}
function loadOppSnapshot() {
	if (!canStore$2()) return [];
	try {
		const raw = localStorage.getItem(SNAP);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function saveOppSnapshot(items) {
	const next = snapshotOf(items);
	if (canStore$2()) try {
		localStorage.setItem(SNAP, JSON.stringify(next));
	} catch {}
	return next;
}
function loadOppAlerts() {
	if (!canStore$2()) return [];
	try {
		const raw = localStorage.getItem(KEY$1);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed.slice(0, 40) : [];
	} catch {
		return [];
	}
}
function saveOppAlerts(rows) {
	const next = rows.slice(0, 40);
	if (canStore$2()) try {
		localStorage.setItem(KEY$1, JSON.stringify(next));
	} catch {}
	return next;
}
function dayStamp(iso) {
	return iso.slice(0, 10);
}
function zoneTag(low, high) {
	if (low == null || high == null) return "none";
	return `${low.toPrecision(4)}:${high.toPrecision(4)}`;
}
function alertsFromScan(prev, next, at) {
	const before = new Map(prev.map((row) => [row.symbol, row]));
	const out = [];
	const day = dayStamp(at);
	for (const row of next) {
		const old = before.get(row.symbol);
		const tag = zoneTag(row.zone?.low ?? null, row.zone?.high ?? null);
		const push = (kind, title, text) => {
			out.push({
				id: `${row.symbol}:${kind}:${tag}:${day}`,
				at,
				symbol: row.symbol,
				kind,
				title,
				text
			});
		};
		if (row.status === "approaching" && old?.status !== "approaching") push("approaching", msg(`${row.symbol} به محدوده نزدیک شده`, `${row.symbol} has approached the zone`), msg(`${row.summary} نزدیک شدن به‌تنهایی تأیید خرید نیست.`, `${row.summary} Approaching the zone alone is not a buy confirmation.`));
		if ((row.status === "in-zone" || row.status === "confirmed" || row.status === "actionable") && old && old.status !== "in-zone" && old.status !== "confirmed" && old.status !== "actionable") push("entered", msg(`${row.symbol} وارد محدوده شده`, `${row.symbol} has entered the zone`), msg("قیمت به باند رسیده است. تا تأیید RSI یا MACD این یک ورود قطعی نیست.", "Price has reached the band. Until RSI or MACD confirms, this is not a definite entry."));
		if ((row.status === "confirmed" || row.status === "actionable") && old?.status !== "confirmed" && old?.status !== "actionable") push("confirmed", msg(`${row.symbol} شرایط تأیید را گرفته`, `${row.symbol} has met the confirmation conditions`), row.summary);
		if (row.status === "invalidated" && old?.status !== "invalidated") push("invalidated", msg(`سناریوی ${row.symbol} نامعتبر شد`, `The ${row.symbol} scenario was invalidated`), row.summary);
		if (row.parts.some((part) => part.key === "volume" && part.score <= 30) && !old?.volumeZNote) push("shock", msg(`حجم یا فشار غیرعادی در ${row.symbol}`, `Unusual volume or pressure in ${row.symbol}`), row.parts.find((part) => part.key === "volume")?.note ?? msg("حجم از حالت عادی خارج شده است.", "Volume has left its normal range."));
		if (old && Math.abs(row.score - old.score) >= 8) push("score-shift", msg(`امتیاز فرصت ${row.symbol} تغییر کرد`, `The ${row.symbol} opportunity score changed`), msg(`از ${old.score.toFixed(1)} به ${row.score.toFixed(1)}. دلیل را در جزئیات عوامل ببینید، نه در درصد افت قیمت.`, `From ${old.score.toFixed(1)} to ${row.score.toFixed(1)}. See the factor detail, not the percent price drop.`));
	}
	return out;
}
function alertsFromQuotes(snap, quotes, at) {
	const px = new Map(quotes.map((row) => [row.symbol, row.price]));
	const day = dayStamp(at);
	const out = [];
	for (const row of snap) {
		const price = px.get(row.symbol);
		if (price == null || price <= 0 || row.zoneHigh == null || row.zoneLow == null) continue;
		const tag = zoneTag(row.zoneLow, row.zoneHigh);
		const distance = (price - row.zoneHigh) / price;
		if (distance > 0 && distance <= .03) out.push({
			id: `${row.symbol}:approaching:${tag}:${day}`,
			at,
			symbol: row.symbol,
			kind: "approaching",
			title: msg(`${row.symbol} به محدوده نزدیک است`, `${row.symbol} is near the zone`),
			text: msg(`آخرین قیمت ${price} و سقف محدوده ${row.zoneHigh.toPrecision(4)} است. این نزدیکی تأیید خرید نیست.`, `Last price is ${price} and the zone high is ${row.zoneHigh.toPrecision(4)}. This proximity is not a buy confirmation.`)
		});
		else if (price <= row.zoneHigh && price >= row.zoneLow) out.push({
			id: `${row.symbol}:entered:${tag}:${day}`,
			at,
			symbol: row.symbol,
			kind: "entered",
			title: msg(`${row.symbol} داخل محدوده است`, `${row.symbol} is inside the zone`),
			text: msg("قیمت لحظه‌ای وارد باند شده. تأیید هنوز به کندل روزانه، RSI یا MACD نیاز دارد.", "The live price has entered the band. Confirmation still needs a daily close, RSI, or MACD.")
		});
		else if (row.invalidation != null && price < row.invalidation) out.push({
			id: `${row.symbol}:invalidated:${tag}:${day}`,
			at,
			symbol: row.symbol,
			kind: "invalidated",
			title: msg(`هشدار اولیه ابطال ${row.symbol}`, `Early invalidation warning for ${row.symbol}`),
			text: msg("قیمت لحظه‌ای زیر سطح ابطال است. ابطال قطعی فقط با بسته شدن روزانه زیر همین سطح ثبت می‌شود.", "The live price is under the invalidation level. A hard invalidation is recorded only when the daily close finishes under that level.")
		});
	}
	return out;
}
var FILTERS = [
	{
		id: "active",
		label: "فعال"
	},
	{
		id: "now",
		label: "قابل بررسی"
	},
	{
		id: "watch",
		label: "تحت نظر"
	},
	{
		id: "near",
		label: "نزدیک محدوده"
	},
	{
		id: "invalid",
		label: "نامعتبر"
	},
	{
		id: "unconfirmed",
		label: "تأییدنشده"
	},
	{
		id: "all",
		label: "همه"
	}
];
function OpportunityPanel({ board }) {
	const runBt = useServerFn(runOpportunityBacktest);
	const [filter, setFilter] = (0, import_react.useState)("active");
	const [risk, setRisk] = (0, import_react.useState)("all");
	const [liquidOnly, setLiquidOnly] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(null);
	const [alerts, setAlerts] = (0, import_react.useState)([]);
	const [report, setReport] = (0, import_react.useState)(null);
	const [btStatus, setBtStatus] = (0, import_react.useState)("idle");
	const [btError, setBtError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setAlerts(loadOppAlerts());
	}, [board.generatedAt]);
	const rows = (0, import_react.useMemo)(() => {
		const needle = query.trim().toUpperCase();
		return board.items.filter((row) => {
			if (!matchFilter(filter, row.status)) return false;
			if (risk !== "all" && row.risk !== risk) return false;
			if (liquidOnly && row.volume24h < 8e6) return false;
			if (!needle) return true;
			return row.symbol.includes(needle) || row.name.toUpperCase().includes(needle);
		});
	}, [
		board.items,
		filter,
		liquidOnly,
		query,
		risk
	]);
	async function onBacktest() {
		setBtStatus("loading");
		setBtError(null);
		try {
			setReport(await runBt());
			setBtStatus("idle");
		} catch (err) {
			setBtStatus("error");
			setBtError(err instanceof Error ? err.message : "بک‌تست فرصت انجام نشد.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium text-fg",
						children: "فرصت‌های شرطی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm leading-relaxed text-muted",
						children: board.note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							board.scanned,
							" ارز بررسی شد · ",
							board.withData,
							" سری قابل استفاده ·",
							" ",
							board.actionable.length,
							" قابل بررسی · ",
							board.watch.length,
							" در انتظار ·",
							" ",
							board.near.length,
							" نزدیک محدوده"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-2 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pile, {
								title: "الان ارزش بررسی دارد",
								rows: board.actionable
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pile, {
								title: "تحت نظر برای بعد",
								rows: board.watch
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pile, {
								title: "نزدیک محدوده",
								rows: board.near
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-1 overflow-x-auto",
						children: FILTERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFilter(item.id),
							className: filter === item.id ? "h-10 shrink-0 rounded-md bg-elevated px-3 text-sm text-fg" : "h-10 shrink-0 rounded-md px-3 text-sm text-muted",
							children: item.label
						}, item.id))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-2 sm:grid-cols-[1fr_auto_auto]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: query,
								onChange: (event) => setQuery(event.target.value),
								placeholder: "نماد یا نام",
								className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg outline-none"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: risk,
								onChange: (event) => setRisk(event.target.value),
								className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "all",
										children: "هر ریسک"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "low",
										children: "ریسک پایین"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "medium",
										children: "ریسک متوسط"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "high",
										children: "ریسک بالا"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setLiquidOnly((v) => !v),
								className: liquidOnly ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg" : "h-11 rounded-md px-3 text-sm text-muted",
								children: "فقط نقدشونده"
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-4 flex flex-col gap-2",
					children: [rows.slice(0, 30).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-elevated",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setOpen((current) => current === row.symbol ? null : row.symbol),
							className: "flex w-full flex-col gap-2 px-3 py-3 text-right sm:flex-row sm:items-center sm:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-fg",
								children: [
									row.symbol,
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted",
										children: row.name
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-subtle",
								children: [
									row.statusLabel,
									" · ریسک ",
									riskLabel(row.risk),
									" · اطمینان ",
									confidenceLabel(row.confidence)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: formatUsd(row.priceUsd)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: row.distancePct == null ? "—" : formatPct(row.distancePct)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: formatScore(row.score)
									})
								]
							})]
						}), open === row.symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Detail, { row }) : null]
					}, row.symbol)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "px-2 py-6 text-sm text-muted",
						children: "در این فیلتر موردی نیست."
					}) : null]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm text-fg",
							children: "ارزیابی گذشته فرصت‌ها"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: "فقط معامله‌هایی شمرده می‌شوند که بعد از تأیید کندل وارد شده‌اند. کارمزد و لغزش داخل عدد است. این نتیجه تضمین آینده نیست."
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: onBacktest,
							disabled: btStatus === "loading",
							className: "h-11 shrink-0 rounded-md bg-elevated px-4 text-sm text-fg",
							children: btStatus === "loading" ? "در حال ارزیابی" : "بک‌تست فرصت"
						})]
					}),
					btError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-down",
						children: btError
					}) : null,
					report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BacktestReportView, { report }) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm text-fg",
					children: "تاریخچه هشدار فرصت"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 flex flex-col gap-2",
					children: alerts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-xs text-muted",
						children: "هنوز هشدار فرصتی ثبت نشده است."
					}) : alerts.slice(0, 12).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md bg-elevated px-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: alert.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: alert.text
						})]
					}, alert.id))
				})]
			})
		]
	});
}
function matchFilter(filter, status) {
	if (filter === "all") return true;
	if (filter === "active") return status === "actionable" || status === "confirmed" || status === "in-zone" || status === "approaching" || status === "watching";
	if (filter === "now") return status === "actionable" || status === "confirmed";
	if (filter === "watch") return status === "watching";
	if (filter === "near") return status === "approaching" || status === "in-zone";
	if (filter === "invalid") return status === "invalidated" || status === "passed";
	return status === "unconfirmed";
}
function Pile({ title, rows }) {
	const top = rows.slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: title
		}), top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "موردی نیست"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 flex flex-col gap-2",
			children: top.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-fg",
					children: row.symbol
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num text-xs text-muted",
					children: formatScore(row.score)
				})]
			}, row.symbol))
		})]
	});
}
function Detail({ row }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border-t border-border px-3 py-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm leading-relaxed text-muted",
				children: row.summary
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-subtle",
				children: row.confidenceNote
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoneChart, { row })
			}),
			row.zone ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-4 grid gap-2 text-xs sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "محدوده",
						v: `${fmt(row.zone.low)} – ${fmt(row.zone.high)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "ابطال",
						v: fmt(row.zone.invalidation)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "نسبت سود به زیان",
						v: row.rewardRisk == null ? "—" : row.rewardRisk.toFixed(2)
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs text-subtle",
				children: "چرا این محدوده"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted",
				children: row.zone?.reason ?? "محدوده معتبری ساخته نشد."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleList, {
					title: "شرط تأیید",
					rows: row.confirmRules
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RuleList, {
					title: "شرط ابطال",
					rows: row.invalidateRules
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 grid gap-2 md:grid-cols-2",
				children: row.scenarios.map((scene) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-bg px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-fg",
						children: [
							scene.title,
							" · ",
							sceneState(scene.state)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: scene.detail
					})]
				}, scene.key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReasonList, {
					title: "چه چیزی رتبه را بالا برد",
					rows: row.helps,
					empty: "عامل برجسته‌ای بالای ۷۰ نیست."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReasonList, {
					title: "چه چیزی رتبه را پایین آورد",
					rows: row.hurts,
					empty: "عامل ضعیفی زیر ۴۵ نیست."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 flex flex-col gap-3",
				children: row.parts.map((part) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: part.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "num text-xs text-muted",
							children: [
								"وزن ",
								(part.weight * 100).toFixed(0),
								"٪ · ",
								formatScore(part.score)
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 h-1.5 overflow-hidden rounded-full bg-bg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-full rounded-full bg-accent",
							style: { width: `${Math.max(4, part.score)}%` }
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: part.note
					})
				] }, part.key))
			})
		]
	});
}
function ZoneChart({ row }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (row.path.length < 5) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted",
		children: "نمودار کافی نیست."
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-52 rounded-md bg-bg" });
	const data = row.path.map((point) => ({
		t: point.t,
		c: point.c
	}));
	const prices = data.map((point) => point.c);
	const extra = [
		row.zone?.low,
		row.zone?.high,
		row.zone?.invalidation
	].filter((n) => typeof n === "number");
	const min = Math.min(...prices, ...extra);
	const max = Math.max(...prices, ...extra);
	const pad = (max - min) * .08 || max * .02;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-52 w-full",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 12,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "t",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: [min - pad, max + pad],
						width: 48,
						tick: {
							fill: "var(--color-subtle)",
							fontSize: 10
						},
						axisLine: false,
						tickLine: false
					}),
					row.zone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
						y1: row.zone.low,
						y2: row.zone.high,
						fill: "var(--color-warn)",
						fillOpacity: .18
					}) : null,
					row.zone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: row.zone.invalidation,
						stroke: "var(--color-down)",
						strokeDasharray: "4 4"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							background: "var(--color-surface)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							fontSize: 12
						},
						formatter: (value) => [fmt(Number(value)), row.symbol]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "c",
						stroke: "var(--color-accent)",
						fill: "var(--color-accent)",
						fillOpacity: .12
					})
				]
			})
		})
	});
}
function BacktestReportView({ report }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-4 flex flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: report.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [
					report.from,
					" تا ",
					report.to,
					" · ",
					report.symbols,
					" نماد · ",
					report.days,
					" روز · ",
					report.trades,
					" معامله"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "grid gap-2 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "نرخ برد",
						v: report.winRate == null ? "—" : formatPct(report.winRate, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "میانگین R",
						v: report.avgR == null ? "—" : report.avgR.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "بازده فرضی",
						v: report.totalReturn == null ? "—" : formatPct(report.totalReturn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
						k: "بیشترین افت",
						v: report.maxDrawdown == null ? "—" : formatPct(report.maxDrawdown)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs leading-relaxed text-muted",
				children: report.holdout.note
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-2 md:grid-cols-3",
				children: report.baselines.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-elevated p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: row.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted",
						children: [
							row.trades,
							" معامله · برد ",
							row.winRate == null ? "—" : formatPct(row.winRate, 0),
							" · بازده",
							" ",
							row.totalReturn == null ? "—" : formatPct(row.totalReturn)
						]
					})]
				}, row.name))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: report.byRegime.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-xs text-muted",
					children: [
						"رژیم ",
						regimeLabel(row.regime),
						": ",
						row.trades,
						" معامله، برد",
						" ",
						row.winRate == null ? "—" : formatPct(row.winRate, 0)
					]
				}, row.regime))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col gap-1",
				children: report.assumptions.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-xs leading-relaxed text-subtle",
					children: line
				}, line))
			})
		]
	});
}
function RuleList({ title, rows }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-subtle",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-1 flex flex-col gap-1",
		children: rows.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
			className: "text-xs leading-relaxed text-muted",
			children: line
		}, line))
	})] });
}
function ReasonList({ title, rows, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg p-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: title
			}),
			rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted",
				children: empty
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-1 flex flex-col gap-1",
				children: rows.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "text-xs leading-relaxed text-muted",
					children: line
				}, line))
			})
		]
	});
}
function Stat$1({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "num mt-1 text-sm text-fg",
			children: v
		})]
	});
}
function fmt(n) {
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (n >= 1) return n.toFixed(4);
	return n.toPrecision(4);
}
function riskLabel(risk) {
	if (risk === "low") return "پایین";
	if (risk === "high") return "بالا";
	return "متوسط";
}
function confidenceLabel(level) {
	if (level === "high") return "بالا";
	if (level === "medium") return "متوسط";
	if (level === "low") return "پایین";
	return "اعلام‌نشده";
}
function sceneState(state) {
	if (state === "met") return "برقرار";
	if (state === "active") return "در جریان";
	if (state === "failed") return "نقض شده";
	if (state === "waiting") return "منتظر";
	return "موضوعیت ندارد";
}
function regimeLabel(regime) {
	if (regime === "bull") return "صعودی";
	if (regime === "bear") return "نزولی";
	return "خنثی";
}
var readConfluence = createServerFn({ method: "POST" }).validator((input) => {
	const symbol = (input?.symbol ?? "").trim().toUpperCase();
	if (!/^[A-Z0-9]{2,12}$/.test(symbol)) throw new Error("نماد نامعتبر است.");
	return { symbol };
}).handler(createSsrRpc("aeda1b5d2fcb813d1aee768482968dab0e154d7a661f86eb7f4b93b477d24ef1"));
var COINS = [
	"BTC",
	"ETH",
	"SOL",
	"BNB",
	"XRP",
	"TON",
	"DOGE",
	"LINK",
	"AVAX",
	"SUI"
];
var RISK_KEY = "alpha-spot-confluence-v1";
var FLOW_LABEL = {
	institutional: "خرید نهادی",
	absorption: "جذب فروش",
	fake_pump: "پامپ توخالی",
	distribution: "توزیع",
	balanced: "متعادل"
};
var DECISION_LABEL = {
	BUY: "خرید",
	WAIT: "صبر",
	AVOID: "اجتناب"
};
function loadRisk() {
	try {
		const raw = localStorage.getItem(RISK_KEY);
		const n = raw ? Number(JSON.parse(raw).riskPct) : 2;
		return Number.isFinite(n) && n > 0 ? n : 2;
	} catch {
		return 2;
	}
}
function tone(decision) {
	if (decision === "BUY") return "bg-up-dim text-up";
	if (decision === "WAIT") return "bg-warn-dim text-warn";
	return "bg-down-dim text-down";
}
function ConfluencePanel({ defaultSymbol }) {
	const { tr, locale } = useI18n();
	const pct = locale === "en" ? "%" : "٪";
	const load = useServerFn(readConfluence);
	const [symbol, setSymbol] = (0, import_react.useState)(defaultSymbol);
	const [draft, setDraft] = (0, import_react.useState)(defaultSymbol);
	const [report, setReport] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [capital, setCapital] = (0, import_react.useState)(1e4);
	const [riskPct, setRiskPct] = (0, import_react.useState)(2);
	const [stopPct, setStopPct] = (0, import_react.useState)(2.5);
	const [stopLocked, setStopLocked] = (0, import_react.useState)(false);
	const [chartReady, setChartReady] = (0, import_react.useState)(false);
	const [nonce, setNonce] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setCapital(loadDeskSettings().capitalUsd);
		setRiskPct(loadRisk());
		setChartReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
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
					setError(err instanceof Error ? err.message : tr("داده جریان خوانده نشد.", "Flow data could not be read."));
				}
			} finally {
				if (!stop) setBusy(false);
			}
		}
		run();
		return () => {
			stop = true;
		};
	}, [
		symbol,
		load,
		nonce
	]);
	const sized = (0, import_react.useMemo)(() => sizePosition(capital, riskPct / 100, stopPct / 100), [
		capital,
		riskPct,
		stopPct
	]);
	const verdict = report?.judgement;
	const allowed = verdict && verdict.decision !== "AVOID" && verdict.entryPrice != null ? sized.positionUsd : 0;
	const entryText = verdict?.entryPrice != null && verdict.decision !== "AVOID" ? `$${formatUsd(verdict.entryPrice)}` : tr("ندارد", "none");
	const styleText = verdict?.entryStyle === "market" ? tr("بازار، روی قیمت فعلی", "Market, at the current price") : verdict?.entryStyle === "limit_sweep" ? tr("لیمیت زیر خوشه لیکوییدیشن", "Limit below the liquidation cluster") : tr("بدون سفارش", "No order");
	function setCapitalUsd(value) {
		const next = Math.max(0, value);
		setCapital(next);
		saveDeskSettings({
			...loadDeskSettings(),
			capitalUsd: next
		});
	}
	function setRisk(value) {
		const next = Math.min(20, Math.max(0, value));
		setRiskPct(next);
		localStorage.setItem(RISK_KEY, JSON.stringify({ riskPct: next }));
	}
	function applySymbol(raw) {
		const next = raw.trim().toUpperCase();
		if (!/^[A-Z0-9]{2,12}$/.test(next)) {
			setError(tr("نماد را با حروف انگلیسی وارد کنید.", "Enter the symbol in Latin letters."));
			return;
		}
		setError(null);
		setDraft(next);
		setSymbol(next);
	}
	const flow = report?.flow;
	const buyShare = flow && flow.buy24h + flow.sell24h > 0 ? flow.buy24h / (flow.buy24h + flow.sell24h) : .5;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-base font-medium text-fg",
						children: tr("همگرایی خرید اسپات", "Spot buy confluence")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm leading-relaxed text-muted",
						children: [
							tr("جریان حجم، نقشه لیکوییدیشن و اندازه پوزیشن با هم خوانده می‌شوند. خروجی یک جمله است:", "Volume flow, the liquidation map, and position size are read together. The output is one sentence:"),
							" ",
							tr("نقطه ورود و دلاری که فرمول ریسک اجازه می‌دهد.", "The entry, and the dollars the risk formula allows.")
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					onClick: () => setNonce((n) => n + 1),
					disabled: busy,
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: "size-4" }), tr("خواندن دوباره", "Read again")]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex gap-2 overflow-x-auto pb-1",
				children: COINS.map((coin) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => applySymbol(coin),
					className: coin === symbol ? "num h-11 shrink-0 rounded-md bg-elevated px-4 text-sm text-fg" : "num h-11 shrink-0 rounded-md bg-surface px-4 text-sm text-muted",
					children: coin
				}, coin))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					applySymbol(draft);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: draft,
					onChange: (event) => setDraft(event.target.value.toUpperCase()),
					className: "num h-11 min-w-0 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
					dir: "ltr",
					"aria-label": tr("نماد", "Symbol"),
					placeholder: "BTC"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					variant: "outline",
					className: "shrink-0",
					children: tr("نماد", "Symbol")
				})]
			}),
			busy && !report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: tr("کندل اسپات، تیکر خریدار و خوشه‌های لیکوییدیشن خوانده می‌شود.", "Reading the spot candles, taker buy, and liquidation clusters.")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shimmer h-full w-2/3 rounded-full bg-accent/40" })
				})]
			}) : null,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl bg-surface p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-down",
					children: error
				})
			}) : null,
			report && flow && verdict ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-xl p-5 ${tone(verdict.decision)}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-xs tracking-widest",
								children: verdict.decision
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-sm",
								children: report.pair
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-lg font-medium leading-relaxed text-fg",
							children: [
								tr("بهترین نقطه ورود", "Best entry"),
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num",
									children: entryText
								}),
								" | ",
								tr("حجم مجاز خرید", "Allowed buy size"),
								": ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num",
									children: ["$", formatUsd(allowed)]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 text-sm text-fg",
							children: [
								tr(DECISION_LABEL[verdict.decision]),
								" · ",
								styleText,
								report.price ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									" ",
									"· ",
									tr("قیمت", "Price"),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num",
										children: ["$", formatUsd(report.price)]
									})
								] }) : null
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex flex-wrap items-end justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-xs text-subtle",
								children: "۰۱"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-1 text-sm text-fg",
								children: tr("جریان حجم", "Volume flow")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `rounded-md px-3 py-1 text-xs ${flow.label === "fake_pump" || flow.label === "distribution" ? "bg-down-dim text-down" : flow.label === "balanced" ? "bg-elevated text-muted" : "bg-up-dim text-up"}`,
								children: tr(FLOW_LABEL[flow.label])
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: verdict.reasons[0]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex h-3 overflow-hidden rounded-full bg-down",
							dir: "ltr",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-full bg-up",
								style: { width: `${buyShare * 100}%` }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex justify-between text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								tr("خریدار ۲۴س", "24h buyer"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num text-up",
									children: [(buyShare * 100).toFixed(1), pct]
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								tr("فروشنده", "Seller"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num text-down",
									children: [((1 - buyShare) * 100).toFixed(1), pct]
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("خرید ۴س", "4h buy"),
									v: `${(flow.buyRatio4h * 100).toFixed(1)}${pct}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("خرید ۲۴س", "24h buy"),
									v: `${(flow.buyRatio24h * 100).toFixed(1)}${pct}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("بازده ۴س", "4h return"),
									v: `${flow.ret4h >= 0 ? "+" : ""}${(flow.ret4h * 100).toFixed(2)}${pct}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("شتاب حجم", "Volume acceleration"),
									v: flow.volumeAccel.toFixed(2)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-28 w-full",
							dir: "ltr",
							children: chartReady ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
								width: "100%",
								height: "100%",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: flow.points.map((point, index) => ({
										i: index,
										delta: point.delta
									})),
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "i",
											hide: true
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
											cursor: { fill: "var(--color-elevated)" },
											content: ({ active, payload }) => {
												if (!active || !payload?.length) return null;
												const n = Number(payload[0]?.value);
												if (!Number.isFinite(n)) return null;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "glass-pop rounded-lg px-3 py-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-subtle",
														children: tr("دلتای ساعتی", "Hourly delta")
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `num text-sm ${n >= 0 ? "text-up" : "text-down"}`,
														children: n.toFixed(2)
													})]
												});
											}
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "delta",
											radius: 2,
											children: flow.points.map((point) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: point.delta >= 0 ? "var(--color-up)" : "var(--color-down)" }, point.t))
										})
									]
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-full rounded-md bg-elevated" })
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
							className: "flex flex-wrap items-end justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-xs text-subtle",
								children: "۰۲"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
								className: "mt-1 text-sm text-fg",
								children: tr("نقشه لیکوییدیشن", "Liquidation map")
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: report.candleSource === "futures" ? tr("کندل فیوچرز", "Futures candle") : tr("کندل اسپات، فیوچرز در دسترس نبود", "Spot candle; futures were unavailable")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-3 rounded-md px-3 py-3 text-sm leading-relaxed ${verdict.insideWall ? "bg-down-dim text-down" : verdict.sweepZone ? "bg-warn-dim text-warn" : "bg-elevated text-fg"}`,
							children: verdict.alert
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-3 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("فاندینگ ۸س", "8h funding"),
									v: report.funding8h == null ? "—" : `${(report.funding8h * 100).toFixed(4)}${pct}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("سود باز", "Open interest"),
									v: report.openInterestUsd == null ? "—" : `$${formatUsd(report.openInterestUsd)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("لانگ/شورت", "Long/short"),
									v: report.longShortRatio == null ? "—" : report.longShortRatio.toFixed(2)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex max-h-80 flex-col gap-1 overflow-y-auto",
							dir: "ltr",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heatmap, {
								price: report.price,
								bins: report.map.bins
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 grid gap-2 md:grid-cols-2",
							children: report.map.clusters.slice(0, 4).map((cluster) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "rounded-md bg-elevated px-3 py-3 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cluster.side === "long" ? "text-down" : "text-up",
										children: cluster.side === "long" ? tr("لانگ", "Long") : tr("شورت", "Short")
									}),
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num text-fg",
										children: ["$", formatUsd(cluster.price)]
									}),
									" · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num",
										children: [(cluster.distance * 100).toFixed(2), pct]
									}),
									tr(" · حرارت ", " · heat "),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: cluster.heat.toFixed(2)
									})
								]
							}, `${cluster.side}-${cluster.price}`))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-xs text-subtle",
							children: "۰۳"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
							className: "mt-1 text-sm text-fg",
							children: tr("حجم پوزیشن و توصیه", "Position size and guidance")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: tr("حجم ($) = (سرمایه × ریسک٪) / حدضرر٪. حداکثر ضرر همان سرمایه ضربدر ریسک است، مستقل از حدضرر.", "Size ($) = (capital × risk%) / stop%. Max loss is capital times risk, and it does not depend on the stop distance.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid gap-3 md:grid-cols-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("سرمایه ($)", "Capital ($)"),
									value: capital,
									onChange: setCapitalUsd
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("ریسک هر معامله (٪)", "Risk per trade (%)"),
									value: riskPct,
									onChange: setRisk
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: tr("حد ضرر (٪)", "Stop (%)"),
									value: stopPct,
									onChange: (value) => {
										setStopLocked(true);
										setStopPct(Math.min(50, Math.max(0, value)));
									}
								})
							]
						}),
						stopLocked ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "mt-2 text-xs text-muted",
							onClick: () => {
								setStopLocked(false);
								setStopPct(Number((verdict.stopPct * 100).toFixed(2)));
							},
							children: [
								tr("بازگشت حد ضرر به سطح مدل", "Reset the stop to the model level"),
								" (",
								(verdict.stopPct * 100).toFixed(2),
								pct,
								")"
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs text-subtle",
							children: tr("حد ضرر اولیه زیر خوشه لانگ است و بین ۱٫۵٪ تا ۸٪ بسته شده. می‌توانید عوضش کنید.", "The initial stop sits under the long cluster and is clamped between 1.5% and 8%. You can change it.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 grid grid-cols-2 gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("حجم محاسبه‌شده", "Calculated size"),
									v: `$${formatUsd(sized.positionUsd)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("حداکثر ضرر", "Max loss"),
									v: `$${formatUsd(sized.maxLossUsd)}`
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("تعداد تقریبی", "Approximate count"),
									v: verdict.entryPrice && sized.positionUsd > 0 ? (sized.positionUsd / verdict.entryPrice).toPrecision(4) : "—"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
									k: tr("حد ضرر قیمتی", "Stop price"),
									v: verdict.stopPrice ? `$${formatUsd(verdict.stopPrice)}` : "—"
								})
							]
						}),
						verdict.decision === "AVOID" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-down",
							children: tr("توصیه اجتناب است، پس حجم مجاز خرید صفر است. عدد بالا فقط خروجی فرمول است اگر خودتان خلاف سیگنال وارد شوید.", "The call is avoid, so the allowed buy size is zero. The figure above is only the formula, if you enter against the signal.")
						}) : null,
						verdict.decision !== "AVOID" && sized.positionUsd > capital && capital > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-warn",
							children: [
								tr("فرمول", "The formula"),
								" $",
								formatUsd(sized.positionUsd),
								" ",
								tr("را می‌دهد که از سرمایه نقد بزرگ‌تر است. اسپات اهرم ندارد؛ سقف اجرایی", "is larger than cash capital. Spot has no leverage; the tradable cap is"),
								" ",
								"$",
								formatUsd(capital),
								" ",
								tr("است.", "is.")
							]
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-4 flex flex-col gap-2",
							children: verdict.reasons.slice(1).map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
								className: "rounded-md bg-elevated px-3 py-3 text-sm leading-relaxed text-muted",
								children: reason
							}, reason))
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs leading-relaxed text-subtle",
					children: [
						tr("جریان حجم از حجم خرید تیکر کندل اسپات بایننس است؛ همان فشار خرید و فروشی که Volume Flow در Cryptometer نشان می‌دهد.", "Volume flow is Binance spot taker-buy volume — the same buy and sell pressure Cryptometer calls Volume Flow."),
						" ",
						tr("نقشه، خوشه تخمینی است: اهرم ۵ تا ۱۰۰ روی پروفایل حجم، فقط سطوحی که هنوز سویپ نشده‌اند، با وزن فاندینگ و نسبت لانگ/شورت.", "The map is an estimated cluster: 5x to 100x on the volume profile, only levels not yet swept, weighted by funding and the long/short ratio."),
						" ",
						tr("دیوار اختصاصی Coinglass بدون کلید API جایگزین نشده. این توصیه سرمایه‌گذاری نیست.", "A proprietary Coinglass wall is not replaced without an API key. This is not investment advice.")
					]
				})
			] }) : null
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "num mt-1 text-sm text-fg",
			children: v
		})]
	});
}
function Field({ label, value, onChange }) {
	const [text, setText] = (0, import_react.useState)(String(value));
	(0, import_react.useEffect)(() => {
		if (Number(text) !== value) setText(String(value));
	}, [value, text]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-2 text-xs text-subtle",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			inputMode: "decimal",
			className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
			value: text,
			onChange: (event) => {
				const raw = event.target.value;
				setText(raw);
				const n = Number(raw);
				if (raw.trim() !== "" && Number.isFinite(n)) onChange(n);
			}
		})]
	});
}
function Heatmap({ price, bins }) {
	const { tr } = useI18n();
	const rows = [...bins].sort((a, b) => b.price - a.price);
	const near = rows.filter((bin) => Math.abs(bin.price - price) / price < .08 || bin.longHeat > .2 || bin.shortHeat > .2);
	const shown = (near.length >= 8 ? near : rows).slice(0, 28);
	let marked = false;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [shown.map((bin) => {
		const mark = !marked && bin.price <= price;
		if (mark) marked = true;
		const long = Math.round(bin.longHeat * 100);
		const short = Math.round(bin.shortHeat * 100);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [mark ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "my-1 flex items-center gap-2 text-xs text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num",
					children: ["$", formatUsd(price)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-px flex-1 bg-accent" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tr("قیمت", "Price") })
			]
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-[88px_1fr_1fr] items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num text-xs text-subtle",
					children: ["$", formatUsd(bin.price)]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-down",
						style: { width: `${long}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-2 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-up",
						style: { width: `${short}%` }
					})
				})
			]
		})] }, bin.price);
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2 flex justify-between text-xs text-subtle",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-down",
			children: tr("حرارت لانگ، زیر قیمت", "Long heat, below price")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-up",
			children: tr("حرارت شورت، بالای قیمت", "Short heat, above price")
		})]
	})] });
}
var TITLES = {
	day: ["یک روز", "One day"],
	week: ["یک هفته", "One week"],
	month: ["یک ماه", "One month"]
};
function ValidityBoard({ calls, active }) {
	const { tr } = useI18n();
	if (!calls.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-medium text-fg",
			children: tr("اعتبار هر حکم", "How long each call lasts")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-3xl text-xs leading-relaxed text-subtle",
			children: tr("حکم روز فردا می‌تواند عوض شود. حکم هفته و ماه تا پایان ساعت اعتبار سر جایشان می‌مانند، حتی اگر تحلیل لحظه‌ای چیز دیگری بگوید. اگر وقت خرید اسپات نباشد، جواب این است: هیچ ارزی نخر.", "The day call may change tomorrow. The week and month calls stay put until they expire, even if the live tape disagrees. When it is not time to buy spot, the answer is: do not buy any coin.")
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-3 md:grid-cols-3",
			children: calls.map((call) => {
				const on = call.horizon === active;
				const title = TITLES[call.horizon];
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: on ? "rounded-xl bg-elevated p-4 shadow-[var(--shadow-border)]" : "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: tr(title[0], title[1])
							}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-fg",
								children: tr("افق انتخاب‌شده", "Selected horizon")
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-2 text-xl font-medium tracking-tight ${call.kind === "buy" ? "text-up" : "text-warn"}`,
							children: tr(verdictSentence(call.kind))
						}),
						call.kind === "buy" && call.symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num",
								children: call.symbol
							}), call.name ? ` · ${call.name}` : ""]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: tr("نقد بمان. هیچ ارزی نخر.", "Stay in cash. Do not buy any coin.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs leading-relaxed text-muted",
							children: tr(call.reason)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-subtle",
							children: [
								tr("معتبر تا", "Valid until"),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-fg",
									children: formatUntil(call.validUntil)
								}),
								call.held ? tr(" · قفل است", " · locked") : null
							]
						}),
						call.dissent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs leading-relaxed text-warn",
							children: tr(call.dissent)
						}) : null
					]
				}, call.horizon);
			})
		})]
	});
}
var FACTORS = [
	"rs",
	"tokenomics",
	"entry",
	"trend",
	"liquidity",
	"risk",
	"narrative"
];
var runSpotAnalysis = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || !isVenue(String(input.venue ?? ""))) throw new Error("صرافی نامعتبر است.");
	if (input.horizon !== "day" && input.horizon !== "week" && input.horizon !== "month") throw new Error("افق نامعتبر است.");
	const cuts = {};
	if (input.cuts && typeof input.cuts === "object") for (const key of FACTORS) {
		const value = input.cuts[key];
		if (typeof value === "number" && Number.isFinite(value)) cuts[key] = value;
	}
	return {
		venue: input.venue,
		horizon: input.horizon,
		cuts
	};
}).handler(createSsrRpc("2975be20775612443781264b5ca2666618f65f485e3407bef4ba4edec84f952e"));
var DAY = 864e5;
var FACTOR_KEYS = [
	"rs",
	"tokenomics",
	"entry",
	"trend",
	"liquidity",
	"risk",
	"narrative"
];
function netReturn(thenPx, nowPx) {
	if (!(thenPx > 0) || !(nowPx > 0)) return null;
	return nowPx / thenPx * .9985 - 1;
}
function excessVsBtc(row, priceNow, btcNow) {
	const holdingBtc = row.kind === "stay" || row.symbol === "BTC";
	const thenPx = holdingBtc ? row.btcPriceUsd : row.priceUsd;
	const nowPx = holdingBtc ? btcNow : priceNow;
	if (nowPx == null) return null;
	const asset = netReturn(thenPx, nowPx);
	const btc = netReturn(row.btcPriceUsd, btcNow);
	if (asset == null || btc == null) return null;
	return asset - btc;
}
function mean(values) {
	if (!values.length) return null;
	return values.reduce((sum, value) => sum + value, 0) / values.length;
}
function regimeBuckets(rows, priceOf, btcNow, now = Date.now()) {
	return [
		"btc",
		"alt",
		"neutral"
	].map((regime) => {
		const group = rows.filter((row) => row.regime === regime);
		const excess = (days) => {
			const values = [];
			for (const row of group) {
				if (now - Date.parse(row.at) < days * DAY) continue;
				const value = excessVsBtc(row, priceOf(row.symbol), btcNow);
				if (value != null) values.push(value);
			}
			return {
				n: values.length,
				excess: mean(values)
			};
		};
		const d7 = excess(7);
		const d30 = excess(30);
		return {
			regime,
			n7: d7.n,
			excess7: d7.excess,
			n30: d30.n,
			excess30: d30.excess
		};
	});
}
function cloneCuts(cuts) {
	return { ...cuts };
}
/**
* Once a 7-day or 30-day window has matured, compare it with Bitcoin after fees.
* If that window lagged, shrink the weakest factor on the losing names. One step per window.
*/
function settleReport(rows, priceOf, btcNow, cuts, now = Date.now()) {
	const nextRows = rows.map((row) => ({
		...row,
		factors: row.factors.map((factor) => ({ ...factor }))
	}));
	const nextCuts = cloneCuts(cuts);
	let lagged = false;
	let weak = null;
	const applyWindow = (days, flag) => {
		const judged = nextRows.filter((row) => !row[flag] && now - Date.parse(row.at) >= days * DAY).map((row) => ({
			row,
			excess: excessVsBtc(row, priceOf(row.symbol), btcNow)
		})).filter((item) => item.excess != null);
		if (!judged.length) return;
		for (const item of judged) item.row[flag] = true;
		if ((mean(judged.map((item) => item.excess)) ?? 0) >= 0) return;
		lagged = true;
		const losers = judged.filter((item) => item.excess < 0 && item.row.kind !== "stay" && item.row.symbol !== "BTC");
		if (!losers.length) return;
		let worst = Infinity;
		let found = null;
		for (const key of FACTOR_KEYS) {
			const scores = losers.flatMap((item) => item.row.factors.filter((factor) => factor.key === key).map((factor) => factor.score));
			if (!scores.length) continue;
			const score = mean(scores) ?? 100;
			if (score < worst) {
				worst = score;
				found = key;
			}
		}
		if (!found) return;
		weak = found;
		const prev = nextCuts[found] ?? 1;
		nextCuts[found] = Math.max(.7, prev * .9);
	};
	applyWindow(7, "applied7");
	applyWindow(30, "applied30");
	return {
		rows: nextRows,
		cuts: nextCuts,
		lagged,
		weak
	};
}
var SUGGEST_KEY = "alpha-spot-suggestions-v1";
var CUT_KEY = "alpha-spot-weight-cuts-v1";
function canStore$1() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadSuggestions() {
	if (!canStore$1()) return [];
	try {
		const raw = localStorage.getItem(SUGGEST_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function saveSuggestions(rows) {
	if (!canStore$1()) return;
	try {
		localStorage.setItem(SUGGEST_KEY, JSON.stringify(rows.slice(0, 80)));
	} catch {}
}
function loadCuts() {
	if (!canStore$1()) return {};
	try {
		const raw = localStorage.getItem(CUT_KEY);
		if (!raw) return {};
		const parsed = JSON.parse(raw);
		return parsed && typeof parsed === "object" ? parsed : {};
	} catch {
		return {};
	}
}
function saveCuts(cuts) {
	if (!canStore$1()) return;
	try {
		localStorage.setItem(CUT_KEY, JSON.stringify(cuts));
	} catch {}
}
function rememberSuggestion(rows, row) {
	if (rows.some((item) => item.id === row.id)) return rows;
	return [row, ...rows].slice(0, 80);
}
var KEY = "alpha-spot-history-v2";
var WATCH_KEY = "alpha-spot-watch-v1";
var MAX = 12;
function canStore() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadHistory() {
	if (!canStore()) return [];
	try {
		const raw = localStorage.getItem(KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		return parsed.slice(0, MAX);
	} catch {
		return [];
	}
}
function saveRun(result) {
	const row = {
		at: result.generatedAt,
		pick: result.pick.symbol,
		name: result.pick.name,
		score: result.pick.score,
		regime: result.regime,
		dominance: result.btcDominance,
		rs7d: result.pick.rs7d,
		runnerUp: result.runnerUp?.symbol ?? null,
		killStatus: result.killSwitch.status
	};
	const next = [row, ...loadHistory().filter((r) => r.at !== row.at)].slice(0, MAX);
	if (canStore()) try {
		localStorage.setItem(KEY, JSON.stringify(next));
	} catch {}
	return next;
}
function loadWatch() {
	if (!canStore()) return [];
	try {
		const raw = localStorage.getItem(WATCH_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
function toggleWatch(symbol) {
	const current = loadWatch();
	const next = current.includes(symbol) ? current.filter((s) => s !== symbol) : [...current, symbol];
	if (canStore()) try {
		localStorage.setItem(WATCH_KEY, JSON.stringify(next));
	} catch {}
	return next;
}
function Home() {
	const { tr, locale } = useI18n();
	const run = useServerFn(runSpotAnalysis);
	const pulse = useServerFn(checkDeskPulse);
	const quotes = useServerFn(checkOpportunityQuotes);
	const sendAlert = useServerFn(dispatchDeskSignal);
	const macro = useServerFn(loadMacroDesk);
	const [news, setNews] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [stage, setStage] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("pick");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [watched, setWatched] = (0, import_react.useState)([]);
	const [flash, setFlash] = (0, import_react.useState)(null);
	const [live, setLive] = (0, import_react.useState)({});
	const [sync, setSync] = (0, import_react.useState)("connecting");
	const [lens, setLens] = (0, import_react.useState)("all");
	const [flowOnly, setFlowOnly] = (0, import_react.useState)(false);
	const [ready, setReady] = (0, import_react.useState)(false);
	const [prefs, setPrefs] = (0, import_react.useState)(null);
	const [report, setReport] = (0, import_react.useState)(null);
	const booted = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let stop = false;
		macro().then((data) => {
			if (!stop) setNews(data);
		}).catch(() => {
			if (!stop) setNews({
				items: [],
				source: "CoinDesk · Cointelegraph · Decrypt",
				note: msg("فید اخبار کریپتو الان جواب نداد.", "The crypto news feed did not answer.")
			});
		});
		return () => {
			stop = true;
		};
	}, [macro]);
	const stages = [
		tr("گرفتن رتبه، عرضه و حجم صد ارز برتر", "Fetching rank, supply, and volume for the top 100"),
		tr("ساخت جفت بیت‌کوین، EMA ۲۰۰ و ساختار هفتگی", "Building the Bitcoin pair, the 200 EMA, and weekly structure"),
		tr("محدوده حمایت، تأیید و ابطال برای فهرست انتظار", "Support, confirmation, and invalidation for the watchlist"),
		tr("کلید قطع بیت‌کوین، آنلاک، دفتر سفارش، سود باز و فاندینگ", "Bitcoin kill-switch, unlocks, order book, open interest, and funding"),
		tr("امتیاز، تعلیق سیگنال و پرتفوی", "Score, signal suspension, and the portfolio")
	];
	(0, import_react.useEffect)(() => {
		setHistory(loadHistory());
		setWatched(loadWatch());
		const saved = loadPrefs();
		setPrefs(saved);
		setReady(true);
		if (saved && !booted.current) {
			booted.current = true;
			onAnalyze(saved);
		}
	}, []);
	const quoteSymbols = (0, import_react.useMemo)(() => {
		const base = [
			"BTC",
			"ETH",
			"SOL",
			"BNB",
			"XRP",
			"TON",
			"LINK",
			"AVAX",
			"SUI",
			"NEAR"
		];
		if (!result) return base;
		return [.../* @__PURE__ */ new Set([
			result.pick.symbol,
			...result.top.slice(0, 24).map((row) => row.symbol),
			...base
		])];
	}, [result]);
	(0, import_react.useEffect)(() => {
		let stop = false;
		async function tick() {
			try {
				const rows = await quotes({ data: { symbols: quoteSymbols } });
				if (stop) return;
				if (!rows.length) {
					setSync((prev) => prev === "live" ? "delayed" : prev === "connecting" ? "delayed" : prev);
					return;
				}
				setLive((prev) => {
					const next = { ...prev };
					for (const row of rows) next[row.symbol] = row.price;
					return next;
				});
				setSync("live");
			} catch {
				if (!stop) setSync("delayed");
			}
		}
		tick();
		const id = window.setInterval(tick, 12e3);
		return () => {
			stop = true;
			window.clearInterval(id);
		};
	}, [quoteSymbols, quotes]);
	(0, import_react.useEffect)(() => {
		if (!result) return;
		const settings = loadDeskSettings();
		const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
		const jobs = [];
		if (settings.alertKill && result.killSwitch.status !== "NORMAL") jobs.push({
			id: `kill:${result.killSwitch.status}:${day}`,
			title: result.killSwitch.headline,
			text: result.killSwitch.note
		});
		if (settings.alertScore && result.pick.score < settings.scoreFloor) jobs.push({
			id: `score:${result.pick.symbol}:${day}`,
			title: msg(`امتیاز ${result.pick.symbol} زیر ${settings.scoreFloor}`, `${result.pick.symbol} score is under ${settings.scoreFloor}`),
			text: msg(`امتیاز فعلی ${result.pick.score.toFixed(1)} است.`, `Current score is ${result.pick.score.toFixed(1)}.`)
		});
		for (const symbol of watched) {
			const row = result.top.find((item) => item.symbol === symbol);
			if (row && row.score < settings.scoreFloor) jobs.push({
				id: `watch:${symbol}:${day}`,
				title: msg(`${symbol} در دیده‌بان زیر آستانه است`, `${symbol} on the watchlist is under the floor`),
				text: msg(`امتیاز ${row.score.toFixed(1)}.`, `Score ${row.score.toFixed(1)}.`)
			});
		}
		let cancelled = false;
		(async () => {
			for (const job of jobs) {
				if (cancelled || hasSeen(job.id)) continue;
				markSeen(job.id);
				pushAlert({
					id: job.id,
					at: (/* @__PURE__ */ new Date()).toISOString(),
					title: job.title,
					text: job.text
				});
				if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(tr(job.title), { body: tr(job.text) });
				if (settings.webhookUrl || settings.telegramToken) try {
					await sendAlert({ data: {
						title: plain(job.title),
						text: plain(job.text),
						kind: "alert",
						orders: [],
						webhookUrl: settings.webhookUrl,
						telegramToken: settings.telegramToken,
						telegramChat: settings.telegramChat
					} });
				} catch {}
				if (!cancelled) setFlash(job.title);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [
		result,
		sendAlert,
		watched
	]);
	(0, import_react.useEffect)(() => {
		if (!result?.opportunities) return;
		const fresh = alertsFromScan(loadOppSnapshot(), result.opportunities.items, result.generatedAt);
		saveOppSnapshot(result.opportunities.items);
		if (fresh.length === 0) return;
		let cancelled = false;
		(async () => {
			const settings = loadDeskSettings();
			let stored = loadOppAlerts();
			for (const alert of fresh) {
				if (cancelled || hasSeen(alert.id)) continue;
				markSeen(alert.id);
				stored = [alert, ...stored.filter((row) => row.id !== alert.id)].slice(0, 40);
				pushAlert({
					id: alert.id,
					at: alert.at,
					title: alert.title,
					text: alert.text
				});
				if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(tr(alert.title), { body: tr(alert.text) });
				if (settings.webhookUrl || settings.telegramToken) try {
					await sendAlert({ data: {
						title: plain(alert.title),
						text: plain(alert.text),
						kind: "alert",
						orders: [],
						webhookUrl: settings.webhookUrl,
						telegramToken: settings.telegramToken,
						telegramChat: settings.telegramChat
					} });
				} catch {}
				if (!cancelled) setFlash(alert.title);
			}
			if (!cancelled) saveOppAlerts(stored);
		})();
		return () => {
			cancelled = true;
		};
	}, [result, sendAlert]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			(async () => {
				const settings = loadDeskSettings();
				if (!settings.alertKill) return;
				try {
					const beat = await pulse();
					if (beat.status === "NORMAL") return;
					const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
					const key = `pulse:${beat.status}:${day}`;
					if (hasSeen(key)) return;
					markSeen(key);
					pushAlert({
						id: key,
						at: beat.at,
						title: beat.headline,
						text: beat.note
					});
					if (settings.webhookUrl || settings.telegramToken) await sendAlert({ data: {
						title: plain(beat.headline),
						text: plain(beat.note),
						kind: "alert",
						orders: [],
						webhookUrl: settings.webhookUrl,
						telegramToken: settings.telegramToken,
						telegramChat: settings.telegramChat
					} });
					setFlash(beat.headline);
				} catch {}
			})();
		}, 18e4);
		return () => window.clearInterval(id);
	}, [pulse, sendAlert]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			(async () => {
				const snap = loadOppSnapshot();
				if (snap.length === 0) return;
				try {
					const found = alertsFromQuotes(snap, await quotes({ data: { symbols: snap.map((row) => row.symbol) } }), (/* @__PURE__ */ new Date()).toISOString());
					const settings = loadDeskSettings();
					let stored = loadOppAlerts();
					for (const alert of found) {
						if (hasSeen(alert.id)) continue;
						markSeen(alert.id);
						stored = [alert, ...stored.filter((row) => row.id !== alert.id)].slice(0, 40);
						pushAlert({
							id: alert.id,
							at: alert.at,
							title: alert.title,
							text: alert.text
						});
						if (settings.webhookUrl || settings.telegramToken) await sendAlert({ data: {
							title: plain(alert.title),
							text: plain(alert.text),
							kind: "alert",
							orders: [],
							webhookUrl: settings.webhookUrl,
							telegramToken: settings.telegramToken,
							telegramChat: settings.telegramChat
						} });
						setFlash(alert.title);
					}
					saveOppAlerts(stored);
				} catch {}
			})();
		}, 18e4);
		return () => window.clearInterval(id);
	}, [quotes, sendAlert]);
	async function settleStored() {
		const rows = loadSuggestions();
		let cuts = loadCuts();
		const day = 864e5;
		const now = Date.now();
		if (!rows.some((row) => {
			const age = now - Date.parse(row.at);
			return !row.applied7 && age >= 7 * day || !row.applied30 && age >= 30 * day;
		})) return cuts;
		try {
			const symbols = [.../* @__PURE__ */ new Set([...rows.map((row) => row.symbol), "BTC"])].slice(0, 40);
			const liveRows = await quotes({ data: { symbols } });
			const priceOf = (symbol) => liveRows.find((row) => row.symbol === symbol)?.price ?? null;
			const btcNow = priceOf("BTC");
			if (btcNow == null) return cuts;
			const settled = settleReport(rows, priceOf, btcNow, cuts);
			saveSuggestions(settled.rows);
			saveCuts(settled.cuts);
			cuts = settled.cuts;
		} catch {}
		return cuts;
	}
	function rememberAndSnapshot(data) {
		const priceOf = (sym) => {
			if (sym === "BTC") return data.btcPriceUsd;
			return data.top.find((item) => item.symbol === sym)?.priceUsd ?? null;
		};
		if (data.verdict.kind !== "buy" || !data.verdict.symbol) {
			const settled = settleReport(loadSuggestions(), priceOf, data.btcPriceUsd, loadCuts());
			saveSuggestions(settled.rows);
			saveCuts(settled.cuts);
			return {
				rows: settled.rows,
				buckets: regimeBuckets(settled.rows, priceOf, data.btcPriceUsd),
				cuts: settled.cuts,
				lagged: settled.lagged,
				weak: settled.weak
			};
		}
		const verdict = data.verdict;
		const row = data.top.find((item) => item.symbol === verdict.symbol) ?? data.pick;
		const symbol = verdict.symbol ?? row.symbol;
		const stored = {
			id: `${data.generatedAt}:${verdict.kind}:${symbol}`,
			at: data.generatedAt,
			symbol,
			name: verdict.name ?? row.name ?? symbol,
			priceUsd: verdict.priceUsd ?? row.priceUsd,
			btcPriceUsd: data.btcPriceUsd,
			kind: "buy",
			regime: data.regime,
			factors: row.factors.map((factor) => ({
				key: factor.key,
				score: factor.score
			})),
			applied7: false,
			applied30: false
		};
		const saved = rememberSuggestion(loadSuggestions(), stored);
		saveSuggestions(saved);
		const cuts = loadCuts();
		const settled = settleReport(saved, priceOf, data.btcPriceUsd, cuts);
		saveSuggestions(settled.rows);
		saveCuts(settled.cuts);
		return {
			rows: settled.rows,
			buckets: regimeBuckets(settled.rows, priceOf, data.btcPriceUsd),
			cuts: settled.cuts,
			lagged: settled.lagged,
			weak: settled.weak
		};
	}
	async function onAnalyze(current) {
		const desk = current ?? prefs;
		if (!desk) return;
		setStatus("loading");
		setError(null);
		setStage(0);
		setTab("pick");
		setFlowOnly(false);
		const timer = window.setInterval(() => {
			setStage((s) => Math.min(s + 1, stages.length - 1));
		}, 1100);
		try {
			const cuts = await settleStored();
			const data = sealAnalysis(await run({ data: {
				venue: desk.venue,
				horizon: desk.horizon,
				cuts
			} }), desk.venue);
			setResult(data);
			setHistory(saveRun(data));
			setReport(rememberAndSnapshot(data));
			setStatus("done");
		} catch (err) {
			setStatus("error");
			setError(err instanceof Error ? err.message : msg("تحلیل انجام نشد. دوباره تلاش کنید.", "The analysis did not finish. Try again."));
		} finally {
			window.clearInterval(timer);
		}
	}
	function commitPrefs(next) {
		savePrefs(next);
		setPrefs(next);
		booted.current = true;
		onAnalyze(next);
	}
	const headerMeta = (0, import_react.useMemo)(() => {
		if (!result) return null;
		const cacheFa = result.dataCache === "live" ? "داده زنده" : result.dataCache === "memory" ? "از حافظه" : "از کش ذخیره‌شده";
		const cacheEn = result.dataCache === "live" ? "live data" : result.dataCache === "memory" ? "from memory" : "from stored cache";
		return tr(`${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل · ${cacheFa} · کش سرور ${result.cacheKlines ?? 0} کندل`, `${result.universeSize} of the top 100 — stables and wrapped assets removed · ${result.klinesOk} complete candles · ${cacheEn} · server cache ${result.cacheKlines ?? 0} candles`);
	}, [
		result,
		tr,
		locale
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "desk-grid min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num tracking-widest",
									children: "ALPHA SPOT"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitch, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GithubStar, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveBadge, { state: sync })
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-3xl",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
										className: "text-4xl font-medium tracking-tight text-fg md:text-5xl",
										children: result ? tr(verdictSentence(result.verdict.kind)) : tr("آلفا اسپات", "Alpha Spot")
									}),
									result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-3 flex flex-col gap-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-base leading-relaxed text-muted",
												children: tr(result.verdict.reason)
											}),
											result.verdict.symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-sm text-fg",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "num",
														children: result.verdict.symbol
													}),
													result.verdict.name ? ` · ${result.verdict.name}` : "",
													result.verdict.priceUsd != null ? ` · $${formatUsd(result.verdict.priceUsd)}` : ""
												]
											}) : null,
											result.verdict.kind === "wait" && result.verdict.reachUsd != null && result.verdict.invalidationUsd != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xs text-subtle",
												children: [
													tr("رسیدن", "Reach"),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "num text-fg",
														children: ["$", formatUsd(result.verdict.reachUsd)]
													}),
													" · ",
													tr("ابطال", "Invalidation"),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "num text-fg",
														children: ["$", formatUsd(result.verdict.invalidationUsd)]
													})
												]
											}) : null
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-base leading-relaxed text-muted",
										children: tr("سه حکم جدا: یک روز، یک هفته، یک ماه. حکم هفته و ماه تا پایان اعتبار عوض نمی‌شود. اگر وقت خرید اسپات نباشد، جواب این است که هیچ ارزی نخری.", "Three separate calls: one day, one week, one month. The week and month calls do not change before they expire. If it is not time to buy spot, the answer is to buy no coin.")
									}),
									prefs ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 text-xs text-subtle",
										children: [
											tr(VENUE_LABEL[prefs.venue]),
											" · ",
											prefs.horizon === "day" ? tr("یک روز", "One day") : prefs.horizon === "week" ? tr("یک هفته", "One week") : tr("یک ماه", "One month"),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "ms-3 text-fg",
												onClick: () => {
													setPrefs(null);
													setStatus("idle");
													setFlowOnly(false);
												},
												children: tr("تغییر صرافی یا افق", "Change exchange or horizon")
											})
										]
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex shrink-0 flex-col gap-2 sm:flex-row",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										asChild: true,
										className: "h-12 min-w-44",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/spot/$assetId",
											params: { assetId: "btc" },
											children: tr("میز بیت‌کوین · ۱۰۰ ارز", "Bitcoin desk · top 100")
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										variant: "outline",
										onClick: () => {
											setFlowOnly(true);
											setTab("flow");
											setStatus((prev) => prev === "done" ? prev : "idle");
										},
										className: "h-12 min-w-44",
										children: tr("همگرایی حجم", "Volume confluence")
									}),
									prefs ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "lg",
										onClick: () => void onAnalyze(prefs),
										disabled: status === "loading",
										className: "h-12 min-w-52",
										children: status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), tr("در حال تحلیل", "Analyzing")] }) : result ? tr("تحلیل دوباره", "Run again") : tr("تحلیل ۱۰۰ ارز برتر", "Rank the top 100")
									}) : null
								]
							})]
						}),
						headerMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: headerMeta
						}) : null,
						flash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-warn",
							children: tr(flash)
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRail, { news }),
				status === "idle" && flowOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFlowOnly(false),
						className: "self-start text-sm text-muted",
						children: tr("بازگشت به معرفی میز", "Back to the desk intro")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfluencePanel, { defaultSymbol: "BTC" })]
				}) : null,
				ready && !prefs && status !== "loading" && !flowOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PrefsGate, { onSave: commitPrefs }) : null,
				status !== "done" && status !== "loading" && !flowOnly ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskCompare, {}) : null,
				status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: stages[stage]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shimmer h-full w-2/3 rounded-full bg-accent/40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: tr("کندل ۲۰۰ روزه برای EMA و ساختار هفتگی گرفته می‌شود؛ کمی بیشتر از قبل طول می‌کشد.", "200 daily candles are pulled for the EMA and weekly structure, so this takes a little longer.")
						})
					]
				}) : null,
				status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: tr("تحلیل کامل نشد", "The analysis did not finish")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: error ? tr(error) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => void onAnalyze(prefs ?? void 0),
							children: tr("تلاش دوباره", "Try again")
						})
					]
				}) : null,
				status === "done" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ValidityBoard, {
						calls: result.calls ?? [],
						active: result.horizon
					}),
					report && tab !== "method" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
						rows: report.rows,
						buckets: report.buckets,
						cuts: report.cuts,
						lagged: report.lagged,
						weak: report.weak
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KillSwitchBanner, { kill: result.killSwitch }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertStrip, {
						rows: result.top,
						kill: result.killSwitch
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickFilters, {
						value: lens,
						onChange: (next) => {
							setLens(next);
							setTab("table");
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer px-5 py-4 text-sm text-fg",
							children: tr("فرق میز بیت‌کوین با بقیه بخش‌ها", "How the Bitcoin desk differs from the rest")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "px-2 pb-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeskCompare, { here: "home" })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymbolTape, {
						rows: result.top,
						picked: result.verdict.kind === "buy" ? result.verdict.symbol ?? "" : "",
						live
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]",
						children: [
							["pick", tr("انتخاب", "Pick")],
							["macro", tr("کلان", "Macro")],
							["flow", tr("همگرایی", "Confluence")],
							["opportunity", tr("فرصت‌ها", "Setups")],
							["table", tr("رتبه‌ها", "Ranks")],
							["unlocks", tr("آنلاک", "Unlocks")],
							["portfolio", tr("پرتفوی", "Portfolio")],
							["monitor", tr("پایش سبد", "Book watch")],
							["backtest", tr("بک‌تست", "Backtest")],
							["depth", tr("عمق", "Depth")],
							["execute", tr("وب‌هوک", "Webhook")],
							["venue", tr("صرافی", "Venue")],
							["method", tr("روش", "Method")],
							["history", tr("سابقه", "History")]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab(id),
							className: tab === id ? "h-11 min-w-20 flex-1 rounded-md bg-elevated px-3 text-sm text-fg" : "h-11 min-w-20 flex-1 rounded-md px-3 text-sm text-muted hover:text-fg",
							children: label
						}, id))
					}),
					tab === "pick" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickPanel, {
						result,
						live
					}) : null,
					tab === "macro" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MacroRail, {
						news,
						mode: "full"
					}) : null,
					tab === "flow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ConfluencePanel, { defaultSymbol: result.pick.symbol }, result.pick.symbol) : null,
					tab === "opportunity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityPanel, { board: result.opportunities }) : null,
					tab === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
						rows: applyDeskFilter(result.top, lens),
						picked: result.verdict.kind === "buy" ? result.verdict.symbol ?? result.pick.symbol : "",
						watched,
						onToggleWatch: (symbol) => setWatched(toggleWatch(symbol)),
						live,
						filter: lens
					}) : null,
					tab === "unlocks" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UnlocksPanel, {
						rows: result.top,
						source: result.unlockSource,
						matched: result.unlockMatched
					}) : null,
					tab === "portfolio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioPanel, { result }) : null,
					tab === "monitor" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonitorPanel, { result }) : null,
					tab === "backtest" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BacktestPanel, {}) : null,
					tab === "depth" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepthPanel, { books: result.books }) : null,
					tab === "execute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExecutePanel, { result }) : null,
					tab === "venue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VenuePanel, { result }) : null,
					tab === "method" && report ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid items-start gap-6 lg:grid-cols-[1.15fr_0.85fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Methodology, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportCard, {
							rows: report.rows,
							buckets: report.buckets,
							cuts: report.cuts,
							lagged: report.lagged,
							weak: report.weak
						})]
					}) : null,
					tab === "method" && !report ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Methodology, {}) : null,
					tab === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryPanel, { runs: history }) : null
				] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t border-border pt-4 text-xs leading-relaxed text-subtle",
					children: tr("آلفا اسپات توصیه سرمایه‌گذاری نیست. مدل روی دادهٔ عمومی بازار کار می‌کند و می‌تواند اشتباه کند. مسئولیت معامله با شماست.", "Alpha Spot is not investment advice. The model reads public market data and can be wrong. The trade is yours.")
				})
			]
		})
	});
}
function SymbolTape({ rows, picked, live }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-subtle",
		children: tr("ده ارز اول مدل، هر کدام با نماد", "The model’s top ten, each with its ticker")
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 flex gap-2 overflow-x-auto pb-1",
		children: rows.slice(0, 10).map((row, i) => {
			const on = row.symbol === picked;
			const price = live[row.symbol] ?? row.priceUsd;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: on ? "min-w-48 shrink-0 rounded-lg bg-elevated px-3 py-3" : "min-w-48 shrink-0 rounded-lg bg-surface px-3 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-2 flex items-center justify-between text-xs text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: i + 1
						}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-fg",
							children: tr("انتخاب", "Pick")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tr("رتبه", "Rank") })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
						symbol: row.symbol,
						name: row.name,
						size: "sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlashValue, {
							id: `tape:${row.symbol}`,
							value: price,
							format: (n) => `$${formatUsd(n)}`,
							className: "text-sm text-fg"
						})
					})
				]
			}, row.id);
		})
	})] });
}
//#endregion
export { Home as component };
