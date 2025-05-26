import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#F6F69C",
        tabBarInactiveTintColor: "#3A522D",
        tabBarStyle: {
          backgroundColor: "#9FB490",
          borderTopWidth: 1,
          borderTopColor: "#3A522D",
        },
        headerStyle: {
          backgroundColor: "#9FB490",
          borderBottomWidth: 1,
          borderBottomColor: "#3A522D",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color }) => (
            <Ionicons name="camera" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="saved"
        options={{
          title: "Saves",
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark" color={color} size={24} />
          ),
        }}
      />
    </Tabs>
  );
}
