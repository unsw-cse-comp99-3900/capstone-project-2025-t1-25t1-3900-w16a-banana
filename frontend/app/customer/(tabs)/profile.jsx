import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import ProfileAvatar from "../../../components/ProfileAvatar";

export default function Profile() {
  const router = useRouter();
  const { isContextLoading, contextProfile } = useAuth();
  const { showToast } = useToast();

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
      <ProfileAvatar userType="customer"/>

      {/* Username, here do not allow edit */}
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
        <Text style={{ fontSize: 22, fontWeight: "bold" }}>{contextProfile.username}</Text>
      </View>

      {/* Action Buttons */}
      <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
        <Button mode="outlined" icon="heart" onPress={() => router.push("/customer/favourites")}>Favourites</Button>
        <Button mode="outlined" icon="history" onPress={() => router.push("/customer/history")}>History</Button>
      </View>

      {/* Personal Info */}
      <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Personal Information</Text>
          <TouchableOpacity onPress={() => router.push("/customer/EditPersonalInfo")} style={{ padding: 5 }}>
            <Text style={{ color: "#4CAF50" }}>✎</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Username:</Text> {contextProfile.username}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Email:</Text> {contextProfile.email}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Phone:</Text> {contextProfile.phone}</Text>
      </View>

      {/* Address Info */}
      <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7, }}>Primary Address</Text>
          <TouchableOpacity onPress={() => router.push("/customer/EditAddress")} style={{ padding: 5 }}>
            <Text style={{ color: "#4CAF50" }}>✎</Text>
          </TouchableOpacity>
        </View>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Address:</Text> {contextProfile.address}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Suburb:</Text> {contextProfile.suburb}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>State:</Text> {contextProfile.state}</Text>
        <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Postcode:</Text> {contextProfile.postcode}</Text>
      </View>
    </View>
  );
}