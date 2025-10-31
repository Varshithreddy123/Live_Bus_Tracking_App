import prisma from "@/utils/prisma";
import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { AuthRequest } from '../middleware/authUser.middleware';

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_ID!;
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
    // First verify the OTP with Twilio
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone_number, code: otp });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user exists
    const isUserExist = await prisma.user.findUnique({
      where: {
        phoneNumber: phone_number,
      }
    });

    // Create account if user doesn't exist
    if (!isUserExist) {
      const newUser = await prisma.user.create({
        data: {
          phoneNumber: phone_number,
        }
      });

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, phoneNumber: newUser.phoneNumber, role: 'user' },
        process.env.JWT_SECRET || 'your-super-secure-jwt-secret-here',
        { expiresIn: '7d' }
      );

      return res.status(201).json({
        message: "OTP verified and account created successfully",
        user: newUser,
        token: token,
        isNewUser: true
      });
    } else {
      // Generate JWT token for existing user
      const token = jwt.sign(
        { id: isUserExist.id, phoneNumber: isUserExist.phoneNumber, role: 'user' },
        process.env.JWT_SECRET || 'your-super-secure-jwt-secret-here',
        { expiresIn: '7d' }
      );

      return res.status(200).json({
        message: "OTP verified successfully",
        user: isUserExist,
        token: token,
        isNewUser: false
      });
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

  //signup user
  export const signupNewUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {userId, email, name} = req.body;

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      if (user.email !== null) {
        return res.status(400).json({
          success: false,
          message: "User already has email set"
        });
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId
        },
        data: {
          name: name,
          email: email,
        }
      });

      res.status(200).json({
        success: true,
        user: updatedUser
  
      });
    } catch (error) {
      console.error("Signup Error:", error);
      next(error);
    }
};