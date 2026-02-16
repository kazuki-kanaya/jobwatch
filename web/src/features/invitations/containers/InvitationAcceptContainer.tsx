import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useSearchParams } from "react-router";
import { useInvitationAcceptMutation } from "@/features/invitations/api/invitationMutations";
import InvitationAcceptView from "@/features/invitations/views/InvitationAcceptView";
import { useLocale } from "@/i18n/LocaleProvider";

export default function InvitationAcceptContainer() {
  const { t } = useLocale();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const invitationToken = searchParams.get("token")?.trim() ?? "";
  const isTokenMissing = invitationToken.length === 0;
  const invitationMutation = useInvitationAcceptMutation({ accessToken: user?.access_token });

  const handleAcceptInvitation = async () => {
    if (isTokenMissing || invitationMutation.isPending || isSuccess) return;

    setErrorMessage(null);
    try {
      await invitationMutation.acceptInvitation(invitationToken);
      setIsSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(t("invite_error_message"));
    }
  };

  return (
    <InvitationAcceptView
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
      isTokenMissing={isTokenMissing}
      isPending={invitationMutation.isPending}
      isSuccess={isSuccess}
      errorMessage={errorMessage}
      onAccept={handleAcceptInvitation}
      onGoDashboard={() => navigate("/")}
    />
  );
}
