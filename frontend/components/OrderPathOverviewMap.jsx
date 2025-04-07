import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { fetchLocationDetailFromAddress } from '../utils/location';
import useUserLocation from '../hooks/useUserLocation';
import { ActivityIndicator, View } from 'react-native';
import { GOOGLE_API_KEY } from '../constants/map';
import { Divider, Text } from 'react-native-paper';

// differentiate the icons for driver, restaurant, and delivery locations
const icons = {
  driver: 'https://maps.google.com/mapfiles/kml/shapes/cabs.png',
  restaurant: 'https://maps.google.com/mapfiles/kml/shapes/dining.png',
  delivery: 'https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png',
};

export default function OrderPathOverviewMap({ restaurantAddress, deliveryAddress }) {
  const { location: driverLocation } = useUserLocation();

  const [restaurantLoc, setRestaurantLoc] = useState(null);
  const [deliveryLoc, setDeliveryLoc] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  useEffect(() => {
    const fetchCoords = async () => {
      const rest = await fetchLocationDetailFromAddress(restaurantAddress);
      const delivery = await fetchLocationDetailFromAddress(deliveryAddress);
      setRestaurantLoc(rest);
      setDeliveryLoc(delivery);
    };

    if (driverLocation) fetchCoords();
  }, [driverLocation]);

  if (!isLoaded || !driverLocation || !restaurantLoc || !deliveryLoc) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  // Calculate the center of the 3 points
  const center = {
    lat: (driverLocation.lat + restaurantLoc.lat + deliveryLoc.lat) / 3,
    lng: (driverLocation.lng + restaurantLoc.lng + deliveryLoc.lng) / 3,
  };

  return (
    <View style={{ marginTop: 6 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Order Path Overview
      </Text>
      <GoogleMap 
        mapContainerStyle={{
          height: '400px',
          width: '100%',
          borderRadius: '12px',
        }} 
        center={center} 
        zoom={11}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        <Marker
          position={{ lat: driverLocation.lat, lng: driverLocation.lng }}
          title="Driver Location"
          icon={{
            url: icons.driver,
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        <Marker
          position={{ lat: restaurantLoc.lat, lng: restaurantLoc.lng }}
          title="Restaurant"
          icon={{
            url: icons.restaurant,
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
        <Marker
          position={{ lat: deliveryLoc.lat, lng: deliveryLoc.lng }}
          title="Customer"
          icon={{
            url: icons.delivery,
            scaledSize: new window.google.maps.Size(30, 30),
          }}
        />
      </GoogleMap>
      <Divider style={{ marginTop: 16, marginBottom: 8 }} />
    </View>
  );
}