import { Request, Response } from "express";

import Society from "../models/society.model";
import sendResponse from "../utils/sendResponse";
import User from "../models/user.model";

export const createSociety = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== "superAdmin") {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        let {
            name,
            registrationNumber,
            address,
            city,
            state,
            pincode,
            admin_id,
        } = req.body;

        // sanitize inputs
        name = name.trim();
        registrationNumber = registrationNumber.trim();
        address = address.trim();
        city = city.trim();
        state = state.trim();
        pincode = pincode.trim();
        admin_id = admin_id.trim();

        // check if admin exists
        const admin = await User.findById(admin_id).lean();
        if (!admin) {
            return sendResponse(res, 404, "Admin not found");
        }
        //check if registration number is unique
        const society = await Society.findOne({ registrationNumber }).lean();
        if (society) {
            return sendResponse(res, 400, "Registration number already exists");
        }
        // check if pincode is valid
        if (pincode.length !== 6) {
            return sendResponse(res, 400, "Invalid pincode");
        }


        const newSociety = new Society({
            name,
            registrationNumber,
            address,
            city,
            state,
            pincode,
            admin: admin_id,
        });
        await newSociety.save();
        return sendResponse(res, 200, "Society created successfully", newSociety);

    } catch (error: any) {
        console.log("Error in createSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// to get all societies iff role is superadmin
export const getAllSocieties = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== "superAdmin") {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const societies = await Society.find({}).lean();
        return sendResponse(res, 200, 'Societies retrieved successfully', societies);
    } catch (error: any) {
        console.log("Error in getAllSocieties: ", error);
        return sendResponse(res, 500, error.message);
    }
};

