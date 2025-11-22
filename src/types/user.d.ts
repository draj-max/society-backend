import { Document, Schema } from "mongoose";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    phone: number;
    roomNo: number;
    chawlFlatNo: string;
    isOwner: boolean;
    society: Schema.Types.ObjectId;
    isActive: boolean;
};
