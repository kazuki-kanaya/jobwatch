import { z } from "zod";

export const AuthProfileSchema = z.object({
  sub: z.string(),
  name: z.string().optional(),
  email: z.email().optional(),
});

export type AuthProfile = z.infer<typeof AuthProfileSchema>;

export const AuthSessionSchema = z.object({
  profile: AuthProfileSchema,
  accessToken: z.string().optional(),
  idToken: z.string().optional(),
});

export type AuthSession = z.infer<typeof AuthSessionSchema>;
