import express from "express";
import { registerUser, verifyOTP, resendOTP } from "../controllers/user.controller";

const userRouter = express.Router();

userRouter.post("/send-otp", registerUser);
userRouter.post("/verify-otp", verifyOTP);
userRouter.post("/resend-otp", resendOTP);

export default userRouter;
