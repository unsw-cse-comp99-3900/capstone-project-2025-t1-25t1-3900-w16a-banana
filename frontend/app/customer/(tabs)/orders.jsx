import React, { useEffect, useState, useMemo } from "react";
import { View } from "react-native";
import { Text, ActivityIndicator, Icon } from "react-native-paper";
import { BACKEND, TIME_INTERVAL } from "../../../constants/backend";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import axios from "axios";
import OrderCard from "../../../components/OrderCard";
import MyScrollView from "../../../components/MyScrollView";

export default function Orders() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  // use effect to keep fetching every seconds
  useEffect(() => {
    if (!contextProfile?.token) return;
    fetchOrders();

    // keep doing it every seconds
    const interval = setInterval(fetchOrders, TIME_INTERVAL);
    return () => clearInterval(interval);
  }, [contextProfile]);

  const fetchOrders = async () => {
    const url = `${BACKEND}/customer-order/`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      setOrders(response.data);
    } catch (error) {
      showToast("Failed to fetch orders", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter & sort orders
  const inProgressStatuses = ["PENDING", "RESTAURANT_ACCEPTED", "READY_FOR_PICKUP", "PICKED_UP"];

  const inProgressOrders = useMemo(() => {
    return orders
      .filter((entry) => inProgressStatuses.includes(entry.order.order_status))
      .sort((a, b) => new Date(b.order.order_time) - new Date(a.order.order_time));
  }, [orders]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!loading && inProgressOrders.length === 0) {
    return (
      <MyScrollView>
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 }}>
          <Text variant="titleLarge">
            Active Orders
          </Text>
        </View>
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Icon source="clipboard-text-off" size={60} color="#ccc" />
          <Text variant="titleMedium" style={{ marginTop: 12, color: "#999" }}>
            You have no orders yet.
          </Text>
        </View>
      </MyScrollView>
    );
  }

  return (
    <MyScrollView>
      {/* if no orders, then don't show that section */}
      {inProgressOrders.length > 0 && (
        <View style={{ flexDirection: "column", marginBottom: 4 }}>
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            {`Ongoing Orders (${inProgressOrders.length})`}
          </Text>
          {inProgressOrders.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </View>
      )}
    </MyScrollView>
  );
}
