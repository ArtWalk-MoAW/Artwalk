import { useState, useEffect } from 'react';
import * as Location from 'expo-location';

export default function useUserLocation() {
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    let subscriber: Location.LocationSubscription | null = null;

    const stopTracking = () => {
        if (subscriber) {
          subscriber.remove();
          console.log('📴 Tracking manuell gestoppt');
        }
    };

    useEffect(() => {
        (async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
    
          if (status !== 'granted') {
            setErrorMsg('Standortberechtigung nicht erteilt');
            return;
          }

          try {
            subscriber = await Location.watchPositionAsync({
                accuracy: Location.Accuracy.Highest,
                timeInterval: 5000,
                distanceInterval: 5, 
            },
            (newlocation)=> {
                setLocation(newlocation);
                console.log('📍 Standortdaten:', newlocation.coords);
            }
            );
          } catch (err) {
                console.log('Standortberechtigung:', status);
          }
        })();
        return () => {
            if (subscriber) {
                subscriber.remove();
                console.log('Live-Tracking gestoppt')
            }
        };
      }, []);
    
      return { location, errorMsg,stopTracking};
}