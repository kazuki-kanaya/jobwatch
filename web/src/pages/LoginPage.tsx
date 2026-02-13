import LoginButton from "@/features/auth/components/LoginButton";

export default function LoginPage() {
  return (
    <div className="p-6">
      <h1 className="font-semibold text-2xl">Sign in</h1>
      <p className="mt-2 text-muted-foreground">Continue with your OIDC provider.</p>
      <div className="mt-4">
        <LoginButton>Sign in</LoginButton>
      </div>
    </div>
  );
}
