import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { AlphaStackPanel } from "@/components/desk/alpha-stack-panel";
import { formatSpotUsd } from "@/lib/crypto/spot-plan";
import { loadAlphaTape, type AlphaTape } from "@/lib/crypto/alpha-tape";
import { useI18n } from "@/lib/i18n/locale";

const PAIRS: { pair: string; fa: string; en: string }[] = [
  { pair: "BTCUSDT", fa: "بیت‌کوین", en: "Bitcoin" },
  { pair: "ETHUSDT", fa: "اتریوم", en: "Ethereum" },
  { pair: "SOLUSDT", fa: "سولانا", en: "Solana" },
  { pair: "BNBUSDT", fa: "BNB", en: "BNB" },
  { pair: "XRPUSDT", fa: "ریپل", en: "XRP" },
  { pair: "LINKUSDT", fa: "چین‌لینک", en: "Chainlink" },
];

export function AlphaTape() {
  const { tr } = useI18n();
  const load = useServerFn(loadAlphaTape);
  const [pair, setPair] = useState("BTCUSDT");
  const [tape, setTape] = useState<AlphaTape | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let stop = false;
    setLoading(true);
    setError(null);
    void load({ data: { pair } })
      .then((next) => {
        if (stop) return;
        setTape(next);
      })
      .catch((err: unknown) => {
        if (stop) return;
        setTape(null);
        setError(err instanceof Error ? err.message : "پشته اندیکاتور نرسید.");
      })
      .finally(() => {
        if (!stop) setLoading(false);
      });
    return () => {
      stop = true;
    };
    // Server function identity is stable for this desk.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pair]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {PAIRS.map((item) => {
          const on = item.pair === pair;
          return (
            <button
              key={item.pair}
              type="button"
              onClick={() => setPair(item.pair)}
              className={`h-11 rounded-md px-3 text-sm ${on ? "bg-accent text-accent-fg" : "bg-surface text-muted shadow-[var(--shadow-border)]"}`}
            >
              {tr(item.fa, item.en)}
            </button>
          );
        })}
      </div>
      {loading && !tape ? (
        <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="text-sm text-fg">{tr("پشته اندیکاتور از کندل روزانه بایننس خوانده می‌شود.", "Reading the indicator stack from Binance daily candles.")}</p>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-elevated">
            <div className="shimmer h-full w-1/2 rounded-full bg-accent/40" />
          </div>
        </section>
      ) : null}
      {error ? (
        <section className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
          <p className="text-sm text-down">{tr("پشته اندیکاتور کامل نشد", "The indicator stack did not finish")}</p>
          <p className="mt-2 text-sm text-muted">{tr(error)}</p>
        </section>
      ) : null}
      {tape ? (
        <AlphaStackPanel stack={tape.stack} symbol={tape.symbol} price={formatSpotUsd(tape.price)} />
      ) : null}
    </div>
  );
}
