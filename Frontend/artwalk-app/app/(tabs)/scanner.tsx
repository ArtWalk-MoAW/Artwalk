import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { useRef, useState, useEffect } from "react";
import React from "react";
import {
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import DetailAnaysisView from "@/components/DetailAnaysisView";
import * as FileSystem from "expo-file-system";

export default function App() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [hasError, setHasError] = useState(false);

  const fetchFallback = async () => {
    try {
      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/get-Artreport`
      );
      if (response.ok) {
        const json = await response.json();
        console.log("Fallback GET-Daten:", json);

        if (!json || typeof json !== "object") {
          throw new Error("Fallback JSON response is empty or malformed");
        }

        setAnalysisResult(json);
        setIsAnalyzing(false);
      } else {
        console.error("Fallback GET fehlgeschlagen:", response.status);
        setHasError(true);
        setIsAnalyzing(false);
      }
    } catch (fallbackError) {
      console.error("Fehler beim Fallback-GET:", fallbackError);
      setHasError(true);
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (analysisResult) {
      console.log("Neuer analysisResult-Wert:", analysisResult);
    }
  }, [analysisResult]);

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      console.log(photo.uri);
    }
  };

  const discardImage = () => setCapturedImage(null);

  const keepImage = async () => {
    if (!capturedImage) return;

    try {
      setIsAnalyzing(true);
      setHasError(false);

      const fileInfo = await FileSystem.getInfoAsync(capturedImage);
      if (!fileInfo.exists) {
        console.error("Bild existiert nicht:", capturedImage);
        setHasError(true);
        setIsAnalyzing(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", {
        uri: capturedImage,
        name: "photo.jpg",
        type: "image/jpeg",
      } as any);

      const response = await fetch(
        `http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("POST fehlgeschlagen:", response.status, errorText);
        await fetchFallback();
        return;
      }

      let json: any;
      try {
        json = await response.json();
        console.log("Upload-Response:", json);
      } catch (e) {
        console.error("❌ Fehler beim Parsen der JSON-Antwort:", e);
        await fetchFallback();
        return;
      }

      if (json?.analysis?.raw) {
        try {
          const parsed = JSON.parse(json.analysis.raw);
          parsed.artworkId = json.artworkId;
          setAnalysisResult(parsed);
        } catch (parseError) {
          console.error("❌ Fehler beim Parsen von analysis.raw:", parseError);
          await fetchFallback();
        }
      } else {
        console.warn("❌ JSON hat kein analysis.raw:", json);
        await fetchFallback();
      }

      setIsAnalyzing(false);
    } catch (error) {
      console.error("Fehler beim POST-Upload:", error);
      await fetchFallback();
    }
  };

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <View style={styles.container}>
      {hasError ? (
        <View>
          <Text>Scan failed</Text>
          <Text>The image could not be analyzed. Please try again.</Text>
          <TouchableOpacity
            onPress={() => {
              setHasError(false);
              setCapturedImage(null);
            }}
            style={styles.button}
          >
            <Text style={styles.actionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      ) : analysisResult ? (
        <ScrollView>
          <DetailAnaysisView
            analysisResult={analysisResult}
            capturedImage={capturedImage}
            onBack={() => {
              setAnalysisResult(null);
              setCapturedImage(null);
            }}
          />
        </ScrollView>
      ) : isAnalyzing ? (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <ActivityIndicator size="large" color="#DB4F00" />
          <Text style={{margin: 20, fontSize: 18 }}>
            ArtWalk is analyzing your discovery…
          </Text>
        </View>
      ) : capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={discardImage} style={styles.button}>
              <Text style={styles.actionButtonText}>Take again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={keepImage} style={styles.button}>
              <Text style={styles.actionButtonText}>Start analyzing</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <View style={{ width: 60 }} />
              <TouchableOpacity
                onPress={takePicture}
                style={styles.shutterButton}
              >
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={toggleCameraFacing}
                style={styles.flipButton}
              >
                <MaterialIcons
                  name="flip-camera-android"
                  size={32}
                  color="white"
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  button: {
    backgroundColor: "#DB4F00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "22%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 40,
  },
  flipButton: {
    borderRadius: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  shutterButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  shutterOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  previewContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "black",
  },
  preview: {
    width: "100%",
    height: "80%",
    resizeMode: "contain",
  },
  actionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});
