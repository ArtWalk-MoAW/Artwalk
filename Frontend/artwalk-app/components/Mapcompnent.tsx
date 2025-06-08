import React, { useRef, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView from 'react-native-maps';
import useUserLocation from '../hooks/useLiveLocation';
import data from '../assets/Month-2025-06.json';
import LocationMarker from './LocationMarker';

export default function MapScreen() {
  const { location } = useUserLocation();
  const mapRef = useRef<MapView>(null);


  const [initialCentered, setInitialCentered] = useState(false);

  useEffect(() => {
    if (location && mapRef.current && !initialCentered) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });

      setInitialCentered(true); 
    }
  }, [location, initialCentered]);

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        showsUserLocation={true}
        showsMyLocationButton={true}
        
      >
        {data.map((item) => (
          <LocationMarker
            key={item.id}
            id={item.id}
            title={item.title}
            latitude={parseFloat(item.latitude)}
            longitude={parseFloat(item.longitude)}
            address={item.address}
            
          />
        ))}
      </MapView>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});