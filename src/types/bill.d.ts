import { Document, Schema } from "mongoose";

export interface IBill extends Document {
    memberId: Schema.Types.ObjectId;
    societyId: Schema.Types.ObjectId;
    category: string;
    totalAmount: number;
    paidAmount: number;
    dueDate: Date;
    status: string;
    paidDate: Date;
    photo: string;
};

