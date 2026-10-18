import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { G as isRedirect, S as require_jsx_runtime, b as Link, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById } from "./ssr.mjs";
import { n as getLocale } from "./lex-C7bdiIgA.mjs";
import { a as useI18n } from "./router-DKWOdSrV.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/desk-compare-DNtutK_N.js
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
//#endregion
export { cn as a, formatPctPoints as c, formatUsd as d, timeAgoFa as f, LocaleSwitch as i, formatScore as l, CoinMark as n, createSsrRpc as o, useServerFn as p, DeskCompare as r, formatPct as s, Button as t, formatUntil as u };
