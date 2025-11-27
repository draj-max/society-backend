import cloudinary from "../config/cloudinary";

async function uploadFile(filePath: string): Promise<any> {
    try {
        const result = await cloudinary.uploader.upload(filePath);
        console.log("Result of cloudinary upload: ", result);

        return result;
    } catch (error) {
        console.error('Error uploading image to Cloudinary:', error);
        throw error;
    }
}

export { uploadFile };