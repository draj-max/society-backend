import { Schema } from "mongoose";
import { Request, Response } from "express";

import User from "../models/user.model";
import Society from "../models/society.model";
import sendResponse from "../utils/sendResponse";
import { createUser } from "../utils/user.services";
import { societyAdmin, superAdmin } from "../config";

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

            username,
            email,
            password,
        } = req.body;

        // sanitize inputs
        name = name?.trim();
        registrationNumber = registrationNumber?.trim();
        address = address?.trim();
        city = city?.trim();
        state = state?.trim();
        pincode = pincode?.trim();


        // Check unique registration number
        const existingSociety = await Society.findOne({ registrationNumber });
        if (existingSociety) {
            return sendResponse(res, 409, "Registration number already exists.");
        }

        // Validate pincode
        if (!pincode || pincode.length !== 6) {
            return sendResponse(res, 400, "Invalid pincode.");
        }

        // Create admin user
        const societyAdminUser = await createUser({ email, username, password });
        if (!societyAdminUser) {
            return sendResponse(res, 500, "Failed to create society admin user");
        }

        // Create Society
        let newSociety;
        try {
            newSociety = await Society.create({
                name,
                registrationNumber,
                address,
                city,
                state,
                pincode,
                admin: societyAdminUser._id,
            });
        } catch (err) {
            await User.findByIdAndDelete(societyAdminUser._id);
            throw err;
        }

        if (!newSociety) {
            await User.findByIdAndDelete(societyAdminUser._id);
            return sendResponse(res, 500, "Failed to create society");
        }

        // STEP 3: Update admin → If fails, rollback everything manually
        try {
            await User.findByIdAndUpdate(
                societyAdminUser._id,
                {
                    role: societyAdmin,
                    society: newSociety._id,
                }
            );
        } catch (err) {
            // rollback both
            await Society.findByIdAndDelete(newSociety._id);
            await User.findByIdAndDelete(societyAdminUser._id);
            throw err;
        }

        return sendResponse(res, 201, "Society created successfully", newSociety);

    } catch (error: any) {
        console.log("Error in createSociety: ", error.message);
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
        if (![societyAdmin, superAdmin].includes(user?.role)) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }
        const society = await Society.findById(id);

        // 🛑 Extra check → Society Admin must belong to same society
        if (user?.role === societyAdmin) {
            if (String(society?.admin) !== String(user._id)) {
                return sendResponse(res, 403, "You are not authorized to fetch this society");
            }
        }

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

        if (![societyAdmin, superAdmin].includes(user?.role)) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const existingSociety = await Society.findById(id);
        if (!existingSociety) {
            return sendResponse(res, 404, "Society not found");
        }
        // console.log("user: ", user);

        // 🛑 Extra check → Society Admin must belong to same society
        if (user?.role === societyAdmin) {
            if (String(existingSociety.admin) !== String(user._id)) {
                return sendResponse(res, 403, "You are not authorized to update this society");
            }
        }

        if (formData.name) { formData.name = formData.name.trim(); }
        if (formData.registrationNumber) {
            formData.registrationNumber = formData.registrationNumber.trim();

            const regExists = await Society.findOne({
                registrationNumber: formData.registrationNumber,
                _id: { $ne: id },
            });

            if (regExists) {
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
            const adminAssigned = await Society.findOne({
                admin: formData.admin,
                _id: { $ne: id },
            });

            if (adminAssigned) {
                return sendResponse(res, 400, "Admin already assigned to another society");
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
        );

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

        if (user?.role !== superAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        // 👉 Step 1: Get the society first (to know the admin)
        const society = await Society.findById(id);

        if (!society) {
            return sendResponse(res, 404, "Society not found or already deleted.");
        }
        const societyId = society._id;
        if (societyId) {
            // 👉 Step 2: Delete the society
            await Society.findByIdAndDelete(societyId);

            // 👉 Step 3: Delete the society members (only if exists)
            await User.deleteMany({ society: societyId });
        }

        return sendResponse(
            res,
            200,
            "Society, admin, and all members are deleted successfully!",
            null
        );

    } catch (error: any) {
        console.log("Error in deleteSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// add a member to a society
export const addMemberToSociety = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        let { username, email, password } = req.body;

        // only society admin can add members
        if (currentUser?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        // find society of admin
        const society = await Society.findById(currentUser.society);
        if (!society) {
            return sendResponse(res, 404, "Society not found or deleted.");
        }

        // STEP 1 — Create User with Util
        let newUser;
        try {
            newUser = await createUser({
                email,
                username,
                password,
                society: society?._id
            });
        } catch (err: any) {
            return sendResponse(res, 400, err.message);
        }

        // STEP 2 — Add user to society.members
        try {
            society.members.push(newUser._id as Schema.Types.ObjectId);
            await society.save();
        } catch (err) {
            console.log("❌ Society update failed. Rolling back user...");

            await User.findByIdAndDelete(newUser._id);
            return sendResponse(res, 500, "Failed to link user to society. Operation rolled back.");
        }

        return sendResponse(res, 201, "Member added successfully.", newUser);

    } catch (error: any) {
        console.error("Add Member Error:", error.message);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

// remove a member from a society
export const removeMemberFromSociety = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { member_id } = req.body;
        const society_id = currentUser?.society;

        // 🔐 Role check
        if (currentUser?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        // 🏢 Check society exists
        const society = await Society.findById(society_id);
        if (!society) {
            return sendResponse(res, 404, "Society not found or deleted.");
        }

        // Check member exists
        const member = await User.findOne({ _id: member_id, isActive: true });
        if (!member) {
            return sendResponse(res, 404, "Member not found or deleted.");
        }

        if (member.role === societyAdmin) {
            return sendResponse(res, 400, "Society admin cannot be removed from society.");
        }

        // Ensure member actually belongs to this society
        if (!member.society || String(member.society) !== String(society._id)) {
            return sendResponse(res, 400, "This member does not belong to this society.");
        }

        // delete user
        await User.findByIdAndDelete(member_id);

        // Remove member from society array (more reliable than .pull())
        await Society.updateOne(
            { _id: society_id },
            { $pull: { members: member._id } }
        );

        return sendResponse(res, 204, "Member removed from society successfully", member);
    } catch (error: any) {
        console.log("Error in removeMemberFromSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// fetch all members of a society
export const getAllMembersOfSociety = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const society_id = user?.society;

        // 🔐 Role check
        if (user?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        // 🏢 Check society exists
        const society = await Society.findById(society_id);

        // 🛑 Extra check → Society Admin must belong to same society
        if (user?.role === societyAdmin) {
            if (String(society?.admin) !== String(user._id)) {
                return sendResponse(res, 403, "You are not authorized to update this society");
            }
        }

        if (!society) {
            return sendResponse(res, 404, "Society not found or deleted.");
        }

        // 👤 Fetch members
        const members = await User.find({ society: society._id });
        return sendResponse(res, 200, "Members fetched successfully", members);
    } catch (error: any) {
        console.log("Error in getAllMembersOfSociety: ", error);
        return sendResponse(res, 500, error.message);
    }
};
