import { z } from "zod";

export const loginSchema = z.object({
    email: z.email(),
    password: z.string(),
});

export type LoginValidate = z.infer<typeof loginSchema>;


// register 
export const registerSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type RegisterValidate = z.infer<typeof registerSchema>;
