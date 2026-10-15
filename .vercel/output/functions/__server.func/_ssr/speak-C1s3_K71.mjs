import { t as createServerFn } from "./ssr.mjs";
import { n as takeToken, t as createServerRpc } from "./limit-eJTtcwDW.mjs";
import { a as number, c as string, o as object, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/speak-C1s3_K71.js
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
var speakVoiceover_createServerFn_handler = createServerRpc({
	id: "7519c7a0a92f7ba72eb608cdeb91031b14c47bbf3663baf4dda3b534617f20dc",
	name: "speakVoiceover",
	filename: "src/lib/reel/speak.ts"
}, (opts) => speakVoiceover.__executeServer(opts));
var speakVoiceover = createServerFn({ method: "POST" }).validator((input) => {
	const parsed = speakSchema.safeParse(input);
	if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? "Can't read that yet.");
	return parsed.data;
}).handler(speakVoiceover_createServerFn_handler, async ({ data }) => {
	if (!takeToken("tts", 30, 6e5)) return {
		ok: false,
		error: "Too many previews. Wait a minute and try again."
	};
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "Voice preview isn't available right now."
	};
	try {
		const response = await fetch("https://api.x.ai/v1/tts", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				text: data.text,
				voice_id: data.voiceId,
				language: "en",
				speed: data.speed
			}),
			signal: AbortSignal.timeout(4e4)
		});
		if (!response.ok) {
			console.error("reelroom tts failed", response.status);
			return {
				ok: false,
				error: "The read didn't come back. Try again."
			};
		}
		const bytes = new Uint8Array(await response.arrayBuffer());
		if (bytes.byteLength < 100) return {
			ok: false,
			error: "The read came back empty."
		};
		let binary = "";
		const chunk = 8192;
		for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
		return {
			ok: true,
			audioBase64: btoa(binary),
			mime: "audio/mpeg"
		};
	} catch (error) {
		console.error("reelroom tts threw", error instanceof Error ? error.name : "error");
		return {
			ok: false,
			error: "The read didn't come back. Try again."
		};
	}
});
//#endregion
export { speakVoiceover_createServerFn_handler };
