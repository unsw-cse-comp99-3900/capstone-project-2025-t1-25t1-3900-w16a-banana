import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const tabs = [
  { name: "index", title: "Home", icon: "home" },
  { name: "history", title: "History", icon: "history" },
  { name: "cart", title: "Cart", icon: "cart" },
  { name: "notifications", title: "Notifications", icon: "bell" },
  { name: "profile", title: "Profile", icon: "account" },
]

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "blue" }}>
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            tabBarIcon: (props) => (
              <MaterialCommunityIcons name={tab.icon} size={24} color={props.color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
