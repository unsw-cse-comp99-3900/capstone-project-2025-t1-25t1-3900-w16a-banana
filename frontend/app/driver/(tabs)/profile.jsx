import React from "react";
import { View, ActivityIndicator } from "react-native";
import useAuth from "../../../hooks/useAuth";
import UserProfile from "../../../components/UserProfile";

export default function Profile() {
  const { contextProfile } = useAuth();

  if (!contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <UserProfile userType="driver" userProfile={contextProfile} isSelfProfile={true} />
  );
}