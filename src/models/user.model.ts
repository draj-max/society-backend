import mongoose, { Schema } from "mongoose";

import { IUser } from "../types/user";
import { user, superAdmin, societyAdmin } from "../config";
import { SocietySchemaName, UserSchemaName } from "./modelNames";

const UserSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    role: {
        type: String,
        enum: [user, superAdmin, societyAdmin],
        default: user
    },
    phone: {
        type: Number,
    },
    society: {
        type: Schema.Types.ObjectId,
        ref: SocietySchemaName,
    },
    roomNo: {
        type: Number,
    },
    chawlFlatNo: {
        type: String,
    },
    isOwner: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },

}, { timestamps: true });


const User = mongoose.model(UserSchemaName, UserSchema);
export default User;
