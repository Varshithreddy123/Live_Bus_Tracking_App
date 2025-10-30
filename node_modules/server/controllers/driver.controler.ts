import prisma from "@/utils/prisma";
import dotenv from "dotenv";
dotenv.config();
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const serviceSid = process.env.TWILIO_SERVICE_ID!;
const client = twilio(accountSid, authToken, { lazyLoading: true });

// ✅ Validation utilities
const validatePhoneNumber = (phone: string): boolean => {
  return /^(\+\d{1,3})?\d{7,14}$/.test(phone);
};

const validateVehicleNumber = (vehicleNumber: string): boolean => {
  return /^[A-Z0-9]+([-\s]?[A-Z0-9]+)*$/i.test(vehicleNumber) && vehicleNumber.length >= 3 && vehicleNumber.length <= 15;
};

const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// 📱 Register Driver (Send OTP)
export const registerDriver = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number } = req.body;

  if (!phone_number || !validatePhoneNumber(phone_number)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid phone number format. Use format: +919876543210" 
    });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ 
      success: false,
      message: "Twilio configuration missing" 
    });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone_number, channel: "sms" });

    console.log(`Sent verification to ${phone_number}: ${verification.status}`);
    
    res.status(200).json({ 
      success: true,
      message: "Verification code sent successfully",
      data: {
        phone_number: phone_number,
        status: verification.status
      }
    });
  } catch (err: any) {
    console.error("Twilio verification error:", err);

    if (err.code === 60200) {
      return res.status(429).json({
        success: false,
        message: "Too many verification attempts. Please try again later."
      });
    }

    next(err);
    return;
  }
};

// 🔐 Verify OTP for Driver
export const verifyDriverOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number, otp } = req.body;

  if (!phone_number || !otp) {
    return res.status(400).json({ 
      success: false,
      message: "Phone number and OTP are required" 
    });
  }

  if (!validatePhoneNumber(phone_number)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid phone number format" 
    });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ 
      success: false,
      message: "Twilio configuration missing" 
    });
  }

  try {
    // Verify the OTP with Twilio
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({ to: phone_number, code: otp });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ 
        success: false,
        message: "Invalid or expired OTP" 
      });
    }

    // Check if driver exists
    const isDriverExist = await prisma.driver.findUnique({
      where: {
        phoneNumber: phone_number,
      }
    });

    // Create driver account if doesn't exist
    if (!isDriverExist) {
      const newDriver = await prisma.driver.create({
        data: {
          phoneNumber: phone_number,
          vehicleType: "Petrol", // Default value, will be updated later
          rating: 0,
          totalEarning: 0,
          totalRides: 0,
          pendingRides: 0,
          cancleRides: 0,
          status: "inactive",
        }
      });

      return res.status(201).json({
        success: true,
        message: "OTP verified and driver account created successfully",
        isNewUser: true,
        user: {
          id: newDriver.id,
          phoneNumber: newDriver.phoneNumber,
          name: newDriver.name,
          status: newDriver.status,
        }
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "OTP verified successfully",
        isNewUser: false,
        user: {
          id: isDriverExist.id,
          phoneNumber: isDriverExist.phoneNumber,
          name: isDriverExist.name,
          email: isDriverExist.email,
          vehicleNumber: isDriverExist.vehicleNumber,
          drinving_license: isDriverExist.drinving_license,
          rating: isDriverExist.rating,
          status: isDriverExist.status,
        }
      });
    }
  } catch (err: any) {
    console.error("Twilio verification check error:", err);

    if (err.code === 20404) {
      return res.status(400).json({
        success: false,
        message: "Verification request not found or expired"
      });
    }

    next(err);
    return;
  }
};

// 🔁 Resend OTP for Driver
export const resendDriverOTP = async (req: Request, res: Response, next: NextFunction) => {
  const { phone_number } = req.body;

  if (!phone_number || !validatePhoneNumber(phone_number)) {
    return res.status(400).json({ 
      success: false,
      message: "Invalid phone number format" 
    });
  }

  if (!accountSid || !authToken || !serviceSid) {
    return res.status(500).json({ 
      success: false,
      message: "Twilio configuration missing" 
    });
  }

  try {
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({ to: phone_number, channel: "sms" });

    console.log(`Resent verification to ${phone_number}: ${verification.status}`);
    
    res.status(200).json({ 
      success: true,
      message: "Verification code resent successfully" 
    });
  } catch (err: any) {
    console.error("Twilio resend verification error:", err);

    if (err.code === 60200) {
      return res.status(429).json({
        success: false,
        message: "Too many attempts. Please wait before requesting again."
      });
    }

    next(err);
    return;
  }
};

// 👤 Complete Driver Profile (Personal Info)
export const completeDriverProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId, email, name, drinving_license, country } = req.body;

    // Validate required fields
    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required"
      });
    }

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Valid name is required (minimum 2 characters)"
      });
    }

    if (!drinving_license || drinving_license.trim().length < 5) {
      return res.status(400).json({
        success: false,
        message: "Valid driving license number is required (minimum 5 characters)"
      });
    }

    if (email && !validateEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Valid email is required"
      });
    }

    // Check if driver exists
    const driver = await prisma.driver.findUnique({
      where: {
        id: driverId,
      },
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    // Check if profile already completed
    if (driver.name !== null && driver.name !== undefined) {
      return res.status(400).json({
        success: false,
        message: "Driver profile already completed. Use update endpoint instead."
      });
    }

    // Check for duplicate license number
    if (drinving_license) {
      const existingLicense = await prisma.driver.findUnique({
        where: { drinving_license: drinving_license.toUpperCase().trim() }
      });

      if (existingLicense && existingLicense.id !== driverId) {
        return res.status(400).json({
          success: false,
          message: "Driving license number already registered"
        });
      }
    }

    // Check for duplicate email if provided
    if (email) {
      const existingEmail = await prisma.driver.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (existingEmail && existingEmail.id !== driverId) {
        return res.status(400).json({
          success: false,
          message: "Email already registered"
        });
      }
    }

    // Update driver profile
    const updatedDriver = await prisma.driver.update({
      where: {
        id: driverId
      },
      data: {
        name: name.trim(),
        email: email ? email.toLowerCase().trim() : null,
        drinving_license: drinving_license.toUpperCase().trim(),
        country: country ? country.trim() : null,
      }
    });

    res.status(200).json({
      success: true,
      message: "Driver profile completed successfully",
      user: {
        id: updatedDriver.id,
        name: updatedDriver.name,
        email: updatedDriver.email,
        phoneNumber: updatedDriver.phoneNumber,
        drinving_license: updatedDriver.drinving_license,
        country: updatedDriver.country,
      }
    });
  } catch (error: any) {
    console.error("Complete Driver Profile Error:", error);
    next(error);
  }
};

// 🚗 Register Driver and Vehicle Details (Combined Registration)
export const registerVehicleDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      driverId,
      name,
      email,
      phoneNumber,
      drinving_license,
      country,
      password, // Ignored as per schema
      vehicleNumber,
      vehicleType,
      vehicleColor,
      vehicleImage,
      busNumber, // Additional bus details
      departureTime,
      arrivalTime,
      operatedRoutes,
      registerId
    } = req.body;

    // Validate required fields for vehicle
    if (!vehicleNumber || !validateVehicleNumber(vehicleNumber)) {
      return res.status(400).json({
        success: false,
        message: "Valid vehicle number is required (e.g., KL-07-AB-1234)"
      });
    }

    if (!vehicleType || !["Electric", "Petrol", "Diesel", "Hybrid"].includes(vehicleType)) {
      return res.status(400).json({
        success: false,
        message: "Valid vehicle type is required (Electric, Petrol, Diesel, or Hybrid)"
      });
    }

    // Check if vehicle number already exists
    const existingVehicle = await prisma.driver.findUnique({
      where: { vehicleNumber: vehicleNumber.toUpperCase().trim() }
    });

    if (existingVehicle) {
      return res.status(400).json({
        success: false,
        message: "Vehicle number already registered"
      });
    }

    let driver;

    // Check if driver exists
    if (driverId && !driverId.startsWith('temp-')) {
      driver = await prisma.driver.findUnique({
        where: { id: driverId }
      });

      if (!driver) {
        return res.status(404).json({
          success: false,
          message: "Driver not found"
        });
      }

      // Check if driver already has a vehicle registered
      if (driver.vehicleNumber) {
        return res.status(400).json({
          success: false,
          message: "Driver already has a vehicle registered. Use update endpoint instead."
        });
      }

      // Update existing driver with vehicle details
      driver = await prisma.driver.update({
        where: { id: driverId },
        data: {
          vehicleNumber: vehicleNumber.toUpperCase().trim(),
          vehicleType: vehicleType,
          vehicleColor: vehicleColor ? vehicleColor.trim() : null,
          vehicleImage: vehicleImage ? vehicleImage : null,
          status: "active", // Activate driver once vehicle is registered
        }
      });
    } else {
      // Driver doesn't exist, create new driver with all details
      if (!name || name.trim().length < 2) {
        return res.status(400).json({
          success: false,
          message: "Valid name is required (minimum 2 characters)"
        });
      }

      if (!phoneNumber || !validatePhoneNumber(phoneNumber)) {
        return res.status(400).json({
          success: false,
          message: "Valid phone number is required"
        });
      }

      if (!drinving_license || drinving_license.trim().length < 5) {
        return res.status(400).json({
          success: false,
          message: "Valid driving license number is required (minimum 5 characters)"
        });
      }

      if (email && !validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Valid email is required"
        });
      }

      // Check for duplicates
      const existingPhone = await prisma.driver.findUnique({
        where: { phoneNumber: phoneNumber.trim() }
      });

      if (existingPhone) {
        return res.status(400).json({
          success: false,
          message: "Phone number already registered"
        });
      }

      const existingLicense = await prisma.driver.findUnique({
        where: { drinving_license: drinving_license.toUpperCase().trim() }
      });

      if (existingLicense) {
        return res.status(400).json({
          success: false,
          message: "Driving license number already registered"
        });
      }

      if (email) {
        const existingEmail = await prisma.driver.findUnique({
          where: { email: email.toLowerCase().trim() }
        });

        if (existingEmail) {
          return res.status(400).json({
            success: false,
            message: "Email already registered"
          });
        }
      }

      // Create new driver with all details
      driver = await prisma.driver.create({
        data: {
          name: name.trim(),
          email: email ? email.toLowerCase().trim() : null,
          phoneNumber: phoneNumber.trim(),
          drinving_license: drinving_license.toUpperCase().trim(),
          country: country ? country.trim() : null,
          vehicleNumber: vehicleNumber.toUpperCase().trim(),
          vehicleType: vehicleType,
          vehicleColor: vehicleColor ? vehicleColor.trim() : null,
          vehicleImage: vehicleImage ? vehicleImage : null,
          rating: 0,
          totalEarning: 0,
          totalRides: 0,
          pendingRides: 0,
          cancleRides: 0,
          status: "active", // Activate driver once registered with vehicle
        }
      });
    }

    res.status(200).json({
      success: true,
      message: driverId && !driverId.startsWith('temp-')
        ? "Vehicle details registered successfully"
        : "Driver and vehicle registered successfully",
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        drinving_license: driver.drinving_license,
        country: driver.country,
        vehicleNumber: driver.vehicleNumber,
        vehicleType: driver.vehicleType,
        vehicleColor: driver.vehicleColor,
        status: driver.status,
      }
    });
  } catch (error: any) {
    console.error("Register Driver and Vehicle Details Error:", error);
    next(error);
  }
};

// 📋 Get Driver Profile
export const getDriverProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required"
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId },
      include: {
        rides: {
          take: 10,
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    res.status(200).json({
      success: true,
      driver: {
        id: driver.id,
        name: driver.name,
        email: driver.email,
        phoneNumber: driver.phoneNumber,
        country: driver.country,
        drinving_license: driver.drinving_license,
        vehicleNumber: driver.vehicleNumber,
        vehicleType: driver.vehicleType,
        vehicleColor: driver.vehicleColor,
        vehicleImage: driver.vehicleImage,
        rating: driver.rating,
        totalEarning: driver.totalEarning,
        totalRides: driver.totalRides,
        pendingRides: driver.pendingRides,
        cancleRides: driver.cancleRides,
        status: driver.status,
        recentRides: driver.rides,
      }
    });
  } catch (error: any) {
    console.error("Get Driver Profile Error:", error);
    next(error);
  }
};

// ✏️ Update Driver Profile
export const updateDriverProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;
    const { name, email, country, vehicleColor, vehicleImage } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required"
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    // Check for duplicate email if updating
    if (email && email !== driver.email) {
      if (!validateEmail(email)) {
        return res.status(400).json({
          success: false,
          message: "Invalid email format"
        });
      }

      const existingEmail = await prisma.driver.findUnique({
        where: { email: email.toLowerCase().trim() }
      });

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already in use"
        });
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) updateData.email = email.toLowerCase().trim();
    if (country) updateData.country = country.trim();
    if (vehicleColor) updateData.vehicleColor = vehicleColor.trim();
    if (vehicleImage) updateData.vehicleImage = vehicleImage;

    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: updateData
    });

    res.status(200).json({
      success: true,
      message: "Driver profile updated successfully",
      driver: {
        id: updatedDriver.id,
        name: updatedDriver.name,
        email: updatedDriver.email,
        phoneNumber: updatedDriver.phoneNumber,
        country: updatedDriver.country,
        vehicleColor: updatedDriver.vehicleColor,
      }
    });
  } catch (error: any) {
    console.error("Update Driver Profile Error:", error);
    next(error);
  }
};

// 🔄 Update Driver Status
export const updateDriverStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;
    const { status } = req.body;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required"
      });
    }

    if (!status || !["active", "inactive", "busy"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Valid status is required (active, inactive, or busy)"
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    const updatedDriver = await prisma.driver.update({
      where: { id: driverId },
      data: { status }
    });

    res.status(200).json({
      success: true,
      message: `Driver status updated to ${status}`,
      driver: {
        id: updatedDriver.id,
        status: updatedDriver.status,
      }
    });
  } catch (error: any) {
    console.error("Update Driver Status Error:", error);
    next(error);
  }
};

// 🔍 Check Duplicate Fields
export const checkDuplicateFields = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { phoneNumber, drinving_license, email } = req.body;

    const errors: string[] = [];

    // Check phone number
    if (phoneNumber) {
      const existingPhone = await prisma.driver.findUnique({
        where: { phoneNumber: phoneNumber.trim() }
      });
      if (existingPhone) {
        errors.push("phone");
      }
    }

    // Check driving license
    if (drinving_license) {
      const existingLicense = await prisma.driver.findUnique({
        where: { drinving_license: drinving_license.toUpperCase().trim() }
      });
      if (existingLicense) {
        errors.push("license");
      }
    }

    // Check email
    if (email) {
      const existingEmail = await prisma.driver.findUnique({
        where: { email: email.toLowerCase().trim() }
      });
      if (existingEmail) {
        errors.push("email");
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        error: `Duplicate ${errors.join(", ")} found`,
        duplicates: errors
      });
    }

    res.status(200).json({
      success: true,
      message: "No duplicates found"
    });
  } catch (error: any) {
    console.error("Check Duplicate Fields Error:", error);
    next(error);
  }
};

// 📊 Get Driver Statistics
export const getDriverStatistics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { driverId } = req.params;

    if (!driverId) {
      return res.status(400).json({
        success: false,
        message: "Driver ID is required"
      });
    }

    const driver = await prisma.driver.findUnique({
      where: { id: driverId }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: "Driver not found"
      });
    }

    res.status(200).json({
      success: true,
      statistics: {
        rating: driver.rating,
        totalEarning: driver.totalEarning,
        totalRides: driver.totalRides,
        pendingRides: driver.pendingRides,
        cancelledRides: driver.cancleRides,
        completionRate: driver.totalRides > 0
          ? ((driver.totalRides - driver.cancleRides) / driver.totalRides * 100).toFixed(2)
          : 0,
        averageEarningPerRide: driver.totalRides > 0
          ? (driver.totalEarning / driver.totalRides).toFixed(2)
          : 0,
      }
    });
  } catch (error: any) {
    console.error("Get Driver Statistics Error:", error);
    next(error);
  }
};
