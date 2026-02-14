import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";

export default function AuthCallbackPage() {
  const { isLoading, isAuthenticated } = useAuth();
  if (isLoading) return <h1>Signing in...</h1>;
  if (isAuthenticated) return <Navigate replace to="/" />;

  return <h1>Redirecting...</h1>;
}
