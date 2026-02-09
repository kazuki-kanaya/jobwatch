import { useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import { storageKeys } from "@/features/auth/constants";

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const to = sessionStorage.getItem(storageKeys.redirectAfterLoginKey) ?? "/";
    sessionStorage.removeItem(storageKeys.redirectAfterLoginKey);

    navigate(to, { replace: true });
  }, [auth.isAuthenticated, navigate]);

  return <div>{auth.isAuthenticated ? "Redirecting..." : "Signing in..."}</div>;
}
