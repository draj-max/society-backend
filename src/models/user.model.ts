import mongoose, { Document, Schema } from "mongoose";
import { SocietySchemaName, UserSchemaName } from "./modelNames";

interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    phone: number;
    roomNo: number;
    chawlNo: string;
    isOwner: boolean;
    society: Schema.Types.ObjectId;
}

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
        enum: ['user', 'admin'],
        default: 'user'
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
    chawlNo: {
        type: String,
    },
    isOwner: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });


const User = mongoose.models[UserSchemaName] || mongoose.model(UserSchemaName, UserSchema);
export default User;
