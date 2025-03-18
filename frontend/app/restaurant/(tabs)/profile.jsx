import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import useAuth from "../../../hooks/useAuth";
import MyScrollView from "../../../components/MyScrollView";
import ZoomableImage from "../../../components/ZoomableImage";
import LogoutButton from "../../../components/LogoutButton";
import ProfileAvatar from "../../../components/ProfileAvatar";

export default function Profile() {
  const router = useRouter();
  const { isContextLoading, contextProfile } = useAuth();

  console.log(contextProfile);

  if (isContextLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <MyScrollView>
      <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 16, paddingVertical: 25, backgroundColor: "#f9f9f9" }}>
        <ProfileAvatar userType="restaurant" />
        
        {/* Business Name */}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginBottom: 10 }}>{contextProfile.name}</Text>

        {/* Registration Status Indicator */}
        {contextProfile.registration_status === "PENDING" && (
          <>
            <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
              Your profile update is under system review.
            </Text>
            <Text style={{ color: "red", fontSize: 16, textAlign: "center", marginBottom: 10 }}>
              After approval, your restaurant will be listed.
            </Text>
          </>
        )}

        {/* Business Information */}
        <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Business Information</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Email:</Text> {contextProfile.email}</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Phone:</Text> {contextProfile.phone}</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>ABN:</Text> {contextProfile.abn}</Text>
        </View>

        {/* Address Information */}
        <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Address Information</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Address:</Text> {contextProfile.address}</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Suburb:</Text> {contextProfile.suburb}</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>State:</Text> {contextProfile.state}</Text>
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Postcode:</Text> {contextProfile.postcode}</Text>
        </View>

        {/* Business Photos */}
        <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Business Photos</Text>
          <ZoomableImage imageUrl={contextProfile.url_img1} title="Business Photo 1" />
          <ZoomableImage imageUrl={contextProfile.url_img2} title="Business Photo 2" />
          <ZoomableImage imageUrl={contextProfile.url_img3} title="Business Photo 3" />
        </View>

        {/* Edit Profile Button + Logout button */}
        <View style={{ flexDirection: "row", marginTop: 20, gap: 30 }}>
          <Button mode="outlined" icon="pencil" onPress={() => router.push("/restaurant/EditProfile")}>
            Edit
          </Button>
          <LogoutButton />
        </View>
      </View>
    </MyScrollView>
  );
}
