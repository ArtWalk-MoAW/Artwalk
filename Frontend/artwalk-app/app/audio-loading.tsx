import { ActivityIndicator, View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAudioGuide } from "../hooks/useAudioGuide";

export default function AudioLoadingScreen() {
  const router = useRouter();
  const { title, imageUri, artistName } = useLocalSearchParams();
  const { generateAudio } = useAudioGuide();

  useEffect(() => {
    const fetchAudio = async () => {
      const url = await generateAudio();
      if (!url) return;

      router.replace({
        pathname: "/audio-player",
        params: {
          title,
          imageUri,
          audioUri: url,
          artistName,
        },
      });
    };

    fetchAudio();
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#DB4F00" />
      <Text style={styles.text}>
        ArtWalk is creating your audio guide ...
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFEFC",
  },
  text: {
    marginTop: 20,
    fontSize: 18,
    fontFamily: "InstrumentSans-Regular",
    color: "#1D0C02",
    textAlign: "center",
    paddingHorizontal: 24,
  },
});
