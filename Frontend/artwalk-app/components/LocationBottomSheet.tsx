import React, {
  useRef,
  useImperativeHandle,
  useMemo,
  forwardRef,
  useState,
} from 'react';
import { Text, StyleSheet, Image, ScrollView,View } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import SaveArtwork from './saveArtwork';

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
          
          <View style={styles.imageContainer}>
            {location?.image && (
                <Image source={{ uri: location.image }} style={styles.image} />  
            )}
            <SaveArtwork title={ location?.title || "undefined"} location= {location?.address || "undefined"} description={location?.description || "undefined"} img={ "undefined"}/>
          </View>
          
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
    fontSize: 35,
    marginBottom: 10,
    fontFamily: "InstrumentSerif-Regular",
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
    fontFamily: "InstrumentSans",
    fontSize: 15,
    color: '#444',
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 15,
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 15,
  },
});

export default LocationBottomSheet;



