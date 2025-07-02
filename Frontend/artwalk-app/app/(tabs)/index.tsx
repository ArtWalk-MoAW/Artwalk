import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import MapView from 'react-native-maps';
import LocationBottomSheet, { LocationBottomSheetRef } from '@/components/LocationBottomSheet';
import LocationMarker from '@/components/LocationMarker';
import useUserLocation from '@/hooks/useLiveLocation';
import { useLocalSearchParams } from 'expo-router';

export default function MapScreen() {
  const { location, errorMsg } = useUserLocation();
  const { artwork } = useLocalSearchParams();
  const bottomSheetRef = useRef<LocationBottomSheetRef>(null);
  const mapRef = useRef<MapView>(null);
  const [exhibitions, setExhibitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fallbackRegion = {
    latitude: 48.137154,
    longitude: 11.576124,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/get-exhibitions`);
        const data = await res.json();
        setExhibitions(data);
      } catch (err) {
        console.error("❌ Fehler beim Laden der Marker:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExhibitions();
  }, []);

  useEffect(() => {
    if (artwork && typeof artwork === 'string') {
      try {
        const parsed = JSON.parse(artwork);

        if (parsed.latitude && parsed.longitude) {
          mapRef.current?.animateToRegion(
            {
              latitude: parsed.latitude,
              longitude: parsed.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            800
          );
        }

        bottomSheetRef.current?.open(parsed);

      } catch (e) {
        console.warn("⚠️ Fehler beim Parsen von Artwork:", artwork);
      }
    }
  }, [artwork]);

  if (errorMsg) return <Text style={styles.error}>{errorMsg}</Text>;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#DB4F00" />
        <Text>Standort & Marker werden geladen...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation
        initialRegion={
          !artwork && location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }
            : fallbackRegion
        }
      >
        {exhibitions.map((item) => (
          <LocationMarker
            key={item.id}
            id={item.id}
            title={item.title}
            latitude={item.latitude}
            longitude={item.longitude}
            address={item.address}
            description={item.description}
            image={item.image}
            bottomSheetRef={bottomSheetRef}
          />
        ))}
      </MapView>

      <LocationBottomSheet ref={bottomSheetRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: '100%', height: '100%' },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  error: {
    marginTop: 100,
    textAlign: 'center',
    color: 'red',
  },
});
