import React, { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { Text, Divider, Button, Dialog, Portal, TextInput } from 'react-native-paper';
import { useFocusEffect } from 'expo-router';
import axios from 'axios';
import { BACKEND } from '../constants/backend';
import OrderReviewCard from './OrderReviewCard';
import useAuth from '../hooks/useAuth';
import useToast from '../hooks/useToast';

export default function OrderRatingSection({ orderId }) {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [driverId, setDriverId] = useState(null);
  const [restaurantId, setRestaurantId] = useState(null);

  const [reviewDriver, setReviewDriver] = useState(null);
  const [reviewRestaurant, setReviewRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [ratingDriver, setRatingDriver] = useState('');
  const [ratingRestaurant, setRatingRestaurant] = useState('');
  const [textDriver, setTextDriver] = useState('');
  const [textRestaurant, setTextRestaurant] = useState('');

  const fetchOrderRating = async () => {
    setIsLoading(true);
    const url = `${BACKEND}/review/order/${orderId}`;
    try {
      const response = await axios.get(url);
      setReviewDriver(response.data.driver_review);
      setReviewRestaurant(response.data.restaurant_review);
      setDriverId(response.data.driver_id);
      setRestaurantId(response.data.restaurant_id);
    } catch (error) {
      console.error('Error fetching order rating:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrderRating();
    }, [orderId])
  );

  useEffect(() => {
    if (!isLoading && !reviewDriver && !reviewRestaurant && contextProfile.role === 'customer') {
      setShowModal(true);
    }
  }, [isLoading]);

  const submitReview = async (targetBody, rating, text) => {
    if (!rating || !text) return;
    
    // write the url to submit the review
    const targetBodyId = targetBody === 'driver' ? driverId : restaurantId;
    const url = `${BACKEND}/review/${targetBody}/${targetBodyId}/order/${orderId}`;
    const fullUrl = `${url}?rating=${rating}&review_text=${encodeURIComponent(text)}`;

    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.put(fullUrl, {}, config);
    } catch (err) {
      showToast(`Failed to submit ${targetBody} review`, 'error');
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    // require all to be filled
    if (!ratingDriver || !textDriver || !ratingRestaurant || !textRestaurant) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    // points from 1 - 5
    if (isNaN(ratingDriver) || ratingDriver < 1 || ratingDriver > 5) {
      showToast('Please enter a valid rating for driver between 1.0 and 5.0', 'error');
      return;
    }

    if (isNaN(ratingRestaurant) || ratingRestaurant < 1 || ratingRestaurant > 5) {
      showToast('Please enter a valid rating for restaurant between 1.0 and 5.0', 'error');
      return;
    }

    // submit the review
    await submitReview('driver', ratingDriver, textDriver);
    await submitReview('restaurant', ratingRestaurant, textRestaurant);
    
    showToast('Review submitted successfully', 'success');
    setShowModal(false);
    fetchOrderRating();
  };

  return (
    <View>
      <Divider style={{ marginVertical: 8 }} />
      <Text variant="titleMedium" style={{ marginBottom: 12 }}>
        Order Rating
      </Text>

      {/* if the review exists, then show the review */}
      {reviewDriver && <OrderReviewCard review={reviewDriver} targetBody="driver" onRefresh={fetchOrderRating} />}
      {reviewRestaurant && <OrderReviewCard review={reviewRestaurant} targetBody="restaurant" onRefresh={fetchOrderRating} />}

      {/* if the review not exist, show the button to open the modal */}
      {!reviewDriver && !reviewRestaurant && !showModal && contextProfile.role === 'customer' && (
        <View>
          <Text>No reviews left for this order yet.</Text>
          <Button compact mode="outlined" onPress={() => setShowModal(true)} style={{ marginTop: 12, paddingHorizontal: 8, width: "fit-content" }}>
            Leave a Review
          </Button>
        </View>
      )}

      <Portal>
        <Dialog visible={showModal} onDismiss={() => setShowModal(false)}>
          <Dialog.Title>Leave a Review</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Driver Rating (1.0 - 5.0)"
              keyboardType="decimal-pad"
              value={ratingDriver}
              onChangeText={setRatingDriver}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Driver Review"
              multiline
              numberOfLines={2}
              value={textDriver}
              onChangeText={setTextDriver}
              style={{ marginBottom: 16 }}
            />
            <TextInput
              label="Restaurant Rating (1.0 - 5.0)"
              keyboardType="decimal-pad"
              value={ratingRestaurant}
              onChangeText={setRatingRestaurant}
              style={{ marginBottom: 8 }}
            />
            <TextInput
              label="Restaurant Review"
              multiline
              numberOfLines={2}
              value={textRestaurant}
              onChangeText={setTextRestaurant}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowModal(false)}>Cancel</Button>
            <Button onPress={handleSubmit}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
