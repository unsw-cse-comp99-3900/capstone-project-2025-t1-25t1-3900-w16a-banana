import React from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";
import ImageSource from "../assets/images/icon.png";

/**
 * Index - Landing page component for the SmartEats app.
 * 
 * This screen presents users with the app logo and two main navigation options:
 * - Login: Redirects users to the login page.
 * - Register: Redirects users to the signup page.
 * 
 * Navigation:
 * - Uses Expo Router's `useRouter` hook to navigate to login and signup screens.
 */
export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9", padding: 20 }}>
      <Image source={ImageSource} style={{ width: 120, height: 120, marginBottom: 20 }} />
      <Text variant="headlineLarge" style={{ fontWeight: "bold", marginBottom: 20 }}>
        SmartEats
      </Text>
      {/* login and register button */}
      <Button mode="contained" onPress={() => router.push("/login")} style={{ width: "80%", marginBottom: 10 }}>
        Login
      </Button>
      <Button mode="contained" buttonColor="#28a745" onPress={() => router.push("/signup")} style={{ width: "80%" }}>
        Register
      </Button>
    </View>
  );
}