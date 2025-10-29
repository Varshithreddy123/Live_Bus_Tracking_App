import express from "express";
import {
  registerDriver,
  verifyDriverOTP,
  resendDriverOTP,
  completeDriverProfile,
  registerVehicleDetails,
  getDriverProfile,
  updateDriverProfile
} from "../controllers/driver.controler";

const driverRouter = express.Router();

// Driver authentication routes
driverRouter.post("/send-otp-driver", registerDriver);
driverRouter.post("/verify-otp-driver", verifyDriverOTP);
driverRouter.post("/resend-otp-driver", resendDriverOTP);

// Driver profile routes
driverRouter.post("/complete-profile", completeDriverProfile);
driverRouter.post("/register-bus", registerVehicleDetails);
driverRouter.get("/profile/:driverId", getDriverProfile);
driverRouter.put("/profile/:driverId", updateDriverProfile);

export default driverRouter;
