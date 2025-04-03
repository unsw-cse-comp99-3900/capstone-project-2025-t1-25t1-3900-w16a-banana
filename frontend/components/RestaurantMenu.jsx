import React, { useEffect, useState, useMemo } from "react";
import { ScrollView, View, Image } from "react-native";
import { ActivityIndicator, Text, List, Button } from "react-native-paper";
import axios from "axios";
import capitalize from "capitalize";
import { BACKEND } from "../constants/backend";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";

export default function RestaurantMenu({ restaurantId }) {
  const { showToast } = useToast();
  const { contextProfile } = useAuth();

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
    <ScrollView style={{ padding: 16 }}>
      <List.Section>
        {/* Toggle button to expand or shrink all categories at once */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginBottom: 12 }}>
          <Button onPress={toggleAll}>
            {isAllExpanded ? "Collapse All" : "Expand All"}
          </Button>
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
                    // Left component: image (60x60)
                    left={() => (
                      <Image
                        source={{ uri: `${BACKEND}/${item.url_img}` }}
                        style={{ width: 60, height: 60, marginRight: 8 }}
                        resizeMode="cover"
                      />
                    )}
                    // Right component: price
                    right={() => (
                      <Text style={{ alignSelf: "center", marginRight: 16 }}>
                        ${item.price}
                      </Text>
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
