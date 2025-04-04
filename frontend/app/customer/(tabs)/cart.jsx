import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, ScrollView } from "react-native";
import axios from "axios";
import CartPerRestaurant from "../../../components/CartPerRestaurant";
import { BACKEND } from "../../../constants/backend";
import useToast from "../../../hooks/useToast";
import useAuth from "../../../hooks/useAuth";
import useDialog from "../../../hooks/useDialog";
import MyScrollView from "../../../components/MyScrollView";
import { Text, Icon } from "react-native-paper";

export default function Cart() {
  const { showToast } = useToast();
  const { contextProfile } = useAuth();
  const { showDialog } = useDialog();


  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const url = `${BACKEND}/customer-order/cart`;
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
    fetchCart();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <MyScrollView>
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: 8 }}>
        <Icon source="cart" size={24} iconColor="blue" />
        <Text variant="titleLarge" style={{ marginLeft: 8, fontWeight: "bold" }}>
          Your Cart
        </Text>
      </View>
      {cartData.map((restaurant) => (
        <CartPerRestaurant
          key={restaurant.restaurant_id}
          restaurant={restaurant}
          onUpdated={fetchCart}
        />
      ))}
    </MyScrollView>
  );
}
