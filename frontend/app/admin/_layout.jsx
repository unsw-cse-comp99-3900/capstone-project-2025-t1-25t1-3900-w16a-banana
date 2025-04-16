import React from "react";
import { Stack } from "expo-router/stack";

/**
 * Admin layout configuration for the app.
 *
 * Sets up the navigation stack for the admin section, hiding the header for the tabs screen.
 *
 * Returns:
 * - A React component that wraps the admin tab views in a navigation stack.
 */
export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
