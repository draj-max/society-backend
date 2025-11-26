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

        const societyId = currentUser?.society;
        const memberId = req.query?.id || currentUser?._id;

        if (!memberId || !societyId) {
            return sendResponse(res, 400, "Member or society not found.");
        }

        const targetUser: any = await User.findById(memberId).lean();
        if (!targetUser) {
            return sendResponse(res, 404, "Member not found.");
        }

        const isSelf = String(currentUser._id) === String(targetUser._id);

        if (currentUser.role === "societyAdmin") {
            if (String(targetUser.society) !== String(societyId)) {
                return sendResponse(res, 403, "You cannot access bills of another society.");
            }
        } else if (currentUser.role === "member" && !isSelf) {
            return sendResponse(res, 403, "Members can only view their own bills.");
        } else if (!["societyAdmin", "member"].includes(currentUser.role)) {
            return sendResponse(res, 403, "Unauthorized role access.");
        }

        const filter: any = {
            memberId,
            societyId
        };

        if (req.query.status && typeof req.query.status === "string") {
            filter.status = req.query.status;
        }

        const bills = await Bill.find(filter).lean();

        if (!bills || bills.length === 0) {
            return sendResponse(res, 404, "No bills found for this member.");
        }

        return sendResponse(res, 200, "Bills retrieved successfully", bills);

    } catch (error: any) {
        console.error("Error in getBillsByMemberId:", error);
        return sendResponse(res, 500, `Something went wrong while fetching bills: ${error.message}`);
    }
};

// pay bill by id
export const payBill = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;
        const currentUser = req.user;

        if (!id) {
            return sendResponse(res, 400, "Bill ID is required");
        }


        if (!currentUser || currentUser?.role !== member) {
            return sendResponse(res, 403, "Only members are allowed to pay bills");
        }

        const memberId = currentUser._id;
        const societyId = currentUser.society;

        if (!memberId || !societyId) {
            return sendResponse(res, 400, "Member or society not found");
        }

        const bill = await Bill.findById(id);
        if (!bill) {
            return sendResponse(res, 404, "Bill not found");
        }

        const checkIsMyBill = (String(bill.memberId) !== String(memberId)) || (String(bill.societyId) !== String(societyId));
        if (checkIsMyBill) {
            return sendResponse(res, 403, "You are not authorized to pay this bill");
        }

        if (bill.status === "paid") {
            return sendResponse(res, 409, "This bill is already paid");
        }
        if (bill.status === "pending") {
            return sendResponse(res, 409, "This bill is already pending for approval");
        }

        if (!req.file) {
            return sendResponse(res, 400, "Payment proof image is required.");
        }
        const fileData: any = req.file;

        const updatedBill = await Bill.findByIdAndUpdate(id, {
            status: "pending",
            paidDate: new Date(),
            paymentProof: {
                url: fileData?.path,
                uploadedAt: new Date(),
            },
        }, { new: true });

        return sendResponse(
            res,
            200,
            "Payment proof uploaded. Awaiting admin approval.",
            updatedBill
        );
    } catch (error: any) {
        console.error("Error in payBill:", error);
        return sendResponse(res, 500, error.message);
    }
};

// approve the bill payment by admin society
export const approve_reject_BillPayment = async (req: Request, res: Response) => {
    try {
        const { id, amount, status } = req.body;
        const currentUser = req.user;

        if (!currentUser || currentUser?.role !== societyAdmin) {
            return sendResponse(res, 403, "Only admin society are allowed to approve bills");
        }

        if (!["paid", "unpaid"].includes(status)) {
            return sendResponse(res, 400, "Invalid status");
        }

        const bill = await Bill.findById(id);
        if (!bill) {
            return sendResponse(res, 404, "Bill not found");
        }
        if (bill.status !== "pending") {
            return sendResponse(res, 400, `This bill is already ${bill.status}`);
        }

        if (String(bill.societyId) !== String(currentUser.society)) {
            return sendResponse(res, 403, "You are not authorized to approve this bill");
        }

        if (amount > bill.totalAmount) {
            return sendResponse(res, 400, "Amount is greater than total amount");
        }
        const pendingAmount = bill.totalAmount - amount;
        if (pendingAmount < 0) {
            return sendResponse(res, 400, "Amount is greater than total amount");
        }

        const updatedBill = await Bill.findByIdAndUpdate(id, {
            status: status,
            paidAmount: amount,
            pendingAmount,
        }, { new: true });

        return sendResponse(
            res,
            200,
            `Bill payment ${status} successfully.`,
            updatedBill
        );
    } catch (error: any) {
        console.error("Error in approveBillPayment:", error);
        return sendResponse(res, 500, error.message);
    }
};
