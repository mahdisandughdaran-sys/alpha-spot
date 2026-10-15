import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as string, o as object, t as _enum } from "../_libs/zod.mjs";
import { _ as wordCount, a as briefSchema, c as paceNote, d as readSeconds, f as sampleBrief, g as voiceFor, i as STYLES, l as platformLabel, m as styleLabel, n as LENGTH_NOTES, o as cutToMarkdown, p as slugify, r as PLATFORMS, s as emptyBrief, t as LENGTHS, u as rangeLabel } from "./format-BlSqTPkB.mjs";
import { a as Download, i as ImagePlus, o as Copy, r as LoaderCircle, s as Check, t as Volume2 } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { n as SwitchThumb, t as Switch } from "../_libs/@radix-ui/react-switch+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-B_bwD0d6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var inputClass = "min-h-11 w-full rounded-sm border border-border bg-background px-3 text-sm text-foreground placeholder:text-faint";
function Choice({ pressed, children, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		"aria-pressed": pressed,
		onClick,
		className: clsx("press min-h-11 rounded-sm border px-2 text-sm font-medium", pressed ? "border-foreground bg-subtle text-foreground" : "border-border text-muted"),
		children
	});
}
function BriefForm({ brief, pending, error, imageError, hasCut, onChange, onImage, onClearImage, onSample, onSubmit }) {
	const [over, setOver] = (0, import_react.useState)(false);
	const style = STYLES.find((item) => item.id === brief.style);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "rounded-xl border border-border bg-card p-4",
		onSubmit: (event) => {
			event.preventDefault();
			onSubmit();
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl tracking-tight",
					children: "Brief"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: onSample,
					className: "press min-h-11 rounded-sm px-2 text-sm font-medium text-muted",
					children: "Use sample"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: clsx("relative overflow-hidden rounded-md border", over ? "border-foreground" : "border-border"),
				onDragOver: (event) => {
					event.preventDefault();
					setOver(true);
				},
				onDragLeave: () => setOver(false),
				onDrop: (event) => {
					event.preventDefault();
					setOver(false);
					const file = event.dataTransfer.files?.[0];
					if (file) onImage(file);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "file",
						accept: "image/jpeg,image/png,image/webp",
						className: "sr-only",
						onChange: (event) => {
							const file = event.target.files?.[0];
							event.target.value = "";
							if (file) onImage(file);
						}
					}), brief.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: brief.image,
						alt: brief.productName ? `${brief.productName} product` : "Uploaded product",
						className: "aspect-[4/3] w-full object-cover"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, {
								className: "size-5 text-muted",
								"aria-hidden": "true"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium",
								children: "Drop a product photo"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-faint",
								children: "JPG, PNG, or WebP"
							})
						]
					})]
				})
			}),
			brief.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClearImage,
				className: "press mt-2 min-h-11 text-sm font-medium text-muted",
				children: "Remove photo"
			}) : null,
			imageError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: imageError
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Product"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: brief.productName,
					onChange: (event) => onChange({ productName: event.target.value }),
					placeholder: "Stillwater Serum",
					maxLength: 80,
					className: inputClass,
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Claim"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: brief.claim,
					onChange: (event) => onChange({ claim: event.target.value }),
					placeholder: "What it does, in one or two sentences.",
					maxLength: 500,
					rows: 3,
					className: `${inputClass} min-h-24 py-2 leading-6`,
					required: true
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Audience"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: brief.audience,
					onChange: (event) => onChange({ audience: event.target.value }),
					placeholder: "Who this is for",
					maxLength: 160,
					className: inputClass
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
					className: "mb-1.5 text-sm font-medium",
					children: "Platform"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-4 gap-2",
					children: PLATFORMS.map((platform) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
						pressed: brief.platform === platform.id,
						onClick: () => onChange({ platform: platform.id }),
						children: platform.label
					}, platform.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-1.5 text-sm font-medium",
						children: "Length"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-3 gap-2",
						children: LENGTHS.map((length) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							pressed: brief.duration === length,
							onClick: () => onChange({ duration: length }),
							children: `${length}s`
						}, length))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: LENGTH_NOTES[brief.duration]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "mb-1.5 text-sm font-medium",
						children: "Style"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-2 gap-2",
						children: STYLES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Choice, {
							pressed: brief.style === item.id,
							onClick: () => onChange({ style: item.id }),
							children: item.label
						}, item.id))
					}),
					style ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: style.blurb
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Call to action"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: brief.cta,
					onChange: (event) => onChange({ cta: event.target.value }),
					placeholder: "Shop the calm",
					maxLength: 60,
					className: inputClass
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "mb-1.5 block text-sm font-medium",
					children: "Must mention"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: brief.mustMention,
					onChange: (event) => onChange({ mustMention: event.target.value }),
					placeholder: "Optional. A fact that has to be said.",
					maxLength: 180,
					className: inputClass
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 flex min-h-11 items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium",
					children: "Spoken voiceover"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: brief.includeVoiceover,
					onCheckedChange: (checked) => onChange({ includeVoiceover: checked }),
					className: "press relative h-6 w-11 shrink-0 rounded-full bg-subtle data-[state=checked]:bg-primary",
					"aria-label": "Spoken voiceover",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "block size-5 translate-x-0.5 rounded-full bg-foreground transition-transform duration-[var(--motion-fast)] data-[state=checked]:translate-x-5 data-[state=checked]:bg-primary-foreground" })
				})]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-danger",
				role: "alert",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "submit",
				disabled: pending,
				className: "press mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground disabled:opacity-40",
				children: [pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					className: "size-4 animate-spin motion-reduce:animate-none",
					"aria-hidden": "true"
				}) : null, pending ? "Writing the cut" : hasCut ? "Rewrite the cut" : "Write the cut"]
			})
		]
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
var speakSchema = object({
	text: string().trim().min(1, "Nothing to read yet.").max(1400, "That read is too long to preview."),
	voiceId: _enum([
		"eve",
		"ara",
		"rex",
		"leo",
		"sal"
	]),
	speed: number().min(.75).max(1.2)
});
var speakVoiceover = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = speakSchema.safeParse(input);
	if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Can't read that yet.");
	return parsed.data;
}).handler(createSsrRpc("7519c7a0a92f7ba72eb608cdeb91031b14c47bbf3663baf4dda3b534617f20dc"));
var WIDTH = 1240;
var PAD = 44;
var GAP = 18;
var COL_W = 567;
var FRAME_H = Math.round(COL_W * 9 / 16);
var PAPER = "#f4f1ea";
var INK = "#1a1916";
var MUTED = "#5c584f";
var RULE = "#ddd6c8";
var FRAME = "#e4ddd0";
function wrap(ctx, text, font, maxWidth, maxLines) {
	ctx.font = font;
	const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
	if (!words.length) return [];
	const lines = [];
	let line = "";
	const pushEllipsis = (current, rest) => {
		let base = current;
		const extra = rest.join(" ");
		if (extra) base = `${base} ${extra}`;
		while (base.length > 1 && ctx.measureText(`${base}…`).width > maxWidth) base = base.slice(0, -1).trimEnd();
		lines.push(`${base}…`);
	};
	for (let i = 0; i < words.length; i++) {
		const word = words[i];
		const test = line ? `${line} ${word}` : word;
		if (ctx.measureText(test).width > maxWidth && line) {
			if (lines.length === maxLines - 1) {
				pushEllipsis(line, words.slice(i));
				return lines;
			}
			lines.push(line);
			line = word;
		} else line = test;
	}
	if (line) {
		if (lines.length === maxLines) return lines;
		lines.push(line);
	}
	return lines;
}
function loadImage(src) {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => resolve(null);
		img.src = src;
	});
}
function drawCover(ctx, img, x, y, w, h) {
	const ir = img.width / img.height;
	const r = w / h;
	let sx = 0;
	let sy = 0;
	let sw = img.width;
	let sh = img.height;
	if (ir > r) {
		sw = img.height * r;
		sx = (img.width - sw) / 2;
	} else {
		sh = img.width / r;
		sy = (img.height - sh) / 2;
	}
	ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}
function shotLines(ctx, shot) {
	const body = "500 15px Outfit, sans-serif";
	const meta = "400 14px Outfit, sans-serif";
	const label = "600 13px Outfit, sans-serif";
	const max = COL_W;
	const lines = [];
	const add = (text, font, color, maxLines, lh) => {
		for (const row of wrap(ctx, text, font, max, maxLines)) lines.push({
			text: row,
			font,
			color,
			lh
		});
	};
	add(rangeLabel(shot), label, MUTED, 1, 20);
	add(shot.visual, body, INK, 3, 20);
	add(shot.camera, meta, MUTED, 2, 18);
	if (shot.onScreen.trim()) add(`On screen: ${shot.onScreen}`, meta, INK, 2, 18);
	if (shot.line.trim()) add(`Voice: ${shot.line}`, meta, INK, 2, 18);
	add(shot.sound, meta, MUTED, 2, 18);
	return lines;
}
async function downloadStoryboard(brief, cut) {
	await document.fonts.ready;
	await Promise.all([
		document.fonts.load("600 40px Fraunces"),
		document.fonts.load("500 15px Outfit"),
		document.fonts.load("600 13px Outfit")
	]).catch(() => void 0);
	const image = brief.image ? await loadImage(brief.image) : null;
	const canvas = document.createElement("canvas");
	canvas.width = WIDTH;
	canvas.height = 200;
	const measure = canvas.getContext("2d");
	if (!measure) throw new Error("Could not build the storyboard.");
	const cells = cut.shots.map((shot, index) => {
		const lines = shotLines(measure, shot);
		return {
			shot,
			index,
			lines,
			textH: lines.reduce((sum, line) => sum + line.lh, 0)
		};
	});
	const headerLines = {
		concept: wrap(measure, cut.concept, "400 16px Outfit, sans-serif", 1152, 3),
		hook: wrap(measure, cut.hook, "italic 520 22px Fraunces, Georgia, serif", 1152, 2)
	};
	const headerEnd = 182 + headerLines.concept.length * 22 + headerLines.hook.length * 28;
	const rows = Math.ceil(cells.length / 2);
	const rowHeights = [];
	for (let r = 0; r < rows; r++) {
		const left = cells[r * 2];
		const right = cells[r * 2 + 1];
		const text = Math.max(left?.textH ?? 0, right?.textH ?? 0);
		rowHeights.push(331 + text + 8);
	}
	const height = headerEnd + rowHeights.reduce((sum, h) => sum + h + GAP, 0) + 36;
	canvas.height = height;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not build the storyboard.");
	ctx.fillStyle = PAPER;
	ctx.fillRect(0, 0, WIDTH, height);
	ctx.fillStyle = MUTED;
	ctx.font = "600 12px Outfit, sans-serif";
	ctx.letterSpacing = "0.18em";
	ctx.fillText("REELROOM  ·  STORYBOARD", PAD, 56);
	ctx.letterSpacing = "0px";
	ctx.fillStyle = INK;
	ctx.font = "600 40px Fraunces, Georgia, serif";
	ctx.fillText(cut.title || brief.productName, PAD, 102);
	ctx.fillStyle = MUTED;
	ctx.font = "500 14px Outfit, sans-serif";
	const meta = `${styleLabel(brief.style)}  ·  ${platformLabel(brief.platform)}  ·  ${brief.duration}s  ·  ${(/* @__PURE__ */ new Date()).toLocaleDateString(void 0, {
		month: "short",
		day: "numeric",
		year: "numeric"
	})}`;
	ctx.fillText(meta, PAD, 126);
	let cursor = 148;
	ctx.fillStyle = INK;
	ctx.font = "400 16px Outfit, sans-serif";
	for (const line of headerLines.concept) {
		ctx.fillText(line, PAD, cursor);
		cursor += 22;
	}
	cursor += 8;
	ctx.font = "italic 520 22px Fraunces, Georgia, serif";
	ctx.fillStyle = INK;
	for (const line of headerLines.hook) {
		ctx.fillText(line, PAD, cursor);
		cursor += 28;
	}
	cursor += 8;
	ctx.strokeStyle = RULE;
	ctx.lineWidth = 1;
	ctx.beginPath();
	ctx.moveTo(PAD, cursor);
	ctx.lineTo(1196, cursor);
	ctx.stroke();
	cursor += 18;
	cells.forEach((cell, index) => {
		const col = index % 2;
		const row = Math.floor(index / 2);
		const x = PAD + col * 585;
		const rowY = cursor + rowHeights.slice(0, row).reduce((sum, h) => sum + h + GAP, 0);
		ctx.fillStyle = FRAME;
		ctx.fillRect(x, rowY, COL_W, FRAME_H);
		if (image) drawCover(ctx, image, x, rowY, COL_W, FRAME_H);
		ctx.strokeStyle = RULE;
		ctx.strokeRect(x + .5, rowY + .5, 566, 318);
		const badge = String(cell.index + 1);
		ctx.font = "600 13px Outfit, sans-serif";
		const bw = Math.max(26, ctx.measureText(badge).width + 14);
		ctx.fillStyle = PAPER;
		ctx.fillRect(x + 10, rowY + 10, bw, 22);
		ctx.fillStyle = INK;
		ctx.fillText(badge, x + 10 + (bw - ctx.measureText(badge).width) / 2, rowY + 26);
		let ty = rowY + FRAME_H + 22;
		for (const line of cell.lines) {
			ctx.font = line.font;
			ctx.fillStyle = line.color;
			ctx.fillText(line.text, x, ty);
			ty += line.lh;
		}
	});
	ctx.fillStyle = MUTED;
	ctx.font = "400 12px Outfit, sans-serif";
	ctx.fillText("Shoot sheet. Not a rendered video.", PAD, height - 22);
	const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
	if (!blob) throw new Error("Could not build the storyboard.");
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `reelroom-${slugify(brief.productName)}-storyboard.png`;
	link.click();
	URL.revokeObjectURL(url);
}
function downloadScript(markdown, productName) {
	const blob = new Blob([markdown], { type: "text/markdown" });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = `reelroom-${slugify(productName)}-script.md`;
	link.click();
	URL.revokeObjectURL(url);
}
function Field({ value, onChange, label, multiline, className }) {
	const shared = "w-full resize-none rounded-sm bg-transparent px-1 py-0.5 text-foreground outline-none placeholder:text-faint focus:bg-subtle";
	if (multiline) {
		const rows = Math.min(6, Math.max(2, Math.ceil(value.length / 42)));
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
			"aria-label": label,
			value,
			rows,
			onChange: (event) => onChange(event.target.value),
			className: clsx(shared, "text-sm leading-6", className)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		"aria-label": label,
		value,
		onChange: (event) => onChange(event.target.value),
		className: clsx(shared, "text-sm", className)
	});
}
function CutBoard({ brief, cut, notice, pending, onChange }) {
	const [speaking, setSpeaking] = (0, import_react.useState)(false);
	const [speakError, setSpeakError] = (0, import_react.useState)(null);
	const [audioUrl, setAudioUrl] = (0, import_react.useState)(null);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [sheetError, setSheetError] = (0, import_react.useState)(null);
	const voice = voiceFor(brief.style);
	const words = wordCount(cut.voiceover);
	const pace = paceNote(words, brief.duration);
	(0, import_react.useEffect)(() => {
		setAudioUrl(null);
		setSpeakError(null);
	}, [cut.voiceover, voice.id]);
	(0, import_react.useEffect)(() => {
		return () => {
			if (audioUrl) URL.revokeObjectURL(audioUrl);
		};
	}, [audioUrl]);
	function patch(partial) {
		onChange({
			...cut,
			...partial
		});
	}
	function patchShot(index, partial) {
		onChange({
			...cut,
			shots: cut.shots.map((shot, i) => i === index ? {
				...shot,
				...partial
			} : shot)
		});
	}
	async function hear() {
		const text = cut.voiceover.trim().slice(0, 1400);
		if (!text) {
			setSpeakError("Add a voiceover line first.");
			return;
		}
		setSpeaking(true);
		setSpeakError(null);
		try {
			const result = await speakVoiceover({ data: {
				text,
				voiceId: voice.id,
				speed: voice.speed
			} });
			if (!result.ok) {
				setSpeakError(result.error);
				return;
			}
			const binary = atob(result.audioBase64);
			const bytes = new Uint8Array(binary.length);
			for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
			const url = URL.createObjectURL(new Blob([bytes], { type: result.mime }));
			setAudioUrl(url);
		} catch {
			setSpeakError("The read didn't come back. Try again.");
		} finally {
			setSpeaking(false);
		}
	}
	async function copyCut() {
		try {
			await navigator.clipboard.writeText(cutToMarkdown(cut, brief));
			setCopied(true);
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			setSheetError("Couldn't copy. Download the script instead.");
		}
	}
	async function saveSheet() {
		setSheetError(null);
		try {
			await downloadStoryboard(brief, cut);
		} catch {
			setSheetError("Couldn't build the storyboard.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: clsx("rise min-w-0", pending && "pointer-events-none opacity-50"),
		"aria-busy": pending,
		children: [
			notice ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-5 border-l border-border pl-3 text-sm text-muted",
				children: notice
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex items-start gap-4",
				children: [brief.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: brief.image,
					alt: "",
					className: "size-16 shrink-0 rounded-sm object-cover"
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								styleLabel(brief.style),
								" · ",
								platformLabel(brief.platform),
								" · ",
								brief.duration,
								"s",
								cut.source === "draft" ? " · Template" : ""
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl tracking-tight",
							children: cut.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Concept",
							multiline: true,
							value: cut.concept,
							onChange: (concept) => patch({ concept }),
							className: "mt-1 text-muted"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-border pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-muted",
					children: "Hook"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Hook",
					multiline: true,
					value: cut.hook,
					onChange: (hook) => patch({ hook }),
					className: "font-display text-2xl italic leading-snug"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-border pt-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-sm font-medium text-muted",
					children: "Shots"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-3 grid gap-4 sm:grid-cols-2",
					children: cut.shots.map((shot, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-card p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative mb-3 aspect-video overflow-hidden rounded-md bg-subtle",
								children: [
									brief.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: brief.image,
										alt: "",
										className: "h-full w-full object-cover"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "flex h-full items-center justify-center text-sm text-faint",
										children: "No photo"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute top-2 left-2 flex size-7 items-center justify-center rounded-sm bg-paper text-sm font-medium text-ink tabular-nums",
										children: index + 1
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "absolute right-2 bottom-2 rounded-sm bg-paper px-1.5 py-0.5 text-xs font-medium text-ink tabular-nums",
										children: rangeLabel(shot)
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Shot ${index + 1} visual`,
								multiline: true,
								value: shot.visual,
								onChange: (visual) => patchShot(index, { visual })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Shot ${index + 1} camera`,
								value: shot.camera,
								onChange: (camera) => patchShot(index, { camera }),
								className: "text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Shot ${index + 1} on-screen text`,
								value: shot.onScreen,
								onChange: (onScreen) => patchShot(index, { onScreen })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Shot ${index + 1} spoken line`,
								multiline: true,
								value: shot.line,
								onChange: (line) => patchShot(index, { line }),
								className: "text-muted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: `Shot ${index + 1} sound`,
								value: shot.sound,
								onChange: (sound) => patchShot(index, { sound }),
								className: "text-faint"
							})
						]
					}, `${shot.startSec}-${index}`))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-border pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-end justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-medium text-muted",
							children: "Voiceover"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => patch({ voiceover: cut.shots.map((shot) => shot.line.trim()).filter(Boolean).join(" ") }),
							className: "press min-h-11 text-sm font-medium text-muted",
							children: "Sync from shots"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Voiceover",
						multiline: true,
						value: cut.voiceover,
						onChange: (voiceover) => patch({ voiceover }),
						className: "mt-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted tabular-nums",
						children: [
							words,
							" words · ",
							readSeconds(words),
							"s read",
							pace ? ` · ${pace}` : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => void hear(),
							disabled: speaking || !cut.voiceover.trim(),
							className: "press inline-flex min-h-11 items-center gap-2 rounded-sm border border-border px-3 text-sm font-medium disabled:opacity-40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, {
								className: "size-4",
								"aria-hidden": "true"
							}), speaking ? "Reading" : `Hear it · ${voice.label}`]
						}), cut.voiceover.trim().length > 1400 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "The preview reads the first part only."
						}) : null]
					}),
					speakError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-danger",
						children: speakError
					}) : null,
					audioUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("audio", {
						ref: void 0,
						src: audioUrl,
						controls: true,
						autoPlay: true,
						className: "mt-3 w-full"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-border pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-muted",
						children: "Post copy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Caption",
						multiline: true,
						value: cut.caption,
						onChange: (caption) => patch({ caption }),
						className: "mt-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "mt-3 block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Hashtags"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: cut.hashtags.join(", "),
							onChange: (event) => patch({ hashtags: event.target.value.split(",").map((tag) => tag.replace(/^#/, "").trim()) }),
							"aria-label": "Hashtags, separated by commas",
							className: "min-h-11 w-full rounded-sm border border-border bg-background px-3 text-sm"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 flex flex-wrap gap-2",
						children: cut.hashtags.filter(Boolean).map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "rounded-sm bg-subtle px-2 py-1 text-sm text-muted",
							children: ["#", tag.replace(/^#/, "")]
						}, tag))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 border-t border-border pt-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium text-muted",
						children: "Music"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Music mood",
							value: cut.musicMood,
							onChange: (musicMood) => patch({ musicMood })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Music notes",
						multiline: true,
						value: cut.musicNotes,
						onChange: (musicNotes) => patch({ musicNotes }),
						className: "text-muted"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-col gap-2 sm:flex-row",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void saveSheet(),
						className: "press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-4 text-sm font-medium text-primary-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Storyboard"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => downloadScript(cutToMarkdown(cut, brief), brief.productName),
						className: "press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm border border-border px-4 text-sm font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, {
							className: "size-4",
							"aria-hidden": "true"
						}), "Script"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void copyCut(),
						className: "press inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-sm border border-border px-4 text-sm font-medium",
						children: [copied ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
							className: "size-4",
							"aria-hidden": "true"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, {
							className: "size-4",
							"aria-hidden": "true"
						}), copied ? "Copied" : "Copy"]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted",
				children: "A printable shot sheet, not a rendered video. Edit any line before you download."
			}),
			sheetError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-danger",
				children: sheetError
			}) : null
		]
	});
}
var generateCut = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = briefSchema.safeParse(input);
	if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the brief and try again.");
	return parsed.data;
}).handler(createSsrRpc("9e34701dc84a2d94e222767a677c6aee49fafecf6da6ad026365a9017785266a"));
function fileToJpeg(file, maxEdge = 768) {
	return new Promise((resolve, reject) => {
		const url = URL.createObjectURL(file);
		const img = new Image();
		img.onload = () => {
			const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
			const w = Math.max(1, Math.round(img.width * scale));
			const h = Math.max(1, Math.round(img.height * scale));
			const canvas = document.createElement("canvas");
			canvas.width = w;
			canvas.height = h;
			const ctx = canvas.getContext("2d");
			if (!ctx) {
				URL.revokeObjectURL(url);
				reject(/* @__PURE__ */ new Error("Could not read that photo."));
				return;
			}
			ctx.fillStyle = "#f4f1ea";
			ctx.fillRect(0, 0, w, h);
			ctx.drawImage(img, 0, 0, w, h);
			URL.revokeObjectURL(url);
			resolve(canvas.toDataURL("image/jpeg", .72));
		};
		img.onerror = () => {
			URL.revokeObjectURL(url);
			reject(/* @__PURE__ */ new Error("Could not read that photo. Use a JPG, PNG, or WebP."));
		};
		img.src = url;
	});
}
var STORAGE = "reelroom:v1";
function EmptyState() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border p-4 sm:p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl tracking-tight",
				children: "The cut lands here"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-prose text-sm text-muted",
				children: "Add a product and a claim. A photo makes the frames specific. You can edit every line before you download."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-6 divide-y divide-border border-y border-border",
				children: [
					{
						title: "Script",
						body: "A hook and lines that can actually be said in the length you picked."
					},
					{
						title: "Shot list",
						body: "What the camera sees, the burned-in text, and the sound for each beat."
					},
					{
						title: "Storyboard",
						body: "A sheet you can download, with your photo in every frame."
					}
				].map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "grid grid-cols-[2.5rem_1fr] gap-3 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-faint tabular-nums",
						children: ["0", index + 1]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-medium",
						children: step.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: step.body
					})] })]
				}, step.title))
			})
		]
	});
}
function Writing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border p-4 sm:p-6",
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton h-8 w-40 rounded-sm" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-4 h-4 w-full rounded-sm" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton mt-2 h-4 w-2/3 rounded-sm" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton aspect-video rounded-md" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton aspect-video rounded-md" })]
			})
		]
	});
}
function Studio() {
	const [brief, setBrief] = (0, import_react.useState)(emptyBrief);
	const [cut, setCut] = (0, import_react.useState)(null);
	const [notice, setNotice] = (0, import_react.useState)(null);
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [imageError, setImageError] = (0, import_react.useState)(null);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		try {
			const raw = sessionStorage.getItem(STORAGE);
			if (raw) {
				const saved = JSON.parse(raw);
				if (saved.brief?.productName) setBrief({
					...emptyBrief,
					...saved.brief
				});
				if (saved.cut && Array.isArray(saved.cut.shots) && saved.cut.shots.length > 0) setCut(saved.cut);
				if (typeof saved.notice === "string") setNotice(saved.notice);
			}
		} catch {}
		setReady(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!ready) return;
		const payload = {
			brief,
			cut,
			notice
		};
		try {
			sessionStorage.setItem(STORAGE, JSON.stringify(payload));
		} catch {
			try {
				sessionStorage.setItem(STORAGE, JSON.stringify({
					...payload,
					brief: {
						...brief,
						image: ""
					}
				}));
			} catch {}
		}
	}, [
		brief,
		cut,
		notice,
		ready
	]);
	async function onImage(file) {
		setImageError(null);
		if (file.type && !/image\/(jpeg|png|webp)/.test(file.type)) {
			setImageError("Use a JPG, PNG, or WebP.");
			return;
		}
		if (file.size > 12e6) {
			setImageError("That photo is too large.");
			return;
		}
		try {
			const image = await fileToJpeg(file);
			setBrief((current) => ({
				...current,
				image
			}));
		} catch (err) {
			setImageError(err instanceof Error ? err.message : "Could not read that photo.");
		}
	}
	async function onSample() {
		setError(null);
		setImageError(null);
		setBrief(sampleBrief);
		try {
			const response = await fetch("/samples/stillwater.jpg");
			if (!response.ok) throw new Error("missing");
			const blob = await response.blob();
			const image = await fileToJpeg(new File([blob], "stillwater.jpg", { type: blob.type || "image/jpeg" }));
			setBrief({
				...sampleBrief,
				image
			});
		} catch {
			setImageError("Couldn't load the sample photo. You can still write the cut.");
		}
	}
	async function onSubmit() {
		const parsed = briefSchema.safeParse(brief);
		if (!parsed.success) {
			setError(parsed.error.issues[0]?.message ?? "Check the brief and try again.");
			return;
		}
		setPending(true);
		setError(null);
		try {
			const result = await generateCut({ data: parsed.data });
			setCut(result.cut);
			setNotice(result.notice);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Could not write the cut.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Studio"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl tracking-tight sm:text-5xl",
				children: "Reelroom"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-sm text-sm text-muted sm:text-right",
				children: "A product photo becomes a timed script, a shot list, and a storyboard."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BriefForm, {
				brief,
				pending,
				error,
				imageError,
				hasCut: Boolean(cut),
				onChange: (patch) => setBrief((current) => ({
					...current,
					...patch
				})),
				onImage: (file) => void onImage(file),
				onClearImage: () => setBrief((current) => ({
					...current,
					image: ""
				})),
				onSample: () => void onSample(),
				onSubmit: () => void onSubmit()
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "sr-only",
					"aria-live": "polite",
					children: pending ? "Writing the cut" : cut ? "Cut ready" : ""
				}), cut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CutBoard, {
					brief,
					cut,
					notice,
					pending,
					onChange: setCut
				}) : pending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Writing, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, {})]
			})]
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Studio, {});
}
//#endregion
export { Home as component };
