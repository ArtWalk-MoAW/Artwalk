import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import { useRouteForm } from "../../hooks/useRouteForm";
import { useRouter } from "expo-router";

export default function RouteScreen() {
  const { formData, setFormData } = useRouteForm();
  const router = useRouter();

  const handleChange = (field: string, value: string) => {
    setFormData({ [field]: value });
  };

  const handleNext = () => {
    console.log("✅ Daten für Backend:", formData);
    router.push("/route/styles");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>
        Where does your <Text style={styles.italic}>art</Text> journey begin?
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder="Your Name"
        placeholderTextColor="#999"
        style={styles.input}
        value={formData.name}
        onChangeText={(text) => handleChange("name", text)}
      />

      <Text style={styles.label}>Where are you starting from?</Text>
      <TextInput
        placeholder="e.g. Haidhausen"
        placeholderTextColor="#999"
        style={styles.input}
        value={formData.district}
        onChangeText={(text) => handleChange("district", text)}
      />

      <Text style={styles.label}>How far are you willing to go? (in min)</Text>
      <TextInput
        placeholder="e.g. 120"
        placeholderTextColor="#999"
        keyboardType="numeric"
        style={styles.input}
        value={formData.max_minutes}
        onChangeText={(text) => handleChange("max_minutes", text)}
      />

      <Text style={styles.label}>How many stops?</Text>
      <TextInput
        placeholder="e.g. 3"
        placeholderTextColor="#999"
        keyboardType="numeric"
        style={styles.input}
        value={formData.num_stops}
        onChangeText={(text) => handleChange("num_stops", text)}
      />

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Next</Text>
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
});