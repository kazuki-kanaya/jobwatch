export const compareRows = [
  {
    key: "setup",
    jobwatch: "landing_compare_setup_jobwatch",
    mlflow: "landing_compare_setup_mlflow",
    tensor: "landing_compare_setup_tensorboard",
  },
  {
    key: "status",
    jobwatch: "landing_compare_status_jobwatch",
    mlflow: "landing_compare_status_mlflow",
    tensor: "landing_compare_status_tensorboard",
  },
  {
    key: "alerts",
    jobwatch: "landing_compare_alerts_jobwatch",
    mlflow: "landing_compare_alerts_mlflow",
    tensor: "landing_compare_alerts_tensorboard",
  },
  {
    key: "infra",
    jobwatch: "landing_compare_infra_jobwatch",
    mlflow: "landing_compare_infra_mlflow",
    tensor: "landing_compare_infra_tensorboard",
  },
] as const;

export const painCards = [
  {
    titleKey: "landing_pain_card_1_title",
    bodyKey: "landing_pain_card_1_body",
    tone: "bg-cyan-400/15 text-cyan-300",
    icon: "unplug",
  },
  {
    titleKey: "landing_pain_card_2_title",
    bodyKey: "landing_pain_card_2_body",
    tone: "bg-rose-400/15 text-rose-300",
    icon: "waves",
  },
  {
    titleKey: "landing_pain_card_3_title",
    bodyKey: "landing_pain_card_3_body",
    tone: "bg-slate-300/15 text-slate-200",
    icon: "grid",
  },
] as const;

export const featureCards = [
  {
    titleKey: "landing_feature_1_title",
    bodyKey: "landing_feature_1_body",
    icon: "code2",
  },
  {
    titleKey: "landing_feature_2_title",
    bodyKey: "landing_feature_2_body",
    icon: "bell",
  },
  {
    titleKey: "landing_feature_3_title",
    bodyKey: "landing_feature_3_body",
    icon: "grid",
  },
] as const;
