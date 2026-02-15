import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";
import { AUTH_RETURN_TO_KEY } from "@/features/auth/constants";

const getPostAuthPath = () => {
  const returnTo = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);

  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("/auth/callback")) return "/";
  return returnTo;
};

export default function AuthCallbackPage() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <h1>Signing in...</h1>;
  if (isAuthenticated) return <Navigate replace to={getPostAuthPath()} />;

  return <h1>Redirecting...</h1>;
}
