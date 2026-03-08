import type { QueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { hostQueryKeys } from "@/features/host/api/hostQueryKeys";
import { jobQueryKeys } from "@/features/job/api/jobQueryKeys";
import { workspaceQueryKeys } from "@/features/workspace/api/workspaceQueryKeys";
import type { MessagesKey } from "@/i18n/messages/types";
import { env } from "@/lib/env";

type UseHeaderSessionActionsParams = {
  queryClient: QueryClient;
  removeUser: () => Promise<void>;
  idToken: string | undefined;
  t: (key: MessagesKey) => string;
};

export const useHeaderSessionActions = ({ queryClient, removeUser, idToken, t }: UseHeaderSessionActionsParams) => {
  const [lastUpdatedAt, setLastUpdatedAt] = useState(() => new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: workspaceQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: hostQueryKeys.root }),
        queryClient.invalidateQueries({ queryKey: jobQueryKeys.root }),
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
      if (idToken) logoutUrl.searchParams.set("id_token_hint", idToken);
      await removeUser();
      window.location.assign(logoutUrl.toString());
    } finally {
      setIsSigningOut(false);
    }
  };

  return {
    lastUpdatedAt,
    isRefreshing,
    isSigningOut,
    handleRefresh,
    handleSignOut,
  };
};
