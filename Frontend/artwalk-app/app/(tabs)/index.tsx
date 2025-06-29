import React from 'react';
import { View, Text,StyleSheet } from 'react-native';
import useUserLocation from '../../hooks/useLiveLocation';
import MapScreen from '@/components/Mapcompnent';





export default function LocationDebugScreen() {
  const { location, errorMsg } = useUserLocation();

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Lade Standortdaten...</Text>;
  }

  return (
     <View style={styles.container}>
      
      <MapScreen/>
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

