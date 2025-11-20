import mongoose, { Document, Schema } from "mongoose";
import { SocietySchemaName, UserSchemaName } from "./modelNames";

interface ISociety extends Document {
    name: string;
    registrationNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    admin: Schema.Types.ObjectId;
}

const societySchema = new Schema<ISociety>({
    name: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    admin: {
        type: Schema.Types.ObjectId,
        ref: UserSchemaName,
        required: true,
    },
});

const Society = mongoose.models[SocietySchemaName] || mongoose.model(SocietySchemaName, societySchema);
export default Society;
