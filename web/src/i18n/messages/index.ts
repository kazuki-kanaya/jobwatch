import { enMessages } from "@/i18n/messages/en";
import { jaMessages } from "@/i18n/messages/ja";
import type { Locale, Messages } from "@/i18n/messages/types";

export type { Locale, Messages, MessagesKey } from "@/i18n/messages/types";

export const messages: Record<Locale, Messages> = {
  en: enMessages,
  ja: jaMessages,
} as const satisfies Record<Locale, Messages>;
