import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../store/authContext";
import { ToastProvider } from "../store/toastContext";
import { DialogProvider } from "../store/dialogContext";

/**
 * Root layout component for the app.
 *
 * Wraps the entire application with global providers:
 * - AuthProvider: Manages user authentication state.
 * - ToastProvider: Enables global toast notifications.
 * - PaperProvider: Provides React Native Paper theme and components.
 * - DialogProvider: Enables global dialog modals.
 *
 * Renders the app's navigation stack without headers.
 */
export default function Layout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PaperProvider>
          <DialogProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </DialogProvider>
        </PaperProvider>
      </ToastProvider>
    </AuthProvider>
  );
}