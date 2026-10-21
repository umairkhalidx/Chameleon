import React from "react";
import { Tabs } from "expo-router";
import { FloatingTabBar } from "../../components/FloatingTabBar";

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <FloatingTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Chats",
          tabBarAccessibilityLabel: "Chats tab",
        }}
      />
      <Tabs.Screen
        name="communities"
        options={{
          title: "Communities",
          tabBarAccessibilityLabel: "Communities tab",
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          title: "Configuration",
          tabBarAccessibilityLabel: "Configuration tab",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarAccessibilityLabel: "Profile tab",
        }}
      />
    </Tabs>
  );
}
