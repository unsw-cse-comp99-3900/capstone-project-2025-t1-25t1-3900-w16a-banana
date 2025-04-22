import React, { useState } from 'react';
import { View } from 'react-native';
import { Text, Card, Avatar, Dialog, Portal, TextInput, Button } from 'react-native-paper';
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

  const [replyVisible, setReplyVisible] = useState(false);
  const [replyText, setReplyText] = useState(review.reply || '');

  const isDriver = targetBody === 'driver';
  const name = isDriver ? `${review.driver.first_name} ${review.driver.last_name}` : review.restaurant.name;

  const isReviewLeftByMe = contextProfile.role === 'customer' && Number(review.customer_id) === Number(contextProfile.id);
  const isReviewLeftToMeDriver = contextProfile.role === 'driver' && isDriver && Number(review.driver.id) === Number(contextProfile.id);
  const isReviewLeftToMeRestaurant = contextProfile.role === 'restaurant' && !isDriver && Number(review.restaurant.id) === Number(contextProfile.id);

  const canReply = (isReviewLeftToMeDriver || isReviewLeftToMeRestaurant);

  let headerLabel = isDriver ? 'Driver Review' : 'Restaurant Review';
  if (isReviewLeftByMe) headerLabel = `My Review for ${isDriver ? 'Driver' : 'Restaurant'}`;
  else if (canReply) headerLabel = 'Customer Review to Me';

  const handleEdit = () => setEditVisible(true);
  const handleReply = () => setReplyVisible(true);
  const handleCloseEdit = () => setEditVisible(false);
  const handleCloseReply = () => setReplyVisible(false);

  const handleSubmitEdit = async () => {
    if (isNaN(editRating) || editRating < 1 || editRating > 5) {
      showToast('Please enter a valid rating between 1.0 and 5.0', 'error');
      return;
    }

    if (editText.trim() === '') {
      showToast('Please enter a review text', 'error');
      return;
    }

    const targetBodyId = isDriver ? review.driver.id : review.restaurant.id;
    const url = `${BACKEND}/review/${targetBody}/${targetBodyId}/order/${review.order_id}`;
    const fullUrl = `${url}?rating=${editRating}&review_text=${encodeURIComponent(editText)}`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      await axios.put(fullUrl, {}, config);
      showToast('Review updated successfully', 'success');
      setEditVisible(false);
      onRefresh();
    } catch (error) {
      console.error('Error updating review:', error);
      showToast('Error updating review', 'error');
    }
  };

  const handleSubmitReply = async () => {
    if (!replyText.trim()) {
      showToast('Reply cannot be empty', 'error');
      return;
    }

    const replyUrl = `${BACKEND}/review/${contextProfile.role}/reply/${review.review_id}`;
    const config = {
      headers: {
        Authorization: contextProfile.token,
        'Content-Type': 'application/json',
      },
    };

    try {
      await axios.put(replyUrl, { reply: replyText }, config);
      showToast('Reply submitted successfully', 'success');
      setReplyVisible(false);
      onRefresh();
    } catch (err) {
      console.error('Error submitting reply:', err);
      showToast('Failed to submit reply', 'error');
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
          right={() => (
            <View style={{ flexDirection: 'row', gap: 12, marginRight: 8 }}>
              {isReviewLeftByMe && (
                <PressableIcon source="pencil" onPress={handleEdit} color="grey" size={20} />
              )}
              {canReply && (
                <PressableIcon
                  source={review.reply ? 'pencil' : 'reply'}
                  onPress={handleReply}
                  color="grey"
                  size={20}
                />
              )}
            </View>
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
              <Text style={{ fontStyle: 'italic', fontSize: 12 }}>
                {capitalize(targetBody)} Reply: {review.reply}
              </Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Customer Edit Review Dialog */}
      <Portal>
        <Dialog visible={editVisible} onDismiss={handleCloseEdit}>
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
            <Button onPress={handleCloseEdit}>Cancel</Button>
            <Button onPress={handleSubmitEdit}>Save</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

      {/* Driver or Restaurant Reply to Review Dialog */}
      <Portal>
        <Dialog visible={replyVisible} onDismiss={handleCloseReply}>
          <Dialog.Title>{review.reply ? 'Edit Reply' : 'Leave a Reply'}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label="Reply"
              multiline
              numberOfLines={3}
              value={replyText}
              onChangeText={setReplyText}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleCloseReply}>Cancel</Button>
            <Button onPress={handleSubmitReply}>Submit</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
