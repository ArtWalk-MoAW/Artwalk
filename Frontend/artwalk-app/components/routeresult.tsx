import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { useRouteForm } from "../hooks/useRouteForm";

export default function RouteResult({
  route,
  onReset,
}: {
  route: any[];
  onReset: () => void;
}) {
  const [backPressed, setBackPressed] = useState(false);
  const { formData } = useRouteForm();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.warn("⚠️ Location permission not granted");
      }
    })();
  }, []);

  const initialRegion = {
    latitude: route[0]?.latitude || 48.137,
    longitude: route[0]?.longitude || 11.575,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#FFFEFC" }}>
      {/* 🔙 Zurück-Button */}
      <TouchableOpacity
        onPress={onReset}
        onPressIn={() => setBackPressed(true)}
        onPressOut={() => setBackPressed(false)}
        style={[
          styles.iconButton,
          {
            left: 10,
            backgroundColor: backPressed ? "#F95636" : "#fff",
          },
        ]}
        activeOpacity={1}
      >
        <Text
          style={[
            styles.iconText,
            { color: backPressed ? "#fff" : "#1D0C02" },
          ]}
        >
          ←
        </Text>
      </TouchableOpacity>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        showsCompass={false}
      >
        {route.map((stop, i) => (
          <Marker
            key={i}
            coordinate={{
              latitude: stop.latitude,
              longitude: stop.longitude,
            }}
            title={stop.title}
            description={stop.address}
          />
        ))}
      </MapView>

      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>{formData.name || "Name of Route"}</Text>

        <View style={styles.metaContainer}>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Duration</Text>
            <Text style={styles.metaValue}>{formData.max_minutes} min</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Location</Text>
            <Text style={styles.metaValue}>{formData.district}</Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Genre</Text>
            <Text
              style={styles.metaValue}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formData.styles?.join(", ") || "-"}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Text style={styles.metaLabel}>Stops</Text>
            <Text style={styles.metaValue}>{route.length}</Text>
          </View>
        </View>

        {route.map((stop, i) => (
          <View key={i} style={styles.stopItem}>
            <View style={styles.lineIndicator}>
              <View className="dot" style={styles.dot} />
              {i < route.length - 1 && <View style={styles.verticalLine} />}
            </View>
            <View style={styles.stopCard}>
              <View style={{ flex: 1 }}>
                <Text style={styles.stopArtist}>{stop.title}</Text>
                <Text style={styles.stopName}>{stop.address}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: 250,
  },
  container: {
    padding: 20,
    backgroundColor: "#FFFEFC",
    paddingBottom: 80,
  },
  heading: {
    fontSize: 28,
    fontFamily: "InstrumentSerif-Regular",
    color: "#1D0C02",
    marginBottom: 20,
  },
  metaContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  metaItem: {
    flex: 1,
    alignItems: "center",
  },
  metaLabel: {
    fontFamily: "InstrumentSans-Regular",
    color: "#999",
    fontSize: 14,
  },
  metaValue: {
    fontFamily: "InstrumentSans-Regular",
    color: "#1D0C02",
    fontSize: 16,
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 30,
  },
  lineIndicator: {
    width: 20,
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#F95636",
    marginTop: 5,
    zIndex: 1,
  },
  verticalLine: {
    position: "absolute",
    top: 10,
    width: 2,
    height: "100%",
    backgroundColor: "#ccc",
  },
  stopCard: {
    flex: 1,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#1D0C02",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  stopArtist: {
    fontFamily: "InstrumentSerif-Regular",
    color: "#1D0C02",
    fontSize: 16,
    marginBottom: 6,
  },
  stopName: {
    fontFamily: "InstrumentSans-Regular",
    color: "#1D0C02",
    fontSize: 14,
  },
  iconButton: {
    position: "absolute",
    top: 10,
    zIndex: 10,
    width: 50,
    height: 50,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  iconText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1D0C02",
  },
});