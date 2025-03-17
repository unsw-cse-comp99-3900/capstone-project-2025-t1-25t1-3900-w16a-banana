import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../store/authContext";
import { ToastProvider } from "../store/toastContext";

export default function Layout() {
  return (
    <AuthProvider>
      <ToastProvider>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </PaperProvider>
      </ToastProvider>
    </AuthProvider>
  );
}