import React from 'react';
import { View, Text } from 'react-native';
import useUserLocation from '../../hooks/useUserLocation';

export default function LocationDebugScreen() {
  const { location, errorMsg } = useUserLocation();

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!location) {
    return <Text>Lade Standortdaten...</Text>;
  }

  return (
    <View>
      <Text>Latitude: {location.coords.latitude}</Text>
      <Text>Longitude: {location.coords.longitude}</Text>
    </View>
  );
}
