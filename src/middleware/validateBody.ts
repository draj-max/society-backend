import { z, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export function validateBody(schema: z.ZodObject<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedBody = schema.safeParse(req.body);

            if (!parsedBody.success) {
                return res.status(400).json({
                    error: "Validation Error",
                    details: parsedBody.error.issues.map((d) => d.message),
                });
            }
            req.body = parsedBody.data;
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                console.error("Validation failed for valid data:", error.issues);
                return res.status(400).json({
                    error: "Validation Error",
                    details: error.issues.map((d) => d.message),
                });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};


// validate query
export function validateQuery(schema: z.ZodObject<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedQuery = schema.safeParse(req.query);

            if (!parsedQuery.success) {
                return res.status(400).json({
                    error: "Validation Error",
                    details: parsedQuery.error.issues.map((d) => d.message),
                });
            }
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                console.error("Validation failed for valid data:", error.issues);
                return res.status(400).json({
                    error: "Validation Error",
                    details: error.issues.map((d) => d.message),
                });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };
};


// validate params
export function validateParams(schema: z.ZodObject<any>) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsedParams = schema.safeParse(req.params);

            if (!parsedParams.success) {
                return res.status(400).json({
                    error: "Validation Error",
                    details: parsedParams.error.issues.map((d) => d.message),
                });
            }
            next();
        } catch (error: any) {
            if (error instanceof ZodError) {
                console.error("Validation failed for valid data:", error.issues);
                return res.status(400).json({
                    error: "Validation Error",
                    details: error.issues.map((d) => d.message),
                });
            }
            console.error("Validation failed for valid data:", error);
            return res.status(500).json({ message: error.message });
        }
    };
};
