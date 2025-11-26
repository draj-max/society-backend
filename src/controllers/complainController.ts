import { Request, Response } from "express";

import { societyAdmin } from "../config";
import Complaint from "../models/complaint.model";
import sendResponse from "../utils/sendResponse";

export const getComplaints = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { status } = req.query;

        if (currentUser?.role !== societyAdmin) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        const societyId = currentUser?.society;
        if (!societyId) {
            return sendResponse(res, 404, "Society not found.");
        }

        let filter: any = { societyId };
        if (status) {
            filter.status = status.toString();
        }

        const complaints = await Complaint.find(filter).lean();

        if (!complaints || complaints.length === 0) {
            return sendResponse(res, 404, "No complaints found.");
        }

        return sendResponse(res, 200, 'Complaints retrieved successfully.', complaints);
    } catch (error: any) {
        console.log("Error in getComplaints: ", error);
        return sendResponse(res, 500, error.message);
    }
};


export const createComplaint = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { title, description } = req.body;

        if (!currentUser) {
            return sendResponse(res, 401, "Unauthorized");
        }
        const societyId = currentUser.society;
        const memberId = currentUser._id;

        if (!societyId || !memberId) {
            return sendResponse(res, 404, "Society or Member not found.");
        }

        if (!req.file) {
            return sendResponse(res, 400, "Complain proof image is required.");
        }
        const fileData: any = req.file;

        const complaint = await Complaint.create({
            memberId,
            societyId,
            title,
            description,
            media: fileData.path
        });
        return sendResponse(res, 201, "Complaint created successfully.", complaint);
    } catch (error: any) {
        console.log("Error in createComplaint: ", error);
        return sendResponse(res, 500, error.message);
    }
};


//member complaints
export const getMemberComplaints = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { status } = req.query;

        if (!currentUser) {
            return sendResponse(res, 401, "Unauthorized");
        }
        const societyId = currentUser.society;
        const memberId = currentUser._id;

        if (!societyId || !memberId) {
            return sendResponse(res, 404, "Society or Member not found.");
        }

        let filter: any = { memberId };
        if (status) {
            filter.status = status.toString();
        }

        const complaints = await Complaint.find(filter).lean();

        if (!complaints || complaints.length === 0) {
            return sendResponse(res, 404, "No complaints found.");
        }

        return sendResponse(res, 200, 'Complaints retrieved successfully.', complaints);
    } catch (error: any) {
        console.log("Error in getMemberComplaints: ", error);
        return sendResponse(res, 500, error.message);
    }
};


export const resolve_forward_Complaints = async (req: Request, res: Response) => {
    try {
        const currentUser = req.user;
        const { complaintId, status } = req.body;

        if (!currentUser || currentUser.role !== societyAdmin) {
            return sendResponse(res, 401, "Unauthorized ");
        }

        const complaint = await Complaint.findById(complaintId).lean();
        if (!complaint) {
            return sendResponse(res, 404, "No complaints found.");
        }

        if (String(complaint?.societyId) !== String(currentUser?.society)) {
            return sendResponse(res, 403, "Unauthorized to access this resource");
        }

        if (complaint.status !== "raised") {
            return sendResponse(res, 400, `Complaint is not in raised status. Current status: ${complaint.status}`);
        }

        const updatedComplaint = await Complaint.findByIdAndUpdate(complaintId, { status }, { new: true });

        return sendResponse(res, 200, `Complaint ${status} successfully.`, updatedComplaint);
    } catch (error: any) {
        console.log("Error in resolve_forward_Complaints: ", error);
        return sendResponse(res, 500, error.message);
    }
};