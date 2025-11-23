import { Request, Response } from "express";

import User from "../models/user.model";
import Society from "../models/society.model";
import sendResponse from "../utils/sendResponse";
import { societyAdmin, superAdmin } from "../config";

function findSociety(query: any) {
    return Society.findOne(query);
}

// create a society
export const createSociety = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== superAdmin) {
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
        name = name?.trim();
        registrationNumber = registrationNumber?.trim();
        address = address?.trim();
        city = city?.trim();
        state = state?.trim();
        pincode = pincode?.trim();
        admin_id = admin_id?.trim();

        // check if admin exists
        const admin = await User.findById(admin_id);
        if (!admin) {
            return sendResponse(res, 404, "Society admin is not found.");
        }

        // chack if this admin is not already assigned to another society
        const existSocietyAdmin = await findSociety({ admin: admin_id });
        if (existSocietyAdmin) {
            return sendResponse(res, 409, "Admin is already assigned to another society.");
        }

        //check if registration number is unique
        const society = await findSociety({ registrationNumber });
        if (society) {
            return sendResponse(res, 409, "Registration number already exists.");
        }
        // check if pincode is valid
        if (pincode?.length !== 6) {
            return sendResponse(res, 400, "Invalid pincode.");
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

        // make admin role as societyAdmin
        admin.role = societyAdmin;
        await admin.save();

        return sendResponse(res, 201, "Society created successfully", newSociety);

    } catch (error: any) {
        console.log("Error in createSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// to get all societies iff role is superadmin
export const getAllSocieties = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== superAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const societies = await Society.find({}).lean();
        return sendResponse(res, 200, 'Societies retrieved successfully', societies);
    } catch (error: any) {
        console.log("Error in getAllSocieties: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// get a society by id
export const getSocietyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;
        if (user?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const society = await Society.findById(id).populate("admin").lean();
        return sendResponse(res, 200, 'Society retrieved successfully', society);
    } catch (error: any) {
        console.log("Error in getSocietyById: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// update a society by id
export const updateSociety = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const formData = req.body;
        const user = req.user;

        if (user?.role !== societyAdmin || user?.role !== superAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const existingSociety = await findSociety({ _id: id });
        if (!existingSociety) {
            return sendResponse(res, 404, "Society not found");
        }

        if (formData.name) { formData.name = formData.name.trim(); }
        if (formData.registrationNumber) {
            formData.registrationNumber = formData.registrationNumber.trim();
            const society = await findSociety({ registrationNumber: formData.registrationNumber });
            if (society) {
                return sendResponse(res, 400, "Registration number already exists");
            }
        }

        if (formData.address) { formData.address = formData.address.trim(); }
        if (formData.city) { formData.city = formData.city.trim(); }
        if (formData.state) { formData.state = formData.state.trim(); }

        if (formData.pincode) {
            formData.pincode = formData.pincode.trim();
            if (formData.pincode?.length !== 6) {
                return sendResponse(res, 400, "Invalid pincode");
            }
        }

        if (formData.admin) {
            formData.admin = formData.admin.trim();
            const adminSociety = await findSociety({ admin: formData.admin });

            if (adminSociety) {
                return sendResponse(res, 400, "Society admin already exists in another society");
            }
        };

        const updatedData = {
            name: formData.name ?? existingSociety.name,
            registrationNumber: formData.registrationNumber ?? existingSociety.registrationNumber,
            address: formData.address ?? existingSociety.address,
            city: formData.city ?? existingSociety.city,
            state: formData.state ?? existingSociety.state,
            pincode: formData.pincode ?? existingSociety.pincode,
            admin: formData.admin ?? existingSociety.admin
        }

        const updatedSociety = await Society.findByIdAndUpdate(id,
            updatedData,
            { new: true }
        ).lean();

        return sendResponse(res, 200, 'Society updated successfully', updatedSociety);
    } catch (error: any) {
        console.log("Error in updateSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// delete a society by id
export const deleteSociety = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = req.user;
        // console.log("user: ", user);

        if (user?.role !== superAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const society = await Society.findByIdAndDelete(id).lean();
        if (!society) {
            return sendResponse(res, 404, "Society not found or already deleted.");
        }
        return sendResponse(res, 204, "Society deleted successfully", null);
    } catch (error: any) {
        console.log("Error in deleteSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};
