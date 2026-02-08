import type { AuthClient } from "@/features/auth/domain/ports";

export class Authenticator {
  private client: AuthClient;

  constructor(client: AuthClient) {
    this.client = client;
  }

  completeLogin = async () => {
    const tokens = await this.client.getTokens();
    if (!tokens?.accessToken) throw new Error("Not authenticated");
    return tokens;
  };

  startLogin = async () => {
    await this.client.startLogin();
  };
}
