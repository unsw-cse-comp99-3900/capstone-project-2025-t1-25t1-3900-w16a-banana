import React, { useEffect, useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider, IconButton } from 'react-native-paper';
import MyScrollView from './MyScrollView';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import { BACKEND } from '../constants/backend';
import useAuth from '../hooks/useAuth';
import ApprovedGIF from "../assets/images/approved.gif";
import DeliveryGIF from "../assets/images/delivery.gif";
import PendingGIF from "../assets/images/pending.gif";
import PickupGIF from "../assets/images/pickup.gif";
import DeliveredGIF from "../assets/images/delivered.gif";
import { STATUS_COLOR_MAP, STATUS_TEXT_MAP } from '../utils/order';
import capitalize from 'capitalize';

const statusGIFMap = {
  PENDING: PendingGIF,
  RESTAURANT_ACCEPTED: ApprovedGIF,
  READY_FOR_PICKUP: PickupGIF,
  PICKED_UP: DeliveryGIF,
  DELIVERED: DeliveredGIF,
};

export default function OrderDetailsPage({ orderId }) {
  const { contextProfile } = useAuth();

  const [orderData, setOrderData] = useState(null);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${BACKEND}/search/order/${orderId}`);
      setOrderData(res.data);
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrder();
      const interval = setInterval(fetchOrder, 10000);
      return () => clearInterval(interval);
    }, [orderId])
  );

  if (!orderData) {
    return (
      <MyScrollView>
        <Text>Loading...</Text>
      </MyScrollView>
    );
  }

  const { order, restaurant, customer, items, driver } = orderData;
  const subtotal = order.order_price;
  const gst = (order.total_price / 11).toFixed(2);

  return (
    <MyScrollView>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <IconButton icon="arrow-left" size={24} onPress={() => router.back()} />
          <Text variant="titleLarge">
            Order #{String(order.id).padStart(5, "0")}
          </Text>
        </View>
        <Text
          variant="labelLarge"
          style={{
            fontWeight: "bold",
            backgroundColor: STATUS_COLOR_MAP[order.order_status],
            color: "#fff",
            width: "fit-content",
            textTransform: "uppercase",
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 8,
          }}
        >
          #{capitalize.words(STATUS_TEXT_MAP[order.order_status])}
        </Text>
      </View>
      
      {/* when the order status is not delivered or cancelled */}
      {order.order_status !== "DELIVERED" && order.order_status !== "CANCELLED" && (
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>Order Status</Text>
          {(() => {
            const steps = [
              { key: "PENDING", label: "Pending" },
              { key: "RESTAURANT_ACCEPTED", label: "Cooking" },
              { key: "READY_FOR_PICKUP", label: "Ready for Pickup" },
              { key: "PICKED_UP", label: "Picked Up" },
              { key: "DELIVERED", label: "Delivered" },
            ];

            const currentIndex = steps.findIndex(s => s.key === order.order_status);
            const remainingSteps = steps.slice(currentIndex);

            return (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                {remainingSteps.map((step, index) => (
                  <React.Fragment key={step.key}>
                    <View style={{ alignItems: "center", gap: 4 }}>
                      <Image
                        source={statusGIFMap[step.key]}
                        style={{ width: 40, height: 40 }}
                      />
                      <Text variant="labelMedium"
                        style={{
                          fontWeight: currentIndex === index + 1 ? "bold" : "normal",
                        }}
                      >
                        {step.label}
                      </Text>
                    </View>
                    {index !== remainingSteps.length - 1 && (
                      <IconButton icon="arrow-right-bold" size={20} iconColor="#888" />
                    )}
                  </React.Fragment>
                ))}
              </View>
            );
          })()}
          <Divider style={{ marginBottom: 8, marginTop: 16 }} />
        </View>
      )}

      {/* Restaurant Info: when the contextProfile is not the restaurant, show the restaurant info */}
      {contextProfile?.role !== "restaurant" && (
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>Restaurant</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12, justifyContent: 'space-between' }}>
            <Image
              source={{ uri: `${BACKEND}/${restaurant.url_img1}` }}
              style={{ width: 60, height: 60, borderRadius: "25%" }}
            />
            <View style={{ gap: 4, flex: 1 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>Restaurant Name:</Text>
                <Text variant="bodyMedium">{restaurant.name}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>Phone:</Text>
                <Text variant="bodyMedium">{restaurant.phone}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium" style={{ fontWeight: "500" }}>Address:</Text>
                <Text variant="bodyMedium" style={{ textAlign: "right" }}>
                  {restaurant.address}, {restaurant.suburb}, {restaurant.state} {restaurant.postcode}
                </Text>
              </View>
            </View>
          </View>
          <Divider style={{ marginVertical: 8 }} />
        </View>
      )}

      {/* Items */}
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>Order Items</Text>
      {items.map(({ id, quantity, price, menu_item }) => (
        <View key={id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Image
              source={{ uri: `${BACKEND}/${menu_item.url_img}` }}
              style={{ width: 40, height: 40, borderRadius: 4 }}
            />
            <View style={{ flex: 1 }}>
              <Text>{menu_item.name}</Text>
              <Text style={{ color: '#666' }}>${price.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={{ color: '#666' }}>x {quantity}</Text>
        </View>
      ))}
      <Divider style={{ marginVertical: 8 }} />

      {/* Price Info */}
      <View style={{ flexDirection: "column", gap: 4}}>
        <Text variant="titleMedium">Price Summary</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium">Subtotal</Text>
          <Text variant="bodyMedium">${subtotal.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium">Delivery Fee</Text>
          <Text variant="bodyMedium">${order.delivery_fee.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium">Total</Text>
          <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>${order.total_price.toFixed(2)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text variant="bodyMedium" style={{ color: '#666' }}>Incl GST</Text>
          <Text variant="bodyMedium" style={{ color: '#666' }}>${gst}</Text>
        </View>
      </View>
      <Divider style={{ marginVertical: 8 }} />

      {/* Customer Info: When the contextProfile person is not the customer, then can view the customer info */}
      {contextProfile?.role !== "customer" && (
        <View>
          <View style={{ gap: 4}}>
            <Text variant="titleMedium" style={{ marginBottom: 4 }}>Customer</Text>
            <View style={{ marginBottom: 12, gap: 4 }}>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium">Customer</Text>
                <Text variant="bodyMedium">{customer.username}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium">Phone</Text>
                <Text variant="bodyMedium">{customer.phone}</Text>
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text variant="bodyMedium">Address</Text>
                <Text variant="bodyMedium">
                  {order.address}, {order.suburb}, {order.state} {order.postcode}
                </Text>
              </View>
            </View>
          </View>
          <Divider style={{ marginVertical: 8 }} />
        </View>
      )}

      {driver && contextProfile.role !== "driver" && (
        <View>
          <View style={{ gap: 4 }}>
            <Text variant="titleMedium">Driver</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="bodyMedium">Name</Text>
              <Text variant="bodyMedium">
                {driver.first_name} {driver.last_name}
              </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text variant="bodyMedium">Phone</Text>
              <Text variant="bodyMedium">{driver.phone}</Text>
            </View>
          </View>
          <Divider style={{ marginVertical: 8 }} />
        </View>
      )}

      {/* Time Info */}
      <View style={{ gap: 4}}>
        <Text variant="titleMedium">Time</Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text variant="bodyMedium" style={{ color: "#666" }}>Order Created At</Text>
          <Text variant="bodyMedium" style={{ color: "#666" }}>
            {order.order_time}
          </Text>
        </View>
        {order.pickup_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodyMedium" style={{ color: "#666" }}>Driver Picked Up At</Text>
            <Text variant="bodyMedium" style={{ color: "#666" }}>
              {order.pickup_time}
            </Text>
          </View>
        )}
        {order.delivery_time && (
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <Text variant="bodyMedium" style={{ color: "#666" }}>Finish Delivery At</Text>
            <Text variant="bodyMedium" style={{ color: "#666" }}>
              {order.delivery_time}
            </Text>
          </View>
        )}
      </View>
    </MyScrollView>
  );
}
