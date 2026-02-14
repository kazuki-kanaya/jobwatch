import { useAuth } from "react-oidc-context";
import { Outlet } from "react-router";

export default function AuthGuard() {
  const { isLoading, isAuthenticated, signinRedirect } = useAuth();

  if (!isLoading && !isAuthenticated) void signinRedirect();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <Outlet />;
}
