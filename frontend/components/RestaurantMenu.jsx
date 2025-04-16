import React, { useEffect, useState, useMemo, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { ActivityIndicator, Text, List, Button } from "react-native-paper";
import axios from "axios";
import capitalize from "capitalize";
import { BACKEND } from "../constants/backend";
import useToast from "../hooks/useToast";
import useAuth from "../hooks/useAuth";
import { router, useFocusEffect } from "expo-router";
import RestaurantMenuItem from "./RestaurantMenuItem";

/**
 * RestaurantMenu - Displays the menu for a restaurant, with options for customers to add items to cart
 * and for restaurant owners to edit their menu. Supports expanding/collapsing menu categories.
 * 
 * restaurantId: number - ID of the restaurant whose menu is to be displayed.
 */
export default function RestaurantMenu({ restaurantId }) {
  const { showToast } = useToast();
  const { contextProfile } = useAuth();
  const isCustomer = contextProfile.role === "customer";
  const isRestaurantOwner = contextProfile.role === "restaurant" && Number(contextProfile.id) === Number(restaurantId);

  const [menuCategories, setMenuCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  const [expandedCategories, setExpandedCategories] = useState([]);

  // during loading, fetch the menu, and also fetch the cart if the user is a customer
  const fetchMenu = async () => {
    const url = `${BACKEND}/restaurant-menu/${restaurantId}`;

    try {
      const response = await axios.get(url);
      setMenuCategories(response.data);
    } catch {
      showToast("Failed to fetch restaurant menu", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // for everyone
    fetchMenu();

    // for customer only
    if (isCustomer) {
      fetchCart();
    }
  }, [restaurantId]);

  const fetchCart = async () => {
    const url = `${BACKEND}/customer-order/cart/v2`;
    const config = { headers: { Authorization: contextProfile.token } };

    try {
      const response = await axios.get(url, config);

      // only keep the cart for the current restaurant
      const restaurantCart = response.data.find(r => Number(r.restaurant_id) === Number(restaurantId));
      setCartItems(restaurantCart?.items || []);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    }
  };

  // update the menu for everyone, and for customer, update the cart
  useFocusEffect(
    useCallback(() => {
      fetchMenu();

      if (isCustomer) {
        fetchCart();
      }
    }, [contextProfile, isCustomer, restaurantId])
  );

  const updateCart = async (menu_id, quantity) => {
    try {
      const payload = { menu_id, quantity };
      const headers = { Authorization: contextProfile.token };
      await axios.put(`${BACKEND}/customer-order/cart`, payload, { headers });
      fetchCart();
    } catch (err) {
      console.log(err);
      showToast("Failed to update cart", "error");
    }
  };

  const allCategoryIds = useMemo(() => menuCategories.map(cat => cat.id), [menuCategories]);

  const isAllExpanded = useMemo(() => {
    if (!allCategoryIds.length) return false;
    return allCategoryIds.every(id => expandedCategories.includes(id));
  }, [allCategoryIds, expandedCategories]);

  const toggleAll = () => {
    isAllExpanded ? setExpandedCategories([]) : setExpandedCategories(allCategoryIds);
  };

  const handleAccordionPress = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const getCartQuantity = (menuId) => {
    const found = cartItems.find(item => item.menu_id === menuId);
    return found?.quantity || 0;
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!menuCategories.length) {
    return (
      <View style={{ padding: 16 }}>
        <Text variant="titleLarge">No menu data found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ paddingTop: 8, paddingBottom: 12 }}>
      <List.Section>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text variant="titleMedium" style={{ fontWeight: "bold" }}>
            {isRestaurantOwner ? "Current Menu" : "View Menu"}
          </Text>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <Button onPress={toggleAll}>
              {isAllExpanded ? "Collapse All" : "Expand All"}
            </Button>
            {isRestaurantOwner && (
              <Button
                mode="elevated"
                icon="pencil"
                onPress={() => router.push("/restaurant/EditMenu")}
              >
                Edit
              </Button>
            )}
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
              expanded={expandedCategories.includes(category.id)}
              onPress={() => handleAccordionPress(category.id)}
            >
              {itemCount > 0 ? (
                category.items.map((item) => {
                  return (
                    <List.Item
                      key={item.id}
                      description={()=>(
                        <RestaurantMenuItem
                          item={item}
                          quantity={getCartQuantity(item.id)}
                          onUpdate={updateCart}
                          isCustomer={isCustomer}
                        />
                      )}
                    />
                  );
                })
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
