import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRef,useState } from 'react';
import React from "react";

export default function DetailScreen() {
  const { parsed } = useLocalSearchParams();
  const report = parsed ? JSON.parse(parsed as string) : null;

  

  if (!parsed) {
    return <Text>Kein Report verfügbar</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Title */}
      <Text style={styles.title}>{report?.artwork_analysis?.title ?? "Untitled"}</Text>
  
      {/* Artist Info Section */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>Artist</Text>
        <Text style={styles.artistName}>{report?.artist_info?.name ?? "Unknown Artist"}</Text>
        <Text style={styles.sub}>{report?.artist_info?.artistic_style ?? "Unknown Style"}</Text>
        <Text style={styles.infotext}>{report?.artist_info?.biography ?? "No biography available."}</Text>
      </View>
  
      {/* Artwork Description */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>Artwork Description</Text>
        <Text style={styles.infotext}>{report?.artwork_analysis?.visual_description ?? "No description."}</Text>
      </View>
  
      {/* Interpretation */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>Interpretation</Text>
        <Text style={styles.infotext}>{report?.artwork_analysis?.interpretation ?? "No interpretation."}</Text>
      </View>
  
      {/* Historical Context */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>Historical Context</Text>
        <Text style={styles.infotext}>{report?.historical_context?.art_movement ?? "No movement."}</Text>
        {Array.isArray(report?.historical_context?.key_traits) &&
          report.historical_context.key_traits.map((trait: string, index: number) => (
            <Text key={index} style={styles.bullet}>• {trait}</Text>
          ))}
      </View>
  
      {/* Similar Artworks */}
      <View style={styles.sectionBox}>
        <Text style={styles.section}>Similar Artworks</Text>
        {Array.isArray(report?.similar_artworks) ? (
          report.similar_artworks.map((art: any, index: number) => (
            <View key={index} style={styles.similarBox}>
              <Text style={styles.bold}>{art.title ?? "Untitled"}</Text>
              <Text style={styles.artistName}>{art.artist ?? "Unknown Artist"}</Text>
              <Text>{art.year ?? "Unknown Year"}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.infotext}>No similar artworks found.</Text>
        )}
      </View>
    </ScrollView>
  );
  
    }
  
  const styles = StyleSheet.create({
    container: {
      padding: 20,
      paddingBottom: 100,
      backgroundColor: "#fff",
    },
    title: {
      fontSize: 36,
      fontFamily: 'InstrumentSerif-Regular',
      textAlign: 'center',
      marginBottom: 24,
    },
    section: {
      fontSize: 22,
      fontWeight: '600',
      fontFamily: 'InstrumentSans-Bold',
      marginBottom: 8,
    },
    artistName: {
      fontSize: 20,
      fontWeight: '500',
      fontFamily: 'InstrumentSerif-Regular',
    },
    sub: {
      fontStyle: 'italic',
      marginBottom: 8,
      marginTop: 8,
      fontFamily: 'InstrumentSerif-Regular',
      fontSize: 16,
    },
    infotext: {
      fontSize: 16,
      fontFamily: 'InstrumentSans-Regular',
      lineHeight: 22,
    },
    sectionBox: {
      marginBottom: 24,
      padding: 12,
      backgroundColor: "#f9f9f9",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
    },
    bullet: {
      fontSize: 16,
      fontFamily: 'InstrumentSans-Regular',
      marginLeft: 8,
    },
    symbolText: {
      fontSize: 16,
      fontFamily: 'InstrumentSans-Regular',
      marginLeft: 4,
      marginBottom: 4,
    },
    similarBox: {
      marginTop: 12,
      padding: 10,
      backgroundColor: '#e8e8e8',
      borderRadius: 8,
    },
    bold: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    centered: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 100,
    },
    error: {
      color: 'red',
      padding: 20,
      fontSize: 16,
      textAlign: 'center',
    },
    divider: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 16,
  },
  });
  