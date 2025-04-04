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

const DELIVERY_FEE = 10;

export default function CartPerRestaurant({ restaurant, onUpdated }) {
  const { contextProfile } = useAuth();
  const { showDialog } = useDialog();

  const updateQuantity = async (menu_id, quantity) => {
    const url = `${BACKEND}/customer-order/cart`;
    const config = { headers: { Authorization: contextProfile.token } };
    const payload = { menu_id, quantity };

    try {
      const response = await axios.put(url, payload, config);
      console.log(response.data);
      onUpdated(); // re-fetch cart
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
    alert("TODO!!!");


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
            onPress={() => router.push(`/customer/view/restaurant/${restaurant.restaurant_id}`)}
          />
          {/* empty the whole cart */}
          <IconButton
            icon="delete"
            size={20}
            onPress={emptyCartAction}
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
      <View style={{ flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-end", gap: 8 }}>
        <View>
          <Text variant="titleSmall">Subtotal: ${subtotal.toFixed(2)}</Text>
          <Text variant="titleSmall">Delivery Fee: ${DELIVERY_FEE.toFixed(2)}</Text>
          <Text variant="titleSmall" style={{ fontWeight: "bold" }}>Total: ${total.toFixed(2)}</Text>
        </View>

        <Button 
          mode="text"
          icon="cart-check"
          onPress={() => console.log("Placing order for", restaurant.restaurant_id)}
          style={{ width: "fit-content" }}
        >
          Place Order
        </Button>
      </View>
    </View>
  );
}
