import React from "react";
import { TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { BACKEND } from "../constants/backend";

/**
 * ZoomableImage Component
 *
 * A clickable image component that navigates to a fullscreen image view when pressed.
 *
 * imageUrl: string - relative path to the image file stored on the backend
 * title: string - optional title shown on the image view page (default: "Image View")
 * height: number - height of the image (default: 150)
 * borderRadius: number - border radius for styling the image (default: 10)
 * marginBottom: number - bottom margin below the image (default: 10)
 * width: string or number - width of the image (default: "100%")
 */
export default function ZoomableImage({ imageUrl, title = "Image View", height = 150, borderRadius = 10, marginBottom = 10, width="100%" }) {
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
        style={{ width, height, borderRadius, marginBottom }}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
}
