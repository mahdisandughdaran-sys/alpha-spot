import { o as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { S as require_jsx_runtime, b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { t as createServerFn } from "./_ssr/ssr.mjs";
import { g as ArrowLeft, h as ArrowRight, u as LoaderCircle } from "./_libs/lucide-react.mjs";
import { n as Route, r as useI18n } from "./_ssr/router-C14ajZzY.mjs";
import { a as createSsrRpc, d as useServerFn, n as CoinMark, o as formatPct, r as LocaleSwitch, t as Button, u as timeAgoFa } from "./_ssr/createSsrRpc-BgGZizt6.mjs";
import { n as formatSpotUsd } from "./_ssr/spot-plan-Dc7G_xLN.mjs";
import { r as resolveSpotAsset } from "./_ssr/spot-assets-BHAayhSJ.mjs";
import { a as YAxis, h as Tooltip, l as ReferenceArea, m as ResponsiveContainer, o as XAxis, s as Area, t as AreaChart, u as ReferenceLine } from "./_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_assetId-CFN16ya0.js
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
	const asset = resolveSpotAsset(String(input?.assetId ?? ""));
	if (!asset) throw new Error("این ارز در فهرست اسپات نیست.");
	if (!asset.enabled) throw new Error("این ارز هنوز فعال نشده.");
	return { assetId: asset.id };
}).handler(createSsrRpc("fe1f268360652ffd8c110e19f0058a6289058902cc00444298fe7779506355bb"));
var loadSpotBoard = createServerFn({ method: "POST" }).validator((input) => ({ force: Boolean(input?.force) })).handler(createSsrRpc("c46ebafb3476d206d2a8f7363ac5cbefff0a2c20a40c24eeb2c15ccc577d431b"));
var BOARD_TTL_MS = 12e4;
var clientBoard = null;
var clientAt = 0;
function SpotDeskPage() {
	const { assetId } = Route.useParams();
	const { tr, locale } = useI18n();
	const load = useServerFn(loadSpotBoard);
	const reloadOne = useServerFn(loadSpotDesk);
	const detailRef = (0, import_react.useRef)(null);
	const [board, setBoard] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)("loading");
	const [error, setError] = (0, import_react.useState)(null);
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [activeId, setActiveId] = (0, import_react.useState)(assetId);
	const [refreshing, setRefreshing] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setActiveId(assetId);
	}, [assetId]);
	(0, import_react.useEffect)(() => {
		let stop = false;
		if (clientBoard && Date.now() - clientAt < BOARD_TTL_MS) {
			setBoard(clientBoard);
			setStatus("ready");
			return;
		}
		setStatus("loading");
		setError(null);
		load({ data: { force: false } }).then((next) => {
			if (stop) return;
			clientBoard = next;
			clientAt = Date.now();
			setBoard(next);
			setStatus("ready");
		}).catch((err) => {
			if (stop) return;
			setStatus("error");
			setError(err instanceof Error ? err.message : "تحلیل ۲۰ ارز انجام نشد.");
		});
		return () => {
			stop = true;
		};
	}, []);
	const rows = board?.rows ?? [];
	const active = rows.find((row) => row.assetId === activeId) ?? rows.find((row) => row.assetId === "btc") ?? rows[0] ?? null;
	const visible = rows.filter((row) => filter === "all" || row.plan.action === filter);
	const buys = rows.filter((row) => row.plan.action === "buy").length;
	const waits = rows.filter((row) => row.plan.action === "wait").length;
	const exits = rows.filter((row) => row.plan.action === "exit").length;
	const missing = status === "ready" && assetId !== "btc" && !rows.some((row) => row.assetId === assetId);
	const choose = (id) => {
		setActiveId(id);
		detailRef.current?.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	};
	const refreshBoard = () => {
		setRefreshing(true);
		setError(null);
		load({ data: { force: true } }).then((next) => {
			clientBoard = next;
			clientAt = Date.now();
			setBoard(next);
			setStatus("ready");
		}).catch((err) => {
			setStatus("error");
			setError(err instanceof Error ? err.message : "تحلیل ۲۰ ارز انجام نشد.");
		}).finally(() => setRefreshing(false));
	};
	const refreshOne = (id) => {
		setRefreshing(true);
		reloadOne({ data: { assetId: id } }).then((desk) => {
			setBoard((prev) => {
				if (!prev) return prev;
				const next = {
					...prev,
					fetchedAt: desk.fetchedAt,
					rows: prev.rows.map((row) => row.assetId === id ? {
						...row,
						plan: desk.plan
					} : row)
				};
				clientBoard = next;
				clientAt = Date.now();
				return next;
			});
		}).catch((err) => {
			setError(err instanceof Error ? err.message : "به‌روزرسانی این ارز انجام نشد.");
		}).finally(() => setRefreshing(false));
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "desk-grid min-h-dvh",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex w-full min-w-0 max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-col gap-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 text-xs text-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "inline-flex h-11 items-center gap-2 text-muted hover:text-fg",
							children: [locale === "en" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" }), tr("میز اصلی", "Main desk")]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LocaleSwitch, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-3xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "num text-xs tracking-widest text-subtle",
									children: "ALPHA SPOT · BTC DESK"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "mt-2 text-4xl font-medium tracking-tight text-fg md:text-5xl",
									children: tr("میز بیت‌کوین", "Bitcoin desk")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-base leading-relaxed text-muted",
									children: tr("همان سه عدد بیت‌کوین، برای ۲۰ ارز اول بازار. از کجا بخری، اگر قیمت بالا رد شد کجا بفروشی، و اگر پایین رد شد کجا خارج شوی. استیبل و رپد کنار گذاشته شده‌اند.", "The same three Bitcoin numbers, for the top 20 coins. Where to buy, where to sell if price crosses up, and where to get out if it crosses down. Stables and wrapped assets are left out.")
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "h-11 shrink-0",
							onClick: refreshBoard,
							disabled: status === "loading" || refreshing,
							children: [refreshing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : null, tr("تحلیل دوباره", "Run again")]
						})]
					})]
				}),
				status === "loading" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2 text-sm text-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), tr("کندل روزانهٔ ۲۰ ارز اول", "Daily candles for the top 20")]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 h-1.5 overflow-hidden rounded-full bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "shimmer h-full w-2/3 rounded-full bg-accent/40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs text-subtle",
							children: tr("هر ارز با همان موتور بیت‌کوین سنجیده می‌شود: ناحیه خرید، فروش بالایی، فروش پایینی.", "Each coin uses the Bitcoin engine: a buy zone, an upside sell, and a downside sell.")
						})
					]
				}) : null,
				status === "error" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl bg-surface p-6 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: tr("تحلیل ۲۰ ارز کامل نشد", "The top-20 plan did not finish")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: error ? tr(error) : null
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "mt-4",
							onClick: refreshBoard,
							children: tr("تلاش دوباره", "Try again")
						})
					]
				}) : null,
				status === "ready" && board && active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "flex min-w-0 flex-col gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
									on: filter === "all",
									label: tr(`همه ${rows.length}`, `All ${rows.length}`),
									onClick: () => setFilter("all")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
									on: filter === "buy",
									label: tr(`بخر ${buys}`, `Buy ${buys}`),
									onClick: () => setFilter("buy")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
									on: filter === "wait",
									label: tr(`صبر ${waits}`, `Wait ${waits}`),
									onClick: () => setFilter("wait")
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
									on: filter === "exit",
									label: tr(`بفروش ${exits}`, `Sell ${exits}`),
									onClick: () => setFilter("exit")
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-subtle",
							children: [board.source === "live" ? tr(`رتبه زنده از ${board.feed} · کندل روزانه بایننس · ${timeAgoFa(board.fetchedAt)}`, `Live rank from ${board.feed} · Binance daily candles · ${timeAgoFa(board.fetchedAt)}`) : tr(`فهرست ذخیره، چون رتبه زنده نرسید · ${timeAgoFa(board.fetchedAt)}`, `Saved list, because the live rank did not arrive · ${timeAgoFa(board.fetchedAt)}`), rows.length < 20 ? tr(` · ${rows.length} ارز کندل کامل داشتند`, ` · ${rows.length} coins had a complete candle history`) : null]
						}),
						missing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: tr("این نماد الان بین ۲۰ تای اول نیست. تحلیل بیت‌کوین نشان داده می‌شود.", "That ticker is not in the current top 20. Bitcoin is on screen instead.")
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-down",
							children: tr(error)
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoardTable, {
							rows: visible,
							activeId: active.assetId,
							onPick: choose
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					ref: detailRef,
					className: "flex scroll-mt-6 flex-col gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "num text-xs text-subtle",
							children: [String(active.rank).padStart(2, "0"), active.marketRank != null ? ` · ${tr("بازار", "Mkt")} ${active.marketRank}` : ""]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 text-2xl font-medium tracking-tight text-fg",
							children: tr(active.plan.nameFa, active.plan.nameEn)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CoinMark, {
							symbol: active.plan.symbol,
							name: tr(active.plan.nameFa, active.plan.nameEn)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlanBody, {
						plan: active.plan,
						fetchedAt: board.fetchedAt,
						refreshing,
						onReload: () => refreshOne(active.assetId)
					})]
				})] }) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "border-t border-border pt-4 text-xs leading-relaxed text-subtle",
					children: tr("این صفحه توصیه سرمایه‌گذاری نیست. سطح‌ها از کندل روزانه عمومی ساخته می‌شوند و می‌توانند اشتباه کنند. مسئولیت معامله با شماست.", "This page is not investment advice. Levels come from public daily candles and can be wrong. The trade is yours.")
				})
			]
		})
	});
}
function FilterChip({ on, label, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: on ? "inline-flex h-11 items-center rounded-lg bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)]" : "inline-flex h-11 items-center rounded-lg bg-surface px-3 text-sm text-muted shadow-[var(--shadow-border)] hover:text-fg",
		children: label
	});
}
function BoardTable({ rows, activeId, onPick }) {
	const { tr } = useI18n();
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "rounded-xl bg-surface px-4 py-6 text-sm text-muted shadow-[var(--shadow-border)]",
		children: tr("در این فیلتر ارزی نیست.", "Nothing in this filter.")
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "max-w-full overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[720px] text-start text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
				className: "text-xs text-subtle",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("رتبه", "Rank")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("ارز", "Coin")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("وضعیت", "Call")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("قیمت", "Price")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("بخر از", "Buy from")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("فروش بالا", "Sell up")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "px-3 py-3 font-normal",
							children: tr("فروش پایین", "Sell down")
						})
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => {
				const on = row.assetId === activeId;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					tabIndex: 0,
					onClick: () => onPick(row.assetId),
					onKeyDown: (event) => {
						if (event.key === "Enter" || event.key === " ") {
							event.preventDefault();
							onPick(row.assetId);
						}
					},
					className: on ? "cursor-pointer bg-elevated" : "cursor-pointer hover:bg-elevated",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-3 py-2 text-subtle",
							children: String(row.rank).padStart(2, "0")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "px-3 py-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex h-11 items-center gap-2 text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num",
									children: row.plan.symbol
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: tr(row.plan.nameFa, row.plan.nameEn)
								})]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `px-3 py-2 ${actionTone(row.plan.action)}`,
							children: actionLabel(row.plan.action, tr)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-3 py-2 text-fg",
							children: formatSpotUsd(row.plan.price)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-3 py-2 text-up",
							children: formatSpotUsd(row.plan.entry)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-3 py-2 text-warn",
							children: formatSpotUsd(row.plan.takeProfit)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num px-3 py-2 text-down",
							children: formatSpotUsd(row.plan.invalidation)
						})
					]
				}, row.assetId);
			}) })]
		})
	});
}
function actionLabel(action, tr) {
	if (action === "buy") return tr("بخر", "Buy");
	if (action === "exit") return tr("بفروش", "Sell");
	return tr("صبر کن", "Wait");
}
function actionTone(action) {
	if (action === "buy") return "text-up";
	if (action === "exit") return "text-down";
	return "text-warn";
}
function PlanBody({ plan, fetchedAt, refreshing, onReload }) {
	const { tr } = useI18n();
	const action = actionLabel(plan.action, tr);
	const actionClass = actionTone(plan.action);
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
						className: `text-3xl font-medium tracking-tight ${actionClass}`,
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
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm text-fg",
							children: tr("نمودار روزانه و بهترین ورود", "Daily chart and the best entry")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-subtle",
							children: tr("نوار سبز ناحیه خرید است. خط سبز بهترین نقطه است. نقطه روی نمودار آخرین باری است که قیمت همان سطح را لمس کرده.", "The green band is the buy zone. The solid green line is the best entry. The dot is the last time price traded that level.")
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "sm",
							onClick: onReload,
							disabled: refreshing,
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
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
