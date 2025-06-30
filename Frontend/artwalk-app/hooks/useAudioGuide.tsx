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
      // 📥 1. Lade storyText vom Backend (GET)
      const storyRes = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/story-output/${artworkId}`);
      const storyData = await storyRes.json();

      if (!storyRes.ok || !storyData.storyText || storyData.storyText.length < 10) {
        throw new Error(storyData.error || "Fehler beim Laden des Audiotexts.");
      }

      // 🔊 2. Sende an TTS
      const ttsRes = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/send-to-tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyText: storyData.storyText, artworkId })
      });

      const ttsData = await ttsRes.json();
      if (!ttsRes.ok || !ttsData.url) {
        throw new Error(ttsData.error || 'Fehler beim TTS-Service');
      }

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
