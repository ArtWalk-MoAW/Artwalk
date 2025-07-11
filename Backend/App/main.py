import os
import json
import shutil
from pathlib import Path
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import requests
from dotenv import load_dotenv

from storyaudio.src.storyaudio.main import run_story_audio
from classify_image.src.classify_image.main import run_crew_on_image
from detail_agent.src.detail_agent.main import run_detail_page
from App.route_planner.src.route_planner.planner_crew import plan_route
import uuid

load_dotenv()
print("✅ Backend nutzt IP:", os.getenv("EXPO_PUBLIC_LOCAL_BASE_IP"))

os.makedirs("/app/shared-data/audio", exist_ok=True)

app = FastAPI(title="ArtWalk Mini API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RouteRequest(BaseModel):
    district: str
    max_minutes: int
    num_stops: int
    styles: list[str]

class ArtworkRequest(BaseModel):
    title:str
    location: str
    description: str
    img:str

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

@app.get("/artwalk/ping", tags=["Test"])
def ping():
    return {"message": "ArtWalk Agent is alive!"}

@app.post("/upload")
async def upload_image(image: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/{image.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    # classify the image using the crew
    result_json = run_crew_on_image(file_path)
    detailinfo_result = run_detail_page(
        artist=result_json["artist"],
        artwork=result_json["artwork"],
        description=result_json["description"]
    )

    if hasattr(detailinfo_result, "raw") and detailinfo_result.raw:
        try:
            detailinfo_result_dict = json.loads(detailinfo_result.raw)
            print("📦 Analyse geladen:", detailinfo_result_dict.get("artwork_analysis", {}))
        except json.JSONDecodeError:
            return JSONResponse(content={"error": "❌ Fehler beim Parsen von detailinfo.raw"}, status_code=500)
    else:
        return JSONResponse(content={"error": "❌ Kein gültiges Analyseobjekt erhalten."}, status_code=500)

    title = detailinfo_result_dict.get("artwork_analysis", {}).get("title", "").strip()
    print("🎨 Titel im JSON:", title)

    if not title:
        return JSONResponse(
            content={"error": "❌ Kein Titel erkannt – kann keine artworkId generieren."},
            status_code=400
        )

    artwork_id = (
        title.lower()
        .replace(" ", "_")
        .replace(".", "")
        .replace(",", "")
        .replace(":", "")
        .replace("'", "")
        .replace('"', "")
    )
    detailinfo_result_dict["artworkId"] = artwork_id

    final_report_path = Path("/app/final_art_report.json")
    with final_report_path.open("w", encoding="utf-8") as f:
        json.dump(detailinfo_result_dict, f, indent=2, ensure_ascii=False)

    # Storyaudio Agent
    story_result = run_story_audio(detailinfo_result_dict)
    story_result["artworkId"] = artwork_id

    return {
        "analysis": detailinfo_result_dict,
        "artworkId": artwork_id,
        "storyText": story_result["storyText"]
    }

@app.post("/send-to-tts")
def send_story_to_tts_direct():
    story_path = Path("/app/shared-data/story_output.json")
    if not story_path.exists():
        return JSONResponse(content={"error": "❌ Keine Story gefunden"}, status_code=404)

    try:
        with story_path.open("r", encoding="utf-8") as f:
            data = json.load(f)

        story_text = str(data.get("storyText", "")).replace("\n", " ").strip().strip('"')
        artwork_id = data.get("artworkId", "").strip()

        if not story_text or len(story_text) < 10:
            return JSONResponse(content={"error": "❌ Ungültiger storyText"}, status_code=400)
        if not artwork_id or artwork_id == "untitled":
            return JSONResponse(content={"error": "❌ Ungültige artworkId"}, status_code=400)

        filename = f"output_{artwork_id}.mp3"
        audio_path = f"/app/shared-data/audio/{filename}"
        base_ip = os.getenv("EXPO_PUBLIC_LOCAL_BASE_IP", "localhost")
        audio_url = f"http://{base_ip}:8000/audio/{filename}"

        if os.path.exists(audio_path) and os.path.getsize(audio_path) > 1024:
            return {
                "message": "🟡 Audioguide bereits vorhanden",
                "artworkId": artwork_id,
                "url": audio_url
            }

        print(f"🎙 Erzeuge MP3 für {artwork_id}...")

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
                with open(audio_path, "wb") as f:
                    f.write(response.content)
        except Exception:
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


@app.get("/get-Artreport")
def get_details_art():
    path = Path("/app/final_art_report.json")
    if not path.exists():
        return JSONResponse(content={"error": "File not found"}, status_code=404)
    try:
        with path.open("r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=500)

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

@app.get("/get-exhibitions")
def get_exhibitions():
    file_path = "/app/data/munich_example_with_image_url.json"
    with open(file_path, "r", encoding="utf-8") as f:
        return json.load(f)

app.mount("/audio", StaticFiles(directory="/app/shared-data/audio"), name="audio")
    

DATA_FILE = "/app/data/savedArtwork.json"


@app.post("/save-artwork")
async def save_artwork(request:ArtworkRequest):
    new_data = request.model_dump()
    print(new_data)
    new_data["id"] = str(uuid.uuid4())

    data = []

    if os.path.exists(DATA_FILE):
        with open(DATA_FILE,"r") as f:
            data= json.load(f)
    
    data.append(new_data)

    with open(DATA_FILE, "w") as f:
        json.dump(data, f)
    
    return {"status": "success", "id": new_data["id"]}

@app.get("/myartworks")
def get_myartworks():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return []

@app.delete("/delete/{trip_id}")
def delete_myart(trip_id: str):
    if not os.path.exists(DATA_FILE):
        return {"error": "No data found"}
    
    with open(DATA_FILE,"r") as f:
        data= json.load(f)
    
    data = [trip for trip in data  if trip["id"] != trip_id]

    with open(DATA_FILE,"w") as f:
        json.dump(data, f)
    
    return {"status": "deleted"}

ANALYSE_FILE = "/app/data/savedAnalyseArtwork.json"

@app.delete("/delete-analysis/{analyse_id}")
def delete_myart_analysis(analyse_id: str):
    if not os.path.exists(ANALYSE_FILE):
        return {"error": "No data found"}

    with open(ANALYSE_FILE, "r") as f:
        data = json.load(f)

    data = [item for item in data if item["id"] != analyse_id]

    with open(ANALYSE_FILE, "w") as f:
        json.dump(data, f, indent=2)

    return {"status": "deleted"}


@app.post("/save-artworkAnalyse")
async def save_artworkAnalyse(request: Request):
    new_analyse = await request.json()
    print(new_analyse)
    new_analyse["id"] = str(uuid.uuid4())

    data = []

    if os.path.exists(ANALYSE_FILE):
        with open(ANALYSE_FILE,"r") as f:
            data= json.load(f)
    
    data.append(new_analyse)

    with open(ANALYSE_FILE, "w") as f:
        json.dump(data,f)

    return {"status": "success", "id": new_analyse["id"]}

@app.get("/myartworksanalyse")
def get_myartworksanalyse():
    if os.path.exists(ANALYSE_FILE):
        with open(ANALYSE_FILE, "r") as f:
            return json.load(f)
    return []

