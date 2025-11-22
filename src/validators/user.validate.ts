import { z } from 'zod';

export const updateMyProfileSchema = z.object({
    username: z.string().optional(),
    email: z.email().optional(),
    phone: z.number().optional(),
}).strict();

export const resetUserPasswordSchema = z.object({
    id: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).strict();


export const findUserIdSchema = z.object({
    id: z.string().check((value) => {
        if (!value) {
            throw new Error("User ID is required");
        }
        if (String(value.value).length !== 24) {
            throw new Error("Invalid User ID provided");
        }
    }),
}).strict();

export const updateUserSchema = z.object({
    role: z.enum(['user', 'superAdmin']).optional(),
    username: z.string().optional(),
    email: z.email().optional(),
    phone: z.number().optional(),

    society: z.string().optional().check((value) => {
        if (!value) {
            throw new Error("Society ID is required");
        }
        if (String(value.value).length !== 24) {
            throw new Error("Invalid Society ID provided");
        }
    }),

    roomNo: z.number().optional(),
    chawlFlatNo: z.string().optional(),
    isOwner: z.boolean().optional(),
}).strict();

export type FindUserIdValidate = z.infer<typeof findUserIdSchema>;
export type UpdateMyProfileValidate = z.infer<typeof updateMyProfileSchema>;
export type ResetUserPasswordValidate = z.infer<typeof resetUserPasswordSchema>;
export type UpdateUserValidate = z.infer<typeof updateUserSchema>;
