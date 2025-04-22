import React, { useCallback, useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useAuth from '../hooks/useAuth';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { BACKEND } from '../constants/backend';

function StarRating({ rating }) {
  const filledStars = Math.floor(rating);
  const halfStar = rating - filledStars >= 0.5;
  const totalStars = 5;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
      {[...Array(filledStars)].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star" size={20} color="#fbc02d" />
      ))}
      {halfStar && <MaterialCommunityIcons name="star-half-full" size={20} color="#fbc02d" />}
      {[...Array(totalStars - filledStars - (halfStar ? 1 : 0))].map((_, i) => (
        <MaterialCommunityIcons key={i} name="star-outline" size={20} color="#fbc02d" />
      ))}
      <Text style={{ marginLeft: 6 }}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function ReviewCard({ review, role }) {
  if (!review) return null;

  const isDriver = role === 'driver';
  const name = isDriver ? `${review.driver.first_name} ${review.driver.last_name}` : review.restaurant.name;

  return (
    <Card style={{ marginBottom: 16 }}>
      <Card.Title
        title={review.customer_name}
        subtitle={new Date(review.time).toLocaleString()}
        left={() => (
          <Avatar.Image
            size={40}
            source={{ uri: `${BACKEND}/${review.customer_profile_img}` }}
          />
        )}
      />
      <Card.Content>
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>
          {isDriver ? 'Driver' : 'Restaurant'}: {name}
        </Text>
        <StarRating rating={review.rating} />
        <Text style={{ marginVertical: 4 }}>{review.review_text}</Text>
        {review.reply && (
          <View style={{ backgroundColor: '#f0f0f0', padding: 6, borderRadius: 4 }}>
            <Text style={{ fontStyle: 'italic', fontSize: 12 }}>Reply: {review.reply}</Text>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

export default function OrderRatingSection({ orderId }) {
  const { contextProfile } = useAuth();
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

  return (
    <View>
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Order Rating
      </Text>
      <ReviewCard review={reviewDriver} role="driver" />
      <ReviewCard review={reviewRestaurant} role="restaurant" />
    </View>
  );
}
