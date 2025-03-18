import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const tabs = [
  { name: "index", title: "Home", icon: "home", visible: true },
  { name: "cart", title: "Cart", icon: "cart", visible: true },
  { name: "history", title: "History", icon: "history", visible: true },
  { name: "notifications", title: "Notifications", icon: "bell", visible: true },
  { name: "profile", title: "Profile", icon: "account", visible: true },
  // hide favourites from the tab bar
  { name: "favourites", title: "Favourites", icon: "heart", visible: false },
];

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue", headerShown: false }}>
      {tabs.map((tab) =>
        tab.visible ? (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              title: tab.title,
              tabBarIcon: ({ color }) => (
                <MaterialCommunityIcons name={tab.icon} size={24} color={color} />
              ),
            }}
          />
        ) : (
          <Tabs.Screen
            key={tab.name}
            name={tab.name}
            options={{
              href: null,
            }}
          />
        )
      )}
    </Tabs>
  );
}
