import React from "react";
import {
  View,
  Text,
  Image,
} from "react-native";
import { IconButton, Button } from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import useAuth from "../hooks/useAuth";

const DELIVERY_FEE = 10;

export default function CartPerRestaurant({ restaurant, onUpdated }) {
  const { contextProfile } = useAuth();

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

  return (
    <View
      style={{
        backgroundColor: "#f9f9f9",
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
      }}
    >
      {/* Header */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
        <Image
          source={{ uri: `${BACKEND}/${restaurant.restaurant_img}` }}
          style={{ width: 50, height: 50, borderRadius: 8, marginRight: 10 }}
        />
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>{restaurant.restaurant_name}</Text>
      </View>

      {/* Items */}
      {restaurant.items.map((item) => (
        <View
          key={item.menu_id}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <Image
            source={{ uri: `${BACKEND}/${item.url_img}` }}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text style={{ fontSize: 16 }}>{item.menu_name}</Text>
            <Text style={{ fontSize: 14, color: "#888" }}>${item.price.toFixed(2)}</Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <IconButton
              icon="minus"
              size={20}
              onPress={() => updateQuantity(item.menu_id, item.quantity - 1)}
            />
            <Text style={{ fontSize: 16 }}>{item.quantity}</Text>
            <IconButton
              icon="plus"
              size={20}
              onPress={() => updateQuantity(item.menu_id, item.quantity + 1)}
            />
          </View>
        </View>
      ))}

      {/* Totals */}
      <View style={{ marginTop: 10, marginBottom: 12 }}>
        <Text>Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text>Delivery Fee: ${DELIVERY_FEE.toFixed(2)}</Text>
        <Text style={{ fontWeight: "bold" }}>Total: ${total.toFixed(2)}</Text>
      </View>

      <Button mode="contained" onPress={() => console.log("Placing order for", restaurant.restaurant_id)}>
        Place Order
      </Button>
    </View>
  );
}
