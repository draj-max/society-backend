import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";

// user imports 
import User from "../models/user.model";
import sendResponse from "../utils/sendResponse";
import {
    JWT_SECRET,
    accessTokenExp,
    bcryptSaltRounds,
    refreshTokenExp,
} from "../config";

// register controller
export const register = async (req: Request, res: Response) => {
    try {
        let { username, email, password } = req.body;
        if (!username || !email || !password) {
            return sendResponse(res, 400, "All fields are required.");
        }

        email = email?.trim()?.toLowerCase();
        username = username?.trim()?.toLowerCase();
        password = password?.trim();

        const [existEmail, existUsername] = await Promise.all([
            User.findOne({ email }),
            User.findOne({ username }),
        ]);
        if (existEmail || existUsername) {
            return sendResponse(res, 400, "User already exists with the given email or username.");
        }

        const hashPassword = await bcrypt.hash(password, bcryptSaltRounds);

        const newUser = new User({
            username, email,
            password: hashPassword,
        });
        await newUser.save();

        return sendResponse(res, 201, "User registered successfully.", newUser);
    } catch (error: any) {
        console.error("Register Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

// login controller 
export const login = async (req: Request, res: Response) => {
    try {
        let { email, password } = req.body;
        if (!email || !password) {
            return sendResponse(res, 400, "Both email and password are required.");
        }

        email = email?.trim()?.toLowerCase();
        password = password?.trim();

        const user = await User.findOne({ email }).select("+password");
        if (!user) return sendResponse(res, 404, "User not found with the givem email.");

        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) return sendResponse(res, 400, "Incorrect password.");

        // ✅ Generate JWT tokens
        const tokenPayload = { userId: user._id };

        const accessToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: accessTokenExp });
        const refreshToken = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: refreshTokenExp });

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

// my profile
export const myProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return sendResponse(res, 200, "User found.", user);
    } catch (error: any) {
        console.error("Me Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};


// refresh token
export const refreshToken = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return sendResponse(res, 200, "User found.", user);
    } catch (error: any) {
        console.error("Refresh Token Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

