import { useState, useEffect } from 'react';
import rawData from '../assets/Month-2025-06.json';

// Typdefinition für rohes JSON-Objekt
export interface RawLocation {
  id: string;
  title?: string;
  latitude: number;
  longitude: number;
  city_id: string;
  artist1_title?: string;
  status: string;
  [key: string]: any;
}

// Typdefinition für bereinigte Marker
export interface LocationMarker {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  city: string;
  artist: string;
}

const locationsRaw = rawData as RawLocation[];

export default function useLocations() {
  const [locations, setLocations] = useState<LocationMarker[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const mapped = locationsRaw
        .filter(item => item.status === 'active' && item.latitude && item.longitude)
        .map(item => ({
          id: item.id,
          title: item.title || 'Untitled',
          latitude: item.latitude,
          longitude: item.longitude,
          city: item.city_id,
          artist: item.artist1_title || 'Unbekannt'
        }));

      setLocations(mapped);
    } catch (err) {
      setError('Fehler beim Verarbeiten der Standortdaten.');
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  return { locations, isLoading, error };
}
