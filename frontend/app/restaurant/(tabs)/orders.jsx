import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { Text, ActivityIndicator } from "react-native-paper";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import useAuth from "../../../hooks/useAuth";
import useToast from "../../../hooks/useToast";
import MyScrollView from "../../../components/MyScrollView";
import OrderCard from "../../../components/OrderCard";
import { List } from "react-native-paper";

import { BACKEND } from "../../../constants/backend";

const ORDER_TYPES = {
  all: "All Current Orders",
  pending: "New Incoming Orders",
  accepted: "In The Kitchen",
  ready_for_pickup: "Waiting for Pickup",
};

export default function Orders() {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [orderType, setOrderType] = useState("all");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!contextProfile?.token) return;
    fetchOrders(orderType);
  }, [contextProfile]);

  const fetchOrders = async (type) => {
    setLoading(true);
    const url = `${BACKEND}/restaurant-order/${type}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      setOrders(response.data);
    } catch (err) {
      showToast("Failed to fetch orders", "error");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const sections = {
    pending: orders.filter((entry) => entry.order.order_status === "PENDING"),
    accepted: orders.filter((entry) => entry.order.order_status === "ACCEPTED"),
    ready_for_pickup: orders.filter((entry) => entry.order.order_status === "READY_FOR_PICKUP"),
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <MyScrollView>
      <Text variant="titleLarge" style={{ marginBottom: 8 }}>
        Restaurant Orders
      </Text>

      {/* dropdown box to pick the list to show */}
      <View style={{ marginBottom: 16, borderWidth: 1, borderRadius: 8, borderColor: "#ccc", overflow: "hidden" }}>
        <Picker
          selectedValue={orderType}
          onValueChange={(value) => setOrderType(value)}
          style={{ height: 45, paddingLeft: 12, fontSize: 14, borderWidth: 1, borderColor: "#ccc" }}
        >
          {Object.entries(ORDER_TYPES).map(([key, label]) => (
            <Picker.Item key={key} label={label} value={key} />
          ))}
        </Picker>
      </View>

      {(orderType === "all" || orderType === "pending") && (
        <List.Accordion
          title={`New Incoming Orders (${sections.pending.length})`}
          titleStyle={{ fontWeight: "bold" }}
          style={{ backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 8 }}
          left={(props) => <List.Icon {...props} icon="alert-circle-outline" />}
        >
          {sections.pending.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </List.Accordion>
      )}

      {(orderType === "all" || orderType === "accepted") && (
        <List.Accordion
          title={`In the Kitchen (${sections.accepted.length})`}
          titleStyle={{ fontWeight: "bold" }}
          style={{ backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 8 }}
          left={(props) => <List.Icon {...props} icon="silverware-fork-knife" />}
        >
          {sections.accepted.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </List.Accordion>
      )}

      {(orderType === "all" || orderType === "ready_for_pickup") && (
        <List.Accordion
          title={`Waiting for Pickup (${sections.ready_for_pickup.length})`}
          titleStyle={{ fontWeight: "bold" }}
          style={{ backgroundColor: "#f5f5f5", borderRadius: 8, marginBottom: 8 }}
          left={(props) => <List.Icon {...props} icon="truck-fast-outline" />}
        >
          {sections.ready_for_pickup.map((entry) => (
            <OrderCard key={entry.order.id} entry={entry} />
          ))}
        </List.Accordion>
      )}
    </MyScrollView>
  );
}
