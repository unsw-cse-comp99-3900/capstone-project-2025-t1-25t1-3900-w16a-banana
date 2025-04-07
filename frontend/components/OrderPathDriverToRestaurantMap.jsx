import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from '@react-google-maps/api';
import { View, Linking } from 'react-native';
import { Text, Button, ActivityIndicator, Divider } from 'react-native-paper';
import useUserLocation from '../hooks/useUserLocation';
import { fetchLocationDetailFromAddress } from '../utils/location';
import { GOOGLE_API_KEY } from '../constants/map';

const icons = {
  driver: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
  restaurant: 'https://maps.google.com/mapfiles/kml/shapes/dining.png',
};

const containerStyle = {
  height: '400px',
  width: '100%',
  borderRadius: '12px',
  marginTop: 12,
};

export default function OrderPathDriverToRestaurantMap({ restaurantAddress }) {
  const { location: driverLocation } = useUserLocation();
  const [restaurantLoc, setRestaurantLoc] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  useEffect(() => {
    const fetchCoordsAndDirections = async () => {
      const rest = await fetchLocationDetailFromAddress(restaurantAddress);
      setRestaurantLoc(rest);

      if (!driverLocation || !rest) return;

      // use the DirectionsService to get the route
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: driverLocation,
          destination: rest,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirections(result);
          } else {
            console.error('Directions request failed:', status);
          }
        }
      );
    };

    if (driverLocation) fetchCoordsAndDirections();
  }, [driverLocation]);

  if (!isLoaded || !driverLocation || !restaurantLoc) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  const center = {
    lat: (driverLocation.lat + restaurantLoc.lat) / 2,
    lng: (driverLocation.lng + restaurantLoc.lng) / 2,
  };

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${driverLocation.lat},${driverLocation.lng}&destination=${restaurantLoc.lat},${restaurantLoc.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <View style={{ marginTop: 6 }}>
      <Text variant="titleMedium">
        Navigate to Restaurant
      </Text>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={12}>
        <Marker
          position={driverLocation}
          icon={{ url: icons.driver, scaledSize: new window.google.maps.Size(30, 30) }}
          title="Driver Location"
        />
        <Marker
          position={restaurantLoc}
          icon={{ url: icons.restaurant, scaledSize: new window.google.maps.Size(30, 30) }}
          title="Restaurant"
        />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      {/* center the button */}
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <Button
          compact
          mode="outlined"
          icon="navigation"
          onPress={handleOpenInGoogleMaps}
          style={{ 
            marginTop: 14,
            width: 'fit-content'
          }}
        >
          Show in Google Maps
        </Button>
      </View>
      <Divider style={{ marginTop: 12, marginBottom: 8 }} />
    </View>
  );
}
