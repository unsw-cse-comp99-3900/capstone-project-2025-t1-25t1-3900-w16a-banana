import React from "react";
import { View, Text } from "react-native";
import useAuth from "../../../hooks/useAuth";

export default function Home() {
  const { contextProfile, isContextLoading } = useAuth();
  console.log(contextProfile);

  if (isContextLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome, {contextProfile.first_name}!</Text>
      
      {contextProfile.registration_status === "PENDING" ? (
        <Text style={{ marginTop: 10, color: "red", fontSize: 18, textAlign: "center" }}>
          Your account is under review by the Admin. Please wait and come back later.
        </Text>
      ) : null}
    </View>
  );
}
