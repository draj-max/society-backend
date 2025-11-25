import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import logger from '../utils/logger';
import User from '../models/user.model';
import sendResponse from '../utils/sendResponse';
import { bcryptSaltRounds, societyAdmin, superAdmin } from '../config';

// my profile
export const myProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        return sendResponse(res, 200, "Your profile details.", user);
    } catch (error: any) {
        console.error("Me Error:", error);
        return sendResponse(res, 500, `Internal Server Error: ${error.message}`);
    }
};

// update my profile
export const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        let formData = req.body;

        if (formData.password) {
            return sendResponse(res, 400, "Password cannot be updated here");
        }
        if (formData.username) {
            formData.username = formData.username.trim();
        }
        if (formData.email) {
            formData.email = formData.email.trim();
        }
        if (formData.phone) {
            if (formData.phone.toString().length !== 10) {
                return sendResponse(res, 400, "Phone number must be 10 digits.");
            }
            formData.phone = Number(formData.phone);
        }

        const updatedUser: any = await User.findByIdAndUpdate(
            user?._id,
            formData,
            { new: true }
        ).lean();
        return sendResponse(res, 200, 'User updated successfully', {
            updatedAt: updatedUser?.updatedAt,
        });
    } catch (error: any) {
        logger.error(`Error in updateProfile: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

// deactive user
export const deactiveUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        if (currentUser && currentUser.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        // targeted user
        const targetUser = await User.findOne({
            _id: id,
            isActive: true,
            society: currentUser?.society
        });
        if (!targetUser) {
            return sendResponse(res, 404, "User not found under your society or already deactived.");
        }

        await User.findByIdAndUpdate(id, { isActive: false });
        return sendResponse(res, 200, 'User deactived successfully', { username: targetUser?.username });
    } catch (error: any) {
        logger.error(`Error in deactiveUser: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

// reactive user
export const reactiveUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const currentUser = req.user;

        if (currentUser && currentUser.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const targetUser = await User.findOneAndUpdate({
            _id: id,
            isActive: false,
            society: currentUser?.society
        });

        if (!targetUser) {
            return sendResponse(res, 404, "User not found under your society or already reactive.");
        }

        await User.findByIdAndUpdate(id, { isActive: true });
        return sendResponse(res, 200, 'User reactive successfully', { username: targetUser?.username });
    } catch (error: any) {
        logger.error(`Error in reactiveUser: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

// update user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        let formData = req.body;
        const { id } = req.params;

        if (!formData || !id) {
            return sendResponse(res, 400, "id is required to update user");
        }
        if (user && user.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        if (formData.email) {
            formData.email = formData.email.trim();
            const existingEmailUser = await User.findOne({ email: formData.email, _id: { $ne: id } });
            if (existingEmailUser) {
                return sendResponse(res, 400, "Email is already taken by another user");
            }
        }

        if (formData.username) {
            formData.username = formData.username.trim();
            const existingUsernameUser = await User.findOne({ username: formData.username, _id: { $ne: id } });
            if (existingUsernameUser) {
                return sendResponse(res, 400, "Username is already taken by another user");
            }
        }

        if (formData.role) { formData.role = formData.role.trim(); }
        if (formData.phone) { formData.phone = Number(formData.phone); }

        if (formData.roomNo) { formData.roomNo = Number(formData.roomNo); }
        if (formData.chawlFlatNo) { formData.chawlFlatNo = formData.chawlFlatNo.trim(); }
        if (formData.isOwner) { formData.isOwner = Boolean(formData.isOwner); }

        if ([superAdmin, societyAdmin].includes(formData.role)) {
            return sendResponse(res, 400, "Can not set role to superAdmin or societyAdmin");
        }

        const exitUser = await User.findById(id);
        if (!exitUser) {
            return sendResponse(res, 404, "User not found.");
        }

        const updatedData = {
            username: formData.username ?? exitUser.username,
            role: formData.role ?? exitUser.role,
            email: formData.email ?? exitUser.email,
            phone: formData.phone ?? exitUser.phone,
            roomNo: formData.roomNo ?? exitUser.roomNo,
            chawlFlatNo: formData.chawlFlatNo ?? exitUser.chawlFlatNo,
            isOwner: formData.isOwner ?? exitUser.isOwner,
        };

        const updatedUser = await User.findByIdAndUpdate(id, updatedData, { new: true });
        if (!updatedUser) {
            return sendResponse(res, 404, "User not found.");
        }

        return sendResponse(res, 200, 'User updated successfully', updatedUser);
    } catch (error: any) {
        logger.error(`Error in updateUser: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

// reset user password
export const resetUserPassword = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        let { password, id } = req.body;

        password = password.trim();
        const targetUser = await User.findById(id);

        if (!targetUser) {
            return sendResponse(res, 404, "Target user not found.");
        }

        const isSelf = String(currentUser?._id) === String(targetUser?._id);

        if (isSelf) { console.log("You are reseting your own password."); }
        else if (currentUser?.role === superAdmin) { console.log("Superadmin is reseting anyone's password."); }
        else if (currentUser?.role === societyAdmin) {
            // console.log("Societyadmin is reseting anyone's password.");
            if (currentUser?.society.toString() !== targetUser?.society?.toString()) {
                // console.log("You can only reset passwords of users inside your society.");
                return sendResponse(
                    res,
                    403,
                    "You can only reset passwords of users inside your society."
                );
            }
        }
        else {
            return sendResponse(res, 403, "You are not allowed to reset this password.");
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(password, bcryptSaltRounds);

        // Update password
        await User.findByIdAndUpdate(
            id,
            { password: hashedPassword },
            { new: true }
        );

        return sendResponse(res, 200, "User password updated successfully", null);
    } catch (error: any) {
        logger.error(`Error in resetUserPassword: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};
