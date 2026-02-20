import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { AUTH_RETURN_TO_KEY } from "@/features/auth/constants";

const getPostAuthPath = () => {
  const returnTo = window.sessionStorage.getItem(AUTH_RETURN_TO_KEY);
  if (!returnTo || !returnTo.startsWith("/") || returnTo.startsWith("/auth/callback")) return "/dashboard";
  return returnTo;
};

export default function AuthCallbackContainer() {
  const { isLoading, isAuthenticated, error, signinRedirect } = useAuth();
  const postAuthPathRef = useRef<string>(getPostAuthPath());
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    window.sessionStorage.removeItem(AUTH_RETURN_TO_KEY);
  }, [isAuthenticated]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await signinRedirect({ state: { returnTo: postAuthPathRef.current } });
    } finally {
      setIsRetrying(false);
    }
  };

  if (isLoading) return <h1>Signing in...</h1>;
  if (isAuthenticated) return <Navigate replace to={postAuthPathRef.current} />;
  if (error) {
    return (
      <div className="space-y-3">
        <h1>Sign-in failed</h1>
        <p className="text-sm text-muted-foreground">{error.message}</p>
        <Button type="button" onClick={handleRetry} disabled={isRetrying}>
          {isRetrying ? "Retrying..." : "Retry sign in"}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h1>Redirecting...</h1>
      <Button type="button" onClick={handleRetry} disabled={isRetrying}>
        {isRetrying ? "Redirecting..." : "Continue to sign in"}
      </Button>
    </div>
  );
}
