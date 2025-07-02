from flask import Flask, request, jsonify, send_from_directory
from TTS.api import TTS
import os

app = Flask(__name__)
tts = TTS("tts_models/en/ljspeech/tacotron2-DDC", progress_bar=False, gpu=False)

@app.route("/tts", methods=["POST"])
def generate_audio():
    data = request.json
    text = data.get("text")
    artwork_id = data.get("artworkId")  

    if not text or not artwork_id:
        return jsonify({"error": "Text oder artworkId fehlt"}), 400

    output_dir = "/app/shared-data/audio"
    os.makedirs(output_dir, exist_ok=True)

    filename = f"output_{artwork_id}.mp3"
    file_path = os.path.join(output_dir, filename)

    try:
        print(f"📥 Generiere Audio für ID: {artwork_id}")
        tts.tts_to_file(text=text, file_path=file_path)

        base_ip = os.getenv("EXPO_PUBLIC_LOCAL_BASE_IP", "localhost")
        return jsonify({"audio_url": f"http://{base_ip}:8000/audio/{filename}"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/audio/<filename>")
def serve_audio(filename):
    return send_from_directory("/app/shared-data/audio", filename)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5005)
