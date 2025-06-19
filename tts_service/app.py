from flask import Flask, request, jsonify
from TTS.api import TTS
import os
import uuid

app = Flask(__name__)
tts = TTS("tts_models/de/thorsten/tacotron2-DDC", progress_bar=False, gpu=False)

@app.route("/generate", methods=["POST"])
def generate_audio():
    data = request.json
    text = data.get("text")

    if not text:
        return jsonify({"error": "Kein Text angegeben"}), 400

    output_dir = "static/audio"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"output_{uuid.uuid4()}.mp3"
    file_path = os.path.join(output_dir, filename)

    try:
        tts.tts_to_file(text=text, file_path=file_path)
        return jsonify({"audio_path": f"/audio/{filename}"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/audio/<filename>")
def serve_audio(filename):
    return app.send_static_file(f"audio/{filename}")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
