import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';


type Props = {
  analysisResult: any;
  onBack: () => void;
  capturedImage: string | null;
};

export default function DetailAnaysisView({ analysisResult,capturedImage, onBack }: Props) {
  console.log("test",analysisResult)
  
    return (
        <View style={styles.container}>
           <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons  name="arrow-back" size={28} color="black"/>
           </TouchableOpacity>

           {capturedImage && (
            <Image source={{ uri: capturedImage }} style={styles.imagePreview} />
          )}
          
          <ScrollView>
            {/* Künstler */}
            <Text>Artist</Text>
            <Text>{analysisResult.artist_info.name}</Text>
            <Text>Biography</Text>
            <Text>{analysisResult.artist_info.biography}</Text>
            <Text>Style</Text>
            <Text>{analysisResult.artist_info.artistic_style}</Text>
        
            {/* Werk */}
            <Text>Artwork {analysisResult.artwork_analysis.title}</Text>
            <Text>{analysisResult.artwork_analysis.title}</Text>
            <Text>Description {analysisResult.artwork_analysis.visual_description}</Text>
            <Text>{analysisResult.artwork_analysis.visual_description}</Text>
            <Text>Interpretation</Text>
            <Text>{analysisResult.artwork_analysis.interpretation}</Text>
        
            {/* Historischer Kontext */}
            <Text>Art Movement</Text>
            <Text>{analysisResult.historical_context.art_movement}</Text>
            <Text>Key Traits</Text>
            <Text>{analysisResult.historical_context.key_traits}</Text>
        
            {/* Ähnliche Werke */}
            <Text>Similar Works</Text>
            {analysisResult.similar_artworks.map((work: any, index: number) => (
              <Text key={index}>- {work.title} von {work.artist} ({work.year})</Text>
            ))}
          </ScrollView>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  content: {
    marginTop: 60,
  },
  heading: {
    fontSize: 24,
    color: 'white',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  label: {
    color: '#aaa',
    fontSize: 16,
    marginTop: 10,
  },
  value: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  imagePreview: {
  width: '100%',
  height: 300,
  resizeMode: 'contain',
  marginBottom: 20,
}
});