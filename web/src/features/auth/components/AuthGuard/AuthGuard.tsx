import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useLocation } from "react-router";
import { setAuthReturnToPath } from "@/features/auth/utils/authSession";

export function AuthGuard() {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;
    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    setAuthReturnToPath(returnTo);
    void signinRedirect({ extraQueryParams: { prompt: "login" } });
  }, [isAuthenticated, isLoading, location.hash, location.pathname, location.search, signinRedirect]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <Outlet />;
}
