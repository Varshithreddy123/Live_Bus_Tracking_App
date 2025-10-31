import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useDriverData } from '../../hooks/useDriverData';
import appColors from '../../themes/app.colors';

interface Ride {
  id: string;
  pickupLocation: string;
  dropLocation: string;
  fare: number;
  status: 'completed' | 'cancelled' | 'ongoing';
  date: string;
  passengerName?: string;
}

const mockRides: Ride[] = [
  {
    id: '1',
    pickupLocation: 'Downtown Station',
    dropLocation: 'Airport Terminal 1',
    fare: 45.50,
    status: 'completed',
    date: '2024-01-15',
    passengerName: 'John Doe'
  },
  {
    id: '2',
    pickupLocation: 'Central Mall',
    dropLocation: 'Business District',
    fare: 25.00,
    status: 'completed',
    date: '2024-01-14',
    passengerName: 'Jane Smith'
  },
  {
    id: '3',
    pickupLocation: 'University Campus',
    dropLocation: 'Train Station',
    fare: 30.75,
    status: 'cancelled',
    date: '2024-01-13',
    passengerName: 'Mike Johnson'
  },
  {
    id: '4',
    pickupLocation: 'Hospital',
    dropLocation: 'Residential Area',
    fare: 35.25,
    status: 'completed',
    date: '2024-01-12',
    passengerName: 'Sarah Wilson'
  },
];

export default function RidesScreen() {
  const { driverData, loading, error } = useDriverData();
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'completed' | 'cancelled' | 'ongoing'>('all');

  const filteredRides = mockRides.filter(ride => {
    if (selectedFilter === 'all') return true;
    return ride.status === selectedFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return appColors.greenColor;
      case 'cancelled': return appColors.alertRed;
      case 'ongoing': return appColors.primary;
      default: return appColors.secondaryText;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderRideItem = ({ item }: { item: Ride }) => (
    <View style={styles.rideCard}>
      <View style={styles.rideHeader}>
        <Text style={styles.dateText}>{item.date}</Text>
        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
          {getStatusText(item.status)}
        </Text>
      </View>

      <View style={styles.routeContainer}>
        <View style={styles.locationContainer}>
          <View style={styles.dot} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.pickupLocation}
          </Text>
        </View>
        <View style={styles.line} />
        <View style={styles.locationContainer}>
          <View style={[styles.dot, styles.destinationDot]} />
          <Text style={styles.locationText} numberOfLines={1}>
            {item.dropLocation}
          </Text>
        </View>
      </View>

      <View style={styles.rideFooter}>
        <Text style={styles.passengerText}>
          Passenger: {item.passengerName || 'N/A'}
        </Text>
        <Text style={styles.fareText}>${item.fare.toFixed(2)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Loading rides...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Rides</Text>
        <Text style={styles.subtitle}>Track your ride history</Text>
      </View>

      <View style={styles.filterContainer}>
        {(['all', 'completed', 'cancelled', 'ongoing'] as const).map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text style={[
              styles.filterText,
              selectedFilter === filter && styles.activeFilterText
            ]}>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredRides}
        renderItem={renderRideItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No rides found</Text>
          </View>
        }
      />
    </View>
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
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: appColors.whiteColor,
    opacity: 0.8,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: appColors.whiteColor,
    borderBottomWidth: 1,
    borderBottomColor: appColors.border,
  },
  filterButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: appColors.border,
  },
  activeFilterButton: {
    backgroundColor: appColors.primary,
    borderColor: appColors.primary,
  },
  filterText: {
    fontSize: 14,
    color: appColors.secondaryText,
  },
  activeFilterText: {
    color: appColors.whiteColor,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 20,
  },
  rideCard: {
    backgroundColor: appColors.whiteColor,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: appColors.blackColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  dateText: {
    fontSize: 14,
    color: appColors.secondaryText,
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  routeContainer: {
    marginBottom: 15,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: appColors.primary,
    marginRight: 10,
  },
  destinationDot: {
    backgroundColor: appColors.greenColor,
  },
  line: {
    width: 2,
    height: 20,
    backgroundColor: appColors.border,
    marginLeft: 3,
    marginVertical: 2,
  },
  locationText: {
    fontSize: 16,
    color: appColors.primaryText,
    flex: 1,
  },
  rideFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  passengerText: {
    fontSize: 14,
    color: appColors.secondaryText,
  },
  fareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: appColors.primary,
  },
  loadingText: {
    fontSize: 16,
    color: appColors.secondaryText,
  },
  errorText: {
    fontSize: 16,
    color: appColors.alertRed,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: appColors.secondaryText,
  },
});
