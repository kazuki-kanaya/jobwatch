import { enMessages } from "@/i18n/messages.en";
import { jaMessages } from "@/i18n/messages.ja";

export const messages = {
  en: enMessages,
  ja: jaMessages,
} as const;

export type Locale = keyof typeof messages;
export type MessageKey = keyof typeof messages.en;
