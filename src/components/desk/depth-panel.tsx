import { useI18n } from "@/lib/i18n/locale";
import type { BookCheck, BookGate } from "@/lib/crypto/types";
import { formatPct, formatUsd } from "./format";

const GATE: Record<BookGate, string> = {
  pass: "عبور",
  thin: "نازک",
  crowded: "شلوغ",
  levered: "اهرم",
  unknown: "نامشخص",
};

const GATE_EN: Record<BookGate, string> = {
  pass: "Pass",
  thin: "Thin",
  crowded: "Crowded",
  levered: "Levered",
  unknown: "Unknown",
};

function gateClass(gate: BookGate): string {
  if (gate === "pass") return "text-up";
  if (gate === "thin") return "text-down";
  if (gate === "unknown") return "text-subtle";
  return "text-warn";
}

export function DepthPanel({ books }: { books: BookCheck[] }) {
  const { tr } = useI18n();
  return (
    <section className="flex flex-col gap-4">
      <div>
        <h3 className="text-base font-medium text-fg">{tr("عمق دفتر و مشتقات", "Book depth and derivatives")}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
          {tr(
            "خرید ۱۰هزار دلاری روی دفتر اسپات بایننس سنجیده می‌شود. سود باز، تغییر ۲۴ساعته و نسبت لانگ به شورت از قرارداد دائمی OKX می‌آید و اگر آنجا جواب ندهد از بایننس فیوچرز. آلت خرد با سود باز داغ، حجم اسپات را نصف می‌کند؛ دفتر نازک خرید را معلق می‌کند.",
            "A $10,000 buy is measured on the Binance spot book. Open interest, the 24-hour change, and the long/short ratio come from the OKX perpetual, and from Binance futures if OKX does not answer. A small-cap alt with hot open interest halves the spot size; a thin book suspends the buy.",
          )}
        </p>
      </div>
      {books.length === 0 ? (
        <p className="rounded-xl bg-surface p-5 text-sm text-muted shadow-[var(--shadow-border)]">
          {tr("هنوز دفتر سفارشی برای این اجرا خوانده نشده.", "No order book has been read for this run yet.")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl bg-surface shadow-[var(--shadow-border)]">
          <table className="w-full min-w-[720px] text-start text-sm">
            <thead className="text-xs text-subtle">
              <tr>
                <th className="px-3 py-3 font-medium">{tr("نماد", "Symbol")}</th>
                <th className="px-3 py-3 font-medium">{tr("وضعیت", "Status")}</th>
                <th className="px-3 py-3 font-medium">{tr("اسلیپیج", "Slippage")}</th>
                <th className="px-3 py-3 font-medium">{tr("عمق ۱۰bps", "Depth 10bps")}</th>
                <th className="px-3 py-3 font-medium">{tr("فاندینگ سال", "Funding / year")}</th>
                <th className="px-3 py-3 font-medium">{tr("سود باز", "Open interest")}</th>
                <th className="px-3 py-3 font-medium">{tr("۲۴س", "24h")}</th>
                <th className="px-3 py-3 font-medium">{tr("لانگ/شورت", "Long/short")}</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.symbol} className="border-t border-border">
                  <td className="px-3 py-3">
                    <span className="text-fg">{book.symbol}</span>
                    {book.smallCap ? (
                      <span className="ms-2 text-xs text-subtle">{tr("خرد", "Small")}</span>
                    ) : null}
                  </td>
                  <td className={`px-3 py-3 ${gateClass(book.gate)}`}>{tr(GATE[book.gate], GATE_EN[book.gate])}</td>
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
            {book.symbol}: {tr(book.note)}
          </p>
        ))}
    </section>
  );
}
