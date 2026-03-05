import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { clearAuthReturnToPath, getPostAuthPath } from "@/features/auth/utils/authSession";

export function AuthCallback() {
  const { error, isAuthenticated, isLoading, signinRedirect } = useAuth();
  const postAuthPathRef = useRef<string>(getPostAuthPath());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;
    clearAuthReturnToPath();
  }, [isAuthenticated]);

  const signin = async () => {
    if (isSubmitting) return;
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      await signinRedirect({ state: { returnTo: postAuthPathRef.current } });
    } catch (redirectError) {
      console.error(redirectError);
      setSubmitError("Could not start sign-in. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <h1>Loading...</h1>;
  if (isAuthenticated) return <Navigate replace to={postAuthPathRef.current} />;

  const displayError = error?.message ?? submitError;

  return (
    <div className="space-y-3">
      <h1>{displayError ? "Sign-in failed" : "Continue to sign in"}</h1>
      {displayError ? <p className="text-sm text-muted-foreground">{displayError}</p> : null}
      <Button type="button" onClick={() => void signin()} disabled={isSubmitting}>
        {isSubmitting ? "Redirecting..." : "Continue to sign in"}
      </Button>
    </div>
  );
}
