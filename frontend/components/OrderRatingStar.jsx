import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View } from "react-native";
import { Text } from "react-native-paper";

/**
 * OrderRatingStar.jsx
 *
 * A reusable component that visually displays a numeric rating using star icons.
 * Supports full stars, half stars, and outlines up to a total of 5 stars.
 * The exact numeric rating is also displayed next to the stars.
 *
 * Props:
 * - rating (number): The numeric rating value (e.g., 4.3). Should be between 0.0 and 5.0.
 *
 * Usage:
 * <OrderRatingStar rating={4.3} />
 */
export default function OrderRatingStar({ rating }) {
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const totalStars = 5;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 4 }}>
      {[...Array(filledStars)].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star" size={20} color="#fbc02d" />
      ))}
      {halfStar && <MaterialCommunityIcons name="star-half-full" size={20} color="#fbc02d" />}
      {[...Array(totalStars - filledStars - (halfStar ? 1 : 0))].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star-outline" size={20} color="#fbc02d" />
      ))}
      <Text style={{ marginLeft: 6 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}