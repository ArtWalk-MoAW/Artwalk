import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useUserLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
    
          if (status !== 'granted') {
            setErrorMsg('Standortberechtigung nicht erteilt');
            return;
          }
    
          const currentLocation = await Location.getCurrentPositionAsync({});
          setLocation(currentLocation);
    
          console.log('📍 Standortdaten:', currentLocation.coords);
        })();
      }, []);
    
      return { location, errorMsg };
}