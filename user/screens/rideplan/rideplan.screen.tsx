import React, { useState } from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Text,
  Pressable,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import styles from './styles';
import { external } from '@/styles/external.style';
import { windowHeight, windowWidth } from '@/themes/app.constant';
import { Clock, LeftArrow, PickLocation } from '@/utils/icons';
import { router } from 'expo-router';
import color from '@/themes/app.colors';
import DownArrow from '@/assets/icons/downArrow';
import PlaceHolder from '@/assets/icons/placeHolder';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default function RidePlanScreen() {
  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [marker, setMarker] = useState<any>(null);
  const [currentLocation, setCurrentLocation] = useState<any>(null);
  const [places, setPlaces] = useState<any>([]);
  const [query, setQuery] = useState('');
  const [keyboardAvoidHeight, setKeyboardAvoidHeight] = useState(false);

  const handleInputChange = (text: string) => {
    setQuery(text);
  };

  return (
    <KeyboardAvoidingView
      style={[external.fx_1]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={{ flex: 1 }}>
        {/* --- Map Section --- */}
        <View style={{ flex: 1 }}>
          <MapView
            style={{ flex: 1 }}
            region={region}
            onPress={(e) => setMarker(e.nativeEvent.coordinate)}
            onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
          >
            {marker && <Marker coordinate={marker} />}
            {currentLocation && (
              <Marker
                coordinate={currentLocation}
                pinColor="green"
                title="You are here"
              />
            )}
            {currentLocation && marker && (
              <MapViewDirections
                origin={currentLocation}
                destination={marker}
                apikey={process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!}
                strokeWidth={3}
                strokeColor="blue"
              />
            )}
          </MapView>
        </View>

        {/* --- Bottom Info Section --- */}
        <View style={styles.infoContainer}>
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                position: 'absolute',
                left: windowWidth(10),
                backgroundColor: '#fff',
                borderRadius: 50,
                padding: 8,
                elevation: 3,
              }}
            >
              <LeftArrow />
            </TouchableOpacity>

            <Text
              style={{
                fontSize: windowWidth(25),
                fontWeight: '600',
                textAlign: 'center',
              }}
            >
              Ride Plan
            </Text>
          </View>

          {/* --- Travel Time Section --- */}
          <View
            style={{
              width: windowWidth(340),
              height: windowHeight(50),
              borderRadius: 20,
              backgroundColor: color.lightGray,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: windowHeight(15),
              alignSelf: 'center',
              paddingHorizontal: windowWidth(10),
              paddingVertical: windowHeight(5),
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Clock />
              <Text
                style={{
                  fontSize: windowWidth(16),
                  fontWeight: '600',
                  color: color.secondaryText,
                  marginLeft: windowWidth(8),
                }}
              >
                Travel time info will appear here
              </Text>
              <DownArrow />
            </View>
          </View>

          {/* --- Current Location with Google Places --- */}
          <View
            style={{
              borderWidth: 2,
              borderColor: '#000',
              borderRadius: 15,
              marginVertical: windowHeight(15),
              paddingHorizontal: windowWidth(15),
              paddingVertical: windowHeight(12),
            }}
          >
            {/* Header Row */}
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: windowHeight(10),
              }}
            >
              <PickLocation />
              <Text
                style={{
                  color: '#2371F0',
                  fontSize: 18,
                  fontWeight: '600',
                  marginLeft: 8,
                }}
              >
                Current Location
              </Text>
            </View>

            {/* Google Places Input */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <PlaceHolder />
              <View style={{ flex: 1, marginLeft: 8 }}>
                <GooglePlacesAutocomplete
                  placeholder="Where to?"
                  fetchDetails={true}
                  onPress={(data, details = null) => {
                    setPlaces([
                      {
                        description: data.description,
                        place_id: data.place_id,
                      },
                    ]);
                  }}
                  query={{
                    key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY!,
                    language: 'en',
                  }}
                  styles={{
                    textInputContainer: { width: '100%' },
                    textInput: {
                      height: 40,
                      color: '#000',
                      fontSize: 16,
                      borderBottomWidth: 1,
                      borderColor: '#ccc',
                    },
                    predefinedPlacesDescription: { color: '#1faadb' },
                  }}
                  textInputProps={{
                    onChangeText: (text) => handleInputChange(text),
                    value: query,
                    onFocus: () => setKeyboardAvoidHeight(true),
                  }}
                  onFail={(error) => console.error(error)}
                  debounce={200}
                />
              </View>
            </View>
          </View>

          {/* --- Last Sessions (Places List) --- */}
          <View>
            {places.map((place: any, index: number) => (
              <Pressable
                key={index}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: windowHeight(20),
                }}
                onPress={() => {
                  // Optionally update marker or navigate
                  console.log('Selected:', place.description);
                }}
              >
                <PickLocation />
                <Text
                  style={{
                    color: '#2371F0',
                    fontSize: 18,
                    fontWeight: '600',
                    marginLeft: 8,
                  }}
                >
                  {place.description}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
