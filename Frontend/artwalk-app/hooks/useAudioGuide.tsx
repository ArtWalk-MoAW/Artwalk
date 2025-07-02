import { useState } from 'react';

const audioCache: Record<string, string> = {};

export function useAudioGuide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateAudio(): Promise<string | null> {
    setLoading(true);
    setError(null);

    try {
      const ttsRes = await fetch(`http://${process.env.EXPO_PUBLIC_LOCAL_BASE_IP}:8000/send-to-tts`, {
        method: 'POST',
      });

      const ttsData = await ttsRes.json();
      if (!ttsRes.ok || !ttsData.url) {
        throw new Error(ttsData.error || '❌ Fehler beim TTS-Service');
      }

      return ttsData.url;
    } catch (e: any) {
      console.error("🚨 Fehler bei Audiogenerierung:", e);
      setError(e.message || "Unbekannter Fehler");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, generateAudio };
}
