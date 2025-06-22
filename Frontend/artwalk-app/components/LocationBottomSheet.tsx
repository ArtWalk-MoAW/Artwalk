import React, {
  useRef,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useState,
} from 'react';
import {
  Text,
  StyleSheet,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Alert,
} from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { Ionicons } from '@expo/vector-icons';

export type LocationData = {
  title: string;
  address: string;
  description: string;
  image: string;
};

export type LocationBottomSheetRef = {
  open: (data: LocationData) => void;
};

type Props = {
  onSave?: (location: LocationData) => void;
};

const LocationBottomSheet = forwardRef<LocationBottomSheetRef, Props>(
  ({ onSave }, ref) => {
    const sheetRef = useRef<BottomSheet>(null);
    const snapPoints = useMemo(() => ['30%', '50%', '70%'], []);
    const [location, setLocation] = useState<LocationData | null>(null);
    const [saved, setSaved] = useState(false);

    useImperativeHandle(ref, () => ({
      open: (data: LocationData) => {
        setLocation(data);
        setSaved(false); // zurücksetzen wenn neue Location kommt
        sheetRef.current?.snapToIndex(0);
      },
    }));

    const handleSave = () => {
      if (location && onSave && !saved) {
        onSave(location);
        setSaved(true);
        Alert.alert('Gespeichert', `${location.title} wurde gespeichert.`);
      }
    };

    return (
      <BottomSheet
        ref={sheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
      >
        <BottomSheetView style={styles.content}>
          <ScrollView>
            {location?.image && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: location.image }} style={styles.image} />
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                  <Ionicons
                    name={saved ? 'bookmark' : 'bookmark-outline'}
                    size={30}
                    color="#1D0C02"
                  />
                </TouchableOpacity>
              </View>
            )}
            <Text style={styles.title}>{location?.title}</Text>
            <Text style={styles.label}>Location</Text>
            <Text style={styles.text}>{location?.address}</Text>
            <Text style={styles.label}>Description</Text>
            <Text style={styles.text}>{location?.description}</Text>
          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    );
  }
);

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
  },
  saveButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    borderRadius: 20,
    padding: 6,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 35,
    marginBottom: 10,
    fontFamily: 'InstrumentSerif-Regular',
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold',
    fontFamily: 'InstrumentSans-Bold',
    fontSize: 15,
  },
  text: {
    marginBottom: 8,
    fontFamily: 'InstrumentSans',
    fontSize: 15,
    color: '#444',
  },
});

export default LocationBottomSheet;





