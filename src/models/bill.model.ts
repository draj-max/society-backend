import mongoose, { Schema } from "mongoose";

import { IBill } from "../types/bill";
import { billCategories, billStatus } from "../config";
import { BillSchemaName, UserSchemaName, SocietySchemaName } from "./modelNames";

const BillSchema = new Schema<IBill>({
    memberId: {
        type: Schema.Types.ObjectId,
        ref: UserSchemaName,
        required: true
    },
    societyId: {
        type: Schema.Types.ObjectId,
        ref: SocietySchemaName,
        required: true
    },
    category: {
        type: String,
        enum: billCategories,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    paidAmount: {
        type: Number,
        default: 0
    },
    pendingAmount: {
        type: Number,
        default: 0
    },
    dueDate: {
        type: Date,
        required: true
    },
    paidDate: {
        type: Date,
    },
    status: {
        type: String,
        enum: billStatus,
        default: billStatus[0]
    },
    paymentProof: {
        url: {
            type: String,
        },
        uploadedAt: {
            type: Date,
        }
    },
}, { timestamps: true });

const Bill = mongoose.model(BillSchemaName, BillSchema);
export default Bill;
