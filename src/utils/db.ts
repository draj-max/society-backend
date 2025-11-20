import logger from "./logger";
import mongoose from "mongoose";
import { DB_URI } from "../config";

export const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect(DB_URI);
        logger.info("✅ Connected to MongoDB successfully!");
    } catch (error: any) {
        logger.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
};
