import React from "react";
import { useLocalSearchParams } from "expo-router";
import RestaurantPage from "../../../../../components/RestaurantPage";

export default function ViewRestaurantPage() {
  const { restaurantId } = useLocalSearchParams();
  
  return (
    <RestaurantPage restaurantId={restaurantId} />
  );
}
