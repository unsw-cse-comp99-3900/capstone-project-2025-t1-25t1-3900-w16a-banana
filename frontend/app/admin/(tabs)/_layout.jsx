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

/**
 * Renders the bottom tab navigation layout for the admin section.
 * 
 * Tabs:
 * - index: Home tab with a house icon.
 * - applications: Shows pending applications, uses briefcase icon.
 * - users: Displays user management view, uses account-group icon.
 * - profile: Admin profile page, uses account icon.
 * - EditProfile: Hidden from the tab bar, used for editing admin profile.
 * 
 * Returns:
 * - The BottomTabs component configured with admin-specific tab settings.
 */
export default function TabLayout() {
  return (
    <BottomTabs tabs={tabs} />
  );
}
