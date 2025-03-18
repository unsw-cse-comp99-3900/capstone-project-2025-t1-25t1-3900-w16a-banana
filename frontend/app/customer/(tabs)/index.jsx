import React from "react";
import { View, Text, ScrollView } from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
      {/* Search Bar */}
      <TextInput
        mode="outlined"
        placeholder="Search"
        left={<TextInput.Icon icon="magnify" />}
        style={{ marginBottom: 16, backgroundColor: "#FFF" }}
      />

      {/* Quick Access Buttons */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}>
        <Button mode="outlined" icon="heart" onPress={() => router.push("/home/favourites")}>
          Favorites
        </Button>
        <Button mode="outlined" icon="cart" onPress={() => router.push("/cart")}>
          Cart
        </Button>
        <Button mode="outlined" icon="history" onPress={() => router.push("/history")}>
          History
        </Button>
      </View>

      {/* Placeholder for More Sections */}
      <View style={{ marginTop: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>Restaurants</Text>
        <Text style={{ color: "gray" }}>Coming soon...</Text>
      </View>
    </ScrollView>
  );
}




// import React from "react";
// import { View, Text, Image, ScrollView, Dimensions } from "react-native";
// import { TextInput, Button } from "react-native-paper";
// import ReanimatedCarousel from "react-native-reanimated-carousel";
// import { MaterialCommunityIcons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";

// const { width } = Dimensions.get("window");

// // Currently use some default images. 
// const carouselImages = [
//   require("../../assets/images/restaurant_img1.jpg"),
//   require("../../assets/images/restaurant_img2.jpg"),
//   require("../../assets/images/restaurant_img3.jpg"),
// ];

// const cuisines = [
//   { name: "Chinese", icon: "food" },
//   { name: "Indian", icon: "food-variant" },
//   { name: "French", icon: "silverware-fork-knife" },
//   { name: "Japanese", icon: "rice" },
// ];

// export default function Home() {
//   const router = useRouter();

//   // Reanimated carousel renderer
//   const renderCarouselItem = ({ item }) => {
//     return (
//       <Image
//         source={item}
//         style={{ width: "100%", height: "100%", borderRadius: 10 }}
//       />
//     );
//   };

//   return (
//     <ScrollView style={{ flex: 1, padding: 16, backgroundColor: "#f9f9f9" }}>
//       {/* Search Bar */}
//       <TextInput
//         mode="outlined"
//         placeholder="Search"
//         left={<TextInput.Icon icon="magnify" />}
//         style={{ marginBottom: 16, backgroundColor: "#FFF" }}
//       />

//       {/* Quick Access Buttons */}
//       <View
//         style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 16 }}
//       >
//         <Button
//           mode="outlined"
//           icon="heart"
//           onPress={() => router.push("/customer/favourites")}
//         >
//           Favorites
//         </Button>
//         <Button
//           mode="outlined"
//           icon="cart"
//           onPress={() => router.push("/customer/cart")}
//         >
//           Cart
//         </Button>
//         <Button
//           mode="outlined"
//           icon="history"
//           onPress={() => router.push("/customer/history")}
//         >
//           History
//         </Button>
//       </View>

//       {/* Reanimated Carousel */}
//       <View style={{ alignSelf: "center", marginBottom: 16 }}>
//         <ReanimatedCarousel
//           width={width * 0.8}
//           height={150}
//           autoPlay
//           data={carouselImages}
//           scrollAnimationDuration={1000}
//           renderItem={renderCarouselItem}
//           style={{ borderRadius: 10 }}
//           loop
//         />
//       </View>

//       {/* Cuisine Section */}
//       <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
//         <Text style={{ fontSize: 18, fontWeight: "bold" }}>Cuisine</Text>
//         <MaterialCommunityIcons name="chevron-right" size={24} color="black" />
//       </View>
//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 8 }}>
//         {cuisines.map((cuisine, index) => (
//           <View key={index} style={{ alignItems: "center", marginRight: 16 }}>
//             <MaterialCommunityIcons name={cuisine.icon} size={40} />
//             <Text>{cuisine.name}</Text>
//           </View>
//         ))}
//       </ScrollView>

//       {/* Placeholder for Restaurant List */}
//       <View style={{ marginTop: 20 }}>
//         <Text style={{ fontSize: 18, fontWeight: "bold" }}>Restaurants</Text>
//         <Text style={{ color: "gray" }}>Coming soon...</Text>
//       </View>
//     </ScrollView>
//   );
// }
