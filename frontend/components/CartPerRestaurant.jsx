import React from "react";
import {
  View,
  Image,
} from "react-native";
import { Text, IconButton, Button } from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import useAuth from "../hooks/useAuth";
import { router } from "expo-router";
import useDialog from "../hooks/useDialog";
import useToast from "../hooks/useToast";

const DELIVERY_FEE = 10;

// onUpdated is a callback function from the parent component cart.jsx to update the whole page.
export default function CartPerRestaurant({ restaurant, onUpdated }) {
  const { contextProfile } = useAuth();
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  const updateQuantity = async (menu_id, quantity) => {
    const url = `${BACKEND}/customer-order/cart`;
    const config = { headers: { Authorization: contextProfile.token } };
    const payload = { menu_id, quantity };

    try {
      const response = await axios.put(url, payload, config);
      console.log(response.data);
      onUpdated();
    } catch (err) {
      console.error("Failed to update item:", err);
    }
  };

  const subtotal = restaurant.items.reduce(
    (sum, item) => sum + item.total_price,
    0
  );

  const total = subtotal + DELIVERY_FEE;

  const emptyCartAction = () => {
    showDialog({
      title: "Empty Cart Confirmation",
      message: "Are you going to empty all the items from this restaurant?",
      onConfirm: emptyCartCallAPI,
      confirmText: "Yes",
      cancelText: "No",
    });
  };

  const emptyCartCallAPI = async () => {
    const url = `${BACKEND}/customer-order/cart/restaurant/${restaurant.restaurant_id}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.delete(url, config);
      showToast("Items removed from cart", "success");
      onUpdated();
    } catch (err) {
      console.error("Failed to remove items from cart:", err);
      showToast("Failed to remove items from cart", "error");
    }
  };

  return (
    <View
      style={{
        backgroundColor: "#f0f0f0",
        paddingHorizontal: 16,
        paddingVertical: 4,
        marginBottom: 20,
        borderRadius: 12,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Image
            source={{ uri: `${BACKEND}/${restaurant.restaurant_img}` }}
            style={{ width: 30, height: 30, borderRadius: "50%", marginRight: 4 }}
          />
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {restaurant.restaurant_name}
          </Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          {/* view the restaurant page */}
          <IconButton
            icon="chevron-right"
            size={20}
            onPress={() => {
              router.push({
                pathname: `/customer/view/restaurant/${restaurant.restaurant_id}`,
                params: { restaurantId: restaurant.restaurant_id, from: "/customer/cart" },
              })
            }}
          />
        </View>
      </View>

      {/* Items */}
      {restaurant.items.map((item) => (
        <View
          key={item.menu_id}
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            marginBottom: 12,
          }}
        >
          <Image
            source={{ uri: `${BACKEND}/${item.url_img}` }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
          />
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text variant="titleSmall">{item.menu_name}</Text>
            <Text variant="titleSmall" style={{ color: "#888" }}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="minus"
              size={18}
              onPress={() => updateQuantity(item.menu_id, item.quantity - 1)}
            />
            <Text variant="titleSmall">{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={18}
              onPress={() => updateQuantity(item.menu_id, item.quantity + 1)}
            />
          </View>
        </View>
      ))}

      {/* Totals and the place order button, all to the right */}
      <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", gap: 8 }}>
        <View style={{ width: "95%", gap: 2 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="titleSmall">Subtotal:</Text>
            <Text variant="titleSmall">${subtotal.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="titleSmall">Delivery Fee:</Text>
            <Text variant="titleSmall" style={{ color: "#666" }}>TBD</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="titleSmall">Total:</Text>
            <Text variant="titleSmall" style={{ color: "#666" }}>TBD</Text>
          </View>
        </View>

        {/* view, to the end */}
        <View style={{ flexDirection: "row", width: "100%", alignItems: "flex-end", justifyContent: "flex-end" }}>
          {/* empty the whole cart */}
          <Button
            mode="text"
            icon="trash-can-outline"
            onPress={emptyCartAction}
            style={{ width: "fit-content" }}
          >
            Clear
          </Button>
          {/* place order */}
          <Button 
            mode="text"
            icon="cart-check"
            onPress={() => router.push(`/customer/checkout/${restaurant.restaurant_id}`)}
            style={{ width: "fit-content" }}
          >
            Order
          </Button>
        </View>
      </View>
    </View>
  );
}
