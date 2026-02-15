import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { Outlet, useLocation } from "react-router";
import { AUTH_RETURN_TO_KEY } from "@/features/auth/constants";

export default function AuthGuard() {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (isLoading || isAuthenticated) return;

    const returnTo = `${location.pathname}${location.search}${location.hash}`;
    window.sessionStorage.setItem(AUTH_RETURN_TO_KEY, returnTo);
    console.debug("AuthGuard: User not authenticated, redirecting to sign-in page", { returnTo });
    void signinRedirect();
  }, [isAuthenticated, isLoading, location.hash, location.pathname, location.search, signinRedirect]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <Outlet />;
}
