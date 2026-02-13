import { useAuth } from "react-oidc-context";
import { Outlet, useLocation } from "react-router";
import { authStorageKeys } from "@/features/auth/auth.config";

export default function AuthGuard() {
  const auth = useAuth();
  const location = useLocation();

  if (auth.isLoading) return <div>Loading...</div>;
  if (!auth.isAuthenticated) {
    sessionStorage.setItem(authStorageKeys.redirectAfterLogin, location.pathname + location.search);
    void auth.signinRedirect();
    return null;
  }
  return <Outlet />;
}
