import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text, Appbar } from "react-native-paper";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import UserProfile from "../components/UserProfile";
import capitalize from "capitalize";

/**
 * Shared profile page component that displays user profile details based on query parameters.
 *
 * This component fetches and displays the profile of a user (customer, driver, restaurant, or admin)
 * using the `type` and `id` query parameters from the URL.
 *
 * Parameters:
 * - type: the user type ('customer', 'driver', 'restaurant', or 'admin') from the route query
 * - id: the ID of the user whose profile is being viewed
 *
 * Displays:
 * - A back button
 * - The user's profile details using the <UserProfile> component
 * - A loading indicator while the data is being fetched
 * - A fallback message if the profile is not found
 */
export default function Profile() {
  const router = useRouter();
  const { type, id } = useLocalSearchParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!type || !id) return;

    // the query param: user_type and user_id
    const url = `${BACKEND}/profile`;
    const params = { user_type: type, user_id: id };
    const fullUrl = `${url}?${new URLSearchParams(params).toString()}`;

    const fetchProfile = async () => {
      try {
        const response = await axios.get(fullUrl);
        setProfile(response.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [type, id]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 10, backgroundColor: "#f9f9f9" }}>
      {/* Back Button */}
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={`${capitalize(type)} Profile`} />
      </Appbar.Header>

      {/* Show User Profile */}
      {profile ? <UserProfile userType={type} userProfile={profile} isSelfProfile={false} /> : (
        <Text style={{ textAlign: "center", marginTop: 20 }}>Profile not found.</Text>
      )}
    </View>
  );
}
