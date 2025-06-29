import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { MaterialIcons } from '@expo/vector-icons';



type Props = {
  title: string;
  imageUri?: string;
  audioUri: string;
  artistName: string;
  onBack: () => void;
};

export default function AudioPlayer({ title, imageUri, audioUri, artistName, onBack }: Props) {
  const player = useAudioPlayer({ uri: audioUri });
  const status = useAudioPlayerStatus(player);

  // Debug-Output
  useEffect(() => {
    console.log("🎧 AudioPlayer mounted with URI:", audioUri);
  }, [audioUri]);

  // Autoplay wenn geladen
  useEffect(() => {
    if (status.isLoaded && !status.playing) {
      console.log("▶️ Autoplaying...");
      player.play();
    }
  }, [status.isLoaded]);

  const togglePlayPause = () => {
    if (!status.isLoaded) {
      console.warn("⚠️ Audio nicht geladen – kann nicht abspielen");
      return;
    }

    if (status.playing) {
      console.log("⏸ Pausiere");
      player.pause();
    } else {
      console.log("▶️ Starte");
      player.play();
    }
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}

      <View style={styles.playerBox}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.artistName}>{artistName}</Text>

        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={status.duration ?? 1}
          value={status.currentTime ?? 0}
          onSlidingComplete={(val) => player.seekTo(val)}
          minimumTrackTintColor="#000000"
          maximumTrackTintColor="#ccc"
          thumbTintColor="transparent"
        />

        <View style={styles.timeContainer}>
          <Text style={styles.time}>{formatTime(status.currentTime ?? 0)}</Text>
          <Text style={styles.time}>{formatTime(status.duration ?? 0)}</Text>
        </View>

        <View style={styles.controlsRow}>
          <TouchableOpacity onPress={() => player.seekTo(Math.max(0, status.currentTime - 10))}>
            <MaterialIcons name="replay-10" size={40} color="#1D0C02" />
          </TouchableOpacity>

          <TouchableOpacity onPress={togglePlayPause} style={styles.iconButton}>
            <FontAwesome name={status.playing ? 'pause' : 'play'} size={30} color="black" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => player.seekTo(Math.min(status.duration ?? 0, status.currentTime + 10))}>
            <MaterialIcons name="forward-10" size={40} color="#1D0C02" />
          </TouchableOpacity>
        </View>

      </View>
    </View>
  );
}

const { height, width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: height * 0.5,
    resizeMode: 'cover',
  },
  playerBox: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -24,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    alignSelf: 'flex-start',
    color: '#1D0C02',
    fontFamily: 'InstrumentSerif-Regular',
  },
  artistName: {
    fontSize: 18,
    fontStyle: 'italic',
    alignSelf: 'flex-start',
    marginBottom: 20,
    fontFamily: 'InstrumentSans-Regular',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  time: {
    fontSize: 14,
    color: '#1D0C02',
  },
  playButton: {
    backgroundColor: '#1D0C02',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
  },

  controlsRow: {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  marginTop: 30,
  width: '100%',
  },

  iconButton: {
  backgroundColor: 'transparent',
  padding: 16,
  borderRadius: 50,
  marginHorizontal: 20,
},



});
