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
  missionControlLabel: string;
  title: string;
  updatedAtLabel: string;
  updatedAtValue: string;
  currentUserLabel: string;
  currentUserName: string;
  currentUserId: string;
  editProfileLabel: string;
  languageLabel: string;
  refreshLabel: string;
  signOutLabel: string;
  timeZoneLabel: string;
  localeValue: string;
  localeOptions: HeaderLocaleOption[];
  timeZoneValue: HeaderTimeZone;
  timeZoneOptions: HeaderTimeZoneOption[];
  isRefreshing: boolean;
  isSigningOut: boolean;
  onEditProfile: () => void;
  onLocaleChange: (locale: string) => void;
  onTimeZoneChange: (timeZone: HeaderTimeZone) => void;
  onRefresh: () => Promise<void> | void;
  onSignOut: () => Promise<void> | void;
};

export type HeaderFeatureProps = HeaderSectionProps;
