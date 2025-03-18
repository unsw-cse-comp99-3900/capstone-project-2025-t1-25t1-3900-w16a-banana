import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text } from "react-native-paper";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BACKEND } from "../../../constants/backend";
import ApplicationTable from "../../../components/ApplicationTable";

export default function Applications() {
  const { contextProfile } = useAuth();
  const [restaurantApplications, setRestaurantApplications] = useState([]);
  const [driverApplications, setDriverApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contextProfile) return;
    fetchApplications();
  }, [contextProfile]);

  const fetchApplications = async () => {
    try {
      const restaurantRes = await axios.get(`${BACKEND}/admin/pending/restaurant`, {
        headers: { Authorization: contextProfile.token },
      });
      const driverRes = await axios.get(`${BACKEND}/admin/pending/driver`, {
        headers: { Authorization: contextProfile.token },
      });

      console.log("Restaurant Applications:", restaurantRes.data);
      console.log("Driver Applications:", driverRes.data);

      setRestaurantApplications(restaurantRes.data);
      setDriverApplications(driverRes.data);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text variant="headlineMedium" style={{ marginBottom: 10 }}>
        Pending Applications
      </Text>

      {/* Restaurant Applications Table */}
      <Text variant="titleMedium" style={{ marginBottom: 5 }}>Pending Restaurants</Text>
      <ApplicationTable
        data={restaurantApplications}
        columns={["Name"]}
        rowKeys={["name"]}
        userType="restaurant"
      />

      {/* Driver Applications Table */}
      <Text variant="titleMedium" style={{ marginBottom: 5, marginTop: 20 }}>Pending Drivers</Text>
      <ApplicationTable
        data={driverApplications}
        columns={["First Name", "Last Name"]}
        rowKeys={["first_name", "last_name"]}
        userType="driver"
      />
    </View>
  );
}
