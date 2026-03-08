import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { HeaderBrand } from "@/features/header/components/HeaderBrand/HeaderBrand";
import { HeaderControls } from "@/features/header/components/HeaderControls/HeaderControls";
import { HeaderProfileEditDialog } from "@/features/header/components/HeaderProfileEditDialog/HeaderProfileEditDialog";
import { HeaderSection } from "@/features/header/components/HeaderSection/HeaderSection";
import { HeaderUserCard } from "@/features/header/components/HeaderUserCard/HeaderUserCard";
import { hostQueryKeys } from "@/features/host/api/hostQueryKeys";
import { snapshotQueryKeys } from "@/features/snapshot/api/snapshotQueryKeys";
import type { CurrentUser } from "@/features/user";
import { useUserMutations } from "@/features/user";
import { workspaceQueryKeys } from "@/features/workspace/api/workspaceQueryKeys";
import { useLocale } from "@/i18n/LocaleProvider";
import { env } from "@/lib/env";
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
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [profileDraftName, setProfileDraftName] = useState("");

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: hostQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: snapshotQueryKeys.root }),
      ]);
      setLastUpdatedAt(new Date());
      toast.success(t("dashboard_refresh_success"));
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard_refresh_error"));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      const redirectUri = `${window.location.origin}/`;
      const isKeycloak = env.oidcIssuer.includes("/realms/");
      const logoutUrl = isKeycloak
        ? new URL(`${env.oidcIssuer.replace(/\/$/, "")}/protocol/openid-connect/logout`)
        : new URL(`${env.oidcAuthDomain.replace(/\/$/, "")}/logout`);
      logoutUrl.searchParams.set("client_id", env.oidcClientId);
      logoutUrl.searchParams.set(isKeycloak ? "post_logout_redirect_uri" : "logout_uri", redirectUri);
      if (user?.id_token) logoutUrl.searchParams.set("id_token_hint", user.id_token);
      await removeUser();
      window.location.assign(logoutUrl.toString());
    } finally {
      setIsSigningOut(false);
    }
  };

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
      await userMutations.updateCurrentUserName(normalizedName);
      toast.success(t("dashboard_profile_updated"));
      setIsProfileDialogOpen(false);
    } catch (error) {
      console.error(error);
      toast.error(t("dashboard_profile_update_error"));
    }
  };

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
