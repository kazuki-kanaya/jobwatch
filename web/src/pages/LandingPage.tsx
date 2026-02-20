import LandingPageView from "@/features/landing/views/LandingPageView";
import { useLocale } from "@/i18n/LocaleProvider";

export default function LandingPage() {
  const { t, locale, setLocale } = useLocale();

  return (
    <LandingPageView
      localeValue={locale}
      localeOptions={[
        { id: "en", name: t("locale_en") },
        { id: "ja", name: t("locale_ja") },
      ]}
      onLocaleChange={(next) => {
        if (next === "en" || next === "ja") setLocale(next);
      }}
      texts={{
        landing_nav_features: t("landing_nav_features"),
        landing_nav_how_it_works: t("landing_nav_how_it_works"),
        landing_nav_comparison: t("landing_nav_comparison"),
        landing_nav_docs: t("landing_nav_docs"),
        landing_release_badge: t("landing_release_badge"),
        landing_hero_title_a: t("landing_hero_title_a"),
        landing_hero_title_ssh: t("landing_hero_title_ssh"),
        landing_hero_title_b: t("landing_hero_title_b"),
        landing_hero_subtitle: t("landing_hero_subtitle"),
        landing_get_started: t("landing_get_started"),
        landing_pain_eyebrow: t("landing_pain_eyebrow"),
        landing_pain_title: t("landing_pain_title"),
        landing_pain_subtitle: t("landing_pain_subtitle"),
        landing_pain_card_1_title: t("landing_pain_card_1_title"),
        landing_pain_card_1_body: t("landing_pain_card_1_body"),
        landing_pain_card_2_title: t("landing_pain_card_2_title"),
        landing_pain_card_2_body: t("landing_pain_card_2_body"),
        landing_pain_card_3_title: t("landing_pain_card_3_title"),
        landing_pain_card_3_body: t("landing_pain_card_3_body"),
        landing_features_title: t("landing_features_title"),
        landing_feature_1_title: t("landing_feature_1_title"),
        landing_feature_1_body: t("landing_feature_1_body"),
        landing_feature_2_title: t("landing_feature_2_title"),
        landing_feature_2_body: t("landing_feature_2_body"),
        landing_feature_3_title: t("landing_feature_3_title"),
        landing_feature_3_body: t("landing_feature_3_body"),
        landing_compare_title: t("landing_compare_title"),
        landing_compare_subtitle: t("landing_compare_subtitle"),
        landing_compare_col_feature: t("landing_compare_col_feature"),
        landing_compare_purpose_label: t("landing_compare_purpose_label"),
        landing_compare_purpose_jobwatch: t("landing_compare_purpose_jobwatch"),
        landing_compare_purpose_mlflow: t("landing_compare_purpose_mlflow"),
        landing_compare_purpose_tensorboard: t("landing_compare_purpose_tensorboard"),
        landing_compare_setup_label: t("landing_compare_setup_label"),
        landing_compare_setup_jobwatch: t("landing_compare_setup_jobwatch"),
        landing_compare_setup_mlflow: t("landing_compare_setup_mlflow"),
        landing_compare_setup_tensorboard: t("landing_compare_setup_tensorboard"),
        landing_compare_target_label: t("landing_compare_target_label"),
        landing_compare_target_jobwatch: t("landing_compare_target_jobwatch"),
        landing_compare_target_mlflow: t("landing_compare_target_mlflow"),
        landing_compare_target_tensorboard: t("landing_compare_target_tensorboard"),
        landing_compare_alerts_label: t("landing_compare_alerts_label"),
        landing_compare_alerts_jobwatch: t("landing_compare_alerts_jobwatch"),
        landing_compare_alerts_mlflow: t("landing_compare_alerts_mlflow"),
        landing_compare_alerts_tensorboard: t("landing_compare_alerts_tensorboard"),
        landing_compare_scope_label: t("landing_compare_scope_label"),
        landing_compare_scope_jobwatch: t("landing_compare_scope_jobwatch"),
        landing_compare_scope_mlflow: t("landing_compare_scope_mlflow"),
        landing_compare_scope_tensorboard: t("landing_compare_scope_tensorboard"),
        landing_cta_title: t("landing_cta_title"),
        landing_cta_subtitle: t("landing_cta_subtitle"),
        landing_cta_primary: t("landing_cta_primary"),
        landing_cta_secondary: t("landing_cta_secondary"),
        landing_footer_star_title: t("landing_footer_star_title"),
        landing_footer_star_subtitle: t("landing_footer_star_subtitle"),
        landing_footer_star_cta: t("landing_footer_star_cta"),
      }}
    />
  );
}
