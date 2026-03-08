import { useAuth } from "react-oidc-context";
import { InvitationAccept } from "@/features/invitation/components/InvitationAccept/InvitationAccept";
import { useInvitationAccept } from "@/features/invitation/hooks/useInvitationAccept";
import { useLocale } from "@/i18n/LocaleProvider";

export function InvitationAcceptFeature() {
  const { t } = useLocale();
  const { user } = useAuth();
  const invitationAccept = useInvitationAccept({ accessToken: user?.access_token });

  return (
    <InvitationAccept
      title={t("invite_title")}
      subtitle={t("invite_subtitle")}
      tokenMissingLabel={t("invite_token_missing")}
      tokenMissingHelp={t("invite_token_missing_help")}
      acceptLabel={t("invite_accept")}
      acceptingLabel={t("invite_accepting")}
      successLabel={t("invite_success")}
      successHelp={t("invite_success_help")}
      errorLabel={t("invite_error")}
      retryLabel={t("invite_retry")}
      backToDashboardLabel={t("invite_back_dashboard")}
      isTokenMissing={invitationAccept.isTokenMissing}
      isPending={invitationAccept.isPending}
      isSuccess={invitationAccept.isSuccess}
      errorMessage={invitationAccept.errorMessage}
      onAccept={invitationAccept.acceptInvitation}
      onGoDashboard={invitationAccept.goDashboard}
    />
  );
}
