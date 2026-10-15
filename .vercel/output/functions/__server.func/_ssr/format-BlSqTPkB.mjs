import { c as string, i as literal, l as union, o as object, r as boolean, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/format-BlSqTPkB.js
var STYLE_IDS = [
	"luxury",
	"ugc",
	"unboxing",
	"before-after",
	"lifestyle",
	"cinematic",
	"testimonial",
	"asmr"
];
var STYLES = [
	{
		id: "luxury",
		label: "Luxury",
		blurb: "Slow light, few words, an expensive quiet."
	},
	{
		id: "ugc",
		label: "UGC",
		blurb: "Phone in hand. A person who already uses it."
	},
	{
		id: "unboxing",
		label: "Unboxing",
		blurb: "Hands, paper, and the first time it is seen."
	},
	{
		id: "before-after",
		label: "Before / after",
		blurb: "The same angle twice. No invented numbers."
	},
	{
		id: "lifestyle",
		label: "Lifestyle",
		blurb: "The product inside a morning that already exists."
	},
	{
		id: "cinematic",
		label: "Cinematic",
		blurb: "A trailer frame. Camera moves, copy stays short."
	},
	{
		id: "testimonial",
		label: "Testimonial",
		blurb: "One person, one specific result, no fake name."
	},
	{
		id: "asmr",
		label: "ASMR",
		blurb: "Taps, texture, and almost no talking."
	}
];
var PLATFORM_IDS = [
	"tiktok",
	"reels",
	"shorts",
	"feed"
];
var PLATFORMS = [
	{
		id: "tiktok",
		label: "TikTok",
		hint: "Pattern interrupt in the first second. Burned-in captions. Native, not a polished ad."
	},
	{
		id: "reels",
		label: "Reels",
		hint: "Polished vertical. The first frame also has to work as the cover."
	},
	{
		id: "shorts",
		label: "Shorts",
		hint: "Slightly clearer explanation. End on the action, not a logo stall."
	},
	{
		id: "feed",
		label: "Feed",
		hint: "Let it breathe. Frame the hero so it also crops to 4:5."
	}
];
var LENGTHS = [
	15,
	30,
	45
];
var LENGTH_NOTES = {
	15: "One idea. In and out.",
	30: "A demo with a beginning and an ask.",
	45: "Room for a small story."
};
var emptyBrief = {
	productName: "",
	claim: "",
	audience: "",
	platform: "reels",
	duration: 30,
	style: "luxury",
	cta: "",
	mustMention: "",
	includeVoiceover: true,
	image: ""
};
var sampleBrief = {
	productName: "Stillwater Serum",
	claim: "A 3% niacinamide serum that calms redness in a week, without the sting.",
	audience: "People who want calmer skin and are tired of harsh actives",
	platform: "reels",
	duration: 30,
	style: "luxury",
	cta: "Shop the calm",
	mustMention: "No fragrance",
	includeVoiceover: true,
	image: ""
};
var briefSchema = object({
	productName: string().trim().min(1, "Add a product name.").max(80, "Keep the name under 80 characters."),
	claim: string().trim().min(8, "Add a claim — a sentence about what it does.").max(500, "Keep the claim under 500 characters."),
	audience: string().trim().max(160, "Keep the audience line shorter."),
	platform: _enum(PLATFORM_IDS),
	duration: union([
		literal(15),
		literal(30),
		literal(45)
	]),
	style: _enum(STYLE_IDS),
	cta: string().trim().max(60, "Keep the call to action short."),
	mustMention: string().trim().max(180, "Keep the must-mention shorter."),
	includeVoiceover: boolean(),
	image: string().max(12e5, "That photo is too large. Try another one.").refine((value) => value === "" || /^data:image\/(jpeg|png|webp);base64,[a-z0-9+/=\s]+$/i.test(value), "Use a JPG, PNG, or WebP photo.")
});
function styleLabel(id) {
	return STYLES.find((s) => s.id === id)?.label ?? id;
}
function platformLabel(id) {
	return PLATFORMS.find((p) => p.id === id)?.label ?? id;
}
function clock(sec) {
	const s = Math.max(0, Math.round(sec));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}
function rangeLabel(shot) {
	return `${clock(shot.startSec)}–${clock(shot.endSec)}`;
}
function wordCount(text) {
	const t = text.trim();
	if (!t) return 0;
	return t.split(/\s+/).length;
}
function readSeconds(words) {
	if (!words) return 0;
	return Math.max(1, Math.round(words / 2.3));
}
function slugify(value) {
	return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "cut";
}
function voiceFor(style) {
	switch (style) {
		case "luxury": return {
			id: "sal",
			label: "Sal",
			speed: .92
		};
		case "asmr": return {
			id: "eve",
			label: "Eve",
			speed: .82
		};
		case "cinematic": return {
			id: "leo",
			label: "Leo",
			speed: .94
		};
		case "testimonial": return {
			id: "ara",
			label: "Ara",
			speed: 1
		};
		case "ugc": return {
			id: "rex",
			label: "Rex",
			speed: 1.05
		};
		case "unboxing": return {
			id: "eve",
			label: "Eve",
			speed: 1
		};
		case "lifestyle": return {
			id: "ara",
			label: "Ara",
			speed: 1
		};
		case "before-after": return {
			id: "leo",
			label: "Leo",
			speed: 1
		};
	}
}
function suggestTags(brief) {
	return [
		brief.productName.toLowerCase().replace(/[^a-z0-9]+/g, ""),
		{
			luxury: "quietluxury",
			ugc: "ugc",
			unboxing: "unboxing",
			"before-after": "beforeandafter",
			lifestyle: "lifestyle",
			cinematic: "productfilm",
			testimonial: "review",
			asmr: "asmr"
		}[brief.style],
		{
			tiktok: "tiktok",
			reels: "reels",
			shorts: "shorts",
			feed: "productvideo"
		}[brief.platform],
		"shotlist",
		"smallbusiness"
	].filter((tag) => tag.length > 1).slice(0, 6);
}
function cutToMarkdown(cut, brief) {
	const tags = cut.hashtags.filter(Boolean).map((tag) => `#${tag.replace(/^#/, "")}`);
	const shots = cut.shots.map((shot, index) => {
		return [
			`### ${index + 1} · ${rangeLabel(shot)}`,
			``,
			`Visual: ${shot.visual}`,
			`Camera: ${shot.camera}`,
			shot.onScreen ? `On screen: ${shot.onScreen}` : `On screen: —`,
			shot.line ? `Voice: ${shot.line}` : `Voice: —`,
			`Sound: ${shot.sound}`
		].join("\n");
	}).join("\n\n");
	return [
		`# ${cut.title}`,
		``,
		`${styleLabel(brief.style)} · ${platformLabel(brief.platform)} · ${brief.duration}s`,
		``,
		cut.concept,
		``,
		`## Hook`,
		``,
		cut.hook,
		``,
		`## Shots`,
		``,
		shots,
		``,
		`## Voiceover`,
		``,
		cut.voiceover.trim() || "No spoken voiceover.",
		``,
		`## Caption`,
		``,
		cut.caption,
		``,
		tags.length ? tags.join(" ") : "",
		``,
		`## Music`,
		``,
		`${cut.musicMood}. ${cut.musicNotes}`.trim(),
		``
	].filter((line, index, all) => !(line === "" && all[index - 1] === "")).join("\n");
}
function paceNote(words, duration) {
	const seconds = readSeconds(words);
	if (!words) return null;
	if (seconds > duration + 2) return `Tight for a ${duration}s cut — cut a line or two.`;
	if (seconds + 4 < duration && duration > 15) return `Short for ${duration}s. The picture can carry the rest.`;
	return null;
}
//#endregion
export { wordCount as _, briefSchema as a, paceNote as c, readSeconds as d, sampleBrief as f, voiceFor as g, suggestTags as h, STYLES as i, platformLabel as l, styleLabel as m, LENGTH_NOTES as n, cutToMarkdown as o, slugify as p, PLATFORMS as r, emptyBrief as s, LENGTHS as t, rangeLabel as u };
