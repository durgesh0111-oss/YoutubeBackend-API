import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { User } from "../models/user.models.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
import path from 'path'


const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = await user.generateAccessToken()
        const refreshToken = await user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({validateBeforeSave:false})
        return { accessToken, refreshToken }
        
    } catch (err) {
        console.error("Token Generation Error:", err);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}



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
            field?.trim() === "" 
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
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "avatar is required");

    }
    let coverImageLocalPath;
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files?.coverImage[0]?.path
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


const loginUser = asyncHandler(async (req, res) => {
    
    // get email or username with password from front end
    //then velidate if any filed is empty or not
    //then check if user exist in db
    //if user exist check password is password correct 
    //generate access tocken and refresh token 
    //send cookie
    
    const { email, username, password } = req.body;
    if ((!username && !email) || !password) { 
        throw new ApiError(400, "Username or email, and password are required.");
    }

    const user = await User.findOne({
        $or: [
            { username: username?.toLowerCase() },
            { email: email?.toLowerCase() }
        ]
    });
    if (!user) {
        throw new ApiError(404,"user not found")
    }

    const isPassValid = await user.isPasswordCorrect(password)
    if (!isPassValid) {
        throw new ApiError(401, "Invalid user credentials")
    }

    const {accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
        
    }
    res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user:loggedUser,accessToken,refreshToken
                },
                "User logged In Successfully"
             )
        )





})

const logoutUser = asyncHandler(async (req, res) => {
    // 1. Clear the refresh token from the database
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined 
            },
        },
        {
            new: true
        }
    );

    //  Define cookie options
    const options = {
        httpOnly: true,
        secure: true, 
        expires: new Date(0)
    };

    //  Clear cookies and send response
    return res
        .status(200)
        // Set cookies to null/empty with an immediate expiry to clear them
        .cookie("accessToken", "", options)
        .cookie("refreshToken", "", options)
        .json(new apiResponse(200, {}, "User logged out successfully"));
});

export {

    registerUser,
    loginUser,
    logoutUser
    
}