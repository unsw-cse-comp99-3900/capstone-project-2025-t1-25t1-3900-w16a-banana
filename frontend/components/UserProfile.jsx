import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Button } from "react-native-paper";
import { useRouter } from "expo-router";
import ProfileAvatar from "./ProfileAvatar";
import MyScrollView from "./MyScrollView";
import LogoutButton from "./LogoutButton";
import ZoomableImage from "./ZoomableImage";

export default function UserProfile({ userType, userProfile, isSelfProfile = false }) {
  const router = useRouter();

  if (!userProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const isDriver = userType === "driver";
  const isRestaurant = userType === "restaurant";
  const isCustomer = userType === "customer";
  const isAdmin = userType === "admin";

  return (
    <MyScrollView>
      <View style={{ flex: 1, alignItems: "center", paddingHorizontal: 16, paddingVertical: 25, backgroundColor: "#f9f9f9" }}>
        
        {/* Profile Avatar */}
        <ProfileAvatar userType={userType} />

        {/* Display Name */}
        <Text style={{ fontSize: 22, fontWeight: "bold", marginTop: 10 }}>
          {isDriver ? `${userProfile.first_name} ${userProfile.last_name}` :
           isRestaurant ? userProfile.name : 
           isCustomer ? userProfile.username :
           isAdmin? `${userProfile.first_name} ${userProfile.last_name} (Admin)` : ""}
        </Text>

        {/* Registration Status (For Driver & Restaurant) */}
        {(isDriver || isRestaurant) && userProfile.registration_status === "PENDING" && (
          <>
            <Text style={{ marginTop: 10, color: "red", fontSize: 16, textAlign: "center" }}>
              Profile update is under system review.
            </Text>
            <Text style={{ color: "red", fontSize: 16, textAlign: "center" }}>
              Approval required before full access.
            </Text>
          </>
        )}

        {/* Customer Actions */}
        {isSelfProfile && isCustomer && (
          <View style={{ flexDirection: "row", marginTop: 20, gap: 10 }}>
            <Button mode="outlined" icon="heart" onPress={() => router.push("/customer/favourites")}>Favourites</Button>
            <Button mode="outlined" icon="history" onPress={() => router.push("/customer/history")}>History</Button>
          </View>
        )}

        {/* Personal Info Section */}
        <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>
            {isRestaurant ? "Business Information" : "Personal Information"}
          </Text>
          
          {/* Common Fields */}
          {isCustomer && <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Username:</Text> {userProfile.username}</Text>}
          {isDriver && <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Name:</Text> {`${userProfile.first_name} ${userProfile.last_name}`}</Text>}
          {isRestaurant && <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Name:</Text> {userProfile.name}</Text>}
          <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Email:</Text> {userProfile.email}</Text>
          {!isAdmin && <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Phone:</Text> {userProfile.phone}</Text>}

          {/* Driver-Specific Fields */}
          {isDriver && (
            <>
              <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>License Number:</Text> {userProfile.license_number}</Text>
              <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Car Plate:</Text> {userProfile.car_plate}</Text>
            </>
          )}

          {/* Restaurant-Specific Fields */}
          {isRestaurant && (
            <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>ABN:</Text> {userProfile.abn}</Text>
          )}
        </View>

        {/* Address Section */}
        {isCustomer || isRestaurant ? (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Address</Text>
            <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Address:</Text> {userProfile.address}</Text>
            <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Suburb:</Text> {userProfile.suburb}</Text>
            <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>State:</Text> {userProfile.state}</Text>
            <Text style={{ fontSize: 16 }}><Text style={{ fontWeight: "bold" }}>Postcode:</Text> {userProfile.postcode}</Text>
          </View>
        ) : null}

        {/* Business Photos (For Restaurant) */}
        {isRestaurant && (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Business Photos</Text>
            <ZoomableImage imageUrl={userProfile.url_img1} title="Business Photo 1" />
            <ZoomableImage imageUrl={userProfile.url_img2} title="Business Photo 2" />
            <ZoomableImage imageUrl={userProfile.url_img3} title="Business Photo 3" />
          </View>
        )}

        {/* Driver License & Registration Images */}
        {isDriver && (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", paddingBottom: 7 }}>Documents</Text>
            <Text style={{ fontSize: 16, fontWeight: "bold", paddingBottom: 7 }}>License Image:</Text>
            <ZoomableImage imageUrl={userProfile.url_license_image} title="License Image" />
            <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 5 }}>Registration Paper:</Text>
            <ZoomableImage imageUrl={userProfile.url_registration_paper} title="Registration Paper" />
          </View>
        )}

        {/* Actions: Edit Profile & Logout (Only for Self Profile) */}
        {isSelfProfile && (
          <View style={{ flexDirection: "row", marginTop: 20, gap: 30 }}>
            <Button mode="outlined" icon="pencil" onPress={() => router.push(`/${userType}/EditProfile`)}>
              Edit
            </Button>
            <LogoutButton />
          </View>
        )}
      </View>
    </MyScrollView>
  );
}
