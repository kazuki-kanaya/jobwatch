// Responsibility: Provide current locale and translator function to the React tree.
import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { type Locale, type MessageKey, messages } from "@/i18n/messages";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export default function LocaleProvider({ children }: PropsWithChildren) {
  const [locale, setLocale] = useState<Locale>("en");

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
