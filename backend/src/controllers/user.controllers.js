import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        500,
        "Error user not found while generating the access and refresh token"
      );
    }
  
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Error while generating the access and refresh token"
    );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  //TODO
  console.log("starting registration");
  console.log(req.body);
  const { fullname, email, password } = req.body;

  //validation
  if (
    [fullname, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const existedUser = await User.findOne({
    $or: [{ email }],
  });

  if (existedUser) {
    throw new ApiError(409, "User with email already exists");
  }

  // console.warn(req.files);
  // const avatarLocalPath = req.files?.avatar?.[0]?.path;

  // let avatar;
  // try {
  //   avatar = await uploadOnCloudinary(avatarLocalPath);
  //   console.log("Uploaded Avatar", avatar);
  // } catch (error) {
    //   console.log("Error uploading avatar", error);
    //   throw new ApiError(500, "Failed to upload avatar");
    // }


    // Generating OTP and Expiry Time
    const generatedOTP = crypto.randomInt(1000, 9999); // Type: Number
    const generatedOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);// 10 minutes from now

    try {
      const user = await User.create({
        fullname,
        avatar: "../../public/temp/avatarLocal.jpg",
        email,
        password,
        otp: generatedOTP,
        otpExpiry: generatedOTPExpiry
      });
      
      console.log("Created User", user);
      
      console.log("Created User", user);
    
    
    // Sending Email from the backend
    await sendVerificationEmail(user.email, generatedOTP.toString()); 

    const verificationToken = jwt.sign(
      { id: user._id },
      process.env.VERIFICATION_TOKEN_SECRET,
      { expiresIn: process.env.VERIFICATION_TOKEN_EXPIRY }
    );

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken -otp -otp_expiry" 
    );
    
    console.log("Created User to return", createdUser);
    
    if (!createdUser) {
      throw new ApiError(500, "Something went wrong while registering a user");
    }
    
    return res
    .status(201)
    .json(new ApiResponse(
        201, 
        createdUser, 
        verificationToken,
        "User registered successfully. Please check your email for OTP."
    ));

  } catch (error) {
    console.error("User creation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while registering a user"
    );
  }
});

const verifyOTP = asyncHandler(async (req, res) => {
  
  const {token,otp} = req.body;

  if( !otp || !token) {
    throw new ApiError(400, "OTP and token are required");
  }

  let decodedToken;
  try{
    decodedToken = jwt.verify(token,process.env.VERIFICATION_TOKEN_SECRET);
  }catch{
    throw new ApiError(400, "Invalid token");
  }

  const userId = decodedToken?.id;

  const user = await User.findById(userId);

  if(!user){
    throw new ApiError(404, "User not found");
  }

  if (user.verified) {
    return res.status(200).json(new ApiResponse(200, {}, "User is already verified"));
  }

  if (user.otp !== Number(otp)) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (user.otp_expiry < new Date()) {
    throw new ApiError(400, "OTP has expired");
  }

  user.verified = true;
  user.otp = null;
  user.otp_expiry = null;
  await user.save();

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };

  return res
  .status(200)
  .cookie("refreshToken", refreshToken, options)
  .json(
    new ApiResponse(
      200,
      { accessToken, refreshToken },
      "Email verified successfully. User is now logged in."
    )
  );
});

const loginUser = asyncHandler(async (req, res) => {
    console.log("starting login");
    console.log("raw body:", req.body);    
  const { email, password } = req.body;
  console.log(email,password);

  //validation
  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  //validate password
  const isPasswordCorrect = await user.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Password is incorrect");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new ApiError(500, "Something went wrong while login a user");
  }

  console.log(loggedInUser);

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "User logged in successful"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findOneAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  };
  return res
    .status(200)
    .cookie("accessToken", options)
    .cookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successful"));
});

const refreshToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh Token is required");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Refresh token is valid"
        )
      );
  } catch (error) {
    throw new ApiError(500, "Something went wrong while refreshing token");
  }
});

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "User found successfully"));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { fullname, email } = req.body;

  if (!fullname || !email) {
    throw new ApiError(400, "Fullname or email is required");
  }

  const user = User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Account details updated successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(
      500,
      "Something went wrong while uploading avatar on cloudinary"
    );
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "Avatar updated successfully"));
});

export {
  registerUser,
  loginUser,
  verifyOTP,
  refreshToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
