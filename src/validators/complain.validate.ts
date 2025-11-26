import * as z from "zod";

export const complainQuerySchema = z.object({
    status: z.enum(["raised", "resolved"]).optional(),
}).strict();

export const complainSchema = z.object({
    title: z.string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title must be at most 100 characters long"),

    description: z.string()
        .min(10, "Description must be at least 10 characters long")
        .max(1000, "Description must be at most 1000 characters long"),
}).strict();

export const approveRejectComplainSchema = z.object({
    complaintId: z.string().length(24, "Invalid complaint ID"),
    status: z.enum(["forwarded", "resolved"]),
}).strict();

export type ComplainSchema = z.infer<typeof complainSchema>;
export type ComplainQuerySchema = z.infer<typeof complainQuerySchema>;
export type ApproveRejectComplainSchema = z.infer<typeof approveRejectComplainSchema>;
