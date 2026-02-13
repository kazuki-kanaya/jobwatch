import type { User } from "oidc-client-ts";
import { oidcUserManager } from "@/features/auth/auth.config";

export const getAuthUser = async (): Promise<User | null> => {
  return oidcUserManager.getUser();
};

export const getAccessToken = async (): Promise<string | null> => {
  const user = await getAuthUser();
  return user?.id_token ?? user?.access_token ?? null;
};
