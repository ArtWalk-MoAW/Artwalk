import os
import json
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import requests
from classify_image.src.classify_image.main import run_crew_on_image
from detail_agent.src.detail_agent.main import run_detail_page
from App.route_planner.src.route_planner.planner_crew import plan_route
from storyaudio.src.storyaudio.crew import StoryAudioCrew
import shutil
from fastapi import Request
import uuid
from storyaudio.src.storyaudio.main import run_story_audio_from_json
from dotenv import load_dotenv
load_dotenv()

print("✅ Backend nutzt IP:", os.getenv("EXPO_PUBLIC_LOCAL_BASE_IP"))


# Ordner anlegen, bevor StaticFiles gemountet wird
os.makedirs("/app/shared-data/audio", exist_ok=True)

print("✅ MAIN.PY WIRD AUSGEFÜHRT")

app = FastAPI(title="ArtWalk Mini API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # für Entwicklung offen, im Prod besser einschränken
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RouteRequest(BaseModel):
    district: str
    max_minutes: int
    num_stops: int
    styles: list[str]

class Exhibition(BaseModel):
    id: str
    title: str
    artist: str
    latitude: float
    longitude: float
    address: str
    description: Optional[str] = ""
    image: Optional[str] = ""
    opening_hours: Optional[str] = "immer zugänglich"

class ArtJsonInput(BaseModel):
    artist_info: dict
    artwork_analysis: dict
    historical_context: dict
    similar_artworks: list

def load_exhibitions():
    with open("/app/data/munich_example_with_image_url.json", "r", encoding="utf-8") as f:
        data = json.load(f)

    return [
        Exhibition(
            id=item["id"],
            title=item.get("title", ""),
            artist=item.get("artist1_title", "Unbekannt"),
            latitude=float(item["latitude"]),
            longitude=float(item["longitude"]),
            address=item.get("address", ""),
            description="",
            image="https://streetartcities.com/images/" + item["id"] + ".jpg",
            opening_hours="jederzeit zugänglich"
        )
        for item in data
    ]

@app.get("/artwalk/ping", tags=["Test"])
def ping():
    return {"message": "ArtWalk Agent is alive!"}

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{image.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # 1. Step: Run image Classifier crew
    result_json = run_crew_on_image(file_path)

    # 2. Step: Run Detail Agent crew
    detailinfo_result = run_detail_page(
        artist=result_json["artist"],
        artwork=result_json["artwork"],
        description=result_json["description"]
    )

    return detailinfo_result

class CommandRequest(BaseModel):
    command: str

@app.post("/run", tags=["Application"])
def run_command(request: CommandRequest):
    command = request.command
    if command == "log":
        print("Logging from ArtWalk Agent...")
        return {"message": "Logged to terminal from ArtWalk Agent."}
    elif command == "execute":
        return {"message": "Simulated ArtWalk execution started."}
    else:
        return {"message": f"Unknown command: {command}!"}

@app.get("/get-exhibitions")
def get_exhibitions():
    file_path = "/app/data/munich_example_with_image_url.json"
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data

@app.post("/route")
def generate_route(request: RouteRequest):
    result = plan_route(
        selected_district=request.district,
        max_minutes=request.max_minutes,
        num_stops=request.num_stops,
        with_description_only=True,
        preferred_styles=request.styles
    )
    return {"route": result}

@app.get("/get-Artreport")
def get_details_art():
    path = Path("/app/shared-data/final_art_report.json")
    run_story_audio_from_json(path)

    if not path.exists():
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    
    try:
        with path.open("r", encoding="utf-8") as f:
            data = json.load(f)
        return JSONResponse(content=data, status_code=200)
    except json.JSONDecodeError:
        return JSONResponse(content={"error": "Invalid JSON format in file"}, status_code=500)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

@app.post("/generate-story", tags=["Story Agent"])
def generate_story():
    path = Path("/app/final_art_report.json")

    if not path.exists():
        return JSONResponse(content={"error": "Art Report not found"}, status_code=404)

    try:
        with path.open("r", encoding="utf-8") as f:
            art_report = json.load(f)

        # Debug-Ausgabe Input JSON
        print("DEBUG Art Report Input an StoryAudioCrew:", json.dumps(art_report, indent=2, ensure_ascii=False))

        result = StoryAudioCrew().crew().kickoff(inputs={"art_json": art_report})

        # Debug-Ausgabe Ergebnis von StoryAudioCrew
        print("DEBUG StoryAudioCrew Ergebnis:", result)

        # Ergebnis speichern für den TTS-Endpoint
        with open("/app/shared-data/story_output.json", "w", encoding="utf-8") as f:
            json.dump({"storyText": str(result)}, f, indent=2, ensure_ascii=False)

        return {"storyText": str(result)}

    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)




@app.post("/send-to-tts")
async def send_story_to_tts(request: Request):
    try:
        data = await request.json()
        story_text = (data.get("storyText") or "").replace('\n', ' ').strip().strip('"')
        artwork_id = data.get("artworkId", "").strip()

        print(f"➡️ Eingehender TTS-Request für ID: {artwork_id}")

        # ⛔ Überprüfungen
        if not story_text or len(story_text) < 10:
            return JSONResponse(content={"error": "❌ Kein gültiger storyText übergeben"}, status_code=400)

        if not artwork_id or artwork_id == "untitled":
            return JSONResponse(content={"error": "❌ Ungültige artworkId"}, status_code=400)

        filename = f"output_{artwork_id}.mp3"
        audio_path = f"/app/shared-data/audio/{filename}"
        base_ip = os.getenv("EXPO_PUBLIC_LOCAL_BASE_IP", "localhost")
        audio_url = f"http://{base_ip}:8000/audio/{filename}"

        # ✅ Datei existiert schon → zurückgeben
        if os.path.exists(audio_path) and os.path.getsize(audio_path) > 1024:
            print(f"🟡 MP3 {filename} existiert bereits – Skip TTS.")
            return {
                "message": "Audioguide bereits vorhanden",
                "artworkId": artwork_id,
                "url": audio_url
            }

        print(f"🎙 Generiere neue MP3 für {artwork_id}...")

        # 🧠 TTS-Service aufrufen mit ID
        tts_url = "http://tts:5005/tts"
        response = requests.post(tts_url, json={
            "text": story_text,
            "artworkId": artwork_id
        })

        if response.status_code != 200:
            return JSONResponse(content={"error": "TTS-Service Fehler", "details": response.text}, status_code=response.status_code)

        try:
            response_json = response.json()
            if "audio_url" in response_json:
                audio_url = response_json["audio_url"]
            else:
                # Fallback falls TTS-Response kein JSON zurückgibt
                with open(audio_path, "wb") as f:
                    f.write(response.content)
        except Exception:
            # Wenn keine JSON-Antwort, trotzdem speichern
            with open(audio_path, "wb") as f:
                f.write(response.content)

        return {
            "message": "✅ Audioguide erstellt",
            "artworkId": artwork_id,
            "url": audio_url
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500)





# Mount StaticFiles zum Zugriff auf MP3-Dateien
app.mount("/audio", StaticFiles(directory="/app/shared-data/audio"), name="audio")
