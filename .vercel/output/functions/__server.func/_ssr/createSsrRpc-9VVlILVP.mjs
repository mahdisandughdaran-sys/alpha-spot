import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { G as isRedirect, S as require_jsx_runtime, x as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById } from "./ssr.mjs";
import { t as getLocale } from "./lex-pVOST3Oe.mjs";
import { r as useI18n } from "./router-C_7qBX2i.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/createSsrRpc-9VVlILVP.js
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
//#endregion
export { createSsrRpc as a, formatScore as c, useServerFn as d, cn as i, formatUsd as l, CoinMark as n, formatPct as o, LocaleSwitch as r, formatPctPoints as s, Button as t, timeAgoFa as u };
