import React from "react";
import { Button } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { useRouter } from "expo-router";
import useToast from "../hooks/useToast";

/**
 * LogoutButton - A button component that logs the user out of the app.
 *
 * On press, it clears the user's authentication context, navigates to the root route,
 * and displays a toast notification indicating a successful logout.
 */
export default function LogoutButton() {
  const { logout } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  return (
    <Button
      mode="outlined"
      icon="logout"
      onPress={() => {
        logout();
        router.replace("/");
        showToast("Logged out successfully!", "success");
      }}
    >
      Logout
    </Button>
  );
}