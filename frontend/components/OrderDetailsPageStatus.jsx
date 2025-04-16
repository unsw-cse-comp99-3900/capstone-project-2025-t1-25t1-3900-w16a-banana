import React from "react";
import { View, Image } from "react-native";
import { Text, IconButton, Divider } from "react-native-paper";
import { STATUS_CONTENT, STATUS_LIST } from "../utils/order";

/**
 * Displays the current and next step of an ongoing order’s status using images and labels.
 *
 * order: the order object containing the current status.
 */
export default function OrderDetailsPageStatus({ order }) {
  const currentStepIndex = STATUS_LIST.findIndex(
    (status) => status === order.order_status
  );
  const nextStepIndex = currentStepIndex + 1;

  if (order.order_status === "DELIVERED" || order.order_status === "CANCELLED") {
    return null;
  }

  return (
    <View style={{ marginBottom: 4 }}>
      <Text variant="titleMedium" style={{ marginBottom: 8 }}>
        Order Status
      </Text>

      <View style={{ flexDirection: "row", alignItems: "center", gap: 16, justifyContent: "center" }}>
        {/* Current Step: top Current text, middle gif, bottom status title */}
        <View style={{ alignItems: "center", gap: 2 }}>
          <Text
            variant="labelLarge"
            style={{
              color: STATUS_CONTENT[order.order_status].color,
            }}
          >
            Current
          </Text>
          <Image
            source={STATUS_CONTENT[order.order_status].gif}
            style={{ width: 60, height: 60, borderRadius: 8 }}
          />
          <Text variant="labelLarge">
            {STATUS_CONTENT[order.order_status].title}
          </Text>
        </View>

        {/* Arrow */}
        {nextStepIndex < STATUS_LIST.length && (
          <IconButton icon="arrow-right-bold" size={24} iconColor="#888" />
        )}

        {/* Next Step */}
        <View style={{ alignItems: "center", gap: 2 }}>
          <Text variant="labelLarge" style={{ color: "#999" }}>
            Next
          </Text>
          <Image
            source={STATUS_CONTENT[STATUS_LIST[nextStepIndex]].gif}
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              opacity: 0.5,
            }}
          />
          <Text variant="labelLarge" style={{ color: "#888" }}>
            {STATUS_CONTENT[STATUS_LIST[nextStepIndex]].title}
          </Text>
        </View>
      </View>

      <Divider style={{ marginTop: 16 }} />
    </View>
  );
}
