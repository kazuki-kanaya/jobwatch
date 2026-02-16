import { useState } from "react";
import { toast } from "sonner";
import { useDashboardUserMutations } from "@/features/dashboard/api/dashboardUserMutations";
import type { DashboardCurrentUser, DashboardViewModel } from "@/features/dashboard/types";

type UseDashboardUserProfileParams = {
  accessToken: string | undefined;
  currentUser: DashboardCurrentUser | null;
  texts: Pick<DashboardViewModel["texts"], "profileUpdated" | "profileUpdateError">;
};

type UseDashboardUserProfileResult = {
  isProfileDialogOpen: boolean;
  draftName: string;
  isSubmitting: boolean;
  openProfileDialog: () => void;
  closeProfileDialog: () => void;
  setDraftName: (value: string) => void;
  submitProfile: () => Promise<void>;
};

export const useDashboardUserProfile = ({
  accessToken,
  currentUser,
  texts,
}: UseDashboardUserProfileParams): UseDashboardUserProfileResult => {
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [draftName, setDraftName] = useState("");
  const userMutations = useDashboardUserMutations({ accessToken });

  return {
    isProfileDialogOpen,
    draftName,
    isSubmitting: userMutations.isUpdating,
    openProfileDialog: () => {
      setDraftName(currentUser?.name ?? "");
      setIsProfileDialogOpen(true);
    },
    closeProfileDialog: () => setIsProfileDialogOpen(false),
    setDraftName,
    submitProfile: async () => {
      const normalizedName = draftName.trim();
      if (!normalizedName) return;

      try {
        await userMutations.updateCurrentUserName(normalizedName);
        toast.success(texts.profileUpdated);
        setIsProfileDialogOpen(false);
      } catch (error) {
        console.error(error);
        toast.error(texts.profileUpdateError);
      }
    },
  };
};
