import React from "react";
import { View } from "react-native";
import useAuth from "../../../hooks/useAuth";
import RestaurantMenu from "../../../components/RestaurantMenu";
import MyScrollView from "../../../components/MyScrollView";
import { Text } from "react-native-paper";

export default function Home() {
  const { contextProfile, isContextLoading } = useAuth();
  console.log(contextProfile);

  if (isContextLoading || !contextProfile) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text variant="titleLarge">Menu Loading...</Text>
      </View>
    );
  }

  return (
    <MyScrollView>
      {/* Header */}
      <View style={{ justifyContent: "center", alignItems: "center", padding: 10 }}>
        {contextProfile.registration_status === "PENDING" ? (
          <Text 
            variant="titleMedium"
            style={{ marginTop: 10, color: "red", textAlign: "center" }}
          >
            Your account is under review by the Admin. Please wait and come back later.
          </Text>
        ) : (
          <>
            <Text 
              variant="titleMedium"
              style={{ fontSize: 20, fontWeight: "bold", textAlign: "center", color: "#4682b4" }}
            >
              Hello {contextProfile.name}, keep your menu fresh and up to date!
            </Text>
          </>
        )}
      </View>

      {/* Show menu only if not pending */}
      {contextProfile.registration_status !== "PENDING" && (
        <>
          <RestaurantMenu restaurantId={contextProfile.id} />
        </>
      )}
    </MyScrollView>
  );
}
