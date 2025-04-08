import React from "react";
import BottomTabs from "../../../components/BottomTabs";

const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "cart", title: "Cart", icon: "cart", visible: true },
  { name: "orders", title: "Active Orders", icon: "clipboard-text", visible: true },
  { name: "OrderHistory", title: "Order History", icon: "history", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hide favourites from the tab bar
  { name: "favourites", title: "Favourites", icon: "heart", visible: false },
  { name: "EditProfile", title: "Edit Profile", icon: "map-marker", visible: false },
  { name: "view/restaurant/[restaurantId]", title: "Restaurant", icon: "map-marker", visible: false },
  { name: "view/driver/[driverId]", title: "Driver", icon: "map-marker", visible: false },
  { name: "view/order/[orderId]", title: "Order", icon: "map-marker", visible: false },
  { name: "checkout/[restaurantId]", title: "Checkout", icon: "map-marker", visible: false },
];

export default function TabLayout() {
  return (
    <BottomTabs tabs={tabs} />
  );
}
