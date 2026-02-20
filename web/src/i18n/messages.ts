import { enMessages } from "@/i18n/messages.en";
import { jaMessages } from "@/i18n/messages.ja";

export type { MessageKey } from "@/i18n/messageSchema";

export const messages = {
  en: enMessages,
  ja: jaMessages,
} as const;

export type Locale = keyof typeof messages;
