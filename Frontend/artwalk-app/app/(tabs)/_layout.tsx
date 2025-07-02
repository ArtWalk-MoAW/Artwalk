import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from 'react-native';
import { RouteFormProvider } from "../../hooks/useRouteForm";

export default function TabsLayout() {
  return (
    <RouteFormProvider>
      <Tabs
        screenOptions={{
          tabBarStyle: style.tabBarStyle,
          tabBarActiveTintColor: style.tabBarActiveTintColor.color,
          tabBarInactiveTintColor: style.tabBarInactiveTintColor.color,
          headerStyle: style.headerStyle,
          headerTitleStyle: style.headerTitleStyle,
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
          name="scanner"
          options={{
            title: "Art Scanner",
            tabBarIcon: ({ color }) => (
              <Ionicons name="camera" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="saved"
          options={{
            title: "My Saves",
            tabBarIcon: ({ color }) => (
              <Ionicons name="bookmark" color={color} size={24} />
            ),
          }}
        />
        <Tabs.Screen
          name="route"
          options={{
            title: "Route",
            tabBarIcon: ({ color }) => (
              <Ionicons name="map-outline" color={color} size={24} />
            ),
          }}
        />
      </Tabs>
    </RouteFormProvider>
  );
}

export const style = StyleSheet.create({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#FFFEFC',
    borderBottomWidth: 1,
    borderBottomColor: '#1D0C02',
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D0C02',
  },
  tabBarStyle: {
    backgroundColor: '#FFFEFC',
    borderTopWidth: 1,
    borderTopColor: '#1D0C02',
  },
  tabBarActiveTintColor: { color: '#F95636' },
  tabBarInactiveTintColor: { color: '#1D0C02' },
});
