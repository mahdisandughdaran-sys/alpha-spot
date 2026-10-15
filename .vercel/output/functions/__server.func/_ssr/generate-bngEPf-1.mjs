import { t as createServerFn } from "./ssr.mjs";
import { n as takeToken, t as createServerRpc } from "./limit-eJTtcwDW.mjs";
import { a as number$1, c as string, n as array, o as object, s as preprocess } from "../_libs/zod.mjs";
import { a as briefSchema, h as suggestTags, i as STYLES, r as PLATFORMS } from "./format-BlSqTPkB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/generate-bngEPf-1.js
var ROWS = {
	luxury: [
		[
			"Macro on the edge of {name} as a hard sidelight crosses the surface.",
			"Locked macro, 9:16. The light moves. The product does not.",
			"{name}",
			"",
			"Room tone, then a soft scrape."
		],
		[
			"A hand sets {name} down and leaves the frame. No rush.",
			"Top-three-quarter, locked off.",
			"",
			"Nothing about {name} hurries.",
			"The set-down, then quiet."
		],
		[
			"A detail the photo actually has: material, cap, or glass. Hold on it.",
			"Macro push, very slow.",
			"",
			"{claim}",
			"Almost nothing."
		],
		[
			"One use, shown once. A drop, a swipe, or a pour. Then stop.",
			"Close, side angle, hands only.",
			"",
			"{mention}",
			"The sound of that one action."
		],
		[
			"Pull back to a still life. {name} small, a lot of empty surface.",
			"Slow pull, then lock.",
			"",
			"",
			"A long room tone."
		],
		[
			"The hero frame. Product centered, label readable if it has one.",
			"Locked hero, soft falloff.",
			"{name}",
			"",
			"A single low piano note."
		],
		[
			"Hold the hero. The ask arrives late, small, at the bottom.",
			"Same frame. No zoom.",
			"{cta}",
			"{cta}.",
			"The note fades out."
		]
	],
	ugc: [
		[
			"Selfie framing in a real room. They look just past the lens, mid-thought.",
			"Front camera, handheld, 9:16. Imperfect on purpose.",
			"Wait.",
			"Okay. Real talk about {name}.",
			"Room noise. No music yet."
		],
		[
			"They shove {name} toward the lens until it fills the frame.",
			"Arm's length, slight shake.",
			"",
			"{claim}",
			"A light tap on the product."
		],
		[
			"They actually use it. The camera follows late.",
			"Handheld, one messy reframing.",
			"",
			"This is the part I actually do.",
			"Use sound, close."
		],
		[
			"Cut to the result area. Same person, same light, no filter talk.",
			"Slightly tighter selfie.",
			"{short}",
			"That's it. I'm not doing a second take.",
			"Music ducks under the voice."
		],
		[
			"Product in one hand, their face in frame. They shrug, convinced.",
			"Locked-enough selfie.",
			"",
			"{mention}",
			"Dry room, light bed underneath."
		],
		[
			"They point down, toward the caption, not at a fake button.",
			"Same setup.",
			"{cta}",
			"If you want it, {cta}.",
			"Bed stays low."
		],
		[
			"Freeze on the product in their hand. Face still in frame.",
			"Hold the last frame.",
			"{cta}",
			"",
			"Cut the music with the picture."
		]
	],
	unboxing: [
		[
			"A closed parcel on a table. Hands enter and stop.",
			"Top-down, locked, 9:16.",
			"It's here.",
			"",
			"Paper, close mic."
		],
		[
			"The open. Tissue, seal, or lid — whatever this package really has.",
			"Top-down, hands only.",
			"",
			"Left this sealed until the camera was on.",
			"The open, nothing else."
		],
		[
			"First sight of {name}. They pause before lifting it.",
			"Slightly closer, still top-down.",
			"{name}",
			"{name}.",
			"A breath, then quiet."
		],
		[
			"Lift and turn {name} so the form reads. Match the photo.",
			"Hands bring it up to a 45-degree angle.",
			"",
			"{claim}",
			"A soft set-back on the table."
		],
		[
			"Everything that came in the box, laid out in a row. No extra props.",
			"Top-down, wider.",
			"",
			"{mention}",
			"Light paper rustle."
		],
		[
			"They use it immediately. The box stays in the background.",
			"Side angle, hands and product.",
			"{short}",
			"So I tried it before I put the box away.",
			"The use, close mic."
		],
		[
			"Box and product together. Hands leave.",
			"Locked wide of the table.",
			"{cta}",
			"{cta}.",
			"Room tone."
		]
	],
	"before-after": [
		[
			"The problem, plainly, in the same spot the after will use. No product yet.",
			"Locked tripod, 9:16. Do not move it after this.",
			"Before",
			"",
			"Silence."
		],
		[
			"Stay on that frame. The claim is spoken, not typeset as a statistic.",
			"Same lock.",
			"",
			"{claim}",
			"Voice only."
		],
		[
			"{name} enters the locked frame and is set down.",
			"Same lock. A hand enters and leaves.",
			"{name}",
			"This is {name}.",
			"The set-down."
		],
		[
			"The use, in that same setup. Show the action the claim depends on.",
			"Same tripod. Cut in closer only for the action, then return.",
			"",
			"{mention}",
			"The action, close."
		],
		[
			"Hard cut back to the original frame.",
			"Exact lock from shot 1.",
			"After",
			"Same light. Same angle.",
			"A soft hit on the cut."
		],
		[
			"Hold the after long enough to read. Do not add a percentage.",
			"Same lock.",
			"{short}",
			"{short}.",
			"Hold the room tone."
		],
		[
			"{name} in the after frame, small, with the ask.",
			"Same lock, product placed in the lower third.",
			"{cta}",
			"{cta}.",
			"Music only under the last second."
		]
	],
	lifestyle: [
		[
			"A morning that already has a life in it. {name} is out of focus, on the table.",
			"Handheld drift, 9:16, window light.",
			"",
			"",
			"A room waking up. No score yet."
		],
		[
			"{name} comes into a routine between two real actions. Coffee, keys, a bag.",
			"Close insert, then back to the room.",
			"",
			"It just lives here.",
			"Cup, keys, cloth."
		],
		[
			"They use {name} without announcing it. The camera notices late.",
			"Over-shoulder, natural pace.",
			"",
			"{claim}",
			"The use, not boosted."
		],
		[
			"A detail of the product in that same light. Match the photo's color and form.",
			"Macro insert, two seconds, then leave.",
			"{name}",
			"",
			"Quiet."
		],
		[
			"The routine continues. The product stays where it was set.",
			"Wider, person leaving or sitting back.",
			"",
			"{mention}",
			"Footsteps or a chair."
		],
		[
			"Empty-ish frame. {name} remains. The line is casual, not a slogan.",
			"Locked still life in the real room.",
			"{short}",
			"That's the whole case for it.",
			"Score sneaks in, low."
		],
		[
			"Hold. The ask is a burned-in line, not a stinger.",
			"Same still life.",
			"{cta}",
			"{cta}.",
			"Score ends with the room."
		]
	],
	cinematic: [
		[
			"{name} is small in a wide frame. The camera is already moving.",
			"Slow lateral move, 9:16, motivated light.",
			"",
			"",
			"Low room tone, then a pulse."
		],
		[
			"The move ends in a push toward the product. Title lands.",
			"Push in, ease out.",
			"{name}",
			"",
			"One low hit under the title."
		],
		[
			"A designed insert: the use, slightly slow, isolated from the room.",
			"Slider or pan, close.",
			"",
			"{claim}",
			"The action, stretched."
		],
		[
			"Light on the material from the photo. No extra set dressing.",
			"Macro, moving highlight.",
			"",
			"",
			"Texture only."
		],
		[
			"Cut wide again. The product holds the center.",
			"Locked hero with a faint drift.",
			"{short}",
			"{short}.",
			"Pulse returns, quieter."
		],
		[
			"Negative space. The line is almost a whisper.",
			"Same hero, lower exposure.",
			"",
			"{mention}",
			"Near silence."
		],
		[
			"Title and ask together. Fade rather than a hard end card slap.",
			"Locked. Fade on the last half second.",
			"{cta}",
			"{cta}.",
			"Pulse resolves."
		]
	],
	testimonial: [
		[
			"One person, shoulders up, window light. No name chyron. No star rating.",
			"Locked interview, 9:16, eyeline just off lens.",
			"",
			"I didn't think {name} would do anything.",
			"Room air. No score."
		],
		[
			"They pick up {name} without performing it.",
			"Same frame. Hands enter.",
			"",
			"{claim}",
			"The pickup."
		],
		[
			"Cutaway of the product while their voice continues. Match the photo.",
			"Insert, locked, then back to the face.",
			"{name}",
			"",
			"Voice carries over the cut."
		],
		[
			"Back on the face. They get specific. Do not invent a result they weren't given.",
			"Same interview frame.",
			"",
			"{mention}",
			"Quiet."
		],
		[
			"They use it once, on camera, then look back.",
			"Side angle for the use, then return.",
			"{short}",
			"So that's what I actually do with it.",
			"Use sound under the voice."
		],
		[
			"Hold on their face after they stop talking.",
			"Locked interview.",
			"",
			"",
			"Two seconds of air."
		],
		[
			"They say the ask once, to the lens, and the product stays in frame.",
			"Same frame.",
			"{cta}",
			"{cta}.",
			"No stinger."
		]
	],
	asmr: [
		[
			"Fingers tap {name} twice. No face.",
			"Macro, locked, 9:16.",
			"{name}",
			"",
			"Two taps, close mic."
		],
		[
			"The open. Cap, lid, seal, or box — only what this product has.",
			"Macro on the hands.",
			"",
			"",
			"The open, nothing else."
		],
		[
			"Texture: pour, pump, cloth, or click. One action, repeated once.",
			"Tighter macro.",
			"",
			"",
			"That texture, dry and close."
		],
		[
			"Hold on the texture. One whisper, not a pitch.",
			"Same macro.",
			"",
			"{short}.",
			"Whisper, almost inside the sound."
		],
		[
			"Set {name} down on the surface. Hands hover, then settle it.",
			"Slightly wider macro.",
			"",
			"",
			"The set-down, then the surface."
		],
		[
			"Hands leave. The product stays. Silence is the point.",
			"Locked.",
			"{mention}",
			"",
			"Three seconds of nothing."
		],
		[
			"A still frame. The ask is text only.",
			"Same lock.",
			"{cta}",
			"",
			"No music."
		]
	]
};
var CONCEPT = {
	luxury: "{name} is filmed like an object, not a pitch. {claim}",
	ugc: "Someone talks to a friend about {name}, and actually uses it. {claim}",
	unboxing: "The first open of {name}, shot from above, with the mess left in. {claim}",
	"before-after": "One locked angle of the problem, then the same angle after {name}. {claim}",
	lifestyle: "{name} sits inside a morning that was already happening. {claim}",
	cinematic: "A short trailer for {name}. The camera moves, the copy does not. {claim}",
	testimonial: "One unnamed person, no star rating, talking about {name}. {claim}",
	asmr: "Hands and texture only. {name} is heard before it is explained. {claim}"
};
var MUSIC = {
	luxury: {
		mood: "Sparse",
		notes: "A few piano notes, long reverb, no vocals, low under the picture."
	},
	ugc: {
		mood: "Dry and light",
		notes: "A simple acoustic loop, ducked hard under the voice. No lyrics."
	},
	unboxing: {
		mood: "Close and papery",
		notes: "Almost no score. Let the pack sounds lead. A soft pulse only at the end."
	},
	"before-after": {
		mood: "Neutral pulse",
		notes: "A half-time tick, no vocals. It should not cheer the after."
	},
	lifestyle: {
		mood: "Warm and low",
		notes: "Guitar or keys at morning tempo, kept under the room sound."
	},
	cinematic: {
		mood: "Slow pulse",
		notes: "Low strings or a synth drone, no vocals, one hit on the title."
	},
	testimonial: {
		mood: "Near silent",
		notes: "Room air only until the last shot. No motivational bed."
	},
	asmr: {
		mood: "None",
		notes: "No music. Close microphone only."
	}
};
function clipWords(text, max) {
	const words = text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
	if (words.length <= max) return words.join(" ");
	return words.slice(0, max).join(" ");
}
function fill(template, brief) {
	const claim = brief.claim.replace(/\s+/g, " ").trim().replace(/\.$/, "");
	const mention = brief.mustMention.replace(/\s+/g, " ").trim();
	const cta = (brief.cta || "Learn more").replace(/\s+/g, " ").trim();
	return template.replaceAll("{name}", brief.productName.trim()).replaceAll("{claim}", clipWords(claim, 18)).replaceAll("{short}", clipWords(claim, 8)).replaceAll("{cta}", cta).replaceAll("{mention}", mention).replace(/\s+/g, " ").trim();
}
function pickRows(style, duration) {
	const all = ROWS[style];
	if (duration <= 15) return [
		all[0],
		all[1],
		all[3],
		all[6]
	];
	if (duration <= 30) return [
		all[0],
		all[1],
		all[2],
		all[3],
		all[4],
		all[6]
	];
	return all;
}
function draftCut(brief) {
	const rows = pickRows(brief.style, brief.duration);
	const n = rows.length;
	const edges = Array.from({ length: n + 1 }, (_, i) => Math.round(brief.duration * i / n));
	edges[0] = 0;
	edges[n] = brief.duration;
	const shots = rows.map((row, index) => {
		const line = brief.includeVoiceover ? fill(row[3], brief) : "";
		const onScreen = clipWords(fill(row[2], brief), 6);
		return {
			startSec: edges[index],
			endSec: edges[index + 1],
			visual: fill(row[0], brief),
			camera: row[1],
			onScreen,
			line,
			sound: row[4]
		};
	});
	if (brief.includeVoiceover && brief.mustMention.trim()) {
		const mention = brief.mustMention.trim();
		if (!shots.some((shot) => shot.line.toLowerCase().includes(mention.toLowerCase()))) {
			const host = shots.find((shot) => shot.line) ?? shots[Math.min(2, shots.length - 1)];
			host.line = `${host.line} ${mention}`.trim();
		}
	}
	const voiceover = brief.includeVoiceover ? shots.map((shot) => shot.line.trim()).filter(Boolean).join(" ") : "";
	const concept = fill(CONCEPT[brief.style], brief);
	const hook = shots.find((shot) => shot.onScreen)?.onScreen || shots.find((shot) => shot.line)?.line || brief.productName;
	const music = MUSIC[brief.style];
	const cta = brief.cta.trim() || "Learn more";
	return {
		title: brief.productName.trim(),
		concept,
		hook,
		voiceover,
		caption: `${brief.productName.trim()} — ${clipWords(brief.claim, 22)}. ${cta}.`,
		hashtags: suggestTags(brief),
		musicMood: music.mood,
		musicNotes: music.notes,
		shots,
		source: "draft"
	};
}
var number = preprocess((value) => typeof value === "string" ? Number(value) : value, number$1());
var modelSchema = object({
	title: string(),
	concept: string(),
	hook: string(),
	voiceover: string(),
	caption: string(),
	hashtags: array(string()),
	musicMood: string(),
	musicNotes: string(),
	shots: array(object({
		startSec: number,
		endSec: number,
		visual: string(),
		camera: string(),
		onScreen: string(),
		line: string(),
		sound: string()
	}))
});
var CUT_SCHEMA = {
	type: "object",
	additionalProperties: false,
	properties: {
		title: { type: "string" },
		concept: { type: "string" },
		hook: { type: "string" },
		voiceover: { type: "string" },
		caption: { type: "string" },
		hashtags: {
			type: "array",
			items: { type: "string" }
		},
		musicMood: { type: "string" },
		musicNotes: { type: "string" },
		shots: {
			type: "array",
			items: {
				type: "object",
				additionalProperties: false,
				properties: {
					startSec: { type: "number" },
					endSec: { type: "number" },
					visual: { type: "string" },
					camera: { type: "string" },
					onScreen: { type: "string" },
					line: { type: "string" },
					sound: { type: "string" }
				},
				required: [
					"startSec",
					"endSec",
					"visual",
					"camera",
					"onScreen",
					"line",
					"sound"
				]
			}
		}
	},
	required: [
		"title",
		"concept",
		"hook",
		"voiceover",
		"caption",
		"hashtags",
		"musicMood",
		"musicNotes",
		"shots"
	]
};
function clip(value, max) {
	const text = value.replace(/\s+/g, " ").trim();
	if (text.length <= max) return text;
	return `${text.slice(0, max - 1).trimEnd()}…`;
}
function retime(shots, duration) {
	if (!shots.length) return shots;
	const sorted = [...shots].sort((a, b) => a.startSec - b.startSec);
	const divide = () => {
		const edges = Array.from({ length: sorted.length + 1 }, (_, i) => Math.round(duration * i / sorted.length));
		edges[0] = 0;
		edges[sorted.length] = duration;
		return sorted.map((shot, index) => ({
			...shot,
			startSec: edges[index],
			endSec: edges[index + 1]
		}));
	};
	if (!sorted.every((shot, index) => shot.endSec > shot.startSec && (index === 0 || shot.startSec >= sorted[index - 1].endSec - .4)) || sorted[0].startSec > .6 || Math.abs(sorted[sorted.length - 1].endSec - duration) > 1.2) return divide();
	const next = sorted.map((shot) => ({
		...shot,
		startSec: Math.round(shot.startSec),
		endSec: Math.round(shot.endSec)
	}));
	next[0].startSec = 0;
	for (let i = 0; i < next.length - 1; i++) next[i].endSec = next[i + 1].startSec;
	next[next.length - 1].endSec = duration;
	if (next.some((shot) => shot.endSec <= shot.startSec)) return divide();
	return next;
}
function toCut(raw, brief) {
	const shots = retime(raw.shots.map((shot) => ({
		startSec: shot.startSec,
		endSec: shot.endSec,
		visual: clip(shot.visual, 320),
		camera: clip(shot.camera, 180),
		onScreen: clip(shot.onScreen, 80),
		line: brief.includeVoiceover ? clip(shot.line, 240) : "",
		sound: clip(shot.sound, 160)
	})).filter((shot) => shot.visual.length > 0).slice(0, 8), brief.duration);
	if (shots.length < 3) return null;
	const hashtags = raw.hashtags.map((tag) => tag.replace(/^#/, "").trim().replace(/\s+/g, "").slice(0, 32)).filter(Boolean).slice(0, 8);
	return {
		title: clip(raw.title, 80) || brief.productName,
		concept: clip(raw.concept, 280),
		hook: clip(raw.hook, 140),
		voiceover: brief.includeVoiceover ? clip(raw.voiceover, 1200) : "",
		caption: clip(raw.caption, 280),
		hashtags: hashtags.length >= 3 ? hashtags : suggestTags(brief),
		musicMood: clip(raw.musicMood, 40),
		musicNotes: clip(raw.musicNotes, 180),
		shots,
		source: "model"
	};
}
function promptFor(brief) {
	const style = STYLES.find((item) => item.id === brief.style);
	const platform = PLATFORMS.find((item) => item.id === brief.platform);
	const cta = brief.cta.trim() || "Learn more";
	return [
		`Product: ${brief.productName}`,
		`Claim: ${brief.claim}`,
		`Audience: ${brief.audience.trim() || "Not specified"}`,
		`Platform: ${platform?.label}. ${platform?.hint}`,
		`Length: ${brief.duration} seconds. Vertical 9:16.`,
		`Style: ${style?.label}. ${style?.blurb}`,
		`Call to action: ${cta}`,
		`Must mention, once, only if it fits: ${brief.mustMention.trim() || "nothing extra"}`,
		`Voiceover: ${brief.includeVoiceover ? "spoken" : "none — on-screen text only, every line is an empty string, voiceover is an empty string"}`,
		brief.image ? "A product photo is attached. Match its real color, material, and shape. Do not invent a different package." : "No photo. Do not invent packaging colors or materials.",
		"",
		"Rules:",
		`- Use ${brief.duration === 15 ? "4" : brief.duration === 30 ? "6" : "7"} shots.`,
		`- Shots run from 0 to exactly ${brief.duration} with no gaps or overlaps. startSec and endSec are seconds.`,
		"- Shot 1 stops the scroll. The last shot carries the call to action.",
		"- On-screen text is at most 6 words.",
		"- Spoken lines together must fit the duration at about 2.2 words per second.",
		"- voiceover is the shot lines joined in order. Do not add speech that is not in a shot.",
		"- Do not invent reviews, prices, awards, or clinical numbers that were not in the claim.",
		"- hashtags: 6 tags, no # character, no spaces.",
		"- musicNotes describes instrumentation and tempo. Do not name a copyrighted song.",
		"- Be filmable. Say what the camera sees."
	].join("\n");
}
var SYSTEM = `You are a senior short-form creative director. You write shoot-ready social ads. Be concrete. Never use filler like "elevate", "unlock", "game-changer", or "introducing". If a photo is attached, trust what you see over a generic product fantasy.`;
async function callModel(apiKey, brief, extra) {
	const content = [{
		type: "text",
		text: promptFor(brief)
	}];
	if (brief.image) content.push({
		type: "image_url",
		image_url: {
			url: brief.image,
			detail: "low"
		}
	});
	return fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: [{
				role: "system",
				content: SYSTEM
			}, {
				role: "user",
				content
			}],
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "reel_cut",
					strict: true,
					schema: CUT_SCHEMA
				}
			},
			max_tokens: 2200,
			...extra
		}),
		signal: AbortSignal.timeout(55e3)
	});
}
function parseContent(content) {
	const trimmed = content.trim();
	try {
		return JSON.parse(trimmed);
	} catch {
		const match = trimmed.match(/\{[\s\S]*\}/);
		if (!match) throw new Error("no json");
		return JSON.parse(match[0]);
	}
}
var generateCut_createServerFn_handler = createServerRpc({
	id: "9e34701dc84a2d94e222767a677c6aee49fafecf6da6ad026365a9017785266a",
	name: "generateCut",
	filename: "src/lib/reel/generate.ts"
}, (opts) => generateCut.__executeServer(opts));
var generateCut = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = briefSchema.safeParse(input);
	if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Check the brief and try again.");
	return parsed.data;
}).handler(generateCut_createServerFn_handler, async ({ data }) => {
	const brief = data;
	if (!takeToken("gen", 40, 6e5)) return {
		ok: true,
		cut: draftCut(brief),
		notice: "Too many cuts in a short window. This one is a studio template — edit it before you shoot."
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: true,
		cut: draftCut(brief),
		notice: "Live drafting isn't available. This is a studio template you can edit."
	};
	try {
		let response = await callModel(apiKey, brief, {
			reasoning_effort: "low",
			temperature: .7
		});
		if (response.status === 400) response = await callModel(apiKey, brief, {});
		if (!response.ok) {
			console.error("reelroom generate failed", response.status);
			return {
				ok: true,
				cut: draftCut(brief),
				notice: "The model didn't answer. This is a studio template you can edit."
			};
		}
		const content = (await response.json()).choices?.[0]?.message?.content;
		if (!content) return {
			ok: true,
			cut: draftCut(brief),
			notice: "The model returned an empty cut. This is a studio template you can edit."
		};
		const parsed = modelSchema.safeParse(parseContent(content));
		const cut = parsed.success ? toCut(parsed.data, brief) : null;
		if (!cut) return {
			ok: true,
			cut: draftCut(brief),
			notice: "The model reply couldn't be used. This is a studio template you can edit."
		};
		return {
			ok: true,
			cut,
			notice: null
		};
	} catch (error) {
		console.error("reelroom generate threw", error instanceof Error ? error.name : "error");
		return {
			ok: true,
			cut: draftCut(brief),
			notice: "The model didn't answer. This is a studio template you can edit."
		};
	}
});
//#endregion
export { generateCut_createServerFn_handler };
