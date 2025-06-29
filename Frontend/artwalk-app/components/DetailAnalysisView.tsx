import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { saveArtworkAnalyse } from "../services/artworkService";

type Props = {
  analysisResult: any;
  onBack: () => void;
  capturedImage: string | null;
};

export default function DetailAnalysisView({
  analysisResult,
  capturedImage,
  onBack,
}: Props) {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = async () => {
    try {
      const payload = {
        ...analysisResult,
        captured_image: capturedImage, // ✅ Bild mit abspeichern
      };
      const result = await saveArtworkAnalyse(payload);
      setIsSaved(true);
      console.log("Gespeichert mit ID:", result.id);
      Alert.alert("Saved!", `ID: ${result.id}`);
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      Alert.alert("Error", "Failed to save the artwork. Please try again.");
      setIsSaved(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons
            name={isSaved ? "bookmark" : "bookmark-outline"}
            size={28}
            color="black"
          />
        </TouchableOpacity>
      </View>

      <ScrollView>
        {capturedImage && (
          <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
        )}
        <Text style={styles.title}>
          {analysisResult?.artwork_analysis?.title || "No Artwork information."}
        </Text>
        <View style={styles.divider} />
        {/* Werk */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}> Artwork Details</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.infotext}>
              {analysisResult?.artwork_analysis?.visual_description ||
                "No Description available."}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Interpretation</Text>
            <Text style={styles.infotext}>
              {analysisResult?.artwork_analysis?.interpretation ||
                "No Interpretation available."}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Künstler */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>
            About{" "}
            <Text style={styles.artistName}>
              {analysisResult?.artist_info?.name || "Unknown Artist"}
            </Text>
          </Text>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Style</Text>
            <Text style={styles.sub}>
              {analysisResult?.artist_info?.artistic_style ||
                "No style information."}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Biography</Text>
            <Text style={styles.infotext}>
              {analysisResult?.artist_info?.biography ||
                "No biography available."}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Historischer Kontext */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Historical Context</Text>
          <View style={styles.infoBlock}>
            <Text style={styles.label}>Art Movement</Text>
            <Text style={styles.sub}>
              {analysisResult?.historical_context?.art_movement ||
                "No Art Movement info."}
            </Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Key Traits</Text>
            <Text style={styles.infotext}>
              {analysisResult?.historical_context?.key_traits ||
                "No Key Traits info."}
            </Text>
          </View>
        </View>
        <View style={styles.divider} />

        {/* Ähnliche Werke */}
        <View style={[styles.sectionContainer, styles.sectionBox]}>
          <Text style={styles.sectionTitle}>Similar Artworks</Text>
          {Array.isArray(analysisResult?.similar_artworks) ? (
            analysisResult.similar_artworks.map((art: any, index: number) => (
              <View key={index} style={styles.similarBox}>
                <Text style={styles.bold}>{art.title ?? "Untitled"}</Text>
                <Text style={styles.artistName2}>
                  {art.artist ?? "Unknown Artist"}
                </Text>
                <Text>{art.year ?? "Unknown Year"}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.infotext}>No similar artworks found.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // Layout
  container: {
    flex: 1,
    backgroundColor: "#FFFEFC",
  },
  imagePreview: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 20,
  },
  scrollView: {
    paddingBottom: 24,
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 16,
  },
  iconButton: {
    borderRadius: 20,
    borderColor: "black",
    width: 40,
    height: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  // Text Styles
  title: {
    fontSize: 40,
    fontFamily: "InstrumentSerif-Regular",
    textAlign: "center",
    color: "#1D0C02",
  },

  sectionTitle: {
    fontSize: 25,
    fontFamily: "InstrumentSans-Bold",
    color: "#1D0C02",
    marginBottom: 8,
  },
  label: {
    fontSize: 20,
    fontFamily: "InstrumentSans-Bold",
    marginBottom: 6,
  },
  infotext: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
    lineHeight: 22,
  },
  artistName: {
    fontSize: 30,
    fontWeight: "500",
    fontFamily: "InstrumentSerif-Regular",
  },

  artistName2: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "InstrumentSerif-Regular",
  },
  sub: {
    fontStyle: "italic",
    fontFamily: "InstrumentSerif-Regular",
    fontSize: 20,
  },
  bold: {
    fontWeight: "bold",
    fontSize: 16,
  },

  // Section Layout
  sectionContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  infoBlock: {
    marginBottom: 16,
  },
  section: {
    fontSize: 22,
    fontWeight: "600",
    fontFamily: "InstrumentSans-Bold",
    marginBottom: 8,
  },
  sectionBox: {
    padding: 12,
    backgroundColor: "#FFFEFC",
  },
  similarBox: {
    marginTop: 12,
    padding: 10,
    backgroundColor: "#F95636",
    borderRadius: 8,
  },

  // Misc
  divider: {
    height: 1,
    backgroundColor: "#1D0C02",
    marginVertical: 16,
    borderRadius: 1,
  },

  //Button
  backButton: {
    zIndex: 1,
    borderRadius: 20,
    borderColor: "black",
    width: 40,
    height: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  saveButton: {
    zIndex: 1,
    borderRadius: 20,
    borderColor: "black",
    width: 40,
    height: 40,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});
