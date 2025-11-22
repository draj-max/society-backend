import mongoose, { Schema } from "mongoose";

import { ISociety } from "../types/society";
import { SocietySchemaName, UserSchemaName } from "./modelNames";

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

const Society = mongoose.model(SocietySchemaName, societySchema);
export default Society;
