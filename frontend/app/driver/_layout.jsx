import React from "react";
import { Stack } from "expo-router/stack";

/**
 * This is the layout for the driver app.
 */
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
