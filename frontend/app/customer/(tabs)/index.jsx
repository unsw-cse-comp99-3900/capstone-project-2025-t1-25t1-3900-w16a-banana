import React from "react";
import { View, Image, Dimensions } from "react-native";
import { Text } from "react-native-paper";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import MyScrollView from "../../../components/MyScrollView";
import RestaurantList from "../../../components/RestaurantList";
import useUserLocation from "../../../hooks/useUserLocation";
import Img1 from "../../../assets/images/restaurant_img1.jpg";
import Img2 from "../../../assets/images/restaurant_img2.jpg";
import Img3 from "../../../assets/images/restaurant_img3.jpg";

const { width } = Dimensions.get("window");

// carousel uses some default images
const carouselImages = [Img1, Img2, Img3];

/**
 * Home screen for the customer view.
 * 
 * Displays the user's location, a carousel of featured images, and quick access buttons to
 * favorites, cart, and order history. Also renders a list of nearby restaurants with a search filter.
 */
export default function Home() {
  // use the hook to obtain the location
  const { location, locationDetails } = useUserLocation();

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

      {/* Reanimated Carousel */}
      <View style={{ alignSelf: "center", marginBottom: 16 }}>
        <ReanimatedCarousel
          width={width * 0.8}
          height={150}
          autoPlay
          data={carouselImages}
          scrollAnimationDuration={5500}
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
