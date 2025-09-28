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

export { uploadOnCloudinary }