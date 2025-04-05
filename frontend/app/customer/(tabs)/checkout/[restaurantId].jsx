import React, { useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Text, Button, IconButton, TextInput } from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../../../../constants/backend";
import useAuth from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";
import MyScrollView from "../../../../components/MyScrollView";
import AddressForm from "../../../../components/AddressForm";

export default function CheckoutPage() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [restaurantCart, setRestaurantCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deliveryFee, setDeliveryFee] = useState(10); // will be updated based on distance
  const [form, setForm] = useState({
    address: "",
    suburb: "",
    state: "",
    postcode: "",
  });

  useEffect(() => {
    fetchCart();
  }, [restaurantId]);

  const fetchCart = async () => {
    const url = `${BACKEND}/customer-order/cart/v2`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);
      const matched = response.data.find(
        (r) => Number(r.restaurant_id) === Number(restaurantId)
      );
      setRestaurantCart(matched || null);
    } catch (error) {
      console.error("Error fetching cart:", error);
      showToast("Failed to fetch cart data", "error");
    } finally {
      setLoading(false);
    }
  };

  const subtotal = restaurantCart
    ? restaurantCart.items.reduce((sum, item) => sum + item.total_price, 0)
    : 0;

  const total = subtotal + deliveryFee;

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  if (loading || !restaurantCart) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <MyScrollView style={{ padding: 16 }}>
      {/* Back Button */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
        <Text variant="headlineSmall" style={{ marginLeft: 4 }}>
          Checkout
        </Text>
      </View>

      {/* Restaurant Info */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <Image
          source={{ uri: `${BACKEND}/${restaurantCart.restaurant_img}` }}
          style={{ width: 30, height: 30, borderRadius: 15, marginRight: 8 }}
        />
        <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
          {restaurantCart.restaurant_name}
        </Text>
      </View>

      {/* Cart Items (non-editable) */}
      {restaurantCart.items.map((item) => (
        <View
          key={item.menu_id}
          style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}
        >
          <Image
            source={{ uri: `${BACKEND}/${item.url_img}` }}
            style={{ width: 40, height: 40, borderRadius: 8 }}
          />
          <View style={{ flex: 1, marginHorizontal: 8 }}>
            <Text variant="titleSmall">{item.menu_name}</Text>
            <Text variant="titleSmall" style={{ color: "#888" }}>
              ${item.price.toFixed(2)}
            </Text>
          </View>
          <Text variant="titleSmall">x {item.quantity}</Text>
        </View>
      ))}

      {/* Address Form */}
      <View style={{ marginTop: 20 }}>
        <AddressForm form={form} setForm={setForm} allowContextAddress />
      </View>

      {/* Total Section */}
      <View style={{ marginTop: 24, marginBottom: 16 }}>
        <Text variant="titleSmall">Subtotal: ${subtotal.toFixed(2)}</Text>
        <Text variant="titleSmall">Delivery Fee: ${deliveryFee.toFixed(2)}</Text>
        <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: 4 }}>
          Total: ${total.toFixed(2)}
        </Text>
      </View>

      {/* Bottom Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16 }}>
        <Button mode="outlined" onPress={() => router.back()}>
          BACK
        </Button>
        <Button mode="contained" onPress={() => alert("TODO")}>
          Submit
        </Button>
      </View>
    </MyScrollView>
  );
}
