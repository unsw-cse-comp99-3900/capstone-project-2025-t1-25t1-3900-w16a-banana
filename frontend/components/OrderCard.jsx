import React, { useState } from "react";
import { View, Image, Pressable } from "react-native";
import { Text, List, Chip, Button } from "react-native-paper";
import { BACKEND } from "../constants/backend";
import capitalize from "capitalize";
import ApprovedGIF from "../assets/images/approved.gif";
import DeliveryGIF from "../assets/images/delivery.gif";
import PendingGIF from "../assets/images/pending.gif";
import PickupGIF from "../assets/images/pickup.gif";
import useAuth from "../hooks/useAuth";
import useToast from "../hooks/useToast";
import useDialog from "../hooks/useDialog";
import { router } from "expo-router";

// Utility for status badge colors (customize freely)
const statusColorMap = {
  PENDING: "#FFA500",
  ACCEPTED: "#2196F3",
  READY_FOR_PICKUP: "#00BCD4",
  PICKED_UP: "#673AB7",
  DELIVERED: "#4CAF50",
  CANCELLED: "#F44336",
};

const statusGIFMap = {
  PENDING: PendingGIF,
  ACCEPTED: ApprovedGIF,
  READY_FOR_PICKUP: PickupGIF,
  PICKED_UP: DeliveryGIF,
};

export default function OrderCard({ entry }) {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

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
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 12,
        overflow: "hidden",
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 14,
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      {/* Header: Left shows the restaurant info + bottom chip, right shows the GIF */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        {/* top: restaurant info, bottom: badge */}
        <View style={{ flexDirection: "column", flex: 1, gap: 8}}>
          <Pressable
            onPress={() => router.push(`/customer/view/restaurant/${restaurant.id}`)}
            style={{ 
              flexDirection: "row", 
              alignItems: "center", 
              gap: 8,
              cursor: "pointer",
            }}
          >
            <Image
              source={{ uri: `${BACKEND}/${restaurant.url_img1}` }}
              style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 4 }}
            />
            <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
              {restaurant.name}
            </Text>
          </Pressable>
          {/* a chip to show the status */}
          <Text
            variant="labelMedium"
            style={{
              fontWeight: "bold",
              backgroundColor: statusColorMap[order.order_status],
              color: "#fff",
              width: "fit-content",
              textTransform: "uppercase",
              paddingHorizontal: 6,
              paddingVertical: 3,
              borderRadius: 8,
            }}
          >
            {`#${capitalize.words(order.order_status.replace("_", " "))}`}
          </Text>
        </View>
        {/* right: to show the GIF */}
        <Image
          source={statusGIFMap[order.order_status]}
          style={{ width: 60, height: 60 }}
          resizeMode="cover"
        />
      </View>

      {/* Accordion */}
      <List.Accordion
        title={expanded ? "Hide Items" : "Items"}
        expanded={expanded}
        onPress={toggleExpanded}
        style={{ backgroundColor: "transparent", padding: 0, marginBottom: 8 }}
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

      {/* Price Summary */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
        <Text variant="titleSmall">Total:</Text>
        <Text variant="titleSmall">${total.toFixed(2)}</Text>
      </View>

      {/* Order Info Rows */}
      <View style={{ marginBottom: 8, gap: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodySmall" style={{ color: "#666" }}>Order Time:</Text>
          <Text variant="bodySmall" style={{ color: "#666" }}>{formattedDate}</Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodySmall" style={{ color: "#666" }}>Deliver To:</Text>
          <Text variant="bodySmall" style={{ color: "#666", textAlign: "right", flex: 1 }}>
            {order.address}, {order.suburb}, {order.state} {order.postcode}
          </Text>
        </View>

        {order.pickup_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodySmall" style={{ color: "#666" }}>Pickup Ready At:</Text>
            <Text variant="bodySmall" style={{ color: "#666" }}>
              {new Date(order.pickup_time).toLocaleString()}
            </Text>
          </View>
        )}

        {order.delivery_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodySmall" style={{ color: "#666" }}>Delivered At:</Text>
            <Text variant="bodySmall" style={{ color: "#666" }}>
              {new Date(order.delivery_time).toLocaleString()}
            </Text>
          </View>
        )}
      </View>

      {/* buttons on the far right */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 8 }}>
        {/* view the details */}
        <Button
          mode="text"
          onPress={() => alert("TODO")}
        >
          Details
        </Button>
        {/* approve button: only for the restaurant, and when the order is pending */}
        <Button
          mode="text"
          onPress={() => alert("TODO")}
        >
          Approve
        </Button>
      </View>
    </View>
  );
}
