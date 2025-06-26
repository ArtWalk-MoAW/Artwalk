import React, { useState,useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LOCAL_BASE_IP } from '@env';


type SaveArtworkProps = {
  title: string;
  location: string;
  description: string;
  img: string;
};

export default function SaveArtwork({ title, location, description, img }: SaveArtworkProps) {
  const [isSaved, setIsSaved] = useState(false);

  const checkIfSaved = async () => {
    try {
      const res = await fetch(`http://${LOCAL_BASE_IP}:8000/myartworks`);
      const data = await res.json();

      const match = data.find((item: any) =>
        item.title === title &&
        item.location === location &&
        item.description === description
      );

      setIsSaved(!!match);
    } catch (err) {
      console.error("Fehler beim Abrufen gespeicherter Werke:", err);
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [title, location, description]);

  const handleSubmit = async () => {
    const artwork = { title, location, description };
    try {
      const response = await fetch(`http://${LOCAL_BASE_IP}:8000/save-artwork`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(artwork)
      });

      if (response.ok) {
        const result = await response.json();
        setIsSaved(true);
        Alert.alert('Gespeichert!', `ID: ${result.id}`);
      } else {
        Alert.alert('Fehler', 'Konnte nicht speichern');
      }
    } catch (error) {
      console.error('Speichern fehlgeschlagen:', error);
      Alert.alert('Netzwerkfehler', 'Server nicht erreichbar');
    }
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity style={styles.saveButton} onPress={handleSubmit}>
        <Ionicons
          name={isSaved ? 'bookmark' : 'bookmark-outline'}
          size={36}
          color={isSaved ? '#E67E22' : '#1D0C02'}
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
    borderRadius: 20,
    padding: 8,
    elevation: 3,
  },
});
