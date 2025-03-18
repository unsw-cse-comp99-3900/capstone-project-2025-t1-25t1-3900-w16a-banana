import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { BACKEND } from "../constants/backend";

export default function ZoomableImage({ imageUrl, title = "Image View", height = 150, borderRadius = 10, marginBottom = 10 }) {
  const router = useRouter();

  // make sure the image is real
  if (!imageUrl) return null;

  const fullImageUrl = `${BACKEND}/${imageUrl}`;

  return (
    <TouchableOpacity
      onPress={() => router.push({ pathname: "/ImageView", params: { imageUrl, title } })}
    >
      <Image
        source={{ uri: fullImageUrl }}
        style={{ width: "100%", height, borderRadius, marginBottom }}
        resizeMode="contain"
      />
    </TouchableOpacity>
  );
}
