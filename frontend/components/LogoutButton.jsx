import React from "react";
import { Button } from "react-native-paper";
import useAuth from "../hooks/useAuth";
import { useRouter } from "expo-router";
import useToast from "../hooks/useToast";

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