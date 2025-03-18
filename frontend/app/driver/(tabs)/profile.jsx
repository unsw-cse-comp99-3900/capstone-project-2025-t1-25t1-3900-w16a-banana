import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import ProfileAvatar from "../../../components/ProfileAvatar";
import LogoutButton from "../../../components/LogoutButton";

export default function Profile() {
  const router = useRouter();
  const { isContextLoading, contextProfile } = useAuth();
  const { showToast } = useToast();

  console.log(contextProfile);

  if (isContextLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 16, paddingVertical: 25, backgroundColor: "#f9f9f9" }}>
      {/* Profile Image Section */}
      <ProfileAvatar userType="driver" />

      {/* Username, here do not allow edit */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{contextProfile.first_name} {contextProfile.last_name}</Text>
      </View>

      {/* Registration Status Indicator */}
      {contextProfile.registration_status === "PENDING" ? (
        <>
          <Text style={{ marginTop: 10, color: "red", fontSize: 16, textAlign: "center" }}>
            Your profile update is under system review. 
          </Text>
          <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
            After approval, you can start receiving orders.
          </Text>
        </>
      ) : null}

      {/* Personal Info */}
      <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Personal Information</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Email:</Text> {contextProfile.email}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Phone:</Text> {contextProfile.phone}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>License Number:</Text> {contextProfile.license_number}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Car Plate:</Text> {contextProfile.car_plate}</Text>
      </View>

      {/* Profile update button */}
      <View style={{ flexDirection: "row", marginTop: 20 }}>
        <Button mode="outlined" icon="pencil" onPress={() => router.push("/driver/EditProfile")}>Edit Profile</Button>
      </View>

      {/* Logout Button */}
      <LogoutButton />
    </View>
  );
}
