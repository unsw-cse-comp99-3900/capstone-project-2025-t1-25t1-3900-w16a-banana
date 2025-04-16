import React from "react";
import OrderDetailsPage from "../../../../../components/OrderDetailsPage";
import { useLocalSearchParams } from "expo-router";

/**
 * * ViewOrderDetailPage component renders the OrderDetailsPage component for customers.
 */
export default function ViewOrderDetailPage() {
  const { orderId } = useLocalSearchParams();

  return (
    <OrderDetailsPage orderId={orderId} />
  );
}
