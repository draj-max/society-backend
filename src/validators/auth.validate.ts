import { z } from "zod";

// login
export const loginSchema = z.object({
    email: z.email().optional(),
    username: z.string().optional(),
    password: z.string(),
}).strict();

export type LoginValidate = z.infer<typeof loginSchema>;


// register 
export const registerSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).strict();

export type RegisterValidate = z.infer<typeof registerSchema>;


// refresh token
export const refreshTokenSchema = z.object({
    refreshToken: z.string(),
}).strict();

export type RefreshTokenValidate = z.infer<typeof refreshTokenSchema>;
