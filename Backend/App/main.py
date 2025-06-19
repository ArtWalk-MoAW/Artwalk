from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from classify_image.src.classify_image.main import run_crew_on_image
from detail_agent.src.detail_agent.main import run_detail_page
from App.route_planner.src.route_planner.planner_crew import plan_route

from pydantic import BaseModel
from typing import List, Optional
import json
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil

print("✅ MAIN.PY WIRD AUSGEFÜHRT")


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

    #1. Step: Run image Classifier crew
    result_json = run_crew_on_image(file_path)

    #2. Step: Run Detail Agent crew
    run_detail_page(
        artist=result_json["artist"],
        artwork=result_json["artwork"],
        description=result_json["description"]
    )


    

    
    return JSONResponse(content={"message": "Image received"}, status_code=200)


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