import React, { useState } from "react";
import { Alert, StyleSheet, TouchableOpacity, ActivityIndicator, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { deleteArtwork } from "@/services/artworkService";

type Props = {
  id: string;
  onDeleted: () => void;
};

export default function DeleteArtworkButton({ id, onDeleted }: Props) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    Alert.alert(
      "Eintrag löschen?",
      "Möchtest du dieses Kunstwerk wirklich entfernen?",
      [
        { text: "Abbrechen", style: "cancel" },
        {
          text: "Löschen",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteArtwork(id);
              setIsDeleting(false);
              onDeleted(); // ⬅️ Liste reloaden
            } catch (err) {
              setIsDeleting(false);
              const error = err as Error;
              Alert.alert(
                "Fehler beim Löschen",
                error.message || "Unbekannter Fehler"
              );
            }
          },
        },
      ]
    );
  };

  return (
    <TouchableOpacity onPress={handleDelete} style={styles.button} disabled={isDeleting}>
      {isDeleting ? (
        <ActivityIndicator size="small" color="#F95636" />
      ) : (
        <Ionicons name="trash-outline" size={24} color="#F95636" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 8,
    zIndex: 10,
  },
});
