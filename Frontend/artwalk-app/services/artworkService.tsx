const BASE_URL = `http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000`;

export const getSavedArtworks = async () => {
  const res = await fetch(`${BASE_URL}/myartworks`);
  if (!res.ok) throw new Error("Fehler beim Abrufen gespeicherter Werke");
  return await res.json();
};

export const saveArtwork = async (artwork: {
  title: string;
  location: string;
  description: string;
  img: string;
}) => {
  const res = await fetch(`${BASE_URL}/save-artwork`, {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(artwork),
  });
  if (!res.ok) throw new Error("Fehler beim Speichern");
  return await res.json();
};

export const deleteArtwork = async (id: string) => {
  const res = await fetch(`${BASE_URL}/delete/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error("Fehler beim Löschen");
};

