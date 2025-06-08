import React, {
  useRef,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useState,
} from 'react';
import { Text, StyleSheet, Image, ScrollView } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

export type LocationData = {
  title: string;
  address: string;
  description: string;
  image: string;
};

export type LocationBottomSheetRef = {
  open: (data: LocationData) => void;
};

const LocationBottomSheet = forwardRef<LocationBottomSheetRef>((props, ref) => {
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['30%', '50%', '70%'], []);
  const [location, setLocation] = useState<LocationData | null>(null);

  useImperativeHandle(ref, () => ({
    open: (data: LocationData) => {
      setLocation(data);
      sheetRef.current?.snapToIndex(0);
    },
  }));

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
            <Image source={{ uri: location.image }} style={styles.image} />
          )}
          <Text style={styles.title}>{location?.title}</Text>
          <Text style={styles.label}>Adresse:</Text>
          <Text style={styles.text}>{location?.address}</Text>
          <Text style={styles.label}>Beschreibung:</Text>
          <Text style={styles.text}>{location?.description}</Text>
        </ScrollView>
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  content: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 10,
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
  },
  text: {
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
  },
});

export default LocationBottomSheet;



