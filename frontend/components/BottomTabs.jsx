import React from "react";
import { Tabs } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/**
 * Renders bottom navigation tabs using Expo Router with visibility control.
 * 
 * tabs: array - list of tab config objects with name, title, icon, and visibility status.
 */
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