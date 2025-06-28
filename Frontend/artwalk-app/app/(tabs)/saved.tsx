import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import saveArtwork from "@/components/saveArtwork";
import { useEffect, useState } from 'react';


export default function App() {
  const [SavedArtworks, setSavedArtworks] = useState([]);

  const fetchArtworks = async () => {
    try {
      const response = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/myartworks`);
      if (response.ok) {
        const data = await response.json();
        setSavedArtworks(data)
      } else {
        console.error("Fehler beim Abrufen");
      }
    } catch (error){
      console.error("Server nicht erreichbar:", error);

    }
  }

  useEffect(() => {
    fetchArtworks();
  }, []);


  

  if (SavedArtworks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Keine gespeicherten Orte.</Text>
      </View>
    );
  }

  return (
    <View style={styles.cont}> 
    <FlatList
      data={SavedArtworks}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.container}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.text}>{item.location}</Text>
          <Text style={styles.text}>{item.description}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
    </View>
  );
}


const styles = StyleSheet.create({
  cont: {
    backgroundColor: '#FFFEFC',

  },
  container: {
    paddingVertical: 5,
    backgroundColor: '#FFFEFC',
  },
  itemContainer: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    fontFamily: 'InstrumentSerif-Regular',
    marginBottom:8.
  },
  text: {
    fontSize: 14,
    color: '#555',
    fontFamily: 'InstrumentSans',
  },
  separator: {
    height: 2,
    backgroundColor: '#1D0C02',
    width: '100%', 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});