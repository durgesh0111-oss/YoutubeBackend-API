
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { Video } from "../models/video.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import path from 'path';

const uploadVideo = asyncHandler(async (req, res) => {
    
    const videoLocalPath = req.files?.video?.[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

   
    const { title, description, duration } = req.body;

   

    if (!title || !description || !duration) {
        throw new ApiError(400, "Title, description, and duration are required.");
    }

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is missing.");
    }

    

    // Convert to absolute paths
    const absoluteVideoPath = path.resolve(videoLocalPath);
    const absoluteThumbnailPath = thumbnailLocalPath ? path.resolve(thumbnailLocalPath) : null;

    // Upload main video file
    const videoUpload = await uploadOnCloudinary(absoluteVideoPath);

    if (!videoUpload) {
        throw new ApiError(500, "Video file upload failed on Cloudinary.");
    }

    // Upload thumbnail (optional)
    let thumbnailUpload = { url: "" };
    if (absoluteThumbnailPath) {
        thumbnailUpload = await uploadOnCloudinary(absoluteThumbnailPath);
    }

    if (absoluteThumbnailPath && !thumbnailUpload) {
        throw new ApiError(500, "Thumbnail upload failed on Cloudinary.");
    }

    

    const newVideo = await Video.create({
        title,
        description,
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        duration: duration,
        views: 0,
        isPublished: true,
        owner: req.user._id,
    });

    if (!newVideo) {
        throw new ApiError(500, "Video creation failed in database.");
    }

    

    return res.status(201).json({
        message: "Video uploaded successfully",
        video: newVideo
    });
});