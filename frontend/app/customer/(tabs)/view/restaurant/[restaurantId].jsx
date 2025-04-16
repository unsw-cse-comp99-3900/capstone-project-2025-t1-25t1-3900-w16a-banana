import React from "react";
import { useLocalSearchParams } from "expo-router";
import RestaurantPage from "../../../../../components/RestaurantPage";

/**
 * ViewRestaurantPage component renders the RestaurantPage component for customers.
 */
export default function ViewRestaurantPage() {
  const { restaurantId } = useLocalSearchParams();
  
  return (
    <RestaurantPage restaurantId={restaurantId} />
  );
}
