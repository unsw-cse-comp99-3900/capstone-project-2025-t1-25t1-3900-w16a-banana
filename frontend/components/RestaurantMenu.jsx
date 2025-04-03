import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, View, Image } from "react-native";
import { ActivityIndicator, Text, List, Button, IconButton } from "react-native-paper";
import axios from "axios";
import capitalize from "capitalize";
import { BACKEND } from "../constants/backend";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import { router } from "expo-router";
import ZoomableImage from "./ZoomableImage";

export default function RestaurantMenu({ restaurantId }) {
  const { showToast } = useToast();
  const { contextProfile } = useAuth();
  const isRestaurantOwner = (contextProfile.role === "restaurant" && Number(contextProfile.id) === Number(restaurantId));

  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Store multiple expanded categories
  const [expandedCategories, setExpandedCategories] = useState([]);

  useEffect(() => {
    const fetchMenu = async () => {
      const url = `${BACKEND}/restaurant-menu/${restaurantId}`;
      try {
        const response = await axios.get(url);
        setMenuCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurant menu:", error);
        showToast("Failed to fetch restaurant menu", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantId]);

  // Calculate all category IDs
  const allCategoryIds = useMemo(
    () => menuCategories.map((cat) => cat.id),
    [menuCategories]
  );

  // Determine if all categories are currently expanded
  const isAllExpanded = useMemo(() => {
    if (!allCategoryIds.length) return false;
    return allCategoryIds.every((id) => expandedCategories.includes(id));
  }, [allCategoryIds, expandedCategories]);

  const toggleAll = () => {
    isAllExpanded? setExpandedCategories([]) : setExpandedCategories(allCategoryIds);
  };

  const handleAccordionPress = (categoryId) => {
    // Toggle the accordion for a single category
    setExpandedCategories((prev) => {
      if (prev.includes(categoryId)) {
        // If currently expanded, collapse it
        return prev.filter((id) => id !== categoryId);
      } else {
        // If collapsed, expand it
        return [...prev, categoryId];
      }
    });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!menuCategories || menuCategories.length === 0) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge">No menu data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ paddingTop: 12, paddingBottom: 12 }}>
      <List.Section>
        {/* Toggle button to expand or shrink all categories at once */}
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {isRestaurantOwner ? "Current Menu" : "Restaurant Menu"}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button onPress={toggleAll}>
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
            {/* when the current viewer is the restaurant owner, then add the edit button */}
            <Button
              mode="elevated"
              icon="pencil"
              onPress={() => router.push("/restaurant/EditMenu")}
            >
              Edit
            </Button>
          </View>
        </View>

        {menuCategories.map((category) => {
          const categoryName = capitalize.words(category.name);
          const itemCount = category.items?.length || 0;

          return (
            <List.Accordion
              key={category.id}
              title={`${categoryName} (${itemCount} ${itemCount === 1 ? "item" : "items"})`}
              titleStyle={{ fontWeight: "bold" }}
              // Check if the category ID is in expandedCategories
              expanded={expandedCategories.includes(category.id)}
              onPress={() => handleAccordionPress(category.id)}
            >
              {itemCount > 0 ? (
                category.items.map((item) => (
                  <List.Item
                    key={item.id}
                    title={capitalize.words(item.name)}
                    titleStyle={{ fontWeight: "bold" }}
                    description={item.description}
                    // image on the left, text on the right
                    left={() => (
                      <ZoomableImage
                        imageUrl={item.url_img}
                        title={`Food: ${item.name}`}
                        height={60}
                        width={60}
                        borderRadus={0}
                        marginBottom={0}
                      />
                    )}
                    right={() => (
                      <View style={{ flexDirection: "row", alignItems: "center" }}>
                        {/* Price label */}
                        <Text style={{ marginRight: 8 }}>${item.price}</Text>
                        {/* show the shopping cart icon when it is hte customer */}
                        {contextProfile.role === "customer" && (
                          <IconButton
                            icon="cart-plus"
                            size={24}
                            onPress={() => showToast("todo", "error")}
                          />
                        )}
                      </View>
                    )}
                  />
                ))
              ) : (
                <List.Item
                  title="No items in this category yet."
                  titleStyle={{ fontStyle: "italic" }}
                />
              )}
            </List.Accordion>
          );
        })}
      </List.Section>
    </ScrollView>
  );
}
