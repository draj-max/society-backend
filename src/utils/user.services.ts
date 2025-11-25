import bcrypt from "bcrypt";

import User from "../models/user.model";
import { bcryptSaltRounds } from "../config";

export interface CreateUserInput {
    username: string;
    email: string;
    password: string;
    society?: any;
}

export async function createUser(input: CreateUserInput) {
    let { username, email, password, society } = input;

    // sanitize
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();
    password = password.trim();

    // check duplicates
    const [existEmail, existUsername] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ username }),
    ]);

    if (existEmail) throw new Error("Email already exists.");
    if (existUsername) throw new Error("Username already exists.");

    // hash
    const hashPassword = await bcrypt.hash(password, bcryptSaltRounds);

    // create user object
    const newUser = new User({
        email,
        society,
        username,
        password: hashPassword,
    });

    await newUser.save();
    return newUser;
};

