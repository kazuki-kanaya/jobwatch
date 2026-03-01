const defaultApiBaseUrl = "http://127.0.0.1:8000";

const requiredEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const env = {
  oidcIssuer: requiredEnv(import.meta.env.VITE_OIDC_ISSUER, "VITE_OIDC_ISSUER"),
  oidcClientId: requiredEnv(import.meta.env.VITE_OIDC_CLIENT_ID, "VITE_OIDC_CLIENT_ID"),
  oidcAuthDomain: requiredEnv(import.meta.env.VITE_OIDC_AUTH_DOMAIN, "VITE_OIDC_AUTH_DOMAIN"),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl,
} as const;
