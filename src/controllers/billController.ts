import { Request, Response } from "express";

import Bill from "../models/bill.model";
import User from "../models/user.model";
import { member, societyAdmin } from "../config";
import sendResponse from "../utils/sendResponse";

export const createBill = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const societyId = user?.society;
        let { memberId, category, totalAmount, dueDate } = req.body;

        // sanitize inputs
        memberId = memberId?.trim();
        category = category?.trim();
        dueDate = dueDate?.trim();

        const isMember = await User.findOne({ _id: memberId, society: societyId });
        if (!isMember) {
            return sendResponse(res, 404, "No member found for this id under your society.");
        }

        const newBill = new Bill({
            societyId,
            memberId,
            category,
            totalAmount,
            dueDate,
        });
        await newBill.save();

        return sendResponse(res, 201, "Bill created successfully.", newBill);
    } catch (error: any) {
        console.log("Error in createBill: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// update a bill by id
export const updateBill = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        if (currentUser?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const { id } = req.params;
        const formData = req.body;

        const bill = await Bill.findById(id);
        if (!bill) {
            return sendResponse(res, 404, "No bill found for this id.");
        }
        if (String(bill.societyId) !== String(currentUser?.society)) {
            return sendResponse(res, 403, "This bill is not found under your society members.");
        }

        if (formData.category) { formData.category = formData.category.trim(); }
        if (formData.totalAmount) { formData.totalAmount = Number(formData.totalAmount); }
        if (formData.dueDate) { formData.dueDate = formData.dueDate.trim(); }
        if (formData.paidDate) { formData.paidDate = formData.paidDate.trim(); }
        if (formData.paidAmount) { formData.paidAmount = Number(formData.paidAmount); }
        if (formData.status) { formData.status = formData.status.trim(); }

        const updatedBill = await Bill.findByIdAndUpdate(id, formData, { new: true });
        if (!updatedBill) {
            return sendResponse(res, 404, "No bills found to update.");
        }
        return sendResponse(res, 200, "Bill updated successfully.", updatedBill);
    } catch (error: any) {
        console.log("Error in updateBill: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// get all bills by society id
export const getBillsBySocietyId = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        if (user?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }
        const societyId = user?.society;
        if (!societyId) {
            return sendResponse(res, 404, "Society not found.");
        }

        const bills = await Bill.find({ societyId }).lean();
        return sendResponse(res, 200, 'Bills retrieved successfully.', bills);
    } catch (error: any) {
        console.log("Error in getBillsBySocietyId: ", error);
        return sendResponse(res, 500, error.message);
    }
};

// fetch all bills by member id
export const getBillsByMemberId = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const memberId = req.body.id || currentUser?._id;
        const societyId = currentUser?.society;

        if (!memberId || !societyId) {
            return sendResponse(res, 400, "Member or society not found.");
        }

        const targetUser = await User.findById(memberId);
        if (!targetUser || !targetUser.society) {
            return sendResponse(res, 404, "Member not found.");
        }

        const isSelf = String(currentUser._id) === String(targetUser._id);

        if (currentUser.role === societyAdmin) {
            if (targetUser.society.toString() !== societyId.toString()) {
                return sendResponse(res, 403, "You cannot access bills of another society.");
            }
        }
        else if (currentUser.role === member && !isSelf) {
            return sendResponse(res, 403, "Members can only view their own bills.");
        }
        let status: any = {};
        if (req.query.status) {
            status = { status: req.query.status };
        }

        const bills = await Bill.find({
            memberId,
            societyId,
            ...status
        }).lean();

        return sendResponse(res, 200, "Bills retrieved successfully", bills);

    } catch (error: any) {
        console.log("Error in getBillsByMemberId:", error);
        return sendResponse(res, 500, error.message);
    }
};

// pay bill by id
export const payBill = async (req: Request, res: Response) => {
    try {
        const user = req.user;
        const memberId = user?._id;
        const societyId = user?.society;

        const { id } = req.body;

        if (!memberId || !societyId) {
            return sendResponse(res, 404, "Member or society not found.");
        }

        const bill = await Bill.findById(id);
        if (!bill) {
            return sendResponse(res, 404, "No bill found for this id.");
        }

        if (String(bill.memberId) !== String(memberId)) {
            return sendResponse(res, 404, "Bill is not found for your given id.");
        }

        if (String(bill.societyId) !== String(societyId)) {
            return sendResponse(res, 404, "Bill is not found for your given id.");
        }

        if (bill.status === "paid") {
            return sendResponse(res, 403, "Bill is already paid.");
        }

        const updatedBill = await Bill.findByIdAndUpdate(id, {
            status: "paid",
            paidAmount: bill.totalAmount,
            paidDate: new Date(),
        }, { new: true });

        if (!updatedBill) {
            return sendResponse(res, 404, "No bills found to update.");
        }

        return sendResponse(res, 200, "Bill paid successfully.", updatedBill);
    } catch (error: any) {
        console.log("Error in payBill: ", error);
        return sendResponse(res, 500, error.message);
    }
};
