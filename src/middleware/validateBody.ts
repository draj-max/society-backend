import { z, ZodError } from "zod";
import { NextFunction, Request, Response } from "express";

export const validate = (schema: { body?: any; params?: any; query?: any }) =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            if (schema.body) {
                schema.body.parse(req.body);
            }
            if (schema.params) {
                schema.params.parse(req.params);
            }
            if (schema.query) {
                schema.query.parse(req.query);
            }

            return next();
        } catch (error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    success: false,
                    message: "Validation error",
                    errors: error.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                });
            }

            return next(error);
        }
    };
