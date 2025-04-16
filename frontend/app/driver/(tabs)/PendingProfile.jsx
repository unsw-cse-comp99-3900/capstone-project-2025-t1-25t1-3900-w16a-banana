import React from "react";
import { View, Text } from "react-native";
import useAuth from "../../../hooks/useAuth";

/**
 * Displays the driver's pending or rejected registration status.
 *
 * Shows a loading state until the authentication context is ready.
 * Once loaded, it displays the driver's first name and a message:
 * - If registration is "PENDING": informs the user their application is under review.
 * - If registration is "REJECTED": advises the user to update their profile for re-approval.
 */
export default function PendingProfile() {
  const { contextProfile, isContextLoading } = useAuth();

  if (isContextLoading || !contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>Welcome, {contextProfile.first_name }!</Text>
      
      {contextProfile.registration_status === "PENDING" ? (
        <Text style={{ marginTop: 10, color: "red", fontSize: 18, textAlign: "center" }}>
          Your account is under review by the Admin. Please wait and come back later.
        </Text>
      ) : null}

      {/* when the status is REJECTED, ask the user to update the profile and wait for approval again */}
      {contextProfile.registration_status === "REJECTED" ? (
        <Text style={{ marginTop: 10, color: "red", fontSize: 18, textAlign: "center" }}>
          Your driver application has been rejected. Please update your profile and wait for approval again.
        </Text>
      ) : null}
    </View>
  );
}
