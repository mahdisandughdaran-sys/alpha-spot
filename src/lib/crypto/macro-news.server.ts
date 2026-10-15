import type { MacroDesk, MacroItem } from "./macro.ts";

export type { MacroDesk, MacroItem } from "./macro.ts";

const FEEDS = [
  "https://www.federalreserve.gov/feeds/press_monetary.xml",
  "https://www.federalreserve.gov/feeds/press_all.xml",
];

let cache: { at: number; value: MacroDesk } | null = null;
const TTL = 15 * 60 * 1000;

function decode(value: string): string {
  return value
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function grab(xml: string, tag: string): string {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"));
  return match ? decode(match[1]) : "";
}

function tagFor(title: string): { fa: string; en: string } {
  const text = title.toLowerCase();
  if (/fomc|federal funds|interest rate|monetary policy|discount rate/.test(text)) {
    return { fa: "نرخ بهره", en: "Rates" };
  }
  if (/inflation|cpi|pce|price/.test(text)) return { fa: "تورم", en: "Inflation" };
  if (/employment|labor|payroll|unemployment|job/.test(text)) return { fa: "اشتغال", en: "Jobs" };
  if (/balance sheet|treasury|financial stability/.test(text)) return { fa: "ترازنامه", en: "Balance sheet" };
  return { fa: "فدرال رزرو", en: "Fed" };
}

function parseFeed(xml: string): MacroItem[] {
  return xml
    .split(/<item\b/i)
    .slice(1)
    .map((chunk) => {
      const title = grab(chunk, "title");
      const link = grab(chunk, "link") || grab(chunk, "guid");
      const publishedAt = grab(chunk, "pubDate");
      const summary = grab(chunk, "description").slice(0, 240);
      const tag = tagFor(`${title} ${summary}`);
      return { title, link, publishedAt, summary, tagFa: tag.fa, tagEn: tag.en };
    })
    .filter((item) => item.title && item.link.startsWith("https://"));
}

export async function loadMacroNews(): Promise<MacroDesk> {
  if (cache && Date.now() - cache.at < TTL) return cache.value;

  const collected: MacroItem[] = [];
  let failed = 0;
  for (const url of FEEDS) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/rss+xml, application/xml, text/xml" },
        signal: AbortSignal.timeout(12_000),
      });
      if (!response.ok) {
        failed += 1;
        continue;
      }
      collected.push(...parseFeed(await response.text()));
    } catch {
      failed += 1;
    }
  }

  const seen = new Set<string>();
  const items = collected
    .filter((item) => {
      if (seen.has(item.link)) return false;
      seen.add(item.link);
      return true;
    })
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
    .slice(0, 10);

  const value: MacroDesk = {
    items,
    source: "Federal Reserve",
    note:
      items.length > 0
        ? null
        : failed === FEEDS.length
          ? "فید فدرال رزرو الان جواب نداد. تقویم جلسه و تعطیل سر جایش است."
          : "خبر تازه‌ای در فید نبود.",
  };
  cache = { at: Date.now(), value };
  return value;
}
