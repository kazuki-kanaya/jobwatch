import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";
import { HeaderBrand } from "@/features/header/components/HeaderBrand/HeaderBrand";
import { HeaderControls } from "@/features/header/components/HeaderControls/HeaderControls";
import { HeaderProfileEditDialog } from "@/features/header/components/HeaderProfileEditDialog/HeaderProfileEditDialog";
import { HeaderSection } from "@/features/header/components/HeaderSection/HeaderSection";
import { HeaderUserCard } from "@/features/header/components/HeaderUserCard/HeaderUserCard";
import { useHeaderProfileEditor } from "@/features/header/hooks/useHeaderProfileEditor";
import { useHeaderSessionActions } from "@/features/header/hooks/useHeaderSessionActions";
import type { CurrentUser } from "@/features/user";
import { useUserMutations } from "@/features/user";
import { useLocale } from "@/i18n/LocaleProvider";
import { useDisplaySettings } from "@/providers/DisplaySettingsProvider";

const isLocale = (value: string): value is "en" | "ja" => value === "en" || value === "ja";

type HeaderFeatureProps = {
  currentUser: CurrentUser | null;
};

export function HeaderFeature({ currentUser }: HeaderFeatureProps) {
  const { user, removeUser } = useAuth();
  const queryClient = useQueryClient();
  const { locale, setLocale, t } = useLocale();
  const { timeZone, setTimeZone, formatDateTime } = useDisplaySettings();
  const accessToken = user?.access_token;
  const userMutations = useUserMutations({ accessToken });
  const { lastUpdatedAt, isRefreshing, isSigningOut, handleRefresh, handleSignOut } = useHeaderSessionActions({
    queryClient,
    removeUser,
    idToken: user?.id_token,
    t,
  });
  const {
    isProfileDialogOpen,
    profileDraftName,
    setProfileDraftName,
    handleEditProfile,
    handleCloseProfileDialog,
    handleSubmitProfile,
  } = useHeaderProfileEditor({
    currentUser,
    updateCurrentUserName: userMutations.updateCurrentUserName,
    t,
  });

  return (
    <HeaderSection
      brand={
        <HeaderBrand
          missionControlLabel={t("dashboard_mission_control")}
          title={t("dashboard_title")}
          updatedAtLabel={t("dashboard_updated_at_label")}
          updatedAtValue={formatDateTime(lastUpdatedAt)}
        />
      }
      userCard={
        <HeaderUserCard
          currentUserLabel={t("dashboard_current_user")}
          currentUserName={currentUser?.name ?? "no name"}
          currentUserId={currentUser?.id ?? "-"}
          editProfileLabel={t("dashboard_profile_edit")}
          onEditProfile={handleEditProfile}
        />
      }
      controls={
        <HeaderControls
          languageLabel={t("dashboard_language")}
          refreshLabel={t("dashboard_refresh")}
          signOutLabel={t("dashboard_sign_out")}
          timeZoneLabel={t("dashboard_time_zone")}
          localeValue={locale}
          localeOptions={[
            { id: "ja", name: t("locale_ja") },
            { id: "en", name: t("locale_en") },
          ]}
          timeZoneValue={timeZone}
          timeZoneOptions={[
            { id: "Asia/Tokyo", name: "JST" },
            { id: "UTC", name: "UTC" },
          ]}
          isRefreshing={isRefreshing}
          isSigningOut={isSigningOut}
          onLocaleChange={(nextLocale: string) => {
            if (isLocale(nextLocale)) setLocale(nextLocale);
          }}
          onTimeZoneChange={setTimeZone}
          onRefresh={handleRefresh}
          onSignOut={handleSignOut}
        />
      }
      profileDialog={
        <HeaderProfileEditDialog
          title={t("dashboard_profile_edit")}
          nameLabel={t("dashboard_profile_name")}
          updateLabel={t("dashboard_update")}
          cancelLabel={t("dashboard_cancel")}
          isOpen={isProfileDialogOpen}
          draftName={profileDraftName}
          isSubmitting={userMutations.isUpdatingCurrentUser}
          onClose={handleCloseProfileDialog}
          onDraftNameChange={setProfileDraftName}
          onSubmit={handleSubmitProfile}
        />
      }
    />
  );
}
