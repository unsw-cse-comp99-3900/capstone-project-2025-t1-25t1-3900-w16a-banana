import React from "react";
import { View, Image } from "react-native";
import { Button, Text } from "react-native-paper";
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
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          {restaurant.name}
        </Text>
        <Text variant="titleSmall">
          {restaurant.suburb}, {restaurant.state}
        </Text>
        {restaurant.distance && (
          <Text variant="titleSmall" style={{ color: "gray" }}>
            ~ {restaurant.distance.toFixed(1)} km away
          </Text>
        )}
        <Text variant="titleSmall" style={{ color: "#444", fontStyle: "italic" }}>
          {restaurant.description}
        </Text>

        {/* View Button aligned right */}
        <View style={{ marginTop: 10, alignItems: "flex-end" }}>
          <Button
            mode="text"
            onPress={() => {
              router.push({
                pathname: `/customer/view/restaurant/${restaurant.id}`,
                params: { restaurantId: restaurant.id, from: "/customer" },
              });
            }}
          >
            View
          </Button>
        </View>
      </View>
    </View>
  );
}
