import React, { useState } from "react";
import { View, ActivityIndicator, Text,StyleSheet } from "react-native";
import RouteForm from "@/components/routeform";
import RouteResult from "@/components/routeresult";


export default function RouteScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [route, setRoute] = useState<any[] | null>(null);

  const handleSubmit = async (payload: any) => {
    setIsLoading(true);
    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setRoute(data.route);
      console.log(route)
    } catch (err) {
      alert("Fehler beim Abrufen der Route.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <Text style={styles.heading}>Route wird berechnet...</Text>
        <ActivityIndicator size="large" color="#DB4F00" />
      </View>
    );
  }

  if (route) {
    return <RouteResult route={route} onReset={() => setRoute(null)} />;
  }

  return <RouteForm onSubmit={handleSubmit} />;
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