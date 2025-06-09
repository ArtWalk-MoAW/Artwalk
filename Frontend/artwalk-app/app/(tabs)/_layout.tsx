import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet } from 'react-native';
import Toast from 'react-native-toast-message';


export default function TabsLayout() {
  return (
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
          title: "Image Classefier",
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
    </Tabs>
  );
}

export const style = StyleSheet.create({
  headerStyle: {
    elevation: 0,
    shadowOpacity: 0,
    backgroundColor: '#FFFEFC',
    borderBottomWidth: 1,
    borderBottomColor: '#1D0C02',
    fontFamily: 'InstrumentSans',
  },
  headerTitleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1D0C02',
    fontFamily: 'InstrumentSans',
  },
  tabBarStyle: {
    backgroundColor: '#FFFEFC',
    borderTopWidth: 1,
    borderTopColor: '#1D0C02',
    fontFamily: 'InstrumentSans',
  },
  tabBarActiveTintColor: {color: '#F95636'},
  tabBarInactiveTintColor: {color: '#1D0C02',},
});

