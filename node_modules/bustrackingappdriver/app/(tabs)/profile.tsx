import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useDriverData } from '../../hooks/useDriverData';
import appColors from '../../themes/app.colors';

export default function ProfileScreen() {
  const { driverData, loading, error, refetch } = useDriverData();

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Profile</Text>
      </View>

      {driverData && (
        <View style={styles.profileContainer}>
          <View style={styles.profileCard}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{driverData.name || 'Not provided'}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{driverData.email || 'Not provided'}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Phone:</Text>
            <Text style={styles.value}>{driverData.phoneNumber || 'Not provided'}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Vehicle Type:</Text>
            <Text style={styles.value}>{driverData.vehicleType}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Vehicle Number:</Text>
            <Text style={styles.value}>{driverData.vehicleNumber || 'Not provided'}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Rating:</Text>
            <Text style={styles.value}>{driverData.rating}/5</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Total Earnings:</Text>
            <Text style={styles.value}>${driverData.totalEarning}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Total Rides:</Text>
            <Text style={styles.value}>{driverData.totalRides}</Text>
          </View>

          <View style={styles.profileCard}>
            <Text style={styles.label}>Status:</Text>
            <Text style={[styles.value, styles.status, driverData.status === 'active' ? styles.activeStatus : styles.inactiveStatus]}>
              {driverData.status}
            </Text>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={refetch}>
        <Text style={styles.refreshButtonText}>Refresh Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

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
  header: {
    padding: 20,
    backgroundColor: appColors.primary,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.whiteColor,
    textAlign: 'center',
  },
  profileContainer: {
    padding: 20,
  },
  profileCard: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: appColors.secondaryText,
    marginBottom: 5,
  },
  value: {
    fontSize: 16,
    color: appColors.primaryText,
  },
  status: {
    textTransform: 'capitalize',
    fontWeight: 'bold',
  },
  activeStatus: {
    color: appColors.greenColor,
  },
  inactiveStatus: {
    color: appColors.alertRed,
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
  refreshButton: {
    backgroundColor: appColors.primary,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: appColors.whiteColor,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
