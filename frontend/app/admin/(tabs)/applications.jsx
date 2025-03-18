import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { Text, Icon } from "react-native-paper";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import { BACKEND } from "../../../constants/backend";
import ApplicationTable from "../../../components/ApplicationTable";
import MyScrollView from "../../../components/MyScrollView";

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
    <MyScrollView>
      <Text variant="headlineMedium" style={{ marginBottom: 20 }}>
        Pending Applications
      </Text>

      {/* Restaurant Applications Table with Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 10 }}>
        <Icon source="silverware-fork-knife" size={24} color="#4fabc9"/>
        <Text variant="titleMedium">{`Pending Restaurant Applications (Count ${restaurantApplications.length})`}</Text>
      </View>
      <ApplicationTable
        data={restaurantApplications}
        columns={["Name", "ABN", "Suburb", "Postcode"]}
        rowKeys={["name", "abn", "suburb", "postcode"]}
        userType="restaurant"
        forceReload={fetchApplications}
      />

      {/* Driver Applications Table with Icon */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10, marginTop: 20, gap: 10 }}>
        <Icon source="car" size={24} color="#4fabc9"/>
        <Text variant="titleMedium">{`Pending Driver Applications (Count ${driverApplications.length})`}</Text>
      </View>
      <ApplicationTable
        data={driverApplications}
        columns={["First Name", "Last Name", "Driver License"]}
        rowKeys={["first_name", "last_name", "license_number"]}
        userType="driver"
        forceReload={fetchApplications}
      />
    </MyScrollView>
  );
}
