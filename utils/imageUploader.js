// ES Module syntax
import { v2 as cloudinary } from "cloudinary";

export const uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder };
    
    if (height) {
        options.height = height;
    }
    if (quality) {
        options.quality = quality;
    }

    options.resource_type = "auto";

    try {
        const result = await cloudinary.uploader.upload(file.tempFilePath, options);
        return result;
    } catch (error) {
        console.error("❌ Cloudinary Upload Error:", error);
        throw error; // Optional: re-throw to handle in controller
    }
};
