import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import SavedArtworkTabs from "@/components/savedArtworkTabs";

type Artwork = {
  id: string;
  title: string;
  location: string;
  description: string;
  img: string;
  type: 'map' | 'scanned' | 'route';
};

export default function SavedArtworksScreen() {
  const [mapArtworks, setMapArtworks] = useState<Artwork[]>([]);
  const [scannedArtworks, setScannedArtworks] = useState<Artwork[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchArtworks = async () => {
    setIsLoading(true);
    try {
      const [mapResponse, scannedResponse] = await Promise.all([
        fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/myartworks`),
        fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/myartworksanalyse`)
      ]);

      if (mapResponse.ok && scannedResponse.ok) {
        const mapData = await mapResponse.json();
        const scannedData = await scannedResponse.json();

        setMapArtworks(mapData);
        setScannedArtworks(scannedData);
      } else {
        console.error("Fehler beim Abrufen der gespeicherten Werke");
      }
    } catch (error) {
      console.error("Server nicht erreichbar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Lädt neu bei jedem Tab-Fokus
  useFocusEffect(
    useCallback(() => {
      fetchArtworks();
    }, [])
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Lade gespeicherte Werke...</Text>
        <ActivityIndicator size="large" color="#DB4F00" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <SavedArtworkTabs
        mapArtworks={mapArtworks}
        scannedArtworks={scannedArtworks}
        onRefresh={fetchArtworks}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
  },
});
