import type { AuthTokens } from "@/features/auth/domain/entities";

export interface AuthClient {
  startLogin(): Promise<void>;
  getTokens(): Promise<AuthTokens | null>;
  logout(): Promise<void>;
}
