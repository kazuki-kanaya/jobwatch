// Responsibility: Provide current locale and translator function to the React tree.
import { createContext, type PropsWithChildren, useContext, useEffect, useMemo, useState } from "react";
import { type Locale, type MessageKey, messages } from "@/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);
const LOCALE_STORAGE_KEY = "jobwatch_locale";
const isLocale = (value: string): value is Locale => value === "en" || value === "ja";
const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "en";

  const storedLocale = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  if (storedLocale && isLocale(storedLocale)) return storedLocale;

  return "en";
};

export default function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => messages[locale][key],
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used within LocaleProvider");

  return context;
};
