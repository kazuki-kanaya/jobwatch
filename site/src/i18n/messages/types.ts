export type LandingLocale = "ja" | "en";

export type LandingMessages = {
  languageLabel: string;
  languageSwitchLabel: string;
  nav: {
    features: string;
    howItWorks: string;
    comparison: string;
    docs: string;
    getStarted: string;
  };
  hero: {
    releaseBadge: string;
    titleLead: string;
    titleAccent: string;
    titleTail: string;
    subtitle: string;
    installHeading: string;
    copyLabel: string;
    copiedLabel: string;
    quickStartLines: string[];
  };
  pain: {
    eyebrow: string;
    title: string;
    subtitle: string;
    cards: Array<{
      title: string;
      body: string;
    }>;
  };
  features: {
    title: string;
    tabs: {
      dashboard: string;
      slackAlerts: string;
    };
    cards: Array<{
      title: string;
      body: string;
    }>;
  };
  comparison: {
    title: string;
    subtitle: string;
    featureColumn: string;
    rows: Array<{
      label: string;
      obsern: string;
      mlflow: string;
      tensorboard: string;
    }>;
  };
  cta: {
    title: string;
    subtitle: string;
    primary: string;
    secondary: string;
  };
  footer: {
    title: string;
    subtitle: string;
    button: string;
  };
};
