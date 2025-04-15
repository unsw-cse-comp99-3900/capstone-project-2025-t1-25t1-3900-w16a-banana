import React from "react";
import { Pressable } from "react-native";
import { Icon } from "react-native-paper";

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
