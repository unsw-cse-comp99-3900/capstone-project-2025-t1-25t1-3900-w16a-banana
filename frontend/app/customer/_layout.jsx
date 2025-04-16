import React from "react";
import { Stack } from "expo-router/stack";

/**
 * Layout component for the customer section of the app using Expo Router.
 * 
 * Defines a stack navigator with the "(tabs)" screen and hides the header.
 */
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
