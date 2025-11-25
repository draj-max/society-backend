import { z } from "zod";

// login
export const loginSchema = z.object({
    email: z.email().optional(),
    username: z.string().optional(),
    password: z.string(),
}).strict();

// refresh token
export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
}).strict();

export type LoginValidate = z.infer<typeof loginSchema>;
export type RefreshTokenValidate = z.infer<typeof refreshTokenSchema>;
