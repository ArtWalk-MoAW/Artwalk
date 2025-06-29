import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import DeleteArtworkButton from "./DeleteArtwork";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // Icon-Paket importieren

type Props = {
  id: string;
  title: string;
  location: string;
  description: string;
  img: string;
  onDeleted: () => void;
  latitude: number;
  longitude: number;
};

export default function SavedArtworkItem({
  id,
  title,
  location,
  description,
  img,
  onDeleted,
  latitude,
  longitude,
}: Props) {
  const router = useRouter();

  const handleOpenInMap = () => {
    router.push({
      pathname: "/", // oder dein tatsächlicher Map-Tab-Pfad
      params: {
        artwork: JSON.stringify({
          title,
          address: location,
          description,
          image: img,
          latitude,
          longitude,
        }),
      },
    });
  };

  return (
    <TouchableOpacity onPress={handleOpenInMap}>
      <View style={styles.itemContainer}>
        <DeleteArtworkButton id={id} onDeleted={onDeleted} />
        <Image source={{ uri: img }} style={styles.image} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={16} color="#555" style={{marginRight:5}} />
            <Text style={styles.text}>{location}</Text>
          </View>
          <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">
            {description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: "row",
    paddingVertical: 20,
    paddingHorizontal: 20,
    gap: 12,
    position: "relative",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    backgroundColor: "#ccc",
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "InstrumentSerif-Regular",
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: "#555",
    fontFamily: "InstrumentSans",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5 // oder `marginRight` im Icon verwenden, wenn `gap` nicht funktioniert
},

});
