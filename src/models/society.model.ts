import mongoose, { Schema } from "mongoose";

import User from "./user.model";
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
    members: [{
        type: Schema.Types.ObjectId,
        ref: UserSchemaName,
    }],
    totalMembers: {
        type: Number,
        default: 0,
    },
});

societySchema.pre("save", async function (next) {
    // update total members
    this.members = await User.find({ society: this._id }).select("_id");
    this.totalMembers = this.members.length;
    next();
});

societySchema.pre("updateOne", async function (next) {
    // update total members
    this.updateOne({ totalMembers: await User.countDocuments({ society: this.getFilter()._id }) });
    next();
});

const Society = mongoose.model(SocietySchemaName, societySchema);
export default Society;
