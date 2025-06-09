import { useEffect, useState } from 'react';

 type Exhibition = {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  address: string;
  description?: string;
  image?: string;
};

export default function useExhibitionData() {
  const [data, setData] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExhibitions = async () => {
      try {
        console.log('Fetching exhibitions...');
        const response = await fetch('http://192.168.178.65:8080/get-exhibitions');
        const json = await response.json();
        setData(json);
      } catch (error) {
        console.error('Fehler beim Laden:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchExhibitions();
  }, []);

  return { data, loading };
}

