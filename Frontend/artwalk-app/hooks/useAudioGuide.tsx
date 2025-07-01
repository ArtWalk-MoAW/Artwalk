import { useState } from 'react';

const audioCache: Record<string, string> = {};

export function useAudioGuide() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateAudio(onSuccess?: (url: string) => void) {
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

      onSuccess?.(ttsData.url);
    } catch (e: any) {
      console.error("🚨 Fehler bei Audiogenerierung:", e);
      setError(e.message || "Unbekannter Fehler");
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, generateAudio };
}
