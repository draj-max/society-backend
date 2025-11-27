import bcrypt from "bcrypt";
import readline from "readline";

import User from "../models/user.model";
import { connectDB } from "../utils/db";
import { superAdmin, bcryptSaltRounds } from "../config";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const askQuestion = (query: string): Promise<string> => {
    return new Promise((resolve) =>
        rl.question(query, (answer) => resolve(answer.trim()))
    );
};

(async () => {
    try {
        await connectDB();

        console.log("\n=== Create Super Admin User ===\n");

        let username = await askQuestion("Enter username: ");
        let email = await askQuestion("Enter email: ");
        let password = await askQuestion("Enter password: ");

        if (!username || !email || !password) {
            console.log("All fields are required!");
            process.exit(1);
        }

        email = email.toLowerCase();
        username = username.toLowerCase();

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
        const superUser = new User({
            email,
            username,
            password: hashPassword,
            role: superAdmin
        });

        await superUser.save();
        console.log("Super Admin created successfully.", superUser);
    } catch (err) {
        console.error("Error:", err);
    } finally {
        process.exit(0);
    }
})();


