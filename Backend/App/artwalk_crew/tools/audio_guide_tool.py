from crewai import Agent
from typing import ClassVar
from TTS.api import TTS

class AudioGuideAgent(Agent):
    name: ClassVar[str] = "audio_guide_agent"
    description: ClassVar[str] = "Wandelt Text in Audio um"
    role: str = "Text-zu-Sprache-Konverter"
    goal: str = "Wandelt generierten Text in eine MP3-Datei um"
    backstory: str = "Hilft Benutzern, Audioguides für Kunstwerke zu erstellen"

    def run(self, text: str) -> str:
        tts = TTS("tts_models/de/thorsten/tacotron2-DDC")
        output_file = "static/audio/output.mp3"
        tts.tts_to_file(text=text, file_path=output_file)
        return f"/audio/{output_file}"
