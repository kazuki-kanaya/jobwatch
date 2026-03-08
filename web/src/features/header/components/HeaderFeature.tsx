import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { HeaderSection } from "@/features/header/components/HeaderSection/HeaderSection";
import { hostQueryKeys } from "@/features/host/api/hostQueryKeys";
import { workspaceQueryKeys } from "@/features/workspace/api/workspaceQueryKeys";
import { useLocale } from "@/i18n/LocaleProvider";
import { env } from "@/lib/env";
import { useDisplaySettings } from "@/providers/DisplaySettingsProvider";

const isLocale = (value: string): value is "en" | "ja" => value === "en" || value === "ja";

export function HeaderFeature() {
  const { user, removeUser } = useAuth();
  const queryClient = useQueryClient();
  const { locale, setLocale, t } = useLocale();
  const { timeZone, setTimeZone, formatDateTime } = useDisplaySettings();
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: hostQueryKeys.root }),
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
    toast.message(
      locale === "ja" ? "この画面の名前変更は未実装です。" : "Edit name is not implemented in this page yet.",
    );
  };

  return (
    <HeaderSection
      missionControlLabel={t("dashboard_mission_control")}
      title={t("dashboard_title")}
      updatedAtLabel={t("dashboard_updated_at_label")}
      updatedAtValue={formatDateTime(lastUpdatedAt)}
      currentUserLabel={t("dashboard_current_user")}
      currentUserName={user?.profile.preferred_username ?? user?.profile.name ?? user?.profile.nickname ?? "no name"}
      currentUserId={user?.profile.sub ?? "-"}
      editProfileLabel={t("dashboard_profile_edit")}
      languageLabel={t("dashboard_language")}
      refreshLabel={t("dashboard_refresh")}
      signOutLabel={t("dashboard_sign_out")}
      timeZoneLabel={locale === "ja" ? "タイムゾーン" : "Time zone"}
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
      onEditProfile={handleEditProfile}
      onLocaleChange={(nextLocale: string) => {
        if (isLocale(nextLocale)) setLocale(nextLocale);
      }}
      onTimeZoneChange={setTimeZone}
      onRefresh={handleRefresh}
      onSignOut={handleSignOut}
    />
  );
}
