import { useEffect, useRef } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { clearAuthReturnToPath, getPostAuthPath } from "@/features/auth/utils/authSession";

export function AuthCallback() {
  const { error, isAuthenticated, isLoading, signinRedirect } = useAuth();
  const postAuthPathRef = useRef<string>(getPostAuthPath());

  useEffect(() => {
    if (!isAuthenticated) return;
    clearAuthReturnToPath();
  }, [isAuthenticated]);

  const signin = async () => {
    await signinRedirect({ state: { returnTo: postAuthPathRef.current } });
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isAuthenticated) return <Navigate replace to={postAuthPathRef.current} />;

  return (
    <div className="space-y-3">
      <h1>Sign-in failed</h1>
      {error ? <p className="text-sm text-muted-foreground">{error.message}</p> : null}
      <Button type="button" onClick={signin}>
        Continue to sign in
      </Button>
    </div>
  );
}
