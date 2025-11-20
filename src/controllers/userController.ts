import User from '../models/user.model';
import logger from '../utils/logger';
import { Request, Response } from 'express';
import sendResponse from '../utils/sendResponse';


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const user: any = req.user;
        // if (user?.role !== "admin") return sendResponse(res, 401, "Unauthorized to access this resource");

        const users = await User.find({}).lean();
        return sendResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error: any) {
        logger.error(`Error in getUsers: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};
