import React, { useCallback, useState } from "react";
import { View, ScrollView } from "react-native";
import {
  Text,
  ActivityIndicator,
  TouchableRipple,
  Badge,
} from "react-native-paper";
import axios from "axios";
import { useFocusEffect } from "expo-router";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import OrderCard from "../../../components/OrderCard";
import { BACKEND } from "../../../constants/backend";

const TABS = {
  new: { label: "New Orders" },
  to_pickup: { label: "To Pick Up" },
  delivering: { label: "Delivering" },
};

export default function DriverOrdersScreen() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState("new");

  const [newOrders, setNewOrders] = useState([]);
  const [toPickupOrders, setToPickupOrders] = useState([]);
  const [deliveringOrders, setDeliveringOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    if (!contextProfile?.token) return;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const [newRes, pickupRes, deliveringRes] = await Promise.all([
        axios.get(`${BACKEND}/driver-order/new`, config),
        axios.get(`${BACKEND}/driver-order/to_pickup`, config),
        axios.get(`${BACKEND}/driver-order/delivering`, config),
      ]);

      setNewOrders(newRes.data || []);
      setToPickupOrders(pickupRes.data || []);
      setDeliveringOrders(deliveringRes.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch driver orders", "error");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllOrders();

      const interval = setInterval(fetchAllOrders, 10000);
      return () => clearInterval(interval);
    }, [contextProfile])
  );

  const getActiveOrders = () => {
    switch (activeTab) {
      case "new":
        return newOrders;
      case "to_pickup":
        return toPickupOrders;
      case "delivering":
        return deliveringOrders;
      default:
        return [];
    }
  };

  const tabKeys = Object.keys(TABS);
  const activeOrders = getActiveOrders();

  const badgeValues = {
    new: newOrders.length,
    to_pickup: toPickupOrders.length,
    delivering: deliveringOrders.length,
  };

  return (
    <ScrollView style={{ paddingTop: 14, paddingBottom: 20 }}>
      <Text variant="titleLarge" style={{ marginBottom: 14, paddingHorizontal: 16 }}>
        Driver Orders
      </Text>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Left vertical tabs */}
        <View
          style={{
            width: "20%",
            backgroundColor: "#f2f2f2",
            borderRightWidth: 1,
            borderColor: "#ccc",
          }}
        >
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
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
