import React, { useEffect, useState, useMemo, useCallback } from "react";
import { View, ScrollView } from "react-native";
import { Calendar } from "react-native-calendars";
import { Text, ActivityIndicator, Divider } from "react-native-paper";
import { format } from "date-fns";
import axios from "axios";
import MyScrollView from "./MyScrollView";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import { BACKEND } from "../constants/backend";
import OrderCard from "./OrderCard";
import { useFocusEffect } from "expo-router";

export default function OrderHistoryPage() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));

  useFocusEffect(
    useCallback(() => {
      if (!contextProfile?.token) return;
      fetchOrders();
    }, [contextProfile])
  );

  const fetchOrders = async () => {
    const url = `${BACKEND}/${contextProfile.role}-order/all`;
    const config = {
      headers: { Authorization: contextProfile.token },
    };

    try {
      const res = await axios.get(url, config);
      setOrders(res.data || []);
    } catch (err) {
      console.error(err);
      showToast("Failed to fetch orders", "error");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders
      .filter((entry) =>
        entry.order.order_time.startsWith(selectedDate)
      )
      .sort((a, b) => new Date(a.order.order_time) - new Date(b.order.order_time));
  }, [orders, selectedDate]);

  return (
    <MyScrollView>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>
        Order History
      </Text>

      {/* Calendar Section */}
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          [selectedDate]: {
            selected: true,
            marked: true,
            selectedColor: "#2196F3",
          },
        }}
        style={{ marginBottom: 16, borderRadius: 8, overflow: "hidden" }}
      />

      <Divider style={{ marginBottom: 16 }} />

      {loading ? (
        <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40 }}>
          <ActivityIndicator />
        </View>
      ) : filteredOrders.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Text variant="bodyMedium" style={{ color: "#999" }}>
            No orders found for {selectedDate}
          </Text>
        </View>
      ) : (
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text variant="bodyMedium">
              Orders for {selectedDate}
            </Text>
            <Text variant="bodySmall" style={{ color: "#999" }}>
              {filteredOrders.length} orders
            </Text>
          </View>
          {filteredOrders.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </View>
      )}
    </MyScrollView>
  );
}
