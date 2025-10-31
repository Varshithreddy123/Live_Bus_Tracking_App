import express from "express";
import {
  registerDriver,
  verifyDriverOTP,
  resendDriverOTP,
  completeDriverProfile,
  registerVehicleDetails,
  getDriverProfile,
  updateDriverProfile,
  checkDuplicateFields,
  getMyDriverProfile
} from "../controllers/driver.controler";
import { authenticateDriver } from "../middleware/authDriver.middleware";

const driverRouter = express.Router();

// Driver authentication routes
driverRouter.post("/send-otp-driver", registerDriver);
driverRouter.post("/login", registerDriver); // Login route for driver authentication
driverRouter.post("/verify-otp-driver", verifyDriverOTP);
driverRouter.post("/resend-otp-driver", resendDriverOTP);

// Driver validation routes
driverRouter.post("/check-duplicate", checkDuplicateFields);

// Driver profile routes
driverRouter.post("/complete-profile", completeDriverProfile);
driverRouter.post("/register-bus", registerVehicleDetails);
driverRouter.get("/profile/me", authenticateDriver, getMyDriverProfile);
driverRouter.get("/profile/:driverId", getDriverProfile);
driverRouter.put("/profile/:driverId", updateDriverProfile);

export default driverRouter;
