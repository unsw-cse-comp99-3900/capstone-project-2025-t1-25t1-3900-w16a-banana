import React, { useState, useCallback } from 'react';
import { View, Image } from 'react-native';
import { Text, Divider, IconButton } from 'react-native-paper';
import MyScrollView from './MyScrollView';
import axios from 'axios';
import { router, useFocusEffect } from 'expo-router';
import { BACKEND, TIME_INTERVAL } from '../constants/backend';
import useAuth from '../hooks/useAuth';
import { STATUS_CONTENT } from '../utils/order';
import capitalize from 'capitalize';
import OrderDetailsPageStatus from './OrderDetailsPageStatus';
import OrderPathMapWithRoute from './OrderPathMapWithRoute';
import OrderPathOverviewMap from './OrderPathOverviewMap';

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
      const interval = setInterval(fetchOrder, TIME_INTERVAL);
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

  // if the driver is viewing this page, and if the order has not been assigned a driver yet, 
  // then show the OrderPathOverviewMap component, it marks the driver location, restaurant location, and delivery location
  const isShowOrderPathOverviewMap = contextProfile?.role === "driver" && (!order.driver_id) 
      && (order.order_status === "RESTAURANT_ACCEPTED" || order.order_status === "READY_FOR_PICKUP");

  // if the order belongs to the driver, and the order status is RESTAURANT_ACCEPTED or READY_FOR_PICKUP,
  // the driver sees the map with the route between the driver location and the restaurant location
  const isShowOrderPathDriverToRestaurantMap = contextProfile?.role === "driver"
      && order.driver_id === contextProfile.id
      && (order.order_status === "RESTAURANT_ACCEPTED" || order.order_status === "READY_FOR_PICKUP");

  // if the order belongs to the driver, and the order status is PICKED_UP,
  // then the driver sees the map with the route between the restaurant location and the delivery location
  const isShowOrderPathRestaurantToCustomer = contextProfile?.role === "driver"
      && order.driver_id === contextProfile.id
      && order.order_status === "PICKED_UP";

  // compose the restaurant address, and the order address
  const restaurantAddress = {
    address: restaurant.address,
    suburb: restaurant.suburb,
    state: restaurant.state,
    postcode: restaurant.postcode,
  };

  const orderAddress = {
    address: order.address,
    suburb: order.suburb,
    state: order.state,
    postcode: order.postcode,
  };

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
          variant="labelMedium"
          style={{
            fontWeight: "bold",
            backgroundColor: STATUS_CONTENT[order.order_status].color,
            color: "#fff",
            width: "fit-content",
            textTransform: "uppercase",
            paddingHorizontal: 6,
            paddingVertical: 3,
            borderRadius: 8,
          }}
        >
          #{capitalize.words(STATUS_CONTENT[order.order_status].title)}
        </Text>
      </View>
      
      {/* when the order status is not delivered or cancelled */}
      <OrderDetailsPageStatus order={order} />

      {/* if the condition meets, show the order view map for the driver */}
      {isShowOrderPathOverviewMap && (
        <OrderPathOverviewMap
          restaurantAddress={restaurantAddress}
          deliveryAddress={orderAddress}
        />
      )}

      {/* if the condition meets, show the path between driver to restaurant */}
      {isShowOrderPathDriverToRestaurantMap && (
        <OrderPathMapWithRoute
          restaurantAddress={restaurantAddress}
          deliveryAddress={orderAddress}
          mode="driver-to-restaurant"
        />
      )}

      {/* if the condition meets, show the path between restaurant to customer */}
      {isShowOrderPathRestaurantToCustomer && (
        <OrderPathMapWithRoute
          restaurantAddress={restaurantAddress}
          deliveryAddress={orderAddress}
          mode="restaurant-to-customer"
        />
      )}

      {/* Restaurant Info: when the contextProfile is not the restaurant, show the restaurant info */}
      {contextProfile?.role !== "restaurant" && (
        <View>
          {/* restaurant gives a link */}
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <Text variant="titleMedium">Restaurant</Text>
            <IconButton
              icon="open-in-new"
              size={16}
              iconColor="#888"
              onPress={() => router.push(`/${contextProfile.role}/view/restaurant/${restaurant.id}`)}
              style={{
                padding: 0,
                margin: 0,
              }}
            />
          </View>
          {/* restaurant name, phone, address */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, gap: 12, justifyContent: 'space-between' }}>
            <Image
              source={{ uri: `${BACKEND}/${restaurant.url_img1}` }}
              style={{ width: 50, height: 50, borderRadius: "8%", marginTop: 4 }}
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
      {/* customer special notes if possible */}
      <View style={{ marginBottom: 0 }}>
        <Text variant="titleMedium" style={{ marginBottom: 4 }}>Customer Notes</Text>
        {order.customer_notes ? (
          <Text variant="bodyMedium" style={{ color: '#666' }}>{order.customer_notes}</Text>
        ) : (
          <Text variant="bodyMedium" style={{ color: '#666' }}>No special notes</Text>
        )}
      </View>
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
