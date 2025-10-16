import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_ID!; // ✅ consistent variable
const client = twilio(accountSid, authToken, { lazyLoading: true });

// 📱 Register new Users (Send OTP)
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number } = req.body;

  if (!phone_number || !/^(\+\d{1,3})?\d{7,14}$/.test(phone_number)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ message: "Twilio configuration missing" });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone_number, channel: "sms" });

    console.log(`Sent verification to ${phone_number}: ${verification.status}`);
    res.status(200).json({ message: "Verification sent successfully" });
  } catch (err) {
    console.error("Twilio verification error:", err);
    next(err);
  }
};

// 🔐 Verify OTP
export const verifyOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ message: "Phone number and OTP are required" });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ message: "Twilio configuration missing" });
  }

  try {
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone_number, code: otp });

    if (verificationCheck.status === "approved") {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } catch (err) {
    console.error("Twilio verification check error:", err);
    next(err);
  }
};

// 🔁 Resend OTP
export const resendOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number } = req.body;

  if (!phone_number || !/^(\+\d{1,3})?\d{7,14}$/.test(phone_number)) {
    return res.status(400).json({ message: "Invalid phone number format" });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ message: "Twilio configuration missing" });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone_number, channel: "sms" });

    console.log(`Resent verification to ${phone_number}: ${verification.status}`);
    res.status(200).json({ message: "Verification resent successfully" });
  } catch (err) {
    console.error("Twilio resend verification error:", err);
    next(err);
  }
};
