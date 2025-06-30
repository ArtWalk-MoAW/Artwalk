import React from "react";
import {
  ScrollView,
  Text,
  StyleSheet,
  View,
} from "react-native";
import { useRouteForm } from "../../hooks/useRouteForm";

export default function ResultsScreen() {
  const { route } = useRouteForm();
  const safeRoute = route ?? []; // Fallback auf [] falls undefined

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>🎯 Your personalized art route</Text>
      {safeRoute.length === 0 ? (
        <Text style={styles.info}>No route calculated yet.</Text>
      ) : (
        safeRoute.map((stop, index) => (
          <View key={index} style={styles.stopContainer}>
            <Text style={styles.title}>{stop.title}</Text>
            <Text style={styles.artist}>by {stop.artist}</Text>
            <Text style={styles.address}>{stop.address}</Text>
            {stop.description && <Text style={styles.description}>{stop.description}</Text>}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFEFC",
  },
  heading: {
    fontSize: 24,
    fontFamily: "InstrumentSerif-Regular",
    color: "#1D0C02",
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    fontStyle: "italic",
    color: "#999",
    fontFamily: "InstrumentSans-Regular",
  },
  stopContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontFamily: "InstrumentSerif-Regular",
    color: "#000",
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: "#444",
    fontFamily: "InstrumentSans-Regular",
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
    fontFamily: "InstrumentSans-Regular",
  },
  description: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
    color: "#333",
  },
});