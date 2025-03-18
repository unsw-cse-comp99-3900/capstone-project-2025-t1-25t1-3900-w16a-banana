import React from "react";
import { View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Appbar } from "react-native-paper";
import ImageViewer from "react-native-image-zoom-viewer";
import { BACKEND } from "../constants/backend";

export default function ImageView() {
  const router = useRouter();
  const { imageUrl, title } = useLocalSearchParams();

  const fullImageUrl = `${BACKEND}/${imageUrl}`;

  return (
    <View style={{ flex: 1, backgroundColor: "black" }}>
      {/* App Bar with Back Button */}
      <Appbar.Header style={{ backgroundColor: "black" }}>
        <Appbar.BackAction onPress={() => router.back()} iconColor="white" />
        <Appbar.Content title={title || "Image View"} titleStyle={{ color: "white" }} />
      </Appbar.Header>

      {/* IEnable zoom, enable swipe down */}
      <ImageViewer
        imageUrls={[{ url: fullImageUrl }]} 
        enableSwipeDown={true}
        onSwipeDown={() => router.back()}
        backgroundColor="black"
      />
    </View>
  );
}
