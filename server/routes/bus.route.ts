import express from "express";
import { getNearbyBusStands, getBusRoutes, getLiveBusLocation } from "../controllers/bus.controller";

const busRouter = express.Router();

busRouter.get("/nearby-stops", getNearbyBusStands);
busRouter.get("/routes", getBusRoutes);
busRouter.get("/routes/:routeId/live", getLiveBusLocation);

export default busRouter;
