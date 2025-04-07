import React from "react";
import { View, Image, Dimensions } from "react-native";
import { Button, Text } from "react-native-paper";
import ReanimatedCarousel from "react-native-reanimated-carousel";
import MyScrollView from "../../../components/MyScrollView";
import { router } from "expo-router";
import RestaurantList from "../../../components/RestaurantList";
import useUserLocation from "../../../hooks/useUserLocation";
import Img1 from "../../../assets/images/restaurant_img1.jpg";
import Img2 from "../../../assets/images/restaurant_img2.jpg";
import Img3 from "../../../assets/images/restaurant_img3.jpg";

const { width } = Dimensions.get("window");

// carousel uses some default images
const carouselImages = [Img1, Img2, Img3];

export default function Home() {
  // use the hook to obtain the location
  const { location, locationDetails } = useUserLocation();
  console.log("Location:", location);

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
