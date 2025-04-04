import React from "react";
import { View, Text, Image } from "react-native";
import { Button } from "react-native-paper";
import { BACKEND } from "../constants/backend";
import { router } from "expo-router";

export default function RestaurantListItem({ restaurant }) {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
        backgroundColor: "#fff",
      }}
    >
      {/* Image */}
      <Image
        source={{ uri: `${BACKEND}/${restaurant.url_img1}` }}
        style={{ width: "100%", height: 180 }}
        resizeMode="cover"
      />

      {/* Content */}
      <View style={{ padding: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {restaurant.name}
        </Text>
        <Text style={{ fontSize: 14 }}>
          {restaurant.suburb}, {restaurant.state}
        </Text>
        {restaurant.distance && (
          <Text style={{ color: "gray", marginTop: 2 }}>
            ~{restaurant.distance.toFixed(1)} km away
          </Text>
        )}
        <Text style={{ marginTop: 8, color: "#444", fontStyle: "italic" }}>
          {restaurant.description}
        </Text>

        {/* View Button aligned right */}
        <View style={{ marginTop: 10, alignItems: "flex-end" }}>
          <Button
            mode="text"
            onPress={() => router.push(`/customer/view/restaurant/${restaurant.id}`)}
          >
            View
          </Button>
        </View>
      </View>
    </View>
  );
}
