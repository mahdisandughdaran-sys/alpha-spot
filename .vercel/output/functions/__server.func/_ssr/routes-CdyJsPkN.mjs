import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { U as isRedirect, b as require_jsx_runtime, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as confidenceTitle, l as regimeTitle, r as checklistPassCount, s as dominanceTitle, t as btcPriceLabel } from "./explain-D9oCZMGL.mjs";
import { a as Minus, c as Bitcoin, i as ShieldAlert, l as ArrowUpRight, o as LoaderCircle, r as Star, s as Check, t as X, u as Activity } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as ReferenceLine, i as Line, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as LineChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CdyJsPkN.js
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
function cn(...inputs) {
	return twMerge(clsx(inputs));
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
function formatUsd(n) {
	if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
	if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
	if (n >= 1e3) return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
	if (n >= 1) return n.toFixed(4);
	return n.toPrecision(4);
}
function formatPct(ratio, digits = 1) {
	const v = ratio * 100;
	return `${v > 0 ? "+" : ""}${v.toFixed(digits)}٪`;
}
function formatPctPoints(pctPoints, digits = 1) {
	return `${pctPoints > 0 ? "+" : ""}${pctPoints.toFixed(digits)}٪`;
}
function formatScore(n) {
	return n.toFixed(1);
}
function timeAgoFa(iso) {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return "";
	return d.toLocaleString("fa-IR", {
		hour: "2-digit",
		minute: "2-digit"
	});
}
function HistoryPanel({ runs }) {
	if (runs.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-medium text-fg",
			children: "سابقه تحلیل‌ها"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm leading-relaxed text-muted",
			children: "بعد از هر تحلیل، انتخاب و رژیم در همین مرورگر ذخیره می‌شود تا بتوانید تغییر برنده را ببینید. حساب کاربری لازم نیست."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "سابقه تحلیل‌ها"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: "تا ۱۲ اجرای اخیر روی این دستگاه. برای قضاوت وزن‌ها، برنده را با ۷ روز بعد مقایسه کنید."
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
							children: "زمان"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "انتخاب"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "امتیاز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "رژیم"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "دامیننس"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "۷ر vs BTC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "دوم"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: runs.map((run) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-subtle",
							children: new Date(run.at).toLocaleString("fa-IR", {
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
									children: run.name
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
							children: run.regime === "btc" ? "بیت‌کوین" : run.regime === "alt" ? "آلت" : "خنثی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "num px-4 py-3 text-muted",
							children: [run.dominance.toFixed(1), "٪"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-muted",
							children: formatPct(run.rs7d)
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
function Leaderboard({ rows, picked, watched, onToggleWatch }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-end justify-between gap-3 p-5",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "رتبه‌بندی مدل"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: "امتیاز نهایی وزن هفت‌فاکتوری است. ستون BTC یعنی بازده ۷ روزه روی جفت بیت‌کوین. ستاره، واچ‌لیست همین مرورگر است."
			})] })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full min-w-[720px] text-sm",
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
							children: "ارز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "امتیاز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "۷ر vs BTC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "MC/FDV"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "EMA۲۰۰"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "RSI"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "قیمت BTC"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "حجم"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row, i) => {
					const active = row.symbol === picked;
					const starred = watched.includes(row.symbol);
					const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: active ? "border-t border-border bg-elevated" : "border-t border-border",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-3 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => onToggleWatch(row.symbol),
									className: "flex size-9 items-center justify-center rounded-md text-subtle hover:bg-elevated hover:text-fg",
									"aria-label": starred ? "حذف از واچ‌لیست" : "افزودن به واچ‌لیست",
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-fg",
										children: row.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num text-xs text-subtle",
										children: [row.symbol, row.narrativeTagsFa[0] ? ` · ${row.narrativeTagsFa[0]}` : ""]
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-fg",
								children: formatScore(row.score)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `num px-4 py-3 ${rsTone}`,
								children: formatPct(row.rs7d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-muted",
								children: row.mcFdv == null ? "—" : `${(row.mcFdv * 100).toFixed(0)}٪`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-muted",
								children: row.aboveEma200 === true ? "بالا" : row.aboveEma200 === false ? "پایین" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-muted",
								children: row.rsi14 == null ? "—" : row.rsi14.toFixed(0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "num px-4 py-3 text-muted",
								children: btcPriceLabel(row.priceBtc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "num px-4 py-3 text-muted",
								children: ["$", formatUsd(row.volume24h)]
							})
						]
					}, row.id);
				}) })]
			})
		})]
	});
}
var FACTORS = [
	{
		w: "۲۲٪",
		t: "قدرت نسبی به بیت‌کوین",
		d: "بازده ۷، ۱۴ و ۳۰ روزه روی جفت BTC، نه تتر. اگر آلت دلاری سبز باشد ولی از بیت عقب بماند، امتیاز نمی‌گیرد."
	},
	{
		w: "۱۶٪",
		t: "توکنومیکس · MC/FDV",
		d: "اگر نسبت ارزش بازار به ارزش رقیق‌شده زیر ۰٫۵ باشد، آزادسازی توکن فشار فروش می‌سازد. اولویت با MC/FDV بالای ۰٫۷ است."
	},
	{
		w: "۱۶٪",
		t: "موقعیت ورود",
		d: "RSI روزانه و فاصله از اوج ۳۰ روزه. اشباع خرید و خرید سقف امتیاز از دست می‌دهند؛ اصلاح ۶ تا ۱۸ درصدی سالم پاداش می‌گیرد."
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
function Methodology() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "منطق مدل — بدون جعبه سیاه"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-3xl text-sm leading-relaxed text-muted",
				children: "سؤال این نیست «کدام ارز امروز سبز است». سؤال این است: اگر بخواهید الان اسپات بخرید و معیارتان بیت‌کوین باشد، کدام دارایی از نظر قدرت نسبی، توکنومیکس، نقطه ورود، روند کلان و نقدشوندگی منطقی‌تر است. استیبل‌کوین، رپد و مشتق استیک حذف می‌شوند. اگر آلت‌ها جمعاً از بیت‌کوین عقب باشند، خود بیت‌کوین می‌تواند برنده باشد."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 grid gap-4 md:grid-cols-2",
				children: FACTORS.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "rounded-md bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: ["وزن ", f.w]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-fg",
							children: f.t
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs leading-relaxed text-muted",
							children: f.d
						})
					]
				}, f.t))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs leading-relaxed text-subtle",
				children: "داده زنده از CoinPaprika (رتبه، حجم، عرضه، دامیننس) و کندل روزانه بایننس برای ساخت سری جفت BTC، EMA ۲۰۰ و ساختار هفتگی. این ابزار توصیه مالی یا تضمین سود نیست. کریپتو پرریسک است و تصمیم نهایی با شماست."
			})
		]
	});
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
function BtcPairChart({ data, symbol }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (data.length < 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "سری ۳۰ روزه جفت بیت‌کوین برای این ارز کامل نبود."
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 w-full rounded-md bg-elevated" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-48 w-full",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
				data,
				margin: {
					top: 8,
					right: 12,
					left: 4,
					bottom: 4
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "t",
						hide: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						domain: ["auto", "auto"],
						width: 36,
						tick: {
							fill: "#6e6e77",
							fontSize: 10,
							fontFamily: "IBM Plex Mono"
						},
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: 100,
						stroke: "#6e6e77",
						strokeDasharray: "3 4",
						strokeOpacity: .5
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						contentStyle: {
							background: "#121214",
							border: "1px solid rgb(241 242 244 / 0.12)",
							borderRadius: 8,
							fontSize: 12,
							color: "#f1f2f4"
						},
						formatter: (value) => {
							return [`${(typeof value === "number" ? value : Number(value)).toFixed(2)}`, `${symbol}/BTC (شاخص ۱۰۰)`];
						},
						labelFormatter: (label) => `روز ${Number(label) + 1}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
						type: "monotone",
						dataKey: "v",
						stroke: "#d2d7de",
						strokeWidth: 1.6,
						dot: false,
						isAnimationActive: false
					})
				]
			})
		})
	});
}
function ChecklistCard({ items }) {
	const { pass, fail, unknown } = checklistPassCount(items);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "چک‌لیست ورود اسپات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-subtle",
				children: "پنج قاعده ثابت. سبز یعنی شرط برقرار است، نه اینکه معامله تضمین شده باشد."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "num text-xs text-muted",
				children: [
					pass,
					" از ",
					items.length,
					unknown ? ` · ${unknown} نامشخص` : "",
					fail ? ` · ${fail} رد` : ""
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
							children: item.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-0.5 text-xs text-subtle",
							children: item.desired
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs leading-relaxed text-muted",
							children: item.detail
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
function FactorBars({ factors }) {
	const ordered = [...factors].sort((a, b) => b.weight - a.weight);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex flex-col gap-4",
		children: ordered.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex flex-col gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: f.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-xs text-subtle",
						children: [
							"وزن ",
							(f.weight * 100).toFixed(0),
							"٪"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num text-sm text-fg",
						children: formatScore(f.score)
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-1.5 overflow-hidden rounded-full bg-elevated",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-full rounded-full bg-accent transition-[width] duration-500 ease-out",
						style: { width: `${Math.max(4, Math.min(100, f.score))}%` }
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs leading-relaxed text-muted",
					children: f.note
				})
			]
		}, f.key))
	});
}
function toneFor(n) {
	if (n > .001) return "up";
	if (n < -.001) return "down";
	return "neutral";
}
function PickPanel({ result }) {
	const { pick, runnerUp } = result;
	const confTone = result.confidence === "high" ? "up" : result.confidence === "low" ? "down" : "neutral";
	const coverage = result.klinesTried > 0 ? Math.round(result.klinesOk / result.universeSize * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: regimeTitle(result.regime) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, { children: ["دامیننس BTC", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num ms-1",
						children: [result.btcDominance.toFixed(1), "٪"]
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
						className: "text-xs tracking-wide text-subtle",
						children: "بهترین خرید اسپات الان"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [pick.symbol === "BTC" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bitcoin, {
								className: "size-8 text-accent",
								strokeWidth: 1.5
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, {
								className: "size-8 text-accent",
								strokeWidth: 1.5
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl font-medium tracking-tight text-fg md:text-4xl",
								children: pick.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num",
										children: pick.symbol
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2 text-subtle",
										children: "·"
									}),
									"رتبه بازار",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "num ms-1",
										children: ["#", pick.rank]
									}),
									pick.narrativeTagsFa[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mx-2 text-subtle",
										children: "·"
									}), pick.narrativeTagsFa[0]] }) : null
								]
							})] })]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-start md:text-end",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-subtle",
								children: "امتیاز اسپات"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "num text-4xl font-medium tracking-tight text-fg",
								children: formatScore(pick.score)
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "قیمت دلار",
								value: `$${formatUsd(pick.priceUsd)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "قیمت به بیت‌کوین",
								value: btcPriceLabel(pick.priceBtc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "۷ روز vs BTC",
								value: formatPct(pick.rs7d),
								tone: toneFor(pick.rs7d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "۳۰ روز vs BTC",
								value: pick.rs30d == null ? "—" : formatPct(pick.rs30d),
								tone: pick.rs30d == null ? "neutral" : toneFor(pick.rs30d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "MC / FDV",
								value: pick.mcFdv == null ? "—" : `${(pick.mcFdv * 100).toFixed(0)}٪`,
								tone: pick.mcFdv == null ? "neutral" : pick.mcFdv >= .7 ? "up" : pick.mcFdv < .5 ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "EMA ۲۰۰",
								value: pick.aboveEma200 === true ? "بالا" : pick.aboveEma200 === false ? "پایین" : "—",
								tone: pick.aboveEma200 === true ? "up" : pick.aboveEma200 === false ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "ساختار هفتگی",
								value: pick.weeklyStructure === "bull" ? "صعودی" : pick.weeklyStructure === "bear" ? "نزولی" : pick.weeklyStructure === "range" ? "رنج" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
								label: "گردش ۲۴س",
								value: `${(pick.turnover * 100).toFixed(2)}٪`,
								tone: pick.turnover >= .02 ? "up" : "neutral"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-3xl text-sm leading-relaxed text-muted",
						children: result.confidenceNote
					})
				]
			}),
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
								" (",
								runnerUp.symbol,
								") با امتیاز",
								" ",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-base font-medium text-fg",
							children: "شاخص جفت بیت‌کوین · ۳۰ روز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: "۱۰۰ = شروع بازه. خط چین، سطح شروع است. بالای ۱۰۰ یعنی نسبت به BTC جلو افتاده."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtcPairChart, {
								data: pick.pairSeries,
								symbol: pick.symbol
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"RSI ۱۴روزه:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: pick.rsi14 == null ? "—" : pick.rsi14.toFixed(0)
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-muted",
								children: [
									"۷ روز دلار:",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-fg",
										children: formatPctPoints(pick.pct7d)
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
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FactorBars, { factors: pick.factors })
					})
				]
			})
		]
	});
}
function Stat({ label, value, tone = "neutral" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated px-3 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: `num mt-1 text-sm md:text-base ${tone === "up" ? "text-up" : tone === "down" ? "text-down" : "text-fg"}`,
			children: value
		})]
	});
}
function PortfolioPanel({ sleeves }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-base font-medium text-fg",
			children: "پرتفوی پیشنهادی اسپات"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
			children: "حتی با بهترین تحلیل، تمرکز کل سرمایه روی یک آلت‌کوین ریسک بالایی دارد. مدل پیشنهادی: ۵۵٪ هسته BTC/ETH، ۳۰٪ لارج‌کپ، ۱۵٪ میدکپ."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-3",
			children: sleeves.map((sleeve) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "num text-xs text-subtle",
						children: [sleeve.targetPct, "٪"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
						className: "mt-1 text-sm text-fg",
						children: sleeve.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs leading-relaxed text-muted",
						children: sleeve.note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 flex flex-col gap-3",
						children: sleeve.legs.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-xs text-subtle",
							children: "در این آستین گزینه واجد شرایط نبود."
						}) : sleeve.legs.map((leg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-fg",
									children: leg.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "num text-xs text-subtle",
									children: [
										leg.symbol,
										" · #",
										leg.rank
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted",
									children: leg.reason
								})
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-end",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "num text-sm text-fg",
									children: [(leg.weight * 100).toFixed(1), "٪"]
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
var runSpotAnalysis = createServerFn({ method: "POST" }).handler(createSsrRpc("2975be20775612443781264b5ca2666618f65f485e3407bef4ba4edec84f952e"));
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
		runnerUp: result.runnerUp?.symbol ?? null
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
var STAGES = [
	"گرفتن رتبه، عرضه و حجم صد ارز برتر",
	"ساخت جفت بیت‌کوین و کندل ۲۰۰ روزه",
	"MC/FDV، EMA ۲۰۰، ساختار هفتگی و OBV",
	"وزن‌دهی فاکتورها، چک‌لیست و پرتفوی"
];
function Home() {
	const run = useServerFn(runSpotAnalysis);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [stage, setStage] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("pick");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [watched, setWatched] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		setHistory(loadHistory());
		setWatched(loadWatch());
	}, []);
	async function onAnalyze() {
		setStatus("loading");
		setError(null);
		setStage(0);
		setTab("pick");
		const timer = window.setInterval(() => {
			setStage((s) => Math.min(s + 1, STAGES.length - 1));
		}, 1100);
		try {
			const data = await run();
			setResult(data);
			setHistory(saveRun(data));
			setStatus("done");
		} catch (err) {
			setStatus("error");
			setError(err instanceof Error ? err.message : "تحلیل انجام نشد. دوباره تلاش کنید.");
		} finally {
			window.clearInterval(timer);
		}
	}
	const headerMeta = (0, import_react.useMemo)(() => {
		if (!result) return null;
		return `${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل`;
	}, [result]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "desk-grid min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), "میز اسپات · جفت بیت‌کوین · توکنومیکس"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "max-w-2xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-4xl font-medium tracking-tight text-fg md:text-5xl",
									children: "آلفا اسپات"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base leading-relaxed text-muted",
									children: "یک دکمه، صد ارز اول بازار. هر دارایی روی جفت بیت‌کوین، نسبت MC/FDV، روند هفتگی و نقدشوندگی سنجیده می‌شود تا بهترین خرید اسپات — یا خود بیت‌کوین — مشخص شود."
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								onClick: onAnalyze,
								disabled: status === "loading",
								className: "h-12 min-w-52 shrink-0",
								children: status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "در حال تحلیل"] }) : result ? "تحلیل دوباره" : "تحلیل ۱۰۰ ارز برتر"
							})]
						}),
						headerMeta ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: headerMeta
						}) : null
					]
				}),
				status === "idle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleState, {}) : null,
				status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-fg",
							children: STAGES[stage]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shimmer h-full w-2/3 rounded-full bg-accent/40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: "کندل ۲۰۰ روزه برای EMA و ساختار هفتگی گرفته می‌شود؛ کمی بیشتر از قبل طول می‌کشد."
						})
					]
				}) : null,
				status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: "تحلیل کامل نشد"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: error
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: onAnalyze,
							children: "تلاش دوباره"
						})
					]
				}) : null,
				status === "done" && result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]",
						children: [
							["pick", "انتخاب"],
							["table", "رتبه‌ها"],
							["portfolio", "پرتفوی"],
							["method", "روش"],
							["history", "سابقه"]
						].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTab(id),
							className: tab === id ? "h-11 min-w-20 flex-1 rounded-md bg-elevated px-3 text-sm text-fg" : "h-11 min-w-20 flex-1 rounded-md px-3 text-sm text-muted hover:text-fg",
							children: label
						}, id))
					}),
					tab === "pick" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PickPanel, { result }) : null,
					tab === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
						rows: result.top,
						picked: result.pick.symbol,
						watched,
						onToggleWatch: (symbol) => setWatched(toggleWatch(symbol))
					}) : null,
					tab === "portfolio" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PortfolioPanel, { sleeves: result.portfolio }) : null,
					tab === "method" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Methodology, {}) : null,
					tab === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryPanel, { runs: history }) : null
				] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t border-border pt-4 text-xs leading-relaxed text-subtle",
					children: "آلفا اسپات توصیه سرمایه‌گذاری نیست. مدل روی دادهٔ عمومی بازار کار می‌کند و می‌تواند اشتباه کند. مسئولیت معامله با شماست."
				})
			]
		})
	});
}
function IdleState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleCard, {
					k: "۰۱",
					t: "جفت BTC",
					d: "بازده هر ارز نسبت به بیت‌کوین محاسبه می‌شود. سبزِ دلاری اگر از BTC عقب باشد، امتیاز نمی‌گیرد."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleCard, {
					k: "۰۲",
					t: "MC / FDV",
					d: "اگر کمتر از نیمی از توکن‌ها در گردش باشد، آزادسازی فشار فروش می‌سازد. اولویت با نسبت بالای ۰٫۷ است."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleCard, {
					k: "۰۳",
					t: "روند کلان، نه سقف",
					d: "EMA ۲۰۰، ساختار هفتگی و RSI جلوِ خرید هیجانی را می‌گیرند. قدرت نسبی داغ بدون نقطه ورود، برنده نیست."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdleCard, {
					k: "۰۴",
					t: "هسته پرتفوی",
					d: "۵۵٪ بیت‌کوین و اتریوم، ۳۰٪ لارج‌کپ، ۱۵٪ میدکپ. اگر آلت‌ها ضعیف باشند خود بیت برنده است."
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Methodology, {})]
	});
}
function IdleCard({ k, t, d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "num text-xs text-subtle",
				children: k
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-fg",
				children: t
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: d
			})
		]
	});
}
//#endregion
export { Home as component };
