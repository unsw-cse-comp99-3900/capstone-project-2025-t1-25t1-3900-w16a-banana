import React, { useEffect, useState } from "react";
import { View, Image, Pressable } from "react-native";
import { Text, List, Chip, Button, Icon } from "react-native-paper";
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
import { calculateDistance, fetchLocationDetailFromAddress } from "../utils/location";
import OrderPathOverview from "./OrderPathOverview";
import axios from "axios";

// colors for different statuses
const statusColorMap = {
  PENDING: "#FFA500",
  RESTAURANT_ACCEPTED: "#2196F3",
  READY_FOR_PICKUP: "#00BCD4",
  PICKED_UP: "#9977d4",
  DELIVERED: "#4CAF50",
  CANCELLED: "#f7776e",
};

const statusTextMap = {
  PENDING: "Pending",
  RESTAURANT_ACCEPTED: "Restaurant Accepted",
  READY_FOR_PICKUP: "Ready for Pickup",
  PICKED_UP: "On the Way",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

const statusGIFMap = {
  PENDING: PendingGIF,
  RESTAURANT_ACCEPTED: ApprovedGIF,
  READY_FOR_PICKUP: PickupGIF,
  PICKED_UP: DeliveryGIF,
};

// This component shows a simplified view for one order. 
// It is used for 3 user roles: customer, restaurant, and driver.
export default function OrderCard({ entry }) {
  console.log(entry);
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [expanded, setExpanded] = useState(false);

  const { order, restaurant, items, customer } = entry;

  const toggleExpanded = () => setExpanded(!expanded);

  const subtotal = order.order_price;
  const delivery = order.delivery_fee;
  const total = order.total_price;

  // for the driver, display the pickup address to the delivery address
  const restaurantAddress = {
    address: restaurant.address,
    suburb: restaurant.suburb,
    state: restaurant.state,
    postcode: restaurant.postcode,
  };

  const deliveryAddress = {
    address: order.address,
    suburb: order.suburb,
    state: order.state,
    postcode: order.postcode,
  };

  // restaurant: accept or reject the order,
  // action = "accept" or "reject", "ready"
  const restaurantAcceptRejectReadyOrder = (action) => {
    // showDialog to confirm the action
    showDialog({
      title: `Order Action Confirmation`,
      message: action === "ready" ? "Is this order ready for pickup?" : `Are you sure you want to ${action} this order?`,
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        const url = `${BACKEND}/restaurant-order/orders/${action}/${order.id}`;
        const config = { headers: { Authorization: contextProfile.token } };
    
        try {
          await axios.post(url, {}, config);

          if (action === "ready") {
            showToast("Order is ready for pickup", "success");
          } else {
            showToast(`Order ${action === "accept" ? "accepted" : "rejected"}`, "success");
          }
        } catch (error) {
          console.error(error);
          showToast(`Failed to ${action} order`, "error");
        }
      }
    });
  };

  // driver: accept the order
  const driverAcceptOrder = () => {
    // confirm the action
    showDialog({
      title: "Accept Order Confirmation",
      message: "Are you sure you want to accept this order?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        const url = `${BACKEND}/driver-order/order/accept/${order.id}`;
        const config = { headers: { Authorization: contextProfile.token } };
    
        try {
          await axios.post(url, {}, config);
          showToast("Order accepted", "success");
        } catch (error) {
          console.error(error);
          showToast("Failed to accept order", "error");
        }
      }
    });
  };

  const driverPickupOrder = () => {
    // confirm the action
    showDialog({
      title: "Pickup Order Confirmation",
      message: "Have you picked up the order?",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        const url = `${BACKEND}/driver-order/order/pickup/${order.id}`;
        const config = { headers: { Authorization: contextProfile.token } };
    
        try {
          await axios.post(url, {}, config);
          showToast("Order picked up", "success");
        } catch (error) {
          console.error(error);
          showToast("Failed to confirm pickup", "error");
        }
      }
    });
  };

  const driverFinishDelivery = () => {
    // confirm the action
    showDialog({
      title: "Finish Delivery Confirmation",
      message: "Please confirm that you have delivered the order.",
      confirmText: "Yes",
      cancelText: "No",
      onConfirm: async () => {
        const url = `${BACKEND}/driver-order/order/complete/${order.id}`;
        const config = { headers: { Authorization: contextProfile.token } };
    
        try {
          await axios.post(url, {}, config);
          showToast("Order delivered", "success");
        } catch (error) {
          console.error(error);
          showToast("Failed to finish delivery", "error");
        }
      }
    });
  };
  
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
      {/* show the order ID, total 5 digits, and the chip for the status */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          Order #{String(order.id).padStart(5, "0")}
        </Text>
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
          #{capitalize.words(statusTextMap[order.order_status])}
        </Text>
      </View>

      {/* Divider */}
      <View style={{ height: 1, backgroundColor: '#ddd', marginBottom: 8 }} />

      {/* for the driver only, show the overview of the path */}
      {contextProfile?.role === "driver" && (
        <OrderPathOverview
          restaurantAddress={restaurantAddress}
          deliveryAddress={deliveryAddress}
          orderStatus={order.order_status}
        />
      )}
      
      {/* Header: Left shows the info, right shows the GIF */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        {/* When the user is a customer, sees the restaurant avatar + restaurant name, pressable */}
        {contextProfile?.role === "customer" && (
          <Pressable
            onPress={() => router.push(`/${contextProfile.role}/view/restaurant/${restaurant.id}`)}
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
            <Text variant="titleMedium">
              {restaurant.name}
            </Text>
          </Pressable>
        )}
        {/* When the user is a driver, top: From xxx, bottom: to xxx */}
        {contextProfile?.role === "driver" && (
          <View style={{ flexDirection: "column", gap: 2 }}>
            <Text variant="bodyMedium">
              From: {restaurant.name}
            </Text>
            <Text variant="bodyMedium">
              To Customer: {customer.username}
            </Text>
          </View>
        )}
        {/* When the user is a restaurant, only see the customer name */}
        {contextProfile?.role === "restaurant" && (
          <Text variant="titleMedium">
            {`Customer: ${customer.username}`}
          </Text>
        )}
        {/* right: to show the GIF, when the order status is not delivered or cancelled */}
        {order.order_status !== "DELIVERED" && order.order_status !== "CANCELLED" && (
          <Image
            source={statusGIFMap[order.order_status]}
            style={{ width: 60, height: 60 }}
            resizeMode="cover"
          />
        )}
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
      <View style={{ marginBottom: 12, gap: 4 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodySmall" style={{ color: "#666" }}>Deliver To:</Text>
          <Text variant="bodySmall" style={{ color: "#666", textAlign: "right", flex: 1 }}>
            {order.address}, {order.suburb}, {order.state} {order.postcode}
          </Text>
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodySmall" style={{ color: "#666" }}>Order Created At:</Text>
          <Text variant="bodySmall" style={{ color: "#666" }}>
            {order.order_time}
          </Text>
        </View>

        {order.pickup_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodySmall" style={{ color: "#666" }}>Driver Picked Up At:</Text>
            <Text variant="bodySmall" style={{ color: "#666" }}>
              {order.pickup_time}
            </Text>
          </View>
        )}

        {order.delivery_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodySmall" style={{ color: "#666" }}>Finish Delivery At:</Text>
            <Text variant="bodySmall" style={{ color: "#666" }}>
              {order.delivery_time}
            </Text>
          </View>
        )}
      </View>

      {/* buttons on the far right */}
      <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 12 }}>
        {/* view the details: this button is always there. */}
        <Button
          mode="text"
          onPress={() => router.push(`/${contextProfile?.role}/view/order/${order.id}`)}
        >
          Details
        </Button>
        {/* approve button: only for the restaurant, and when the order is pending, show approve and reject two buttons */}
        {contextProfile?.role === "restaurant" && order.order_status === "PENDING" && (
          <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
            <Button
              textColor="red"
              mode="elevated"
              compact
              onPress={() => restaurantAcceptRejectReadyOrder("reject")}
            >
              Cancel
            </Button>
            <Button
              mode="elevated"
              compact
              onPress={() => restaurantAcceptRejectReadyOrder("accept")}
            >
              Approve
            </Button>
          </View>
        )}
        {/* Accept button: only for the driver, and when the order.driver_id is none */}
        {contextProfile?.role === "driver" && order.driver_id === null && (
          <Button
            mode="elevated"
            compact
            onPress={driverAcceptOrder}
          >
            Accept
          </Button>
        )}
        {/* for the restaurant, when the order is restaurant_accepted, show the ready for pickup button */}
        {contextProfile?.role === "restaurant" && order.order_status === "RESTAURANT_ACCEPTED" && (
          <Button
            mode="elevated"
            compact
            onPress={() => restaurantAcceptRejectReadyOrder("ready")}
          >
            Pickup Ready
          </Button>
        )}
        {/* for the driver, when the order is ready_for_pickup, show the pickup button for the driver */}
        {contextProfile?.role === "driver" && order.driver_id !== null && order.order_status === "READY_FOR_PICKUP" && (
          <Button
            mode="elevated"
            compact
            onPress={driverPickupOrder}
          >
            Confirm Pickup
          </Button>
        )}
        {/* for the driver, when the order is picked_up, show the delivered button for the driver */}
        {contextProfile?.role === "driver" && order.driver_id !== null && order.order_status === "PICKED_UP" && (
          <Button
            mode="elevated"
            compact
            onPress={driverFinishDelivery}
          >
            Mark Delivered
          </Button>
        )}
      </View>
    </View>
  );
}
