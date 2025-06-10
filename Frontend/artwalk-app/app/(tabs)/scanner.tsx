import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { useRef,useState } from 'react';
import React from "react";
import { Button, StyleSheet, Text, TouchableOpacity, View ,Image} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';




export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const cameraRef = useRef<any>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current){
      const photo = await cameraRef.current.takePictureAsync();
      setCapturedImage(photo.uri);
      console.log(photo.uri)
    }

  }

  const  discardImage = () => setCapturedImage(null);
  const keepImage = async () => {
    if (!capturedImage) return;

    try {
      // Prüfe, ob die Datei existiert
      const fileInfo = await FileSystem.getInfoAsync(capturedImage);
      if (!fileInfo.exists) {
        console.error("📛 Bild existiert nicht:", capturedImage);
        return;
      }

      const formData = new FormData();
      formData.append('image', {
        uri: capturedImage,
        name: 'photo.jpg',
        type: 'image/jpeg',
      } as any);

      const response = await fetch('http://192.168.178.145:8080/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.ok) {
        console.log("✅ Bild erfolgreich hochgeladen");
      } else {
        console.error("1. Fehler beim Hochladen des Bildes:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("2. Fehler beim Hochladen des Bildes:", error);
    } finally {
      setCapturedImage(null);
    }
  };

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={discardImage} style={styles.button}>
                <Text style={styles.actionButtonText}>Take again</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={keepImage} style={styles.button}>
                <Text style={styles.actionButtonText} >Start analyzing</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <CameraView style={styles.camera} facing={facing} ref={cameraRef} />
          <View style={styles.buttonContainer}>
            <View style={styles.buttonRow}>
              <View style={{ width: 60 }} />
              <TouchableOpacity onPress={takePicture} style={styles.shutterButton}>
                <View style={styles.shutterOuter}>
                  <View style={styles.shutterInner} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={toggleCameraFacing} style={styles.flipButton}>
                <MaterialIcons name="flip-camera-android" size={32} color="white" />
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
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },

  button: {
    backgroundColor: '#DB4F00',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
  margin: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: '22%', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center', 
    alignItems: 'center',     
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40, 
  },
  flipButton: {
    
    borderRadius: 20,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterOuter: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  preview: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

