import { Newspaper, CalendarOff } from "lucide-react";
import { useI18n } from "@/lib/i18n/locale";
import type { MacroDesk } from "@/lib/crypto/macro";
import { sessionCalendar, upcomingEvents } from "@/lib/crypto/session-calendar";

function when(value: string, locale: "fa" | "en"): string {
  const time = Date.parse(value);
  if (!Number.isFinite(time)) return "";
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    month: "short",
    day: "numeric",
  }).format(time);
}

export function MacroRail({
  news,
  mode = "compact",
}: {
  news: MacroDesk | null;
  mode?: "compact" | "full";
}) {
  const { tr, locale } = useI18n();
  const day = sessionCalendar(new Date());
  const events = upcomingEvents(day.newYorkYmd, mode === "full" ? 8 : 3);
  const items = news?.items.slice(0, mode === "full" ? 10 : 4) ?? [];

  return (
    <section
      className={
        day.blockSpot
          ? "rounded-xl bg-down-dim p-4 text-down shadow-[var(--shadow-border)] md:p-5"
          : "rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] md:p-5"
      }
    >
      <div className="flex items-start gap-3">
        {day.blockSpot ? (
          <CalendarOff className="mt-0.5 size-5 shrink-0" strokeWidth={1.75} />
        ) : (
          <Newspaper className="mt-0.5 size-5 shrink-0 text-muted" strokeWidth={1.75} />
        )}
        <div className="min-w-0 flex-1">
          <p className={`text-sm font-medium ${day.blockSpot ? "" : "text-fg"}`}>{tr(day.titleFa, day.titleEn)}</p>
          <p className={`mt-1 text-xs leading-relaxed ${day.blockSpot ? "text-down/90" : "text-muted"}`}>
            {tr(day.reasonFa, day.reasonEn)}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-md bg-bg/40 px-3 py-2">
          <dt className="text-xs text-muted">{tr("تعطیلی بعد", "Next close")}</dt>
          <dd className="mt-1 text-sm text-fg">
            {day.nextClosed
              ? tr(day.nextClosed.nameFa, day.nextClosed.nameEn)
              : "—"}
          </dd>
          {day.nextClosed ? <p className="num mt-1 text-xs text-subtle">{day.nextClosed.ymd}</p> : null}
        </div>
        <div className="rounded-md bg-bg/40 px-3 py-2">
          <dt className="text-xs text-muted">{tr("تقویم کلان", "Macro calendar")}</dt>
          <dd className="mt-1 space-y-1">
            {events.map((event) => (
              <p key={event.ymd} className="text-sm text-fg">
                <span className="num text-subtle">{event.ymd.slice(5)}</span>
                {" · "}
                {tr(event.nameFa, event.nameEn)}
              </p>
            ))}
          </dd>
        </div>
        <div className="rounded-md bg-bg/40 px-3 py-2">
          <dt className="text-xs text-muted">{tr("جلسه‌ها", "Sessions")}</dt>
          <dd className="mt-1 text-sm text-fg">
            {tr("تهران", "Tehran")} <span className="num">{day.tehranYmd}</span>
          </dd>
          <p className="mt-1 text-sm text-fg">
            {tr("نیویورک", "New York")} <span className="num">{day.newYorkYmd}</span>
          </p>
          {day.earlyClose ? (
            <p className="mt-1 text-xs text-warn">{tr(day.earlyClose.nameFa, day.earlyClose.nameEn)}</p>
          ) : null}
        </div>
      </dl>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-xs text-subtle">{tr("اخبار فدرال رزرو و نرخ بهره", "Federal Reserve and rate news")}</p>
        {news == null ? <p className="mt-2 text-sm text-muted">{tr("در حال گرفتن فید…", "Fetching the feed…")}</p> : null}
        {news?.note ? <p className="mt-2 text-sm text-muted">{tr(news.note, "The Fed feed did not answer. The calendar still stands.")}</p> : null}
        <ul className="mt-2 flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.link}>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-fg hover:underline"
              >
                <span className="me-2 text-xs text-subtle">{tr(item.tagFa, item.tagEn)}</span>
                {item.title}
              </a>
              <p className="num text-xs text-subtle">{when(item.publishedAt, locale)}</p>
              {mode === "full" && item.summary ? (
                <p className="mt-1 text-xs leading-relaxed text-muted">{item.summary}</p>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
