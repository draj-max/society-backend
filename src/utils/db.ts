import logger from "./logger";
import mongoose from "mongoose";
import { MONGODB_URL } from "../config";

export const connectDB = async (): Promise<void> => {
    console.log("\n=== Connecting to MongoDB ===\n");

    try {
        await mongoose.connect(MONGODB_URL);
        logger.info("✅ Connected to MongoDB successfully!");
    } catch (error: any) {
        logger.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
