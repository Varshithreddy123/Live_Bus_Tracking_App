import { external } from "@/styles/external.style";
import colors from "@/themes/app.colors";
import { windowHeight, windowWidth } from "@/themes/app.constant";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  // Main Container
  container: {
    flex: 1,
    backgroundColor: colors.whiteColor,
  },

  // Map Container
  mapContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },

  map: {
    width: '100%',
    height: '100%',
  },

  // Top Header Section
  headerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: windowWidth(20),
    paddingTop: windowHeight(50),
    paddingBottom: windowHeight(15),
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomLeftRadius: windowWidth(20),
    borderBottomRightRadius: windowWidth(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 10,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: windowWidth(40),
    height: windowWidth(40),
    borderRadius: windowWidth(20),
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    fontSize: windowWidth(18),
    fontWeight: '700',
    color: colors.primaryText,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: windowWidth(10),
  },

  menuButton: {
    width: windowWidth(40),
    height: windowWidth(40),
    borderRadius: windowWidth(20),
    backgroundColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bus Info Card
  busInfoCard: {
    position: 'absolute',
    bottom: windowHeight(20),
    left: windowWidth(20),
    right: windowWidth(20),
    backgroundColor: colors.whiteColor,
    borderRadius: windowWidth(20),
    padding: windowWidth(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
  },

  busInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: windowHeight(15),
  },

  busNumber: {
    fontSize: windowWidth(24),
    fontWeight: '800',
    color: colors.primaryText,
  },

  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: windowWidth(12),
    paddingVertical: windowHeight(6),
    borderRadius: windowWidth(20),
  },

  liveDot: {
    width: windowWidth(8),
    height: windowWidth(8),
    borderRadius: windowWidth(4),
    backgroundColor: colors.whiteColor,
    marginRight: windowWidth(6),
  },

  liveText: {
    fontSize: windowWidth(12),
    fontWeight: '600',
    color: colors.whiteColor,
  },

  busInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: windowHeight(10),
  },

  busInfoIcon: {
    fontSize: windowWidth(18),
    marginRight: windowWidth(10),
  },

  busInfoText: {
    fontSize: windowWidth(14),
    color: colors.secondaryText,
    flex: 1,
  },

  busInfoValue: {
    fontSize: windowWidth(14),
    fontWeight: '600',
    color: colors.primaryText,
  },

  divider: {
    height: 1,
    backgroundColor: colors.borderColor,
    marginVertical: windowHeight(12),
  },

  // ETA Section
  etaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.primaryLight,
    borderRadius: windowWidth(12),
    padding: windowWidth(15),
  },

  etaLabel: {
    fontSize: windowWidth(12),
    color: colors.secondaryText,
    marginBottom: windowHeight(4),
  },

  etaValue: {
    fontSize: windowWidth(20),
    fontWeight: '700',
    color: colors.primary,
  },

  distanceContainer: {
    alignItems: 'flex-end',
  },

  distanceValue: {
    fontSize: windowWidth(16),
    fontWeight: '600',
    color: colors.primaryText,
  },

  distanceLabel: {
    fontSize: windowWidth(12),
    color: colors.secondaryText,
    marginTop: windowHeight(2),
  },

  // Action Buttons
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: windowHeight(15),
    gap: windowWidth(10),
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: windowHeight(12),
    borderRadius: windowWidth(10),
  },

  actionButtonSecondary: {
    backgroundColor: colors.secondaryLight,
  },

  actionButtonText: {
    fontSize: windowWidth(14),
    fontWeight: '600',
    color: colors.whiteColor,
    marginLeft: windowWidth(8),
  },

  actionButtonTextSecondary: {
    color: colors.primary,
  },

  // Bus Marker on Map
  busMarker: {
    width: windowWidth(50),
    height: windowWidth(50),
    alignItems: 'center',
    justifyContent: 'center',
  },

  busMarkerInner: {
    width: windowWidth(40),
    height: windowWidth(40),
    borderRadius: windowWidth(20),
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.whiteColor,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },

  // Stop Marker
  stopMarker: {
    width: windowWidth(30),
    height: windowWidth(30),
    borderRadius: windowWidth(15),
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },

  stopMarkerInner: {
    width: windowWidth(12),
    height: windowWidth(12),
    borderRadius: windowWidth(6),
    backgroundColor: colors.primary,
  },

  // Current Location Button
  currentLocationButton: {
    position: 'absolute',
    bottom: windowHeight(200),
    right: windowWidth(20),
    width: windowWidth(50),
    height: windowWidth(50),
    borderRadius: windowWidth(25),
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },

  // Refresh/Reload Button
  refreshButton: {
    position: 'absolute',
    bottom: windowHeight(260),
    right: windowWidth(20),
    width: windowWidth(50),
    height: windowWidth(50),
    borderRadius: windowWidth(25),
    backgroundColor: colors.whiteColor,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 5,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.whiteColor,
  },

  loadingText: {
    marginTop: windowHeight(20),
    fontSize: windowWidth(16),
    color: colors.secondaryText,
  },

  // Error State
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: windowWidth(40),
    backgroundColor: colors.whiteColor,
  },

  errorText: {
    fontSize: windowWidth(16),
    color: colors.errorText,
    textAlign: 'center',
    marginTop: windowHeight(20),
  },

  retryButton: {
    marginTop: windowHeight(20),
    backgroundColor: colors.primary,
    paddingHorizontal: windowWidth(30),
    paddingVertical: windowHeight(12),
    borderRadius: windowWidth(10),
  },

  retryButtonText: {
    fontSize: windowWidth(14),
    fontWeight: '600',
    color: colors.whiteColor,
  },

  // Route Line
  routeLine: {
    strok: 4,
    strokeColor: colors.primary,
  },

  // Pulse Animation (for live tracking)
  pulseCircle: {
    position: 'absolute',
    borderRadius: windowWidth(50),
    borderWidth: 2,
    borderColor: colors.primary,
  }
});