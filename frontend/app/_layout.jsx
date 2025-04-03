import React from "react";
import { Stack } from "expo-router";
import { PaperProvider } from "react-native-paper";
import { AuthProvider } from "../store/authContext";
import { ToastProvider } from "../store/toastContext";
import { DialogProvider } from "../store/dialogContext";

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