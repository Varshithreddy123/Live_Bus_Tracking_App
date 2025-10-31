import { StyleSheet } from 'react-native';
import appColors from '../../themes/app.colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.whiteColor,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: appColors.whiteColor,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.secondaryText,
  },
  errorText: {
    fontSize: 16,
    color: appColors.alertRed,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: appColors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: appColors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Toggle Section
  toggleContainer: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primaryText,
    marginBottom: 15,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleText: {
    fontSize: 16,
    color: appColors.secondaryText,
    fontWeight: '500',
  },
  activeToggleText: {
    color: appColors.primaryText,
    fontWeight: 'bold',
  },

  // Cards
  busCard: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  passengersCard: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsCard: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primaryText,
    marginBottom: 15,
  },

  // Bus Info
  busInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: appColors.border,
  },
  busLabel: {
    fontSize: 14,
    color: appColors.secondaryText,
    fontWeight: '500',
  },
  busValue: {
    fontSize: 14,
    color: appColors.primaryText,
    fontWeight: '600',
  },

  // Passenger Stats
  passengerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: appColors.secondaryText,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: appColors.border,
  },

  // Stats Grid
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statBox: {
    width: '48%',
    backgroundColor: appColors.secondaryLight,
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: appColors.primary,
    marginBottom: 5,
  },
  statLabelSmall: {
    fontSize: 12,
    color: appColors.secondaryText,
    fontWeight: '500',
  },

  // Actions
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },

  // Emergency Button
  emergencyButton: {
    backgroundColor: appColors.alertRed,
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 30,
  },
  emergencyText: {
    color: appColors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
