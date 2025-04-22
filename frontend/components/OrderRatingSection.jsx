import React, { useCallback, useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { BACKEND } from '../constants/backend';
import OrderReviewCard from './OrderReviewCard';

export default function OrderRatingSection({ orderId }) {
  const [reviewDriver, setReviewDriver] = useState(null);
  const [reviewRestaurant, setReviewRestaurant] = useState(null);

  const fetchOrderRating = async () => {
    const url = `${BACKEND}/review/order/${orderId}`;
    try {
      const response = await axios.get(url);
      setReviewDriver(response.data.driver_review);
      setReviewRestaurant(response.data.restaurant_review);
    } catch (error) {
      console.error('Error fetching order rating:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrderRating();
    }, [orderId])
  );

  // if the reviewDriver and reviewRestaurant are still null, return null
  if (!reviewDriver && !reviewRestaurant) return null;

  return (
    <View>
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Order Rating
      </Text>
      <OrderReviewCard review={reviewDriver} targetBody="driver" onRefresh={fetchOrderRating} />
      <OrderReviewCard review={reviewRestaurant} targetBody="restaurant" onRefresh={fetchOrderRating} />
    </View>
  );
}
