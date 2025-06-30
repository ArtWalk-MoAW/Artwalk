import { useState } from 'react';

const audioCache: Record<string, string> = {};

export function useAudioGuide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateAudio(onSuccess?: (url: string) => void, artworkId?: string) {
    if (!artworkId || artworkId.trim() === '' || artworkId === 'untitled') {
      console.warn("❗ Ungültige artworkId – kein API-Aufruf");
      setError("Ungültige Artwork-ID – Audioguide konnte nicht generiert werden.");
      return;
    }

    if (audioCache[artworkId]) {
      onSuccess?.(audioCache[artworkId]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 🖼️ 1. Story generieren
      const genResponse = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/generate-story`, {
        method: 'POST',
      });
      const genData = await genResponse.json();

      if (!genResponse.ok || !genData.storyText) {
        console.warn("⚠️ Fehlerhafte Story-Response:", genData);
        throw new Error(genData.error || 'Fehler beim Story-Generieren');
      }

      if (genData.storyText.trim().length < 10) {
        console.warn("⚠️ Ungültiger storyText:", genData.storyText);
        throw new Error("Fehler: Leerer oder unbrauchbarer storyText.");
      }

      console.log("📝 Generierter storyText:", genData.storyText);
      console.log("🎯 Starte Audioerzeugung mit artworkId:", artworkId);

      // 🔉 2. An TTS senden
      const ttsResponse = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/send-to-tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storyText: genData.storyText,
          artworkId
        })
      });

      const ttsData = await ttsResponse.json();
      if (!ttsResponse.ok || !ttsData.url) {
        console.warn("❌ Fehlerhafte TTS-Antwort:", ttsData);
        throw new Error(ttsData.error || 'Fehler beim TTS-Service');
      }

      console.log("✅ TTS Response URL:", ttsData.url);


      audioCache[artworkId] = ttsData.url;
      onSuccess?.(ttsData.url);
    } catch (e: any) {
      console.error("🚨 Fehler bei Audiogenerierung:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, generateAudio };
}