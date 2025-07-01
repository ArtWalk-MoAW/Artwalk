import React from "react";
import { ScrollView, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import MapView from "react-native-maps";

export default function RouteResult({
  route,
  onReset,
}: {
  route: any[];
  onReset: () => void;
}) {
  const hasStops = route && route.length > 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Deine Route</Text>

      {hasStops ? (
        route.map((stop, i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Text>📍 {stop.address}</Text>
            <Text>Künstler: {stop.artist || "Unbekannt"}</Text>
          </View>
        ))
      ) : (
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Leider konnte mit den gewählten Angaben keine passende Route berechnet werden.
          </Text>
          <Text style={styles.messageSub}>
            Bitte versuche es mit einer anderen Kombination aus Bezirk, Stil oder Dauer.
          </Text>
        </View>
      )}

      <TouchableOpacity onPress={onReset} style={styles.button}>
        <Text style={styles.buttonText}>Neue Route planen</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#FFFEFC",
    flexGrow: 1,
  },
  heading: {
    fontSize: 24,
    fontFamily: "InstrumentSerif-Regular",
    color: "#1D0C02",
    marginBottom: 20,
  },
  italic: {
    fontStyle: "italic",
  },
  label: {
    fontFamily: "InstrumentSerif-Regular",
    fontSize: 16,
    marginBottom: 6,
    color: "#1D0C02",
  },
    messageBox: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "#f9e6e6",
    borderRadius: 8,
    borderColor: "#ffb3b3",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
    color: "#990000",
    marginBottom: 8,
  },
  messageSub: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
    color: "#990000",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    color: "#1D0C02",
    backgroundColor: "#fff",
    fontFamily: "InstrumentSans-Regular",
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontFamily: "InstrumentSans-Regular",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    aspectRatio: 1,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    width: "100%",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  plus: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});