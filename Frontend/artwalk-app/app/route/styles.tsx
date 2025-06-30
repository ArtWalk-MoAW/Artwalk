import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  View,
} from "react-native";
import { useRouteForm } from "../../hooks/useRouteForm";
import { useRouter } from "expo-router";

const CATEGORIES = [
  "Mural",
  "Graffiti",
  "Photorealistic",
  "Urban Intervention",
  "Festival Art",
];

const imageMap: Record<string, any> = {
  "Mural": require("../../assets/styles/Mural.jpg"),
  "Graffiti": require("../../assets/styles/Graffiti.jpg"),
  "Photorealistic": require("../../assets/styles/Photorealistic.jpg"),
  "Urban Intervention": require("../../assets/styles/UrbanIntervention.jpg"),
  "Festival Art": require("../../assets/styles/FestivalArt.jpg"),
};

export default function StyleSelection() {
  const [selected, setSelected] = useState<string[]>([]);
  const { setFormData, formData, setRoute } = useRouteForm();
  const router = useRouter();

  const toggleStyle = (style: string) => {
    setSelected((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleStart = async () => {
    setFormData({ styles: selected });

    try {
      const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          district: formData.district,
          max_minutes: parseInt(formData.max_minutes),
          num_stops: parseInt(formData.num_stops),
          styles: selected,
        }),
      });

      const data = await res.json();

      setRoute(data.stops); 
      router.push("/route/results");
    } catch (err) {
      console.error("❌ Fehler beim Abrufen der Route:", err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Do you have favorite <Text style={{ fontStyle: "italic" }}>art styles</Text> or movements?
      </Text>

      <View style={styles.grid}>
        {CATEGORIES.map((style) => (
          <TouchableOpacity
            key={style}
            style={styles.item}
            onPress={() => toggleStyle(style)}
          >
            {imageMap[style] && (
              <Image source={imageMap[style]} style={styles.image} />
            )}
            <View style={styles.overlay}>
              <Text style={styles.label}>{style}</Text>
              <Text style={styles.plus}>{selected.includes(style) ? "✓" : "+"}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleStart}>
        <Text style={styles.buttonText}>Start to Explore</Text>
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
    marginBottom: 16,
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
  label: {
    color: "#fff",
    fontFamily: "InstrumentSerif-Regular",
    fontSize: 14,
  },
  plus: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
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
});