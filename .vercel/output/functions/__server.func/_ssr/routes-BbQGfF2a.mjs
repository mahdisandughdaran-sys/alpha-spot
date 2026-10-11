import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { U as isRedirect, b as require_jsx_runtime, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as confidenceTitle, l as regimeTitle, r as checklistPassCount, s as dominanceTitle, t as btcPriceLabel } from "./explain-B7DJSO3j.mjs";
import { n as VENUE_LABEL, o as normalizeVenueCall, t as VENUES } from "./venues-BFan2-LH.mjs";
import { a as ShieldAlert, c as LoaderCircle, d as Activity, i as ShieldCheck, l as KeyRound, o as Send, r as Star, s as Minus, t as X, u as Check } from "../_libs/lucide-react.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { a as Area, c as ReferenceLine, i as XAxis, l as ResponsiveContainer, n as LineChart, o as Line, r as YAxis, s as ReferenceArea, t as AreaChart, u as Tooltip } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BbQGfF2a.js
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
							children: "کلید قطع"
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
							className: "px-4 py-3 text-muted",
							children: run.killStatus === "SUSPENDED" ? "معلق" : run.killStatus === "HIGH_RISK" ? "حجم نصف" : run.killStatus === "NORMAL" ? "نرمال" : "—"
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
						children: kill.headline
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs leading-relaxed text-fg/80",
						children: kill.note
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-4 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "قیمت BTC",
								value: `$${formatUsd(kill.priceUsd)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "EMA ۲۰۰",
								value: kill.ema200 == null ? "—" : `$${formatUsd(kill.ema200)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "فاصله تا EMA",
								value: kill.distanceToEma == null ? "—" : formatPct(kill.distanceToEma)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$3, {
								label: "بازده ۴ هفته",
								value: kill.weeklyMomentum == null ? "—" : formatPct(kill.weeklyMomentum)
							})
						]
					})
				]
			})]
		})
	});
}
function Stat$3({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg/40 px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
			className: "text-xs text-fg/70",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
			className: "num mt-1 text-sm text-fg",
			children: value
		})]
	});
}
var BOX = {
	sm: "size-8",
	md: "size-10",
	lg: "size-14"
};
function CoinMark({ symbol, name, rank, size = "md" }) {
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
					children: name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "num inline-flex h-6 shrink-0 items-center rounded-sm bg-fg px-1.5 text-xs font-medium text-bg",
					children: symbol
				})]
			}), rank != null ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-0.5 text-xs text-subtle",
				children: ["رتبه بازار ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "num",
					children: ["#", rank]
				})]
			}) : null]
		})]
	});
}
function Leaderboard({ rows, picked, watched, onToggleWatch }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-end justify-between gap-3 p-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-medium text-fg",
					children: "رتبه‌بندی مدل"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-subtle",
					children: "امتیاز نهایی بعد از جریمه آنلاک است. سیگنال خرید با کلید قطع بیت‌کوین ممکن است معلق یا نصف‌حجم شود."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-2 px-3 pb-3 md:hidden",
				children: rows.map((row, i) => {
					const active = row.symbol === picked;
					const starred = watched.includes(row.symbol);
					const rsTone = row.rs7d > 0 ? "text-up" : row.rs7d < 0 ? "text-down" : "text-fg";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: active ? "rounded-lg bg-elevated p-3 shadow-[var(--shadow-border)]" : "rounded-lg bg-bg p-3 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
								"aria-label": starred ? "حذف از واچ‌لیست" : "افزودن به واچ‌لیست",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, {
									className: "size-4",
									fill: starred ? "currentColor" : "none"
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-3 grid grid-cols-3 gap-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "امتیاز"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: "num mt-1 text-fg",
									children: formatScore(row.score)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "۷ر vs BTC"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: `num mt-1 ${rsTone}`,
									children: formatPct(row.rs7d)
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-subtle",
									children: "قیمت"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
									className: "num mt-1 text-fg",
									children: ["$", formatUsd(row.priceUsd)]
								})] })
							]
						})]
					}, row.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "hidden overflow-x-auto md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[920px] text-sm",
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
								children: "آنلاک ۳۰ر"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-2 text-start font-medium",
								children: "سیگنال"
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
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
										symbol: row.symbol,
										name: row.name,
										rank: row.rank,
										size: "sm"
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
									className: "px-4 py-3",
									children: row.highDilution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-down",
										children: ["High Dilution", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "num ms-1",
											children: ["-", row.unlockPenalty]
										})]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "num text-xs text-muted",
										children: row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(1)}٪`
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-xs text-muted",
									children: row.buySignal === "suspended" ? "معلق" : row.buySignal === "reduced" ? "حجم ۵۰٪" : "باز"
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
			})
		]
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
		d: "اگر نسبت ارزش بازار به ارزش رقیق‌شده زیر ۰٫۵ باشد، آزادسازی توکن فشار فروش می‌سازد. اولویت با MC/FDV بالای ۰٫۷ است. جدا از این نسبت، کلیف ۳۰ روز آینده اگر از ۳٪ عرضه بگذرد ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌کند."
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-3 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: "کلید قطع بیت‌کوین",
						d: "زیر EMA ۲۰۰ روزانه یا ساختار هفتگی شدیداً نزولی (افت ۴ هفته بیش از ۸٪ یا شکست کف ۸ هفته) حجم را نصف می‌کند. هر دو با هم، خرید اسپات را معلق و وزن را به BTC برمی‌گرداند."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: "جریمه کلیف آنلاک",
						d: "آزادسازی ۳۰ روز آینده اگر از ۳٪ عرضه کل بگذرد، ۱۵، ۱۸ یا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌گیرد. بازه ۱۴ تا ۳۰ روز جدا نشان داده می‌شود."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: "خروج و چرخش",
						d: "شکست حمایت هفتگی ALT/BTC یا افت امتیاز به زیر ۶۰، سیگنال چرخش به بهترین گزینه واجد شرایط (امتیاز بالای ۶۸، بدون رقیق‌سازی) یا بیت‌کوین است."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layer, {
						t: "دفتر سفارش، فاندینگ و سود باز",
						d: "خرید ۱۰هزار دلاری روی دفتر بایننس سنجیده می‌شود. اسلیپیج بالای ۳۵ نقطه پایه یا عمق کم، خرید را معلق می‌کند. فاندینگ سالانه بالای ۳۰٪ حجم را نصف می‌کند. برای آلت خرد، جهش سود باز بالای ۲۵٪ یا نسبت لانگ/شورت بالای ۲٫۳ هم حجم را نصف می‌کند."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xs leading-relaxed text-subtle",
				children: "کندل، دفتر و مشتقات در دیتابیس کش می‌شوند تا محدودیت API داده را ناقص نکند. بک‌تست، مسیر هفتگی حدود سه سال گذشته را با همین امتیاز حساب می‌کند. تب وب‌هوک سیگنال را به تلگرام یا ربات خودتان می‌فرستد. تب صرافی سفارش اسپات را مستقیم روی نوبیتکس، والکس، اوام‌پی فینکس، بایننس یا بای‌بیت ثبت می‌کند و کلید را روی سرور نگه نمی‌دارد. داده از CoinPaprika، کندل و دفتر بایننس، فاندینگ و سود باز OKX، و تقویم CoinMarketCap است. این ابزار توصیه مالی یا تضمین سود نیست. تب فرصت‌ها مسیر دیگری است: ارزهایی که الان شرایط ورود ندارند، فقط اگر حمایت آزمون‌شده و سطح ابطال عددی داشته باشند به فهرست انتظار می‌روند. افت قیمت به‌تنهایی آنجا امتیاز نمی‌گیرد."
			})
		]
	});
}
function Layer({ t, d }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-bg p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-fg",
			children: t
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-xs leading-relaxed text-muted",
			children: d
		})]
	});
}
var EXIT_SCORE = 60;
var QUALIFIED_SCORE = 68;
function findCoin(coins, symbol) {
	const key = symbol.toUpperCase();
	return coins.find((c) => c.symbol === key);
}
function qualifiedTargets(coins, except) {
	return coins.filter((c) => c.symbol !== except && c.symbol !== "BTC" && c.score >= QUALIFIED_SCORE && !c.highDilution && c.buySignal === "open" && c.volume24h >= 8e6 && c.rank <= 100).sort((a, b) => b.score - a.score);
}
function advisePosition(holding, coins, kill) {
	const symbol = holding.symbol.toUpperCase();
	const coin = findCoin(coins, symbol);
	const btc = findCoin(coins, "BTC");
	const entry = holding.entryUsd;
	const pnlPct = coin && entry > 0 ? coin.priceUsd / entry - 1 : null;
	const size = Math.max(holding.sizeUsd, 0);
	const base = {
		symbol,
		name: coin?.name ?? symbol,
		score: coin?.score ?? null,
		priceUsd: coin?.priceUsd ?? null,
		pnlPct,
		pairSupportBroken: Boolean(coin && coin.symbol !== "BTC" && coin.pairSupportBroken),
		pairWeekly: coin?.pairWeekly ?? null,
		highDilution: coin?.highDilution ?? false
	};
	if (!coin) return {
		...base,
		action: "HOLD",
		reason: "این نماد در صد ارز اول اسکن‌شده نیست؛ بدون داده جفت BTC سیگنال خروج صادر نمی‌شود.",
		targetSymbol: null,
		targetName: null,
		suggestedSizeUsd: size
	};
	const broken = coin.symbol !== "BTC" && coin.pairSupportBroken;
	const weakScore = coin.score < EXIT_SCORE;
	const targets = qualifiedTargets(coins, coin.symbol);
	const rotateTo = (action, reason, suggested, dest) => ({
		...base,
		action,
		reason,
		targetSymbol: dest?.symbol ?? null,
		targetName: dest?.name ?? null,
		suggestedSizeUsd: suggested
	});
	if (kill.status === "SUSPENDED" && coin.symbol !== "BTC") return rotateTo("REBALANCE", "کلید قطع بیت‌کوین فعال است؛ خرید اسپات معلق است و سرمایه باید به سمت بیت‌کوین بچرخد.", size, btc ?? null);
	if (broken || weakScore) {
		const dest = kill.status === "HIGH_RISK" ? btc ?? targets[0] ?? null : targets[0] ?? btc ?? null;
		const why = broken ? "حمایت هفتگی ALT/BTC شکست؛ قدرت نسبی در برابر بیت‌کوین از دست رفته است." : `امتیاز مدل ${coin.score.toFixed(1)} زیر حد نصاب ${EXIT_SCORE} است.`;
		if (dest && dest.symbol !== coin.symbol) return rotateTo("REBALANCE", `${why} پیشنهاد چرخش به ${dest.symbol}.`, size, dest);
		return rotateTo("SELL", `${why} مقصد واجد شرایطی برای چرخش نماند؛ خروج پیشنهاد می‌شود.`, 0, null);
	}
	if (kill.status === "HIGH_RISK" && coin.symbol !== "BTC") return rotateTo("HOLD", "تز ورود هنوز سالم است، اما ریسک کلان بالا است و حجم پیشنهادی همین پوزیشن نصف می‌شود.", size * .5, null);
	if (coin.highDilution && coin.symbol !== "BTC") {
		const dest = targets[0] ?? btc ?? null;
		if (dest) return rotateTo("REBALANCE", `برچسب High Dilution Risk فعال است (${coin.unlockPenalty} امتیاز جریمه). چرخش به گزینه تمیزتر منطقی است.`, size, dest);
	}
	return rotateTo("HOLD", "امتیاز بالای حد نصاب است و حمایت هفتگی ALT/BTC نشکسته. نگهداری.", size, null);
}
function buildRebalancePlan(holdings, coins, kill) {
	const rows = holdings.map((h) => advisePosition(h, coins, kill));
	const bucket = /* @__PURE__ */ new Map();
	let rotateUsd = 0;
	let holdUsd = 0;
	let sellUsd = 0;
	for (const row of rows) {
		const size = holdings.find((h) => h.symbol.toUpperCase() === row.symbol)?.sizeUsd ?? 0;
		if (row.action === "HOLD") {
			holdUsd += row.suggestedSizeUsd;
			continue;
		}
		if (row.action === "SELL") {
			sellUsd += size;
			continue;
		}
		rotateUsd += size;
		if (!row.targetSymbol) {
			sellUsd += size;
			continue;
		}
		const prev = bucket.get(row.targetSymbol);
		const coin = findCoin(coins, row.targetSymbol);
		if (prev) prev.usd += size;
		else bucket.set(row.targetSymbol, {
			symbol: row.targetSymbol,
			name: row.targetName ?? row.targetSymbol,
			score: coin?.score ?? 0,
			usd: size,
			reason: row.targetSymbol === "BTC" ? "پناهگاه وقتی کلید قطع یا قدرت نسبی می‌شکند" : "برترین گزینه واجد شرایط با امتیاز بالای ۶۸ و بدون جریمه رقیق‌سازی"
		});
	}
	const destinations = [...bucket.values()].sort((a, b) => b.usd - a.usd);
	let note = "پایش روی پوزیشن‌های همین مرورگر است و سفارش واقعی ارسال نمی‌کند.";
	if (kill.status === "SUSPENDED") note = "کلید قطع فعال است؛ آلت‌های داخل سبد پیشنهاد چرخش به بیت‌کوین دارند.";
	else if (rotateUsd > 0) note = "سرمایه ضعیف‌شده برای چرخش به مقصدهای واجد شرایط نشانه‌گذاری شد.";
	else if (kill.status === "HIGH_RISK") note = "ریسک کلان بالا است؛ پوزیشن‌های سالم با نصف حجم پیشنهادی نگه داشته می‌شوند.";
	return {
		rows,
		destinations,
		rotateUsd,
		holdUsd,
		sellUsd,
		note
	};
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
function MonitorPanel({ result }) {
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
					children: "پایش سبد و چرخش"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-3xl text-sm leading-relaxed text-muted",
					children: "پوزیشن‌های اسپات خودتان را وارد کنید. اگر حمایت هفتگی ALT/BTC بشکند یا امتیاز زیر ۶۰ بیاید، سیگنال خروج و چرخش به برترین گزینه واجد شرایط صادر می‌شود. با کلید قطع، مقصد چرخش بیت‌کوین است."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-subtle",
					children: plan.note
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
						children: ["نماد", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
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
						children: ["قیمت ورود (دلار)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							value: entry,
							onChange: (event) => setEntry(event.target.value),
							placeholder: "100",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-1 text-xs text-subtle",
						children: ["اندازه (دلار)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
							children: "افزودن پوزیشن"
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-3 gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: "نگهداری پیشنهادی",
						v: `$${formatUsd(plan.holdUsd)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: "آماده چرخش",
						v: `$${formatUsd(plan.rotateUsd)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini$1, {
						k: "خروج نقد",
						v: `$${formatUsd(plan.sellUsd)}`
					})
				]
			}),
			plan.destinations.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-fg",
					children: "مقصد چرخش"
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
							children: dest.reason
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
				children: "هنوز پوزیشنی ثبت نشده. یک نماد از صد ارز اول، قیمت ورود و اندازه دلاری را اضافه کنید تا Hold / Sell / Rebalance زنده شود."
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
									children: [ACTION_FA[row.action], row.action === "REBALANCE" && row.targetSymbol ? ` → ${row.targetSymbol}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-3 grid grid-cols-2 gap-2 text-xs md:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "امتیاز",
										v: row.score == null ? "—" : formatScore(row.score)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "بازدهی",
										v: row.pnlPct == null ? "—" : formatPct(row.pnlPct)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "ALT/BTC هفتگی",
										v: row.symbol === "BTC" ? "معیار" : row.pairSupportBroken ? "شکست حمایت" : row.pairWeekly === "bull" ? "صعودی" : row.pairWeekly === "bear" ? "نزولی" : "خنثی / نامشخص"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
										k: "حجم پیشنهادی",
										v: `$${formatUsd(row.suggestedSizeUsd)}`
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs leading-relaxed text-muted",
								children: row.reason
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => remove(row.symbol),
								className: "mt-3 h-11 text-xs text-subtle hover:text-fg",
								children: "حذف از سبد"
							})
						]
					}, row.symbol);
				})
			})
		]
	});
}
function Mini$1({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: v
		})]
	});
}
function Field({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-subtle",
		children: k
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "num mt-1 text-fg",
		children: v
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
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (data.length < 3) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted",
		children: "سری ۳۰ روزه این ارز کامل نبود."
	});
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 w-full rounded-md bg-elevated" });
	const marked = buy && !buy.flat ? buy : null;
	const unit = mode === "usd" ? `${symbol} دلار، شاخص ۱۰۰` : `${symbol}/BTC، شاخص ۱۰۰`;
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
						contentStyle: {
							background: "var(--color-surface)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							fontSize: 12,
							color: "var(--color-fg)"
						},
						formatter: (value, _name, item) => {
							const n = typeof value === "number" ? value : Number(value);
							const day = Number(item?.payload?.t);
							const tag = marked && day === marked.index ? " · نقطه خرید" : "";
							return [`${n.toFixed(2)}${tag}`, unit];
						},
						labelFormatter: (label) => `روز ${Number(label) + 1}`
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
	const chartMode = pick.symbol === "BTC" ? "usd" : "pair";
	const usdPath = pick.spotIndex;
	const chartSeries = pick.symbol === "BTC" && usdPath && usdPath.length >= 5 ? usdPath : pick.pairSeries;
	const buy = findBestBuyPoint(chartSeries);
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
						children: result.spotBuys === "suspended" ? "خرید اسپات معلق است · پناهگاه" : result.spotBuys === "reduced" ? "بهترین خرید با نصف حجم" : "بهترین خرید اسپات الان"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
							symbol: pick.symbol,
							name: pick.name,
							rank: pick.rank,
							size: "lg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					pick.narrativeTagsFa[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: pick.narrativeTagsFa[0]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-6 grid grid-cols-2 gap-3 md:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "قیمت دلار",
								value: `$${formatUsd(pick.priceUsd)}`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "قیمت به بیت‌کوین",
								value: btcPriceLabel(pick.priceBtc)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "۷ روز vs BTC",
								value: formatPct(pick.rs7d),
								tone: toneFor(pick.rs7d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "۳۰ روز vs BTC",
								value: pick.rs30d == null ? "—" : formatPct(pick.rs30d),
								tone: pick.rs30d == null ? "neutral" : toneFor(pick.rs30d)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "MC / FDV",
								value: pick.mcFdv == null ? "—" : `${(pick.mcFdv * 100).toFixed(0)}٪`,
								tone: pick.mcFdv == null ? "neutral" : pick.mcFdv >= .7 ? "up" : pick.mcFdv < .5 ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "EMA ۲۰۰",
								value: pick.aboveEma200 === true ? "بالا" : pick.aboveEma200 === false ? "پایین" : "—",
								tone: pick.aboveEma200 === true ? "up" : pick.aboveEma200 === false ? "down" : "neutral"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "ساختار هفتگی",
								value: pick.weeklyStructure === "bull" ? "صعودی" : pick.weeklyStructure === "bear" ? "نزولی" : pick.weeklyStructure === "range" ? "رنج" : "—"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$2, {
								label: "گردش ۲۴س",
								value: `${(pick.turnover * 100).toFixed(2)}٪`,
								tone: pick.turnover >= .02 ? "up" : "neutral"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-3xl text-sm leading-relaxed text-muted",
						children: result.confidenceNote
					}),
					result.books.find((book) => book.symbol === pick.symbol) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-3xl text-xs leading-relaxed text-subtle",
						children: result.books.find((book) => book.symbol === pick.symbol)?.note
					}) : null
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
								children: chartMode === "usd" ? "قیمت دلاری بیت‌کوین · ۳۰ روز" : `جفت ${pick.symbol}/BTC · ۳۰ روز`
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs leading-relaxed text-subtle",
								children: chartMode === "usd" ? "۱۰۰ = شروع بازه. علامت BUY بهترین اصلاح این مسیر است." : "۱۰۰ = شروع بازه. بالای ۱۰۰ یعنی از بیت‌کوین جلو افتاده. BUY بهترین نقطه خرید همین ارز است."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "num shrink-0 rounded-sm bg-fg px-2 py-1 text-xs text-bg",
								children: pick.symbol
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BtcPairChart, {
								data: chartSeries,
								symbol: pick.symbol,
								buy,
								mode: chartMode
							})
						}),
						buy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs text-subtle",
							children: "سری قیمت برای علامت‌گذاری نقطه خرید کافی نبود."
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
function Stat$2({ label, value, tone = "neutral" }) {
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
function canStore$2() {
	return typeof window !== "undefined" && typeof localStorage !== "undefined";
}
function loadDeskSettings() {
	if (!canStore$2()) return { ...defaultDeskSettings };
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
	if (!canStore$2()) return;
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
	if (!canStore$2()) return [];
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
	if (canStore$2()) try {
		localStorage.setItem(ORDERS, JSON.stringify(next));
	} catch {}
	return next;
}
function loadAlerts() {
	if (!canStore$2()) return [];
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
	if (canStore$2()) try {
		localStorage.setItem(ALERTS, JSON.stringify(next));
	} catch {}
	return next;
}
function seenMap() {
	if (!canStore$2()) return {};
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
	if (!canStore$2()) return;
	const map = seenMap();
	map[id] = (/* @__PURE__ */ new Date()).toISOString();
	const entries = Object.entries(map).slice(-80);
	try {
		localStorage.setItem(SEEN, JSON.stringify(Object.fromEntries(entries)));
	} catch {}
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
var runVenue = createServerFn({ method: "POST" }).validator((input) => normalizeVenueCall(input)).handler(createSsrRpc("eed7d3073443c33758c00a8a490ad465452ee6d3f46e47d1fde88dd2a65e227a"));
function SignalButton({ result }) {
	const send = useServerFn(dispatchDeskSignal);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [note, setNote] = (0, import_react.useState)(null);
	const settings = loadDeskSettings();
	const preview = planOrders(result.portfolio, result.top, result.books, settings.capitalUsd);
	const total = preview.reduce((sum, row) => sum + row.notionalUsd, 0);
	async function onClick() {
		setBusy(true);
		setNote(null);
		const title = `آلفا اسپات · سبد ${result.pick.symbol}`;
		const text = preview.map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")}`).join("\n");
		try {
			const res = await send({ data: {
				title,
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
			setNote(err instanceof Error ? err.message : "ارسال انجام نشد.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-fg",
				children: "ارسال همین سبد"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs leading-relaxed text-muted",
				children: [
					"با سرمایه فرضی ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: ["$", formatUsd(settings.capitalUsd)]
					}),
					" حدود",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "num",
						children: ["$", formatUsd(total)]
					}),
					" سفارش کاغذی ساخته می‌شود. اگر در تب اجرا وب‌هوک یا تلگرام را گذاشته باشید، همان سیگنال هم می‌رود. کلید صرافی اینجا ذخیره نمی‌شود."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4 h-11",
				disabled: busy || preview.length === 0,
				onClick,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "ثبت و ارسال سیگنال"]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: note
			}) : null
		]
	});
}
function PortfolioPanel({ result }) {
	const sleeves = result.portfolio;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "پرتفوی پیشنهادی اسپات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: "حتی با بهترین تحلیل، تمرکز کل سرمایه روی یک آلت‌کوین ریسک بالایی دارد. مدل پایه ۵۵٪ هسته، ۳۰٪ لارج‌کپ و ۱۵٪ میدکپ است. اگر کلید قطع فعال باشد وزن آلت صفر می‌شود؛ در ریسک بالا حجم آلت‌ها نصف و مابه‌التفاوت به بیت‌کوین می‌رود."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
										symbol: leg.symbol,
										name: leg.name,
										rank: leg.rank,
										size: "sm"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted",
										children: leg.reason
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignalButton, { result })
		]
	});
}
function whenLabel(row) {
	if (!row.unlockDate) return "—";
	const date = (/* @__PURE__ */ new Date(`${row.unlockDate}T00:00:00Z`)).toLocaleDateString("fa-IR", {
		month: "short",
		day: "numeric"
	});
	return row.unlockDays == null ? date : `${date} · ${row.unlockDays} روز`;
}
function UnlocksPanel({ rows, source, matched }) {
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
					children: "آزادسازی پیشِ رو"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 max-w-3xl text-xs leading-relaxed text-subtle",
					children: [
						"کلیف‌های ۱۴ تا ۳۰ روز و مجموع آزادسازی ۳۰ روز آینده روی صد ارز اول. اگر بیش از ۳٪ عرضه در این پنجره باشد، ۱۵ تا ۲۰ امتیاز از نمره کل کم می‌شود و برچسب High Dilution Risk می‌خورد. منبع:",
						" ",
						source === "coinmarketcap" ? "تقویم عمومی CoinMarketCap (همان استاندارد کلیف/خطی DefiLlama؛ endpoint انتشار DefiLlama الان پولی است)." : "تقویم الان در دسترس نیست.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: matched
						}),
						" نماد برنامه فعال داشتند."
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-3 gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: "ارز",
							v: String(alts.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: "جریمه",
							v: String(penalized)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mini, {
							k: "کلیف",
							v: String(cliffs)
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-lg bg-elevated p-1",
					children: [
						["all", "همه"],
						["penalty", "جریمه‌شده"],
						["cliff", "کلیف‌مانند"]
					].map(([id, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setFilter(id),
						className: filter === id ? "h-11 flex-1 rounded-md bg-surface px-3 text-sm text-fg" : "h-11 flex-1 rounded-md px-3 text-sm text-muted",
						children: label
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
							children: "ارز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "آنلاک بعدی"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "٪ عرضه ۳۰روز"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "کلیف"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "جریمه"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-4 py-2 text-start font-medium",
							children: "حجم"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
					className: "border-t border-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 6,
						className: "px-4 py-6 text-sm text-muted",
						children: "در این فیلتر رویدادی نیست."
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
							children: whenLabel(row)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-4 py-3 text-fg",
							children: row.unlockPct30d == null ? "—" : `${row.unlockPct30d.toFixed(2)}٪`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3 text-muted",
							children: row.unlockCliff ? "بله" : "خیر"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-4 py-3",
							children: row.highDilution ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex rounded-full bg-down-dim px-2 py-1 text-xs text-down",
								children: ["High Dilution · ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "num ms-1",
									children: ["-", row.unlockPenalty]
								})]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: "بدون جریمه"
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-elevated px-3 py-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: v
		})]
	});
}
function BacktestPanel() {
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
			setError(err instanceof Error ? err.message : "بک‌تست انجام نشد.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-end md:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-medium text-fg",
					children: "بک‌تست سه ساله"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
					children: "اگر هر هفته با همین مدل اسپات بین بیت‌کوین و آلت‌های نقدشونده جابه‌جا می‌شدید، بازده و وین‌ریت مسیر تاریخی چه بود. این آینده را تضمین نمی‌کند."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "h-11 shrink-0",
					onClick: onRun,
					disabled: status === "loading",
					children: status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), "در حال خواندن تاریخ"] }) : "اجرای بک‌تست"
				})]
			}),
			status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-down",
				children: error
			}) : null,
			status === "done" && report && report.weeks > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: report.note
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-3 md:grid-cols-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "بازده مدل",
							value: formatPct(report.totalReturn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "بازده بیت‌کوین",
							value: formatPct(report.btcReturn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "وین‌ریت هفته‌ها",
							value: formatPct(report.winRate, 0)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "بیشترین افت",
							value: formatPct(report.maxDrawdown)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "هفته‌ها",
							value: String(report.weeks)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "جابه‌جایی",
							value: String(report.trades)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "افت BTC",
							value: formatPct(report.btcMaxDrawdown)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat$1, {
							label: "روز داده",
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
										const label = name === "equity" ? "مدل" : "بیت‌کوین";
										return [`${((n - 1) * 100).toFixed(1)}٪`, label];
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
								children: [row.periods, " هفته"]
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
						children: line
					}, line))
				})
			] }) : null
		]
	});
}
function Stat$1({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-sm text-fg",
			children: value
		})]
	});
}
var GATE = {
	pass: "عبور",
	thin: "نازک",
	crowded: "شلوغ",
	levered: "اهرم",
	unknown: "نامشخص"
};
function gateClass(gate) {
	if (gate === "pass") return "text-up";
	if (gate === "thin") return "text-down";
	if (gate === "unknown") return "text-subtle";
	return "text-warn";
}
function DepthPanel({ books }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "عمق دفتر و مشتقات"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: "خرید ۱۰هزار دلاری روی دفتر اسپات بایننس سنجیده می‌شود. سود باز، تغییر ۲۴ساعته و نسبت لانگ به شورت از قرارداد دائمی OKX می‌آید و اگر آنجا جواب ندهد از بایننس فیوچرز. آلت خرد با سود باز داغ، حجم اسپات را نصف می‌کند؛ دفتر نازک خرید را معلق می‌کند."
			})] }),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]",
				children: "هنوز دفتر سفارشی برای این اجرا خوانده نشده."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-right text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-subtle",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "نماد"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "وضعیت"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "اسلیپیج"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "عمق ۱۰bps"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "فاندینگ سال"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "سود باز"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "۲۴س"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-3 py-3 font-medium",
								children: "لانگ/شورت"
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
									className: "mr-2 text-xs text-subtle",
									children: "خرد"
								}) : null]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: `px-3 py-3 ${gateClass(book.gate)}`,
								children: GATE[book.gate]
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
					book.note
				]
			}, `${book.symbol}-note`))
		]
	});
}
function ExecutePanel({ result }) {
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
		const title = kind === "test" ? "آلفا اسپات · آزمایش اتصال" : `آلفا اسپات · سبد ${result.pick.symbol}`;
		const text = kind === "test" ? "اگر این پیام را می‌بینید، وب‌هوک یا تلگرام وصل است. سفارشی روی صرافی ثبت نشده." : rows.map((row) => `${row.side} ${row.symbol} $${row.notionalUsd.toLocaleString("en-US")} (${(row.weight * 100).toFixed(1)}٪)`).join("\n");
		try {
			const res = await send({ data: {
				title,
				text: text || title,
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
			setNote(err instanceof Error ? err.message : "ارسال انجام نشد.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-base font-medium text-fg",
				children: "اجرای سیگنال"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: "این تب سفارش را داخل صرافی ثبت نمی‌کند. سبد را کاغذی روی همین دستگاه می‌نویسد و، اگر وب‌هوک یا ربات تلگرام را داده باشید، همان JSON را می‌فرستد. ثبت مستقیم در تب صرافی است."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["سرمایه فرضی (دلار)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.capitalUsd,
							onChange: (e) => patch({ capitalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["آستانه هشدار امتیاز", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: "num h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.scoreFloor,
							onChange: (e) => patch({ scoreFloor: Math.max(0, Math.min(100, Number(e.target.value) || 0)) })
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle md:col-span-2",
						children: ["وب‌هوک https (تریدینگ‌ویو، ربات شخصی، صرافی)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							placeholder: "https://",
							value: settings.webhookUrl,
							onChange: (e) => patch({ webhookUrl: e.target.value }),
							dir: "ltr"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["توکن ربات تلگرام", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none",
							value: settings.telegramToken,
							onChange: (e) => patch({ telegramToken: e.target.value.trim() }),
							dir: "ltr",
							autoComplete: "off"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["شناسه چت", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
					}), "هشدار کلید قطع"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: settings.alertScore,
						onChange: (e) => patch({ alertScore: e.target.checked })
					}), "هشدار افت امتیاز"]
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
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "ثبت کاغذی و ارسال سیگنال"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					className: "h-11",
					disabled: busy,
					onClick: () => onSend("test"),
					children: "آزمایش اتصال"
				})]
			}),
			note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: note
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "ghost",
				className: "h-11 self-start px-0",
				onClick: () => {
					if (typeof Notification === "undefined") return;
					Notification.requestPermission();
				},
				children: "اجازه اعلان مرورگر"
			}),
			orders.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "دفتر کاغذی"
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: row.status === "sent" ? "ارسال شد" : row.status === "failed" ? "مقصد خطا داد" : "فقط کاغذی" })]
				}, row.id))
			})] }) : null,
			alerts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: "هشدارهای اخیر"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-2 flex flex-col gap-2",
				children: alerts.slice(0, 5).map((alert) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "text-xs leading-relaxed text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: alert.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-1 block",
						children: alert.text
					})]
				}, alert.id))
			})] }) : null
		]
	});
}
var KEY$2 = "alpha-spot-venues-v1";
var emptyVault = {
	venue: "nobitex",
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
		const venue = VENUES.includes(parsed.venue) ? parsed.venue : "nobitex";
		const quote = parsed.quote === "IRT" ? "IRT" : "USDT";
		return {
			...emptyVault,
			venue,
			quote,
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
function VenuePanel({ result }) {
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
	const needsSecret = vault.venue === "binance" || vault.venue === "bybit" || vault.venue === "nobitex";
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
				detail: err instanceof Error ? err.message : "درخواست انجام نشد.",
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
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KeyRound, { className: "size-4" }), "ثبت مستقیم روی صرافی"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm leading-relaxed text-muted",
				children: "کلید فقط در همین مرورگر می‌ماند و با هر درخواست فرستاده می‌شود؛ در دیتابیس نوشته نمی‌شود و در پاسخ برنمی‌گردد. پیش‌نمایش هیچ سفارشی نمی‌فرستد. ثبت واقعی پول جابه‌جا می‌کند و سقف هر سفارش ۵۰هزار دلار است."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-wrap gap-2",
				children: VENUES.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => patch({ venue: id }),
					className: vault.venue === id ? "h-11 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "h-11 rounded-md px-3 text-sm text-muted hover:text-fg",
					children: VENUE_LABEL[id]
				}, id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [vault.venue === "nobitex" ? "توکن یا کلید عمومی" : "کلید API", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "off",
							className: inputClass,
							value: vault.key,
							onChange: (e) => patch({ key: e.target.value })
						})]
					}),
					needsSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: [vault.venue === "nobitex" ? "کلید خصوصی Ed25519 (اگر توکن قدیمی دارید خالی بگذارید)" : "کلید مخفی", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "password",
							autoComplete: "off",
							className: inputClass,
							value: vault.secret,
							onChange: (e) => patch({ secret: e.target.value })
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["حجم به دلار", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: inputClass,
							value: vault.notionalUsd,
							onChange: (e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}),
					needsSecret ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["حجم به دلار", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: inputClass,
							value: vault.notionalUsd,
							onChange: (e) => patch({ notionalUsd: Math.max(0, Number(e.target.value) || 0) })
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["نماد", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: inputClass,
							value: symbol,
							onChange: (e) => setSymbol(e.target.value.toUpperCase())
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["بازار تسویه", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: inputClass,
							value: vault.quote,
							onChange: (e) => patch({ quote: e.target.value === "IRT" ? "IRT" : "USDT" }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "USDT",
								children: "تتر"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "IRT",
								children: "تومان / ریال"
							})]
						})]
					}),
					vault.quote === "IRT" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex flex-col gap-2 text-xs text-subtle",
						children: ["نرخ هر تتر به تومان", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							inputMode: "decimal",
							className: inputClass,
							value: vault.tomanPerUsdt || "",
							onChange: (e) => patch({ tomanPerUsdt: Math.max(0, Number(e.target.value) || 0) })
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-subtle",
				children: [row ? `${row.name} · ${row.priceUsd.toLocaleString("en-US")} دلار · امتیاز ${row.score.toFixed(1)}` : "این نماد در جدول همین تحلیل نیست؛ قیمت دلار برای تبدیل حجم لازم است.", buysSuspended ? " کلید قطع بیت‌کوین خرید زنده را بسته است." : ""]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy !== null,
						onClick: () => go("probe"),
						children: busy === "probe" ? "در حال اتصال" : "آزمایش موجودی"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						disabled: busy !== null || !row,
						onClick: () => go("preview"),
						children: busy === "preview" ? "در حال ساخت" : "پیش‌نمایش سفارش"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setSide(side === "BUY" ? "SELL" : "BUY"),
						className: "h-11 rounded-md bg-elevated px-3 text-sm text-fg",
						children: side === "BUY" ? "خرید" : "فروش"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex flex-col gap-2 text-xs text-subtle",
				children: ["برای ثبت واقعی، نماد را دوباره بنویسید", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
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
				children: busy === "place" ? "در حال ثبت" : "ثبت سفارش واقعی"
			}),
			res ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: res.ok ? "text-sm text-up" : "text-sm text-down",
						children: res.detail
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
function canStore$1() {
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
	if (!canStore$1()) return [];
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
	if (canStore$1()) try {
		localStorage.setItem(SNAP, JSON.stringify(next));
	} catch {}
	return next;
}
function loadOppAlerts() {
	if (!canStore$1()) return [];
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
	if (canStore$1()) try {
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
		if (row.status === "approaching" && old?.status !== "approaching") push("approaching", `${row.symbol} به محدوده نزدیک شده`, `${row.summary} نزدیک شدن به‌تنهایی تأیید خرید نیست.`);
		if ((row.status === "in-zone" || row.status === "confirmed" || row.status === "actionable") && old && old.status !== "in-zone" && old.status !== "confirmed" && old.status !== "actionable") push("entered", `${row.symbol} وارد محدوده شده`, "قیمت به باند رسیده است. تا تأیید RSI یا MACD این یک ورود قطعی نیست.");
		if ((row.status === "confirmed" || row.status === "actionable") && old?.status !== "confirmed" && old?.status !== "actionable") push("confirmed", `${row.symbol} شرایط تأیید را گرفته`, row.summary);
		if (row.status === "invalidated" && old?.status !== "invalidated") push("invalidated", `سناریوی ${row.symbol} نامعتبر شد`, row.summary);
		if (row.parts.some((part) => part.key === "volume" && part.score <= 30) && !old?.volumeZNote) push("shock", `حجم یا فشار غیرعادی در ${row.symbol}`, row.parts.find((part) => part.key === "volume")?.note ?? "حجم از حالت عادی خارج شده است.");
		if (old && Math.abs(row.score - old.score) >= 8) push("score-shift", `امتیاز فرصت ${row.symbol} تغییر کرد`, `از ${old.score.toFixed(1)} به ${row.score.toFixed(1)}. دلیل را در جزئیات عوامل ببینید، نه در درصد افت قیمت.`);
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
			title: `${row.symbol} به محدوده نزدیک است`,
			text: `آخرین قیمت ${price} و سقف محدوده ${row.zoneHigh.toPrecision(4)} است. این نزدیکی تأیید خرید نیست.`
		});
		else if (price <= row.zoneHigh && price >= row.zoneLow) out.push({
			id: `${row.symbol}:entered:${tag}:${day}`,
			at,
			symbol: row.symbol,
			kind: "entered",
			title: `${row.symbol} داخل محدوده است`,
			text: "قیمت لحظه‌ای وارد باند شده. تأیید هنوز به کندل روزانه، RSI یا MACD نیاز دارد."
		});
		else if (row.invalidation != null && price < row.invalidation) out.push({
			id: `${row.symbol}:invalidated:${tag}:${day}`,
			at,
			symbol: row.symbol,
			kind: "invalidated",
			title: `هشدار اولیه ابطال ${row.symbol}`,
			text: "قیمت لحظه‌ای زیر سطح ابطال است. ابطال قطعی فقط با بسته شدن روزانه زیر همین سطح ثبت می‌شود."
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "محدوده",
						v: `${fmt(row.zone.low)} – ${fmt(row.zone.high)}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "ابطال",
						v: fmt(row.zone.invalidation)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "نرخ برد",
						v: report.winRate == null ? "—" : formatPct(report.winRate, 0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "میانگین R",
						v: report.avgR == null ? "—" : report.avgR.toFixed(2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "بازده فرضی",
						v: report.totalReturn == null ? "—" : formatPct(report.totalReturn)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
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
function Stat({ k, v }) {
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
var STAGES = [
	"گرفتن رتبه، عرضه و حجم صد ارز برتر",
	"ساخت جفت بیت‌کوین، EMA ۲۰۰ و ساختار هفتگی",
	"محدوده حمایت، تأیید و ابطال برای فهرست انتظار",
	"کلید قطع بیت‌کوین، آنلاک، دفتر سفارش، سود باز و فاندینگ",
	"امتیاز، تعلیق سیگنال و پرتفوی"
];
function Home() {
	const run = useServerFn(runSpotAnalysis);
	const pulse = useServerFn(checkDeskPulse);
	const quotes = useServerFn(checkOpportunityQuotes);
	const sendAlert = useServerFn(dispatchDeskSignal);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const [stage, setStage] = (0, import_react.useState)(0);
	const [result, setResult] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [tab, setTab] = (0, import_react.useState)("pick");
	const [history, setHistory] = (0, import_react.useState)([]);
	const [watched, setWatched] = (0, import_react.useState)([]);
	const [flash, setFlash] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setHistory(loadHistory());
		setWatched(loadWatch());
	}, []);
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
			title: `امتیاز ${result.pick.symbol} زیر ${settings.scoreFloor}`,
			text: `امتیاز فعلی ${result.pick.score.toFixed(1)} است.`
		});
		for (const symbol of watched) {
			const row = result.top.find((item) => item.symbol === symbol);
			if (row && row.score < settings.scoreFloor) jobs.push({
				id: `watch:${symbol}:${day}`,
				title: `${symbol} در دیده‌بان زیر آستانه است`,
				text: `امتیاز ${row.score.toFixed(1)}.`
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
				if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(job.title, { body: job.text });
				if (settings.webhookUrl || settings.telegramToken) try {
					await sendAlert({ data: {
						title: job.title,
						text: job.text,
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
				if (typeof Notification !== "undefined" && Notification.permission === "granted") new Notification(alert.title, { body: alert.text });
				if (settings.webhookUrl || settings.telegramToken) try {
					await sendAlert({ data: {
						title: alert.title,
						text: alert.text,
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
						title: beat.headline,
						text: beat.note,
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
							title: alert.title,
							text: alert.text,
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
		return `${result.universeSize} ارز از صد تای اول — استیبل و رپد حذف شده · ${result.klinesOk} کندل کامل · ${result.dataCache === "live" ? "داده زنده" : result.dataCache === "memory" ? "از حافظه" : "از کش ذخیره‌شده"} · کش سرور ${result.cacheKlines ?? 0} کندل`;
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
							className: "flex items-center justify-between gap-3 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Activity, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num tracking-widest",
									children: "ALPHA SPOT"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "میز اسپات · جفت بیت‌کوین" })]
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
									children: "هر ارز با نمادش دیده می‌شود. مدل صد دارایی اول را در برابر بیت‌کوین می‌سنجد، و جدا از آن فرصت‌هایی را که هنوز آماده نیستند ولی محدوده و شرط ابطال دارند زیر نظر می‌گیرد."
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
						}) : null,
						flash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-warn",
							children: flash
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KillSwitchBanner, { kill: result.killSwitch }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SymbolTape, {
						rows: result.top,
						picked: result.pick.symbol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex gap-1 overflow-x-auto rounded-lg bg-surface p-1 shadow-[var(--shadow-border)]",
						children: [
							["pick", "انتخاب"],
							["opportunity", "فرصت‌ها"],
							["table", "رتبه‌ها"],
							["unlocks", "آنلاک"],
							["portfolio", "پرتفوی"],
							["monitor", "پایش سبد"],
							["backtest", "بک‌تست"],
							["depth", "عمق"],
							["execute", "وب‌هوک"],
							["venue", "صرافی"],
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
					tab === "opportunity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpportunityPanel, { board: result.opportunities }) : null,
					tab === "table" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaderboard, {
						rows: result.top,
						picked: result.pick.symbol,
						watched,
						onToggleWatch: (symbol) => setWatched(toggleWatch(symbol))
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
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "نمادهایی که میز در برابر بیت‌کوین می‌سنجد"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 flex gap-2 overflow-x-auto pb-1",
					children: MAJORS.map(([symbol, name]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "min-w-40 shrink-0 rounded-lg bg-elevated px-3 py-3 shadow-[var(--shadow-border)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
							symbol,
							name,
							size: "sm"
						})
					}, symbol))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
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
						t: "سه لایه ریسک",
						d: "کلید قطع BTC، جریمه آنلاک بالای ۳٪ عرضه، و پایش خروج اگر ALT/BTC بشکند یا امتیاز زیر ۶۰ بیاید."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Methodology, {})
		]
	});
}
function SymbolTape({ rows, picked }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-subtle",
		children: "ده ارز اول مدل، هر کدام با نماد"
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 flex gap-2 overflow-x-auto pb-1",
		children: rows.slice(0, 10).map((row, i) => {
			const on = row.symbol === picked;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: on ? "min-w-48 shrink-0 rounded-lg bg-elevated px-3 py-3 shadow-[var(--shadow-border-hover)]" : "min-w-48 shrink-0 rounded-lg bg-surface px-3 py-3 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex items-center justify-between text-xs text-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "num",
						children: i + 1
					}), on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: "انتخاب"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "رتبه" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
					symbol: row.symbol,
					name: row.name,
					size: "sm"
				})]
			}, row.id);
		})
	})] });
}
var MAJORS = [
	["BTC", "بیت‌کوین"],
	["ETH", "اتریوم"],
	["SOL", "سولانا"],
	["BNB", "بی‌ان‌بی"],
	["XRP", "ریپل"],
	["TON", "تون"],
	["LINK", "چین‌لینک"],
	["AVAX", "آوالانچ"],
	["SUI", "سویی"],
	["NEAR", "نیر"]
];
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
