import type { enMessages } from "@/i18n/messages.en";

export type MessageKey = keyof typeof enMessages;
export type MessageSchema = Record<MessageKey, string>;
