import * as z from "zod";

// create society schema
export const createSocietySchema = z.object({
    // about society
    name: z.string().min(3, "Name must be at least 3 characters long"),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters long"),
    address: z.string().min(5, "Address must be at least 5 characters long"),
    city: z.string().min(3, "City must be at least 3 characters long"),
    state: z.string().min(3, "State must be at least 3 characters long"),
    pincode: z.string().min(6, "Pincode must be at least 6 characters long"),

    // about society admin
    username: z.string().min(3, "Username must be at least 3 characters long"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).strict();

// update society schema
export const updateSocietySchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long").optional(),
    registrationNumber: z.string().min(5, "Registration number must be at least 5 characters long").optional(),
    address: z.string().min(5, "Address must be at least 5 characters long").optional(),
    city: z.string().min(3, "City must be at least 3 characters long").optional(),
    state: z.string().min(3, "State must be at least 3 characters long").optional(),
    pincode: z.string().min(6, "Pincode must be at least 6 characters long").optional(),
    admin_id: z.string().min(24, "Admin ID must be at least 24 characters long").optional(),
}).strict();


// find society schema
export const findSocietyIdSchema = z.object({
    id: z.string().check((value) => {
        if (!value) {
            throw new Error("Society ID is required");
        }
        if (String(value.value).length !== 24) {
            throw new Error("Invalid Society ID provided");
        }
    }),
}).strict();

// member id schema
export const MemberIdSchema = z.object({
    member_id: z.string().length(24, "Member ID must be 24 characters long"),
}).strict();

// add member schema 
export const addMemberSchema = z.object({
    username: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
}).strict();


export type MemberIdValidate = z.infer<typeof MemberIdSchema>;
export type AddMemberValidate = z.infer<typeof addMemberSchema>;
export type CreateSocietyValidate = z.infer<typeof createSocietySchema>;
export type UpdateSocietyValidate = z.infer<typeof updateSocietySchema>;
export type FindSocietyIdValidate = z.infer<typeof findSocietyIdSchema>;
