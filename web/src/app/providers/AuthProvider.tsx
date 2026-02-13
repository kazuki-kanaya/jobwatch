import type { PropsWithChildren } from "react";
import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import { oidcConfig } from "@/features/auth/auth.config";

export default function AuthProvider({ children }: PropsWithChildren) {
  return <OidcAuthProvider {...oidcConfig}>{children}</OidcAuthProvider>;
}
