import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
    memberId: mongoose.Types.ObjectId;
    societyId: mongoose.Types.ObjectId;
    title: string;
    description: string;
    media: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}