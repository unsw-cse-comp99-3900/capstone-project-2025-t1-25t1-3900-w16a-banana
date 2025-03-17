import React from "react";
import { View, Image } from "react-native";
import { useRouter } from "expo-router";
import { Button, Text } from "react-native-paper";

export default function Index() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", padding: 20 }}>
      <Image source={require("../assets/images/icon.png")} style={{ width: 120, height: 120, marginBottom: 20 }} />
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