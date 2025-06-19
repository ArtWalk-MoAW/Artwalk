from crewai.tools import BaseTool
import requests

class AudioGeneratorTool(BaseTool):
    name: str = "AudioGenerator"
    description: str = "Wandelt deutschen Text über externen TTS-Service in MP3 um."

    def _run(self, text: str) -> str:
        try:
            response = requests.post("http://tts:5005/generate", json={"text": text})
            data = response.json()
            return data.get("audio_path", "Fehler: Keine Datei generiert")
        except Exception as e:
            return f"Fehler bei Anfrage: {e}"
