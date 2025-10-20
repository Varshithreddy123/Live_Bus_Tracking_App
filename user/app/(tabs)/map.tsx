import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import axios from 'axios';
import color from '@/themes/app.colors';

interface BusStand {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  address?: string;
  distance: number;
}

export default function MapScreen() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [busStands, setBusStands] = useState<BusStand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  useEffect(() => {
    if (location) {
      fetchNearbyBusStands();
    }
  }, [location]);

  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access location was denied');
        setLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error('Error getting location:', error);
      setError('Failed to get current location');
      setLoading(false);
    }
  };

  const fetchNearbyBusStands = async () => {
    if (!location) return;

    try {
      const response = await axios.get('http://localhost:8080/api/v1/bus/nearby-stops', {
        params: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          radius: 2000 // 2km radius
        }
      });

      if (response.data.success) {
        setBusStands(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching bus stands:', error);
      // For demo purposes, add some mock data
      setBusStands([
        {
          id: '1',
          name: 'Central Bus Stand',
          latitude: location.coords.latitude + 0.01,
          longitude: location.coords.longitude + 0.01,
          address: 'Central Area',
          distance: 1000
        },
        {
          id: '2',
          name: 'North Bus Stand',
          latitude: location.coords.latitude + 0.02,
          longitude: location.coords.longitude - 0.01,
          address: 'North Area',
          distance: 1500
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const calculateETA = (distance: number): string => {
    // Mock ETA calculation - in real app, this would be based on traffic, bus schedule, etc.
    const walkingSpeed = 5; // km/h
    const timeInHours = distance / 1000 / walkingSpeed;
    const timeInMinutes = Math.round(timeInHours * 60);

    if (timeInMinutes < 1) return 'Arriving now';
    if (timeInMinutes === 1) return '1 min';
    return `${timeInMinutes} mins`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={color.buttonBg} />
        <Text style={styles.loadingText}>Loading map...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Unable to get location</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          pinColor="blue"
        />

        {/* Bus stand markers */}
        {busStands.map((stand) => (
          <Marker
            key={stand.id}
            coordinate={{
              latitude: stand.latitude,
              longitude: stand.longitude,
            }}
            title={stand.name}
            description={`ETA: ${calculateETA(stand.distance)} • ${stand.distance.toFixed(1)}km away`}
            pinColor="red"
          />
        ))}
      </MapView>

      {/* Info overlay */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {busStands.length} bus stands nearby
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.whiteColor,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: color.primaryText,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.whiteColor,
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: color.alertRed,
    textAlign: 'center',
  },
  infoContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: color.whiteColor,
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoText: {
    fontSize: 14,
    color: color.primaryText,
    textAlign: 'center',
  },
});
