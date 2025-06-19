from crewai.tools import BaseTool
from TTS.api import TTS
import os
import uuid



class AudioGeneratorTool(BaseTool):
    name: str = "AudioGenerator"
    description: str = "Wandelt einen deutschen Text in eine MP3-Datei um."

    def _run(self, text: str) -> str:
        output_dir = "static/audio"
        os.makedirs(output_dir, exist_ok=True)

        filename = f"output_{uuid.uuid4()}.mp3"
        output_path = os.path.join(output_dir, filename)

        try:
            tts = TTS("tts_models/de/thorsten/tacotron2-DDC", progress_bar=False, gpu=False)
            tts.tts_to_file(text=text, file_path=output_path)
            return f"/audio/{filename}"
        except Exception as e:
            return f"❌ Fehler: {e}"