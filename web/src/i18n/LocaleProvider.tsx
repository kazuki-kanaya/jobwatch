import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { messages } from "@/i18n/messages";
import type { Locale, MessagesKey } from "@/i18n/messages/types";

type LocaleContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessagesKey) => string;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const resolveLocale = (value: string): Locale => {
  const normalized = value.toLowerCase();
  if (normalized.startsWith("en")) return "en";
  if (normalized.startsWith("ja")) return "ja";
  return "en";
};

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return "en";
  return resolveLocale(window.navigator.language);
};

export default function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  const value = useMemo<LocaleContextType>(
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
