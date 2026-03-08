import { useState } from "react";
import { toast } from "sonner";
import type { CurrentUser } from "@/features/user";
import type { MessagesKey } from "@/i18n/messages/types";

type UseHeaderProfileEditorParams = {
  currentUser: CurrentUser | null;
  updateCurrentUserName: (name: string) => Promise<unknown>;
  t: (key: MessagesKey) => string;
};

export const useHeaderProfileEditor = ({ currentUser, updateCurrentUserName, t }: UseHeaderProfileEditorParams) => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState("");

  const handleEditProfile = () => {
    setProfileDraftName(currentUser?.name ?? "");
    setIsProfileDialogOpen(true);
  };

  const handleCloseProfileDialog = () => {
    setIsProfileDialogOpen(false);
  };

  const handleSubmitProfile = async () => {
    const normalizedName = profileDraftName.trim();
    if (!normalizedName) return;

    try {
      await updateCurrentUserName(normalizedName);
      toast.success(t("dashboard_profile_updated"));
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard_profile_update_error"));
    }
  };

  return {
    isProfileDialogOpen,
    profileDraftName,
    setProfileDraftName,
    handleEditProfile,
    handleCloseProfileDialog,
    handleSubmitProfile,
  };
};
