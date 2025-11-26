import multer from "multer";
import cloudinary from "../config/cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        public_id: (req, file) => `${file.fieldname}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    },

});

export const uploadPaymentProof = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024,
        files: 1
    },
    fileFilter: (req, file, cb) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG, PNG, JPG, WEBP, and GIF files are allowed"));
        }
    },
});
