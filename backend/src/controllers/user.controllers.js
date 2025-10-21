import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../utils/sendEmail.js";

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

    
    try {
      const user = await User.create({
        fullname,
        avatar: "../../public/temp/avatarLocal.jpg",
        email,
        password,
      });
      
      console.log("Created User", user);
      
      const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
      );
      
      console.log("Created User", createdUser);
      
      if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering a user");
      }
      
      
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );
      
      // Send verification email
      await sendVerificationEmail(user.email, token);
      
      return res
      .status(201)
      .json(new ApiResponse(201, createdUser, "User registerd Successfully"));
    } catch (error) {
    // console.log("User Creation failed");
    // if (avatar) {
    //   // await deleteFromCloudinary(avatar.public_id);
    // }
    console.error("User creation error:", error);
    throw new ApiError(
      500,
      "Something went wrong while registering a user and images were deleted"
    );
  }
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Verification token is missing");
  }

  try {
    // 1️⃣ Decode token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        throw new ApiError(400, "Verification link has expired");
      } else {
        throw new ApiError(400, "Invalid verification link");
      }
    }

    // 2️⃣ Find user
    const user = await User.findById(decoded.id);
    if (!user) throw new ApiError(404, "User not found");

    // 3️⃣ Check if already verified
    if (user.verified) {
      // Redirect to frontend "already verified" page
      return res.redirect(`${process.env.FRONTEND_URL}/already-verified`);
    }

    // 4️⃣ Mark as verified
    user.verified = true;
    await user.save();

    // 5️⃣ Redirect to frontend success page
    return res.redirect(`${process.env.FRONTEND_URL}/verified-success`);
  } catch (error) {
    console.error("Verification error:", error);
    // Redirect to frontend error page
    return res.redirect(`${process.env.FRONTEND_URL}/verification-error`);
  }
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
  refreshToken,
  logoutUser,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
};
