import React, { useCallback, useState } from "react";
import { View, Image } from "react-native";
import { Text, Card, ActivityIndicator, Button } from "react-native-paper";
import axios from "axios";
import { BACKEND } from "../constants/backend";
import OrderRatingStar from "./OrderRatingStar";
import useAuth from "../hooks/useAuth";
import { router, useFocusEffect } from "expo-router";

export default function RestaurantReviews({ role, id }) {
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [nReviews, setNReviews] = useState(0);

  // check if this restaurant is mine
  const { contextProfile } = useAuth();
  const isReviewToMe = contextProfile.role === role && Number(contextProfile.id) === Number(id);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${BACKEND}/review/${role}/${id}`);
      setReviews(res.data.reviews || []);
      setAvgRating(res.data.avg_rating || 0);
      setNReviews(res.data.n_reviews || 0);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchReviews();
    }, [role, id])
  );

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} />;
  }

  return (
    <View style={{ marginVertical: 16 }}>
      <Text variant="titleMedium" style={{ marginBottom: 4, fontWeight: "bold" }}>Customer Reviews</Text>
      <OrderRatingStar rating={avgRating} />
      <Text style={{ marginBottom: 12 }}>{nReviews} review{nReviews !== 1 ? "s" : ""}</Text>

      <Button
        mode="text"
        onPress={() => setExpanded(prev => !prev)}
        style={{ marginBottom: 12 }}
      >
        {expanded ? "Hide Reviews" : "Show All Reviews"}
      </Button>

      {expanded && reviews.map((r) => (
        <Card key={r.review_id} style={{ marginBottom: 12, backgroundColor: "#fafafa" }}>
          <Card.Title
            title={r.customer_name}
            subtitle={new Date(r.time).toISOString().slice(0, 10)}
            left={() => (
              <Image
                source={{ uri: `${BACKEND}/${r.customer_profile_img}` }}
                style={{ width: 36, height: 36, borderRadius: 18 }}
              />
            )}
          />
          <Card.Content>
            <OrderRatingStar rating={r.rating} />
            <Text style={{ marginTop: 4 }}>{r.review_text}</Text>

            {isReviewToMe && (
              <Button
                mode="text"
                onPress={() => router.push(`/${contextProfile.role}/view/order/${r.order_id}`)}
                compact
              >
                View Order
              </Button>
            )}
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}
