import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, Marker, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";
import { View } from "react-native";
import { Text, Button, Divider, ActivityIndicator } from "react-native-paper";
import { fetchLocationDetailFromAddress } from "../utils/location";
import { GOOGLE_API_KEY } from "../constants/map";
import useUserLocation from "../hooks/useUserLocation";

const icons = {
  driver: "https://maps.google.com/mapfiles/kml/shapes/cabs.png",
  restaurant: "https://maps.google.com/mapfiles/kml/shapes/dining.png",
  delivery: "https://maps.google.com/mapfiles/kml/shapes/homegardenbusiness.png",
};

export default function OrderPathMapWithRoute({ restaurantAddress, deliveryAddress, mode = "driver-to-restaurant" }) {
  const { location: driverLocation } = useUserLocation();
  const [restaurantLoc, setRestaurantLoc] = useState(null);
  const [deliveryLoc, setDeliveryLoc] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_API_KEY,
  });

  const isDriverToRestaurant = mode === "driver-to-restaurant";

  useEffect(() => {
    const fetchCoords = async () => {
      const rest = await fetchLocationDetailFromAddress(restaurantAddress);
      const deliv = await fetchLocationDetailFromAddress(deliveryAddress);
      setRestaurantLoc(rest);
      setDeliveryLoc(deliv);

      const origin = isDriverToRestaurant ? driverLocation : rest;
      const destination = isDriverToRestaurant ? rest : deliv;

      if (!origin || !destination) return;

      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin,
          destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === "OK") {
            // prevent unnecessary re-renders, only set directions when the direction changes
            if (JSON.stringify(result) !== JSON.stringify(directions)) {
              setDirections(result);
            }
          } else {
            console.error("Failed to get directions:", status);
          }
        }
      );
    };

    if (driverLocation || !isDriverToRestaurant) fetchCoords();
  }, [driverLocation, restaurantAddress, deliveryAddress, mode]);

  // wrap the center with useMemo to avoid unnecessary re-renders
  const center = useMemo(() => {
    // if these variables are not ready, return null
    if (!isLoaded || !restaurantLoc || !deliveryLoc || (isDriverToRestaurant && !driverLocation)) {
      return null;
    }

    if (isDriverToRestaurant) {
      return {
        lat: (driverLocation.lat + restaurantLoc.lat) / 2,
        lng: (driverLocation.lng + restaurantLoc.lng) / 2,
      };
    } else {
      return {
        lat: (restaurantLoc.lat + deliveryLoc.lat) / 2,
        lng: (restaurantLoc.lng + deliveryLoc.lng) / 2,
      };
    }
  }, [driverLocation, restaurantLoc, deliveryLoc, isDriverToRestaurant]);

  const origin = isDriverToRestaurant ? driverLocation : restaurantLoc;
  const destination = isDriverToRestaurant ? restaurantLoc : deliveryLoc;

  const handleOpenInGoogleMaps = () => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const title = isDriverToRestaurant ? "Route to Restaurant" : "Route to Delivery Address";

  if (!isLoaded || !restaurantLoc || !deliveryLoc || (isDriverToRestaurant && !driverLocation)) {
    return <ActivityIndicator style={{ marginTop: 12 }} />;
  }

  return (
    <View style={{ marginTop: 6 }}>
      <Text variant="titleMedium" style={{ marginBottom: 10 }}>{title}</Text>

      <GoogleMap
        mapContainerStyle={{
          height: "450px",
          width: "100%",
          borderRadius: "12px",
          border: "1px solid #ccc",
        }}
        center={center}
        zoom={11}
        options={{
          mapTypeControl: false,
          streetViewControl: false,
        }}
      >
        {isDriverToRestaurant && driverLocation && (
          <Marker
            position={driverLocation}
            icon={{ url: icons.driver, scaledSize: new window.google.maps.Size(30, 30) }}
            title="Driver"
          />
        )}
        <Marker
          position={restaurantLoc}
          icon={{ url: icons.restaurant, scaledSize: new window.google.maps.Size(30, 30) }}
          title="Restaurant"
        />
        <Marker
          position={deliveryLoc}
          icon={{ url: icons.delivery, scaledSize: new window.google.maps.Size(30, 30) }}
          title="Customer"
        />
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>

      <View style={{ display: "flex", alignItems: "center", marginTop: 13 }}>
        <Button
          compact
          mode="outlined"
          icon="navigation"
          onPress={handleOpenInGoogleMaps}
          style={{
            width: "fit-content",
          }}
        >
          Show in Google Maps
        </Button>
      </View>
      <Divider style={{ marginTop: 10, marginBottom: 8 }} />
    </View>
  );
}
