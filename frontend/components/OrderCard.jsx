import React, { useState } from "react";
import { View, Image } from "react-native";
import { Text, List, Chip } from "react-native-paper";
import { BACKEND } from "../constants/backend";
import capitalize from "capitalize";

// Utility for status badge colors (customize freely)
const statusColorMap = {
  PENDING: "#FFA500",
  ACCEPTED: "#2196F3",
  READY_FOR_PICKUP: "#00BCD4",
  PICKED_UP: "#673AB7",
  DELIVERED: "#4CAF50",
  CANCELLED: "#F44336",
};

export default function OrderCard({ entry }) {
  const [expanded, setExpanded] = useState(false);

  const { order, restaurant, items } = entry;

  const toggleExpanded = () => setExpanded(!expanded);

  const subtotal = order.order_price;
  const delivery = order.delivery_fee;
  const total = order.total_price;

  const formattedDate = new Date(order.order_time).toLocaleString();

  return (
    <View
      style={{
        backgroundColor: "#f9f9f9",
        borderRadius: 12,
        padding: 12,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header: Restaurant + Status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={{ uri: `${BACKEND}/${restaurant.url_profile_image}` }}
            style={{ width: 30, height: 30, borderRadius: 15 }}
          />
          <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
            {restaurant.name}
          </Text>
        </View>

        <Chip
          style={{
            backgroundColor: statusColorMap[order.order_status],
          }}
          textStyle={{ color: "#fff", fontWeight: "bold" }}
        >
          {capitalize.words(order.order_status.replace("_", " "))}
        </Chip>
      </View>

      {/* Order Meta */}
      <View style={{ marginTop: 8 }}>
        <Text variant="bodySmall" style={{ color: "#666" }}>
          Ordered at: {formattedDate}
        </Text>
        <Text variant="bodySmall" style={{ color: "#666" }}>
          Deliver to: {order.address}, {order.suburb}, {order.state} {order.postcode}
        </Text>
      </View>

      {/* Price Summary */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 8 }}>
        <Text variant="titleSmall" style={{ fontWeight: "600" }}>
          Total:
        </Text>
        <Text variant="titleSmall" style={{ fontWeight: "bold" }}>
          ${total.toFixed(2)}
        </Text>
      </View>

      {/* Accordion */}
      <List.Accordion
        title="View Items"
        expanded={expanded}
        onPress={toggleExpanded}
        style={{ backgroundColor: "transparent", paddingLeft: 0 }}
        titleStyle={{ fontWeight: "bold", fontSize: 15 }}
      >
        {items.map((item) => (
          <View
            key={item.id}
            style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}
          >
            <Image
              source={{ uri: `${BACKEND}/${item.menu_item.url_img}` }}
              style={{ width: 40, height: 40, borderRadius: 8 }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text variant="bodyMedium">{item.menu_item.name}</Text>
              <Text variant="bodySmall" style={{ color: "#888" }}>
                ${item.price.toFixed(2)} × {item.quantity}
              </Text>
            </View>
          </View>
        ))}
      </List.Accordion>
    </View>
  );
}
