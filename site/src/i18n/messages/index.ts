import { enMessages } from "./en";
import { jaMessages } from "./ja";
import type { LandingLocale, LandingMessages } from "./types";

export type { LandingLocale, LandingMessages } from "./types";

const messagesByLocale: Record<LandingLocale, LandingMessages> = {
  ja: jaMessages,
  en: enMessages,
};

export function getLandingMessages(locale: LandingLocale): LandingMessages {
  return messagesByLocale[locale] ?? messagesByLocale.ja;
}
