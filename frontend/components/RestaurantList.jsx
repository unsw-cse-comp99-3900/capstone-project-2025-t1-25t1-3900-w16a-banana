import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import axios from "axios";
import RestaurantListItem from "./RestaurantListItem";
import { calculateDistance, fetchLocationDetailFromAddress } from "../utils/location";
import { BACKEND } from "../constants/backend";

export default function RestaurantList({ userLocation }) {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${BACKEND}/search/restaurant`);
        const rawRestaurants = response.data;

        // batch convert the restaurant address to coordinates
        const enriched = await Promise.all(
          rawRestaurants.map(async (r) => {
            const addressDict = {
              address: r.address,
              suburb: r.suburb,
              state: r.state,
              postcode: r.postcode,
            };

            const location = await fetchLocationDetailFromAddress(addressDict);
            return { ...r, coordinates: location };
          })
        );

        setRestaurants(enriched);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  useEffect(() => {
    if (!userLocation || restaurants.length === 0) return;

    const withDistance = restaurants.map((r) => {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, r.coordinates.lat, r.coordinates.lng);
      return { ...r, distance: dist };
    });

    const sorted = [...withDistance].sort((a, b) => a.distance - b.distance);
    setSortedRestaurants(sorted);
  }, [userLocation, restaurants]);

  if (loading) {
    return <ActivityIndicator />;
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold" }}>Restaurants</Text>
      {sortedRestaurants.map((r) => (
        <RestaurantListItem key={r.id} restaurant={r} />
      ))}
    </View>
  );
}
