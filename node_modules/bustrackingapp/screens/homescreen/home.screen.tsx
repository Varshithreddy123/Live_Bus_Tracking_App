import { View, Text } from 'react-native'
import React from 'react'
import { styles } from './styles'
import { commonStyles } from '@/styles/common.style'
import { SafeAreaView } from 'react-native-safe-area-context'
import { external } from '@/styles/external.style'
import { ScreenContainer } from 'react-native-screens'
import LocationSearchBar from '@/components/location/location.search.bar'

export default function HomeScreen() {
  return (
    <View style={[commonStyles.flexContainer,{ backgroundColor: '#fff' }]}>
        <SafeAreaView style={styles.container}>
            <View style={[external.p_5, external.ph_20]}>
                <Text style={{
                    fontFamily: "TT-Octosquares-Medium",
                    fontSize: 20,
                }}
                >
                    Bus Tracking App
                </Text>
                <LocationSearchBar/>
            </View>
        </SafeAreaView>
      
    </View>
  )
  
}




// import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native'
// import React, { useState, useEffect, useRef } from 'react'
// import { styles } from './styles'
// import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
// import { router, useLocalSearchParams } from 'expo-router'
// import axios from 'axios'
// import * as Location from 'expo-location'

// interface BusLocation {
//   latitude: number;
//   longitude: number;
//   heading?: number;
// }

// interface BusStop {
//   id: string;
//   name: string;
//   latitude: number;
//   longitude: number;
//   eta?: string;
// }

// interface BusData {
//   busNumber: string;
//   routeName: string;
//   currentLocation: BusLocation;
//   currentStop?: string;
//   nextStop?: string;
//   eta?: string;
//   distance?: string;
//   speed?: string;
//   occupancy?: string;
//   isActive: boolean;
//   stops: BusStop[];
//   routePolyline: { latitude: number; longitude: number }[];
// }

// export default function LiveTrackingScreen() {
//   const params = useLocalSearchParams();
//   const routeId = params.routeId as string;
//   const busNumber = params.busNumber as string;

//   const [busData, setBusData] = useState<BusData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
//   const [refreshing, setRefreshing] = useState(false);

//   const mapRef = useRef<MapView>(null);
//   const pulseAnim = useRef(new Animated.Value(1)).current;

//   // Pulse animation for live indicator
//   useEffect(() => {
//     const pulse = Animated.loop(
//       Animated.sequence([
//         Animated.timing(pulseAnim, {
//           toValue: 1.3,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//         Animated.timing(pulseAnim, {
//           toValue: 1,
//           duration: 1000,
//           useNativeDriver: true,
//         }),
//       ])
//     );
//     pulse.start();
//     return () => pulse.stop();
//   }, []);

//   // Get user location
//   useEffect(() => {
//     (async () => {
//       const { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== 'granted') {
//         setError('Location permission denied');
//         return;
//       }

//       const location = await Location.getCurrentPositionAsync({});
//       setUserLocation(location);
//     })();
//   }, []);

//   // Fetch bus data
//   useEffect(() => {
//     fetchBusData();
//     const interval = setInterval(fetchBusData, 10000); // Refresh every 10 seconds
//     return () => clearInterval(interval);
//   }, [routeId]);

//   const fetchBusData = async () => {
//     try {
//       if (!refreshing) setLoading(true);
//       setError(null);

//       const response = await axios.get(
//         `${process.env.EXPO_PUBLIC_SERVER_URI}/api/v1/routes/${routeId}/live`
//       );

//       if (response.data.success) {
//         setBusData(response.data.data);
        
//         // Center map on bus location
//         if (response.data.data.currentLocation && mapRef.current) {
//           mapRef.current.animateToRegion({
//             latitude: response.data.data.currentLocation.latitude,
//             longitude: response.data.data.currentLocation.longitude,
//             latitudeDelta: 0.02,
//             longitudeDelta: 0.02,
//           }, 1000);
//         }
//       }
//     } catch (err: any) {
//       console.error('Failed to fetch bus data:', err);
//       setError('Failed to load bus location');
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleRefresh = () => {
//     setRefreshing(true);
//     fetchBusData();
//   };

//   const handleCurrentLocation = async () => {
//     if (userLocation && mapRef.current) {
//       mapRef.current.animateToRegion({
//         latitude: userLocation.coords.latitude,
//         longitude: userLocation.coords.longitude,
//         latitudeDelta: 0.02,
//         longitudeDelta: 0.02,
//       }, 1000);
//     }
//   };

//   const handleCallDriver = () => {
//     // Implement call functionality
//     console.log('Call driver');
//   };

//   const handleShare = () => {
//     // Implement share functionality
//     console.log('Share location');
//   };

//   if (loading && !busData) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#3b82f6" />
//         <Text style={styles.loadingText}>Loading bus location...</Text>
//       </View>
//     );
//   }

//   if (error && !busData) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text style={styles.errorText}>⚠️ {error}</Text>
//         <TouchableOpacity style={styles.retryButton} onPress={fetchBusData}>
//           <Text style={styles.retryButtonText}>Retry</Text>
//         </TouchableOpacity>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       {/* Map */}
//       <View style={styles.mapContainer}>
//         <MapView
//           ref={mapRef}
//           style={styles.map}
//           provider={PROVIDER_GOOGLE}
//           initialRegion={{
//             latitude: busData?.currentLocation.latitude || 0,
//             longitude: busData?.currentLocation.longitude || 0,
//             latitudeDelta: 0.02,
//             longitudeDelta: 0.02,
//           }}
//           showsUserLocation={true}
//           showsMyLocationButton={false}
//           showsCompass={true}
//           loadingEnabled={true}
//         >
//           {/* Bus Marker */}
//           {busData?.currentLocation && (
//             <Marker
//               coordinate={{
//                 latitude: busData.currentLocation.latitude,
//                 longitude: busData.currentLocation.longitude,
//               }}
//               anchor={{ x: 0.5, y: 0.5 }}
//             >
//               <View style={styles.busMarker}>
//                 <Animated.View
//                   style={[
//                     styles.pulseCircle,
//                     {
//                       width: 50,
//                       height: 50,
//                       opacity: 0.3,
//                       transform: [{ scale: pulseAnim }],
//                     },
//                   ]}
//                 />
//                 <View style={styles.busMarkerInner}>
//                   <Text style={{ fontSize: 20 }}>🚌</Text>
//                 </View>
//               </View>
//             </Marker>
//           )}

//           {/* Stop Markers */}
//           {busData?.stops.map((stop) => (
//             <Marker
//               key={stop.id}
//               coordinate={{
//                 latitude: stop.latitude,
//                 longitude: stop.longitude,
//               }}
//               title={stop.name}
//               description={stop.eta ? `ETA: ${stop.eta}` : undefined}
//             >
//               <View style={styles.stopMarker}>
//                 <View style={styles.stopMarkerInner} />
//               </View>
//             </Marker>
//           ))}

//           {/* Route Polyline */}
//           {busData?.routePolyline && busData.routePolyline.length > 0 && (
//             <Polyline
//               coordinates={busData.routePolyline}
//               strokeColor="#3b82f6"
//               strokeWidth={4}
//               lineDashPattern={[1]}
//             />
//           )}
//         </MapView>
//       </View>

//       {/* Header */}
//       <View style={styles.headerContainer}>
//         <View style={styles.headerRow}>
//           <TouchableOpacity
//             style={styles.backButton}
//             onPress={() => router.back()}
//           >
//             <Text style={{ fontSize: 20 }}>←</Text>
//           </TouchableOpacity>

//           <Text style={styles.headerTitle}>
//             {busData?.routeName || 'Bus Route'}
//           </Text>

//           <TouchableOpacity
//             style={styles.menuButton}
//             onPress={() => console.log('Menu')}
//           >
//             <Text style={{ fontSize: 20 }}>⋮</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Current Location Button */}
//       <TouchableOpacity
//         style={styles.currentLocationButton}
//         onPress={handleCurrentLocation}
//       >
//         <Text style={{ fontSize: 20 }}>📍</Text>
//       </TouchableOpacity>

//       {/* Refresh Button */}
//       <TouchableOpacity
//         style={styles.refreshButton}
//         onPress={handleRefresh}
//       >
//         <Text style={{ fontSize: 20 }}>🔄</Text>
//       </TouchableOpacity>

//       {/* Bus Info Card */}
//       {busData && (
//         <View style={styles.busInfoCard}>
//           {/* Header */}
//           <View style={styles.busInfoHeader}>
//             <Text style={styles.busNumber}>Bus {busData.busNumber}</Text>
//             {busData.isActive && (
//               <View style={styles.liveIndicator}>
//                 <View style={styles.liveDot} />
//                 <Text style={styles.liveText}>LIVE</Text>
//               </View>
//             )}
//           </View>

//           {/* Current Stop */}
//           {busData.currentStop && (
//             <View style={styles.busInfoRow}>
//               <Text style={styles.busInfoIcon}>📍</Text>
//               <Text style={styles.busInfoText}>Current Stop</Text>
//               <Text style={styles.busInfoValue}>{busData.currentStop}</Text>
//             </View>
//           )}

//           {/* Next Stop */}
//           {busData.nextStop && (
//             <View style={styles.busInfoRow}>
//               <Text style={styles.busInfoIcon}>⏭️</Text>
//               <Text style={styles.busInfoText}>Next Stop</Text>
//               <Text style={styles.busInfoValue}>{busData.nextStop}</Text>
//             </View>
//           )}

//           {/* Speed */}
//           {busData.speed && (
//             <View style={styles.busInfoRow}>
//               <Text style={styles.busInfoIcon}>⚡</Text>
//               <Text style={styles.busInfoText}>Speed</Text>
//               <Text style={styles.busInfoValue}>{busData.speed}</Text>
//             </View>
//           )}

//           {/* Occupancy */}
//           {busData.occupancy && (
//             <View style={styles.busInfoRow}>
//               <Text style={styles.busInfoIcon}>👥</Text>
//               <Text style={styles.busInfoText}>Occupancy</Text>
//               <Text style={styles.busInfoValue}>{busData.occupancy}</Text>
//             </View>
//           )}

//           <View style={styles.divider} />

//           {/* ETA and Distance */}
//           <View style={styles.etaContainer}>
//             <View>
//               <Text style={styles.etaLabel}>Estimated Arrival</Text>
//               <Text style={styles.etaValue}>{busData.eta || '--'}</Text>
//             </View>
//             <View style={styles.distanceContainer}>
//               <Text style={styles.distanceValue}>{busData.distance || '--'}</Text>
//               <Text style={styles.distanceLabel}>away</Text>
//             </View>
//           </View>

//           {/* Action Buttons */}
//           <View style={styles.actionButtonsContainer}>
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={handleCallDriver}
//             >
//               <Text style={{ fontSize: 18 }}>📞</Text>
//               <Text style={styles.actionButtonText}>Call</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={[styles.actionButton, styles.actionButtonSecondary]}
//               onPress={handleShare}
//             >
//               <Text style={{ fontSize: 18 }}>📤</Text>
//               <Text style={[styles.actionButtonText, styles.actionButtonTextSecondary]}>
//                 Share
//               </Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// }