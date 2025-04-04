import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Linking, Pressable, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";
import Carousel from "react-native-reanimated-carousel";
import { Dimensions, Image } from "react-native";
import { IconButton } from "react-native-paper";
import { BACKEND } from "../../../../../constants/backend";
import { router } from "expo-router";
import RestaurantMenu from "../../../../../components/RestaurantMenu";

export default function ViewRestaurantPage() {
  const { restaurantId } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const width = Dimensions.get("window").width;

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await axios.get(
          `${BACKEND}/profile/?user_type=restaurant&user_id=${restaurantId}`
        );
        setRestaurant(response.data);
      } catch (err) {
        console.error("Failed to fetch restaurant:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurant();
  }, [restaurantId]);

  if (loading || !restaurant) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  const imageUrls = [
    `${BACKEND}/${restaurant.url_img1}`,
    `${BACKEND}/${restaurant.url_img2}`,
    `${BACKEND}/${restaurant.url_img3}`,
  ];

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
      <View 
        style={{ 
          position: "absolute", 
          top: 15, 
          left: 5, 
          zIndex: 10 
        }}
      >
        <IconButton
          icon="arrow-left"
          size={28}
          iconColor="white"
          containerColor="rgba(0,0,0,0.4)"
          onPress={() => router.back()}
        />
      </View>
      {/* Carousel */}
      <Carousel
        loop
        width={width}
        height={240}
        autoPlay={true}
        data={imageUrls}
        scrollAnimationDuration={5000}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={{ width: width, height: 240 }}
            resizeMode="cover"
          />
        )}
      />

      {/* Profile Info Card */}
      <View
        style={{
          padding: 16,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          marginHorizontal: 16,
          marginBottom: 2,
          marginTop: 16,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 4 }}>
          {restaurant.name}
        </Text>
        {/* Phone Section with call icon */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: "bold" }}>Phone: </Text>
            {restaurant.phone}
          </Text>
          <IconButton
            icon="phone"
            size={16}
            iconColor="#0d6efd"
            onPress={() => Linking.openURL(`tel:${restaurant.phone}`)}
          />
        </View>

        {/* Address Section */}
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontWeight: "bold" }}>Address: </Text>
          {restaurant.address}
        </Text>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontWeight: "bold" }}>Suburb: </Text>
          {restaurant.suburb}
        </Text>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontWeight: "bold" }}>State: </Text>
          {restaurant.state}
        </Text>
        <Text style={{ fontSize: 16 }}>
          <Text style={{ fontWeight: "bold" }}>Postcode: </Text>
          {restaurant.postcode}
        </Text>
      </View>

      {/* display the menus */}
      <View style={{ paddingHorizontal: 16 }}>
        <RestaurantMenu restaurantId={restaurantId} />
      </View>
    </ScrollView>
  );
}
