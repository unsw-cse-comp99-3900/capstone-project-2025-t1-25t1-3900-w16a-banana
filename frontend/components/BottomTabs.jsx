import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

// Some tabs are visible, others are hidden
export default function BottomTabs({ tabs }) {
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