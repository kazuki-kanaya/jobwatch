import type { ReactNode } from "react";
import type { DisplayTimeZone } from "@/providers/DisplaySettingsProvider";

export type HeaderLocaleOption = {
  id: string;
  name: string;
};

export type HeaderTimeZone = DisplayTimeZone;

export type HeaderTimeZoneOption = {
  id: HeaderTimeZone;
  name: string;
};

export type HeaderSectionProps = {
  brand: ReactNode;
  userCard: ReactNode;
  controls: ReactNode;
  profileDialog: ReactNode;
};
