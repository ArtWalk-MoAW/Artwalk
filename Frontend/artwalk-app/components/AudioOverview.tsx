import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

type AudioOverviewProps = {
  title: string;
  duration: string;
  transcript: string;
  onPlay: () => void;
  onBack: () => void;
};

export default function AudioOverview({ title, duration, transcript, onPlay, onBack }: AudioOverviewProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={{ color: 'blue' }}>Zurück</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.duration}>Dauer: {duration}</Text>

      <ScrollView style={styles.transcriptContainer}>
        <Text style={styles.transcript}>{transcript}</Text>
      </ScrollView>

      <TouchableOpacity style={styles.playButton} onPress={onPlay}>
        <Text style={styles.playButtonText}>Wiedergabe</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backButton: { marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 10 },
  duration: { fontSize: 16, marginBottom: 20 },
  transcriptContainer: { flex: 1, marginBottom: 20 },
  transcript: { fontSize: 16, lineHeight: 22 },
  playButton: { backgroundColor: '#F95636', padding: 15, borderRadius: 8, alignItems: 'center' },
  playButtonText: { color: '#fff', fontSize: 18 },
});
