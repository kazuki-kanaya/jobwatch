const defaultApiBaseUrl = "http://127.0.0.1:8000";

const requiredEnv = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(`Missing required env: ${key}`);
  }
  return value;
};

export const env = {
  oidcAuthority: requiredEnv(import.meta.env.VITE_OIDC_AUTHORITY, "VITE_OIDC_AUTHORITY"),
  oidcClientId: requiredEnv(import.meta.env.VITE_OIDC_CLIENT_ID, "VITE_OIDC_CLIENT_ID"),
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? defaultApiBaseUrl,
} as const;
