import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// user imports 
import User from "../models/user.model";
import sendResponse from "../utils/sendResponse";
import {
    JWT_SECRET,
    JWT_REFRESH_SECRET,
    accessTokenExp,
    bcryptSaltRounds,
    refreshTokenExp,
} from "../config";

// ===================== unauthenticated / public routes =========================

// login controller 
export const login = async (req: Request, res: Response) => {
    try {
        let { username, email, password } = req.body;
        if (!username && !email || !password) {
            return sendResponse(res, 400, "email or username and password are required.");
        }

        email = email?.trim()?.toLowerCase();
        password = password?.trim();

        const [userByEmail, userByUsername] = await Promise.all([
            User.findOne({ email }).select("+password"),
            User.findOne({ username }).select("+password"),
        ]);

        const user = userByEmail || userByUsername;
        if (!user) {
            return sendResponse(res, 404, "User not found with the givem email or username.");
        }

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) return sendResponse(res, 400, "Incorrect password.");

        // ✅ Generate JWT tokens
        const tokenPayload = { userId: user._id };

        const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jwt.sign(tokenPayload, JWT_REFRESH_SECRET, { expiresIn: refreshTokenExp });

        return sendResponse(res, 200, "You are loggedin successfully.", {
            user: {
                _id: String(user._id),
                username: user.username,
                email: user.email,
            },
            accessToken,
            refreshToken,
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

// refresh token
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return sendResponse(res, 400, "Refresh token is required.");

        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET) as { userId: string };
        if (!decoded) return sendResponse(res, 401, "Invalid refresh token.");

        const exitstUser = await User.findById(decoded.userId);
        if (!exitstUser) return sendResponse(res, 404, "User not found.");

        const accessToken = jwt.sign({ userId: exitstUser._id }, JWT_SECRET, { expiresIn: accessTokenExp });
        const newRefreshToken = jwt.sign({ userId: exitstUser._id }, JWT_REFRESH_SECRET, { expiresIn: refreshTokenExp });

        return sendResponse(res, 200, "Your token is refreshed successfully.", {
            user: {
                _id: String(exitstUser._id),
                username: exitstUser.username,
                email: exitstUser.email,
            },
            accessToken,
            newRefreshToken,
        });
    } catch (error: any) {
        if (error.name === "TokenExpiredError") return sendResponse(res, 401, "Refresh token expired.");
        if (error.name === "JsonWebTokenError") return sendResponse(res, 401, "Invalid refresh token.");

        console.error("Refresh Token Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

// ===================== authenticated / private routes =========================
// logout
export const logout = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        console.log("User trying to logged out.", user?._id);

        return sendResponse(res, 204, "User logged out successfully.", null);
    } catch (error: any) {
        console.error("Logout Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

