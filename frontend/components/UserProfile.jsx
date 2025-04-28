import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Button, Text } from "react-native-paper";
import { useRouter } from "expo-router";
import ProfileAvatar from "./ProfileAvatar";
import MyScrollView from "./MyScrollView";
import LogoutButton from "./LogoutButton";
import ZoomableImage from "./ZoomableImage";

/**
 * UserProfile Component
 *
 * Displays detailed profile information for different user types (customer, driver, restaurant, admin).
 * Shows avatar, personal/business details, address, uploaded documents, and profile actions.
 *
 * userType: string - Type of user ('customer', 'driver', 'restaurant', or 'admin').
 * userProfile: object - The profile data of the user to display.
 * isSelfProfile: boolean - Whether the profile being viewed is the currently logged-in user's own profile.
 */
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
        <Text variant="titleLarge" style={{ fontWeight: "bold", marginTop: 10 }}>
          {isDriver ? `${userProfile.first_name} ${userProfile.last_name}` :
           isRestaurant ? userProfile.name : 
           isCustomer ? userProfile.username :
           isAdmin? `${userProfile.first_name} ${userProfile.last_name} (Admin)` : ""}
        </Text>

        {/* Registration Status (For Driver & Restaurant) */}
        {(isDriver || isRestaurant) && isSelfProfile && userProfile.registration_status === "PENDING" && (
          <>
            <Text variant="titleMedium" style={{ marginTop: 10, color: "red", textAlign: "center" }}>
              Profile update is under system review.
            </Text>
            <Text variant="titleMedium" style={{ color: "red", textAlign: "center" }}>
              The review will be completed within 24 hours.
            </Text>
          </>
        )}

        {/* isDriver, isRestaurant, isSelfProfile, and the status is REJECTEd, ask the user to update the application profile */}
        {(isDriver || isRestaurant) && isSelfProfile && userProfile.registration_status === "REJECTED" && (
          <>
            <Text variant="titleMedium" style={{ marginTop: 10, color: "red", textAlign: "center" }}>
              Your application has been rejected.
            </Text>
            <Text variant="titleMedium" style={{ color: "red", textAlign: "center" }}>
              Please update your profile and wait for approval again.
            </Text>
          </>
        )}

        {/* Personal Info Section */}
        <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold", paddingBottom: 7 }}>
            {isRestaurant ? "Business Information" : "Personal Information"}
          </Text>
          
          {/* Common Fields */}
          {isCustomer && <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Username:</Text> {userProfile.username}</Text>}
          {isDriver && <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Name:</Text> {`${userProfile.first_name} ${userProfile.last_name}`}</Text>}
          {isRestaurant && <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Name:</Text> {userProfile.name}</Text>}
          <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Email:</Text> {userProfile.email}</Text>
          {!isAdmin && <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Phone:</Text> {userProfile.phone}</Text>}

          {/* Driver-Specific Fields */}
          {isDriver && (
            <>
              <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>License Number:</Text> {userProfile.license_number}</Text>
              <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Car Plate:</Text> {userProfile.car_plate}</Text>
            </>
          )}

          {/* Restaurant-Specific Fields */}
          {isRestaurant && (
            <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>ABN:</Text> {userProfile.abn}</Text>
          )}
        </View>

        {/* Address Section */}
        {isCustomer || isRestaurant ? (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold", paddingBottom: 7 }}>Address</Text>
            <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Address:</Text> {userProfile.address}</Text>
            <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Suburb:</Text> {userProfile.suburb}</Text>
            <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>State:</Text> {userProfile.state}</Text>
            <Text variant="titleMedium"><Text style={{ fontWeight: "bold" }}>Postcode:</Text> {userProfile.postcode}</Text>
          </View>
        ) : null}

        {/* Business Photos (For Restaurant) */}
        {isRestaurant && (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold", paddingBottom: 7 }}>Business Photos</Text>
            <ZoomableImage imageUrl={userProfile.url_img1} title="Business Photo 1" />
            <ZoomableImage imageUrl={userProfile.url_img2} title="Business Photo 2" />
            <ZoomableImage imageUrl={userProfile.url_img3} title="Business Photo 3" />
          </View>
        )}

        {/* Driver License & Registration Images */}
        {isDriver && (
          <View style={{ width: "100%", marginTop: 20, paddingVertical: 10, paddingHorizontal: 18, backgroundColor: "#f0f0f0", borderRadius: 10 }}>
            <Text variant="titleMedium" style={{ fontWeight: "bold", paddingBottom: 5 }}>License Image:</Text>
            <ZoomableImage imageUrl={userProfile.url_license_image} title="License Image" />
            <Text variant="titleMedium" style={{ fontWeight: "bold", paddingBottom: 5 }}>Registration Paper:</Text>
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
