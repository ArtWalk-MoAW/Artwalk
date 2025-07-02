import { useLocalSearchParams, useRouter } from 'expo-router';
import AudioPlayer from '@/components/AudioPlayer'; // ggf. Pfad anpassen
import React from 'react';



export default function AudioPlayerScreen() {
  const router = useRouter();
  const { title, imageUri, audioUri, artistName } = useLocalSearchParams();


  return (
  <AudioPlayer
    title={typeof title === 'string' ? title : 'Audioguide'}
    imageUri={typeof imageUri === 'string' ? imageUri : undefined}
    audioUri={typeof audioUri === 'string' ? audioUri : ''}
    artistName={typeof artistName === 'string' ? artistName : 'Unbekannter Künstler'}
    onBack={() => router.back()}
  />
  );
}
