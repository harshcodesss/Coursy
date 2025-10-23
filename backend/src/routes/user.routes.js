import { Router } from "express";
import { registerUser, loginUser, verifyOTP } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyjWT } from "../middlewares/auth.middlewares.js";

const router = Router();

//unsecured routes

router.route("/register").post(
  registerUser
);

router.route("/verify").post(verifyOTP);

router.route("/login").post(loginUser);

// router.route("/refresh-token").post(refreshToken);

// //secured routes
// router.route("/logout").post(verifyjWT, logoutUser);
// router.route("/change-password").post(verifyjWT,changeCurrentPassword)
// router.route("/current-user").get(verifyjWT,getCurrentUser);

// router.route("/c/:username").get(verifyjWT, getUserChannelProfile);

// router.route("/update-account").patch(verifyjWT,updateAccountDetails)

// //file routes
// router.route("/avatar").patch(verifyjWT,upload.single("avatar"),updateUserAvatar);

export default router;
