import React, { useEffect, useState } from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import MyScrollView from "../../../components/MyScrollView";
import useDialog from "../../../hooks/useDialog";
import { router } from "expo-router";
import useToast from "../../../hooks/useToast";
import { fetchLocationDetailFromCoordinate } from "../../../utils/location";
import RestaurantList from "../../../components/RestaurantList";

const { width } = Dimensions.get("window");

// Currently use some default images. 
const carouselImages = [
  require("../../../assets/images/restaurant_img1.jpg"),
  require("../../../assets/images/restaurant_img2.jpg"),
  require("../../../assets/images/restaurant_img3.jpg"),
];

// Google map api key
const GOOGLE_API_KEY = "AIzaSyATnj7gIKlNSS8hZdGpV_E3XLOik8OY9tY";

export default function Home() {
  const { showDialog } = useDialog();
  const { showToast } = useToast();

  // fallback to unsw location
  const UNSWLocation = { lat: -33.9173, lng: 151.2313 };
  const [location, setLocation] = useState(null);

  // {state, suburb, postcode}
  const [locationDetails, setLocationDetails] = useState(null);

  console.log("Location:", location);

  useEffect(() => {
    const successfulCallback = async (position) => {
      const { latitude, longitude } = position.coords;
      const detail = await fetchLocationDetailFromCoordinate(latitude, longitude);
      setLocation({ lat: latitude, lng: longitude });
      setLocationDetails(detail);
    };
    
    const errorCallback = (error) => {
      console.error("Location error:", error);
      showDialog({
        title: "Location Access Needed",
        message: "We couldn't access your current location. Would you like to use UNSW Sydney as your location for nearby restaurants?",
        onConfirm: async () => {
          const detail = await fetchLocationDetailFromCoordinate(UNSWLocation.lat, UNSWLocation.lng);
          setLocation(UNSWLocation);
          setLocationDetails(detail);
        },
        confirmText: "Use UNSW",
        cancelText: "Cancel"
      });
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 10000,
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(successfulCallback, errorCallback, options);
    } else {
      // showToast: error in accessing the location, use default UNSW location
      showToast({
        type: "error",
        message: "Geolocation is not supported by this browser.",
      });

      setLocation(UNSWLocation);
    }
  }, []);

  // Reanimated carousel renderer
  const renderCarouselItem = ({ item }) => {
    return (
      <Image
        source={item}
        style={{ width: "100%", height: "100%", borderRadius: 10 }}
      />
    );
  };

  return (
    <MyScrollView>
      {locationDetails && (
        <Text style={{ textAlign: "center", marginBottom: 10 }} variant="bodyLarge">
          📍 Your location: {locationDetails.suburb}, {locationDetails.postcode}, {locationDetails.state}
        </Text>
      )}
      {/* Quick Access Buttons */}
      <View
        style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}
      >
        <Button
          mode="outlined"
          icon="heart"
          onPress={() => router.push("/customer/favourites")}
        >
          Favorites
        </Button>
        <Button
          mode="outlined"
          icon="cart"
          onPress={() => router.push("/customer/cart")}
        >
          Cart
        </Button>
        <Button
          mode="outlined"
          icon="history"
          onPress={() => router.push("/customer/history")}
        >
          History
        </Button>
      </View>

      {/* Reanimated Carousel */}
      <View style={{ alignSelf: "center", marginBottom: 16 }}>
        <ReanimatedCarousel
          width={width * 0.8}
          height={150}
          autoPlay
          data={carouselImages}
          scrollAnimationDuration={1500}
          renderItem={renderCarouselItem}
          style={{ borderRadius: 10 }}
          loop
        />
      </View>

      {/* Placeholder for Restaurant List */}
      <View>
        <RestaurantList 
          userLocation={location} 
          showTextFilter={true}
        />
      </View>
    </MyScrollView>
  );
}
