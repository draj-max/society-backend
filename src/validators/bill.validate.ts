import * as z from "zod";
import { billCategories, billStatus } from "../config";

export const createBillSchema = z.object({
    memberId: z.string().length(24, "Member ID must be 24 characters long"),
    category: z.enum(billCategories),
    totalAmount: z.number().min(1, "Amount must be at least 1"),
    dueDate: z.string(),
}).strict();

export const updateBillSchema = z.object({
    memberId: z.string().length(24, "Member ID must be 24 characters long").optional(),
    category: z.enum(billCategories).optional(),
    totalAmount: z.number().min(1, "Amount must be at least 1").optional(),
    dueDate: z.string().optional(),
    paidDate: z.string().optional(),
    paidAmount: z.number().min(1, "Paid amount must be at least 1").optional(),
    status: z.enum(billStatus).optional(),
}).strict();


export const idSchema = z.object({
    id: z.string().length(24, "Bill ID must be 24 characters long"),
}).strict();

export const statusSchema = z.object({
    status: z.enum(billStatus).optional(),
});


export type IdValidate = z.infer<typeof idSchema>;
export type CreateBillValidate = z.infer<typeof createBillSchema>;
export type UpdateBillValidate = z.infer<typeof updateBillSchema>;
export type StatusValidate = z.infer<typeof statusSchema>;
