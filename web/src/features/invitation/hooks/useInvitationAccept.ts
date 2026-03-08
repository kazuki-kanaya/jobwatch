import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { useInvitationAcceptMutation } from "@/features/invitation/api/useInvitationAcceptMutation";
import { useLocale } from "@/i18n/LocaleProvider";

type UseInvitationAcceptParams = {
  accessToken: string | undefined;
};

export const useInvitationAccept = ({ accessToken }: UseInvitationAcceptParams) => {
  const { t } = useLocale();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const invitationToken = searchParams.get("token")?.trim() ?? "";
  const isTokenMissing = invitationToken.length === 0;
  const invitationMutation = useInvitationAcceptMutation({ accessToken });

  const acceptInvitation = async () => {
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

  const goDashboard = () => navigate("/new/dashboard");

  return {
    isTokenMissing,
    isPending: invitationMutation.isPending,
    isSuccess,
    errorMessage,
    acceptInvitation,
    goDashboard,
  };
};
