import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import appColors from '../../themes/app.colors';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Driver Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back! Here's your overview.</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Total Rides</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>$245</Text>
          <Text style={styles.statLabel}>Earnings</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>Ride completed - Downtown to Airport</Text>
          <Text style={styles.activityTime}>2 hours ago</Text>
        </View>
        <View style={styles.activityCard}>
          <Text style={styles.activityText}>New ride request received</Text>
          <Text style={styles.activityTime}>5 hours ago</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: appColors.whiteColor,
    opacity: 0.8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: appColors.whiteColor,
    borderRadius: 10,
    padding: 15,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  statLabel: {
    fontSize: 14,
    color: appColors.secondaryText,
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primaryText,
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: appColors.lightGray,
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
  },
  activityText: {
    fontSize: 16,
    color: appColors.primaryText,
  },
  activityTime: {
    fontSize: 12,
    color: appColors.secondaryText,
    marginTop: 5,
  },
});
