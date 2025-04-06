import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, Icon } from "react-native-paper";
import { fetchLocationDetailFromAddress, calculateDistance } from "../utils/location";
import useUserLocation from "../hooks/useUserLocation";

export default function OrderPathOverview({ restaurantAddress, deliveryAddress }) {
  const { locationDetails: driverLocation } = useUserLocation();

  const [restaurantLocation, setRestaurantLocation] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState(null);
  const [distance1, setDistance1] = useState(null); // driver -> restaurant
  const [distance2, setDistance2] = useState(null); // restaurant -> customer

  useEffect(() => {
    const getDistance = async () => {
      const restLoc = await fetchLocationDetailFromAddress(restaurantAddress);
      const delivLoc = await fetchLocationDetailFromAddress(deliveryAddress);

      setRestaurantLocation(restLoc);
      setDeliveryLocation(delivLoc);

      const d1 = calculateDistance(driverLocation.lat, driverLocation.lng, restLoc.lat, restLoc.lng);
      const d2 = calculateDistance(restLoc.lat, restLoc.lng, delivLoc.lat, delivLoc.lng);

      setDistance1(d1);
      setDistance2(d2);
    };

    if (!driverLocation) return;
    getDistance();
  }, [driverLocation]);

  if (!driverLocation || !restaurantLocation || !deliveryLocation) return null;

  return (
    <View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        {/* Driver */}
        <View style={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon source="car" size={28} color="#666" />
          <Text variant="bodySmall" style={{ color: "#666" }}>
            {driverLocation.suburb}
          </Text>
        </View>

        {/* Distance to restaurant */}
        <View style={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon source="arrow-right-bold" size={16} color="#aaa" />
          <Text variant="bodySmall" style={{ color: "#888" }}>
            {distance1 ? `${distance1.toFixed(1)} km` : "—"}
          </Text>
        </View>

        {/* Restaurant */}
        <View style={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon source="food" size={28} color="#666" />
          <Text variant="bodySmall" style={{ color: "#666" }}>
            {restaurantLocation.suburb}
          </Text>
        </View>

        {/* Distance to customer */}
        <View style={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon source="arrow-right-bold" size={16} color="#aaa" />
          <Text variant="bodySmall" style={{ color: "#888" }}>
            {distance2 ? `${distance2.toFixed(1)} km` : "—"}
          </Text>
        </View>

        {/* Customer */}
        <View style={{ flexDirection: "column", alignItems: "center", gap: 2 }}>
          <Icon source="home-outline" size={28} color="#666" />
          <Text variant="bodySmall" style={{ color: "#666" }}>
            {deliveryLocation.suburb}
          </Text>
        </View>
      </View>
      <View style={{ height: 1, backgroundColor: '#ddd', marginBottom: 12 }} />
    </View>
  );
}
