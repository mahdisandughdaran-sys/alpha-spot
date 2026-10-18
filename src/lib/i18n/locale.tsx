import { createContext, useContext, useEffect, useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { mountEnglishShield } from "@/lib/i18n/english-shield";
import { getLocale, setLocaleStore, tr as translate, type Locale } from "@/lib/i18n/lex";

const KEY = "alpha-spot-locale";

type I18n = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  tr: (fa: string, en?: string) => string;
};

const Ctx = createContext<I18n | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("fa");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "en" || saved === "fa") setLocaleState(saved);
    } catch {
      /* private mode */
    }
  }, []);

  if (getLocale() !== locale) setLocaleStore(locale);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "fa";
    document.documentElement.dir = locale === "en" ? "ltr" : "rtl";
    document.title = locale === "en" ? "Alpha Spot" : "آلفا اسپات";
  }, [locale]);

  useLayoutEffect(() => mountEnglishShield(() => getLocale() === "en"), [locale]);

  const value = useMemo<I18n>(
    () => ({
      locale,
      setLocale: (next) => {
        setLocaleStore(next);
        setLocaleState(next);
        try {
          localStorage.setItem(KEY, next);
        } catch {
          /* ignore */
        }
      },
      tr: (fa, en) => translate(fa, en),
    }),
    [locale],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useI18n(): I18n {
  const ctx = useContext(Ctx);
  if (ctx) return ctx;
  return {
    locale: getLocale(),
    setLocale: () => {},
    tr: (fa, en) => translate(fa, en),
  };
}
