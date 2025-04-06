import React from "react";
import { View } from "react-native";
import { Text, IconButton } from "react-native-paper";
import ZoomableImage from "./ZoomableImage";

export default function RestaurantMenuItem({ item, quantity, onUpdate, isCustomer }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8 }}>
      {/* Image */}
      <ZoomableImage
        imageUrl={item.url_img}
        title={`Food: ${item.name}`}
        height={65}
        width={65}
        borderRadus={6}
        marginBottom={0}
      />

      {/* Content */}
      <View style={{ flex: 1 }}>
        <Text variant="titleMedium" style={{ fontWeight: "bold", marginTop: -4 }}>
          {item.name}
        </Text>
        <Text variant="titleSmall" style={{ color: "#555", marginBottom: isCustomer ? 0 : 6 }}>
          {item.description}
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text variant="titleSmall" style={{ fontWeight: "600" }}>${item.price.toFixed(2)}</Text>
          {isCustomer && (
            quantity === 0 ? (
              <IconButton
                icon="cart-plus"
                size={18}
                onPress={() => onUpdate(item.id, 1)}
              />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                <IconButton
                  icon="minus"
                  size={18}
                  onPress={() => onUpdate(item.id, quantity - 1)}
                />
                <Text variant="titleSmall">{quantity}</Text>
                <IconButton
                  icon="plus"
                  size={18}
                  onPress={() => onUpdate(item.id, quantity + 1)}
                />
              </View>
            )
          )}
        </View>
      </View>
    </View>
  );
}
