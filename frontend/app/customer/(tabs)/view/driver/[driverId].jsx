import React from "react";
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function ViewDriverPage() {
  const { driverId } = useLocalSearchParams();

  // Now you can fetch or display restaurant data with that ID
  return (
    <View>
      <Text>Viewing restaurant with ID: {driverId}</Text>
    </View>
  );
}