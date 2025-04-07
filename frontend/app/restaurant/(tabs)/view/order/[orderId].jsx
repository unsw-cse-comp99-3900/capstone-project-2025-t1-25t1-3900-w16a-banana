import React from "react";
import OrderDetailsPage from "../../../../../components/OrderDetailsPage";
import { useLocalSearchParams } from "expo-router";

export default function ViewOrderDetailPage() {
  const { orderId } = useLocalSearchParams();

  return (
    <OrderDetailsPage orderId={orderId} />
  );
}
