

export type Artwork = {
  title: string;
  location: string;
  description: string;
};

export async function saveArtwork(artwork: Artwork) {
  const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/save-artwork`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artwork),
  });

  if (!res.ok) throw new Error("Fehler beim Speichern");

  return res.json();
}

export async function getSavedArtworks(): Promise<Artwork[]> {
  const res = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/myartworks`);
  if (!res.ok) throw new Error("Fehler beim Laden");
  return res.json();
}
