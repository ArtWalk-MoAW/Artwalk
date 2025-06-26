// Beispiel in useSavedArtwork.ts
import { useEffect, useState } from 'react';
import { LOCAL_BASE_IP } from '@env';

export function useSavedArtwork(title: string, location: string, description: string) {
  const [isSaved, setIsSaved] = useState(false);

  const checkIfSaved = async () => {
    try {
      const res = await fetch(`http://${LOCAL_BASE_IP}:8000/myartworks`);
      const data = await res.json();

      const match = data.find(
        (item: any) =>
          item.title === title &&
          item.location === location &&
          item.description === description
      );

      setIsSaved(!!match);
    } catch (err) {
      console.error('Fehler beim Abrufen gespeicherter Werke:', err);
    }
  };

  useEffect(() => {
    checkIfSaved();
  }, [title, location, description]);

  return { isSaved, refresh: checkIfSaved };
}
