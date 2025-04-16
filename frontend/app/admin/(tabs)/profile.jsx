import React from "react";
import { View, ActivityIndicator } from "react-native";
import useAuth from "../../../hooks/useAuth";
import UserProfile from "../../../components/UserProfile";

/**
 * Displays the admin's profile using the UserProfile component, or a loading indicator if the profile is not yet available.
 */
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
    <UserProfile userType="admin" userProfile={contextProfile} isSelfProfile={true} />
  );
}