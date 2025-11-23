import mongoose, { Schema } from 'mongoose';

import { IComplaint } from '../types/complaint';
import { ComplaintSchemaName, UserSchemaName, SocietySchemaName } from './modelNames';

const complaintSchema = new Schema<IComplaint>({
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
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: String,
        enum: ["pending", "resolved"],
        default: "pending"
    }
}, { timestamps: true });

const Complaint = mongoose.model<IComplaint>(ComplaintSchemaName, complaintSchema);
export default Complaint;
