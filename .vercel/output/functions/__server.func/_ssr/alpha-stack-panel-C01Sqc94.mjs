import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { G as isRedirect, S as require_jsx_runtime, b as Link, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { i as msg, n as getLocale } from "./lex-BMsOT1Y7.mjs";
import { n as normalizeSymbol, t as formatPx } from "./ta-CFwhxRm-.mjs";
import { u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as useI18n } from "./router-C71NXCbe.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alpha-stack-panel-C01Sqc94.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var BOX = {
	sm: "size-8",
	md: "size-10",
	lg: "size-14"
};
function CoinMark({ symbol, name, rank, size = "md" }) {
	const { tr } = useI18n();
	const [stage, setStage] = (0, import_react.useState)(0);
	const ticker = symbol.toLowerCase();
	const src = stage === 0 ? `https://assets.coincap.io/assets/icons/${ticker}@2x.png` : stage === 1 ? `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@0.18.1/32/color/${ticker}.png` : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-0 items-center gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: `grid ${BOX[size]} shrink-0 place-items-center overflow-hidden rounded-full bg-elevated shadow-[var(--shadow-border)]`,
			children: src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: "",
				width: 56,
				height: 56,
				className: "size-full object-cover",
				onError: () => setStage((current) => current === 0 ? 1 : 2)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "num text-xs text-fg",
				children: symbol.slice(0, 3)
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: size === "lg" ? "truncate text-3xl font-medium tracking-tight text-fg md:text-4xl" : "truncate text-sm text-fg",
					children: tr(name)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num inline-flex h-6 shrink-0 items-center rounded-sm bg-fg px-1.5 text-xs font-medium text-bg",
					children: symbol
				})]
			}), rank != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-subtle",
				children: [
					tr("رتبه بازار", "Market rank"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: ["#", rank]
					})
				]
			}) : null]
		})]
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function unit() {
	return getLocale() === "en" ? "%" : "٪";
}
function formatUsd(n) {
	if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (n >= 1) return n.toFixed(4);
	return n.toPrecision(4);
}
function formatPct(ratio, digits = 1) {
	const v = ratio * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(digits)}${unit()}`;
}
function formatPctPoints(pctPoints, digits = 1) {
	return `${pctPoints > 0 ? "+" : ""}${pctPoints.toFixed(digits)}${unit()}`;
}
function formatScore(n) {
	return n.toFixed(1);
}
function formatUntil(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleString(getLocale() === "en" ? "en-GB" : "fa-IR", {
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: "Asia/Tehran"
	});
}
function timeAgoFa(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleString(getLocale() === "en" ? "en-US" : "fa-IR", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[opacity,transform,background-color,box-shadow] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg shadow-[var(--shadow-border)] hover:opacity-90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-elevated hover:shadow-[var(--shadow-border-hover)]",
			ghost: "text-muted hover:bg-elevated hover:text-fg"
		},
		size: {
			default: "h-11 px-4",
			lg: "h-12 px-6 text-base",
			sm: "h-9 px-3 text-xs"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		ref,
		...props
	});
});
Button.displayName = "Button";
function LocaleSwitch() {
	const { locale, setLocale, tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "inline-flex h-11 items-center rounded-full bg-surface p-1 shadow-[var(--shadow-border)]",
		role: "group",
		"aria-label": tr("زبان", "Language"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLocale("fa"),
			"aria-pressed": locale === "fa",
			className: locale === "fa" ? "h-9 rounded-full bg-elevated px-3 text-xs text-fg" : "h-9 rounded-full px-3 text-xs text-muted hover:text-fg",
			children: "فا"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => setLocale("en"),
			"aria-pressed": locale === "en",
			className: locale === "en" ? "num h-9 rounded-full bg-elevated px-3 text-xs text-fg" : "num h-9 rounded-full px-3 text-xs text-muted hover:text-fg",
			children: "EN"
		})]
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var ROWS = [
	{
		qFa: "سؤال",
		qEn: "Question",
		btcFa: "برای این ارز، امروز، این هفته یا این ماه بخرم، یا هیچ ارزی نخرم؟",
		btcEn: "For this coin, do I buy today, this week, or this month — or buy nothing?",
		otherFa: "اگر فقط یک نام در برابر بیت‌کوین بردارم، کدام است؟",
		otherEn: "If I take one name against Bitcoin, which one is it?"
	},
	{
		qFa: "خروجی",
		qEn: "Output",
		btcFa: "تا صد ارز. هر کدام سه حکم جدا: یک روز، یک هفته، یک ماه.",
		btcEn: "Up to one hundred coins. Each one gets three separate calls: a day, a week, a month.",
		otherFa: "یک برنده. اگر آلت‌ها ضعیف باشند، خود بیت‌کوین برنده است.",
		otherEn: "One winner. If the alts are weak, Bitcoin itself wins."
	},
	{
		qFa: "سنجش",
		qEn: "Measure",
		btcFa: "کندل روزانه همان ارز: ناحیه خرید، فروش بالایی، فروش پایینی.",
		btcEn: "That coin’s own daily candles: a buy zone, an upside sell, a downside sell.",
		otherFa: "امتیاز روی جفت بیت‌کوین: قدرت نسبی، روند، ورود، نقدشوندگی، ریسک.",
		otherEn: "A score on the Bitcoin pair: relative strength, trend, entry, liquidity, risk."
	},
	{
		qFa: "اگر ضعیف باشد",
		qEn: "If it is weak",
		btcFa: "برای همان افق می‌گوید هیچ ارزی نخر. فهرست پاک نمی‌شود.",
		btcEn: "For that horizon it says buy no coin. The list stays.",
		otherFa: "آلت از انتخاب حذف می‌شود و بیت‌کوین می‌ماند.",
		otherEn: "The alt is dropped from the pick and Bitcoin stays."
	},
	{
		qFa: "ثبات",
		qEn: "How long it holds",
		btcFa: "حکم هفته و ماه تا پایان اعتبار عوض نمی‌شود.",
		btcEn: "The week and month calls do not change before they expire.",
		otherFa: "تحلیل دوباره امتیاز لحظه‌ای را عوض می‌کند.",
		otherEn: "Running the analysis again replaces the live score."
	}
];
var OTHERS = [
	{
		tFa: "انتخاب",
		tEn: "Pick",
		dFa: "یک نام بین صد ارز برتر، نسبت به بیت‌کوین. برنامه خرید سه افق برای هر سکه نیست.",
		dEn: "One name among the top 100, versus Bitcoin. Not a three-horizon buy plan for every coin."
	},
	{
		tFa: "رتبه‌ها",
		tEn: "Ranks",
		dFa: "جدول همان امتیاز انتخاب. حکم خرید یا فروش هر سکه را جدا نمی‌دهد.",
		dEn: "The same pick score, as a table. It does not issue a buy or sell for each coin."
	},
	{
		tFa: "فرصت‌ها",
		tEn: "Setups",
		dFa: "ارزهایی که هنوز نباید خرید. فقط ناحیه، تأیید و ابطال. افت قیمت به‌تنهایی امتیاز نیست.",
		dEn: "Names you should not buy yet. Only a zone, a confirmation, and an invalidation. A lower price alone does not score."
	},
	{
		tFa: "همگرایی",
		tEn: "Confluence",
		dFa: "جریان حجم و تأیید ورود. نه رتبه، نه سه حکم میز بیت‌کوین.",
		dEn: "Volume flow and entry confirmation. Not the rank, and not the Bitcoin desk’s three calls."
	},
	{
		tFa: "کلان",
		tEn: "Macro",
		dFa: "ساعت تهران و نیویورک و تقویم خبر. زمینه است، سیگنال سکه نیست.",
		dEn: "Tehran and New York hours, plus the news calendar. Context, not a coin signal."
	},
	{
		tFa: "آنلاک",
		tEn: "Unlocks",
		dFa: "فشار عرضه توکن. به میز بیت‌کوین وصل نیست و خودش دستور خرید نمی‌سازد.",
		dEn: "Token supply pressure. It is not wired into the Bitcoin desk and does not place a buy by itself."
	},
	{
		tFa: "پرتفوی و پایش",
		tEn: "Portfolio and watch",
		dFa: "اندازه و خروج همان انتخاب میز اصلی. برد صد ارز میز بیت‌کوین نیست.",
		dEn: "Size and exit for the main desk’s pick. Not the Bitcoin desk’s board of one hundred."
	},
	{
		tFa: "بک‌تست",
		tEn: "Backtest",
		dFa: "گذشته هفتگی مدل انتخاب، با بازده هر ماه. حکم‌های قفل‌شده میز بیت‌کوین را حساب نمی‌کند.",
		dEn: "The weekly past of the pick model, with each month’s return. It does not score the Bitcoin desk’s locked calls."
	},
	{
		tFa: "عمق، وب‌هوک، صرافی",
		tEn: "Depth, webhook, venue",
		dFa: "دفتر سفارش و فرستادن همان سیگنال انتخاب. جایگزین میز بیت‌کوین نیستند.",
		dEn: "The order book and delivery of that same pick. They do not replace the Bitcoin desk."
	},
	{
		tFa: "روش و سابقه",
		tEn: "Method and history",
		dFa: "وزن‌های مدل و تحلیل‌های قبلی میز اصلی. سطح خرید هر ارز را نشان نمی‌دهند.",
		dEn: "The model’s weights and earlier runs of the main desk. They do not show each coin’s buy level."
	}
];
function DeskCompare({ here = "home" }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "min-w-0 rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "num text-xs tracking-widest text-subtle",
				children: "TWO DESKS"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-2 text-xl font-medium tracking-tight text-fg md:text-2xl",
				children: tr("فرق میز بیت‌کوین با بقیه بخش‌ها", "How the Bitcoin desk differs from the rest")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl text-sm leading-relaxed text-muted",
				children: tr("دو جواب جدا هستند. میز بیت‌کوین نمی‌گوید کدام آلت از بیت‌کوین قوی‌تر است. میز اصلی هم برای هر ارز یک برنامه خرید و فروش سه افق نمی‌سازد. یکی را جای دیگری نگذارید.", "These are two different answers. The Bitcoin desk does not say which alt is stronger than Bitcoin. The main desk does not build a three-horizon buy and sell plan for every coin. Do not swap one for the other.")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-5 grid gap-3 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg bg-bg p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: tr("مسیر جدا", "Separate path")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 text-base font-medium text-fg",
							children: tr("میز بیت‌کوین", "Bitcoin desk")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: tr("صد ارز اول، بدون استیبل و رپد. بیت‌کوین همیشه اول فهرست است. هر ردیف سطح ورود، فروش بالایی و فروش پایینی خودش را دارد.", "The top one hundred, with stables and wrapped assets left out. Bitcoin is always first on the list. Each row has its own entry, upside sell, and downside sell.")
						}),
						here === "home" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/spot/$assetId",
							params: { assetId: "btc" },
							className: "mt-3 inline-flex h-11 items-center text-sm text-fg",
							children: tr("باز کردن میز بیت‌کوین", "Open the Bitcoin desk")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: tr("شما الان روی همین میز هستید.", "You are on this desk now.")
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-lg bg-bg p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: tr("همین صفحه، تب‌ها", "This page, the tabs")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-1 text-base font-medium text-fg",
							children: tr("میز اصلی", "Main desk")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: tr("صد ارز برتر را روی جفت بیت‌کوین امتیاز می‌دهد و یک نام برمی‌گرداند. بقیه تب‌ها همان انتخاب را توضیح، اندازه، یا اجرا می‌کنند. هیچ‌کدام فهرست سه حکم میز بیت‌کوین نیستند.", "It scores the top 100 on the Bitcoin pair and returns one name. The other tabs explain, size, or place that same pick. None of them is the Bitcoin desk’s list of three calls.")
						}),
						here === "btc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mt-3 inline-flex h-11 items-center text-sm text-fg",
							children: tr("بازگشت به میز اصلی", "Back to the main desk")
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: tr("انتخاب، بعد از تعیین صرافی و افق ساخته می‌شود.", "The pick is built after you set the exchange and the horizon.")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-xs text-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start font-medium",
								children: tr("مقایسه", "Compare")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start font-medium",
								children: tr("میز بیت‌کوین", "Bitcoin desk")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-2 text-start font-medium",
								children: tr("بقیه بخش‌ها", "The other sections")
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: ROWS.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 text-start text-xs font-medium text-subtle",
								children: tr(row.qFa, row.qEn)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 leading-relaxed text-fg",
								children: tr(row.btcFa, row.btcEn)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3 leading-relaxed text-muted",
								children: tr(row.otherFa, row.otherEn)
							})
						]
					}, row.qEn)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-6 text-sm font-medium text-fg",
				children: tr("بقیه بخش‌ها، هر کدام چه کار می‌کنند", "What each other section does")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: OTHERS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-lg bg-bg px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: tr(item.tFa, item.tEn)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-muted",
						children: tr(item.dFa, item.dEn)
					})]
				}, item.tEn))
			})
		]
	});
}
var loadTechnical = createServerFn({ method: "POST" }).validator((input) => {
	const symbol = normalizeSymbol(String(input?.symbol ?? ""));
	if (!symbol) throw new Error(msg("نماد نامعتبر است.", "That symbol is not valid."));
	const interval = input?.interval;
	if (interval !== "4h" && interval !== "1d" && interval !== "1w") throw new Error(msg("بازه نامعتبر است.", "That timeframe is not valid."));
	return {
		symbol,
		interval
	};
}).handler(createSsrRpc("7dbc2a920099b330b24b1f535c04eb1b7f4049c52042c2f09febcaf09bad718b"));
var QUICK = [
	"BTC",
	"ETH",
	"SOL",
	"BNB",
	"XRP",
	"DOGE",
	"AVAX",
	"LINK",
	"TON"
];
var INTERVALS = [
	{
		id: "4h",
		fa: "چهارساعته",
		en: "4 hours"
	},
	{
		id: "1d",
		fa: "روزانه",
		en: "Daily"
	},
	{
		id: "1w",
		fa: "هفتگی",
		en: "Weekly"
	}
];
function TechnicalPanel({ defaultSymbol = "BTC" }) {
	const { tr, locale } = useI18n();
	const run = useServerFn(loadTechnical);
	const [symbol, setSymbol] = (0, import_react.useState)(() => normalizeSymbol(defaultSymbol) ?? "BTC");
	const [draft, setDraft] = (0, import_react.useState)(symbol);
	const [interval, setIntervalId] = (0, import_react.useState)("1d");
	const [read, setRead] = (0, import_react.useState)(null);
	const [phase, setPhase] = (0, import_react.useState)("loading");
	const [error, setError] = (0, import_react.useState)(null);
	const [active, setActive] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		const next = normalizeSymbol(defaultSymbol) ?? "BTC";
		setSymbol(next);
	}, [defaultSymbol]);
	(0, import_react.useEffect)(() => {
		setDraft(symbol);
	}, [symbol]);
	(0, import_react.useEffect)(() => {
		let stop = false;
		setPhase("loading");
		setError(null);
		run({ data: {
			symbol,
			interval
		} }).then((next) => {
			if (stop) return;
			setRead(next);
			setPhase("ready");
			setActive(null);
		}).catch((err) => {
			if (stop) return;
			setPhase("error");
			setError(err instanceof Error ? err.message : msg("خواندن نمودار انجام نشد.", "The chart could not be read."));
		});
		return () => {
			stop = true;
		};
	}, [
		symbol,
		interval,
		run
	]);
	const tone = read?.bias === "bull" ? "text-up bg-up-dim" : read?.bias === "bear" ? "text-down bg-down-dim" : "text-muted bg-elevated";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "technical",
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg text-fg",
					children: tr("تحلیل تکنیکال", "Technical read")
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
					children: tr("متن از روی همین شکل است. روی هر بند بزن تا همان خط پررنگ شود. این بخش دستور خرید نمی‌دهد.", "The text is read off this chart. Tap a note to emphasize that line. This section does not give an order.")
				})] }), read ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `rounded-md px-3 py-2 text-sm ${tone}`,
					children: tr(read.biasFa, read.biasEn)
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 overflow-x-auto",
					children: QUICK.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSymbol(item),
						className: symbol === item ? "num h-11 shrink-0 rounded-md bg-elevated px-3 text-sm text-fg" : "num h-11 shrink-0 rounded-md px-3 text-sm text-muted",
						children: item
					}, item))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-col gap-2 sm:flex-row",
					onSubmit: (event) => {
						event.preventDefault();
						const next = normalizeSymbol(draft);
						if (!next) {
							setPhase("error");
							setError(msg("نماد نامعتبر است.", "That symbol is not valid."));
							return;
						}
						setSymbol(next);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: draft,
							onChange: (event) => setDraft(event.target.value.toUpperCase()),
							"aria-label": tr("نماد", "Symbol"),
							className: "num h-11 min-w-0 flex-1 rounded-md bg-bg px-3 text-sm text-fg outline-none",
							placeholder: "BTC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "h-11 rounded-md bg-accent px-4 text-sm text-accent-fg",
							children: tr("نمایش نمودار", "Show chart")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-1",
							children: INTERVALS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setIntervalId(item.id),
								className: interval === item.id ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg" : "h-11 rounded-md px-3 text-sm text-muted",
								children: tr(item.fa, item.en)
							}, item.id))
						})
					]
				})]
			}),
			phase === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 flex h-72 items-center justify-center rounded-lg bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "flex items-center gap-2 text-sm text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), tr("کندل‌ها از بایننس می‌آیند", "Loading candles from Binance")]
				})
			}) : null,
			phase === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-down",
				children: error ? tr(error) : tr("خواندن نمودار انجام نشد.", "The chart could not be read.")
			}) : null,
			phase === "ready" && read ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-4 flex flex-col gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-fg",
									children: read.symbol
								}),
								" · ",
								tr(INTERVALS.find((item) => item.id === read.interval)?.fa ?? "", INTERVALS.find((item) => item.id === read.interval)?.en ?? ""),
								read.live ? tr(" · کندل آخر هنوز باز است", " · the last candle is still open") : ""
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num text-xl text-fg",
							children: [
								formatPx(read.lastPrice),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: read.changePct >= 0 ? "text-sm text-up" : "text-sm text-down",
									children: formatPct(read.changePct)
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed text-muted",
						children: tr(read.summaryFa, read.summaryEn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartFigure, {
						read,
						active,
						locale
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, { read }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2",
						children: read.steps.slice(0, 3).map((step) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setActive((cur) => cur === step.n ? null : step.n),
							className: active === step.n ? "rounded-lg bg-elevated px-4 py-3 text-start shadow-[var(--shadow-border)]" : "rounded-lg px-4 py-3 text-start hover:bg-elevated",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num me-2 text-subtle",
									children: step.n
								}), tr(step.titleFa, step.titleEn)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-muted",
								children: tr(step.bodyFa, step.bodyEn)
							})]
						}, step.n))
					}),
					read.steps[3] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm leading-relaxed ${active === 4 ? "text-fg" : "text-muted"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-start",
							onClick: () => setActive((cur) => cur === 4 ? null : 4),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num me-2 text-subtle",
								children: "4"
							}), tr(read.steps[3].bodyFa, read.steps[3].bodyEn)]
						})
					}) : null,
					read.steps[4] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-sm leading-relaxed ${active === 5 ? "text-fg" : "text-muted"}`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-start",
							onClick: () => setActive((cur) => cur === 5 ? null : 5),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num me-2 text-subtle",
								children: "5"
							}), tr(read.steps[4].bodyFa, read.steps[4].bodyEn)]
						})
					}) : null,
					read.votes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: read.votes.map((vote) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: vote.bias === "bull" ? "rounded-md bg-up-dim px-2 py-1 text-xs text-up" : vote.bias === "bear" ? "rounded-md bg-down-dim px-2 py-1 text-xs text-down" : "rounded-md bg-elevated px-2 py-1 text-xs text-muted",
							children: [
								tr(vote.nameFa, vote.nameEn),
								" · ",
								vote.bias === "bull" ? tr("صعودی", "Bull") : vote.bias === "bear" ? tr("نزولی", "Bear") : tr("خنثی", "Flat")
							]
						}, vote.id))
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
						className: "text-sm text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
							className: "cursor-pointer text-fg",
							children: tr("این خط‌ها از کجا آمده‌اند", "Where these lines come from")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-3 flex list-disc flex-col gap-2 ps-5 leading-relaxed",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("ساختار: چارلز داو. روند یعنی سقف بالاتر با کف بالاتر، یا سقف پایین‌تر با کف پایین‌تر. سقف و کف فقط وقتی تأیید می‌شوند که دو کندل دو طرفشان از آن‌ها عبور نکرده باشد.", "Structure: Charles Dow. A trend is a higher high with a higher low, or a lower high with a lower low. A swing counts only when two candles on each side failed to exceed it.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("میانگین ساده ۵۰ و ۲۰۰، فیلتر رژیم است. Brock، Lakonishok و LeBaron در Journal of Finance سال ۱۹۹۲ قوانین میانگین ساده را آزمودند. اینجا فقط جای قیمت نسبت به خط را می‌گوید.", "The 50 and 200 simple averages are a regime filter. Brock, Lakonishok, and LeBaron tested simple average rules in the Journal of Finance, 1992. Here they only say where price sits against the line.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("RSI و ATR و ADX از وایلدر است، کتاب New Concepts in Technical Trading Systems، ۱۹۷۸، با دورهٔ ۱۴ خودش. ADX را از ۲۵ به بالا روند می‌گیریم. ADX جهت نمی‌دهد؛ DI جهت را می‌گوید.", "RSI, ATR, and ADX are Wilder's, from New Concepts in Technical Trading Systems, 1978, using his period of 14. ADX counts as a trend from 25 up. ADX does not point; DI does.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("مکدی مال جرالد اپل است: ۱۲، ۲۶ و سیگنال ۹. هیستوگرام، فاصلهٔ خط مکدی از سیگنال است.", "MACD is Gerald Appel's: 12, 26, and a 9 signal. The histogram is the gap between the MACD line and the signal.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("باند بولینگر مال جان بولینگر است: میانگین ۲۰ و دو انحراف معیار. %B جای قیمت داخل نوار است. تنگ شدن نوار جهت نیست.", "Bollinger Bands are John Bollinger's: a 20 average and two standard deviations. %B is where price sits inside the band. A narrow band is not a direction.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("OBV مال جو گرانویل است، ۱۹۶۳. فقط وقتی با جهت ده کندل اخیر همراه باشد رأی می‌دهد.", "OBV is Joe Granville's, 1963. It votes only when it agrees with the last ten candles.") }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: tr("پیوت فرمول کف معامله‌گران است: (سقف + کف + بسته) تقسیم بر ۳. فقط اگر نزدیک قیمت باشد روی شکل می‌آید.", "The pivot is the floor-trader formula: (high + low + close) / 3. It is drawn only when it sits near price.") })
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "text-xs leading-relaxed text-subtle",
						children: tr("کندل عمومی بایننس، جفت تتر. اگر کندل آخر باز باشد در محاسبه هست و با بسته شدن کمی جابه‌جا می‌شود. توصیه سرمایه‌گذاری نیست.", "Public Binance candles, USDT pair. If the last candle is still open it is included and will shift a little when it closes. Not investment advice.")
					})
				]
			}) : null
		]
	});
}
function Legend({ read }) {
	const { tr } = useI18n();
	const support = read.marks.find((mark) => mark.id === "support");
	const resistance = read.marks.find((mark) => mark.id === "resistance");
	const pivot = read.marks.find((mark) => mark.id === "pivot");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted",
		children: [
			read.sma200 != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-6 bg-accent" }),
					tr("میانگین ۲۰۰", "200 SMA"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(read.sma200)
					})
				]
			}) : null,
			read.sma50 != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-6 bg-warn" }),
					tr("میانگین ۵۰", "50 SMA"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(read.sma50)
					})
				]
			}) : null,
			support ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0 w-6 border-t border-dashed border-up" }),
					tr("حمایت", "Support"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(support.price)
					})
				]
			}) : null,
			resistance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0 w-6 border-t border-dashed border-down" }),
					tr("مقاومت", "Resistance"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(resistance.price)
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-6 rounded-sm bg-elevated" }), tr("باند بولینگر", "Bollinger")]
			}),
			read.atr != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-3 w-0.5 bg-warn" }),
					"ATR ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(read.atr)
					})
				]
			}) : null,
			pivot ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0 w-6 border-t border-dashed border-subtle" }),
					tr("پیوت", "Pivot"),
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-fg",
						children: formatPx(pivot.price)
					})
				]
			}) : null
		]
	});
}
function ChartFigure({ read, active, locale }) {
	const { tr } = useI18n();
	const host = (0, import_react.useRef)(null);
	const [width, setWidth] = (0, import_react.useState)(640);
	const [hover, setHover] = (0, import_react.useState)(null);
	const labelId = (0, import_react.useId)();
	(0, import_react.useEffect)(() => {
		const el = host.current;
		if (!el) return;
		const apply = () => setWidth(Math.max(280, Math.floor(el.clientWidth)));
		apply();
		const observer = new ResizeObserver(apply);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);
	const bars = read.bars;
	const padL = 8;
	const padR = width < 420 ? 52 : 64;
	const padT = 16;
	const priceH = 220;
	const rsiH = 68;
	const macdH = 60;
	const height = 416;
	const plotW = Math.max(40, width - padL - padR);
	const n = bars.length || 1;
	const x = (i) => padL + (i + .5) * plotW / n;
	let min = Infinity;
	let max = -Infinity;
	for (const bar of bars) {
		min = Math.min(min, bar.low);
		max = Math.max(max, bar.high);
		if (bar.upper != null) max = Math.max(max, bar.upper);
		if (bar.lower != null) min = Math.min(min, bar.lower);
		if (bar.sma50 != null) {
			min = Math.min(min, bar.sma50);
			max = Math.max(max, bar.sma50);
		}
		if (bar.sma200 != null) {
			min = Math.min(min, bar.sma200);
			max = Math.max(max, bar.sma200);
		}
	}
	for (const mark of read.marks) {
		min = Math.min(min, mark.price);
		max = Math.max(max, mark.price);
	}
	const last = bars[bars.length - 1];
	if (last && read.atr) {
		min = Math.min(min, last.close - read.atr);
		max = Math.max(max, last.close + read.atr * .25);
	}
	if (!Number.isFinite(min) || !Number.isFinite(max) || min === max) {
		min = (last?.close ?? 1) * .98;
		max = (last?.close ?? 1) * 1.02;
	}
	const pad = (max - min) * .06;
	min -= pad;
	max += pad;
	const y = (price) => padT + (max - price) / (max - min) * priceH;
	const yRsi = (value) => 258 + (100 - value) / 100 * rsiH;
	const macdVals = bars.map((bar) => bar.macd).filter((value) => value != null);
	const macdMax = Math.max(1e-6, ...macdVals.map((value) => Math.abs(value)));
	const macdTop = 348;
	const yMacd = (value) => macdTop + (macdMax - value) / (2 * macdMax) * macdH;
	const dim = (kind) => active == null || active === kind ? 1 : .22;
	const candleW = Math.max(1.5, plotW / n * .62);
	const hovered = hover != null ? bars[hover] : null;
	const dateLabel = hovered ? new Date(hovered.t).toLocaleString(locale === "en" ? "en-GB" : "fa-IR", {
		month: "short",
		day: "numeric",
		hour: read.interval === "4h" ? "2-digit" : void 0,
		minute: read.interval === "4h" ? "2-digit" : void 0,
		timeZone: "Asia/Tehran"
	}) : "";
	const band = bandPath(bars, x, y);
	const avg50 = linePath(bars, (bar) => bar.sma50, x, y);
	const avg200 = linePath(bars, (bar) => bar.sma200, x, y);
	const rsiPath = linePath(bars, (bar) => bar.rsi, x, yRsi);
	function onMove(event) {
		const rect = event.currentTarget.getBoundingClientRect();
		const local = event.clientX - rect.left;
		const i = Math.round((local - padL) / plotW * n - .5);
		if (i < 0 || i >= bars.length) setHover(null);
		else setHover(i);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: host,
		className: "min-w-0",
		dir: "ltr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			id: labelId,
			className: "num mb-2 min-h-5 text-xs text-subtle",
			children: hovered ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				dateLabel,
				" · O ",
				formatPx(hovered.open),
				" · H ",
				formatPx(hovered.high),
				" · L ",
				formatPx(hovered.low),
				" · C",
				" ",
				formatPx(hovered.close),
				hovered.rsi != null ? ` · RSI ${hovered.rsi.toFixed(0)}` : ""
			] }) : tr("روی نمودار بکش تا همان کندل خوانده شود", "Drag across the chart to read that candle")
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			width,
			height,
			role: "img",
			"aria-labelledby": labelId,
			className: "max-w-full touch-pan-y",
			onPointerMove: onMove,
			onPointerLeave: () => setHover(null),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Band, {
					d: band,
					opacity: dim(3)
				}),
				bars.map((bar, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Candle, {
					bar,
					x: x(i),
					y,
					width: candleW,
					hot: hover === i
				}, bar.t)),
				avg200 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: avg200,
					fill: "none",
					stroke: "var(--color-accent)",
					strokeWidth: active === 1 ? 2.4 : 1.4,
					opacity: dim(1)
				}) : null,
				avg50 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: avg50,
					fill: "none",
					stroke: "var(--color-warn)",
					strokeWidth: active === 1 ? 2.4 : 1.4,
					opacity: dim(1)
				}) : null,
				read.marks.map((mark) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkLine, {
					mark,
					y: y(mark.price),
					width: padL + plotW,
					opacity: markOpacity(mark.id, active)
				}, mark.id)),
				last && read.atr ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: x(bars.length - 1) + candleW * .8,
					x2: x(bars.length - 1) + candleW * .8,
					y1: y(last.close),
					y2: y(last.close - read.atr),
					stroke: "var(--color-warn)",
					strokeWidth: active === 3 ? 3 : 1.5,
					opacity: dim(3)
				}) : null,
				hover != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: x(hover),
					x2: x(hover),
					y1: padT,
					y2: 236,
					stroke: "var(--color-border-strong)"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Axis, {
					min,
					max,
					y,
					x: padL + plotW + 8
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: padL,
					y: 250,
					fill: "var(--color-subtle)",
					fontSize: "11",
					fontFamily: "IBM Plex Mono",
					children: "RSI 14"
				}),
				[
					30,
					50,
					70
				].map((level) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: padL,
					x2: padL + plotW,
					y1: yRsi(level),
					y2: yRsi(level),
					stroke: "var(--color-border)",
					strokeDasharray: level === 50 ? "0" : "3 3",
					opacity: dim(4)
				}, level)),
				rsiPath ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: rsiPath,
					fill: "none",
					stroke: "var(--color-accent)",
					strokeWidth: 1.6,
					opacity: dim(4)
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: padL,
					y: 342,
					fill: "var(--color-subtle)",
					fontSize: "11",
					fontFamily: "IBM Plex Mono",
					children: "MACD"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: padL,
					x2: padL + plotW,
					y1: yMacd(0),
					y2: yMacd(0),
					stroke: "var(--color-border)",
					opacity: dim(5)
				}),
				bars.map((bar, i) => bar.macd == null ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: x(i) - candleW / 2,
					y: Math.min(yMacd(0), yMacd(bar.macd)),
					width: candleW,
					height: Math.max(1, Math.abs(yMacd(bar.macd) - yMacd(0))),
					fill: bar.macd >= 0 ? "var(--color-up)" : "var(--color-down)",
					opacity: dim(5)
				}, `m-${bar.t}`))
			]
		})]
	});
}
function markOpacity(id, active) {
	if (active == null) return 1;
	if (active === 1) return id === "sma50" || id === "sma200" ? 1 : .2;
	if (active === 2) return id === "support" || id === "resistance" || id === "pivot" ? 1 : .2;
	if (active === 3) return .35;
	return .45;
}
function Axis({ min, max, y, x }) {
	const ticks = [
		max,
		(max + min) / 2,
		min
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: ticks.map((tick) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
		x,
		y: y(tick) + 4,
		fill: "var(--color-subtle)",
		fontSize: "11",
		fontFamily: "IBM Plex Mono",
		children: formatPx(tick)
	}, tick)) });
}
function Band({ d, opacity }) {
	if (!d) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
		d,
		fill: "var(--color-fg)",
		opacity: .06 * opacity
	});
}
function Candle({ bar, x, y, width, hot }) {
	const color = bar.close >= bar.open ? "var(--color-up)" : "var(--color-down)";
	const top = y(Math.max(bar.open, bar.close));
	const bot = y(Math.min(bar.open, bar.close));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		opacity: hot ? 1 : .92,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x,
			x2: x,
			y1: y(bar.high),
			y2: y(bar.low),
			stroke: color,
			strokeWidth: hot ? 1.6 : 1
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: x - width / 2,
			y: top,
			width,
			height: Math.max(1, bot - top),
			fill: color
		})]
	});
}
function MarkLine({ mark, y, width, opacity }) {
	const stroke = mark.tone === "warn" ? "var(--color-warn)" : mark.tone === "up" ? "var(--color-up)" : mark.tone === "down" ? "var(--color-down)" : mark.tone === "subtle" ? "var(--color-subtle)" : "var(--color-accent)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
		x1: 8,
		x2: width,
		y1: y,
		y2: y,
		stroke,
		strokeDasharray: mark.dash ? "4 4" : void 0,
		strokeWidth: 1.25,
		opacity
	});
}
function linePath(bars, pick, x, y) {
	let d = "";
	bars.forEach((bar, i) => {
		const value = pick(bar);
		if (value == null || !Number.isFinite(value)) return;
		d += `${d ? "L" : "M"}${x(i).toFixed(1)},${y(value).toFixed(1)}`;
	});
	return d;
}
function bandPath(bars, x, y) {
	const upper = [];
	const lower = [];
	bars.forEach((bar, i) => {
		if (bar.upper == null || bar.lower == null) return;
		upper.push(`${x(i).toFixed(1)},${y(bar.upper).toFixed(1)}`);
		lower.push(`${x(i).toFixed(1)},${y(bar.lower).toFixed(1)}`);
	});
	if (upper.length < 2) return "";
	return `M${upper.join("L")}L${lower.reverse().join("L")}Z`;
}
var GROUP_FA = {
	trend: "روند",
	structure: "ساختار",
	location: "محل ورود",
	momentum: "مومنتوم",
	flow: "جریان حجم"
};
var GROUP_EN = {
	trend: "Trend",
	structure: "Structure",
	location: "Location",
	momentum: "Momentum",
	flow: "Volume flow"
};
function AlphaStackPanel({ stack, symbol, price }) {
	const { tr } = useI18n();
	const bias = stack.bias === "buy" ? {
		fa: "بخر",
		en: "Buy",
		tone: "text-up"
	} : stack.bias === "avoid" ? {
		fa: "نخر",
		en: "Do not buy",
		tone: "text-down"
	} : {
		fa: "صبر کن",
		en: "Wait",
		tone: "text-warn"
	};
	const groups = [
		"trend",
		"structure",
		"location",
		"momentum",
		"flow"
	].filter((group) => stack.readings.some((item) => item.group === group));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-widest text-subtle",
							children: "ALPHA STACK"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "mt-1 text-base font-medium text-fg",
							children: [tr("پشته اندیکاتور خرید اسپات", "Spot-buy indicator stack"), symbol ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-muted",
								children: [" · ", symbol]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `mt-2 text-2xl font-medium tracking-tight ${bias.tone}`,
							children: tr(bias.fa, bias.en)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: tr(stack.headlineFa, stack.headlineEn)
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-36 text-end",
					children: [
						price ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-xl text-fg",
							children: price
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-3xl text-fg",
							children: stack.score
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: tr("امتیاز کیفیت ورود", "Entry quality")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 h-1.5 overflow-hidden rounded-full bg-bg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full rounded-full ${stack.bias === "buy" ? "bg-up" : stack.bias === "avoid" ? "bg-down" : "bg-warn"}`,
					style: { width: `${Math.max(4, Math.min(100, stack.score))}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap gap-2 text-xs text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-md bg-elevated px-2 py-1",
						children: [
							tr("توافق", "Agreement"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-fg",
								children: [Math.round(stack.agreement * 100), "%"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-md bg-elevated px-2 py-1",
						children: [
							tr("اندازه مجاز", "Size cap"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: stack.sizeCap === "full" ? tr("کامل", "Full") : stack.sizeCap === "half" ? tr("نصف", "Half") : tr("صفر", "None")
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "rounded-md bg-elevated px-2 py-1",
						children: [
							tr("وتو", "Veto"),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: stack.veto == null ? tr("ندارد", "None") : stack.veto === "chase" ? tr("تعقیب سقف", "Chase") : stack.veto === "distribution" ? tr("توزیع", "Distribution") : tr("نزول", "Markdown")
							})
						]
					})
				]
			}),
			groups.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: tr("کندل کافی برای خواندن اندیکاتورها نرسیده.", "Not enough candles to read the indicators.")
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex flex-col gap-5",
				children: groups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: tr(GROUP_FA[group], GROUP_EN[group])
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 grid gap-2 md:grid-cols-2",
					children: stack.readings.filter((item) => item.group === group).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reading, { item }, item.key))
				})] }, group))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs leading-relaxed text-subtle",
				children: tr("این لایه دستور میز را عوض می‌کند: تعقیب سقف، توزیع، یا نزول تأییدشده خرید را می‌بندد. ایچیموکو، سوپرترند، ADX، VWAP، پروفایل حجم، فشردگی بولینگر/کلتنر، استوکاستیک RSI، RSI کانرز، مکدی، واگرایی، CMF، OBV و ساختار سویینگ روی کندل روزانه حساب می‌شوند. توصیه مالی نیست.", "This layer can change the desk order: a chase, distribution, or a confirmed markdown closes the buy. Ichimoku, Supertrend, ADX, VWAP, volume profile, the Bollinger/Keltner squeeze, Stochastic RSI, Connors RSI, MACD, divergence, CMF, OBV, and swing structure are calculated on the daily candle. Not financial advice.")
			})
		]
	});
}
function Reading({ item }) {
	const { tr } = useI18n();
	const tone = item.tone === "up" ? "text-up" : item.tone === "down" ? "text-down" : "text-muted";
	const mark = item.vote > 0 ? "+" : item.vote < 0 ? "−" : "·";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-lg bg-bg px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-baseline justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: tr(item.labelFa, item.labelEn)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `num text-sm ${tone}`,
				children: [
					mark,
					" ",
					tr(item.value, item.valueEn ?? item.value)
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs leading-relaxed text-muted",
			children: tr(item.detailFa, item.detailEn)
		})]
	});
}
//#endregion
export { LocaleSwitch as a, createSsrRpc as c, formatScore as d, formatUntil as f, useServerFn as h, DeskCompare as i, formatPct as l, timeAgoFa as m, Button as n, TechnicalPanel as o, formatUsd as p, CoinMark as r, cn as s, AlphaStackPanel as t, formatPctPoints as u };
