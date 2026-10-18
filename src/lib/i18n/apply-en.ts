import { PHRASES } from "./phrases.ts";
import { WORDS } from "./words.ts";

const SEP = "\u2063";
/** Any Arabic-script character, including digits and ٪. */
const FA_BLOCK = /[\u0600-\u06FF]/;
/** Persian/Arabic letters only. Punctuation and digits are not part of a word. */
const FA_CHAR = /[\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u0629\u0643\u064A\u06C0\u200c]/;
const FA_LETTER = /[\u0621-\u063A\u0641-\u064A\u067E\u0686\u0698\u06A9\u06AF\u06CC\u0629\u0643\u064A\u06C0]/;

const LATIN: Record<string, string> = {
  ا: "a",
  آ: "a",
  ب: "b",
  پ: "p",
  ت: "t",
  ث: "s",
  ج: "j",
  چ: "ch",
  ح: "h",
  خ: "kh",
  د: "d",
  ذ: "z",
  ر: "r",
  ز: "z",
  ژ: "zh",
  س: "s",
  ش: "sh",
  ص: "s",
  ض: "z",
  ط: "t",
  ظ: "z",
  ع: "a",
  غ: "gh",
  ف: "f",
  ق: "gh",
  ک: "k",
  ك: "k",
  گ: "g",
  ل: "l",
  م: "m",
  ن: "n",
  و: "v",
  ه: "h",
  ة: "h",
  ی: "i",
  ي: "i",
  ئ: "i",
  ء: "",
  ؤ: "v",
  "‌": "",
  "ٔ": "",
  "ٰ": "",
};

let table: [string, string][] | null = null;

function entries(): [string, string][] {
  if (table) return table;
  const map = new Map<string, string>();
  for (const [fa, en] of Object.entries(WORDS)) {
    if (fa && en != null) map.set(fa, en);
  }
  for (const [fa, en] of PHRASES) {
    if (fa && en != null) map.set(fa, en);
  }
  table = [...map.entries()].sort((a, b) => b[0].length - a[0].length);
  return table;
}

export function hasPersian(text: string): boolean {
  return FA_BLOCK.test(text);
}

/** Keep prices and percents intact: ۴٫۵۰٪ → 4.50%, ۱٬۲۵۰ → 1,250. */
function normalizeNumerals(text: string): string {
  return text
    .replace(/[۰-۹]/g, (digit) => {
      const n = "۰۱۲۳۴۵۶۷۸۹".indexOf(digit);
      return n >= 0 ? String(n) : digit;
    })
    .replace(/[٠-٩]/g, (digit) => {
      const n = "٠١٢٣٤٥٦٧٨٩".indexOf(digit);
      return n >= 0 ? String(n) : digit;
    })
    .replace(/\u066b/g, ".")
    .replace(/\u066c/g, ",")
    .replace(/٪/g, "%");
}

function transliterate(text: string): string {
  let out = "";
  for (const ch of text) {
    if (LATIN[ch] != null) out += LATIN[ch];
    else if (FA_LETTER.test(ch)) out += "";
    else out += ch;
  }
  return out.replace(/[ ]{2,}/g, " ");
}

function tidy(text: string): string {
  return normalizeNumerals(text)
    .replace(/[ ]{2,}/g, " ")
    .replace(/ +([,.;:!?])/g, "$1")
    .replace(/\s+%/g, "%");
}

/** English for a user-visible string. Persian mode must not call this. */
export function applyEnglish(text: string): string {
  if (!text) return text;
  if (text.includes(SEP)) {
    const i = text.indexOf(SEP);
    const en = text.slice(i + SEP.length);
    const fa = text.slice(0, i);
    if (en && !FA_LETTER.test(en)) return tidy(en);
    return applyEnglish(fa);
  }
  if (!FA_BLOCK.test(text)) return text;

  const rows = entries();
  const direct = rows.find(([fa]) => fa === text);
  if (direct) return tidy(direct[1]);
  const trimmed = text.trim();
  if (trimmed !== text) {
    const hit = rows.find(([fa]) => fa === trimmed);
    if (hit) {
      const lead = text.slice(0, text.indexOf(trimmed));
      const trail = text.slice(text.indexOf(trimmed) + trimmed.length);
      return tidy(lead + hit[1] + trail);
    }
  }

  let out = text;
  for (const [fa, en] of rows) {
    if (fa.length === 0 || !out.includes(fa)) continue;
    let idx = 0;
    while (idx < out.length) {
      const at = out.indexOf(fa, idx);
      if (at < 0) break;
      const beforeOk = at === 0 || !FA_CHAR.test(out[at - 1] ?? "");
      const afterAt = at + fa.length;
      const afterOk = afterAt >= out.length || !FA_CHAR.test(out[afterAt] ?? "");
      if (beforeOk && afterOk) {
        out = out.slice(0, at) + en + out.slice(afterAt);
        idx = at + en.length;
      } else {
        idx = at + fa.length;
      }
    }
  }
  if (FA_LETTER.test(out)) out = transliterate(out);
  return tidy(out);
}
