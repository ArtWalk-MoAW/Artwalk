import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';

type Props = {
  onGenerate: () => void;
  loading: boolean;
};

export default function AudioGuideButton({ onGenerate, loading }: Props) {
  return (
    <TouchableOpacity onPress={onGenerate} disabled={loading} style={styles.button}>
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Audio Guide generieren</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    backgroundColor: '#F95636',
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 10,
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
});
