import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { authStorageKeys } from "@/features/auth/auth.config";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const to = sessionStorage.getItem(authStorageKeys.redirectAfterLogin) ?? "/";
    sessionStorage.removeItem(authStorageKeys.redirectAfterLogin);

    navigate(to, { replace: true });
  }, [auth.isAuthenticated, navigate]);

  return <div>{auth.isAuthenticated ? "Redirecting..." : "Signing in..."}</div>;
}
