import React, { useCallback, useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { Text, ActivityIndicator, TouchableRipple, Badge } from "react-native-paper";
import axios from "axios";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import OrderCard from "../../../components/OrderCard";
import { BACKEND } from "../../../constants/backend";
import { useFocusEffect } from "expo-router";

const TABS = {
  pending: { label: "New Orders" },
  accepted: { label: "In Kitchen" },
  ready_for_pickup: { label: "Pickup Ready" },
};

export default function RestaurantOrdersScreen() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("pending");

  const [pendingOrders, setPendingOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [pickupOrders, setPickupOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // for restaurant, the most import orders are the:
  // pending: new incoming orders
  // accepted: orders in kitchen
  // ready_for_pickup: orders ready for pickup by the driver
  const fetchAllOrders = async () => {
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const [pendingRes, acceptedRes, pickupRes] = await Promise.all([
        axios.get(`${BACKEND}/restaurant-order/pending`, config),
        axios.get(`${BACKEND}/restaurant-order/accepted`, config),
        axios.get(`${BACKEND}/restaurant-order/ready_for_pickup`, config),
      ]);

      setPendingOrders(pendingRes.data || []);
      setAcceptedOrders(acceptedRes.data || []);
      setPickupOrders(pickupRes.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  // use focus effect to start polling, and when the user leaves the screen, stop polling.
  // this is because the bottom nav tabs has the polling on for the pending orders.
  useFocusEffect(
    useCallback(() => {
      if (!contextProfile?.token) return;
      fetchAllOrders();

      // refresh every 10 seconds
      const interval = setInterval(fetchAllOrders, 10000);

      // cleanup function
      return () => clearInterval(interval);
    }, [contextProfile])
  );

  const getActiveOrders = () => {
    switch (activeTab) {
      case "pending":
        return pendingOrders;
      case "accepted":
        return acceptedOrders;
      case "ready_for_pickup":
        return pickupOrders;
      default:
        return [];
    }
  };

  const tabKeys = Object.keys(TABS);
  const activeOrders = getActiveOrders();

  // badge for each tab text, show them on the top right corner of the tab text.
  const badgeValues = {
    "pending": pendingOrders.length,
    "accepted": acceptedOrders.length,
    "ready_for_pickup": pickupOrders.length,
  }

  return (
    <ScrollView style={{ paddingTop: 14, paddingBottom: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 14, paddingHorizontal: 16 }}>
        Restaurant Orders
      </Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Left vertical tabs */}
        <View style={{ width: "18%", backgroundColor: "#f2f2f2", borderRightWidth: 1, borderColor: "#ccc" }}>
          {tabKeys.map((key) => (
            <TouchableRipple key={key} onPress={() => setActiveTab(key)}>
              <View
                style={{
                  paddingVertical: 20,
                  paddingHorizontal: 8,
                  alignItems: "center",
                  backgroundColor: activeTab === key ? "#e0e0e0" : "transparent",
                }}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    textAlign: "center",
                    color: activeTab === key ? "#6200ee" : "#333",
                    fontWeight: activeTab === key ? "bold" : "normal",
                  }}
                >
                  {TABS[key].label}
                </Text>
                {/* if there are orders in this category, show the order count in the badge */}
                {badgeValues[key] > 0 && (
                  <Badge
                    size={18}
                    style={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      backgroundColor: "#8833ff",
                      color: "#fff",
                    }}
                  >
                    {badgeValues[key]}
                  </Badge>
                )}
              </View>
            </TouchableRipple>
          ))}
        </View>

        {/* Right content */}
        <View style={{ flex: 1, padding: 10 }}>
          <Text variant="titleMedium" style={{ marginBottom: 8 }}>
            {TABS[activeTab].label}
          </Text>

          {loading ? (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator />
            </View>
          ) : activeOrders.length === 0 ? (
            <View style={{ alignItems: "center", marginTop: 40 }}>
              <Text variant="bodyMedium" style={{ color: "#999" }}>
                No orders found for this category.
              </Text>
            </View>
          ) : (
            activeOrders.map((entry) => (
              <OrderCard key={entry.order.id} entry={entry} />
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
