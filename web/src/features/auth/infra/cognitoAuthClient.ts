import type { AuthClient } from "@/features/auth/domain/ports";

export const cognitoAuthClient = (): AuthClient => ({
  startLogin: async () => {},
  getTokens: async () => {
    return null;
  },
  logout: async () => {},
});
