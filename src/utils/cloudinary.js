import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;
        console.log(localFilePath)

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("file is uploaded on cloudinary : ", response.url);
        fs.unlinkSync(localFilePath)
        return response;

    } catch (err) {
        console.error("CLOUDINARY UPLOAD FAILED. API Error Details:", err);
        fs.unlinkSync(localFilePath)
        return null;
    }
}
//delete old image from cloudinary
const deleteOldImage = async (imageUrl) => {
    try {
        if (!imageUrl) return;

        // Regex to find the full public ID path (including folders)
        const publicIdMatch = imageUrl.match(/\/v\d+\/(.+?)\.\w+$/);

        if (!publicIdMatch || publicIdMatch.length < 2) {
            console.warn("Could not extract public ID from URL for deletion:", imageUrl);
            return;
        }

        const publicId = publicIdMatch[1];

        await cloudinary.uploader.destroy(publicId);
        console.log(`Cloudinary deletion successful for public ID: ${publicId}`);

    } catch (err) {
        console.error("Error deleting old image from Cloudinary:", err);
    }
};
export { uploadOnCloudinary,deleteOldImage }