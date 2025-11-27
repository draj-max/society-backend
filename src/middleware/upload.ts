import multer, { diskStorage } from "multer";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp", "image/gif"];

const uploadImage = multer({

    storage: diskStorage({
        filename: (req, file, cb) => {
            cb(null, `${file.fieldname}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
        },
    }),

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

export default uploadImage;