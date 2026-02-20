export type LandingOption = { id: string; name: string };

export type LandingTexts = Record<string, string>;

export type LandingPageViewProps = {
  texts: LandingTexts;
  localeOptions: LandingOption[];
  localeValue: string;
  onLocaleChange: (locale: string) => void;
};

export type InstallMethod = "brew" | "curl";
