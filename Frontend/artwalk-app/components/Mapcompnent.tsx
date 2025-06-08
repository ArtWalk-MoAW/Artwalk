import  React, { useRef, useEffect } from 'react';
import MapView,{ Marker }  from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import useUserLocation from '../hooks/useLiveLocation';

export default function MapScreen() {
  const { location, errorMsg } = useUserLocation();
  const mapRef = useRef<MapView>(null);



  useEffect(() => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.0005,
      });
    }
   
  }, [location]);




  return (
    <View style={styles.container}>
      <MapView 
      ref={mapRef}
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
      />
   
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