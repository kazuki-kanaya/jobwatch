import { createContext, type PropsWithChildren, useContext, useMemo, useState } from "react";
import { useLocale } from "@/i18n/LocaleProvider";

export type DisplayTimeZone = "Asia/Tokyo" | "UTC";

type DisplaySettingsContextType = {
  timeZone: DisplayTimeZone;
  setTimeZone: (timeZone: DisplayTimeZone) => void;
  formatDateTime: (date: Date) => string;
};

const localeTagMap = {
  en: "en-US",
  ja: "ja-JP",
} as const;

const DisplaySettingsContext = createContext<DisplaySettingsContextType | undefined>(undefined);

export default function DisplaySettingsProvider({ children }: PropsWithChildren) {
  const { locale } = useLocale();
  const [timeZone, setTimeZone] = useState<DisplayTimeZone>("UTC");

  const value = useMemo<DisplaySettingsContextType>(
    () => ({
      timeZone,
      setTimeZone,
      formatDateTime: (date) =>
        new Intl.DateTimeFormat(localeTagMap[locale], {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          timeZone,
          timeZoneName: "short",
        }).format(date),
    }),
    [locale, timeZone],
  );

  return <DisplaySettingsContext.Provider value={value}>{children}</DisplaySettingsContext.Provider>;
}

export const useDisplaySettings = () => {
  const context = useContext(DisplaySettingsContext);
  if (!context) throw new Error("useDisplaySettings must be used within DisplaySettingsProvider");

  return context;
};
