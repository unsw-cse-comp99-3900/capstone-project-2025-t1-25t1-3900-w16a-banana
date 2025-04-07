import React, { useCallback, useEffect, useState } from "react";
import { View, Image } from "react-native";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { Text, Button, IconButton, TextInput } from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../../../../constants/backend";
import useAuth from "../../../../hooks/useAuth";
import useToast from "../../../../hooks/useToast";
import MyScrollView from "../../../../components/MyScrollView";
import AddressForm from "../../../../components/AddressForm";
import useDialog from "../../../../hooks/useDialog";
import { calculateDistance, fetchLocationDetailFromAddress } from "../../../../utils/location";
import { calculateDeliveryFee } from "../../../../utils/fee";

export default function CheckoutPage() {
  const router = useRouter();
  const { restaurantId } = useLocalSearchParams();
  const { contextProfile } = useAuth();
  const { showToast } = useToast();
  const { showDialog } = useDialog();

  const [loading, setLoading] = useState(true);

  // cart detail: does not allow to edit on this page
  const [restaurantCart, setRestaurantCart] = useState(null);

  // delivery fee, needs to wait for the input address
  const [deliveryFee, setDeliveryFee] = useState(null);
  const [distance, setDistance] = useState(null);

  // credit card: 16 digits
  const [cardNumber, setCardNumber] = useState("");

  // customer note
  const [note, setNote] = useState("");

  // address form, initially empty, allow customer to fill with default address
  const initialForm = {
    address: "",
    suburb: "",
    state: "",
    postcode: "",
  }

  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (!contextProfile) return;
    fetchCart();
  }, [restaurantId, contextProfile]);

  // use focus in effect: set all input fields to empty, and refetch
  useFocusEffect(
    useCallback(() => {
      setForm(initialForm);
      setDeliveryFee(null);
      setDistance(null);
      setCardNumber("");
      setNote("");
      fetchCart();
    }, [restaurantId, contextProfile])
  );

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

  const total = deliveryFee !== null ? subtotal + deliveryFee : subtotal + 0;
  const gst = total / 11;

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

  const getFee = async () => {
    // check the address, suburb, state, postcode should all be filled, if not showToast
    const { address, suburb, state, postcode } = form;
    if (!address || !suburb || !state || !postcode) {
      showToast("Please fill all address fields before submission.", "error");
      return;
    }

    // get the {longitude, latitude} from the address
    const userLocation = await fetchLocationDetailFromAddress(form);
    console.log(userLocation);

    // also need the restaurant address
    const restaurantAddress = restaurantCart.address;
    const restaurantLocation = await fetchLocationDetailFromAddress(restaurantAddress);
    console.log(restaurantLocation);
    
    // now calcualte the distance in km
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      restaurantLocation.lat,
      restaurantLocation.lng
    );

    const fee = calculateDeliveryFee(distance);
    setDeliveryFee(fee);
    setDistance(distance);
  };

  // show the default card info as: ---- ---- ---- ---- 
  // and when number comes, insert space every 4 digits
  const formatCardNumberDisplay = (value) => {
    if (!value) return "---- ---- ---- ----";

    const digits = value.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleCardNumberChange = (text) => {
    const digitsOnly = text.replace(/\D/g, "").slice(0, 16);
    setCardNumber(digitsOnly);
  };

  const submitOrder = () => {
    const submitOrderCallAPI = async () => {
      const url = `${BACKEND}/customer-order/order`;
      const config = { headers: { Authorization: contextProfile.token } };

      const payload = {
        "restaurant_id": restaurantCart.restaurant_id,
        "address": form.address,
        "suburb": form.suburb,
        "state": form.state,
        "postcode": form.postcode,
        "card_number": cardNumber,
        "order_price": subtotal,
        "delivery_fee": deliveryFee,
        "total_price": total,
        "customer_notes": note,
      };

      try {
        const response = await axios.post(url, payload, config);
        showToast("Order submitted successfully!", "success");
        router.replace("/customer/orders");
      } catch (error) {
        console.error("Error submitting order:", error);
        showToast("Failed to submit order", "error");
      }
    };

    // simple check if the credit card is 16 digits
    if (cardNumber.length !== 16) {
      showToast("Please enter a valid credit card number.", "error");
      return;
    }

    // if the deliveryFee is null, ask to click on the submit address
    if (deliveryFee === null) {
      showToast("Please click on the submit address button to view the delivery fee.", "error");
      return;
    }
    
    showDialog({
      title: "Confirm Order",
      message: "Please confirm your order before submission.",
      onConfirm: submitOrderCallAPI,
      confirmText: "Yes",
      cancelText: "No",
    });
  };

  return (
    <MyScrollView>
      {/* Back Button */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}>
        <IconButton icon="arrow-left" size={24} onPress={() => router.replace("/customer/cart")} />
        <Text variant="headlineSmall" style={{ marginLeft: 4 }}>
          Order Checkout
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

      {/* add customer note, multiline */}
      <Text variant="titleMedium" style={{ marginBottom: 6, marginTop: 16 }}>
        Customer Note (optional)
      </Text>
      <TextInput
        label="Customer Note (optional)"
        mode="outlined"
        multiline
        numberOfLines={3}
        value={note}
        onChangeText={setNote}
        style={{ marginBottom: 8 }}
        placeholder="Add any special instructions or requests here..."
      />

      {/* Address Form, add the submit button to check the distance */}
      <AddressForm 
        form={form} 
        setForm={setForm} 
        allowContextAddress 
        showSubmit 
        submitCallback={getFee}
      />

      {/* card number */}
      <Text variant="titleMedium" style={{ marginBottom: 8, marginTop: 16 }}>
        Credit Card Information
      </Text>
      <TextInput
        label="Card Number"
        mode="outlined"
        keyboardType="number-pad" // Add this to show number keyboard
        value={formatCardNumberDisplay(cardNumber)}
        onChangeText={handleCardNumberChange}
        placeholder="---- ---- ---- ----"
      />

      {/* Divider Line */}
      <View style={{ height: 1, backgroundColor: "#ddd", marginTop: 24, marginBottom: 8 }} />

      {/* Totals Section */}
      <View style={{ marginBottom: 16, gap: 6 }}>
        {/* subtotal line */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium">Subtotal:</Text>
          <Text variant="titleMedium">${subtotal.toFixed(2)}</Text>
        </View>
        {/* delivery fee line */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Text variant="titleMedium">Delivery Fee:</Text>
            {distance !== null && (
              <Text variant="titleMedium">
                ({distance.toFixed(2)} km)
              </Text>
            )}
          </View>
          {deliveryFee === null ? (
            <Text
              variant="titleMedium"
              style={{ fontStyle: "italic", color: "#888" }}
            >
              Waiting for Address...
            </Text>
          ) : (
            <Text variant="titleMedium">${deliveryFee.toFixed(2)}</Text>
          )}
        </View>
        {/* total = subtotal + delivery fee */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            Total:
          </Text>
          <Text variant="titleMedium" style={{ fontWeight: deliveryFee ? "bold" : "normal" }}>
            {deliveryFee ? `$${total.toFixed(2)}` : "TBD"}
          </Text>
        </View>
        {/* GST = total / 11 */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="titleMedium" style={{ color: "#666" }}>
            Incl GST:
          </Text>
          <Text variant="titleMedium" style={{ color: "#666" }}>
            {deliveryFee ? `$${(total / 11).toFixed(2)}` : "TBD"}
          </Text>
        </View>
      </View>

      {/* Bottom Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 16, marginBottom: 16 }}>
        <Button mode="text" onPress={() => router.replace("/customer/cart")}>
          BACK
        </Button>
        <Button mode="outlined" onPress={submitOrder}>
          Submit
        </Button>
      </View>
    </MyScrollView>
  );
}
