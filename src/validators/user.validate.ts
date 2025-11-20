import { z } from 'zod';

export const createUserSchema = z.object({
    username: z.string(),
    email: z.email(),
    password: z.string(),
    role: z.enum(['user', 'admin']).default('user'),
    phone: z.number(),
    society: z.string(),
    roomNo: z.number(),
    chawlNo: z.string(),
    isOwner: z.boolean().default(false),
});

export type UserValidate = z.infer<typeof createUserSchema>;
