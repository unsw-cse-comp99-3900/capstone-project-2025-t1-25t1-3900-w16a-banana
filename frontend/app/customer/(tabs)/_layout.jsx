import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BottomTabs from "../../../components/BottomTabs";

const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "cart", title: "Cart", icon: "cart", visible: true },
  { name: "history", title: "History", icon: "history", visible: true },
  { name: "notifications", title: "Notifications", icon: "bell", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hide favourites from the tab bar
  { name: "favourites", title: "Favourites", icon: "heart", visible: false },
  { name: "EditAddress", title: "Edit Address", icon: "map-marker", visible: false },
  { name: "EditPersonalInfo", title: "Edit Personal Info", icon: "account-edit", visible: false },
];

export default function TabLayout() {
  return (
    <BottomTabs tabs={tabs} />
  );
}
