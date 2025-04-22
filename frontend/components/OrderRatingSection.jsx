import React, { useCallback, useState } from 'react';
import { View, Image } from 'react-native';
import { Text, Card, Avatar, Divider } from 'react-native-paper';
import useAuth from '../hooks/useAuth';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { BACKEND } from '../constants/backend';
import OrderRatingStar from './OrderRatingStar';
import capitalize from 'capitalize';



function ReviewCard({ review, targetBody }) {
  const { contextProfile } = useAuth();

  if (!review) return null;

  const isDriver = targetBody === 'driver';
  const name = isDriver ? `${review.driver.first_name} ${review.driver.last_name}` : review.restaurant.name;

  const isReviewLeftByMe = contextProfile.role === 'customer' && Number(review.customer_id) === Number(contextProfile.id);
  const isReviewLeftToMeDriver = contextProfile.role === 'driver' && isDriver && Number(review.driver.id) === Number(contextProfile.id);
  const isReviewLeftToMeRestaurant = contextProfile.role === 'restaurant' && !isDriver && Number(review.restaurant.id) === Number(contextProfile.id);

  let headerLabel = isDriver ? 'Driver Review' : 'Restaurant Review';

  if (isReviewLeftByMe) {
    headerLabel = `My Review for ${isDriver ? 'Driver' : 'Restaurant'}`;
  } else if (isReviewLeftToMeDriver || isReviewLeftToMeRestaurant) {
    headerLabel = 'Customer Review to Me';
  }

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
        <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>{headerLabel}</Text>
        <Text style={{ fontSize: 13, marginBottom: 2 }}>
          {isDriver ? `Driver: ${name}` : `Restaurant: ${name}`}
        </Text>
        <OrderRatingStar rating={review.rating} />
        <Text style={{ marginVertical: 4 }}>{review.review_text}</Text>
        {review.reply && (
          <View style={{ backgroundColor: '#f0f0f0', padding: 6, borderRadius: 4 }}>
            <Text style={{ fontStyle: 'italic', fontSize: 12 }}>{capitalize(targetBody)} Reply: {review.reply}</Text>
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

  // if the reviewDriver and reviewRestaurant are still null, return null
  if (!reviewDriver && !reviewRestaurant) return null;

  return (
    <View>
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Order Rating
      </Text>
      <ReviewCard review={reviewDriver} targetBody="driver" />
      <ReviewCard review={reviewRestaurant} targetBody="restaurant" />
    </View>
  );
}
