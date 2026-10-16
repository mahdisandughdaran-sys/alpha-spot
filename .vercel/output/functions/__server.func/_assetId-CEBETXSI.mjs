import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./_ssr/ssr.mjs";
import { g as ArrowLeft, h as ArrowRight, u as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as Route, r as useI18n } from "./_ssr/router-CIr5we5N.mjs";
import { a as createSsrRpc, d as useServerFn, n as CoinMark, o as formatPct, r as LocaleSwitch, t as Button, u as timeAgoFa } from "./_ssr/createSsrRpc-BE3GNm0S.mjs";
import { n as getSpotAsset, t as SPOT_ASSETS } from "./_ssr/spot-assets-CW_rSYyd.mjs";
import { n as formatSpotUsd } from "./_ssr/spot-plan-D4kQBukp.mjs";
import { a as YAxis, h as Tooltip, l as ReferenceArea, m as ResponsiveContainer, o as XAxis, s as Area, t as AreaChart, u as ReferenceLine } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_assetId-CEBETXSI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SpotPlanChart({ plan }) {
	const { tr } = useI18n();
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-72 w-full rounded-md bg-elevated" });
	const lows = plan.chart.map((point) => point.l);
	const highs = plan.chart.map((point) => point.h);
	const extra = [
		plan.entry,
		plan.buyFrom,
		plan.buyTo,
		plan.takeProfit,
		plan.invalidation,
		plan.price
	];
	const min = Math.min(...lows, ...extra);
	const max = Math.max(...highs, ...extra);
	const pad = (max - min) * .06 || plan.price * .02;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-72 w-full",
		dir: "ltr",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data: plan.chart,
				margin: {
					top: 16,
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
						width: 68,
						tick: {
							fill: "var(--color-subtle)",
							fontSize: 10,
							fontFamily: "IBM Plex Mono"
						},
						tickFormatter: (value) => formatSpotUsd(value).replace("$", ""),
						axisLine: false,
						tickLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceArea, {
						y1: plan.buyFrom,
						y2: plan.buyTo,
						fill: "var(--color-up)",
						fillOpacity: .14
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: plan.invalidation,
						stroke: "var(--color-down)",
						strokeDasharray: "4 4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: plan.takeProfit,
						stroke: "var(--color-warn)",
						strokeDasharray: "4 4"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReferenceLine, {
						y: plan.entry,
						stroke: "var(--color-up)",
						strokeWidth: 1.75
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { stroke: "var(--color-border-strong)" },
						content: ({ active, payload }) => {
							if (!active || !payload?.length) return null;
							const point = payload[0]?.payload;
							if (!point) return null;
							const when = new Date(point.time);
							const stamp = Number.isNaN(when.getTime()) ? "" : when.toLocaleDateString("en-US", {
								month: "short",
								day: "numeric",
								timeZone: "UTC"
							});
							const onEntry = plan.touchIndex != null && point.t === plan.touchIndex;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "glass-pop rounded-lg px-3 py-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-subtle",
										children: stamp
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "num mt-1 text-sm text-fg",
										children: formatSpotUsd(point.c)
									}),
									onEntry ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-up",
										children: tr("لمس بهترین ورود", "Touched the best entry")
									}) : null
								]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "c",
						stroke: "var(--color-fg)",
						strokeWidth: 1.75,
						fill: "var(--color-fg)",
						fillOpacity: .06,
						isAnimationActive: false,
						dot: (props) => {
							const { cx, cy, payload } = props;
							if (cx == null || cy == null || plan.touchIndex == null || payload?.t !== plan.touchIndex) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", {}, `plain-${payload?.t ?? cx}`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx,
								cy,
								r: 16,
								fill: "var(--color-up)",
								opacity: .22
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
								cx,
								cy,
								r: 5.5,
								fill: "var(--color-up)",
								stroke: "var(--color-bg)",
								strokeWidth: 2
							})] }, `entry-${payload.t}`);
						}
					})
				]
			})
		})
	});
}
function SpotLevelRuler({ plan }) {
	const { tr } = useI18n();
	const min = Math.min(plan.invalidation, plan.price, plan.entry, plan.buyFrom);
	const span = Math.max(plan.takeProfit, plan.price, plan.entry, plan.buyTo) - min || 1;
	const at = (value) => Math.min(100, Math.max(0, (value - min) / span * 100));
	const left = at(plan.buyFrom);
	const right = at(plan.buyTo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-10",
		dir: "ltr",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-4 h-1.5 rounded-full bg-elevated" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute top-4 h-1.5 rounded-full bg-up-dim",
				style: {
					left: `${left}%`,
					width: `${Math.max(right - left, 1.2)}%`
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulerDot, {
				at: at(plan.invalidation),
				tone: "bg-down"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulerDot, {
				at: at(plan.entry),
				tone: "bg-up"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulerDot, {
				at: at(plan.price),
				tone: "bg-fg"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RulerDot, {
				at: at(plan.takeProfit),
				tone: "bg-warn"
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
		className: "flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				tone: "bg-up",
				label: tr("بهترین ورود", "Best entry")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				tone: "bg-fg",
				label: tr("قیمت الان", "Price now")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				tone: "bg-warn",
				label: tr("فروش اگر بالا رد شد", "Sell if it crosses up")
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				tone: "bg-down",
				label: tr("فروش اگر پایین رد شد", "Sell if it crosses down")
			})
		]
	})] });
}
function RulerDot({ at, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `absolute top-3 size-3.5 rounded-full ${tone} shadow-[var(--shadow-border)]`,
		style: {
			left: `${at}%`,
			transform: "translateX(-50%)"
		}
	});
}
function Legend({ tone, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${tone}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label })]
	});
}
var loadSpotDesk = createServerFn({ method: "POST" }).validator((input) => {
	const asset = getSpotAsset(String(input?.assetId ?? ""));
	if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
	if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
	return { assetId: asset.id };
}).handler(createSsrRpc("fe1f268360652ffd8c110e19f0058a6289058902cc00444298fe7779506355bb"));
function SpotDeskPage() {
	const { assetId } = Route.useParams();
	const asset = getSpotAsset(assetId);
	const { tr, locale } = useI18n();
	const load = useServerFn(loadSpotDesk);
	const [plan, setPlan] = (0, import_react.useState)(null);
	const [fetchedAt, setFetchedAt] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [error, setError] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let stop = false;
		if (!asset) {
			setStatus("missing");
			setPlan(null);
			return;
		}
		if (!asset.enabled) {
			setStatus("soon");
			setPlan(null);
			return;
		}
		setStatus("loading");
		setError(null);
		load({ data: { assetId: asset.id } }).then((desk) => {
			if (stop) return;
			setPlan(desk.plan);
			setFetchedAt(desk.fetchedAt);
			setStatus("ready");
		}).catch((err) => {
			if (stop) return;
			setStatus("error");
			setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
		});
		return () => {
			stop = true;
		};
	}, [asset?.id, asset?.enabled]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "desk-grid min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 text-xs text-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/",
								className: "inline-flex h-11 items-center gap-2 text-muted hover:text-fg",
								children: [locale === "en" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }), tr("میز اصلی", "Main desk")]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitch, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-xs tracking-widest text-subtle",
									children: "ALPHA SPOT"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 text-4xl font-medium tracking-tight text-fg md:text-5xl",
									children: asset ? tr(asset.nameFa, asset.nameEn) : tr("ارز ناشناس", "Unknown asset")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base leading-relaxed text-muted",
									children: tr("یک نقطه برای خرید اسپات، یک قیمت که اگر بالا رد شد بفروشی، و یک قیمت که اگر پایین رد شد خارج شوی.", "One spot buy, one price that means sell if it crosses up, and one price that means sell if it crosses down.")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AssetRail, { activeId: asset?.id ?? "" })
					]
				}),
				status === "missing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: tr("این نماد در فهرست اسپات نیست.", "This ticker is not on the spot list.")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/spot/$assetId",
							params: { assetId: "btc" },
							children: tr("برگشت به بیت‌کوین", "Back to Bitcoin")
						})
					})]
				}) : null,
				status === "soon" && asset ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
							symbol: asset.symbol,
							name: tr(asset.nameFa, asset.nameEn)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-muted",
							children: tr("جای این ارز همین‌جاست، ولی هنوز روشن نشده. موتور، نمودار و دو حد خرید و فروش همان بیت‌کوین است؛ با فعال شدن نماد، همین صفحه برایش پر می‌شود.", "This slot is reserved, not live yet. The engine, the chart, and the buy and sell levels are the same ones Bitcoin uses. Turning the ticker on fills this page.")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/spot/$assetId",
								params: { assetId: "btc" },
								children: tr("تحلیل بیت‌کوین", "Open Bitcoin")
							})
						})
					]
				}) : null,
				status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex items-center gap-2 text-sm text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), tr("کندل روزانه و ناحیه‌های ورود و خروج", "Daily candles and the entry and exit zones")]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shimmer h-full w-2/3 rounded-full bg-accent/40" })
					})]
				}) : null,
				status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: tr("تحلیل اسپات کامل نشد", "The spot plan did not finish")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: error ? tr(error) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: () => {
								if (!asset) return;
								setStatus("loading");
								load({ data: { assetId: asset.id } }).then((desk) => {
									setPlan(desk.plan);
									setFetchedAt(desk.fetchedAt);
									setStatus("ready");
								}).catch((err) => {
									setStatus("error");
									setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
								});
							},
							children: tr("تلاش دوباره", "Try again")
						})
					]
				}) : null,
				status === "ready" && plan ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBody, {
					plan,
					fetchedAt,
					onReload: () => {
						if (!asset) return;
						setStatus("loading");
						load({ data: { assetId: asset.id } }).then((desk) => {
							setPlan(desk.plan);
							setFetchedAt(desk.fetchedAt);
							setStatus("ready");
						}).catch((err) => {
							setStatus("error");
							setError(err instanceof Error ? err.message : "تحلیل اسپات انجام نشد.");
						});
					}
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t border-border pt-4 text-xs leading-relaxed text-subtle",
					children: tr("این صفحه توصیه سرمایه‌گذاری نیست. سطح‌ها از کندل روزانه عمومی ساخته می‌شوند و می‌توانند اشتباه کنند. مسئولیت معامله با شماست.", "This page is not investment advice. Levels come from public daily candles and can be wrong. The trade is yours.")
				})
			]
		})
	});
}
function AssetRail({ activeId }) {
	const { tr } = useI18n();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "flex gap-2 overflow-x-auto pb-1",
		children: SPOT_ASSETS.map((item) => {
			const on = item.id === activeId;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: "shrink-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/spot/$assetId",
					params: { assetId: item.id },
					className: on ? "flex h-11 items-center gap-2 rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "flex h-11 items-center gap-2 rounded-lg bg-surface px-3 text-sm text-muted shadow-[var(--shadow-border)] hover:text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: item.symbol
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tr(item.nameFa, item.nameEn) }),
						item.enabled ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: tr("به‌زودی", "Soon")
						})
					]
				})
			}, item.id);
		})
	});
}
function PlanBody({ plan, fetchedAt, onReload }) {
	const { tr } = useI18n();
	const action = plan.action === "buy" ? tr("بخر", "Buy") : plan.action === "exit" ? tr("بفروش", "Sell") : tr("صبر کن", "Wait");
	const actionTone = plan.action === "buy" ? "text-up" : plan.action === "exit" ? "text-down" : "text-warn";
	const size = plan.size === "full" ? tr("اندازه کامل", "Full size") : plan.size === "half" ? tr("نصف اندازه", "Half size") : tr("بدون ورود تازه", "No new entry");
	const confidence = plan.confidence === "high" ? tr("اعتماد بالا", "High confidence") : plan.confidence === "medium" ? tr("اعتماد متوسط", "Medium confidence") : tr("اعتماد پایین", "Low confidence");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] md:p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: `text-3xl font-medium tracking-tight ${actionTone}`,
						children: action
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
						children: tr(plan.headlineFa, plan.headlineEn)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-end",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "num text-2xl text-fg",
							children: formatSpotUsd(plan.price)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-subtle",
							children: [plan.pair, fetchedAt ? ` · ${timeAgoFa(fetchedAt)}` : ""]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-2 text-xs text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-elevated px-2 py-1",
							children: size
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-elevated px-2 py-1",
							children: confidence
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-md bg-elevated px-2 py-1",
							children: plan.regime === "bull" ? tr("روند روزانه صعودی", "Daily uptrend") : plan.regime === "bear" ? tr("روند روزانه نزولی", "Daily downtrend") : tr("روند روزانه رنج", "Daily range")
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 md:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
						k: tr("از این قیمت بخر", "Buy from this price"),
						value: formatSpotUsd(plan.entry),
						detail: tr(plan.buyFa, plan.buyEn),
						tone: "text-up"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
						k: tr("اگر بالا رد شد بفروش", "Sell if it crosses up"),
						value: formatSpotUsd(plan.takeProfit),
						detail: tr(plan.sellUpFa, plan.sellUpEn),
						tone: "text-warn"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LevelCard, {
						k: tr("اگر پایین رد شد بفروش", "Sell if it crosses down"),
						value: formatSpotUsd(plan.invalidation),
						detail: tr(plan.sellDownFa, plan.sellDownEn),
						tone: "text-down"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-end justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm text-fg",
							children: tr("نمودار روزانه و بهترین ورود", "Daily chart and the best entry")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: tr("نوار سبز ناحیه خرید است. خط سبز بهترین نقطه است. نقطه روی نمودار آخرین باری است که قیمت همان سطح را لمس کرده.", "The green band is the buy zone. The solid green line is the best entry. The dot is the last time price traded that level.")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onReload,
							className: "h-11",
							children: tr("به‌روزرسانی", "Refresh")
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotPlanChart, { plan }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SpotLevelRuler, { plan })
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: "RSI ۱۴",
						v: plan.rsi == null ? "—" : plan.rsi.toFixed(0)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: tr("نوسان روزانه", "Daily range"),
						v: `${(plan.atrPct * 100).toFixed(1)}%`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: tr("فاصله تا میانگین ۲۰۰", "Distance to the 200-day"),
						v: plan.emaDist == null ? "—" : formatPct(plan.emaDist)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: tr("۷ روز", "7 days"),
						v: plan.change7d == null ? "—" : formatPct(plan.change7d)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: tr("۳۰ روز", "30 days"),
						v: plan.change30d == null ? "—" : formatPct(plan.change30d)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						k: tr("هم‌پوشانی ورود", "Entry overlap"),
						v: String(plan.confluence)
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm text-fg",
						children: tr("چرا این سطح‌ها", "Why these levels")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-col gap-2",
						children: plan.notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "text-sm leading-relaxed text-muted",
							children: tr(note.fa, note.en)
						}, note.fa))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-xs text-subtle",
						children: tr(`ناحیه خرید از ${formatSpotUsd(plan.buyFrom)} تا ${formatSpotUsd(plan.buyTo)}. بالاتر از سقف ناحیه نخر.`, `Buy zone ${formatSpotUsd(plan.buyFrom)} to ${formatSpotUsd(plan.buyTo)}. Do not chase above the top of the zone.`)
					})
				]
			})
		]
	});
}
function LevelCard({ k, value, detail, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-subtle",
				children: k
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: `num mt-2 text-2xl ${tone}`,
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs leading-relaxed text-muted",
				children: detail
			})
		]
	});
}
function Stat({ k, v }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-subtle",
			children: k
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "num mt-1 text-lg text-fg",
			children: v
		})]
	});
}
//#endregion
export { SpotDeskPage as component };
