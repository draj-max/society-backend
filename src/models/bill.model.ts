import mongoose, { Schema } from "mongoose";

import { IBill } from "../types/bill";
import { billCategories, billStatus } from "../config";
import { BillSchemaName, UserSchemaName, SocietySchemaName } from "./modelNames";

const BillSchema = new Schema<IBill>({
    residentId: {
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
    amount: {
        type: Number,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: billStatus,
        default: billStatus[0]
    },
}, { timestamps: true });

const Bill = mongoose.model(BillSchemaName, BillSchema);
export default Bill;
