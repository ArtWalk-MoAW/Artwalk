import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import DeleteArtworkButton from "./DeleteArtwork";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { deleteArtwork, deleteScannedArtwork } from "@/services/artworkService";

type Props = {
  id: string;
  title: string;
  location: string;
  description: string;
  img: string;
  onDeleted: () => void;
  latitude: number;
  longitude: number;
  type?: "map" | "scanned";
  originalJson?: any;
  onOpenAnalysis?: () => void;
};


const stripHtmlTags = (text: string) => {
  return text.replace(/<[^>]*>/g, "").trim();
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
  type,
  originalJson,
  onOpenAnalysis,
}: Props) {
  const router = useRouter();

  const handleOpen = () => {
    if (type === "scanned" && onOpenAnalysis) {
      onOpenAnalysis();
    } else {
      router.push({
        pathname: "/",
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
    }
  };

  const handleDelete = async () => {
    try {
      if (type === "scanned") {
        await deleteScannedArtwork(id);
      } else {
        await deleteArtwork(id);
      }
      onDeleted();
    } catch (err) {
      console.error("Fehler beim Löschen:", err);
      Alert.alert("Fehler", "Das Werk konnte nicht gelöscht werden.");
    }
  };

  return (
    <TouchableOpacity onPress={handleOpen}>
      <View style={styles.itemContainer}>
        <DeleteArtworkButton id={id} onDeleted={handleDelete} />
        <Image
          source={{ uri: img || "https://via.placeholder.com/80" }}
          style={styles.image}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.locationRow}>
            <Ionicons
              name={type === "scanned" ? "brush-outline" : "location-outline"}
              size={16}
              color="#555"
              style={{ marginRight: 5 }}
            />
            <Text style={styles.text}>{location}</Text>
          </View>
          <Text style={styles.text} numberOfLines={3} ellipsizeMode="tail">
            {stripHtmlTags(description)}
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
    marginBottom: 5,
  },
});
