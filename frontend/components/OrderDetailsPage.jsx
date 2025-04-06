import React, { useEffect, useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import MyScrollView from './MyScrollView';
import axios from 'axios';
import { useFocusEffect } from 'expo-router';
import { BACKEND } from '../constants/backend';

export default function OrderDetailsPage({ orderId }) {
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
      <Text variant="titleLarge" style={{ marginBottom: 10 }}>
        Order Details (ID: {order.id})
      </Text>

      {/* Restaurant Info */}
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

      {/* Price Info */}
      <Divider style={{ marginVertical: 8 }} />
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
        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>Total</Text>
        <Text variant="bodyMedium" style={{ fontWeight: 'bold' }}>${order.total_price.toFixed(2)}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <Text variant="bodyMedium" style={{ color: '#666' }}>Incl GST</Text>
        <Text variant="bodyMedium" style={{ color: '#666' }}>${gst}</Text>
      </View>
      <Divider style={{ marginVertical: 8 }} />

      {/* Customer Info */}
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
      <Divider style={{ marginVertical: 8 }} />

      {driver && (
        <View>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>Driver</Text>
          <View style={{ gap: 4 }}>
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
    </MyScrollView>
  );
}
