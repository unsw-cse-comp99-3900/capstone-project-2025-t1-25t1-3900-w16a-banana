import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Card, Avatar, IconButton, Dialog, Portal, TextInput, Button } from 'react-native-paper';
import useAuth from '../hooks/useAuth';
import { BACKEND } from '../constants/backend';
import OrderRatingStar from './OrderRatingStar';
import capitalize from 'capitalize';
import axios from 'axios';
import PressableIcon from './PressableIcon';
import useToast from '../hooks/useToast';

export default function OrderReviewCard({ review, targetBody, onRefresh }) {
  const { contextProfile } = useAuth();
  const { showToast } = useToast();

  const [editVisible, setEditVisible] = useState(false);
  const [editRating, setEditRating] = useState(review.rating.toFixed(1));
  const [editText, setEditText] = useState(review.review_text || '');

  const isDriver = targetBody === 'driver';
  const name = isDriver ? `${review.driver.first_name} ${review.driver.last_name}` : review.restaurant.name;

  const isReviewLeftByMe = contextProfile.role === 'customer' && Number(review.customer_id) === Number(contextProfile.id);
  const isReviewLeftToMeDriver = contextProfile.role === 'driver' && isDriver && Number(review.driver.id) === Number(contextProfile.id);
  const isReviewLeftToMeRestaurant = contextProfile.role === 'restaurant' && !isDriver && Number(review.restaurant.id) === Number(contextProfile.id);

  let headerLabel = isDriver ? 'Driver Review' : 'Restaurant Review';
  if (isReviewLeftByMe) headerLabel = `My Review for ${isDriver ? 'Driver' : 'Restaurant'}`;
  else if (isReviewLeftToMeDriver || isReviewLeftToMeRestaurant) headerLabel = 'Customer Review to Me';

  const handleEdit = () => setEditVisible(true);
  const handleClose = () => setEditVisible(false);

  const handleSubmitEdit = async () => {
    // validate the rating and text
    if (isNaN(editRating) || editRating < 1 || editRating > 5) {
      showToast('Please enter a valid rating between 1.0 and 5.0', 'error');
      return;
    }

    if (editText.trim() === '') {
      showToast('Please enter a review text', 'error');
      return;
    }

    // submit
    const targetBodyId = isDriver ? review.driver.id : review.restaurant.id;
    const url = `${BACKEND}/review/${targetBody}/${targetBodyId}/order/${review.order_id}`;
    const fullUrl = `${url}?rating=${editRating}&review_text=${encodeURIComponent(editText)}`;

    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.put(fullUrl, {}, config);
      showToast('Review updated successfully', 'success');
      setEditVisible(false);

      // refresh the review list
      onRefresh();
    } catch (error) {
      console.error('Error updating review:', error);
      showToast('Error updating review', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      const url = `${BACKEND}/review/${targetBody}/${review[`${targetBody}_id`]}/order/${review.order_id}`;
      await axios.delete(url, {
        headers: {
          Authorization: contextProfile.token,
        },
      });
      onRefresh?.();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <View>
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
          right={() =>
            isReviewLeftByMe && (
              <View style={{ flexDirection: 'row', gap: 12, marginRight: 8 }}>
                <PressableIcon source="pencil" onPress={handleEdit} color="grey" size={20} />
                <PressableIcon source="delete" onPress={handleDelete} color="grey" size={20} />
              </View>
            )
          }
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

      <Portal>
        <Dialog visible={editVisible} onDismiss={handleClose}>
          <Dialog.Title>Edit Review</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Rating (1.0 - 5.0)"
              value={editRating.toString()}
              onChangeText={setEditRating}
              keyboardType="decimal-pad"
              style={{ marginBottom: 12 }}
            />
            <TextInput
              label="Review Text"
              multiline
              value={editText}
              onChangeText={setEditText}
              numberOfLines={2}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleClose}>Cancel</Button>
            <Button onPress={handleSubmitEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
