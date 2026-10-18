import { applyEnglish, hasPersian } from "./apply-en.ts";

export type Locale = "fa" | "en";

/** Invisible separator. Persian stays the prefix so existing checks still match. */
const SEP = "\u2063";

let locale: Locale = "fa";

export function getLocale(): Locale {
  return locale;
}

export function setLocaleStore(next: Locale) {
  locale = next;
}

/** Keep the Persian sentence exact and attach an English twin for the UI. */
export function msg(fa: string, en: string): string {
  if (!fa || fa.includes(SEP)) return fa;
  return `${fa}${SEP}${en}`;
}

export function splitBi(value: string): { fa: string; en?: string } {
  const i = value.indexOf(SEP);
  if (i < 0) return { fa: value };
  return { fa: value.slice(0, i), en: value.slice(i + SEP.length) };
}

export function plain(value: string): string {
  return splitBi(value).fa;
}

export function tr(value: string, en?: string): string {
  const parts = splitBi(value);
  if (locale !== "en") return parts.fa;
  const chosen = en ?? parts.en;
  if (chosen && !hasPersian(chosen) && !chosen.includes("٪")) return chosen;
  if (chosen && !hasPersian(chosen)) return applyEnglish(chosen);
  return applyEnglish(parts.fa);
}
