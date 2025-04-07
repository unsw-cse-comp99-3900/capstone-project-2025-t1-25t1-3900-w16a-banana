import React, { useCallback, useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import axios from "axios";
import CartPerRestaurant from "../../../components/CartPerRestaurant";
import { BACKEND } from "../../../constants/backend";
import useAuth from "../../../hooks/useAuth";
import MyScrollView from "../../../components/MyScrollView";
import { Text, Icon } from "react-native-paper";
import { useFocusEffect } from "expo-router";

export default function Cart() {
  const { contextProfile } = useAuth();

  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const url = `${BACKEND}/customer-order/cart/v2`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      console.log(response.data);
      setCartData(response.data);
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!contextProfile) return;
    fetchCart();
  }, [contextProfile]);

  // force refresh everytime when this page is focused
  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [contextProfile])
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <MyScrollView>
      <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8, marginBottom: 12 }}>
        <Text variant="titleLarge">
          Shopping Cart
        </Text>
      </View>

      {cartData.length === 0 ? (
        <View style={{ alignItems: "center", marginTop: 40 }}>
          <Icon source="cart-off" size={60} color="#ccc" />
          <Text variant="titleMedium" style={{ marginTop: 12, color: "#999" }}>
            Your cart is currently empty.
          </Text>
        </View>
      ) : (
        cartData.map((restaurant) => (
          <CartPerRestaurant
            key={restaurant.restaurant_id}
            restaurant={restaurant}
            onUpdated={fetchCart}
          />
        ))
      )}
    </MyScrollView>
  );
}
