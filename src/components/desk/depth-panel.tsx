import type { BookCheck, BookGate } from "@/lib/crypto/types";
import { formatPct, formatUsd } from "./format";

const GATE: Record<BookGate, string> = {
  pass: "عبور",
  thin: "نازک",
  crowded: "شلوغ",
  levered: "اهرم",
  unknown: "نامشخص",
};

function gateClass(gate: BookGate): string {
  if (gate === "pass") return "text-up";
  if (gate === "thin") return "text-down";
  if (gate === "unknown") return "text-subtle";
  return "text-warn";
}

export function DepthPanel({ books }: { books: BookCheck[] }) {
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">عمق دفتر و مشتقات</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          خرید ۱۰هزار دلاری روی دفتر اسپات بایننس سنجیده می‌شود. سود باز، تغییر ۲۴ساعته و نسبت
          لانگ به شورت از قرارداد دائمی OKX می‌آید و اگر آنجا جواب ندهد از بایننس فیوچرز. آلت خرد
          با سود باز داغ، حجم اسپات را نصف می‌کند؛ دفتر نازک خرید را معلق می‌کند.
        </p>
      </div>
      {books.length === 0 ? (
        <p className="rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]">
          هنوز دفتر سفارشی برای این اجرا خوانده نشده.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[720px] text-right text-sm">
            <thead className="text-xs text-subtle">
              <tr>
                <th className="px-3 py-3 font-medium">نماد</th>
                <th className="px-3 py-3 font-medium">وضعیت</th>
                <th className="px-3 py-3 font-medium">اسلیپیج</th>
                <th className="px-3 py-3 font-medium">عمق ۱۰bps</th>
                <th className="px-3 py-3 font-medium">فاندینگ سال</th>
                <th className="px-3 py-3 font-medium">سود باز</th>
                <th className="px-3 py-3 font-medium">۲۴س</th>
                <th className="px-3 py-3 font-medium">لانگ/شورت</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.symbol} className="border-t border-border">
                  <td className="px-3 py-3">
                    <span className="text-fg">{book.symbol}</span>
                    {book.smallCap ? (
                      <span className="mr-2 text-xs text-subtle">خرد</span>
                    ) : null}
                  </td>
                  <td className={`px-3 py-3 ${gateClass(book.gate)}`}>{GATE[book.gate]}</td>
                  <td className="num px-3 py-3 text-fg">
                    {book.slippageBps == null ? "—" : book.slippageBps.toFixed(1)}
                  </td>
                  <td className="num px-3 py-3 text-fg">
                    {book.depthUsd == null ? "—" : formatUsd(book.depthUsd)}
                  </td>
                  <td className="num px-3 py-3 text-fg">
                    {book.fundingAnnual == null ? "—" : formatPct(book.fundingAnnual, 1)}
                  </td>
                  <td className="num px-3 py-3 text-fg">
                    {book.openInterestUsd == null ? "—" : formatUsd(book.openInterestUsd)}
                  </td>
                  <td className="num px-3 py-3 text-fg">
                    {book.oiChange24h == null ? "—" : formatPct(book.oiChange24h, 1)}
                  </td>
                  <td className="num px-3 py-3 text-fg">
                    {book.longShortRatio == null ? "—" : book.longShortRatio.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {books
        .filter((book) => book.gate === "thin" || book.gate === "levered" || book.gate === "crowded")
        .map((book) => (
          <p key={`${book.symbol}-note`} className="text-xs leading-relaxed text-subtle">
            {book.symbol}: {book.note}
          </p>
        ))}
    </section>
  );
}
