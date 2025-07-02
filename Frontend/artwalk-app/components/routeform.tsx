import React, { useState } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet
} from "react-native";
import { useRouteForm } from "../hooks/useRouteForm";


const CATEGORIES = [
  "Mural",
  "Graffiti",
  "Photorealistic",
  "Urban Intervention",
  "Festival Art",
  "Animal Motif",
  "Portrait",
  "Calligraffiti",
  "Installation",
  "Stencil",
  "Political",
  "Abstract",
  "Figurative",
  "Cartoon Style",
  "Paste-up",
];

const imageMap: Record<string, any> = {
  "Mural": require("../assets/styles/Mural.jpg"),
  "Graffiti": require("../assets/styles/Graffiti.jpg"),
  "Photorealistic": require("../assets/styles/Photorealistic.jpg"),
  "Urban Intervention": require("../assets/styles/UrbanIntervention.jpg"),
  "Festival Art": require("../assets/styles/FestivalArt.jpg"),
  "Animal Motif": require("../assets/styles/AnimalMotif.jpg"),
  "Portrait": require("../assets/styles/Portrait.jpg"),
  "Calligraffiti": require("../assets/styles/Calligraffiti.jpg"),
  "Installation": require("../assets/styles/Installation.jpg"),
  "Stencil": require("../assets/styles/Stencil.jpg"),
  "Political": require("../assets/styles/Political.jpeg"),
  "Abstract": require("../assets/styles/Abstract.jpg"),
  "Figurative": require("../assets/styles/Figurative.jpg"),
  "Cartoon Style": require("../assets/styles/CartoonStyle.jpeg"),
  "Paste-up": require("../assets/styles/Paste-up.jpg"),
};

export default function RouteForm({ onSubmit }: { onSubmit: (payload: any) => void }) {
  const [name, setName] = useState("");
  const [district, setDistrict] = useState("");
  const [minutes, setMinutes] = useState("");
  const [numStops, setNumStops] = useState("");
  const { formData, setFormData } = useRouteForm();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleStyle = (style: string) => {
    setSelected((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const handleStart = () => {
    if (!district || !minutes || !numStops || selected.length === 0) {
      alert("Bitte fülle alle Felder aus und wähle mindestens einen Stil.");
      return;
    }

    setFormData({
      name,
      district,
      max_minutes: minutes,
      num_stops: numStops,
      styles: selected,
    });


    onSubmit({
      name,
      district,
      max_minutes: parseInt(minutes),
      num_stops: parseInt(numStops),
      styles: selected,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        What does your <Text style={styles.italic}>art</Text> journey look like?
      </Text>

      <Text style={styles.label}>Route Name</Text>
      <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Graffiti Munich" placeholderTextColor="#999"/>

      <Text style={styles.label}>Where are you starting from?</Text>
      <TextInput style={styles.input} value={district} onChangeText={setDistrict} placeholder="e.g. Haidhausen" placeholderTextColor="#999" />

      <Text style={styles.label}>How long should the trip last?</Text>
      <TextInput style={styles.input} value={minutes} onChangeText={setMinutes} keyboardType="numeric" placeholder="e.g. 120" placeholderTextColor="#999" />

      <Text style={styles.label}>How many stops?</Text>
      <TextInput style={styles.input} value={numStops} onChangeText={setNumStops} keyboardType="numeric" placeholder="e.g. 3" placeholderTextColor="#999" />

      <Text style={[styles.label, { marginTop: 20 }]}>Pick your art styles:</Text>

      <View style={styles.grid}>
        {CATEGORIES.map((style) => (
          <TouchableOpacity key={style} style={styles.item} onPress={() => toggleStyle(style)}>
            <Image source={imageMap[style]} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={[styles.label, { color: "#fff" }]}>{style}</Text>
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
    color: "black",
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