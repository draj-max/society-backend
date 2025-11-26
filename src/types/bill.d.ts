import { Document, Schema } from "mongoose";

export interface IBill extends Document {
    memberId: Schema.Types.ObjectId;
    societyId: Schema.Types.ObjectId;
    category: string;
    totalAmount: number;
    paidAmount: number;
    pendingAmount: number;
    dueDate: Date;
    status: string;
    paidDate: Date;
    paymentProof: {
        url: string | null;
        uploadedAt: Date | null;
    };
};

