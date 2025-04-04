import React, { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import axios from "axios";
import RestaurantListItem from "./RestaurantListItem";
import { calculateDistance, fetchLocationDetailFromAddress } from "../utils/location";
import { BACKEND } from "../constants/backend";
import { Button, TextInput, Text } from "react-native-paper";
import RestaurantListMapViewWeb from "./RestaurantListMapViewWeb";

export default function RestaurantList({ userLocation, showTextFilter = false }) {
  const [restaurants, setRestaurants] = useState([]);
  const [sortedRestaurants, setSortedRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await axios.get(`${BACKEND}/search/restaurant`);
        const rawRestaurants = response.data;

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
      const dist = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        r.coordinates.lat,
        r.coordinates.lng
      );
      return { ...r, distance: dist };
    });

    const sorted = [...withDistance].sort((a, b) => a.distance - b.distance);
    setSortedRestaurants(sorted);
  }, [userLocation, restaurants]);

  // Filter restaurants by search text
  const filteredRestaurants = sortedRestaurants.filter((r) => {
    const keyword = searchText.toLowerCase();
    return (
      r.name.toLowerCase().includes(keyword) ||
      r.description?.toLowerCase().includes(keyword)
    );
  });

  if (loading) return <ActivityIndicator />;

  return (
    <View style={{ padding: 4 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Text variant="titleLarge">Restaurants</Text>
        <Button
          mode="text"
          onPress={() => setIsMapView(!isMapView)}
          icon={isMapView ? "view-list" : "map"}
        >
          {isMapView ? "List View" : "Map View"}
        </Button>
      </View>

      {isMapView ? (
        <RestaurantListMapViewWeb
          restaurants={filteredRestaurants}
          userLocation={userLocation}
        />
      ) : (
        <View>
          {showTextFilter && (
            <TextInput
              dense={true}
              label="Search Restaurant..."
              mode="outlined"
              placeholder="Search"
              value={searchText}
              onChangeText={setSearchText}
              left={<TextInput.Icon icon="magnify" />}
              right={
                searchText.length > 0 ? (
                  <TextInput.Icon icon="close" onPress={() => setSearchText("")} />
                ) : null
              }
              style={{ marginBottom: 12, backgroundColor: "#FFF" }}
            />
          )}
          {filteredRestaurants.map((r) => (
            <RestaurantListItem key={r.id} restaurant={r} />
          ))}
        </View>
      )}
    </View>
  );
}
