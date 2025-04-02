import React, { useEffect, useState } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text, Card, Paragraph } from "react-native-paper";
import { BACKEND } from "../constants/backend";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import axios from "axios";

export default function RestaurantMenu({ restaurantId }) {
  console.log(restaurantId);

  const { showToast } = useToast();
  const { contextProfile } = useAuth();

  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const url = `${BACKEND}/restaurant-menu/${restaurantId}`;
  
      try {
        const response = await axios.get(url);
        const data = response.data;
        setMenuCategories(data);
      } catch (error) {
        console.error("Failed to fetch restaurant menu:", error);
        showToast("Failed to fetch restaurant menu", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!menuCategories || !menuCategories.length) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge">No menu data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      {menuCategories.map((category) => (
        <View key={category.id} style={{ marginBottom: 24 }}>
          {/* Category Name */}
          <Text variant="titleLarge" style={{ marginBottom: 8 }}>
            {category.name}
          </Text>

          {/* List Items in this Category */}
          {category.items && category.items.length ? (
            category.items.map((item) => (
              <Card key={item.id} style={{ marginBottom: 12 }}>
                <Card.Title title={item.name} />

                {/* Show image if available */}
                {item.url_img ? (
                  <Card.Cover source={{ uri: `http://127.0.0.1:11000/${item.url_img}` }} />
                ) : null}

                <Card.Content>
                  <Paragraph>{item.description}</Paragraph>
                  <Paragraph>Price: ${item.price}</Paragraph>
                </Card.Content>
              </Card>
            ))
          ) : (
            <Text variant="bodyMedium" style={{ fontStyle: "italic" }}>
              No items in this category
            </Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
