import React from "react";
import BottomTabs from "../../../components/BottomTabs";

const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "applications", title: "Applications", icon: "briefcase", visible: true },
  { name: "users", title: "Users", icon: "account-group", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hide favourites from the tab bar
  { name: "EditProfile", title: "Edit Profile", icon: "map-marker", visible: false },
];

export default function TabLayout() {
  return (
    <BottomTabs tabs={tabs} />
  );
}
