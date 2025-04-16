import React from "react";
import BottomTabs from "../../../components/BottomTabs";

const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "cart", title: "Cart", icon: "cart", visible: true },
  { name: "orders", title: "Active Orders", icon: "clipboard-text", visible: true },
  { name: "OrderHistory", title: "Order History", icon: "history", visible: true },
  { name: "chats", title: "Chats", icon: "chat", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },

  // hide these tabs from the bottom tab bar, but still allow navigation to them
  { name: "EditProfile", title: "Edit Profile", icon: "map-marker", visible: false },
  { name: "view/restaurant/[restaurantId]", title: "Restaurant", icon: "map-marker", visible: false },
  { name: "view/driver/[driverId]", title: "Driver", icon: "map-marker", visible: false },
  { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
  { name: "view/chat", title: "Chat", icon: "chat", visible: false },
  { name: "checkout/[restaurantId]", title: "Checkout", icon: "map-marker", visible: false },
];

/**
 * TabLayout renders the bottom tab navigation for customer users.
 * 
 * It defines all available tab screens, marking which should be visible in the tab bar
 * and which are accessible only via internal navigation (e.g., view pages or checkout).
 */
export default function TabLayout() {
  return (
    <BottomTabs tabs={tabs} />
  );
}
