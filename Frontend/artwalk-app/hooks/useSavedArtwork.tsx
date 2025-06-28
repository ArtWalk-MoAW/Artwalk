import { useState, useEffect } from 'react';
import { getSavedArtworks, saveArtwork, deleteArtwork } from '../services/artworkService';

export const useSavedArtwork = (
  title: string,
  location: string,
  description: string,
  img: string
) => {
  const [isSaved, setIsSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const checkIfSaved = async () => {
      try {
        const data = await getSavedArtworks();
        const match = data.find(
          (item: any) =>
            item.title === title &&
            item.location === location &&
            item.description === description
        );

        if (match) {
          setIsSaved(true);
          setSavedId(match.id);
        } else {
          setIsSaved(false);
          setSavedId(null);
        }
      } catch (error) {
        console.error('Fehler beim Laden gespeicherter Werke:', error);
      }
    };

    checkIfSaved();
  }, [title, location, description]);

  const handleSave = async () => {
    try {
      const result = await saveArtwork({ title, location, description, img });
      setIsSaved(true);
      setSavedId(result.id);
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async () => {
    if (!savedId) throw new Error('Keine ID vorhanden');
    try {
      await deleteArtwork(savedId);
      setIsSaved(false);
      setSavedId(null);
    } catch (error) {
      throw error;
    }
  };

  return {
    isSaved,
    savedId,
    handleSave,
    handleDelete,
  };
};

