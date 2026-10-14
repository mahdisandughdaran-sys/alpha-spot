import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n/locale";

const OWNER = "mahdisandughdaran-sys";
const REPO = "alpha-spot";
const PAGE = `https://github.com/${OWNER}/${REPO}`;
const API = `https://api.github.com/repos/${OWNER}/${REPO}`;
const STAR_KEY = "alpha-spot-starred";

type Phase = "idle" | "watching" | "landed" | "offline";

async function readStars(): Promise<number | null> {
  const res = await fetch(API, {
    headers: { Accept: "application/vnd.github+json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as { stargazers_count?: number };
  return typeof data.stargazers_count === "number" ? data.stargazers_count : null;
}

async function userHasStar(login: string): Promise<boolean | null> {
  const name = login.trim().replace(/^@/, "");
  if (!/^[A-Za-z0-9-]{1,39}$/.test(name)) return null;
  for (let page = 1; page <= 5; page += 1) {
    const res = await fetch(`${API}/stargazers?per_page=100&page=${page}`, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as { login?: string }[];
    if (!Array.isArray(rows) || rows.length === 0) return false;
    if (rows.some((row) => row.login?.toLowerCase() === name.toLowerCase())) return true;
    if (rows.length < 100) return false;
  }
  return false;
}

export function GithubStar() {
  const { tr } = useI18n();
  const [open, setOpen] = useState(false);
  const [count, setCount] = useState<number | null>(null);
  const [baseline, setBaseline] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [login, setLogin] = useState("");
  const [hint, setHint] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setSaved(localStorage.getItem(STAR_KEY) === "1");
    } catch {
      /* ignore */
    }
    void readStars()
      .then((n) => {
        if (n != null) setCount(n);
      })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (!open || phase === "landed") return;
    let stop = false;
    async function pull() {
      try {
        const n = await readStars();
        if (stop || n == null) {
          if (!stop && n == null) setPhase((prev) => (prev === "watching" ? "offline" : prev));
          return;
        }
        setCount(n);
        if (baseline != null && n > baseline) {
          setPhase("landed");
          setSaved(true);
          try {
            localStorage.setItem(STAR_KEY, "1");
          } catch {
            /* ignore */
          }
        }
      } catch {
        if (!stop) setPhase((prev) => (prev === "watching" ? "offline" : prev));
      }
    }
    void pull();
    const id = window.setInterval(() => void pull(), 5000);
    const onVis = () => {
      if (document.visibilityState === "visible") void pull();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop = true;
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [open, baseline, phase]);

  function markLanded() {
    setPhase("landed");
    setSaved(true);
    try {
      localStorage.setItem(STAR_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function openRepo() {
    const current = count ?? (await readStars().catch(() => null));
    if (current != null) {
      setCount(current);
      setBaseline(current);
    }
    setPhase("watching");
    setHint(null);
    window.open(PAGE, "_blank", "noopener,noreferrer");
  }

  async function checkLogin() {
    setHint(null);
    const found = await userHasStar(login).catch(() => null);
    if (found == null) {
      setHint(tr("گیت‌هاب الان جواب نداد. چند ثانیه بعد دوباره بزن.", "GitHub did not answer. Try again in a few seconds."));
      return;
    }
    if (found) {
      markLanded();
      setHint(null);
      return;
    }
    setHint(tr("این نام هنوز بین ستاره‌دهنده‌ها نیست.", "That login is not in the stargazer list yet."));
  }

  const landed = phase === "landed" || saved;
  const label = landed ? tr("ستاره ثبت شد", "Star counted") : tr("به من ستاره دهید", "Star me on GitHub");

  return (
    <>
      <Button
        type="button"
        variant="outline"
        className="h-11"
        onClick={() => setOpen(true)}
      >
        <Star className={landed ? "fill-warn text-warn" : ""} />
        {label}
        {count != null ? <span className="num text-xs opacity-80">{count}</span> : null}
      </Button>
      {open ? (
        <div
          className="fixed inset-0 z-50 grid place-items-end bg-bg/70 p-3 sm:place-items-center"
          onClick={() => setOpen(false)}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="star-title"
            className="rise-in w-full max-w-md rounded-xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-subtle">GitHub</p>
                <h2 id="star-title" className="mt-1 text-xl text-fg">
                  {tr("یک ستاره برای میز", "One star for the desk")}
                </h2>
              </div>
              <p className="num text-3xl text-fg">{count ?? "—"}</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              {tr(
                "گیت‌هاب فقط ستاره‌ای را می‌شمارد که روی دکمهٔ خودش زده شود. مخزن را باز می‌کنیم و شمارندهٔ عمومی را نگاه می‌داریم — همان لحظه که ستاره بنشیند، اینجا سبز می‌شود.",
                "GitHub only counts a star pressed on its own button. We open the repo and watch the public counter — the moment your star lands, this turns green.",
              )}
            </p>
            <ol className="mt-4 grid gap-2 text-sm">
              <li className="rounded-lg bg-elevated px-3 py-2 text-fg">
                <span className="num me-2 text-xs text-subtle">01</span>
                {tr("مخزن آلفا اسپات را باز کن", "Open the Alpha Spot repo")}
              </li>
              <li className="rounded-lg bg-elevated px-3 py-2 text-fg">
                <span className="num me-2 text-xs text-subtle">02</span>
                {tr("روی Star گیت‌هاب بزن", "Press GitHub’s Star")}
              </li>
              <li className="rounded-lg bg-elevated px-3 py-2 text-fg">
                <span className="num me-2 text-xs text-subtle">03</span>
                {phase === "landed"
                  ? tr("ستاره نشست. ممنون.", "The star landed. Thank you.")
                  : tr("برگرد؛ شمارنده را زنده چک می‌کنیم", "Come back — we check the counter live")}
              </li>
            </ol>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row">
              <Button type="button" className="h-12 flex-1" onClick={() => void openRepo()}>
                <Star className={phase === "landed" ? "fill-warn text-warn" : ""} />
                {tr("باز کردن گیت‌هاب", "Open GitHub")}
              </Button>
              <Button type="button" variant="outline" className="h-12" onClick={() => setOpen(false)}>
                {tr("بستن", "Close")}
              </Button>
            </div>
            <p className="mt-3 text-xs text-subtle" aria-live="polite">
              {phase === "landed"
                ? tr("شمارنده بالا رفت. ستاره ثبت شد.", "The counter moved. Your star is in.")
                : phase === "watching"
                  ? tr("در حال نگاه به شمارنده…", "Watching the counter…")
                  : phase === "offline"
                    ? tr("شمارنده الان از اینجا خوانده نشد. مخزن باز است؛ برگرد تا دوباره بشماریم.", "The counter could not be read from here. The repo is open; come back and we will count again.")
                    : tr("هنوز ستاره‌ای از این نشست ثبت نشده.", "No new star from this session yet.")}
            </p>
            <form
              className="mt-4 flex flex-col gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                void checkLogin();
              }}
            >
              <label className="text-xs text-subtle" htmlFor="gh-login">
                {tr("اگر قبلاً ستاره داده‌ای، نام کاربری گیت‌هاب", "If you already starred, your GitHub login")}
              </label>
              <div className="flex gap-2">
                <input
                  id="gh-login"
                  value={login}
                  onChange={(event) => setLogin(event.target.value)}
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="username"
                  className="num h-11 min-w-0 flex-1 rounded-md bg-elevated px-3 text-sm text-fg shadow-[var(--shadow-border)] outline-none"
                />
                <Button type="submit" variant="outline" className="h-11 shrink-0" disabled={!login.trim()}>
                  {tr("بررسی", "Check")}
                </Button>
              </div>
              {hint ? <p className="text-xs text-warn">{hint}</p> : null}
            </form>
            <p className="num mt-4 truncate text-xs text-subtle">{OWNER}/{REPO}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}
