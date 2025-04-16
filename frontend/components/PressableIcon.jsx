import React from "react";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

/**
 * A reusable component that renders a clickable icon using React Native Paper and Pressable.
 *
 * onPress - Function to be called when the icon is pressed.
 * source  - Icon name or source, passed to the Paper `Icon` component.
 * color   - Color of the icon.
 * size    - Size of the icon.
 */
export default function PressableIcon({
  onPress,
  source,
  color,
  size,
}) {
  return (
    <Pressable onPress={onPress}>
      <Icon source={source} size={size} color={color} />
    </Pressable>
  );
}
