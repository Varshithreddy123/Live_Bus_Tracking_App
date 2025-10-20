import { Request, Response } from "express";
import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

// Get nearby bus stands based on user's location
export const getNearbyBusStands = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude, radius = 1000 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "Latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude as string);
    const lng = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);

    // Calculate distance using Haversine formula
    const busStands = await prisma.busStand.findMany({
      where: {
        // Note: For MongoDB, we'll need to calculate distance in application code
        // This is a simplified version - in production, use geospatial queries
      }
    });

    // Filter by distance (simplified - should use proper geospatial query)
    const nearbyStands = busStands.filter(stand => {
      const distance = calculateDistance(lat, lng, stand.latitude, stand.longitude);
      return distance <= rad;
    });

    res.json({
      success: true,
      data: nearbyStands.map(stand => ({
        id: stand.id,
        name: stand.name,
        latitude: stand.latitude,
        longitude: stand.longitude,
        address: stand.address,
        distance: calculateDistance(lat, lng, stand.latitude, stand.longitude)
      }))
    });
  } catch (error) {
    console.error("Error fetching nearby bus stands:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch nearby bus stands"
    });
  }
};

// Get all bus routes
export const getBusRoutes = async (req: Request, res: Response) => {
  try {
    const routes = await prisma.route.findMany({
      include: {
        stops: {
          include: {
            busStand: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    res.json({
      success: true,
      data: routes.map(route => ({
        id: route.id,
        name: route.name,
        busNumber: route.busNumber,
        stops: route.stops.map(stop => ({
          id: stop.busStand.id,
          name: stop.busStand.name,
          latitude: stop.busStand.latitude,
          longitude: stop.busStand.longitude,
          order: stop.order,
          eta: stop.eta
        })),
        polyline: route.polyline ? JSON.parse(route.polyline) : null
      }))
    });
  } catch (error) {
    console.error("Error fetching bus routes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bus routes"
    });
  }
};

// Get live bus location for a specific route
export const getLiveBusLocation = async (req: Request, res: Response) => {
  try {
    const { routeId } = req.params;

    if (!routeId) {
      return res.status(400).json({
        success: false,
        message: "Route ID is required"
      });
    }

    const route = await prisma.route.findUnique({
      where: { id: routeId },
      include: {
        stops: {
          include: {
            busStand: true
          },
          orderBy: {
            order: 'asc'
          }
        }
      }
    });

    if (!route) {
      return res.status(404).json({
        success: false,
        message: "Route not found"
      });
    }

    // Mock live data - in production, this would come from GPS tracking
    const mockLiveData = {
      busNumber: route.busNumber,
      routeName: route.name,
      currentLocation: {
        latitude: route.stops[0]?.busStand.latitude || 0,
        longitude: route.stops[0]?.busStand.longitude || 0
      },
      currentStop: route.stops[0]?.busStand.name,
      nextStop: route.stops[1]?.busStand.name,
      eta: "5 mins",
      distance: "2.3 km",
      speed: "25 km/h",
      occupancy: "60%",
      isActive: true,
      stops: route.stops.map(stop => ({
        id: stop.busStand.id,
        name: stop.busStand.name,
        latitude: stop.busStand.latitude,
        longitude: stop.busStand.longitude,
        eta: stop.eta
      })),
      routePolyline: route.polyline ? JSON.parse(route.polyline) : []
    };

    res.json({
      success: true,
      data: mockLiveData
    });
  } catch (error) {
    console.error("Error fetching live bus location:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch live bus location"
    });
  }
};

// Helper function to calculate distance between two points
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in km
  return distance * 1000; // Convert to meters
}
