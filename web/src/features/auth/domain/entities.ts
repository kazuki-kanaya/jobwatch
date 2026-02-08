import z from "zod";

export const AuthTokensSchema = z.object({
  accessToken: z.string().optional(),
  refreshToken: z.string().optional(),
});
export type AuthTokens = z.infer<typeof AuthTokensSchema>;
