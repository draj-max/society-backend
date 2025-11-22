import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

// user imports
import { JWT_SECRET } from "../config";
import User from "../models/user.model";
import sendResponse from "../utils/sendResponse";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers?.authorization;
    if (!authHeader) return sendResponse(res, 400, "Missing token");

    const token = authHeader.split(" ")[1];
    if (!token) return sendResponse(res, 401, "Invalid token format");

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

        const user = await User.findById(decoded.userId);
        if (!user || user.isActive === false) return sendResponse(res, 401, "User not found or deactived");

        req.user = user;
        next();
    } catch (err: any) {
        console.error("JWT verification error:", err?.message);

        if (err.name === "TokenExpiredError") {
            return sendResponse(res, 401, "Access token expired");
        }
        if (err.name === "JsonWebTokenError") {
            return sendResponse(res, 401, "Invalid token");
        }
        return sendResponse(res, 500, `Invalid token: ${err.message}`);
    }
};

export default authenticate;
