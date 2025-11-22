import mongoose, { Document, Schema } from "mongoose";

export interface ISociety extends Document {
    name: string;
    registrationNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    admin: Schema.Types.ObjectId;
};
