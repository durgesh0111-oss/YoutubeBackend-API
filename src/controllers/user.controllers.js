import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import path from 'path'
const registerUser = asyncHandler(async (req, res) => {
    // console.log(req.body);

    // user send their details
    //upload avatar and profileimage 
    //validation
    // check user alreay exist
    //check for images and avatar
    //upload then to cloudnary
    //check avatar upload sucessfully
    //create user object 
    //remove password and refresh token filed from res
    //check for user creation then return res
    
    const { fullName, email, username, password } = req.body
    // console.log(email)
  
    const fields = [fullName, email, username, password];

    if (
        fields.some((field) =>
            field?.trim() === "" // Returns true if field is NOT null/undefined AND is empty after trimming
        )
    ) {
        // Logic to handle missing fields (e.g., throw an error)
        throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
        $or: [{username},{email}]
    })
    if (existingUser) {
        throw new ApiError(409, "user already exist");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required");

    }

    const absoluteAvatarPath = path.resolve(avatarLocalPath);
    const absoluteCoverImagePath = coverImageLocalPath ? path.resolve(coverImageLocalPath) : null;
    
    const avatar = await uploadOnCloudinary(absoluteAvatarPath)
    const coverImage = await uploadOnCloudinary(absoluteCoverImagePath)


    if (!avatar) {
        throw new ApiError(400, "avatar is not uploaded");
    }

    const user = await User.create({
        fullName,
        username,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username:username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user");
    }
    return res.status(201).json(
       new apiResponse(200,createdUser,"User registered successfully")
   )
})

export default registerUser