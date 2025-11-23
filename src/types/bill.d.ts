import { Document, Schema } from "mongoose";

export interface IBill extends Document {
    residentId: Schema.Types.ObjectId;
    societyId: Schema.Types.ObjectId;
    category: string;
    amount: number;
    dueDate: Date;
    status: string;
    createdAt: Date;
    updatedAt: Date;
};

