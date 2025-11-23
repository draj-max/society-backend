import bcrypt from 'bcrypt';
import { Request, Response } from 'express';

import logger from '../utils/logger';
import User from '../models/user.model';
import sendResponse from '../utils/sendResponse';
import { bcryptSaltRounds, societyAdmin, superAdmin } from '../config';

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const users = await User.find({}).lean();
        return sendResponse(res, 200, 'Users retrieved successfully', users);
    } catch (error: any) {
        logger.error(`Error in getUsers: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

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
        const user = req.user;
        if (user && user.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        console.log(req.params.id);
        console.log(
            await User.findOne({ _id: req.params.id }).lean()
        );

        const deactivedUser: any = await User.findOneAndUpdate(
            { _id: req.params.id, isActive: true },
            { isActive: false },
            { new: true }
        ).lean();

        if (!deactivedUser) {
            return sendResponse(res, 404, "User not found or already deactived.");
        }

        return sendResponse(res, 200, 'User deactived successfully', { username: deactivedUser?.username });
    } catch (error: any) {
        logger.error(`Error in deactiveUser: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};

// reactive user
export const reactiveUser = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user && user.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const reactiveUser: any = await User.findOneAndUpdate(
            { _id: req.params.id, isActive: false },
            { isActive: true },
            { new: true }
        ).lean();

        if (!reactiveUser) {
            return sendResponse(res, 404, "User not found or already reactive.");
        }

        return sendResponse(res, 200, 'User reactive successfully', { username: reactiveUser?.username });
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
        if (formData.society) { formData.society = formData.society.trim(); }
        if (formData.phone) { formData.phone = Number(formData.phone); }

        if (formData.roomNo) { formData.roomNo = Number(formData.roomNo); }
        if (formData.chawlFlatNo) { formData.chawlFlatNo = formData.chawlFlatNo.trim(); }
        if (formData.isOwner) { formData.isOwner = Boolean(formData.isOwner); }

        if (formData.role === superAdmin) {
            return sendResponse(res, 400, "Can not set role to superAdmin");
        }

        const exitUser = await User.findById(id);
        if (!exitUser) {
            return sendResponse(res, 404, "User not found.");
        }

        const updatedData = {
            username: formData.username ?? exitUser.username,
            role: formData.role ?? exitUser.role,
            email: formData.email ?? exitUser.email,
            society: formData.society ?? exitUser.society,
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
        let { password, id } = req.body;
        password = password.trim();

        if (!password) {
            return sendResponse(res, 400, "Password is required");
        }
        const hashPassword = await bcrypt.hash(password, bcryptSaltRounds);

        const updatedUser: any = await User.findByIdAndUpdate(id, { password: hashPassword }, { new: true });

        if (!updatedUser) {
            return sendResponse(res, 404, "User not found.");
        }

        return sendResponse(res, 200, 'User password updated successfully', null);
    } catch (error: any) {
        logger.error(`Error in resetUserPassword: ${error.message}`);
        return sendResponse(res, 500, error.message);
    }
};
