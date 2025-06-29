import React from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSavedArtwork } from '../hooks/useSavedArtwork';

type SaveArtworkProps = {
  title: string;
  location: string;
  description: string;
  img: string;
  type: 'map' | 'scanned' | 'route'; 
};

export default function SaveArtwork({ title, location, description, img, type }: SaveArtworkProps) {
  const {
    isSaved,
    handleSave,
    handleDelete,
  } = useSavedArtwork(title, location, description, img, type); // ⬅️ type weitergeben


  const handlePress = async () => {
    try {
      if (isSaved) {
        await handleDelete();
        Alert.alert('Gelöscht!', 'Das Kunstwerk wurde entfernt.');
      } else {
        const result = await handleSave();
        Alert.alert('Gespeichert!', `ID: ${result.id}`);
      }
    } catch (error: any) {
      Alert.alert('Fehler', error.message || 'Unbekannter Fehler');
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.saveButton} onPress={handlePress}>
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={36}
          color="#000"
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonWrapper: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 50,
    padding: 8,
    elevation: 3,
  },
});
