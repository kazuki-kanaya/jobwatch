import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import type { PropsWithChildren } from "react";
import type { AuthProviderProps } from "react-oidc-context";
import { AuthProvider as OidcAuthProvider } from "react-oidc-context";
import { env } from "@/lib/env";

const oidcSettings = {
  authority: env.oidcAuthority,
  client_id: env.oidcClientId,
  redirect_uri: `${window.location.origin}/auth/callback`,
  post_logout_redirect_uri: `${window.location.origin}/`,
  response_type: "code",
  scope: "openid profile",
  userStore: new WebStorageStateStore({ store: window.sessionStorage }),
} as const;

export const oidcUserManager = new UserManager(oidcSettings);

const oidcConfig: AuthProviderProps = {
  ...oidcSettings,
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

export default function AuthProvider({ children }: PropsWithChildren) {
  return <OidcAuthProvider {...oidcConfig}>{children}</OidcAuthProvider>;
}
