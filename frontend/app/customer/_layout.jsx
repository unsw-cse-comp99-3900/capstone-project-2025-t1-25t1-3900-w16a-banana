// /app/customer/_layout.jsx
import React, { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import { View, Text } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Home from "./index";
import History from "./history";
import Cart from "./cart";
import Notifications from "./notifications";
import Profile from "./profile";

export default function CustomerLayout() {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "home", title: "Home", icon: "home" },
    { key: "history", title: "History", icon: "history" },
    { key: "cart", title: "Cart", icon: "cart" },
    { key: "notifications", title: "Notifications", icon: "bell" },
    { key: "profile", title: "Profile", icon: "account" },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    home: () => <Home />, 
    history: () => <History />, 
    cart: () => <Cart />, 
    notifications: () => <Notifications />, 
    profile: () => <Profile />, 
  });

  const renderIcon = (props) => (
    <MaterialCommunityIcons name={props.route.icon} size={24} color={props.color} />
  );

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
      renderIcon={renderIcon}
    />
  );
}